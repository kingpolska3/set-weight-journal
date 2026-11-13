import { roundToGymEquipment, detectEquipmentType } from "@/lib/gymWeights";
export type SetEntry = {
  reps: number;
  weight: number;
  note?: string;
  warmup?: boolean;
  restSec?: number;
  /** Seria na czas (np. deska, spacer farmera) – wtedy reps = 0. */
  timeSec?: number;
  prevTimeSec?: number;
  /** Podpowiedzi z poprzedniego treningu (tylko podświetlenie w polach). */
  prevReps?: number;
  prevWeight?: number;
};

export type Exercise = {
  id: string;
  name: string;
  sets: SetEntry[];
  /** Cel z planu trenera – tylko podgląd w UI (coach). */
  coachRange?: string;
  coachRest?: string;
  /** Uwagi trenera z planu – tylko podgląd w UI (coach). */
  coachNote?: string;
};
export type Session = {
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
  note?: string;
  photo?: string;
  /** Dzień oznaczony jako „Bez treningu”. */
  rest?: boolean;
  /** Dzień oznaczony jako „Deload” – trening na ok. 50% dla regeneracji. */
  deload?: boolean;
  /** Stoper treningu – ISO timestampy startu i końca. */
  startTime?: string;
  endTime?: string;
  /** Zapisany czas trwania treningu w sekundach. */
  durationSec?: number;
  /** ISO timestamp ostatniej zmiany – używany przy synchronizacji z chmurą. */
  updatedAt?: string;
};

export type Template = {
  id: string;
  name: string;
  exercises: { name: string; sets: SetEntry[] }[];
};

const KEY = "trening-dziennik-v1";
const TEMPLATE_KEY = "trening-szablony-v1";

/** Jednorazowe czyszczenie danych – nowy, pusty start aplikacji. */
const FRESH_KEY = "trening-czysty-start-v1";
export const CLOUD_WIPE_PENDING = "trening-czysty-start-chmura";

export const EXAMPLE_TEMPLATE: Template = {
  id: "przyklad",
  name: "Przykładowy szablon (możesz usunąć)",
  exercises: [
    { name: "Wyciskanie sztangi na ławce płaskiej", sets: [{ reps: 0, weight: 0 }, { reps: 0, weight: 0 }, { reps: 0, weight: 0 }] },
    { name: "Wiosłowanie sztangą", sets: [{ reps: 0, weight: 0 }, { reps: 0, weight: 0 }, { reps: 0, weight: 0 }] },
  ],
};

/**
 * Czyści historię i szablony przy pierwszym uruchomieniu nowej wersji,
 * zostawiając jeden przykładowy szablon do usunięcia.
 */
export function ensureFreshStart() {
  if (typeof window === "undefined") return;
  try {
    if (window.localStorage.getItem(FRESH_KEY)) return;
    window.localStorage.setItem(KEY, "[]");
    window.localStorage.setItem(TEMPLATE_KEY, JSON.stringify([EXAMPLE_TEMPLATE]));
    window.localStorage.setItem(CLOUD_WIPE_PENDING, "1");
    window.localStorage.setItem(FRESH_KEY, new Date().toISOString());
  } catch {
    /* brak dostępu do pamięci */
  }
}

const PLAN_KEY = "trening-rozklad-v1";

export type WeekPlan = Record<number, string>;

export const DEFAULT_DAY_PLAN: WeekPlan = {
  0: "...",
  1: "...",
  2: "...",
  3: "...",
  4: "...",
  5: "...",
  6: "...",
};

/** Zapisany (edytowalny) rozkład tygodnia. */
export function loadPlan(): WeekPlan {
  if (typeof window === "undefined") return { ...DEFAULT_DAY_PLAN };
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return { ...DEFAULT_DAY_PLAN };
    const parsed = JSON.parse(raw) as WeekPlan;
    return { ...DEFAULT_DAY_PLAN, ...parsed };
  } catch {
    return { ...DEFAULT_DAY_PLAN };
  }
}

export function savePlan(plan: WeekPlan) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  } catch {
    /* quota */
  }
}

/** Zgodność wstecz – domyślny rozkład. */
export const DAY_PLAN = DEFAULT_DAY_PLAN;

export const DAY_NAMES = [
  "Niedziela",
  "Poniedziałek",
  "Wtorek",
  "Środa",
  "Czwartek",
  "Piątek",
  "Sobota",
];

