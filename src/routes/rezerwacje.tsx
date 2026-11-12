import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarPlus,
  Check,
  Clock,
  Download,
  MapPin,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  BOOKING_STATUS_LABEL,
  type Booking,
  type DayOfWeek,
  type TrainerAvailability,
  type WeeklySlot,
  cancelBooking,
  checkAndNotifyReminders,
  confirmBooking,
  createBookingRequest,
  declineBooking,
  defaultAvailability,
  downloadIcs,
  formatDatePL,
  getBookableDays,
  getBookableSlots,
  googleCalendarLink,
  listPublicTrainers,
  loadAvailability,
  loadBookingsForClient,
  loadBookingsForTrainer,
  minutesToLabel,
  saveAvailability,
  uid,
  weekdayPL,
} from "@/lib/booking";

const TRAINER_AUTH_KEY = "trainer-auth-unlocked-v1";
const CORRECT_PIN = "trener personalny";

export const Route = createFileRoute("/rezerwacje")({
  head: () => ({
    meta: [
      { title: "Rezerwacje treningów personalnych" },
      {
        name: "description",
        content:
          "Ustal dostępność, rezerwuj terminy treningów personalnych i synchronizuj z kalendarzem.",
      },
    ],
  }),
  component: BookingsPage,
});

const DOW_LABELS: { v: DayOfWeek; l: string }[] = [
  { v: 1, l: "Pon" },
  { v: 2, l: "Wt" },
  { v: 3, l: "Śr" },
  { v: 4, l: "Czw" },
  { v: 5, l: "Pt" },
  { v: 6, l: "Sob" },
  { v: 0, l: "Nd" },
];

