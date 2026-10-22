import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Lightbulb,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Minus,
  X,
} from "lucide-react";
import { ExerciseChart } from "@/components/ExerciseChart";
import { RestTimer } from "@/components/RestTimer";
import { ATLAS_NAMES } from "@/lib/exercise-atlas";
import {
  best1RM,
  formatRepsOrTime,
  formatTime,
  parseRepsOrTime,
  bestInWindow,
  computeProgress,
  exerciseHistory,
  nextSessionSuggestions,
  prFlags,
  shortDatePL,
  topWeight,
  totalReps,
  volume,
  workingSets,
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

function isSetFilled(s: { reps: number; weight: number; timeSec?: number }) {
  return (s.timeSec ?? 0) > 0 || ((s.reps || 0) > 0 && (s.weight || 0) > 0);
}

export function ExerciseCard({
  index,
  exercise,
  date,
  sessions,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: Props) {
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<number[]>([]);
  const [restSignal, setRestSignal] = useState<Record<number, number>>({});
  const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null);

  const bumpRest = (i: number, s: { reps: number; weight: number }) => {
    if (!s.reps || !s.weight) return;
    setRestSignal((prev) => ({ ...prev, [i]: (prev[i] ?? 0) + 1 }));
  };

  const knownNames = useMemo(() => {
    const own = sessions.flatMap((s) => s.exercises.map((x) => x.name.trim())).filter(Boolean);
    return Array.from(new Set([...own, ...ATLAS_NAMES])).filter((n) => n !== exercise.name.trim());
  }, [sessions, exercise.name]);

  const progress = computeProgress(sessions, date, exercise);
  const history = useMemo(
    () => exerciseHistory(sessions, exercise.name),
    [sessions, exercise.name],
  );
  const pr = prFlags(sessions, date, exercise);
  const suggestions = useMemo(
    () => nextSessionSuggestions(sessions, date, exercise.name),
    [sessions, date, exercise.name],
  );
  const best30 = bestInWindow(sessions, date, exercise.name, 30);
  const best60 = bestInWindow(sessions, date, exercise.name, 60);
  const e1rm = best1RM(exercise.sets);
  const prevE1rm = history.filter((h) => h.date < date).slice(-1)[0]?.e1rm ?? 0;

  const allSetsDone = exercise.sets.length > 0 && exercise.sets.every(isSetFilled);
  const volKg = Math.round(volume(exercise.sets, exercise.name));
  const collapsed = manualCollapsed ?? allSetsDone;

  useEffect(() => {
    if (!allSetsDone && manualCollapsed === true) setManualCollapsed(null);
  }, [allSetsDone, manualCollapsed]);

  const update = (patch: Partial<Exercise>) => onChange({ ...exercise, ...patch });

  type SetPatch = {
    [K in keyof Exercise["sets"][number]]?: Exercise["sets"][number][K] | undefined;
  };
  const updateSet = (i: number, patch: SetPatch) => {
    const sets = exercise.sets.map((s, si) => {
      if (si !== i) return s;
      const next = { ...s, ...patch } as Record<string, unknown>;
      for (const k of Object.keys(patch)) {
        if ((patch as Record<string, unknown>)[k] === undefined) delete next[k];
      }
      return next as Exercise["sets"][number];
    });
    update({ sets });
  };

  const lastSets = history.filter((h) => h.date < date).slice(-1)[0]?.sets ?? [];
  const copyPicked = () => {
    const copied = picked
      .slice()
      .sort((a, b) => a - b)
      .map((i) => lastSets[i])
      .filter((s): s is NonNullable<typeof s> => Boolean(s))
      .map((s) => ({ ...s }));
    if (copied.length === 0) return;
    update({ sets: [...exercise.sets, ...copied] });
    setPicked([]);
  };

  if (collapsed) {
    return (
      <article className="rounded-2xl border border-primary/30 bg-card/80 px-3 py-2.5 shadow-sm">
        <button
          type="button"
          onClick={() => setManualCollapsed(false)}
          className="flex w-full items-center gap-3 text-left"
          aria-expanded={false}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-foreground">
              {exercise.name.trim() || "Bez nazwy"}
            </p>
            <p className="text-[11px] tabular-nums text-muted-foreground">
              {volKg.toLocaleString("pl-PL")} kg · {exercise.sets.length} serii
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            <Check className="h-3 w-3" /> Ukończone
          </span>
        </button>
      </article>
    );
  }

  return (
    <article className="rounded-2xl border border-border bg-card p-4 shadow-lg shadow-black/20">
      <header className="flex items-start gap-3">
        <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
          {index + 1}
        </span>
        <input
          list={`ex-names-${index}`}
          value={exercise.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="Dodaj ćwiczenie…"
          maxLength={80}
          className="min-w-0 flex-1 rounded-lg bg-transparent px-1 py-1 text-base font-semibold text-foreground outline-none focus:bg-secondary"
        />
        <datalist id={`ex-names-${index}`}>
          {knownNames.map((n) => (
            <option key={n} value={n} />
          ))}
        </datalist>
        <div className="flex shrink-0 items-center gap-0.5">
          {allSetsDone ? (
            <button
              type="button"
              onClick={() => setManualCollapsed(true)}
              className="mr-0.5 rounded-lg border border-primary/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary hover:bg-primary/10"
              title="Zwiń ukończone ćwiczenie"
            >
              Zwiń
            </button>
          ) : null}
          <button
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label="Przesuń w górę"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label="Przesuń w dół"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-25"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={onRemove}
            aria-label="Usuń ćwiczenie"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </header>

      {pr.any ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground">
            <Trophy className="h-3 w-3" /> PR
          </span>
          {pr.weight ? <PrTag>ciężar</PrTag> : null}
          {pr.reps ? <PrTag>powtórzenia</PrTag> : null}
          {pr.volume ? <PrTag>objętość</PrTag> : null}
          {pr.e1rm ? <PrTag>1RM</PrTag> : null}
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {exercise.sets.map((set, i) => (
          <div key={i} className="rounded-xl border border-transparent px-0 py-0">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => updateSet(i, { warmup: !set.warmup })}
                title={set.warmup ? "Seria rozgrzewkowa" : "Seria robocza"}
                className={`w-8 shrink-0 rounded-md py-1 text-[10px] font-bold uppercase ${
                  set.warmup
                    ? "bg-secondary text-muted-foreground"
                    : "bg-primary/15 text-primary"
                }`}
              >
                {set.warmup ? "W-up" : `${i + 1}`}
              </button>
              <RepsInput
                set={set}
                onChange={(p) => updateSet(i, { reps: p.reps, timeSec: p.timeSec })}
                onDone={(p) => bumpRest(i, { reps: p.reps || p.timeSec || 0, weight: set.weight })}
              />
              <span className="text-sm text-muted-foreground">x</span>
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                value={set.weight || ""}
                onChange={(e) => updateSet(i, { weight: Number(e.target.value) })}
                onBlur={(e) => bumpRest(i, { reps: set.reps, weight: Number(e.target.value) })}
                placeholder={set.prevWeight ? String(set.prevWeight) : "—"}
                title={set.prevWeight ? `Ostatnio: ${set.prevWeight} kg` : undefined}
                className={`w-16 rounded-lg border bg-secondary px-2 py-2 text-center text-sm tabular-nums outline-none focus:border-primary ${
                  set.prevWeight && !set.weight
                    ? "border-primary/60 placeholder:font-semibold placeholder:text-primary"
                    : "border-input"
                }`}
              />
              <RestTimer
                compact
                autoSignal={restSignal[i] ?? 0}
                presetSec={set.restSec}
                onSave={(secVal) => updateSet(i, { restSec: secVal })}
              />
              <button
                onClick={() => update({ sets: exercise.sets.filter((_, si) => si !== i) })}
                aria-label="Usuń serię"
                className="ml-auto rounded-md p-1 text-muted-foreground hover:text-danger"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
            <input
              value={set.note ?? ""}
              onChange={(e) => updateSet(i, { note: e.target.value })}
              placeholder="notatka (np. dropset)"
              maxLength={60}
              className="mt-1 w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-xs text-muted-foreground outline-none focus:border-input focus:bg-secondary"
            />
            {set.restSec ? (
              <p className="px-2 text-[10px] text-muted-foreground">
                przerwa: {Math.floor(set.restSec / 60)}:
                {String(set.restSec % 60).padStart(2, "0")}
              </p>
            ) : null}
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => update({ sets: [...exercise.sets, { reps: 0, weight: 0 }] })}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-primary hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Dodaj serię
          </button>
          <button
            onClick={() =>
              update({ sets: [...exercise.sets, { reps: 0, weight: 0, warmup: true }] })
            }
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary"
          >
            <Plus className="h-3.5 w-3.5" /> Rozgrzewkowa
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        {progress ? (
          <>
            <ProgressPill label="objętość" value={progress.volumePct} />
            <ProgressPill label="ciężar" value={progress.weightPct} />
            <ProgressPill label="powt." value={progress.repsPct} />
            <ProgressPill label="1RM" value={progress.e1rmPct} />
            <span className="text-[11px] text-muted-foreground">vs {progress.prevDate}</span>
          </>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            Pierwszy zapis tego ćwiczenia – progres pojawi się następnym razem
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-3 text-[11px] tabular-nums text-muted-foreground">
        <span>Objętość: {volume(exercise.sets, exercise.name).toFixed(1)} kg</span>
        <span>Max: {topWeight(exercise.sets)} kg</span>
        <span>Powtórzenia: {totalReps(exercise.sets)}</span>
        <span className="text-foreground">
          Estym. 1RM: <strong>{e1rm.toFixed(1)} kg</strong>{" "}
          {prevE1rm > 0 ? (
            <span className={e1rm >= prevE1rm ? "text-success" : "text-danger"}>
              ({e1rm >= prevE1rm ? "+" : ""}
              {(e1rm - prevE1rm).toFixed(1)} kg)
            </span>
          ) : null}
        </span>
      </div>

      {suggestions.length > 0 ? (
        <div className="mt-3 space-y-1.5 rounded-xl border border-border bg-secondary/50 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Lightbulb className="h-3.5 w-3.5" /> Na następny trening
          </p>
          {suggestions.map((s, i) => (
            <p
              key={i}
              className={`text-xs leading-snug ${
                s.tone === "warn"
                  ? "text-danger"
                  : s.tone === "up"
                    ? "text-success"
                    : "text-foreground"
              }`}
            >
              {s.text}
            </p>
          ))}
        </div>
      ) : null}

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-3 flex w-full items-center justify-between rounded-lg px-1 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        Wykres, historia i kopiowanie serii
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="mt-2 space-y-3 rounded-xl border border-border p-3">
          {best30.date || best60.date ? (
            <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
              <BestBox
                title="Najlepsze 30 dni"
                best={best30}
                cur={{ v: volume(exercise.sets, exercise.name), e: e1rm }}
              />
              <BestBox
                title="Najlepsze 60 dni"
                best={best60}
                cur={{ v: volume(exercise.sets, exercise.name), e: e1rm }}
              />
            </div>
          ) : null}
          <ExerciseChart history={history} />
          {lastSets.length > 0 ? (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Skopiuj wybrane serie z ostatniego razu
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {lastSets.map((s, i) => (
                  <button
                    key={i}
                    onClick={() =>
                      setPicked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]))
                    }
                    className={`rounded-lg px-2 py-1 text-[11px] tabular-nums ${
                      picked.includes(i)
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {formatRepsOrTime(s)}×{s.weight}kg
                  </button>
                ))}
                <button
                  onClick={copyPicked}
                  disabled={picked.length === 0}
                  className="inline-flex items-center gap-1 rounded-lg border border-border px-2 py-1 text-[11px] font-medium text-primary disabled:opacity-40"
                >
                  <Copy className="h-3 w-3" /> Kopiuj ({picked.length})
                </button>
              </div>
            </div>
          ) : null}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Ostatnie treningi
            </p>
            <ul className="mt-1 space-y-1">
              {history
                .slice(-5)
                .reverse()
                .map((h) => (
                  <li
                    key={h.date}
                    className="flex justify-between text-[11px] tabular-nums text-muted-foreground"
                  >
                    <span>{shortDatePL(h.date)}</span>
                    <span>
                      {workingSets(h.sets).length}×, {Math.round(h.volume)} kg obj., max {h.top} kg
                    </span>
                  </li>
                ))}
            </ul>
            {exercise.name.trim() ? (
              <Link
                to="/historia"
                search={{ ex: exercise.name.trim() }}
                className="mt-2 inline-block text-[11px] font-medium text-primary"
              >
                Pełna historia ćwiczenia →
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function PrTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-success">{children}</span>
  );
}

function BestBox({
  title,
  best,
  cur,
}: {
  title: string;
  best: { volume: number; weight: number; e1rm: number; date: string | null };
  cur: { v: number; e: number };
}) {
  if (!best.date) return <div />;
  const diff = best.volume > 0 ? ((cur.v - best.volume) / best.volume) * 100 : 0;
  return (
    <div className="rounded-lg border border-border p-2">
      <p className="text-[10px] uppercase tracking-wide">{title}</p>
      <p className="tabular-nums text-foreground">
        {Math.round(best.volume)} kg obj. · {best.weight} kg · 1RM {best.e1rm.toFixed(1)}
      </p>
      <p className={diff >= 0 ? "text-success" : "text-danger"}>
        dziś {diff >= 0 ? "+" : ""}
        {diff.toFixed(1)}% obj. vs best
      </p>
    </div>
  );
}

function RepsInput({
  set,
  onChange,
  onDone,
}: {
  set: Exercise["sets"][number];
  onChange: (p: { reps: number; timeSec?: number }) => void;
  onDone: (p: { reps: number; timeSec?: number }) => void;
}) {
  const display = set.timeSec ? formatTime(set.timeSec) : set.reps ? String(set.reps) : "";
  const [draft, setDraft] = useState(display);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (!focused) setDraft(display);
  }, [display, focused]);
  const prev = set.prevTimeSec
    ? formatTime(set.prevTimeSec)
    : set.prevReps
      ? String(set.prevReps)
      : "";
  const empty = !set.reps && !set.timeSec;
  return (
    <input
      type="text"
      value={draft}
      onFocus={() => setFocused(true)}
      onChange={(e) => {
        setDraft(e.target.value);
        onChange(parseRepsOrTime(e.target.value));
      }}
      onBlur={(e) => {
        setFocused(false);
        const p = parseRepsOrTime(e.target.value);
        setDraft(p.timeSec ? formatTime(p.timeSec) : p.reps ? String(p.reps) : "");
        onDone(p);
      }}
      placeholder={prev || "—"}
      title="Powtórzenia lub czas (np. 12, 40s, 1:20, 1min 20s)"
      aria-label="Powtórzenia / Czas"
      className={`w-16 rounded-lg border bg-secondary px-2 py-2 text-center text-sm tabular-nums outline-none focus:border-primary ${
        prev && empty
          ? "border-primary/60 placeholder:font-semibold placeholder:text-primary"
          : "border-input"
      } ${set.timeSec ? "text-primary" : ""}`}
    />
  );
}
