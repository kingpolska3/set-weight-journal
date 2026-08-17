import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Dumbbell, Plus, Copy } from "lucide-react";
import { ExerciseCard } from "@/components/ExerciseCard";
import {
  DAY_NAMES,
  DAY_PLAN,
  SEED_EXERCISES,
  formatDatePL,
  loadSessions,
  planForDate,
  previousExercise,
  saveSessions,
  todayISO,
  uid,
  volume,
  type Exercise,
  type Session,
} from "@/lib/workout-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dziennik treningowy — serie, ciężary i progres" },
      {
        name: "description",
        content:
          "Zapisuj codzienne treningi: serie, powtórzenia, ciężary i zdjęcia. Automatyczny progres procentowy dla każdego ćwiczenia.",
      },
      { property: "og:title", content: "Dziennik treningowy — serie, ciężary i progres" },
      {
        property: "og:description",
        content:
          "Codzienny zapis treningów z podziałem na partie, zdjęciami i procentowym progresem.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [date, setDate] = useState<string>(todayISO());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadSessions();
    if (stored.length === 0) {
      const seed: Session[] = [
        {
          date: todayISO(),
          exercises: SEED_EXERCISES.map((e) => ({ id: uid(), ...e })),
        },
      ];
      setSessions(seed);
      saveSessions(seed);
    } else {
      setSessions(stored);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveSessions(sessions);
  }, [sessions, loaded]);

  const session = useMemo(
    () => sessions.find((s) => s.date === date) ?? { date, exercises: [] },
    [sessions, date],
  );

  const setSession = (next: Session) => {
    setSessions((prev) => {
      const exists = prev.some((s) => s.date === next.date);
      const list = exists
        ? prev.map((s) => (s.date === next.date ? next : s))
        : [...prev, next];
      return list.sort((a, b) => (a.date < b.date ? 1 : -1));
    });
  };

  const addExercise = () =>
    setSession({
      ...session,
      exercises: [...session.exercises, { id: uid(), name: "", sets: [{ reps: 0, weight: 0 }] }],
    });

  function moveItem<T>(list: T[], from: number, delta: number): T[] {
    const to = from + delta;
    if (to < 0 || to >= list.length) return list;
    const next = list.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    return next;
  }

  const copyLastSame = () => {
    const weekday = new Date(date + "T00:00:00").getDay();
    const prev = sessions
      .filter(
        (s) =>
          s.date < date &&
          DAY_PLAN[new Date(s.date + "T00:00:00").getDay()] === DAY_PLAN[weekday] &&
          s.exercises.length > 0,
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    if (!prev) return;
    setSession({
      date,
      exercises: prev.exercises.map((e) => ({
        id: uid(),
        name: e.name,
        sets: e.sets.map((s) => ({ ...s })),
      })),
    });
  };

  const dayVolume = session.exercises.reduce((sum, e) => sum + volume(e.sets), 0);
  const prevDayVolume = session.exercises.reduce((sum, e) => {
    const p = previousExercise(sessions, date, e.name);
    return sum + (p ? volume(p.exercise.sets) : 0);
  }, 0);
  const dayPct =
    prevDayVolume > 0 ? ((dayVolume - prevDayVolume) / prevDayVolume) * 100 : null;

  return (
    <main className="min-h-screen bg-background pb-24">
      <header
        className="border-b border-border px-4 pb-6 pt-8"
        style={{ backgroundImage: "var(--gradient-hero)" }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <Dumbbell className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">
              Dziennik treningowy
            </span>
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight text-foreground">
            {planForDate(date)}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{formatDatePL(date)}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent text-sm text-foreground outline-none"
              />
            </label>
            <button
              onClick={copyLastSame}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-primary"
            >
              <Copy className="h-4 w-4" /> Skopiuj poprzedni taki trening
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Ćwiczenia" value={String(session.exercises.length)} />
            <Stat label="Objętość" value={`${Math.round(dayVolume)} kg`} />
            <Stat
              label="Progres dnia"
              value={dayPct === null ? "—" : `${dayPct > 0 ? "+" : ""}${dayPct.toFixed(1)}%`}
              tone={dayPct === null ? "" : dayPct >= 0 ? "text-success" : "text-danger"}
            />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-6">
        <h2 className="sr-only">Ćwiczenia dnia</h2>
        <div className="space-y-4">
          {session.exercises.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              index={i}
              exercise={ex}
              date={date}
              sessions={sessions}
              onChange={(next: Exercise) =>
                setSession({
                  ...session,
                  exercises: session.exercises.map((e) => (e.id === ex.id ? next : e)),
                })
              }
              onRemove={() =>
                setSession({
                  ...session,
                  exercises: session.exercises.filter((e) => e.id !== ex.id),
                })
              }
              onMoveUp={() =>
                setSession({
                  ...session,
                  exercises: moveItem(session.exercises, i, -1),
                })
              }
              onMoveDown={() =>
                setSession({
                  ...session,
                  exercises: moveItem(session.exercises, i, 1),
                })
              }
              canMoveUp={i > 0}
              canMoveDown={i < session.exercises.length - 1}
            />
          ))}
        </div>

        <button
          onClick={addExercise}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Dodaj ćwiczenie
        </button>

        <div className="mt-10 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Rozkład tygodnia
          </h2>
          <ul className="mt-3 space-y-1.5">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <li key={d} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{DAY_NAMES[d]}</span>
                <span className="font-medium text-foreground">{DAY_PLAN[d]}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, tone = "" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-lg font-bold tabular-nums ${tone || "text-foreground"}`}>
        {value}
      </p>
    </div>
  );
}
