export type SoundKey = "beep" | "chime" | "bell" | "marimba" | "alarm";

export type RestSettings = {
  /** Długość przerwy w sekundach. */
  seconds: number;
  sound: SoundKey;
  soundOn: boolean;
  vibrate: boolean;
  notify: boolean;
};

export const SOUNDS: Record<SoundKey, { label: string; notes: [number, number][] }> = {
  // [częstotliwość Hz, długość s] – każdy sygnał trwa ok. 1,2–2,5 s (nie 5 s).
  beep: { label: "Krótki sygnał", notes: [[880, 0.18], [0, 0.12], [880, 0.18], [0, 0.12], [880, 0.3]] },
  chime: { label: "Dzwoneczek", notes: [[523, 0.25], [659, 0.25], [784, 0.5]] },
  bell: { label: "Gong", notes: [[392, 0.6], [0, 0.05], [392, 0.9]] },
  marimba: { label: "Marimba", notes: [[587, 0.16], [740, 0.16], [880, 0.16], [1175, 0.5]] },
  alarm: { label: "Alarm", notes: [[1046, 0.15], [784, 0.15], [1046, 0.15], [784, 0.15], [1046, 0.15], [784, 0.4]] },
};

export const DEFAULT_REST: RestSettings = {
  seconds: 120,
  sound: "chime",
  soundOn: true,
  vibrate: true,
  notify: true,
};

const KEY = "trening-przerwa-v1";

export function loadRest(): RestSettings {
  if (typeof window === "undefined") return { ...DEFAULT_REST };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_REST };
    const parsed = JSON.parse(raw) as Partial<RestSettings>;
    return {
      ...DEFAULT_REST,
      ...parsed,
      seconds:
        typeof parsed.seconds === "number" && parsed.seconds >= 10 && parsed.seconds <= 900
          ? Math.round(parsed.seconds)
          : DEFAULT_REST.seconds,
      sound: parsed.sound && parsed.sound in SOUNDS ? parsed.sound : DEFAULT_REST.sound,
    };
  } catch {
    return { ...DEFAULT_REST };
  }
}

export function saveRest(settings: RestSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    /* quota */
  }
}

type AudioCtor = typeof AudioContext;

/** Odtwarza krótką melodyjkę końca przerwy (Web Audio – bez plików). */
export function playSound(key: SoundKey) {
  if (typeof window === "undefined") return;
  const Ctor: AudioCtor | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AudioCtor }).webkitAudioContext;
  if (!Ctor) return;
  try {
    const ctx = new Ctor();
    let t = ctx.currentTime + 0.02;
    for (const [freq, dur] of SOUNDS[key].notes) {
      if (freq > 0) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = key === "alarm" ? "square" : key === "bell" ? "triangle" : "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      }
      t += dur;
    }
    window.setTimeout(() => void ctx.close().catch(() => undefined), (t - ctx.currentTime + 0.3) * 1000);
  } catch {
    /* audio niedostępne */
  }
}

export function vibrate(pattern: number[] = [300, 120, 300, 120, 500]) {
  if (typeof navigator === "undefined") return;
  const nav = navigator as Navigator & { vibrate?: (p: number | number[]) => boolean };
  try {
    nav.vibrate?.(pattern);
  } catch {
    /* brak wsparcia */
  }
}

export async function ensureNotifyPermission(): Promise<boolean> {
  if (typeof window === "undefined" || !("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    return (await Notification.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

export function notifyRestOver() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification("Koniec przerwy", { body: "Czas na kolejną serię!", tag: "rest-timer" });
  } catch {
    /* niektóre przeglądarki wymagają service workera */
  }
}

export function formatRest(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}
