/**
 * Inteligentny kalendarz rezerwacji treningów personalnych.
 * Local-first + opcjonalna chmura (Supabase) + eksport do Google Calendar (ICS / link).
 */
import { supabase } from "@/integrations/supabase/client";

// ——— Typy ———

export type BookingStatus =
  | "pending" // klient zarezerwował, czeka na potwierdzenie trenera
  | "confirmed" // trener potwierdził
  | "declined" // trener odrzucił
  | "cancelled" // anulowane (klient lub trener)
  | "completed"; // odbyte

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = niedziela

/** Powtarzalna dostępność w tygodniu (np. Pn 8:00–12:00 i 16:00–20:00). */
export type WeeklySlot = {
  id: string;
  dayOfWeek: DayOfWeek;
  startMin: number; // minuty od 00:00, np. 9*60 = 540
  endMin: number;
};

/** Jednorazowe wyłączenie / dodatkowy termin (urlop, wyjątek). */
export type DateOverride = {
  id: string;
  date: string; // YYYY-MM-DD
  /** true = niedostępny cały dzień; false = własny zakres godzin */
  unavailable: boolean;
  startMin?: number;
  endMin?: number;
  note?: string;
};

export type TrainerAvailability = {
  trainerId: string;
  trainerName: string;
  /** Długość sesji w minutach */
  sessionMinutes: number;
  /** Bufor między sesjami (sprzątanie / dojazd) */
  bufferMinutes: number;
  /** Jak daleko w przód można rezerwować (dni) */
  bookAheadDays: number;
  /** Minimalny czas przed startem na rezerwację (godziny) */
  minNoticeHours: number;
  weekly: WeeklySlot[];
  overrides: DateOverride[];
  /** Miejsce domyślne */
  location?: string;
  updatedAt: string;
};

export type Booking = {
  id: string;
  trainerId: string;
  trainerName: string;
  clientId: string;
  clientName: string;
  /** YYYY-MM-DD */
  date: string;
  /** minuty od 00:00 */
  startMin: number;
  endMin: number;
  status: BookingStatus;
  note?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
  /** Czy wysłano przypomnienie dzień przed */
  reminderSent?: boolean;
  /** ID wydarzenia w Google Calendar (gdy zsynchronizowane) */
  googleEventId?: string;
};

export type BookableSlot = {
  date: string;
  startMin: number;
  endMin: number;
  label: string;
};

// ——— Storage keys ———

const AVAIL_KEY = "trainer-availability-v1";
const BOOKINGS_KEY = "trainer-bookings-v1";

// ——— Utils ———

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d!);
  dt.setDate(dt.getDate() + days);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number {
  const [h, m] = label.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function weekdayPL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y!, m! - 1, d!);
  return ["Nd", "Pon", "Wt", "Śr", "Czw", "Pt", "Sob"][dt.getDay()] ?? "";
}

