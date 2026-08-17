export type SetEntry = {
  reps: number;
  weight: number;
  note?: string;
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
};

const KEY = "trening-dziennik-v1";

export const DAY_PLAN: Record<number, string> = {
  0: "Brzuch",
  1: "Ręce i barki",
  2: "Nogi i brzuch",
  3: "Klata i plecy",
  4: "Ręce i barki",
  5: "Nogi i brzuch",
  6: "Klata i plecy",
};

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

export function volume(sets: SetEntry[]): number {
  return sets.reduce((sum, s) => sum + (s.reps || 0) * (s.weight || 0), 0);
}

export function topWeight(sets: SetEntry[]): number {
  return sets.reduce((m, s) => Math.max(m, s.weight || 0), 0);
}

export function totalReps(sets: SetEntry[]): number {
  return sets.reduce((m, s) => m + (s.reps || 0), 0);
}

/** Znajduje poprzedni raz, gdy wykonano to ćwiczenie (przed podaną datą). */
export function previousExercise(
  sessions: Session[],
  date: string,
  name: string,
): { session: Session; exercise: Exercise } | null {
  const norm = name.trim().toLowerCase();
  const earlier = sessions
    .filter((s) => s.date < date)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  for (const s of earlier) {
    const ex = s.exercises.find(
      (e) => e.name.trim().toLowerCase() === norm && e.sets.length > 0,
    );
    if (ex) return { session: s, exercise: ex };
  }
  return null;
}

export type Progress = {
  volumePct: number;
  weightPct: number;
  repsPct: number;
  prevDate: string;
};

export function computeProgress(
  sessions: Session[],
  date: string,
  exercise: Exercise,
): Progress | null {
  const prev = previousExercise(sessions, date, exercise.name);
  if (!prev) return null;
  const pct = (now: number, before: number) =>
    before === 0 ? (now > 0 ? 100 : 0) : ((now - before) / before) * 100;
  return {
    volumePct: pct(volume(exercise.sets), volume(prev.exercise.sets)),
    weightPct: pct(topWeight(exercise.sets), topWeight(prev.exercise.sets)),
    repsPct: pct(totalReps(exercise.sets), totalReps(prev.exercise.sets)),
    prevDate: prev.session.date,
  };
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
