import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import {
  loadPlan,
  loadSessions,
  loadTemplates,
  savePlan,
  saveSessions,
  saveTemplates,
  sessionVolume,
  workingSets,
  type Session,
  type Template,
  type WeekPlan,
} from "./workout-store";
import { syncTrainerCloud } from "./booking";
import { syncTrainerPlansFromCloud } from "./trainer-plans";
import { syncAllClientSessionsFromCloud } from "./client-sessions";
import { applyTheme, loadTheme, saveTheme, type ThemeSettings } from "./theme";
import { loadUiPrefs, mergeUiPrefs, saveUiPrefs, type UiPrefs } from "./ui-prefs";
import {
  getRestUpdatedAt,
  loadRest,
  loadRestEnabled,
  saveRest,
  saveRestEnabled,
  setRestUpdatedAt,
  type RestSettings,
} from "./rest-settings";
import {
  getReceivedPlansUpdatedAt,
  loadReceivedPlans,
  saveReceivedPlans,
  setReceivedPlansUpdatedAt,
  type ReceivedPlan,
} from "./received-plans";
import {
  getVsFavoritesUpdatedAt,
  loadVsFavorites,
  saveVsFavorites,
  setVsFavoritesUpdatedAt,
  type VsFavProfile,
} from "./vs-favorites";

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

const LAST_SYNC_KEY = "trening-last-cloud-sync-v1";
const SETTINGS_UPDATED_KEY = "trening-settings-updated-v1";

export function getLastSyncAt(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(LAST_SYNC_KEY);
  } catch {
    return null;
  }
}

function setLastSyncAt() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch {
    /* ignore */
  }
}

function getSettingsUpdatedLocal(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(SETTINGS_UPDATED_KEY) ?? "";
  } catch {
    return "";
  }
}

function setSettingsUpdatedLocal(iso: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_UPDATED_KEY, iso);
  } catch {
    /* ignore */
  }
}

/** Wywołaj po lokalnej zmianie planu/szablonów. */
export function touchSettingsLocal() {
  setSettingsUpdatedLocal(new Date().toISOString());
}

/** Dwukierunkowa synchronizacja: nowszy zapis (lokalny lub chmura) wygrywa. */
export async function syncNow(userId: string): Promise<{ pulled: number; pushed: number }> {
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return { pulled: 0, pushed: 0 };
  }

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
        updated_at: stamp(s) || new Date().toISOString(),
      })),
      { onConflict: "user_id,date" },
    );
    if (pushError) throw pushError;
  }

  await syncPlanAndTemplates(userId);
  try {
    await syncTrainerCloud(userId);
  } catch {
    /* rezerwacje – opcjonalne kolumny */
  }
  try {
    await syncTrainerPlansFromCloud(userId);
  } catch {
    /* plany trenera */
  }
  try {
    await syncAllClientSessionsFromCloud(userId);
  } catch {
    /* sesje podopiecznych */
  }
  setLastSyncAt();
  emit();
  return { pulled, pushed: toPush.length };
}