export function formatDatePL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}.${String(m).padStart(2, "0")}.${y}`;
}

function dayOfWeek(iso: string): DayOfWeek {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y!, m! - 1, d!).getDay() as DayOfWeek;
}

// ——— Availability CRUD ———

export function defaultAvailability(trainerId: string, trainerName: string): TrainerAvailability {
  return {
    trainerId,
    trainerName,
    sessionMinutes: 60,
    bufferMinutes: 15,
    bookAheadDays: 28,
    minNoticeHours: 12,
    weekly: [
      // Pn–Pt 8–12 i 16–20 jako przykład
      ...([1, 2, 3, 4, 5] as DayOfWeek[]).flatMap((dow) => [
        { id: uid(), dayOfWeek: dow, startMin: 8 * 60, endMin: 12 * 60 },
        { id: uid(), dayOfWeek: dow, startMin: 16 * 60, endMin: 20 * 60 },
      ]),
    ],
    overrides: [],
    location: "",
    updatedAt: new Date().toISOString(),
  };
}

export function loadAvailability(trainerId: string): TrainerAvailability | null {
  if (typeof window === "undefined") return null;
  try {
    const all = JSON.parse(localStorage.getItem(AVAIL_KEY) || "{}") as Record<
      string,
      TrainerAvailability
    >;
    return all[trainerId] ?? null;
  } catch {
    return null;
  }
}

export function saveAvailability(a: TrainerAvailability): void {
  if (typeof window === "undefined") return;
  try {
    const all = JSON.parse(localStorage.getItem(AVAIL_KEY) || "{}") as Record<
      string,
      TrainerAvailability
    >;
    all[a.trainerId] = { ...a, updatedAt: new Date().toISOString() };
    localStorage.setItem(AVAIL_KEY, JSON.stringify(all));
  } catch {
    /* quota */
  }
}

export function listPublicTrainers(): TrainerAvailability[] {
  if (typeof window === "undefined") return [];
  try {
    const all = JSON.parse(localStorage.getItem(AVAIL_KEY) || "{}") as Record<
      string,
      TrainerAvailability
    >;
    return Object.values(all)
      .filter((a) => a.weekly.length > 0)
      .map((a) => ({
        ...a,
        trainerName: (a.trainerName || "").trim() || "Trener",
      }))
      .sort((a, b) => a.trainerName.localeCompare(b.trainerName, "pl"));
  } catch {
    return [];
  }
}

// ——— Bookings CRUD ———

function loadAllBookings(): Booking[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Booking[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAllBookings(list: Booking[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

export function loadBookingsForTrainer(trainerId: string): Booking[] {
  return loadAllBookings()
    .filter((b) => b.trainerId === trainerId)
    .sort((a, b) => (a.date + minutesToLabel(a.startMin)).localeCompare(b.date + minutesToLabel(b.startMin)));
}

export function loadBookingsForClient(clientId: string): Booking[] {
  return loadAllBookings()
    .filter((b) => b.clientId === clientId)
    .sort((a, b) => (a.date + minutesToLabel(a.startMin)).localeCompare(b.date + minutesToLabel(b.startMin)));
}

export function upsertBooking(b: Booking): Booking {
  const all = loadAllBookings();
  const idx = all.findIndex((x) => x.id === b.id);
  const next = { ...b, updatedAt: new Date().toISOString() };
  if (idx >= 0) all[idx] = next;
  else all.unshift(next);
  saveAllBookings(all);
  return next;
}

// ——— Slot generation ———

function rangesForDate(a: TrainerAvailability, date: string): { startMin: number; endMin: number }[] {
  const override = a.overrides.find((o) => o.date === date);
  if (override?.unavailable) return [];
  if (override && !override.unavailable && override.startMin != null && override.endMin != null) {
    return [{ startMin: override.startMin, endMin: override.endMin }];
  }
  const dow = dayOfWeek(date);
  return a.weekly
    .filter((w) => w.dayOfWeek === dow)
    .map((w) => ({ startMin: w.startMin, endMin: w.endMin }));
}

/**
 * Wolne sloty do rezerwacji na dany dzień (uwzględnia bufor i istniejące bookingi).
 */
export function getBookableSlots(
  a: TrainerAvailability,
  date: string,
  existing?: Booking[],
): BookableSlot[] {
  const bookings =
    existing ??
    loadBookingsForTrainer(a.trainerId).filter(
      (b) => b.date === date && (b.status === "pending" || b.status === "confirmed"),
    );

  const ranges = rangesForDate(a, date);
  const step = a.sessionMinutes;
  const buffer = a.bufferMinutes;
  const out: BookableSlot[] = [];

  for (const range of ranges) {
    for (let t = range.startMin; t + step <= range.endMin; t += step + buffer) {
      const end = t + step;
      const conflict = bookings.some(
        (b) => !(end + buffer <= b.startMin || t >= b.endMin + buffer),
      );
      if (!conflict) {
        out.push({
          date,
          startMin: t,
          endMin: end,
          label: `${minutesToLabel(t)}–${minutesToLabel(end)}`,
        });
      }
    }
  }
  return out;
}

/** Lista dni z ≥1 wolnym slotem w oknie bookAheadDays. */
export function getBookableDays(a: TrainerAvailability, from = todayISO()): string[] {
  const days: string[] = [];
  const now = new Date();
  for (let i = 0; i <= a.bookAheadDays; i++) {
    const date = addDaysISO(from, i);
    // min notice
    const slots = getBookableSlots(a, date).filter((s) => {
      const [y, m, d] = date.split("-").map(Number);
      const start = new Date(y!, m! - 1, d!, Math.floor(s.startMin / 60), s.startMin % 60);
      const hoursAhead = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
      return hoursAhead >= a.minNoticeHours;
    });
    if (slots.length) days.push(date);
  }
  return days;
}

// ——— Booking actions ———

export function createBookingRequest(input: {
  availability: TrainerAvailability;
  clientId: string;
  clientName: string;
  date: string;
  startMin: number;
  note?: string;
}): { ok: true; booking: Booking } | { ok: false; error: string } {
  const { availability: a, clientId, clientName, date, startMin, note } = input;
  const endMin = startMin + a.sessionMinutes;

  const slots = getBookableSlots(a, date);
  if (!slots.some((s) => s.startMin === startMin)) {
    return { ok: false, error: "Ten termin jest już niedostępny. Wybierz inny." };
  }

  const now = new Date();
  const [y, m, d] = date.split("-").map(Number);
  const start = new Date(y!, m! - 1, d!, Math.floor(startMin / 60), startMin % 60);
  const hoursAhead = (start.getTime() - now.getTime()) / (1000 * 60 * 60);
  if (hoursAhead < a.minNoticeHours) {
    return {
      ok: false,
      error: `Rezerwacja możliwa najwcześniej ${a.minNoticeHours} h przed treningiem.`,
    };
  }

  const booking: Booking = {
    id: uid(),
    trainerId: a.trainerId,
    trainerName: a.trainerName,
    clientId,
    clientName,
    date,
    startMin,
    endMin,
    status: "pending",
    note,
    location: a.location,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    reminderSent: false,
  };
  upsertBooking(booking);
  return { ok: true, booking };
}

export function confirmBooking(id: string): Booking | null {
  const b = loadAllBookings().find((x) => x.id === id);
  if (!b || b.status !== "pending") return null;
  return upsertBooking({ ...b, status: "confirmed" });
}

export function declineBooking(id: string): Booking | null {
  const b = loadAllBookings().find((x) => x.id === id);
  if (!b || b.status !== "pending") return null;
  return upsertBooking({ ...b, status: "declined" });
}

export function cancelBooking(id: string): Booking | null {
  const b = loadAllBookings().find((x) => x.id === id);
  if (!b || (b.status !== "pending" && b.status !== "confirmed")) return null;
  return upsertBooking({ ...b, status: "cancelled" });
}

// ——— Przypomnienia (dzień przed) ———

/** Bookingi confirmed na jutro, bez wysłanego przypomnienia. */
export function bookingsNeedingReminder(asOf = todayISO()): Booking[] {
  const tomorrow = addDaysISO(asOf, 1);
  return loadAllBookings().filter(
    (b) => b.status === "confirmed" && b.date === tomorrow && !b.reminderSent,
  );
}

export function markReminderSent(id: string): void {
  const b = loadAllBookings().find((x) => x.id === id);
  if (b) upsertBooking({ ...b, reminderSent: true });
}

/**
 * Sprawdza przypomnienia i próbuje pokazać powiadomienie przeglądarki.
 * Wywołuj przy starcie app / co godzinę.
 */
export async function checkAndNotifyReminders(): Promise<Booking[]> {
  const due = bookingsNeedingReminder();
  if (!due.length) return [];

  if (typeof window !== "undefined" && "Notification" in window) {
    let perm = Notification.permission;
    if (perm === "default") {
      perm = await Notification.requestPermission();
    }
    if (perm === "granted") {
      for (const b of due) {
        new Notification("Przypomnienie o treningu", {
          body: `Jutro ${formatDatePL(b.date)} o ${minutesToLabel(b.startMin)} trening z ${b.trainerName}${
            b.location ? ` · ${b.location}` : ""
          }`,
          tag: `booking-reminder-${b.id}`,
        });
        markReminderSent(b.id);
      }
    }
  }
  return due;
}

// ——— Google Calendar / ICS ———

/** Link „Dodaj do Google Calendar” (bez OAuth – otwiera UI Google). */
export function googleCalendarLink(b: Booking): string {
  const [y, m, d] = b.date.split("-").map(Number);
  const start = new Date(y!, m! - 1, d!, Math.floor(b.startMin / 60), b.startMin % 60);
  const end = new Date(y!, m! - 1, d!, Math.floor(b.endMin / 60), b.endMin % 60);
  const fmt = (dt: Date) =>
    dt.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Trening personalny – ${b.trainerName}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: [
      `Klient: ${b.clientName}`,
      b.note ? `Notatka: ${b.note}` : "",
      `Status: ${b.status}`,
    ]
      .filter(Boolean)
      .join("\n"),
    location: b.location || "",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Pobierz plik .ics (działa też z Apple Calendar / Outlook). */
export function bookingToIcs(b: Booking): string {
  const [y, m, d] = b.date.split("-").map(Number);
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = (min: number) => {
    const hh = Math.floor(min / 60);
    const mm = min % 60;
    return `${y}${pad(m!)}${pad(d!)}T${pad(hh)}${pad(mm)}00`;
  };
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Set Weight Journal//Bookings//PL",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${b.id}@set-weight-journal`,
    `DTSTAMP:${stamp(b.startMin)}`,
    `DTSTART:${stamp(b.startMin)}`,
    `DTEND:${stamp(b.endMin)}`,
    `SUMMARY:Trening personalny – ${b.trainerName}`,
    `DESCRIPTION:Klient: ${b.clientName}${b.note ? `\\n${b.note}` : ""}`,
    b.location ? `LOCATION:${b.location}` : "",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].filter(Boolean);
  return lines.join("\r\n");
}