function BookingsPage() {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"book" | "manage" | "mine">("book");
  const [avail, setAvail] = useState<TrainerAvailability | null>(null);
  const [trainerBookings, setTrainerBookings] = useState<Booking[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [trainers, setTrainers] = useState<TrainerAvailability[]>([]);
  const [trainerUnlocked, setTrainerUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [displayName, setDisplayName] = useState("");

  // client booking flow
  const [selectedTrainerId, setSelectedTrainerId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [note, setNote] = useState("");

  const userId = user?.id ?? "local-user";
  /** Nazwa wyświetlana z Profilu – nie prefix e-maila */
  const userName =
    displayName.trim() ||
    (user?.user_metadata?.full_name as string | undefined)?.trim() ||
    (user?.user_metadata?.display_name as string | undefined)?.trim() ||
    user?.email?.split("@")[0] ||
    "Użytkownik";

  const refresh = () => {
    const a = loadAvailability(userId);
    // Utrzymaj aktualną nazwę wyświetlaną przy odświeżeniu listy
    if (a && userName && a.trainerName !== userName) {
      const fixed = { ...a, trainerName: userName };
      saveAvailability(fixed);
      setAvail(fixed);
    } else {
      setAvail(a);
    }
    setTrainerBookings(loadBookingsForTrainer(userId));
    setMyBookings(loadBookingsForClient(userId));
    setTrainers(listPublicTrainers());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    setTrainerUnlocked(window.localStorage.getItem(TRAINER_AUTH_KEY) === "true");
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .maybeSingle();
        if (cancelled) return;
        const name =
          (data?.display_name as string | undefined)?.trim() ||
          (user.user_metadata?.full_name as string | undefined)?.trim() ||
          "";
        setDisplayName(name);
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, user?.id]);

  useEffect(() => {
    if (loading) return;
    refresh();
    void checkAndNotifyReminders().then((due) => {
      if (due.length) {
        toast.message(
          due.length === 1
            ? "Masz trening jutro – przypomnienie"
            : `${due.length} treningi jutro – przypomnienia`,
        );
      }
    });
  }, [loading, userId, displayName]);

  const selectedTrainer = useMemo(
    () => trainers.find((t) => t.trainerId === selectedTrainerId) ?? null,
    [trainers, selectedTrainerId],
  );

  const bookableDays = useMemo(
    () => (selectedTrainer ? getBookableDays(selectedTrainer) : []),
    [selectedTrainer],
  );

  const slotsForDay = useMemo(
    () =>
      selectedTrainer && selectedDate
        ? getBookableSlots(selectedTrainer, selectedDate)
        : [],
    [selectedTrainer, selectedDate],
  );

  const pendingForTrainer = trainerBookings.filter((b) => b.status === "pending");

  // ——— Trainer: init / save availability ———
  const ensureAvailability = () => {
    const name = userName.trim() || "Trener";
    const current = loadAvailability(userId) ?? defaultAvailability(userId, name);
    current.trainerName = name;
    saveAvailability(current);
    setAvail(current);
    refresh();
    toast.success(`Włączono dostępność jako „${name}”`);
  };

  const patchAvail = (patch: Partial<TrainerAvailability>) => {
    if (!avail) return;
    const next = { ...avail, ...patch, trainerName: userName };
    saveAvailability(next);
    setAvail(next);
    refresh();
  };

  const addWeeklySlot = (dayOfWeek: DayOfWeek) => {
    if (!avail) return;
    const slot: WeeklySlot = {
      id: uid(),
      dayOfWeek,
      startMin: 9 * 60,
      endMin: 17 * 60,
    };
    patchAvail({ weekly: [...avail.weekly, slot] });
  };

  const updateWeeklySlot = (id: string, patch: Partial<WeeklySlot>) => {
    if (!avail) return;
    patchAvail({
      weekly: avail.weekly.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    });
  };

  const removeWeeklySlot = (id: string) => {
    if (!avail) return;
    patchAvail({ weekly: avail.weekly.filter((w) => w.id !== id) });
  };

  // ——— Actions ———
  const requestSlot = (startMin: number) => {
    if (!selectedTrainer || !selectedDate) return;
    if (!user) {
      toast.error("Zaloguj się w Profilu, aby rezerwować terminy");
      return;
    }
    const res = createBookingRequest({
      availability: selectedTrainer,
      clientId: userId,
      clientName: userName,
      date: selectedDate,
      startMin,
      note: note.trim() || undefined,
    });
    if (!res.ok) {
      toast.error(res.error);
      return;
    }
    toast.success("Wysłano prośbę o rezerwację – czekaj na potwierdzenie trenera");
    setNote("");
    refresh();
    setTab("mine");
  };

  const onConfirm = (id: string) => {
    const b = confirmBooking(id);
    if (b) {
      toast.success(`Potwierdzono trening z ${b.clientName}`);
      refresh();
    }
  };

  const onDecline = (id: string) => {
    const b = declineBooking(id);
    if (b) {
      toast.message(`Odrzucono termin dla ${b.clientName}`);
      refresh();
    }
  };

  const onCancel = (id: string) => {
    if (!confirm("Anulować tę rezerwację?")) return;
    cancelBooking(id);
    toast.message("Anulowano rezerwację");
    refresh();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background pb-24 px-4 pt-10">
        <p className="text-sm text-muted-foreground">Wczytywanie…</p>
        <AppNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border px-4 pb-4 pt-8">
        <div className="mx-auto max-w-2xl">
          <Link to="/narzedzia" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Narzędzia
          </Link>
          <div className="mt-2 flex items-center gap-2 text-primary">
            <Calendar className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Rezerwacje</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">Terminy treningów personalnych</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Trener ustala dostępność → podopieczny rezerwuje → potwierdzenie → przypomnienie dzień przed.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pt-4">
        <div className="flex gap-1 rounded-xl bg-secondary/60 p-1">
          {(
            [
              ["book", "Rezerwuj"],
              ["mine", "Moje terminy"],
              ...(trainerUnlocked
                ? ([["manage", "Dostępność (trener)"]] as const)
                : ([] as const)),
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex-1 rounded-lg px-2 py-2 text-xs font-semibold transition-colors ${
                tab === id ? "bg-card text-foreground shadow" : "text-muted-foreground"
              }`}
            >
              {label}
              {id === "manage" && pendingForTrainer.length > 0 ? (
                <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                  {pendingForTrainer.length}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {!trainerUnlocked ? (
          <form
            className="mt-3 rounded-2xl border border-border bg-card p-3 space-y-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (pinInput.trim().toLowerCase() === CORRECT_PIN) {
                setTrainerUnlocked(true);
                window.localStorage.setItem(TRAINER_AUTH_KEY, "true");
                setTab("manage");
                toast.success("Odblokowano panel trenera");
                setPinInput("");
              } else {
                toast.error("Nieprawidłowy kod trenera");
              }
            }}
          >
            <p className="text-[11px] text-muted-foreground">
              Zakładka „Dostępność (trener)” jest tylko dla trenera personalnego. Wpisz kod jak w
              Dzienniku trenera.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Kod trenera…"
                className="min-w-0 flex-1 rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
              >
                Odblokuj
              </button>
            </div>
          </form>
        ) : null}
      </div>

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        {/* ——— REZERWUJ ——— */}
        {tab === "book" ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Wybierz trenera
              </p>
              {trainers.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Brak opublikowanych dostępności. Jako trener włącz kalendarz w zakładce „Dostępność”.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {trainers.map((t) => {
                    const label =
                      (t.trainerName || "").trim() ||
                      "Trener";
                    return (
                    <button
                      key={t.trainerId}
                      type="button"
                      onClick={() => {
                        setSelectedTrainerId(t.trainerId);
                        setSelectedDate("");
                      }}
                      className={`rounded-full px-3 py-1.5 text-sm ${
                        selectedTrainerId === t.trainerId
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-foreground"
                      }`}
                    >
                      {label}
                      {t.trainerId === userId ? (
                        <span className="ml-1 opacity-70">(Ty)</span>
                      ) : null}
                    </button>
                    );
                  })}
                </div>
              )}
            </div>

            {selectedTrainer ? (
              <>
                <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
                  <p className="text-sm text-foreground">
                    Sesja <strong>{selectedTrainer.sessionMinutes} min</strong>
                    {selectedTrainer.location ? (
                      <>
                        {" "}
                        · <MapPin className="inline h-3.5 w-3.5" /> {selectedTrainer.location}
                      </>
                    ) : null}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Rezerwacja min. {selectedTrainer.minNoticeHours} h przed · do{" "}
                    {selectedTrainer.bookAheadDays} dni do przodu
                  </p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Dzień
                  </p>
                  {bookableDays.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Brak wolnych dni w najbliższym czasie.</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {bookableDays.slice(0, 21).map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => setSelectedDate(d)}
                          className={`rounded-xl px-2.5 py-2 text-xs font-medium ${
                            selectedDate === d
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <span className="block text-[10px] opacity-80">{weekdayPL(d)}</span>
                          {formatDatePL(d)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {selectedDate ? (
                  <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Godzina · {weekdayPL(selectedDate)} {formatDatePL(selectedDate)}
                    </p>
                    {slotsForDay.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Brak wolnych godzin tego dnia.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {slotsForDay.map((s) => (
                          <button
                            key={s.startMin}
                            type="button"
                            onClick={() => requestSlot(s.startMin)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-sm font-medium text-foreground hover:border-primary"
                          >
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {s.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <label className="block">
                      <span className="text-[11px] text-muted-foreground">Notatka do trenera (opcjonalnie)</span>
                      <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="np. fokus na technikę przysiadu"
                        className="mt-1 w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
                      />
                    </label>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        ) : null}

        {/* ——— MOJE TERMINY (klient) ——— */}
        {tab === "mine" ? (
          <div className="space-y-3">
            {myBookings.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                Nie masz jeszcze rezerwacji. Wybierz trenera w zakładce „Rezerwuj”.
              </p>
            ) : (
              myBookings.map((b) => <BookingCard key={b.id} b={b} role="client" onCancel={onCancel} />)
            )}
            <button
              type="button"
              onClick={() =>
                void checkAndNotifyReminders().then((d) =>
                  toast.message(
                    d.length ? `Przypomnienia: ${d.length}` : "Brak treningów na jutro",
                  ),
                )
              }
              className="inline-flex items-center gap-2 text-xs font-medium text-primary"
            >
              <Bell className="h-3.5 w-3.5" /> Sprawdź przypomnienia na jutro
            </button>
          </div>
        ) : null}

        {/* ——— DOSTĘPNOŚĆ TRENERA ——— */}
        {tab === "manage" && trainerUnlocked ? (
          <div className="space-y-4">
            {!avail ? (
              <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                <p className="text-sm text-foreground">
                  Jeszcze nie masz kalendarza dostępności. Włącz szablon (Pn–Pt rano i wieczór) i
                  dostosuj godziny.
                </p>
                <button
                  type="button"
                  onClick={ensureAvailability}
                  className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  Włącz dostępność trenera
                </button>
              </div>
            ) : (
              <>
                {pendingForTrainer.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">
                      Do potwierdzenia ({pendingForTrainer.length})
                    </p>
                    {pendingForTrainer.map((b) => (
                      <div
                        key={b.id}
                        className="rounded-2xl border border-primary/40 bg-primary/5 p-3 space-y-2"
                      >
                        <p className="text-sm font-semibold text-foreground">
                          {b.clientName} · {weekdayPL(b.date)} {formatDatePL(b.date)}{" "}
                          {minutesToLabel(b.startMin)}–{minutesToLabel(b.endMin)}
                        </p>
                        {b.note ? (
                          <p className="text-xs text-muted-foreground">Notatka: {b.note}</p>
                        ) : null}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onConfirm(b.id)}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground"
                          >
                            <Check className="h-3.5 w-3.5" /> Potwierdź
                          </button>
                          <button
                            type="button"
                            onClick={() => onDecline(b.id)}
                            className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-border py-2 text-xs font-medium text-foreground"
                          >
                            <X className="h-3.5 w-3.5" /> Odrzuć
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Ustawienia sesji
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-xs">
                      Długość (min)
                      <input
                        type="number"
                        min={30}
                        max={180}
                        step={15}
                        value={avail.sessionMinutes}
                        onChange={(e) =>
                          patchAvail({ sessionMinutes: Number(e.target.value) || 60 })
                        }
                        className="mt-1 w-full rounded-lg border border-input bg-secondary px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="text-xs">
                      Bufor (min)
                      <input
                        type="number"
                        min={0}
                        max={60}
                        step={5}
                        value={avail.bufferMinutes}
                        onChange={(e) =>
                          patchAvail({ bufferMinutes: Number(e.target.value) || 0 })
                        }
                        className="mt-1 w-full rounded-lg border border-input bg-secondary px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="text-xs">
                      Min. wyprzedzenie (h)
                      <input
                        type="number"
                        min={1}
                        max={72}
                        value={avail.minNoticeHours}
                        onChange={(e) =>
                          patchAvail({ minNoticeHours: Number(e.target.value) || 12 })
                        }
                        className="mt-1 w-full rounded-lg border border-input bg-secondary px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="text-xs">
                      Rezerwuj do (dni)
                      <input
                        type="number"
                        min={7}
                        max={90}
                        value={avail.bookAheadDays}
                        onChange={(e) =>
                          patchAvail({ bookAheadDays: Number(e.target.value) || 28 })
                        }
                        className="mt-1 w-full rounded-lg border border-input bg-secondary px-2 py-1.5 text-sm"
                      />
                    </label>
                  </div>
                  <label className="block text-xs">
                    Miejsce treningu
                    <input
                      value={avail.location || ""}
                      onChange={(e) => patchAvail({ location: e.target.value })}
                      placeholder="np. Siłownia X, sala 2"
                      className="mt-1 w-full rounded-lg border border-input bg-secondary px-2 py-1.5 text-sm"
                    />
                  </label>
                </div>

                <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Godziny w tygodniu
                  </p>
                  {DOW_LABELS.map(({ v, l }) => {
                    const slots = avail.weekly.filter((w) => w.dayOfWeek === v);
                    return (
                      <div key={v} className="space-y-1.5 border-b border-border/50 pb-2 last:border-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">{l}</span>
                          <button
                            type="button"
                            onClick={() => addWeeklySlot(v)}
                            className="text-[11px] font-medium text-primary"
                          >
                            + przedział
                          </button>
                        </div>
                        {slots.length === 0 ? (
                          <p className="text-[11px] text-muted-foreground">Niedostępny</p>
                        ) : (
                          slots.map((s) => (
                            <div key={s.id} className="flex items-center gap-2 text-xs">
                              <input
                                type="time"
                                value={minutesToLabel(s.startMin)}
                                onChange={(e) => {
                                  const [hh, mm] = e.target.value.split(":").map(Number);
                                  updateWeeklySlot(s.id, {
                                    startMin: (hh || 0) * 60 + (mm || 0),
                                  });
                                }}
                                className="rounded-lg border border-input bg-secondary px-2 py-1"
                              />
                              <span className="text-muted-foreground">–</span>
                              <input
                                type="time"
                                value={minutesToLabel(s.endMin)}
                                onChange={(e) => {
                                  const [hh, mm] = e.target.value.split(":").map(Number);
                                  updateWeeklySlot(s.id, {
                                    endMin: (hh || 0) * 60 + (mm || 0),
                                  });
                                }}
                                className="rounded-lg border border-input bg-secondary px-2 py-1"
                              />
                              <button
                                type="button"
                                onClick={() => removeWeeklySlot(s.id)}
                                className="p-1 text-muted-foreground hover:text-danger"
                                aria-label="Usuń przedział"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Nadchodzące rezerwacje
                  </p>
                  {trainerBookings.filter((b) => b.status === "confirmed" || b.status === "pending")
                    .length === 0 ? (
                    <p className="text-sm text-muted-foreground">Brak nadchodzących rezerwacji.</p>
                  ) : (
                    trainerBookings
                      .filter((b) => b.status === "confirmed" || b.status === "pending")
                      .map((b) => (
                        <BookingCard key={b.id} b={b} role="trainer" onCancel={onCancel} />
                      ))
                  )}
                </div>
              </>
            )}
          </div>
        ) : null}

        <div className="rounded-2xl border border-dashed border-border p-3 text-[11px] leading-relaxed text-muted-foreground">
          <strong className="text-foreground">Google Calendar:</strong> przy każdej rezerwacji możesz
          dodać wydarzenie jednym kliknięciem (link Google) albo pobrać plik .ics. Pełna dwukierunkowa
          synchronizacja (OAuth) wymaga Client ID z Google Cloud – struktura danych jest na to gotowa.
        </div>
      </section>

      <AppNav />
    </main>
  );
}

function BookingCard({
  b,
  role,
  onCancel,
}: {
  b: Booking;
  role: "client" | "trainer";
  onCancel: (id: string) => void;
}) {
  const statusColor =
    b.status === "confirmed"
      ? "text-emerald-400"
      : b.status === "pending"
        ? "text-amber-400"
        : "text-muted-foreground";

  return (
    <div className="rounded-2xl border border-border bg-card p-3 space-y-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {weekdayPL(b.date)} {formatDatePL(b.date)} · {minutesToLabel(b.startMin)}–
            {minutesToLabel(b.endMin)}
          </p>
          <p className="text-xs text-muted-foreground">
            {role === "client" ? `Trener: ${b.trainerName}` : `Klient: ${b.clientName}`}
            {b.location ? ` · ${b.location}` : ""}
          </p>
          <p className={`text-[11px] font-medium ${statusColor}`}>
            {BOOKING_STATUS_LABEL[b.status]}
          </p>
        </div>
      </div>
      {b.note ? <p className="text-xs text-muted-foreground">„{b.note}”</p> : null}
      <div className="flex flex-wrap gap-2">
        {(b.status === "confirmed" || b.status === "pending") && (
          <>
            <a
              href={googleCalendarLink(b)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-foreground"
            >
              <CalendarPlus className="h-3.5 w-3.5" /> Google Calendar
            </a>
            <button
              type="button"
              onClick={() => downloadIcs(b)}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-[11px] font-medium text-foreground"
            >
              <Download className="h-3.5 w-3.5" /> .ics
            </button>
          </>
        )}
        {(b.status === "pending" || b.status === "confirmed") && (
          <button
            type="button"
            onClick={() => onCancel(b.id)}
            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-danger"
          >
            Anuluj
          </button>
        )}
      </div>
    </div>
  );
}
