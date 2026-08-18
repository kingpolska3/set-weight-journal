import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Timer } from "lucide-react";

export function RestTimer({ onSave }: { onSave?: (sec: number) => void }) {
  const [sec, setSec] = useState(0);
  const [running, setRunning] = useState(false);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSec((s) => s + 1), 1000);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);

  const mm = String(Math.floor(sec / 60)).padStart(2, "0");
  const ss = String(sec % 60).padStart(2, "0");

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-2.5 py-1.5">
      <Timer className="h-3.5 w-3.5 text-primary" />
      <span className="text-sm font-semibold tabular-nums text-foreground">
        {mm}:{ss}
      </span>
      <button
        onClick={() => setRunning((r) => !r)}
        aria-label={running ? "Zatrzymaj timer" : "Start timera"}
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        {running ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
      </button>
      <button
        onClick={() => {
          setRunning(false);
          setSec(0);
        }}
        aria-label="Reset timera"
        className="rounded-md p-1 text-muted-foreground hover:text-foreground"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>
      {onSave ? (
        <button
          onClick={() => {
            onSave(sec);
            setRunning(false);
            setSec(0);
          }}
          className="rounded-md px-1.5 py-0.5 text-[11px] font-medium text-primary hover:bg-background"
        >
          Zapisz przerwę
        </button>
      ) : null}
    </div>
  );
}
