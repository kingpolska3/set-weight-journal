import { supabase } from "@/integrations/supabase/client";

export type PlanSet = { reps: string; weight: string; warmup?: boolean };
export type PlanExercise = { id: string; name: string; sets: PlanSet[]; note: string };
export type PlanDay = { id: string; name: string; exercises: PlanExercise[]; weekday?: string };
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

export type ShareEntry = { user_id: string; display_name: string | null; username: string | null; can_edit: boolean };

// Nowe tabele nie są jeszcze w wygenerowanych typach – luźny klient.
type Loose = {
  from: (t: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  rpc: (f: string, a?: Record<string, unknown>) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
};
const db = supabase as unknown as Loose;

export const LOCAL_KEY = "trainer-plans-v1";

export async function fetchPlans(userId: string): Promise<PlanRow[]> {
  const [{ data: plans, error }, { data: shares }, { data: privateRows, error: privateError }] = await Promise.all([
    db.from("trainer_plans").select("id, owner_id, data, link_token, link_access").order("created_at"),
    db.from("plan_shares").select("plan_id, can_edit").eq("user_id", userId),
    supabase.from("trainer_client_private").select("plan_id,data"),
  ]);
  if (error) throw error;
  if (privateError) throw privateError;
  const intake = new Map((privateRows ?? []).map((p) => [p.plan_id, p.data as unknown as Partial<Client>]));
  const sh = new Map<string, boolean>((shares ?? []).map((s: { plan_id: string; can_edit: boolean }) => [s.plan_id, s.can_edit]));
  return (plans ?? []).map((p: Omit<PlanRow, "access">) => ({
    ...p,
    data: p.owner_id === userId ? { ...p.data, ...intake.get(p.id) } : { ...p.data, goal: "" },
    access: p.owner_id === userId ? "owner" : sh.get(p.id) ? "edit" : "view",
  }));
}

export async function createPlan(userId: string, data: Client): Promise<PlanRow> {
  const { data: row, error } = await db
    .from("trainer_plans")
    .insert({ owner_id: userId, data })
    .select("id, owner_id, data, link_token, link_access")
    .single();
  if (error) throw error;
  return { ...row, data, access: "owner" };
}

export async function savePlanData(id: string, data: Client) {
  const { error } = await db.from("trainer_plans").update({ data }).eq("id", id);
  if (error) throw error;
}

export async function deletePlan(id: string) {
  const { error } = await db.from("trainer_plans").delete().eq("id", id);
  if (error) throw error;
}

export async function leavePlan(id: string, userId: string) {
  const { error } = await db.from("plan_shares").delete().eq("plan_id", id).eq("user_id", userId);
  if (error) throw error;
}

export async function setLinkAccess(id: string, access: LinkAccess) {
  const { error } = await db.from("trainer_plans").update({ link_access: access }).eq("id", id);
  if (error) throw error;
}

export async function sharePlan(id: string, ident: string, canEdit: boolean): Promise<string> {
  const { data, error } = await db.rpc("share_plan", { _plan: id, _ident: ident, _can_edit: canEdit });
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
  return (data as string | null) ?? null;
}
