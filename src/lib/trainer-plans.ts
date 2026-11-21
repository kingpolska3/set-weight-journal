import { supabase } from "@/integrations/supabase/client";

export type PlanSet = {
  reps: string;
  weight: string;
  warmup?: boolean;
  restSec?: number | undefined;
  note?: string;
};

export type PlanExercise = {
  id: string;
  name: string;
  sets: PlanSet[];
  note: string;
  rest?: string;
  range?: string;
  /** aliasy używane w UI */
  coachNote?: string;
  coachRest?: string;
  coachRange?: string;
};

export type PlanDay = {
  id: string;
  name: string;
  exercises: PlanExercise[];
  weekday?: string;
};

export type Client = {
  id: string;
  name: string;
  goal: string;
  days: PlanDay[];
  trainingDays?: string[];
  intake?: Record<string, string>;
};

export type Access = "owner" | "edit" | "view" | "local";
export type LinkAccess = "none" | "view" | "edit";

export type PlanRow = {
  id: string;
  owner_id: string;
  data: Client;
  link_token: string;
  link_access: LinkAccess;
  access: Access;
};

export type ShareEntry = {
  user_id: string;
  display_name: string | null;
  username: string | null;
  can_edit: boolean;
};

type Loose = {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  rpc: (f: string, a?: Record<string, unknown>) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
const db = supabase as unknown as Loose;

export const LOCAL_KEY = "trainer-plans-v1";

function normalizeExercise(ex: PlanExercise): PlanExercise {
  return {
    ...ex,
    note: ex.note || ex.coachNote || "",
    rest: ex.rest || ex.coachRest || "",
    range: ex.range || ex.coachRange || "",
    coachNote: ex.coachNote || ex.note || "",
    coachRest: ex.coachRest || ex.rest || "",
    coachRange: ex.coachRange || ex.range || "",
    sets: (ex.sets || []).map((s) => ({ ...s })),
  };
}

function normalizeClient(data: Client): Client {
  return {
    ...data,
    goal: data.goal || data.intake?.goal || "",
    trainingDays: data.trainingDays || [],
    intake: data.intake || {},
    days: (data.days || []).map((d) => ({
      ...d,
      exercises: (d.exercises || []).map(normalizeExercise),
    })),
  };
}

/** Publiczna część planu (dni, ćwiczenia) – pełny blob w trainer_plans. */
function planPayload(data: Client): Client {
  const n = normalizeClient(data);
  return {
    id: n.id,
    name: n.name,
    goal: n.goal,
    days: n.days,
    trainingDays: n.trainingDays,
    // intake też w blobie – dzięki temu nic nie ginie, nawet bez private
    intake: n.intake,
  };
}

function privatePayload(data: Client) {
  const n = normalizeClient(data);
  return {
    intake: n.intake ?? {},
    goal: n.goal ?? "",
    trainingDays: n.trainingDays ?? [],
  };
}

export async function fetchPlans(userId: string): Promise<PlanRow[]> {
  const [{ data: plans, error }, { data: shares }, { data: privateRows }] =
    await Promise.all([
      db.from("trainer_plans").select("id, owner_id, data, link_token, link_access").order("created_at"),
      db.from("plan_shares").select("plan_id, can_edit").eq("user_id", userId),
      db.from("trainer_client_private").select("plan_id, data"),
    ]);
  if (error) throw error;

  const intake = new Map(
    (privateRows ?? []).map((p: { plan_id: string; data: Partial<Client> }) => [
      p.plan_id,
      p.data as Partial<Client>,
    ]),
  );
  const sh = new Map<string, boolean>(
    (shares ?? []).map((s: { plan_id: string; can_edit: boolean }) => [s.plan_id, s.can_edit]),
  );

  return (plans ?? []).map((p: Omit<PlanRow, "access" | "data"> & { data: Client }) => {
    const priv = intake.get(p.id);
    const merged =
      p.owner_id === userId
        ? normalizeClient({
            ...p.data,
            ...priv,
            intake: { ...(p.data?.intake || {}), ...(priv?.intake || {}) },
            goal: priv?.goal || p.data?.goal || "",
            trainingDays: priv?.trainingDays || p.data?.trainingDays || [],
          })
        : normalizeClient({ ...p.data, goal: "", intake: {} });
    return {
      ...p,
      data: merged,
      access: (p.owner_id === userId
        ? "owner"
        : sh.has(p.id)
          ? sh.get(p.id)
            ? "edit"
            : "view"
          : "view") as Access,
    };
  });
}

export async function createPlan(userId: string, data: Client): Promise<PlanRow> {
  const payload = planPayload(data);
  const { data: row, error } = await db
    .from("trainer_plans")
    .insert({ owner_id: userId, data: payload })
    .select("id, owner_id, data, link_token, link_access")
    .single();
  if (error) throw error;

  try {
    await db.from("trainer_client_private").upsert(
      {
        plan_id: row.id,
        data: privatePayload(data),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "plan_id" },
    );
  } catch {
    /* private opcjonalne */
  }

  return { ...row, data: normalizeClient(data), access: "owner" };
}

/** Zapis całego planu: trainer_plans + trainer_client_private (intake / cel). */
export async function savePlanData(id: string, data: Client) {
  const payload = planPayload(data);
  const { error } = await db
    .from("trainer_plans")
    .update({ data: payload })
    .eq("id", id);
  if (error) throw error;

  try {
    await db.from("trainer_client_private").upsert(
      {
        plan_id: id,
        data: privatePayload(data),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "plan_id" },
    );
  } catch {
    /* brak tabeli / RLS – plan i tak jest w trainer_plans */
  }
}

export async function deletePlan(id: string) {
  try {
    await db.from("trainer_client_private").delete().eq("plan_id", id);
  } catch {
    /* ignore */
  }
  const { error } = await db.from("trainer_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function leavePlan(id: string, userId: string) {
  const { error } = await db.from("plan_shares").delete().eq("plan_id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function setLinkAccess(id: string, access: LinkAccess) {
  // Wyłączenie linku: rotacja tokena + unieważnienie share z grant_source=link
  if (access === "none") {
    const { error } = await db.rpc("revoke_plan_link", { _plan: id });
    if (error) {
      // fallback bez RPC
      const { error: e2 } = await db
        .from("trainer_plans")
        .update({ link_access: "none" })
        .eq("id", id);
      if (e2) throw e2;
    }
    return;
  }
  const { error } = await db.from("trainer_plans").update({ link_access: access }).eq("id", id);
  if (error) throw error;
}

export async function sharePlan(id: string, ident: string, canEdit: boolean): Promise<string> {
  const { data, error } = await db.rpc("share_plan", {
    _plan: id,
    _ident: ident,
    _can_edit: canEdit,
  });
  if (error) throw error;
  return data as string;
}

export async function listShares(id: string): Promise<ShareEntry[]> {
  const { data, error } = await db.rpc("list_plan_shares", { _plan: id });
  if (error) throw error;
  return (data ?? []) as ShareEntry[];
}

export async function removeShare(id: string, userId: string) {
  const { error } = await db.from("plan_shares").delete().eq("plan_id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function claimLink(token: string): Promise<string | null> {
  const { data, error } = await db.rpc("claim_plan_link", { _token: token });
  if (error) throw error;
  return (data as string) || null;
}

/**
 * Pełna synchronizacja sekcji planów po zalogowaniu:
 * zwraca aktualne plany z chmury (owner + udostępnione).
 */
export async function syncTrainerPlansFromCloud(userId: string): Promise<PlanRow[]> {
  return fetchPlans(userId);
}

/**
 * Zapisuje plan i publikuje snapshot dla podopiecznych (received plans).
 * Klienci z share / claim pobierają to przez pullPublishedPlansForUser.
 */
export async function publishPlanUpdate(id: string, data: Client): Promise<void> {
  await savePlanData(id, data);
  const snapshot = planPayload(data);
  const now = new Date().toISOString();
  const { error } = await db
    .from("trainer_plans")
    .update({
      data: snapshot,
      published_data: snapshot,
      published_at: now,
    })
    .eq("id", id);
  if (error) {
    // fallback bez kolumn published_*
    const { error: e2 } = await db.from("trainer_plans").update({ data: snapshot }).eq("id", id);
    if (e2) throw e2;
    throw new Error(
      "Brak kolumn published_data/published_at – uruchom SQL migracji. Plan zapisany, ale publikacja ograniczona.",
    );
  }
}

/** Pobiera opublikowane snapshoty planów udostępnionych zalogowanemu userowi. */
export async function fetchPublishedPlansForUser(
  userId: string,
): Promise<{ id: string; data: Client; published_at: string; owner_id: string }[]> {
  const { data: shares, error: shErr } = await db
    .from("plan_shares")
    .select("plan_id")
    .eq("user_id", userId);
  if (shErr) throw shErr;
  const ids = (shares ?? []).map((s: { plan_id: string }) => s.plan_id);
  if (!ids.length) return [];

  const { data: plans, error } = await db
    .from("trainer_plans")
    .select("id, owner_id, data, published_data, published_at")
    .in("id", ids);
  if (error) throw error;

  return (plans ?? [])
    .map(
      (p: {
        id: string;
        owner_id: string;
        data: Client;
        published_data?: Client | null;
        published_at?: string | null;
      }) => {
        const payload = (p.published_data || p.data) as Client;
        if (!payload) return null;
        return {
          id: p.id,
          owner_id: p.owner_id,
          data: normalizeClient(payload),
          published_at: p.published_at || new Date().toISOString(),
        };
      },
    )
    .filter(Boolean) as { id: string; data: Client; published_at: string; owner_id: string }[];
}

