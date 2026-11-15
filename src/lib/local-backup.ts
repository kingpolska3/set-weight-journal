/**
 * Lokalny backup danych aplikacji.
 * - automatyczne migawki w localStorage (rotacja)
 * - eksport pliku .json do pobrania
 * - import / przywracanie
 */
export const BACKUP_VERSION = 1;

/** Prefiksy kluczy, które zawsze bierzemy do backupu. */
const KEY_PREFIXES = [
  "trening-",
  "trainer-",
  "set-weight-",
  "client-",
  "received-",
  "pwa-",
];

/** Konkretne klucze (na wypadek innych nazw). */
const EXPLICIT_KEYS = [
  "trening-dziennik-v1",
  "trening-rozklad-v1",
  "trening-szablony-v1",
  "trening-motyw-v1",
  "trening-settings-updated-v1",
  "trening-last-cloud-sync-v1",
  "trening-czysty-start-v1",
  "trainer-availability-v1",
  "trainer-bookings-v1",
  "trainer-auth-unlocked-v1",
];

const AUTO_SLOT_PREFIX = "trening-auto-backup-slot-";
const AUTO_META_KEY = "trening-auto-backup-meta-v1";
const MAX_AUTO_SLOTS = 5;

export type LocalBackupFile = {
  version: number;
  app: string;
  createdAt: string;
  keys: Record<string, string>;
};

export type AutoBackupMeta = {
  lastAt: string;
  slot: number;
  count: number;
};

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function shouldIncludeKey(key: string): boolean {
  if (key.startsWith(AUTO_SLOT_PREFIX)) return false;
  if (key === AUTO_META_KEY) return false;
  if (EXPLICIT_KEYS.includes(key)) return true;
  return KEY_PREFIXES.some((p) => key.startsWith(p));
}

/** Zbiera wszystkie istotne dane z localStorage. */
export function collectLocalData(): Record<string, string> {
  if (!isBrowser()) return {};
  const out: Record<string, string> = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !shouldIncludeKey(key)) continue;
      const val = localStorage.getItem(key);
      if (val != null) out[key] = val;
    }
    // jawne – gdyby coś pominął pętla
    for (const key of EXPLICIT_KEYS) {
      if (key in out) continue;
      const val = localStorage.getItem(key);
      if (val != null) out[key] = val;
    }
  } catch {
    /* private mode */
  }
  return out;
}

export function buildBackup(): LocalBackupFile {
  return {
    version: BACKUP_VERSION,
    app: "set-weight-journal",
    createdAt: new Date().toISOString(),
    keys: collectLocalData(),
  };
}

