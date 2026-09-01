import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Ban,
  CalendarDays,
  Camera,
  Dumbbell,
  Pencil,
  Play,
  Plus,
  Copy,
  Save,
  Square,
  Timer,
  Trophy,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { WORKOUTS_UPDATED, pushPlan, stampSession, syncNow } from "@/lib/cloud-sync";
import { ExerciseCard } from "@/components/ExerciseCard";
import {
  DAY_NAMES,
  DEFAULT_DAY_PLAN,
  daySummary,
  daySummaryInsights,
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
  const [now, setNow] = useState(() => Date.now());
  const { user } = useAuth();

  useEffect(() => {
    // Nowa osoba zaczyna z pustym dziennikiem – brak przykładowych treningów.
    const cleanStart = new URLSearchParams(window.location.search).get("nowy") === "1";
    if (cleanStart) window.history.replaceState(null, "", window.location.pathname);
    setSessions(loadSessions());
    setPlan(loadPlan());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveSessions(sessions);
  }, [sessions, loaded]);

  // Synchronizacja w tle: po zalogowaniu, po zmianach i po powrocie online.
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const run = () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) return;
      void syncNow(user.id).catch(() => undefined);
    };
    const onUpdated = () => {
      if (!cancelled) setSessions(loadSessions());
    };
    window.addEventListener(WORKOUTS_UPDATED, onUpdated);
    window.addEventListener("online", run);
    run();
    return () => {
      cancelled = true;
      window.removeEventListener(WORKOUTS_UPDATED, onUpdated);
      window.removeEventListener("online", run);
    };
  }, [user]);

  useEffect(() => {
    if (!loaded || !user) return;
    const t = setTimeout(() => {
      void syncNow(user.id).catch(() => undefined);
    }, 2500);
    return () => clearTimeout(t);
  }, [sessions, loaded, user]);

  const session = useMemo(
    () => sessions.find((s) => s.date === date) ?? { date, exercises: [] },
    [sessions, date],
  );

  const setSession = (input: Session) => {
    const next = stampSession(input);
    setSessions((prev) => {
      const exists = prev.some((s) => s.date === next.date);
      const list = exists
        ? prev.map((s) => (s.date === next.date ? next : s))
        : [...prev, next];
      return list.sort((a, b) => (a.date < b.date ? 1 : -1));
    });
  };

  const running = Boolean(session.startTime && !session.endTime);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [running]);

  const elapsedMs = session.startTime
    ? (session.endTime ? new Date(session.endTime).getTime() : now) -
      new Date(session.startTime).getTime()
    : 0;

  const formatDuration = (ms: number) => {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const sec = total % 60;
    const pad = (n: number) => String(n).padStart(2, "0");
    return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
  };

  const startWorkout = () => {
    setNow(Date.now());
    const next = { ...session, startTime: new Date().toISOString() };
    delete next.endTime;
    setSession(next);
    toast.success("Stoper treningu włączony");
  };

  const stopWorkout = () => {
    if (!session.startTime) return;
    const ended = { ...session, endTime: new Date().toISOString() };
    setSession(ended);
    toast.success(
      `Pomiar zatrzymany – ${formatDuration(
        new Date(ended.endTime).getTime() - new Date(session.startTime).getTime(),
      )}. Możesz zapisać ten czas.`,
    );
  };

  const saveWorkoutTime = () => {
    if (!session.startTime || !session.endTime) return;
    const secs = Math.round(
      (new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000,
    );
    setSession({ ...session, durationSec: secs });
    toast.success(`Zapisano czas treningu: ${formatDuration(secs * 1000)}`);
  };

  const toggleRestDay = () => {
    const next = { ...session, rest: !session.rest };
    setSession(next);
    toast.success(next.rest ? "Dzień oznaczony jako „Bez treningu”" : "Dzień znów jest treningowy");
  };

  const resetWorkoutTimer = () => {
    const next = { ...session };
    delete next.startTime;
    delete next.endTime;
    delete next.durationSec;
    setSession(next);
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
      ...session,
      date,
      exercises: prev.exercises.map((e) => ({
        id: uid(),
        name: e.name,
        sets: e.sets.map((s) => ({
          reps: 0,
          weight: 0,
          ...(s.warmup ? { warmup: true } : {}),
          prevReps: s.reps,
          prevWeight: s.weight,
        })),
      })),
    });
    toast.success("Skopiowano układ – w polach widać wyniki z poprzedniego razu");
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

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
            <Timer className={`h-4 w-4 ${running ? "text-primary" : "text-muted-foreground"}`} />
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Czas treningu</p>
              <p className="font-mono text-lg font-semibold tabular-nums text-foreground">
                {formatDuration(elapsedMs)}
              </p>
              {session.durationSec !== undefined ? (
                <p className="text-[11px] text-success">
                  zapisany czas: {formatDuration(session.durationSec * 1000)}
                </p>
              ) : null}
            </div>
            <div className="ml-auto flex items-center gap-2">
              {running ? (
                <button
                  onClick={stopWorkout}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Square className="h-3.5 w-3.5" /> Zakończ
                </button>
              ) : (
                <button
                  onClick={startWorkout}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Play className="h-3.5 w-3.5" /> {session.endTime ? "Nowy pomiar" : "Start"}
                </button>
              )}
              {session.endTime && session.durationSec === undefined ? (
                <button
                  onClick={saveWorkoutTime}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-primary px-3 py-2 text-xs font-semibold text-primary"
                >
                  <Save className="h-3.5 w-3.5" /> Zapisz czas
                </button>
              ) : null}
              {session.startTime ? (
                <button
                  onClick={resetWorkoutTimer}
                  className="rounded-xl border border-border px-2.5 py-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Wyzeruj
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Ćwiczenia" value={String(session.exercises.length)} />
            <Stat
              label="Objętość"
              value={`${Math.round(summary.volume)} kg`}
              sub={
                summary.prevDate
                  ? `${summary.volume - summary.prevVolume >= 0 ? "+" : "−"}${Math.abs(
                      Math.round(summary.volume - summary.prevVolume),
                    )} kg vs ostatni „${summary.planName}”`
                  : "brak porównania"
              }
              subTone={
                summary.prevDate
                  ? summary.volume - summary.prevVolume >= 0
                    ? "text-success"
                    : "text-danger"
                  : ""
              }
            />
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

          <div className="mt-3 flex flex-wrap items-center gap-2">
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
            <button
              onClick={toggleRestDay}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-colors ${
                session.rest
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary"
              }`}
            >
              <Ban className="h-4 w-4" /> {session.rest ? "Dzień bez treningu" : "Bez treningu"}
            </button>
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
          <p className="mt-1 text-xs text-muted-foreground">
            {summary.prevDate
              ? `Porównanie z ostatnim treningiem „${summary.planName}” (${formatDatePL(summary.prevDate)}) – ${Math.round(summary.prevVolume)} kg.`
              : `Brak wcześniejszego treningu „${summary.planName}” do porównania.`}
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
                      if (user) void pushPlan(user.id, next);
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
                if (user) void pushPlan(user.id, { ...DEFAULT_DAY_PLAN });
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

function Stat({
  label,
  value,
  tone = "",
  sub,
  subTone = "",
}: {
  label: string;
  value: string;
  tone?: string;
  sub?: string;
  subTone?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-0.5 text-lg font-bold tabular-nums ${tone || "text-foreground"}`}>
        {value}
      </p>
      {sub ? (
        <p className={`text-[10px] leading-tight ${subTone || "text-muted-foreground"}`}>{sub}</p>
      ) : null}
    </div>
  );
}
