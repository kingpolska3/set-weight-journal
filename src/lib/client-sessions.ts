import type { Client, PlanDay, PlanExercise, PlanSet } from "@/lib/trainer-plans";
import { parseRestToSeconds } from "@/lib/received-plans";
import {
  todayISO,
  uid,
  type Exercise,
  type Session,
  type SetEntry,
} from "@/lib/workout-store";

/** Jedna sesja treningowa zalogowana u konkretnego podopiecznego (przez trenera). */
export type ClientSession = {
  id: string;
  planId: string;
  clientName: string;
  date: string; // YYYY-MM-DD
  dayId?: string;
  dayName: string;
  exercises: Exercise[];
  note?: string;
  startedAt?: string; // ISO
  endedAt?: string; // ISO
};

const KEY = "trainer-client-sessions-v1";

function loadAll(): ClientSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClientSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAll(list: ClientSession[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota */
  }
}

/** Wszystkie sesje danego podopiecznego (planId), od najnowszej. */
export function loadClientSessions(planId: string): ClientSession[] {
  return loadAll()
    .filter((s) => s.planId === planId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Wszystkie sesje coachingu (wszyscy podopieczni). */
export function loadAllClientSessions(): ClientSession[] {
  return loadAll().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Zapisz / nadpisz sesję (po id). */
export function saveClientSession(session: ClientSession): ClientSession[] {
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === session.id);
  const next =
    idx >= 0
      ? all.map((s, i) => (i === idx ? session : s))
      : [session, ...all];
  saveAll(next);
  return next.filter((s) => s.planId === session.planId);
}

export function removeClientSession(id: string): void {
  saveAll(loadAll().filter((s) => s.id !== id));
}

/** Sesja z danego dnia dla planu (jeśli jest). */
export function getClientSessionOnDate(
  planId: string,
  date: string,
): ClientSession | undefined {
  return loadAll().find((s) => s.planId === planId && s.date === date);
}

function planSetToEntry(s: PlanSet, rangeHint: string, restSec?: number): SetEntry {
  const repsRaw = ((s.reps || "").trim() || rangeHint).toLowerCase();
  const weight = Number(String(s.weight || "0").replace(",", ".")) || 0;

  const minMatch = repsRaw.match(/^(\d+(?:[.,]\d+)?)\s*min/);
  if (minMatch) {
    const mins = parseFloat(minMatch[1].replace(",", "."));
    return {
      reps: 0,
      weight,
      timeSec: Math.round(mins * 60),
      warmup: !!s.warmup,
      ...(restSec ? { restSec } : {}),
    };
  }

  if (/^\d+:\d+$/.test(repsRaw)) {
    const [m, sec] = repsRaw.split(":").map(Number);
    return {
      reps: 0,
      weight,
      timeSec: (m || 0) * 60 + (sec || 0),
      warmup: !!s.warmup,
      ...(restSec ? { restSec } : {}),
    };
  }

  if (repsRaw.includes("s") || repsRaw.includes("sek")) {
    const n = parseInt(repsRaw, 10) || 0;
    return {
      reps: 0,
      weight,
      timeSec: n,
      warmup: !!s.warmup,
      ...(restSec ? { restSec } : {}),
    };
  }

  const range = repsRaw.match(/(\d+)\s*[–\-]\s*(\d+)/);
  const reps = range ? Number(range[2]) : parseInt(repsRaw, 10) || 0;
  return {
    reps,
    weight,
    warmup: !!s.warmup,
    ...(restSec ? { restSec } : {}),
  };
}

function exerciseFromPlan(ex: PlanExercise): Exercise {
  const rangeHint = (ex.range || "").trim();
  const restSec = parseRestToSeconds(ex.rest);
  const baseSets =
    ex.sets.length > 0
      ? ex.sets
      : [{ reps: rangeHint || "8-12", weight: "", warmup: false }];

  const sets = baseSets.map((s) => planSetToEntry(s, rangeHint, restSec));

  const extra = [rangeHint ? `Zakres: ${rangeHint}` : "", ex.note?.trim() || ""]
    .filter(Boolean)
    .join(" · ");
  if (extra && sets.length) {
    const idx = sets.findIndex((s) => !s.warmup);
    const target = idx >= 0 ? idx : 0;
    sets[target] = {
      ...sets[target],
      note: [sets[target].note, extra].filter(Boolean).join(" · "),
    };
  }

  return { id: uid(), name: ex.name || "Ćwiczenie", sets };
}

/**
 * Buduje roboczą sesję coachingu z dnia planu podopiecznego.
 * Nie zapisuje jeszcze — zapis przy „Zakończ trening”.
 */
export function planDayToClientSession(
  planId: string,
  client: Client,
  day: PlanDay,
  date = todayISO(),
): ClientSession {
  return {
    id: uid(),
    planId,
    clientName: client.name || "Podopieczny",
    date,
    dayId: day.id,
    dayName: day.name || day.weekday || "Trening",
    exercises: day.exercises.map(exerciseFromPlan),
    note: "",
    startedAt: new Date().toISOString(),
  };
}

/** Pusta sesja (wolny trening z podopiecznym, bez dnia z planu). */
export function emptyClientSession(
  planId: string,
  client: Client,
  date = todayISO(),
): ClientSession {
  return {
    id: uid(),
    planId,
    clientName: client.name || "Podopieczny",
    date,
    dayName: "Wolny trening",
    exercises: [],
    note: "",
    startedAt: new Date().toISOString(),
  };
}

/** Podgląd jak Session z workout-store (do daySummary itd.). */
export function clientSessionAsSession(s: ClientSession): Session {
  return {
    date: s.date,
    exercises: s.exercises,
    note: s.note,
  };
}
