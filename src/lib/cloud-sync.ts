import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  loadPlan,
  loadSessions,
  savePlan,
  saveSessions,
  sessionVolume,
  workingSets,
  type Session,
  type WeekPlan,
} from "./workout-store";

export const WORKOUTS_UPDATED = "workouts-updated";

function emit() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(WORKOUTS_UPDATED));
}

export function stampSession(session: Session): Session {
  return { ...session, updatedAt: new Date().toISOString() };
}

function stamp(session: Session): string {
  return session.updatedAt ?? `${session.date}T00:00:00.000Z`;
}

function sessionSetCount(session: Session): number {
  return session.exercises.reduce((n, ex) => n + workingSets(ex.sets).length, 0);
}

type CloudRow = { date: string; data: Record<string, unknown>; updated_at: string };

/** Dwukierunkowa synchronizacja: nowszy zapis (lokalny lub w chmurze) wygrywa. */
export async function syncNow(userId: string): Promise<{ pulled: number; pushed: number }> {
  const local = loadSessions();
  const { data, error } = await supabase
    .from("workout_days")
    .select("date, data, updated_at")
    .eq("user_id", userId);
  if (error) throw error;
  const rows = (data ?? []) as CloudRow[];

  const merged = new Map<string, Session>();
  for (const s of local) merged.set(s.date, s);

  let pulled = 0;
  const cloudStamp = new Map<string, string>();
  for (const row of rows) {
    const payload = row.data as unknown as Partial<Session>;
    const cloudSession: Session = {
      ...payload,
      date: row.date,
      exercises: payload.exercises ?? [],
      updatedAt: payload.updatedAt ?? row.updated_at,
    };
    cloudStamp.set(row.date, stamp(cloudSession));
    const localSession = merged.get(row.date);
    if (!localSession || stamp(cloudSession) > stamp(localSession)) {
      merged.set(row.date, cloudSession);
      pulled++;
    }
  }

  const list = [...merged.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
  saveSessions(list);

  const toPush = list.filter((s) => {
    const cs = cloudStamp.get(s.date);
    return !cs || stamp(s) > cs;
  });
  if (toPush.length > 0) {
    const { error: pushError } = await supabase.from("workout_days").upsert(
      toPush.map((s) => ({
        user_id: userId,
        date: s.date,
        data: {
          ...s,
          volume: sessionVolume(s),
          sets: sessionSetCount(s),
        } as unknown as Json,
        updated_at: new Date().toISOString(),
      })),
      { onConflict: "user_id,date" },
    );
    if (pushError) throw pushError;
  }

  await syncPlan(userId);
  emit();
  return { pulled, pushed: toPush.length };
}

async function syncPlan(userId: string) {
  const localPlan = loadPlan();
  const { data } = await supabase
    .from("user_settings")
    .select("week_plan, updated_at")
    .eq("user_id", userId)
    .maybeSingle();
  const cloudPlan = (data?.week_plan ?? null) as WeekPlan | null;
  if (cloudPlan && Object.keys(cloudPlan).length > 0) {
    savePlan({ ...localPlan, ...cloudPlan });
  } else {
    await supabase
      .from("user_settings")
      .upsert(
        { user_id: userId, week_plan: localPlan as unknown as Json, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
  }
}

export async function pushPlan(userId: string, plan: WeekPlan) {
  await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      week_plan: plan as unknown as Json,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );
}