export function todayISO(): string {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function formatDatePL(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${DAY_NAMES[d.getDay()]}, ${d.toLocaleDateString("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })}`;
}

export function shortDatePL(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pl-PL", { day: "2-digit", month: "2-digit" });
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

export function planForDate(iso: string, plan?: WeekPlan): string {
  const d = new Date(iso + "T00:00:00");
  return (plan ?? loadPlan())[d.getDay()] ?? "";
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function loadSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Session[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: Session[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(sessions));
  } catch {
    /* quota */
  }
}

export function loadTemplates(): Template[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TEMPLATE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Template[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTemplates(list: Template[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(TEMPLATE_KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

/** Serie robocze (bez rozgrzewkowych) – podstawa wszystkich statystyk. */
export function workingSets(sets: SetEntry[]): SetEntry[] {
  const working = sets.filter((s) => !s.warmup);
  return working.length > 0 ? working : [];
}

/** Ćwiczenia jednostronne – powtórzenia wpisywane na jedną stronę, więc objętość ×2. */
export function unilateralFactor(name?: string): number {
  const n = (name ?? "").toLowerCase();
  return /jednor(ą|a)cz|jednon(ó|o)(ż|z)/.test(n) ? 2 : 1;
}

export function volume(sets: SetEntry[], name?: string): number {
  const base = workingSets(sets).reduce(
    (sum, s) => sum + (s.reps || 0) * (s.weight || 0),
    0,
  );
  return base * unilateralFactor(name);
}

export function topWeight(sets: SetEntry[]): number {
  return workingSets(sets).reduce((m, s) => Math.max(m, s.weight || 0), 0);
}

export function totalReps(sets: SetEntry[]): number {
  return workingSets(sets).reduce((m, s) => m + (s.reps || 0), 0);
}

/** Estymowany 1RM – Epley. */
export function epley(reps: number, weight: number): number {
  if (!reps || !weight) return 0;
  if (reps === 1) return weight;
  return weight * (1 + reps / 30);
}

/** Estymowany 1RM – Brzycki. */
export function brzycki(reps: number, weight: number): number {
  if (!reps || !weight || reps >= 37) return 0;
  if (reps === 1) return weight;
  return weight * (36 / (37 - reps));
}

/** Najlepszy estymowany 1RM w ćwiczeniu (średnia Epley/Brzycki z najlepszej serii). */
export function best1RM(sets: SetEntry[]): number {
  return workingSets(sets).reduce((m, s) => {
    const e = epley(s.reps, s.weight);
    const b = brzycki(s.reps, s.weight);
    const val = b > 0 ? (e + b) / 2 : e;
    return Math.max(m, val);
  }, 0);
}

export type ExerciseStat = {
  date: string;
  sets: SetEntry[];
  volume: number;
  top: number;
  reps: number;
  e1rm: number;
};

export function normalizeName(name: string) {
  return name.trim().toLowerCase();
}

/** Sesja normalnego treningu (nie rest / nie deload). */
export function isNormalTrainingSession(s: Session): boolean {
  return !s.rest && !s.deload;
}

/** Wszystkie wystąpienia ćwiczenia posortowane rosnąco po dacie.
 *  domyślnie pomija dni rest/deload – do wykresów przekaż { includeAll: true }. */
export function exerciseHistory(
  sessions: Session[],
  name: string,
  opts?: { includeAll?: boolean },
): ExerciseStat[] {
  const norm = normalizeName(name);
  if (!norm) return [];
  const includeAll = opts?.includeAll === true;
  const out: ExerciseStat[] = [];
  for (const s of sessions) {
    if (!includeAll && !isNormalTrainingSession(s)) continue;
    for (const ex of s.exercises) {
      if (normalizeName(ex.name) !== norm) continue;
      if (workingSets(ex.sets).length === 0) continue;
      out.push({
        date: s.date,
        sets: ex.sets,
        volume: volume(ex.sets, ex.name),
        top: topWeight(ex.sets),
        reps: totalReps(ex.sets),
        e1rm: best1RM(ex.sets),
      });
    }
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : 1));
}

export function previousExercise(
  sessions: Session[],
  date: string,
  name: string,
  opts?: { includeAll?: boolean },
): { session: Session; exercise: Exercise } | null {
  const norm = normalizeName(name);
  const includeAll = opts?.includeAll === true;
  const earlier = sessions
    .filter((s) => s.date < date && (includeAll || isNormalTrainingSession(s)))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const s of earlier) {
    const ex = s.exercises.find(
      (e) => normalizeName(e.name) === norm && workingSets(e.sets).length > 0,
    );
    if (ex) return { session: s, exercise: ex };
  }
  return null;
}

export type Progress = {
  volumePct: number;
  weightPct: number;
  repsPct: number;
  e1rmPct: number;
  prevDate: string;
};

function pct(now: number, before: number) {
  return before === 0 ? (now > 0 ? 100 : 0) : ((now - before) / before) * 100;
}

export function computeProgress(
  sessions: Session[],
  date: string,
  exercise: Exercise,
): Progress | null {
  const prev = previousExercise(sessions, date, exercise.name);
  if (!prev) return null;
  return {
    volumePct: pct(volume(exercise.sets, exercise.name), volume(prev.exercise.sets, exercise.name)),
    weightPct: pct(topWeight(exercise.sets), topWeight(prev.exercise.sets)),
    repsPct: pct(totalReps(exercise.sets), totalReps(prev.exercise.sets)),
    e1rmPct: pct(best1RM(exercise.sets), best1RM(prev.exercise.sets)),
    prevDate: prev.session.date,
  };
}

export type BestWindow = {
  days: number;
  volume: number;
  weight: number;
  e1rm: number;
  date: string | null;
};

/** Najlepszy wynik w oknie ostatnich N dni (przed bieżącą datą). */
export function bestInWindow(
  sessions: Session[],
  date: string,
  name: string,
  days: number,
): BestWindow {
  const hist = exerciseHistory(sessions, name).filter(
    (h) => h.date < date && daysBetween(h.date, date) <= days,
  );
  let best: BestWindow = { days, volume: 0, weight: 0, e1rm: 0, date: null };
  for (const h of hist) {
    if (h.e1rm > best.e1rm) best = { ...best, e1rm: h.e1rm, date: h.date };
    best = {
      ...best,
      volume: Math.max(best.volume, h.volume),
      weight: Math.max(best.weight, h.top),
    };
  }
  return best;
}

export type PRFlags = {
  weight: boolean;
  reps: boolean;
  volume: boolean;
  e1rm: boolean;
  any: boolean;
};

/** Rekord: pobicie najlepszego wyniku ze wszystkich wcześniejszych treningów. */
export function prFlags(sessions: Session[], date: string, exercise: Exercise): PRFlags {
  const hist = exerciseHistory(sessions, exercise.name).filter((h) => h.date < date);
  const cur = {
    weight: topWeight(exercise.sets),
    reps: totalReps(exercise.sets),
    volume: volume(exercise.sets, exercise.name),
    e1rm: best1RM(exercise.sets),
  };
  if (hist.length === 0 || cur.volume === 0) {
    return { weight: false, reps: false, volume: false, e1rm: false, any: false };
  }
  const max = hist.reduce(
    (m, h) => ({
      weight: Math.max(m.weight, h.top),
      reps: Math.max(m.reps, h.reps),
      volume: Math.max(m.volume, h.volume),
      e1rm: Math.max(m.e1rm, h.e1rm),
    }),
    { weight: 0, reps: 0, volume: 0, e1rm: 0 },
  );
  const flags = {
    weight: cur.weight > max.weight,
    reps: cur.reps > max.reps,
    volume: cur.volume > max.volume,
    e1rm: cur.e1rm > max.e1rm + 0.01,
  };
  return { ...flags, any: flags.weight || flags.reps || flags.volume || flags.e1rm };
}

export type Suggestion = { tone: "up" | "warn" | "info"; text: string };

function roundStep(w: number) {
  return Math.round(w * 2) / 2;
}

/** Charakterystyka ćwiczenia – decyduje o zakresie powtórzeń i skoku ciężaru. */
export type ExerciseProfile = {
  kind: "wyciskanie" | "przysiad/martwy ciąg" | "wiosłowanie/podciąganie" | "maszyna/wyciąg" | "izolacja" | "brzuch";
  repRange: [number, number];
  /** Minimalny sensowny skok ciężaru w kg. */
  step: number;
  unilateral: boolean;
};

const has = (n: string, ...words: string[]) => words.some((w) => n.includes(w));

export function exerciseProfile(name: string): ExerciseProfile {
  const n = name.toLowerCase();
  const unilateral = has(n, "jednorącz", "jednonóż");

  // Smith – jak sztanga
  if (has(n, "smith")) {
    if (has(n, "przysiad", "hack", "wypychanie"))
      return { kind: "przysiad/martwy ciąg", repRange: [6, 10], step: 5, unilateral };
    if (has(n, "wyciskanie", "ława", "ławka", "military", "ohp", "decline", "skośn", "płask"))
      return { kind: "wyciskanie", repRange: [6, 10], step: 2.5, unilateral };
  }

  if (has(n, "brzuch", "spięcia", "plank", "deska", "allahy", "nogi w zwisie", "russian"))
    return { kind: "brzuch", repRange: [12, 20], step: 2.5, unilateral };

  // Wyciąg / brama / butterfly – zanim złapie ogólne "ściąganie"
  if (has(n, "wyciąg", "brama", "bram", "butterfly", "pec deck", "peck", "maszyn"))
    return { kind: "maszyna/wyciąg", repRange: [10, 15], step: 2.5, unilateral };

  if (has(n, "przysiad", "martwy", "hack", "wykrok", "suwnic", "prostowanie nóg", "uginanie nóg", "wypychanie"))
    return { kind: "przysiad/martwy ciąg", repRange: [6, 10], step: 5, unilateral };
  if (has(n, "wyciskanie", "ława", "ławka", "military", "ohp", "pompki"))
    return { kind: "wyciskanie", repRange: [6, 10], step: 2.5, unilateral };
  if (has(n, "wiosłowanie", "podciąganie", "ściąganie", "przyciąganie"))
    return { kind: "wiosłowanie/podciąganie", repRange: [8, 12], step: 2.5, unilateral };

  return { kind: "izolacja", repRange: [10, 15], step: 2.5, unilateral };
}

/**
 * Podpowiedzi na dzisiejszy trening.
 * Bazuje na ostatniej sesji + (opcjonalnie) tym, co już wpisano dziś.
 * Jedna główna akcja + max 1–2 wskazówki.
 */
export function nextSessionSuggestions(
  sessions: Session[],
  date: string,
  name: string,
  repRange?: [number, number],
  /** Serie już wpisane dziś – pozwala dać feedback na żywo. */
  todaySets?: SetEntry[],
): Suggestion[] {
  // Tylko normalne treningi (bez deload / rest) – deload nie ustala planu na zwykły dzień
  const hist = exerciseHistory(sessions, name).filter((h) => h.date < date);
  const last = hist[hist.length - 1];
  if (!last) return [];

  const prof = exerciseProfile(name);
  const [lo, hi] = repRange ?? prof.repRange;
  const eqType = detectEquipmentType(name);
  const step =
    eqType === "cable_stack"
      ? Math.max(prof.step, 3.75)
      : eqType === "dumbbells"
        ? Math.max(prof.step, 2)
        : prof.step;

  const lastSets = workingSets(last.sets);
  const lastCount = lastSets.length;
  if (lastCount === 0) return [];

  const lastMinReps = Math.min(...lastSets.map((s) => s.reps || 0));
  const lastMaxReps = Math.max(...lastSets.map((s) => s.reps || 0));
  const lastTop = last.top;
  const perSide = prof.unilateral ? " (na stronę)" : "";
  const lastAllAtTop = lastSets.every((s) => (s.reps || 0) >= hi);

  // Co już jest dziś
  const todayWorking = todaySets ? workingSets(todaySets) : [];
  const todayFilled = todayWorking.filter(
    (s) => (s.reps || 0) > 0 && (s.weight || 0) > 0,
  );
  const hasToday = todayFilled.length > 0;
  const todayTop = hasToday ? Math.max(...todayFilled.map((s) => s.weight || 0)) : 0;
  const todayMinReps = hasToday
    ? Math.min(...todayFilled.map((s) => s.reps || 0))
    : 0;
  const todayCount = todayFilled.length;

  const out: Suggestion[] = [];

  // ——— PLAN Z POPRZEDNIEGO TRENINGU ———
  let planText = "";
  let planTone: Suggestion["tone"] = "info";
  let plannedWeight = lastTop;
  let plannedReps = lastMinReps;
  let plannedSets = lastCount;

  if (lastAllAtTop) {
    plannedWeight = roundToGymEquipment(lastTop + step, eqType);
    plannedReps = lo;
    plannedSets = lastCount;
    planTone = "up";
    planText = `Plan: ${plannedSets}×${plannedReps}@${plannedWeight} kg${perSide} (górny zakres ${lo}–${hi} był domknięty – czas na +ciężar).`;
  } else if (lastMinReps < lo) {
    plannedWeight = roundToGymEquipment(Math.max(0, lastTop - step), eqType);
    plannedReps = lo;
    plannedSets = Math.max(lastCount, 3);
    planTone = "warn";
    planText = `Plan: ${plannedSets}×${plannedReps}–${hi}@${plannedWeight} kg${perSide} (ostatnio ${lastMinReps} powt. poniżej zakresu ${lo}–${hi}).`;
  } else if (lastMaxReps >= hi && lastMinReps < hi) {
    plannedWeight = lastTop;
    plannedReps = hi;
    plannedSets = lastCount;
    planTone = "info";
    planText = `Plan: wyrównaj do ${plannedSets}×${hi}@${plannedWeight} kg${perSide}, potem +${step} kg.`;
  } else {
    plannedWeight = lastTop;
    plannedReps = Math.min(lastMinReps + 1, hi);
    plannedSets = lastCount;
    planTone = "info";
    planText = `Plan: ${plannedSets}×${plannedReps}@${plannedWeight} kg${perSide} (zakres ${lo}–${hi}).`;
  }

  // ——— FEEDBACK NA ŻYWO, GDY SĄ JUŻ SERIE DZIŚ ———
  if (hasToday) {
    const weightUp = todayTop > lastTop + 0.05;
    const weightSame = Math.abs(todayTop - lastTop) < 0.05;
    const weightDown = todayTop < lastTop - 0.05;
    const bigJump = todayTop >= lastTop * 1.4 && lastTop > 0;

    if (bigJump) {
      out.push({
        tone: "up",
        text: `Duży skok ciężaru (${lastTop} → ${todayTop} kg). Trzymaj technikę; jeśli wszystkie serie ≥${lo} powt., zostaw ten ciężar na kolejny raz.`,
      });
    } else if (weightUp && todayMinReps >= lo) {
      out.push({
        tone: "up",
        text: `Lepszy ciężar niż ostatnio (${lastTop} → ${todayTop} kg) przy min. ${todayMinReps} powt. Dobry progres – domknij pozostałe serie w zakresie ${lo}–${hi}.`,
      });
    } else if (weightUp && todayMinReps < lo) {
      out.push({
        tone: "warn",
        text: `Ciężar wyższy (${todayTop} kg), ale najsłabsza seria ma tylko ${todayMinReps} powt. Lepiej ${roundToGymEquipment(todayTop - step, eqType)} kg i pełny zakres ${lo}–${hi}.`,
      });
    } else if (weightSame && todayMinReps >= hi) {
      const nextW = roundToGymEquipment(todayTop + step, eqType);
      out.push({
        tone: "up",
        text: `Zakres domknięty na ${todayTop} kg. Na kolejny raz: ${todayCount}×${lo}@${nextW} kg${perSide}.`,
      });
    } else if (weightSame && todayMinReps >= plannedReps) {
      out.push({
        tone: "up",
        text: `Idziesz zgodnie z planem (lub lepiej). Cel do końca: wszystkie serie ≥${Math.min(todayMinReps + (todayMinReps < hi ? 1 : 0), hi)}@${todayTop} kg.`,
      });
    } else if (weightSame) {
      out.push({
        tone: "info",
        text: `Na ${todayTop} kg celuj w ${plannedReps}+ powt. we wszystkich seriach (zakres ${lo}–${hi}).`,
      });
    } else if (weightDown) {
      out.push({
        tone: "warn",
        text: `Dziś lżej niż ostatnio (${todayTop} vs ${lastTop} kg). Jeśli to nie deload – wróć do ${lastTop} kg.`,
      });
    }

    // Mało serii dziś
    if (todayCount < 3 && prof.kind !== "brzuch") {
      out.push({
        tone: "info",
        text: `Masz ${todayCount} ${todayCount === 1 ? "serię" : "serie"} – dla ${prof.kind} lepiej 3–4 serie robocze.`,
      });
    }
  } else {
    // Brak dzisiejszych serii – pokaż sam plan
    out.push({ tone: planTone, text: planText });

    // Dodatkowe wskazówki tylko gdy nie ma jeszcze dzisiejszych danych
    const prev = hist[hist.length - 2];
    if (prev && lastAllAtTop === false) {
      const prevMin = Math.min(...workingSets(prev.sets).map((x) => x.reps || 0));
      if (
        last.top === prev.top &&
        lastMinReps === prevMin &&
        Math.abs(last.e1rm - prev.e1rm) < 0.8
      ) {
        out.push({
          tone: "info",
          text: `Dwa identyczne wyniki z rzędu – dorzuć serię albo zwolnij ekscentrykę (3 s).`,
        });
      }
    }

    if (lastCount < 3 && prof.kind !== "brzuch") {
      out.push({
        tone: "info",
        text: `Ostatnio tylko ${lastCount} ${lastCount === 1 ? "seria" : "serie"} – celuj w 3–4 serie robocze.`,
      });
    }
  }

  // Regresja długoterminowa – zawsze warto ostrzec
  const tail = hist.slice(-4);
  let streak = 0;
  for (let i = tail.length - 1; i > 0; i--) {
    const a = tail[i];
    const b = tail[i - 1];
    if (a && b && a.volume < b.volume && a.e1rm <= b.e1rm) streak++;
    else break;
  }
  if (streak >= 3 && out.length < 3) {
    out.push({
      tone: "warn",
      text: `${streak} treningi z regresją z rzędu – rozważ deload (~${roundToGymEquipment(lastTop * 0.9, eqType)} kg) albo zmianę wariantu.`,
    });
  }

  return out.slice(0, 3);
}

export type DaySummary = {
  volume: number;
  prevVolume: number;
  pct: number | null;
  prCount: number;
  improved: number;
  exercises: number;
  sets: number;
  prevDate: string | null;
  planName: string;
};

/** Suma objętości całej sesji (z uwzględnieniem ćwiczeń jednostronnych). */
export function sessionVolume(session: Session): number {
  return session.exercises.reduce((sum, ex) => sum + volume(ex.sets, ex.name), 0);
}

/** Ostatnia wcześniejsza sesja o tej samej nazwie z rozkładu tygodnia. */
export function previousSameTypeSession(
  sessions: Session[],
  date: string,
  plan?: WeekPlan,
): Session | null {
  const p = plan ?? loadPlan();
  const target = planForDate(date, p);
  return (
    sessions
      .filter(
        (s) =>
          s.date < date &&
          !s.rest &&
          !s.deload &&
          planForDate(s.date, p) === target &&
          sessionVolume(s) > 0,
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null
  );
}

export function daySummary(sessions: Session[], date: string, plan?: WeekPlan): DaySummary {
  const p = plan ?? loadPlan();
  const session = sessions.find((s) => s.date === date);
  const exercises = session?.exercises ?? [];
  let vol = 0;
  let prCount = 0;
  let improved = 0;
  let sets = 0;
  for (const ex of exercises) {
    vol += volume(ex.sets, ex.name);
    sets += workingSets(ex.sets).length;
    const prev = previousExercise(sessions, date, ex.name);
    if (prev && volume(ex.sets, ex.name) > volume(prev.exercise.sets, ex.name)) improved++;
    const flags = prFlags(sessions, date, ex);
    if (flags.any) prCount++;
  }
  const noCompare = Boolean(session?.rest || session?.deload);
  const prevSession = noCompare ? null : previousSameTypeSession(sessions, date, p);
  const prevVol = prevSession ? sessionVolume(prevSession) : 0;
  return {
    volume: vol,
    prevVolume: prevVol,
    pct: prevVol > 0 ? ((vol - prevVol) / prevVol) * 100 : null,
    prCount,
    improved,
    exercises: exercises.length,
    sets,
    prevDate: prevSession?.date ?? null,
    planName: planForDate(date, p),
  };
}

/** Lista unikalnych nazw ćwiczeń (najczęstsze najpierw). */
export function allExerciseNames(sessions: Session[]): string[] {
  const map = new Map<string, { name: string; count: number }>();
  for (const s of sessions) {
    for (const ex of s.exercises) {
      const key = normalizeName(ex.name);
      if (!key) continue;
      const cur = map.get(key);
      if (cur) cur.count++;
      else map.set(key, { name: ex.name.trim(), count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count).map((v) => v.name);
}

/** Zmniejsza zdjęcie z galerii i zwraca data URL. */
export function fileToCompressedDataUrl(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read error"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("image error"));
      img.onload = () => {
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("no ctx"));
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- Eksport / import ---------- */

export function sessionsToCSV(sessions: Session[]): string {
  const rows = [
    ["data", "cwiczenie", "seria", "typ", "powtorzenia", "ciezar_kg", "notatka"],
  ];
  for (const s of [...sessions].sort((a, b) => (a.date < b.date ? -1 : 1))) {
    for (const ex of s.exercises) {
      ex.sets.forEach((set, i) => {
        rows.push([
          s.date,
          ex.name,
          String(i + 1),
          set.warmup ? "warmup" : "robocza",
          String(set.reps ?? ""),
          String(set.weight ?? ""),
          set.note ?? "",
        ]);
      });
    }
  }
  return rows
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
}

export function downloadFile(name: string, content: string, type: string) {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export const SEED_EXERCISES: { name: string; sets: SetEntry[] }[] = [
  {
    name: "Ława płaska – wyciskanie sztangą",
    sets: [
      { reps: 4, weight: 87.5 },
      { reps: 8, weight: 77.5 },
      { reps: 8, weight: 77.5 },
    ],
  },
  {
    name: "Wiosłowanie jednorącz",
    sets: [
      { reps: 10, weight: 50 },
      { reps: 8, weight: 60 },
      { reps: 10, weight: 50 },
    ],
  },
  {
    name: "Rozpiętki butterfly",
    sets: [
      { reps: 10, weight: 75 },
      { reps: 10, weight: 67.5 },
      { reps: 7, weight: 67.5, note: "dropset x2 do odcinki" },
    ],
  },
  {
    name: "Ściąganie wyciągu górnego – chwyt neutralny",
    sets: [
      { reps: 10, weight: 60 },
      { reps: 10, weight: 60 },
      { reps: 10, weight: 60 },
    ],
  },
  {
    name: "Ława dodatnia – wyciskanie sztangą",
    sets: [
      { reps: 9, weight: 60 },
      { reps: 9, weight: 60 },
      { reps: 6, weight: 50 },
    ],
  },
  {
    name: "Ściąganie na ramionach",
    sets: [
      { reps: 10, weight: 67.5 },
      { reps: 10, weight: 67.5 },
      { reps: 10, weight: 67.5 },
    ],
  },
];

export type SummaryLine = {
  text: string;
  tone: "good" | "bad" | "info";
  /** Opcjonalna etykieta sekcji (np. „Progres”, „Rekordy”). */
  label?: string;
};

/** Główne grupy mięśniowe do analizy obciążenia. */
export type MuscleGroup =
  | "klatka"
  | "plecy"
  | "barki"
  | "biceps"
  | "triceps"
  | "nogi"
  | "pośladki"
  | "brzuch"
  | "łydki"
  | "przedramiona"
  | "cardio";

const MUSCLE_LABEL: Record<MuscleGroup, string> = {
  klatka: "Klatka",
  plecy: "Plecy",
  barki: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  nogi: "Nogi",
  pośladki: "Pośladki",
  brzuch: "Brzuch",
  łydki: "Łydki",
  przedramiona: "Przedramiona",
  cardio: "Cardio",
};

/**
 * Mapowanie nazwy ćwiczenia → grupy mięśniowe (wagi względne 0–1).
 * Suma wag nie musi być 1 – normalizujemy przy agregacji.
 */
export function musclesForExercise(name: string): Partial<Record<MuscleGroup, number>> {
  const n = name.toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => n.includes(w));

  if (has("rower", "bieg", "bieżni", "elipty", "cardio", "skakan", "orbiter"))
    return { cardio: 1 };
  if (has("brzuch", "plank", "deska", "allah", "crunch", "spinanie", "spięcia", "russian"))
    return { brzuch: 1 };
  if (has("łydk", "wspięcia")) return { łydki: 1 };

  // Nogi / pośladki
  if (has("przysiad", "squat", "hack", "wypychanie nóg", "leg press"))
    return { nogi: 0.7, pośladki: 0.3 };
  if (has("martwy", "deadlift", "rumuński", "rdl"))
    return { nogi: 0.4, pośladki: 0.35, plecy: 0.25 };
  if (has("wykrok", "lunge", "split squat", "bułgarsk", "goblet"))
    return { nogi: 0.55, pośladki: 0.45 };
  if (has("prostowanie nóg", "leg extension")) return { nogi: 1 };
  if (has("uginanie nóg", "leg curl", "uda")) return { nogi: 1 };
  if (has("hip thrust", "glute", "poślad")) return { pośladki: 0.85, nogi: 0.15 };
  if (has("suwnica", "adduk", "przywodz", "odwodz")) return { nogi: 0.7, pośladki: 0.3 };

  // Klatka
  if (has("wyciskanie", "bench", "ław", "pompki", "push-up", "klat", "rozpięt", "butterfly", "pec")) {
    if (has("bark", "military", "ohp", "nad głow", "arnold"))
      return { barki: 0.7, triceps: 0.3 };
    return { klatka: 0.7, triceps: 0.2, barki: 0.1 };
  }

  // Barki
  if (has("wznos", "lateral", "face pull", "opress", "ohp", "military", "arnold", "bark"))
    return { barki: 0.85, triceps: 0.15 };
  if (has("szrugs", "kaptur")) return { barki: 0.6, plecy: 0.4 };

  // Plecy
  if (has("wiosłow", "podciągan", "ściągan", "pull", "lat", "przyciągan", "pendlay", "t-bar"))
    return { plecy: 0.75, biceps: 0.25 };
  if (has("hiper", "prostowan", "good morning")) return { plecy: 0.6, pośladki: 0.4 };

  // Ramiona
  if (has("biceps", "uginanie", "curl", "młotk", "młot ")) return { biceps: 0.9, przedramiona: 0.1 };
  if (has("triceps", "prostowanie rą", "francusk", "kickback", "wąskim"))
    return { triceps: 1 };
  if (has("przedram", "nadgarst", "farmer")) return { przedramiona: 1 };

  // Fallback wg profilu ruchu
  const prof = exerciseProfile(name);
  if (prof.kind === "wyciskanie") return { klatka: 0.55, barki: 0.25, triceps: 0.2 };
  if (prof.kind === "wiosłowanie/podciąganie") return { plecy: 0.7, biceps: 0.3 };
  if (prof.kind === "przysiad/martwy ciąg") return { nogi: 0.55, pośladki: 0.3, plecy: 0.15 };
  if (prof.kind === "brzuch") return { brzuch: 1 };
  return { barki: 0.3, plecy: 0.3, nogi: 0.2, klatka: 0.2 };
}

export type MuscleLoad = {
  group: MuscleGroup;
  label: string;
  volume: number;
  sets: number;
  share: number; // 0–1
};

/** Rozkład objętości i serii po grupach mięśniowych w sesji. */
export function analyzeMuscleLoad(session: Session): MuscleLoad[] {
  const acc = new Map<MuscleGroup, { volume: number; sets: number }>();
  for (const ex of session.exercises) {
    const sets = workingSets(ex.sets);
    if (!sets.length) continue;
    const vol = volume(ex.sets, ex.name);
    const map = musclesForExercise(ex.name);
    const weightSum = Object.values(map).reduce((a, b) => a + (b || 0), 0) || 1;
    for (const [g, w] of Object.entries(map) as [MuscleGroup, number][]) {
      const share = (w || 0) / weightSum;
      const cur = acc.get(g) ?? { volume: 0, sets: 0 };
      cur.volume += vol * share;
      cur.sets += sets.length * share;
      acc.set(g, cur);
    }
  }
  const totalVol = [...acc.values()].reduce((a, b) => a + b.volume, 0) || 1;
  return [...acc.entries()]
    .map(([group, v]) => ({
      group,
      label: MUSCLE_LABEL[group],
      volume: v.volume,
      sets: v.sets,
      share: v.volume / totalVol,
    }))
    .filter((x) => x.share >= 0.03 || x.sets >= 1)
    .sort((a, b) => b.volume - a.volume);
}

/**
 * Inteligentne podsumowanie dnia.
 * Werdykt → objętość → rekordy → obciążenie mięśni → rekomendacje.
 */
export function daySummaryInsights(
  sessions: Session[],
  date: string,
  plan?: WeekPlan,
): SummaryLine[] {
  const p = plan ?? loadPlan();
  const session = sessions.find((s) => s.date === date);
  const s = daySummary(sessions, date, p);
  const lines: SummaryLine[] = [];

  if (session?.rest) {
    return [
      {
        label: "Regeneracja",
        text: "Dzień bez treningu – celowo. Nie wpływa na porównania progresu.",
        tone: "info",
      },
      {
        label: "Rekomendacja",
        text: "Spacer, mobilność lub sen dłuższy o 30–60 min – jutro wrócisz mocniejszy.",
        tone: "info",
      },
    ];
  }
  if (session?.deload) {
    const vol = sessionVolume(session);
    return [
      {
        label: "Deload",
        text: `Lżejszy dzień regeneracyjny: ${Math.round(vol)} kg w ${session.exercises.length} ćwiczeniach.`,
        tone: "info",
      },
      {
        label: "Rekomendacja",
        text: "Trzymaj ok. 50% ciężaru i duży zapas w seriach – nie gonij rekordów w deloadzie.",
        tone: "info",
      },
    ];
  }
  if (!session || session.exercises.length === 0) {
    return [{ text: "Brak zapisanych ćwiczeń – dodaj serie, a tu pojawi się podsumowanie.", tone: "info" }];
  }

  const filled = session.exercises.filter((e) => workingSets(e.sets).length > 0);
  const empty = session.exercises.length - filled.length;

  const changes = filled
    .map((ex) => {
      const prev = previousExercise(sessions, date, ex.name);
      if (!prev) return null;
      const now = volume(ex.sets, ex.name);
      const before = volume(prev.exercise.sets, ex.name);
      if (before <= 0 && now <= 0) return null;
      const pctChange = before > 0 ? ((now - before) / before) * 100 : now > 0 ? 100 : 0;
      const topNow = topWeight(ex.sets);
      const topPrev = topWeight(prev.exercise.sets);
      return {
        name: ex.name.trim() || "Ćwiczenie",
        pct: pctChange,
        now,
        before,
        topNow,
        topPrev,
        weightUp: topNow > topPrev + 0.05,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x))
    .sort((a, b) => b.pct - a.pct);

  const prNames = filled
    .filter((ex) => prFlags(sessions, date, ex).any)
    .map((ex) => ex.name.trim())
    .filter(Boolean);

  const improved = changes.filter((c) => c.pct > 0.5).length;
  const regressed = changes.filter((c) => c.pct < -0.5).length;
  const weightPRs = changes.filter((c) => c.weightUp).length;

  // ——— 1. Werdykt ———
  if (s.pct != null && s.pct >= 8 && (prNames.length >= 2 || improved >= Math.ceil(filled.length * 0.5))) {
    lines.push({
      label: "Werdykt",
      text: `Mocny trening „${s.planName}” – wyraźny progres objętości i wyników.`,
      tone: "good",
    });
  } else if (s.pct != null && s.pct >= 0 && regressed <= 1) {
    lines.push({
      label: "Werdykt",
      text: `Solidny trening „${s.planName}” – utrzymujesz lub budujesz formę.`,
      tone: "good",
    });
  } else if (s.pct != null && s.pct < -8) {
    lines.push({
      label: "Werdykt",
      text: `Lżejszy dzień „${s.planName}” (${s.pct.toFixed(0)}% objętości). OK przy zmęczeniu – nie zaniżaj techniki.`,
      tone: "bad",
    });
  } else if (s.pct == null) {
    lines.push({
      label: "Werdykt",
      text: `Pierwszy zapisany „${s.planName}” – to baza do kolejnych porównań.`,
      tone: "info",
    });
  } else {
    lines.push({
      label: "Werdykt",
      text: `Stabilny trening „${s.planName}” – bez dużych wahań objętości.`,
      tone: "info",
    });
  }

  // ——— 2. Objętość ———
  const volMain = `${Math.round(s.volume).toLocaleString("pl-PL")} kg · ${s.sets} serii · ${filled.length} ćw.`;
  if (s.pct != null && s.prevDate) {
    const diff = Math.round(s.volume - s.prevVolume);
    lines.push({
      label: "Objętość",
      text: `${volMain}. Vs ${shortDatePL(s.prevDate)}: ${s.pct >= 0 ? "+" : ""}${s.pct.toFixed(1)}% (${diff >= 0 ? "+" : "−"}${Math.abs(diff).toLocaleString("pl-PL")} kg).`,
      tone: s.pct >= 0 ? "good" : "bad",
    });
  } else {
    lines.push({ label: "Objętość", text: `${volMain}.`, tone: "info" });
  }

  // ——— 3. Rekordy / forma ———
  if (prNames.length > 0) {
    lines.push({
      label: "Rekordy",
      text: `${prNames.length}× PR: ${prNames.slice(0, 4).join(", ")}${prNames.length > 4 ? "…" : ""}.`,
      tone: "good",
    });
  }
  const top = changes[0];
  if (top && top.pct >= 3) {
    lines.push({
      label: "Forma",
      text: `Największy skok: ${top.name} (${top.pct >= 0 ? "+" : ""}${top.pct.toFixed(0)}%${
        top.weightUp ? `, ciężar ${top.topPrev}→${top.topNow} kg` : ""
      }).`,
      tone: "good",
    });
  }
  const worst = changes.length ? changes[changes.length - 1] : null;
  if (worst && worst !== top && worst.pct <= -5) {
    lines.push({
      label: "Uwaga",
      text: `Spadek: ${worst.name} (${worst.pct.toFixed(0)}%). Sprawdź sen, przerwy i dobór ciężaru.`,
      tone: "bad",
    });
  }

  // ——— 4. Obciążenie mięśniowe ———
  const load = analyzeMuscleLoad(session).filter((x) => x.group !== "cardio");
  if (load.length > 0) {
    const top3 = load.slice(0, 3);
    const parts = top3.map(
      (m) => `${m.label} ${Math.round(m.share * 100)}%`,
    );
    lines.push({
      label: "Obciążenie mięśni",
      text: `Głównie: ${parts.join(" · ")} (${Math.round(top3.reduce((a, m) => a + m.share, 0) * 100)}% sesji).`,
      tone: "info",
    });

    // Nierównowaga push/pull lub góra/dół
    const share = (g: MuscleGroup) => load.find((x) => x.group === g)?.share ?? 0;
    const push = share("klatka") + share("barki") + share("triceps");
    const pull = share("plecy") + share("biceps");
    const legs = share("nogi") + share("pośladki") + share("łydki");
    const upper = push + pull;
    if (push > 0.15 && pull > 0.05 && push / Math.max(pull, 0.01) >= 2) {
      lines.push({
        label: "Balans",
        text: `Dominacja push (${Math.round(push * 100)}%) vs pull (${Math.round(pull * 100)}%). Warto dodać wiosłowanie / ściąganie w tym tygodniu.`,
        tone: "bad",
      });
    } else if (pull > 0.15 && push > 0.05 && pull / Math.max(push, 0.01) >= 2) {
      lines.push({
        label: "Balans",
        text: `Dominacja pull (${Math.round(pull * 100)}%) vs push (${Math.round(push * 100)}%). Uzupełnij wyciskaniem lub barkami.`,
        tone: "info",
      });
    } else if (upper > 0.7 && legs < 0.1 && !/nog|leg|poślad/i.test(s.planName)) {
      // tylko informacja gdy plan nie jest "tylko góra"
      lines.push({
        label: "Balans",
        text: "Sesja mocno górna – upewnij się, że w tygodniu masz solidny dzień nóg.",
        tone: "info",
      });
    }

    // Wysoka objętość na jedną grupę
    const heavy = load[0];
    if (heavy && heavy.share >= 0.45 && heavy.sets >= 10) {
      lines.push({
        label: "Obciążenie",
        text: `${heavy.label}: ~${Math.round(heavy.sets)} serii roboczych (${Math.round(heavy.share * 100)}% dnia) – daj tej grupie 48–72 h regeneracji.`,
        tone: "info",
      });
    }
  }

  // ——— 5. Czas ———
  const dur =
    session.durationSec ??
    (session.startTime && session.endTime
      ? Math.round(
          (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000,
        )
      : 0);
  if (dur >= 60) {
    const mins = Math.round(dur / 60);
    const dens = Math.round(s.volume / Math.max(1, mins));
    let pace = "spokojne tempo";
    if (dens >= 120) pace = "wysoka gęstość pracy";
    else if (dens >= 80) pace = "dobre tempo";
    else if (dens < 50 && mins > 75) pace = "długie przerwy lub dużo rozgrzewki";
    lines.push({
      label: "Czas",
      text: `${mins} min · ${dens} kg/min (${pace}).`,
      tone: "info",
    });
  }

  // ——— 6. Rekomendacje (1–2 konkretne) ———
  const recs: SummaryLine[] = [];

  if (empty > 0) {
    recs.push({
      label: "Rekomendacja",
      text: `Uzupełnij ${empty} ćwiczeń bez serii – bez tego progres i obciążenie mięśni są zaniżone.`,
      tone: "info",
    });
  }

  const gap = s.prevDate ? daysBetween(s.prevDate, date) : 0;
  if (gap >= 10) {
    recs.push({
      label: "Rekomendacja",
      text: `${gap} dni od ostatniego „${s.planName}” – kolejne 1–2 sesje zacznij ostrożniej (90–95% ciężaru).`,
      tone: "info",
    });
  }

  if (s.pct != null && s.pct > 25 && gap > 0 && gap < 7) {
    recs.push({
      label: "Rekomendacja",
      text: "Duży skok objętości w <7 dni – zaplanuj lżejszy dzień lub dłuższą regenerację przed powtórzeniem tego bloku.",
      tone: "info",
    });
  }

  if (prNames.length >= 3 && (s.pct == null || s.pct >= 0)) {
    recs.push({
      label: "Rekomendacja",
      text: "Seria rekordów – na kolejnej sesji tego typu trzymaj ciężar i domykaj zakres powtórzeń, zamiast znów mocno podbijać obciążenie.",
      tone: "good",
    });
  }

  if (worst && worst.pct <= -10) {
    recs.push({
      label: "Rekomendacja",
      text: `Przy ${worst.name} zejdź o 1 serię lub −5–10% ciężaru i dopnij technikę – odbicie objętości przyjdzie szybciej.`,
      tone: "info",
    });
  }

  // Brak brzucha przy długiej sesji siłowej
  const hasCore = load.some((m) => m.group === "brzuch" && m.sets >= 2);
  if (!hasCore && s.sets >= 15 && dur >= 45 * 60) {
    recs.push({
      label: "Rekomendacja",
      text: "Brak pracy core w tej sesji – 2–3 serie deski / spięć na koniec poprawią stabilizację na kolejnych treningach.",
      tone: "info",
    });
  }

  // Domyślna rekomendacja gdy brak innych
  if (recs.length === 0) {
    if (s.pct != null && s.pct >= 0 && improved >= 1) {
      recs.push({
        label: "Rekomendacja",
        text: "Kontynuuj double progression: gdy wszystkie serie w górnym zakresie powtórzeń – dołóż najmniejszy możliwy skok ciężaru.",
        tone: "good",
      });
    } else {
      recs.push({
        label: "Rekomendacja",
        text: "Na kolejny raz zapisz te same ćwiczenia i celuj w +1 powtórzenie lub równe serie – mały, stały progres bije jednorazowe skoki.",
        tone: "info",
      });
    }
  }

  // Max 2 rekomendacje
  lines.push(...recs.slice(0, 2));

  // Czytelność: nie więcej niż 10 linii
  return lines.slice(0, 10);
}

/** Rozpoznaje powtórzenia lub czas: "12", "40s", "40 sek", "1:20", "1min 20s". */
export function parseRepsOrTime(raw: string): { reps: number; timeSec?: number } {
  const t = raw.trim().toLowerCase().replace(",", ".");
  if (!t) return { reps: 0 };
  const colon = t.match(/^(\d+):(\d{1,2})$/);
  if (colon) return { reps: 0, timeSec: Number(colon[1]) * 60 + Number(colon[2]) };
  const min = t.match(/(\d+(?:\.\d+)?)\s*(?:m|min|mins|minut[ay]?|minutes?)(?![a-z])/);
  const sec = t.match(/(\d+)\s*(?:s|sek|sec|sekund[ay]?|seconds?)(?![a-z])/);
  if (min || sec) {
    const total = Math.round((min ? Number(min[1]) * 60 : 0) + (sec ? Number(sec[1]) : 0));
    return { reps: 0, timeSec: total };
  }
  const n = parseInt(t, 10);
  return { reps: Number.isFinite(n) && n > 0 ? n : 0 };
}

export function formatTime(sec: number): string {
  if (sec < 60) return `${sec} s`;
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

/** Tekst powtórzeń/czasu do historii i podsumowań. */
export function formatRepsOrTime(s: { reps: number; timeSec?: number }): string {
  return s.timeSec ? formatTime(s.timeSec) : String(s.reps || 0);
}