export function downloadIcs(b: Booking): void {
  const blob = new Blob([bookingToIcs(b)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `trening-${b.date}-${minutesToLabel(b.startMin)}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}

// ——— Opcjonalnie: sync z Supabase (gdy tabela istnieje) ———

type Loose = { from: (t: string) => any }; // eslint-disable-line @typescript-eslint/no-explicit-any
const db = supabase as unknown as Loose;

export async function syncBookingsFromCloud(userId: string): Promise<Booking[]> {
  try {
    const { data, error } = await db
      .from("trainer_bookings")
      .select("id, data")
      .or(`data->>trainerId.eq.${userId},data->>clientId.eq.${userId}`);
    if (error) throw error;
    const cloud = ((data ?? []) as { id: string; data: Booking }[]).map((r) => ({
      ...r.data,
      id: r.data.id || r.id,
    }));
    const local = loadAllBookings();
    const map = new Map<string, Booking>();
    for (const b of [...local, ...cloud]) {
      const prev = map.get(b.id);
      if (!prev || (b.updatedAt || "") >= (prev.updatedAt || "")) map.set(b.id, b);
    }
    const merged = [...map.values()];
    saveAllBookings(merged);
    return merged;
  } catch {
    return loadAllBookings();
  }
}

export async function pushBookingToCloud(b: Booking, userId: string): Promise<void> {
  try {
    await db.from("trainer_bookings").upsert(
      {
        id: b.id,
        owner_id: userId,
        data: b,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
  } catch {
    /* tabela może jeszcze nie istnieć */
  }
}

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  pending: "Oczekuje na potwierdzenie",
  confirmed: "Potwierdzony",
  declined: "Odrzucony",
  cancelled: "Anulowany",
  completed: "Odbyty",
};
