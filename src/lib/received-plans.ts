import type { Client, PlanDay, PlanExercise, PlanSet } from "@/lib/trainer-plans";
import {
  loadPlan,
  loadSessions,
  loadTemplates,
  savePlan,
  saveSessions,
  saveTemplates,
  todayISO,
  uid,
  type Session,
  type SetEntry,
  type Template,
  type WeekPlan,
} from "@/lib/workout-store";

export type ReceivedPlan = {
  id: string; // plan_id z chmury lub lokalne id
  token?: string;
  name: string; // nazwa podopiecznego / planu
  receivedAt: string; // ISO
  trainingDays: string[];
  days: PlanDay[];
  sourceLabel?: string;
};

const KEY = "received-training-plans-v1";

/** Skróty dni z formularza trenera → indeks JS Date.getDay() (0=Nd … 6=Sob) */
export const WEEKDAY_TO_JS: Record<string, number> = {
  Nd: 0,
  Pon: 1,
  Wt: 2,
  Śr: 3,
  Czw: 4,
  Pt: 5,
  Sob: 6,
};

export function loadReceivedPlans(): ReceivedPlan[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ReceivedPlan[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReceivedPlans(list: ReceivedPlan[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

/** Dodaj / zaktualizuj plan z linku udostępnienia (bez duplikatów po id). */
export function upsertReceivedPlan(plan: ReceivedPlan): ReceivedPlan[] {
  const list = loadReceivedPlans().filter((p) => p.id !== plan.id);
  const next = [plan, ...list];
  saveReceivedPlans(next);
  return next;
}

export function removeReceivedPlan(id: string): ReceivedPlan[] {
  const next = loadReceivedPlans().filter((p) => p.id !== id);
  saveReceivedPlans(next);
  return next;
}

function planSetToEntry(s: PlanSet): SetEntry {
  const repsRaw = (s.reps || "").trim().toLowerCase();
  const weight = Number(String(s.weight || "0").replace(",", ".")) || 0;

  // "5 min" / "5min"
  const minMatch = repsRaw.match(/^(\d+(?:[.,]\d+)?)\s*min/);
  if (minMatch) {
    const mins = parseFloat(minMatch[1].replace(",", "."));
    return { reps: 0, weight, timeSec: Math.round(mins * 60), warmup: !!s.warmup };
  }

  // "1:20" albo "5:00"
  if (/^\d+:\d+$/.test(repsRaw)) {
    const [m, sec] = repsRaw.split(":").map(Number);
    return { reps: 0, weight, timeSec: (m || 0) * 60 + (sec || 0), warmup: !!s.warmup };
  }

  // "40s" / "40 sek"
  if (repsRaw.includes("s") || repsRaw.includes("sek")) {
    const n = parseInt(repsRaw, 10) || 0;
    return { reps: 0, weight, timeSec: n, warmup: !!s.warmup };
  }

  // "8-10" / "8–12" → górna wartość jako podpowiedź reps
  const range = repsRaw.match(/(\d+)\s*[–\-]\s*(\d+)/);
  const reps = range ? Number(range[2]) : parseInt(repsRaw, 10) || 0;
  return { reps, weight, warmup: !!s.warmup };
}

export function dayToTemplate(day: PlanDay, planName: string): Template {
  return {
    id: uid(),
    name: `${planName} · ${day.name}`,
    exercises: day.exercises.map((ex: PlanExercise) => ({
      name: ex.name,
      sets: (ex.sets.length ? ex.sets : [{ reps: "8–12", weight: "", warmup: false }]).map(planSetToEntry),
    })),
  };
}

/** Zapisuje jeden dzień planu jako szablon w Narzędziach. */
export function saveReceivedDayAsTemplate(plan: ReceivedPlan, dayId: string): Template | null {
  const day = plan.days.find((d) => d.id === dayId);
  if (!day || day.exercises.length === 0) return null;
  const tpl = dayToTemplate(day, plan.name);
  const templates = loadTemplates();
  const without = templates.filter((t) => t.name !== tpl.name);
  saveTemplates([tpl, ...without]);
  return tpl;
}

/** Zapisuje wszystkie dni z ćwiczeniami jako osobne szablony. */
export function saveAllReceivedDaysAsTemplates(plan: ReceivedPlan): number {
  const days = plan.days.filter((d) => d.exercises.length > 0);
  if (!days.length) return 0;
  const prefix = `${plan.name} · `;
  const kept = loadTemplates().filter((t) => !t.name.startsWith(prefix));
  const fresh = days.map((d) => dayToTemplate(d, plan.name));
  saveTemplates([...fresh, ...kept]);
  return fresh.length;
}

/** Buduje rozkład tygodnia: dni z planu = nazwa dnia, pozostałe = "Rest day". */
export function buildWeekPlanFromReceived(plan: ReceivedPlan): WeekPlan {
  const next: WeekPlan = { 0: "Rest day", 1: "Rest day", 2: "Rest day", 3: "Rest day", 4: "Rest day", 5: "Rest day", 6: "Rest day" };

  const training = new Set(
    (plan.trainingDays?.length ? plan.trainingDays : plan.days.map((d) => d.weekday || "")).filter(Boolean),
  );

  for (const day of plan.days) {
    const key = day.weekday || "";
    const js = WEEKDAY_TO_JS[key];
    if (js === undefined) continue;
    next[js] = day.name?.trim() || key;
    training.add(key);
  }

  // dni zaznaczone jako treningowe, ale bez rozpiski – zostaw skrót dnia
  for (const key of training) {
    const js = WEEKDAY_TO_JS[key];
    if (js === undefined) continue;
    if (!next[js] || next[js] === "Rest day") next[js] = key;
  }

  return next;
}

/**
 * Aktywuje otrzymany plan:
 * - zapisuje ROZKŁAD TYGODNIA (pozostałe dni = "Rest day")
 * - dodaje szablony dni do Narzędzi
 * - jeśli dziś jest dniem treningowym z planu → wstawia ćwiczenia w zakładce Trening
 */
export function activateReceivedPlan(plan: ReceivedPlan): { weekPlan: WeekPlan; todayFilled: boolean } {
  const weekPlan = buildWeekPlanFromReceived(plan);
  savePlan(weekPlan);

  // Szablony – jeden na dzień treningowy
  const templates = loadTemplates();
  const fresh = plan.days
    .filter((d) => d.exercises.length > 0)
    .map((d) => dayToTemplate(d, plan.name));
  // Usuń stare szablony z tym samym prefiksem nazwy planu, żeby nie dublować
  const prefix = `${plan.name} · `;
  const kept = templates.filter((t) => !t.name.startsWith(prefix));
  saveTemplates([...fresh, ...kept]);

  // Wypełnij dzisiejszą sesję, jeśli dziś jest w planie
  const today = todayISO();
  const jsDay = new Date(today + "T12:00:00").getDay();
  const todayLabel = weekPlan[jsDay] ?? "";
  const todayPlanDay =
    plan.days.find((d) => WEEKDAY_TO_JS[d.weekday || ""] === jsDay) ||
    plan.days.find((d) => d.name === todayLabel);

  let todayFilled = false;
  if (todayPlanDay && todayPlanDay.exercises.length > 0 && todayLabel !== "Rest day") {
    const session: Session = {
      date: today,
      exercises: todayPlanDay.exercises.map((ex) => ({
        id: uid(),
        name: ex.name,
        sets: (ex.sets.length ? ex.sets : [{ reps: "8–12", weight: "", warmup: false }]).map(planSetToEntry),
      })),
      note: exNoteFromDay(todayPlanDay),
    };
    const all = loadSessions();
    const list = all.some((s) => s.date === today)
      ? all.map((s) => (s.date === today ? { ...session, note: s.note || session.note } : s))
      : [...all, session];
    saveSessions(list.sort((a, b) => (a.date < b.date ? 1 : -1)));
    todayFilled = true;
  }

  return { weekPlan, todayFilled };
}

function exNoteFromDay(day: PlanDay): string | undefined {
  const notes = day.exercises.map((e) => e.note).filter(Boolean);
  return notes.length ? `Plan: ${day.name}` : `Plan: ${day.name}`;
}

/** Z danych Client (po claimLink / fetchPlans) zbuduj ReceivedPlan. */
export function clientToReceivedPlan(
  planId: string,
  data: Client,
  opts?: { token?: string; sourceLabel?: string },
): ReceivedPlan {
  return {
    id: planId,
    token: opts?.token,
    name: data.name || "Plan treningowy",
    receivedAt: new Date().toISOString(),
    trainingDays: data.trainingDays ?? data.days.map((d) => d.weekday || "").filter(Boolean),
    days: data.days ?? [],
    sourceLabel: opts?.sourceLabel,
  };
}
