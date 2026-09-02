import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw, Timer } from "lucide-react";
import {
  DEFAULT_REST,
  formatRest,
  loadRest,
  notifyRestOver,
  playSound,
  vibrate,
  type RestSettings,
} from "@/lib/rest-settings";

/** Kompaktowy timer przerwy – jeden przy każdej serii. */
export function RestTimer({
  onSave,
  compact = false,
}: {
  onSave?: (sec: number) => void;
  compact?: boolean;
}) {
  const [settings, setSettings] = useState<RestSettings>(DEFAULT_REST);
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    setSettings(loadRest());
  }, []);

  useEffect(() => {
    if (!running) return;
    ref.current = setInterval(() => setSec((s) => s + 1), 1000);
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  useEffect(() => {
    if (!running || firedRef.current || sec < settings.seconds) return;
    firedRef.current = true;
    setDone(true);
    if (settings.soundOn) playSound(settings.sound, settings.volume);
    if (settings.vibrate) vibrate();
    if (settings.notify) notifyRestOver();
  }, [sec, running, settings]);

  const remaining = Math.max(0, settings.seconds - sec);
  const pct = Math.min(100, (sec / Math.max(1, settings.seconds)) * 100);

  const reset = () => {
    setRunning(false);
    setSec(0);
    setDone(false);
    firedRef.current = false;
  };

  const start = () => {
    setSettings(loadRest());
    firedRef.current = false;
    setDone(false);
    setSec(0);
    setRunning(true);
  };

  if (!running && !done) {
    return (
      <button
        onClick={start}
        title={`Start przerwy (${formatRest(settings.seconds)})`}
        className={`inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary ${
          compact ? "" : "px-2.5 py-1.5 text-xs"
        }`}
      >
        <Timer className="h-3.5 w-3.5" />
        {compact ? formatRest(settings.seconds) : `Przerwa ${formatRest(settings.seconds)}`}
      </button>
    );
  }

  return (
    <div
      className={`relative flex items-center gap-1.5 overflow-hidden rounded-lg border px-2 py-1 text-[11px] ${
        done ? "border-primary bg-primary/15" : "border-primary/50 bg-secondary"
      }`}
    >
      <span
        className="absolute inset-y-0 left-0 bg-primary/20 transition-[width] duration-1000"
        style={{ width: `${pct}%` }}
        aria-hidden
      />
      <Timer className="relative h-3.5 w-3.5 text-primary" />
      <span className="relative font-semibold tabular-nums text-foreground">
        {done ? `+${formatRest(sec - settings.seconds)}` : formatRest(remaining)}
      </span>
      {done ? (
        <span className="relative font-semibold uppercase text-primary">czas na serię</span>
      ) : null}
      <button
        onClick={reset}
        aria-label="Reset przerwy"
        className="relative rounded-md p-0.5 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={start}
        aria-label="Zacznij przerwę od nowa"
        className="relative rounded-md p-0.5 text-muted-foreground hover:text-foreground"
      >
        <Play className="h-3.5 w-3.5" />
      </button>
      {onSave ? (
        <button
          onClick={() => {
            onSave(sec);
            reset();
          }}
          className="relative rounded-md px-1 py-0.5 font-medium text-primary hover:bg-background"
        >
          Zapisz
        </button>
      ) : null}
    </div>
  );
}
