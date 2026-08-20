export type SetEntry = {
  reps: number;
  weight: number;
  note?: string;
  warmup?: boolean;
  restSec?: number;
};

export type Exercise = {
  id: string;
  name: string;
  sets: SetEntry[];
  photo?: string; // data URL
};

export type Session = {
  date: string; // YYYY-MM-DD
  exercises: Exercise[];
  note?: string;
  photo?: string;
};

export type Template = {
  id: string;
  name: string;
  exercises: { name: string; sets: SetEntry[] }[];
};

const KEY = "trening-dziennik-v1";
const TEMPLATE_KEY = "trening-szablony-v1";

const PLAN_KEY = "trening-rozklad-v1";

export type WeekPlan = Record<number, string>;

export const DEFAULT_DAY_PLAN: WeekPlan = {
  0: "Brzuch",
  1: "Ręce i barki",
  2: "Nogi i brzuch",
  3: "Klata i plecy",
  4: "Ręce i barki",
  5: "Nogi i brzuch",
  6: "Klata i plecy",
};

/** Zapisany (edytowalny) rozkład tygodnia. */
export function loadPlan(): WeekPlan {
  if (typeof window === "undefined") return { ...DEFAULT_DAY_PLAN };
  try {
    const raw = window.localStorage.getItem(PLAN_KEY);
    if (!raw) return { ...DEFAULT_DAY_PLAN };
    const parsed = JSON.parse(raw) as Partial<WeekPlan>;
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

export function planForDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return DAY_PLAN[d.getDay()] ?? "";
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

export function volume(sets: SetEntry[]): number {
  return workingSets(sets).reduce((sum, s) => sum + (s.reps || 0) * (s.weight || 0), 0);
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

/** Wszystkie wystąpienia ćwiczenia posortowane rosnąco po dacie. */
export function exerciseHistory(sessions: Session[], name: string): ExerciseStat[] {
  const norm = normalizeName(name);
  if (!norm) return [];
  const out: ExerciseStat[] = [];
  for (const s of sessions) {
    for (const ex of s.exercises) {
      if (normalizeName(ex.name) !== norm) continue;
      if (workingSets(ex.sets).length === 0) continue;
      out.push({
        date: s.date,
        sets: ex.sets,
        volume: volume(ex.sets),
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
): { session: Session; exercise: Exercise } | null {
  const norm = normalizeName(name);
  const earlier = sessions
    .filter((s) => s.date < date)
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
    volumePct: pct(volume(exercise.sets), volume(prev.exercise.sets)),
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
    volume: volume(exercise.sets),
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

/**
 * Podpowiedzi na następny trening – double progression:
 * najpierw dobijamy powtórzenia w zakresie, potem dokładamy ciężar.
 */
export function nextSessionSuggestions(
  sessions: Session[],
  date: string,
  name: string,
  repRange: [number, number] = [8, 12],
): Suggestion[] {
  const hist = exerciseHistory(sessions, name).filter((h) => h.date <= date);
  const last = hist[hist.length - 1];
  if (!last) return [];
  const out: Suggestion[] = [];
  const sets = workingSets(last.sets);
  const count = sets.length;
  const minReps = Math.min(...sets.map((s) => s.reps || 0));
  const topW = last.top;
  const [lo, hi] = repRange;

  if (minReps >= hi) {
    const nextW = roundStep(topW * 1.025);
    out.push({
      tone: "up",
      text: `Ostatnio ${count}×${minReps}@${topW} kg – zakres domknięty. Dołóż ciężar: ${count}×${lo}@${nextW} kg.`,
    });
  } else {
    const nextW = roundStep(topW + 2.5);
    out.push({
      tone: "info",
      text: `Ostatnio ${count}×${minReps}@${topW} kg. Celuj w ${count}×${Math.min(minReps + 1, hi)}@${topW} kg (albo ${count}×${minReps}@${nextW} kg jeśli czujesz zapas).`,
    });
  }

  // objętość vs ciężar
  const prev = hist[hist.length - 2];
  if (prev) {
    if (last.volume > prev.volume && last.top < prev.top) {
      out.push({
        tone: "warn",
        text: `Objętość wzrosła, ale ciężar spadł (${prev.top} → ${last.top} kg). Wróć do ${prev.top} kg i dołóż 1–2 powtórzenia.`,
      });
    }
    if (last.e1rm > prev.e1rm) {
      out.push({
        tone: "up",
        text: `Estymowany 1RM rośnie (${prev.e1rm.toFixed(1)} → ${last.e1rm.toFixed(1)} kg) – trzymaj obecną progresję.`,
      });
    }
  }

  // seria regresji
  const tail = hist.slice(-4);
  let streak = 0;
  for (let i = tail.length - 1; i > 0; i--) {
    const a = tail[i];
    const b = tail[i - 1];
    if (a && b && a.volume < b.volume && a.e1rm <= b.e1rm) streak++;
    else break;
  }
  if (streak >= 3) {
    out.push({
      tone: "warn",
      text: `To już ${streak}. trening z rzędu z regresją – rozważ deload (−10% ciężaru) lub zmianę wariantu ćwiczenia.`,
    });
  }

  return out;
}

export type DaySummary = {
  volume: number;
  prevVolume: number;
  pct: number | null;
  prCount: number;
  improved: number;
  exercises: number;
  sets: number;
};

export function daySummary(sessions: Session[], date: string): DaySummary {
  const session = sessions.find((s) => s.date === date);
  const exercises = session?.exercises ?? [];
  let vol = 0;
  let prevVol = 0;
  let prCount = 0;
  let improved = 0;
  let sets = 0;
  for (const ex of exercises) {
    vol += volume(ex.sets);
    sets += workingSets(ex.sets).length;
    const prev = previousExercise(sessions, date, ex.name);
    if (prev) {
      const pv = volume(prev.exercise.sets);
      prevVol += pv;
      if (volume(ex.sets) > pv) improved++;
    }
    const flags = prFlags(sessions, date, ex);
    if (flags.any) prCount++;
  }
  return {
    volume: vol,
    prevVolume: prevVol,
    pct: prevVol > 0 ? ((vol - prevVol) / prevVol) * 100 : null,
    prCount,
    improved,
    exercises: exercises.length,
    sets,
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
