/**
 * Preferencje UI synchronizowane między urządzeniami (zwinięte sekcje itd.).
 */
export type UiPrefs = {
  updatedAt: string;
  /** planClientId -> dayId -> true=zwinięty */
  collapsedPlanDays: Record<string, Record<string, boolean>>;
  /** inne panele: klucz -> zwinięty */
  collapsedPanels: Record<string, boolean>;
};

const KEY = "trening-ui-prefs-v1";

export const DEFAULT_UI_PREFS: UiPrefs = {
  updatedAt: "",
  collapsedPlanDays: {},
  collapsedPanels: {},
};

export function loadUiPrefs(): UiPrefs {
  if (typeof window === "undefined") return { ...DEFAULT_UI_PREFS, collapsedPlanDays: {}, collapsedPanels: {} };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_UI_PREFS, collapsedPlanDays: {}, collapsedPanels: {} };
    const p = JSON.parse(raw) as Partial<UiPrefs>;
    return {
      updatedAt: typeof p.updatedAt === "string" ? p.updatedAt : "",
      collapsedPlanDays:
        p.collapsedPlanDays && typeof p.collapsedPlanDays === "object"
          ? p.collapsedPlanDays
          : {},
      collapsedPanels:
        p.collapsedPanels && typeof p.collapsedPanels === "object" ? p.collapsedPanels : {},
    };
  } catch {
    return { ...DEFAULT_UI_PREFS, collapsedPlanDays: {}, collapsedPanels: {} };
  }
}

export function saveUiPrefs(prefs: UiPrefs): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* quota */
  }
}

export function getCollapsedPlanDays(clientId: string): Record<string, boolean> {
  return loadUiPrefs().collapsedPlanDays[clientId] ?? {};
}

export function setCollapsedPlanDay(
  clientId: string,
  dayId: string,
  collapsed: boolean,
): UiPrefs {
  const prefs = loadUiPrefs();
  const forClient = { ...(prefs.collapsedPlanDays[clientId] ?? {}) };
  if (collapsed) forClient[dayId] = true;
  else delete forClient[dayId];
  const next: UiPrefs = {
    ...prefs,
    updatedAt: new Date().toISOString(),
    collapsedPlanDays: {
      ...prefs.collapsedPlanDays,
      [clientId]: forClient,
    },
  };
  saveUiPrefs(next);
  return next;
}

export function setCollapsedPanel(panelId: string, collapsed: boolean): UiPrefs {
  const prefs = loadUiPrefs();
  const panels = { ...prefs.collapsedPanels };
  if (collapsed) panels[panelId] = true;
  else delete panels[panelId];
  const next: UiPrefs = {
    ...prefs,
    updatedAt: new Date().toISOString(),
    collapsedPanels: panels,
  };
  saveUiPrefs(next);
  return next;
}

export function mergeUiPrefs(local: UiPrefs, cloud: UiPrefs | null | undefined): UiPrefs {
  if (!cloud) return local;
  const cAt = cloud.updatedAt || "";
  const lAt = local.updatedAt || "";
  if (cAt && (!lAt || cAt > lAt)) {
    return {
      updatedAt: cAt,
      collapsedPlanDays: cloud.collapsedPlanDays ?? {},
      collapsedPanels: cloud.collapsedPanels ?? {},
    };
  }
  return local;
}
