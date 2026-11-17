/** Ulubieni rywale w zakładce VS – sync przez user_settings.vs_favorites */

export type VsFavProfile = {
  id: string;
  display_name: string;
  username: string | null;
  avatar_url: string | null;
};

const KEY = "trening-vs-ulubieni-v1";
const STAMP_KEY = "trening-vs-ulubieni-updated-v1";

export function loadVsFavorites(): VsFavProfile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as VsFavProfile[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveVsFavorites(list: VsFavProfile[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
    localStorage.setItem(STAMP_KEY, new Date().toISOString());
  } catch {
    /* quota */
  }
}

export function getVsFavoritesUpdatedAt(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STAMP_KEY) ?? "";
  } catch {
    return "";
  }
}

export function setVsFavoritesUpdatedAt(iso: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STAMP_KEY, iso);
  } catch {
    /* ignore */
  }
}
