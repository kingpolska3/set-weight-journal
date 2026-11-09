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
  saveClientSessionWithCloud,
  syncClientSessionsFromCloud,
  clientSessionAsSession,
  type ClientSession,
} from "@/lib/client-sessions";
import { LOCAL_KEY, fetchPlans, type PlanRow } from "@/lib/trainer-plans";
import { todayISO, uid, volume, type Exercise, type Session } from "@/lib/workout-store";

type Search = { plan?: string | undefined; day?: string | undefined; session?: string | undefined };

export const Route = createFileRoute("/trening-podopieczny")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    plan: typeof s["plan"] === "string" ? s["plan"] : undefined,
    day: typeof s["day"] === "string" ? s["day"] : undefined,
    session: typeof s["session"] === "string" ? s["session"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sesja podopiecznego — zapis treningu" },
      {
        name: "description",
        content: "Prowadź trening podopiecznego i zapisuj postępy w jego historii.",
      },
      { property: "og:title", content: "Sesja podopiecznego — zapis treningu" },
      { property: "og:description", content: "Uzupełniaj wyniki ćwiczeń i zapisuj sesję podopiecznego w dzienniku trenera." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CoachWorkoutPage,
});

function CoachWorkoutPage() {
  const { plan: planId, day: dayId, session: sessionId } = Route.useSearch();
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
          let clientSessions: ClientSession[] = [];
          try {
            if (user) {
              clientSessions = await syncClientSessionsFromCloud(found.id);
            } else {
              clientSessions = loadClientSessions(found.id);
            }
          } catch {
            clientSessions = loadClientSessions(found.id);
          }

          if (!cancelled) {
            setHistory(clientSessions.map(clientSessionAsSession));
          }

          // Jeśli przekazano sessionId – wczytaj istniejącą sesję do edycji
          if (sessionId) {
            const existing = clientSessions.find((s) => s.id === sessionId);
            if (existing) {
              setSession(existing);
            } else {
              toast.error("Nie znaleziono sesji do edycji");
            }
          } else {
            // W przeciwnym razie stwórz nową sesję z szablonu planu
            const day =
              (dayId ? found.data.days.find((d) => d.id === dayId) : null) ??
              found.data.days.find((d) => d.exercises.length > 0) ??
              found.data.days[0];

            const draft = day
              ? planDayToClientSession(found.id, found.data, day)
              : emptyClientSession(found.id, found.data);

            setSession(draft);
          }
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
  }, [planId, dayId, sessionId, user?.id, authLoading]);

  const totalVolume = useMemo(() => {
    if (!session) return 0;
    return session.exercises.reduce((sum, ex) => sum + volume(ex.sets), 0);
  }, [session]);

  const patchExercise = (index: number, ex: Exercise) => {
    setSession((s) => {
      if (!s) return s;
      return { ...s, exercises: s.exercises.map((e, i) => (i === index ? ex : e)) };
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
      const current = next[index];
      const target = next[j];
      if (!current || !target) return s;
      next[index] = target;
      next[j] = current;
      return { ...s, exercises: next };
    });
  };

  const addExercise = () => {
    setSession((s) => {
      if (!s) return s;
      return {
        ...s,
        exercises: [...s.exercises, { id: uid(), name: "", sets: [{ reps: 0, weight: 0 }] }],
      };
    });
  };

  const finish = async () => {
    if (!session) return;
    setSaving(true);
    try {
      const done: ClientSession = {
        ...session,
        endedAt: session.endedAt || new Date().toISOString(),
        date: session.date || todayISO(),
      };

      try {
        await saveClientSessionWithCloud(done, user?.id);
      } catch (cloudErr) {
        console.warn("Cloud save failed, saving locally:", cloudErr);
        const existing = loadClientSessions(done.planId);
        const updated = [done, ...existing.filter((s) => s.id !== done.id)];
        if (typeof window !== "undefined") {
          localStorage.setItem(`client-sessions-${done.planId}`, JSON.stringify(updated));
        }
      }

      toast.success(
        sessionId
          ? `Zaktualizowano trening u ${done.clientName}`
          : `Zapisano trening u ${done.clientName}`
      );
      void navigate({ to: "/plany" });
    } catch (e) {
      console.error(e);
      toast.error("Nie udało się zapisać");
    } finally {
      setSaving(false);
    }
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
              {sessionId ? "Edycja treningu podopiecznego" : "Trening z podopiecznym"}
            </span>
          </div>
          <h1 className="mt-1 text-xl font-bold text-foreground">{session.clientName}</h1>
          <p className="text-sm text-muted-foreground">
            {session.dayName} · {session.date}
          </p>
          <p className="mt-2 text-xs tabular-nums text-muted-foreground">
            {Math.round(totalVolume).toLocaleString("pl-PL")} kg · {session.exercises.length} ćw.
          </p>
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
          onClick={() => void finish()}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving
            ? "Zapisywanie…"
            : sessionId
            ? "Zapisz zmiany w treningu"
            : "Zakończ i zapisz u podopiecznego"}
        </button>

        <button
          type="button"
          onClick={() => void navigate({ to: "/plany" })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border py-2.5 text-xs text-muted-foreground"
        >
          <Square className="h-3.5 w-3.5" /> Anuluj bez zapisu
        </button>
      </section>

      <AppNav />
    </main>
  );
}
