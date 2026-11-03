import type { Client, PlanDay, PlanExercise, PlanSet } from "@/lib/trainer-plans";
import { parseRestToSeconds } from "@/lib/received-plans";
import { supabase } from "@/integrations/supabase/client";
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

type Loose = {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
const db = supabase as unknown as Loose;

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

function mergeSessions(a: ClientSession[], b: ClientSession[]): ClientSession[] {
  const map = new Map<string, ClientSession>();
  for (const s of [...a, ...b]) {
    const prev = map.get(s.id);
    if (!prev) {
      map.set(s.id, s);
      continue;
    }
    const tPrev = prev.endedAt || prev.startedAt || prev.date;
    const tNext = s.endedAt || s.startedAt || s.date;
    map.set(s.id, tNext >= tPrev ? s : prev);
  }
  return [...map.values()].sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
}

export function loadClientSessions(planId: string): ClientSession[] {
  return loadAll()
    .filter((s) => s.planId === planId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function loadAllClientSessions(): ClientSession[] {
  return loadAll().sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function saveClientSession(session: ClientSession): ClientSession[] {
  const all = loadAll();
  const idx = all.findIndex((s) => s.id === session.id);
  const next =
    idx >= 0 ? all.map((s, i) => (i === idx ? session : s)) : [session, ...all];
  saveAll(next);
  return next.filter((s) => s.planId === session.planId);
}

export function removeClientSession(id: string): void {
  saveAll(loadAll().filter((s) => s.id !== id));
}

export function getClientSessionOnDate(
  planId: string,
  date: string,
): ClientSession | undefined {
  return loadAll().find((s) => s.planId === planId && s.date === date);
}

type CloudRow = {
  id: string;
  plan_id: string;
  owner_id: string;
  data: ClientSession;
};

function rowToSession(row: CloudRow): ClientSession {
  const d = row.data || ({} as ClientSession);
  return {
    ...d,
    id: d.id || row.id,
    planId: d.planId || row.plan_id,
  };
}

export async function syncClientSessionsFromCloud(
  planId: string,
): Promise<ClientSession[]> {
  const { data, error } = await db
    .from("trainer_client_sessions")
    .select("id, plan_id, owner_id, data")
    .eq("plan_id", planId);

  if (error) throw error;

  const cloud = ((data ?? []) as CloudRow[]).map(rowToSession);
  const merged = mergeSessions(
    loadAll().filter((s) => s.planId === planId),
    cloud,
  );
  const others = loadAll().filter((s) => s.planId !== planId);
  saveAll([...others, ...merged]);
  return merged.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function saveClientSessionWithCloud(
  session: ClientSession,
  userId?: string | null,
): Promise<ClientSession[]> {
  const local = saveClientSession(session);
  if (!userId) return local;

  const { error } = await db.from("trainer_client_sessions").upsert(
    {
      id: session.id,
      plan_id: session.planId,
      owner_id: userId,
      data: session,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) throw error;
  return local;
}

export async function removeClientSessionWithCloud(
  id: string,
  userId?: string | null,
): Promise<void> {
  removeClientSession(id);
  if (!userId) return;
  const { error } = await db.from("trainer_client_sessions").delete().eq("id", id);
  if (error) throw error;
}

/**
 * Cele z planu → puste pola (wpisujesz wynik).
 * Czas → prevTimeSec; ciężar z planu → prevWeight.
 * Zakres w coachRange (chip w UI), nie w prevReps.
 */
function planSetToEntry(s: PlanSet, rangeHint: string, restSec?: number): SetEntry {
  const explicit = (s.reps || "").trim();
  const hint = explicit || (rangeHint || "").trim();
  const repsRaw = hint.toLowerCase();
  const weightNum = Number(String(s.weight || "0").replace(",", ".")) || 0;

  const minMatch = repsRaw.match(/^(\d+(?:[.,]\d+)?)\s*min/);
  if (minMatch) {
    const mins = parseFloat(minMatch[1].replace(",", "."));
    return {
      reps: 0,
      weight: 0,
      warmup: !!s.warmup,
      prevTimeSec: Math.round(mins * 60),
      ...(weightNum ? { prevWeight: weightNum } : {}),
      ...(restSec ? { restSec } : {}),
    };
  }

  if (/^\d+:\d+$/.test(repsRaw)) {
    const [m, sec] = repsRaw.split(":").map(Number);
    return {
      reps: 0,
      weight: 0,
      warmup: !!s.warmup,
      prevTimeSec: (m || 0) * 60 + (sec || 0),
      ...(weightNum ? { prevWeight: weightNum } : {}),
      ...(restSec ? { restSec } : {}),
    };
  }

  if (repsRaw.includes("s") || repsRaw.includes("sek")) {
    const n = parseInt(repsRaw, 10) || 0;
    return {
      reps: 0,
      weight: 0,
      warmup: !!s.warmup,
      prevTimeSec: n,
      ...(weightNum ? { prevWeight: weightNum } : {}),
      ...(restSec ? { restSec } : {}),
    };
  }

  return {
    reps: 0,
    weight: 0,
    warmup: !!s.warmup,
    ...(weightNum ? { prevWeight: weightNum } : {}),
    ...(restSec ? { restSec } : {}),
  };
}

function exerciseFromPlan(ex: PlanExercise): Exercise {
  const rangeHint = (ex.range || "").trim();
  const restLabel = (ex.rest || "").trim();
  const restSec = parseRestToSeconds(ex.rest);
  const baseSets =
    ex.sets.length > 0
      ? ex.sets
      : [{ reps: rangeHint || "", weight: "", warmup: false }];

  const sets = baseSets.map((s) => planSetToEntry(s, rangeHint, restSec));

  if (ex.note?.trim() && sets.length) {
    const idx = sets.findIndex((s) => !s.warmup);
    const target = idx >= 0 ? idx : 0;
    sets[target] = {
      ...sets[target],
      note: [sets[target].note, ex.note.trim()].filter(Boolean).join(" · "),
    };
  }

  // Rozgrzewka zawsze na górze
  sets.sort((a, b) => Number(!!b.warmup) - Number(!!a.warmup));

  return {
    id: uid(),
    name: ex.name || "Ćwiczenie",
    sets,
    ...(rangeHint ? { coachRange: rangeHint } : {}),
    ...(restLabel ? { coachRest: restLabel } : {}),
  };
}

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

export function clientSessionAsSession(s: ClientSession): Session {
  return {
    date: s.date,
    exercises: s.exercises,
    note: s.note,
  };
}
