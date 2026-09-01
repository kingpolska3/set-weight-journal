import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";
import {
  formatRest,
  loadRest,
  notifyRestOver,
  playSound,
  vibrate,
  type RestSettings,
} from "@/lib/rest-settings";

export function RestTimer({ onSave }: { onSave?: (sec: number) => void }) {
  const [settings, setSettings] = useState<RestSettings>({
    seconds: 120,
    sound: "chime",
    soundOn: true,
    vibrate: true,
    notify: true,
  });
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
    if (settings.soundOn) playSound(settings.sound);
    if (settings.vibrate) vibrate();
    if (settings.notify) notifyRestOver();
  }, [sec, running, settings]);

  const remaining = Math.max(0, settings.seconds - sec);

  const reset = () => {
    setRunning(false);
    setSec(0);
    setDone(false);
    firedRef.current = false;
  };

  return (
    <div
      className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 ${
        done ? "border-primary bg-primary/10" : "border-border bg-secondary"
      }`}
    >
      <Timer className={`h-3.5 w-3.5 ${done ? "text-primary" : "text-primary"}`} />
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {done ? `+${formatRest(sec - settings.seconds)}` : formatRest(remaining)}
      </span>
      {done ? (
        <span className="text-[10px] font-semibold uppercase text-primary">koniec przerwy</span>
      ) : null}
      <button
        onClick={() => {
          setRunning((r) => !r);
          setDone(false);
        }}
        aria-label={running ? "Zatrzymaj przerwę" : "Start przerwy"}
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={reset}
        aria-label="Reset przerwy"
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      {onSave ? (
        <button
          onClick={() => {
            onSave(sec);
            reset();
          }}
          className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-background"
        >
          Zapisz przerwę
        </button>
      ) : null}
    </div>
  );
}
