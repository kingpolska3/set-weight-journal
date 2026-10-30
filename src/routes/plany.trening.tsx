import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Play, Plus, Save, Square } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useAuth } from "@/hooks/useAuth";
import {
  emptyClientSession,
  loadClientSessions,
  planDayToClientSession,
  saveClientSession,
  clientSessionAsSession,
  type ClientSession,
} from "@/lib/client-sessions";
import { LOCAL_KEY, fetchPlans, type PlanRow } from "@/lib/trainer-plans";
import { daySummary, todayISO, uid, type Exercise, type Session } from "@/lib/workout-store";

type Search = { plan?: string; day?: string };

export const Route = createFileRoute("/plany/trening")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: typeof s.plan === "string" ? s.plan : undefined,
    day: typeof s.day === "string" ? s.day : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Trening z podopiecznym" },
      {
        name: "description",
        content: "Prowadź trening podopiecznego i zapisuj postępy w jego historii.",
      },
    ],
  }),
  component: CoachWorkoutPage,
});

function CoachWorkoutPage() {
  const { plan: planId, day: dayId } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [row, setRow] = useState<PlanRow | null>(null);
  const [session, setSession] = useState<ClientSession | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [ready, setReady] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    (async () => {
      if (!planId) {
        setReady(true);
        return;
      }

      try {
        let found: PlanRow | null = null;

        if (user) {
          const rows = await fetchPlans(user.id);
          found = rows.find((r) => r.id === planId) ?? null;
        }

        if (!found) {
          try {
            const local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]") as {
              id: string;
              name: string;
              goal: string;
              days: PlanRow["data"]["days"];
            }[];
            const c = local.find((x) => x.id === planId);
            if (c) {
              found = {
                id: c.id,
                owner_id: "",
                data: c,
                link_token: "",
                link_access: "none",
                access: "local",
              };
            }
          } catch {
            /* ignore */
          }
        }

        if (cancelled) return;
        setRow(found);

        if (found) {
          const day =
            (dayId ? found.data.days.find((d) => d.id === dayId) : null) ??
            found.data.days.find((d) => d.exercises.length > 0) ??
            found.data.days[0];

          const draft = day
            ? planDayToClientSession(found.id, found.data, day)
            : emptyClientSession(found.id, found.data);

          setSession(draft);
          setHistory(loadClientSessions(found.id).map(clientSessionAsSession));
        }
      } catch (e) {
        console.error(e);
        toast.error("Nie udało się wczytać planu");
      }
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [planId, dayId, user?.id, authLoading]);

  const summary = useMemo(() => {
    if (!session) return null;
    return daySummary(clientSessionAsSession(session), history);
  }, [session, history]);

  const patchExercise = (index: number, ex: Exercise) => {
    setSession((s) => {
      if (!s) return s;
      const exercises = s.exercises.map((e, i) => (i === index ? ex : e));
      return { ...s, exercises };
    });
  };

  const removeExercise = (index: number) => {
    setSession((s) => {
      if (!s) return s;
      return { ...s, exercises: s.exercises.filter((_, i) => i !== index) };
    });
  };

  const moveExercise = (index: number, dir: -1 | 1) => {
    setSession((s) => {
      if (!s) return s;
      const next = [...s.exercises];
      const j = index + dir;
      if (j < 0 || j >= next.length) return s;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...s, exercises: next };
    });
  };

  const addExercise = () => {
    setSession((s) => {
      if (!s) return s;
      return {
        ...s,
        exercises: [
          ...s.exercises,
          { id: uid(), name: "", sets: [{ reps: 0, weight: 0 }] },
        ],
      };
    });
  };

  const finish = () => {
    if (!session) return;
    setSaving(true);
    try {
      const done: ClientSession = {
        ...session,
        endedAt: new Date().toISOString(),
        date: session.date || todayISO(),
      };
      saveClientSession(done);
      toast.success(`Zapisano trening u ${done.clientName}`);
      void navigate({ to: "/plany", search: {} });
    } catch {
      toast.error("Nie udało się zapisać");
    }
    setSaving(false);
  };

  if (!ready || authLoading) {
    return (
      <main className="min-h-screen bg-background pb-24 px-4 pt-10">
        <p className="text-sm text-muted-foreground">Wczytywanie…</p>
        <AppNav />
      </main>
    );
  }

  if (!planId || !row || !session) {
    return (
      <main className="min-h-screen bg-background pb-24 px-4 pt-10">
        <Link to="/plany" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Plany
        </Link>
        <p className="mt-6 text-sm text-muted-foreground">
          Brak planu. Wróć do planów i wybierz podopiecznego oraz dzień.
        </p>
        <AppNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-28">
      <header className="border-b border-border px-4 pb-4 pt-8">
        <div className="mx-auto max-w-2xl">
          <Link to="/plany" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Plany
          </Link>
          <div className="mt-2 flex items-center gap-2 text-primary">
            <Play className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              Trening z podopiecznym
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-foreground">{session.clientName}</h1>
          <p className="text-sm text-muted-foreground">
            {session.dayName} · {session.date}
          </p>
          {summary ? (
            <p className="mt-2 text-xs tabular-nums text-muted-foreground">
              {Math.round(summary.volume).toLocaleString("pl-PL")} kg ·{" "}
              {session.exercises.length} ćw.
              {summary.pct != null
                ? ` · ${summary.pct > 0 ? "+" : ""}${summary.pct.toFixed(1)}% vs poprzedni`
                : ""}
            </p>
          ) : null}
        </div>
      </header>

      <section className="mx-auto max-w-2xl space-y-3 px-4 py-4">
        {session.exercises.map((ex, i) => (
          <ExerciseCard
            key={ex.id}
            index={i}
            exercise={ex}
            date={session.date}
            sessions={history}
            onChange={(updated) => patchExercise(i, updated)}
            onRemove={() => removeExercise(i)}
            onMoveUp={() => moveExercise(i, -1)}
            onMoveDown={() => moveExercise(i, 1)}
            canMoveUp={i > 0}
            canMoveDown={i < session.exercises.length - 1}
          />
        ))}

        <button
          type="button"
          onClick={addExercise}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-3 text-sm font-medium text-primary"
        >
          <Plus className="h-4 w-4" /> Dodaj ćwiczenie
        </button>

        <label className="block rounded-2xl border border-border bg-card p-3">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Notatka do treningu
          </span>
          <textarea
            value={session.note || ""}
            onChange={(e) => setSession({ ...session, note: e.target.value })}
            rows={3}
            placeholder="Samopoczucie, technika, plan na następny raz…"
            className="mt-2 w-full resize-none rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </label>

        <button
          type="button"
          disabled={saving}
          onClick={finish}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Zapisywanie…" : "Zakończ i zapisz u podopiecznego"}
        </button>

        <button
          type="button"
          onClick={() => void navigate({ to: "/plany", search: {} })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-xs text-muted-foreground"
        >
          <Square className="h-3.5 w-3.5" /> Anuluj bez zapisu
        </button>
      </section>

      <AppNav />
    </main>
  );
}
