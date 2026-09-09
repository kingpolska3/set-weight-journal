import { volume, workingSets, type Session } from "@/lib/workout-store";

export type MuscleKey =
  | "klatka"
  | "plecy-gora"
  | "plecy-dol"
  | "barki"
  | "biceps"
  | "triceps"
  | "przedramiona"
  | "brzuch"
  | "uda-przod"
  | "uda-tyl"
  | "posladki"
  | "lydki";

export const MUSCLE_LABELS: Record<MuscleKey, string> = {
  klatka: "Klatka",
  "plecy-gora": "Plecy (góra)",
  "plecy-dol": "Plecy (dół)",
  barki: "Barki",
  biceps: "Biceps",
  triceps: "Triceps",
  przedramiona: "Przedramiona",
  brzuch: "Brzuch",
  "uda-przod": "Uda przód (czworogłowy)",
  "uda-tyl": "Uda tył (dwugłowy)",
  posladki: "Pośladki",
  lydki: "Łydki",
};

export const MUSCLE_KEYS = Object.keys(MUSCLE_LABELS) as MuscleKey[];

/** Słowa kluczowe rozpoznawane w nazwie ćwiczenia (bez polskich znaków). */
const RULES: { match: string[]; muscles: MuscleKey[] }[] = [
  { match: ["lawa", "wyciskanie sztanga", "rozpietki", "butterfly", "pompki", "klata", "klatka", "sciaganie na ramionach"], muscles: ["klatka"] },
  { match: ["podciaganie", "wiosl", "sciaganie wyciag", "sciaganie gorny", "drazek", "sciaganie linka", "pullover", "sciaganie proste"], muscles: ["plecy-gora"] },
  { match: ["martwy", "hiperekstensja", "prostowniki", "dol plecow", "good morning"], muscles: ["plecy-dol"] },
  { match: ["bark", "arnold", "unoszenie bokiem", "unoszenie przodem", "ohp", "zolnierski", "face pull", "wyciskanie nad glowa"], muscles: ["barki"] },
  { match: ["biceps", "uginanie ramion", "modlitewnik", "mlotk"], muscles: ["biceps"] },
  { match: ["triceps", "wyciskanie francuskie", "prostowanie ramion", "dipy", "pompki na poreczach"], muscles: ["triceps"] },
  { match: ["przedrami", "nadgarst", "farmer"], muscles: ["przedramiona"] },
  { match: ["brzuch", "brzuszki", "plank", "deska", "spiecia", "allahy", "unoszenie nog", "kolka ab"], muscles: ["brzuch"] },
  { match: ["przysiad", "hack", "wypychanie", "prostowanie nog", "suwnica", "wykrok", "leg press"], muscles: ["uda-przod"] },
  { match: ["uginanie nog", "dwuglowe ud", "rumun", "sztywnych nogach"], muscles: ["uda-tyl"] },
  { match: ["posladk", "hip thrust", "odwodzenie nog", "glute"], muscles: ["posladki"] },
  { match: ["lydk", "wspiecia na palce", "calf"], muscles: ["lydki"] },
];

function simplify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/\s+/g, " ")
    .trim();
}

export function musclesForExercise(name: string): MuscleKey[] {
  const n = simplify(name);
  const found = new Set<MuscleKey>();
  for (const rule of RULES) {
    if (rule.match.some((m) => n.includes(m))) rule.muscles.forEach((mk) => found.add(mk));
  }
  return [...found];
}

export type MuscleStat = {
  key: MuscleKey;
  label: string;
  volume: number;
  sessions: number;
  sets: number;
  lastDate: string | null;
  share: number; // 0..1 udział w całej objętości
  intensity: number; // 0..1 względem najmocniej trenowanej partii
};

export function muscleStats(sessions: Session[]): { stats: Record<MuscleKey, MuscleStat>; total: number } {
  const stats = {} as Record<MuscleKey, MuscleStat>;
  for (const key of MUSCLE_KEYS) {
    stats[key] = {
      key,
      label: MUSCLE_LABELS[key],
      volume: 0,
      sessions: 0,
      sets: 0,
      lastDate: null,
      share: 0,
      intensity: 0,
    };
  }

  for (const s of sessions) {
    if (s.rest) continue;
    const touched = new Set<MuscleKey>();
    for (const ex of s.exercises) {
      const muscles = musclesForExercise(ex.name);
      if (muscles.length === 0) continue;
      const vol = volume(ex.sets, ex.name);
      const sets = workingSets(ex.sets).length;
      for (const m of muscles) {
        const stat = stats[m];
        stat.volume += vol / muscles.length;
        stat.sets += sets;
        touched.add(m);
      }
    }
    for (const m of touched) {
      const stat = stats[m];
      stat.sessions += 1;
      if (!stat.lastDate || s.date > stat.lastDate) stat.lastDate = s.date;
    }
  }

  const total = MUSCLE_KEYS.reduce((sum, k) => sum + stats[k].volume, 0);
  const max = Math.max(...MUSCLE_KEYS.map((k) => stats[k].volume), 0);
  for (const key of MUSCLE_KEYS) {
    stats[key].share = total > 0 ? stats[key].volume / total : 0;
    stats[key].intensity = max > 0 ? stats[key].volume / max : 0;
  }
  return { stats, total };
}

export type Level = 0 | 1 | 2 | 3;

export function levelFor(intensity: number): Level {
  if (intensity <= 0) return 0;
  if (intensity < 0.34) return 1;
  if (intensity < 0.7) return 2;
  return 3;
}

export const LEVEL_FILL: Record<Level, string> = {
  0: "oklch(0.32 0.01 285)",
  1: "oklch(0.36 0.11 300)",
  2: "oklch(0.52 0.19 300)",
  3: "oklch(0.72 0.23 300)",
};

export const LEVEL_LABEL: Record<Level, string> = {
  0: "Nie trenowane",
  1: "Słabo",
  2: "Średnio",
  3: "Mocno zaangażowane",
};