/** Pobierz plik JSON na dysk / do „Plików” telefonu. */
export function downloadBackup(filename?: string): LocalBackupFile {
  const backup = buildBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.href = url;
  a.download = filename ?? `dziennik-treningowy-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
  return backup;
}

export type RestoreResult = {
  ok: boolean;
  restored: number;
  error?: string;
};

/**
 * Przywraca backup.
 * mode: "merge" – dopisuje/nadpisuje klucze z pliku;
 *       "replace" – najpierw czyści klucze aplikacji, potem wstawia z pliku.
 */
export function restoreBackup(
  raw: string | LocalBackupFile,
  mode: "merge" | "replace" = "merge",
): RestoreResult {
  if (!isBrowser()) return { ok: false, restored: 0, error: "Brak localStorage" };

  let data: LocalBackupFile;
  try {
    data = typeof raw === "string" ? (JSON.parse(raw) as LocalBackupFile) : raw;
  } catch {
    return { ok: false, restored: 0, error: "Nieprawidłowy plik JSON" };
  }

  if (!data || typeof data !== "object" || !data.keys || typeof data.keys !== "object") {
    return { ok: false, restored: 0, error: "To nie jest backup Dziennika treningowego" };
  }

  try {
    if (mode === "replace") {
      const toRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && shouldIncludeKey(key)) toRemove.push(key);
      }
      for (const key of toRemove) localStorage.removeItem(key);
    }

    let restored = 0;
    for (const [key, value] of Object.entries(data.keys)) {
      if (typeof value !== "string") continue;
      if (!shouldIncludeKey(key)) continue;
      localStorage.setItem(key, value);
      restored++;
    }
    return { ok: true, restored };
  } catch (e) {
    return {
      ok: false,
      restored: 0,
      error: e instanceof Error ? e.message : "Nie udało się zapisać backupu",
    };
  }
}

export async function restoreBackupFromFile(
  file: File,
  mode: "merge" | "replace" = "merge",
): Promise<RestoreResult> {
  const text = await file.text();
  return restoreBackup(text, mode);
}

// ——— Auto-backup (rotacja slotów w localStorage) ———

export function getAutoBackupMeta(): AutoBackupMeta | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(AUTO_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AutoBackupMeta;
  } catch {
    return null;
  }
}

/** Zapisuje migawkę do kolejnego slotu (max 5). */
export function createAutoBackup(force = false): AutoBackupMeta | null {
  if (!isBrowser()) return null;
  try {
    const meta = getAutoBackupMeta();
    const now = Date.now();
    // nie częściej niż co 30 min, chyba że force
    if (!force && meta?.lastAt) {
      const prev = new Date(meta.lastAt).getTime();
      if (now - prev < 30 * 60 * 1000) return meta;
    }

    const slot = meta ? (meta.slot + 1) % MAX_AUTO_SLOTS : 0;
    const backup = buildBackup();
    localStorage.setItem(`${AUTO_SLOT_PREFIX}${slot}`, JSON.stringify(backup));
    const next: AutoBackupMeta = {
      lastAt: new Date().toISOString(),
      slot,
      count: (meta?.count ?? 0) + 1,
    };
    localStorage.setItem(AUTO_META_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function listAutoBackups(): { slot: number; createdAt: string; keyCount: number }[] {
  if (!isBrowser()) return [];
  const out: { slot: number; createdAt: string; keyCount: number }[] = [];
  for (let slot = 0; slot < MAX_AUTO_SLOTS; slot++) {
    try {
      const raw = localStorage.getItem(`${AUTO_SLOT_PREFIX}${slot}`);
      if (!raw) continue;
      const data = JSON.parse(raw) as LocalBackupFile;
      out.push({
        slot,
        createdAt: data.createdAt,
        keyCount: Object.keys(data.keys ?? {}).length,
      });
    } catch {
      /* skip */
    }
  }
  return out.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function restoreAutoBackupSlot(slot: number, mode: "merge" | "replace" = "replace"): RestoreResult {
  if (!isBrowser()) return { ok: false, restored: 0, error: "Brak localStorage" };
  try {
    const raw = localStorage.getItem(`${AUTO_SLOT_PREFIX}${slot}`);
    if (!raw) return { ok: false, restored: 0, error: "Brak migawki w tym slocie" };
    return restoreBackup(raw, mode);
  } catch {
    return { ok: false, restored: 0, error: "Uszkodzona migawka" };
  }
}

/**
 * Podłącz auto-backup: przy starcie, przy ukryciu strony, co godzinę.
 * Zwraca cleanup.
 */
export function attachAutoBackup(): () => void {
  if (!isBrowser()) return () => undefined;

  createAutoBackup(true);

  const onVis = () => {
    if (document.visibilityState === "hidden") createAutoBackup(false);
  };
  const onHide = () => createAutoBackup(false);

  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("pagehide", onHide);
  const timer = setInterval(() => createAutoBackup(false), 60 * 60 * 1000);

  return () => {
    document.removeEventListener("visibilitychange", onVis);
    window.removeEventListener("pagehide", onHide);
    clearInterval(timer);
  };
}

export function formatBackupDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pl-PL");
  } catch {
    return iso;
  }
}
