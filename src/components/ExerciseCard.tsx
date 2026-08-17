import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Camera,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Minus,
  X,
} from "lucide-react";
import {
  computeProgress,
  fileToCompressedDataUrl,
  topWeight,
  totalReps,
  volume,
  type Exercise,
  type Session,
} from "@/lib/workout-store";

type Props = {
  index: number;
  exercise: Exercise;
  date: string;
  sessions: Session[];
  onChange: (ex: Exercise) => void;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
};

function pctLabel(v: number) {
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}

function ProgressPill({ label, value }: { label: string; value: number }) {
  const up = value > 0.05;
  const down = value < -0.05;
  const Icon = up ? TrendingUp : down ? TrendingDown : Minus;
  const tone = up ? "text-success" : down ? "text-danger" : "text-muted-foreground";
  return (
    <div className="flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1">
      <Icon className={`h-3.5 w-3.5 ${tone}`} />
      <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className={`text-xs font-semibold tabular-nums ${tone}`}>{pctLabel(value)}</span>
    </div>
  );
}

export function ExerciseCard({
  index,
  exercise,
  date,
  sessions,
  onChange,
  onRemove,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const progress = computeProgress(sessions, date, exercise);

  const update = (patch: Partial<Exercise>) => onChange({ ...exercise, ...patch });

  const clearPhoto = () => {
    const { photo: _photo, ...rest } = exercise;
    onChange(rest);
  };

  const updateSet = (i: number, patch: Partial<Exercise["sets"][number]>) => {
    const sets = exercise.sets.map((s, si) => (si === i ? { ...s, ...patch } : s));
    update({ sets });
  };

  const handlePhoto = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    try {
      update({ photo: await fileToCompressedDataUrl(file) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/20">
      <header className="flex items-start gap-3">
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {index + 1}
        </span>
        <input
          value={exercise.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Nazwa ćwiczenia"
          maxLength={80}
          className="min-w-0 flex-1 rounded-lg bg-transparent px-1 py-1 text-base font-semibold text-foreground outline-none focus:bg-secondary"
        />
        <button
          onClick={onRemove}
          aria-label="Usuń ćwiczenie"
          className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-danger"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </header>

      <div className="mt-3 space-y-2">
        {exercise.sets.map((set, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-6 text-sm font-medium text-muted-foreground tabular-nums">
              {i + 1}-
            </span>
            <input
              type="number"
              inputMode="numeric"
              value={set.reps || ""}
              onChange={(e) => updateSet(i, { reps: Number(e.target.value) })}
              placeholder="powt."
              className="w-16 rounded-lg border border-input bg-secondary px-2 py-2 text-center text-sm tabular-nums outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">x</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.5"
              value={set.weight || ""}
              onChange={(e) => updateSet(i, { weight: Number(e.target.value) })}
              placeholder="kg"
              className="w-20 rounded-lg border border-input bg-secondary px-2 py-2 text-center text-sm tabular-nums outline-none focus:border-primary"
            />
            <span className="text-sm text-muted-foreground">kg</span>
            <input
              value={set.note ?? ""}
              onChange={(e) => updateSet(i, { note: e.target.value })}
              placeholder="notatka (np. dropset)"
              maxLength={60}
              className="min-w-0 flex-1 rounded-lg border border-transparent bg-transparent px-2 py-2 text-xs text-muted-foreground outline-none focus:border-input focus:bg-secondary"
            />
            <button
              onClick={() =>
                update({ sets: exercise.sets.filter((_, si) => si !== i) })
              }
              aria-label="Usuń serię"
              className="rounded-md p-1 text-muted-foreground hover:text-danger"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          onClick={() => update({ sets: [...exercise.sets, { reps: 0, weight: 0 }] })}
          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-primary hover:bg-secondary"
        >
          <Plus className="h-3.5 w-3.5" /> Dodaj serię
        </button>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {progress ? (
          <>
            <ProgressPill label="objętość" value={progress.volumePct} />
            <ProgressPill label="ciężar" value={progress.weightPct} />
            <ProgressPill label="powt." value={progress.repsPct} />
            <span className="text-[11px] text-muted-foreground">vs {progress.prevDate}</span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            Pierwszy zapis tego ćwiczenia – progres pojawi się następnym razem
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground tabular-nums">
        <span>Objętość: {volume(exercise.sets).toFixed(1)} kg</span>
        <span>Max: {topWeight(exercise.sets)} kg</span>
        <span>Powtórzenia: {totalReps(exercise.sets)}</span>
      </div>

      <div className="mt-3">
        {exercise.photo ? (
          <div className="relative overflow-hidden rounded-xl border border-border">
            <img
              src={exercise.photo}
              alt={`Zdjęcie do ćwiczenia ${exercise.name}`}
              loading="lazy"
              className="max-h-72 w-full object-cover"
            />
            <button
              onClick={clearPhoto}
              aria-label="Usuń zdjęcie"
              className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-foreground backdrop-blur"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <Camera className="h-4 w-4" />
            {busy ? "Wczytywanie…" : "Dodaj zdjęcie z galerii"}
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void handlePhoto(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
    </article>
  );
}