async function syncPlanAndTemplates(userId: string) {
  const localPlan = loadPlan();
  const localTemplates = loadTemplates();
  const localTheme = loadTheme();
  const localUi = loadUiPrefs();
  const localRest = loadRest();
  const localRestEnabled = loadRestEnabled();
  const localFavs = loadVsFavorites();
  const localReceived = loadReceivedPlans();
  const localUpdated = getSettingsUpdatedLocal();
  const themeUiStamp = [
    localUi.updatedAt,
    getThemeUpdatedLocal(),
    getRestUpdatedAt(),
    getVsFavoritesUpdatedAt(),
    getReceivedPlansUpdatedAt(),
  ]
    .filter(Boolean)
    .sort()
    .pop() || "";
  const effectiveLocal = [localUpdated, themeUiStamp].filter(Boolean).sort().pop() || "";

  const { data } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const row = data as {
    week_plan?: WeekPlan | null;
    templates?: Template[] | null;
    theme?: ThemeSettings | null;
    ui_prefs?: UiPrefs | null;
    rest_settings?: RestSettings | null;
    rest_enabled?: boolean | null;
    vs_favorites?: VsFavProfile[] | null;
    received_plans?: ReceivedPlan[] | null;
    updated_at?: string | null;
  } | null;

  const cloudUpdated = row?.updated_at ?? "";
  const cloudPlan = (row?.week_plan ?? null) as WeekPlan | null;
  const cloudTemplates = (row?.templates ?? null) as Template[] | null;
  const cloudTheme = row?.theme ?? null;
  const cloudUi = row?.ui_prefs ?? null;
  const cloudRest = row?.rest_settings ?? null;
  const cloudRestEnabled = row?.rest_enabled;
  const cloudFavs = row?.vs_favorites ?? null;
  const cloudReceived = row?.received_plans ?? null;

  if (cloudUpdated && (!effectiveLocal || cloudUpdated > effectiveLocal)) {
    if (cloudPlan && Object.keys(cloudPlan).length > 0) {
      savePlan({ ...localPlan, ...cloudPlan });
    }
    if (Array.isArray(cloudTemplates)) {
      saveTemplates(cloudTemplates);
    }
    if (cloudTheme && typeof cloudTheme === "object") {
      saveTheme({
        mode: cloudTheme.mode === "light" ? "light" : "dark",
        accent: cloudTheme.accent ?? localTheme.accent,
        customColor: cloudTheme.customColor,
      });
      setThemeUpdatedLocal(cloudUpdated);
    }
    if (cloudUi) {
      const merged = mergeUiPrefs(localUi, cloudUi);
      saveUiPrefs(merged);
    }
    if (cloudRest && typeof cloudRest === "object") {
      saveRest({ ...localRest, ...cloudRest });
      setRestUpdatedAt(cloudUpdated);
    }
    if (typeof cloudRestEnabled === "boolean") {
      saveRestEnabled(cloudRestEnabled);
      setRestUpdatedAt(cloudUpdated);
    }
    if (Array.isArray(cloudFavs)) {
      saveVsFavorites(cloudFavs);
      setVsFavoritesUpdatedAt(cloudUpdated);
    }
    if (Array.isArray(cloudReceived)) {
      saveReceivedPlans(cloudReceived);
      setReceivedPlansUpdatedAt(cloudUpdated);
    }
    setSettingsUpdatedLocal(cloudUpdated);
    return;
  }

  const now = new Date().toISOString();
  const payload: Record<string, unknown> = {
    user_id: userId,
    week_plan: localPlan as unknown as Json,
    templates: localTemplates as unknown as Json,
    theme: localTheme as unknown as Json,
    ui_prefs: localUi as unknown as Json,
    rest_settings: localRest as unknown as Json,
    rest_enabled: localRestEnabled,
    vs_favorites: localFavs as unknown as Json,
    received_plans: localReceived as unknown as Json,
    updated_at: now,
  };
  // zachowaj pola rezerwacji jeśli już są w wierszu
  if (row && (row as { trainer_availability?: unknown }).trainer_availability) {
    payload.trainer_availability = (row as { trainer_availability?: unknown }).trainer_availability;
  }
  if (row && (row as { trainer_bookings?: unknown }).trainer_bookings) {
    payload.trainer_bookings = (row as { trainer_bookings?: unknown }).trainer_bookings;
  }

  const { error } = await supabase.from("user_settings").upsert(payload as never, {
    onConflict: "user_id",
  });
  if (error) {
    await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        week_plan: localPlan as unknown as Json,
        updated_at: now,
      },
      { onConflict: "user_id" },
    );
  }
  setSettingsUpdatedLocal(now);
  setThemeUpdatedLocal(now);
}

const THEME_UPDATED_KEY = "trening-theme-updated-v1";

function getThemeUpdatedLocal(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(THEME_UPDATED_KEY) ?? "";
  } catch {
    return "";
  }
}

function setThemeUpdatedLocal(iso: string) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(THEME_UPDATED_KEY, iso);
  } catch {
    /* ignore */
  }
}

/** Wywołaj po zmianie motywu – wymusi wypchnięcie przy sync. */
export function touchThemeLocal() {
  setThemeUpdatedLocal(new Date().toISOString());
  touchSettingsLocal();
}

/** Wywołaj po zmianie UI (zwijanie dni itd.). */
export function touchUiPrefsLocal() {
  touchSettingsLocal();
}

/** Tylko na wyraźne żądanie użytkownika – NIGDY automatycznie na nowym telefonie. */
export async function wipeCloudWorkouts(userId: string) {
  const { error } = await supabase.from("workout_days").delete().eq("user_id", userId);
  if (error) throw error;
  saveSessions([]);
  emit();
}

export async function pushPlan(userId: string, plan: WeekPlan) {
  touchSettingsLocal();
  savePlan(plan);
  const now = new Date().toISOString();
  const { error } = await supabase.from("user_settings").upsert(
    {
      user_id: userId,
      week_plan: plan as unknown as Json,
      templates: loadTemplates() as unknown as Json,
      updated_at: now,
    },
    { onConflict: "user_id" },
  );
  if (error) {
    await supabase.from("user_settings").upsert(
      {
        user_id: userId,
        week_plan: plan as unknown as Json,
        updated_at: now,
      },
      { onConflict: "user_id" },
    );
  }
  setSettingsUpdatedLocal(now);
}

export async function flushSync(userId: string | undefined | null) {
  if (!userId) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;
  try {
    await syncNow(userId);
  } catch {
    /* offline */
  }
}

export function attachAutoSync(userId: string): () => void {
  let cancelled = false;
  let timer: ReturnType<typeof setInterval> | undefined;

  const run = () => {
    if (cancelled) return;
    void flushSync(userId);
  };

  run();
  window.addEventListener("online", run);

  const onVis = () => {
    run();
  };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("pagehide", run);

  timer = setInterval(run, 3 * 60 * 1000);

  return () => {
    cancelled = true;
    window.removeEventListener("online", run);
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pagehide", run);
    if (timer) clearInterval(timer);
  };
}
