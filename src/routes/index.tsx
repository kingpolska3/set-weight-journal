import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Camera, Dumbbell, Plus, Copy, Save, Trophy, X } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { ExerciseCard } from "@/components/ExerciseCard";
import {
  DAY_NAMES,
  SEED_EXERCISES,
  daySummary,
  fileToCompressedDataUrl,
  formatDatePL,
  loadPlan,
  loadSessions,
  loadTemplates,
  planForDate,
  savePlan,
  saveSessions,
  saveTemplates,
  todayISO,
  uid,
  type Exercise,
  type Session,
  type WeekPlan,
} from "@/lib/workout-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dziennik treningowy — serie, ciężary i progres" },
      {
        name: "description",
        content:
          "Zapisuj codzienne treningi: serie, powtórzenia, ciężary i zdjęcia. Estymowany 1RM, rekordy i inteligentne podpowiedzi progresji.",
      },
      { property: "og:title", content: "Dziennik treningowy — serie, ciężary i progres" },
      {
        property: "og:description",
        content:
          "Codzienny zapis treningów z wykresami, estymowanym 1RM, rekordami i podpowiedziami na następny trening.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [date, setDate] = useState<string>(todayISO());
  const [loaded, setLoaded] = useState(false);
  const [plan, setPlan] = useState<WeekPlan>(() => loadPlan());
  const [editPlan, setEditPlan] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

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
    setPlan(loadPlan());
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
    const [item] = next.splice(from, 1) as [T];
    next.splice(to, 0, item);
    return next;
  }

  const copyLastSame = () => {
    const weekday = new Date(date + "T00:00:00").getDay();
    const prev = sessions
      .filter(
        (s) =>
          s.date < date &&
          plan[new Date(s.date + "T00:00:00").getDay()] === plan[weekday] &&
          s.exercises.length > 0,
      )
      .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
    if (!prev) {
      toast.error("Brak wcześniejszego treningu tego typu");
      return;
    }
    setSession({
      date,
      exercises: prev.exercises.map((e) => ({
        id: uid(),
        name: e.name,
        sets: e.sets.map((s) => ({ ...s })),
      })),
    });
  };

  const saveAsTemplate = () => {
    if (session.exercises.length === 0) return;
    const list = loadTemplates();
    const tpl = {
      id: uid(),
      name: `${planForDate(date, plan)} ${date}`,
      exercises: session.exercises.map((e) => ({
        name: e.name,
        sets: e.sets.map((s) => ({ ...s })),
      })),
    };
    saveTemplates([...list, tpl]);
    toast.success("Zapisano jako szablon (zakładka Narzędzia)");
  };

  const handleSessionPhoto = async (file?: File) => {
    if (!file) return;
    setSession({ ...session, photo: await fileToCompressedDataUrl(file) });
  };

  const summary = useMemo(() => daySummary(sessions, date, plan), [sessions, date, plan]);

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
            {planForDate(date, plan)}
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
              <Copy className="h-4 w-4" /> Skopiuj poprzedni
            </button>
            <button
              onClick={saveAsTemplate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground transition-colors hover:border-primary"
            >
              <Save className="h-4 w-4" /> Zapisz szablon
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Ćwiczenia" value={String(session.exercises.length)} />
            <Stat label="Objętość" value={`${Math.round(summary.volume)} kg`} />
            <Stat
              label="Progres dnia"
              value={
                summary.pct === null
                  ? "—"
                  : `${summary.pct > 0 ? "+" : ""}${summary.pct.toFixed(1)}%`
              }
              tone={
                summary.pct === null ? "" : summary.pct >= 0 ? "text-success" : "text-danger"
              }
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

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Notatka do treningu</h2>
          <textarea
            value={session.note ?? ""}
            onChange={(e) => setSession({ ...session, note: e.target.value })}
            placeholder="Samopoczucie, sen, technika, plan na następny raz…"
            rows={3}
            className="mt-2 w-full resize-none rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
          {session.photo ? (
            <div className="relative mt-2 overflow-hidden rounded-xl border border-border">
              <img
                src={session.photo}
                alt="Zdjęcie z treningu"
                loading="lazy"
                className="max-h-72 w-full object-cover"
              />
              <button
                onClick={() => {
                  const { photo: _p, ...rest } = session;
                  setSession(rest);
                }}
                aria-label="Usuń zdjęcie treningu"
                className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 backdrop-blur"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => photoRef.current?.click()}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-primary hover:text-primary"
            >
              <Camera className="h-4 w-4" /> Zdjęcie do całego treningu
            </button>
          )}
          <input
            ref={photoRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handleSessionPhoto(e.target.files?.[0]);
              e.target.value = "";
            }}
          />
        </div>

        <div className="mt-6 rounded-2xl border border-primary/40 bg-card p-4">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Trophy className="h-4 w-4" /> Podsumowanie dnia
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-foreground">
            {summary.exercises === 0
              ? "Brak zapisanych ćwiczeń tego dnia."
              : `Dzisiaj ${
                  summary.pct === null
                    ? "brak porównania"
                    : `${summary.pct > 0 ? "+" : ""}${summary.pct.toFixed(1)}%`
                }, ${Math.round(summary.volume)} kg objętości, ${summary.prCount} PR, ${
                  summary.improved
                } ćwiczeń powyżej poprzedniego wyniku, ${summary.sets} serii roboczych w ${
                  summary.exercises
                } ćwiczeniach.`}
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Rozkład tygodnia
            </h2>
            <button
              onClick={() => setEditPlan((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary"
            >
              <Pencil className="h-3.5 w-3.5" /> {editPlan ? "Gotowe" : "Edytuj"}
            </button>
          </div>
          <ul className="mt-3 space-y-1.5">
            {[1, 2, 3, 4, 5, 6, 0].map((d) => (
              <li key={d} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{DAY_NAMES[d]}</span>
                {editPlan ? (
                  <input
                    value={plan[d] ?? ""}
                    onChange={(e) => {
                      const next = { ...plan, [d]: e.target.value };
                      setPlan(next);
                      savePlan(next);
                    }}
                    placeholder="np. Klata i plecy"
                    className="w-48 rounded-lg border border-input bg-secondary px-2 py-1 text-right text-sm outline-none focus:border-primary"
                  />
                ) : (
                  <span className="font-medium text-foreground">{plan[d]}</span>
                )}
              </li>
            ))}
          </ul>
          {editPlan ? (
            <button
              onClick={() => {
                setPlan({ ...DEFAULT_DAY_PLAN });
                savePlan({ ...DEFAULT_DAY_PLAN });
              }}
              className="mt-3 text-xs text-muted-foreground underline hover:text-primary"
            >
              Przywróć domyślny rozkład
            </button>
          ) : null}
        </div>

      </section>
      <AppNav />
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
