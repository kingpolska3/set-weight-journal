export type ThemeMode = "dark" | "light";

export type AccentKey = "amber" | "emerald" | "blue" | "violet" | "rose";

export const ACCENTS: Record<AccentKey, { label: string; color: string; foreground: string; swatch: string }> = {
  amber: {
    label: "Bursztyn",
    color: "oklch(0.83 0.19 92)",
    foreground: "oklch(0.2 0.03 90)",
    swatch: "#f2b01e",
  },
  emerald: {
    label: "Zieleń",
    color: "oklch(0.74 0.17 158)",
    foreground: "oklch(0.18 0.03 158)",
    swatch: "#16b981",
  },
  blue: {
    label: "Błękit",
    color: "oklch(0.68 0.16 250)",
    foreground: "oklch(0.98 0.01 250)",
    swatch: "#3b82f6",
  },
  violet: {
    label: "Fiolet",
    color: "oklch(0.66 0.2 300)",
    foreground: "oklch(0.98 0.01 300)",
    swatch: "#a855f7",
  },
  rose: {
    label: "Czerwień",
    color: "oklch(0.66 0.21 18)",
    foreground: "oklch(0.98 0.01 18)",
    swatch: "#f43f5e",
  },
};

export type ThemeSettings = { mode: ThemeMode; accent: AccentKey; customColor?: string | undefined };

const KEY = "trening-motyw-v1";

export const DEFAULT_THEME: ThemeSettings = { mode: "dark", accent: "amber" };

export function loadTheme(): ThemeSettings {
  if (typeof window === "undefined") return { ...DEFAULT_THEME };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_THEME };
    const parsed = JSON.parse(raw) as Partial<ThemeSettings>;
    return {
      mode: parsed.mode === "light" ? "light" : "dark",
      accent: parsed.accent && parsed.accent in ACCENTS ? parsed.accent : DEFAULT_THEME.accent,
      customColor: /^#[0-9a-f]{6}$/i.test(parsed.customColor ?? "") ? parsed.customColor : undefined,
    };
  } catch {
    return { ...DEFAULT_THEME };
  }
}

export function applyTheme(theme: ThemeSettings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("light", theme.mode === "light");
  root.classList.toggle("dark", theme.mode === "dark");
  const accent = ACCENTS[theme.accent] ?? ACCENTS.amber;
  const custom = /^#[0-9a-f]{6}$/i.test(theme.customColor ?? "") ? theme.customColor : undefined;
  const color = custom ?? accent.color;
  let foreground = accent.foreground;
  if (custom) {
    const rgb = [1, 3, 5].map((offset) => parseInt(custom.slice(offset, offset + 2), 16) / 255).map((v) => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const luminance = (rgb[0] ?? 0) * 0.2126 + (rgb[1] ?? 0) * 0.7152 + (rgb[2] ?? 0) * 0.0722;
    foreground = luminance > 0.179 ? "oklch(0.16 0 0)" : "oklch(0.98 0 0)";
  }
  root.style.setProperty("--primary", color);
  root.style.setProperty("--primary-foreground", foreground);
  root.style.setProperty("--ring", color);
  root.style.setProperty("--chart-1", color);
}

export function saveTheme(theme: ThemeSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(theme));
  } catch {
    /* quota */
  }
  applyTheme(theme);
}
