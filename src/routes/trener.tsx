import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  History,
  NotebookPen,
  Play,
  Plus,
  RefreshCw,
  Settings2,
  Share2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { useAuth } from "@/hooks/useAuth";
import { useTrainerAccess } from "@/hooks/useTrainerAccess";
import {
  BOOKING_STATUS_LABEL,
  formatDatePL,
  loadBookingsForTrainer,
  loadAvailability,
  minutesToLabel,
  syncTrainerCloud,
  type Booking,
} from "@/lib/booking";
import {
  clientSessionAsSession,
  loadAllClientSessions,
  loadClientSessions,
  syncAllClientSessionsFromCloud,
  type ClientSession,
} from "@/lib/client-sessions";
import {
  createPlan,
  fetchPlans,
  publishPlanUpdate,
  type PlanRow,
} from "@/lib/trainer-plans";
import { sessionVolume, shortDatePL, workingSets } from "@/lib/workout-store";

export const Route = createFileRoute("/trener")({
  validateSearch: (s: Record<string, unknown>): { tab?: string; client?: string } => ({
    tab: typeof s.tab === "string" ? s.tab : undefined,
    client: typeof s.client === "string" ? s.client : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Panel trenera — podopieczni i plany" },
      {
        name: "description",
        content: "Zarządzaj podopiecznymi, planami, sesjami i rezerwacjami w jednym miejscu.",
      },
    ],
  }),
  component: TrainerPanelPage,
});

type TabId = "podopieczni" | "kalendarz" | "sesje" | "ustawienia";

const TABS: { id: TabId; label: string; icon: typeof Users }[] = [
  { id: "podopieczni", label: "Podopieczni", icon: Users },
  { id: "kalendarz", label: "Kalendarz", icon: CalendarDays },
  { id: "sesje", label: "Sesje", icon: History },
  { id: "ustawienia", label: "Ustawienia", icon: Settings2 },
];

const NOTES_KEY = "trainer-private-notes-v1";

function loadPrivateNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    if (!raw) return {};
    const p = JSON.parse(raw) as Record<string, string>;
    return p && typeof p === "object" ? p : {};
  } catch {
    return {};
  }
}

function savePrivateNote(planId: string, text: string) {
  const all = loadPrivateNotes();
  all[planId] = text;
  try {
    localStorage.setItem(NOTES_KEY, JSON.stringify(all));
  } catch {
    /* quota */
  }
}

function statusForClient(
  plan: PlanRow,
  sessions: ClientSession[],
  bookings: Booking[],
): { label: string; tone: string } {
  const hasDays = (plan.data.days ?? []).some((d) => (d.exercises ?? []).length > 0);
  const pending = bookings.some(
    (b) =>
      b.status === "pending" &&
      (b.clientName || "").toLowerCase() === (plan.data.name || "").toLowerCase(),
  );
  if (pending) return { label: "Oczekuje na rezerwację", tone: "text-amber-500" };
  if (!hasDays) return { label: "Brak planu", tone: "text-muted-foreground" };
  if (sessions.length === 0) return { label: "Plan aktywny · brak sesji", tone: "text-primary" };
  return { label: "Plan aktywny", tone: "text-primary" };
}

function TrainerPanelPage() {
  const { user, loading } = useAuth();
  const { isTrainer, checking } = useTrainerAccess(user?.id);
  const navigate = useNavigate();
  const search = Route.useSearch();

  const tab: TabId =
    search.tab === "kalendarz" || search.tab === "sesje" || search.tab === "ustawienia"
      ? search.tab
      : "podopieczni";
  const clientId = search.client || null;

  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [allSessions, setAllSessions] = useState<ClientSession[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [ready, setReady] = useState(false);
  const [newName, setNewName] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>(() => loadPrivateNotes());
  const [publishing, setPublishing] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setPlans([]);
      setAllSessions([]);
      setBookings([]);
      setReady(true);
      return;
    }
    try {
      const [rows] = await Promise.all([
        fetchPlans(user.id),
        syncAllClientSessionsFromCloud(user.id).catch(() => loadAllClientSessions()),
        syncTrainerCloud(user.id).catch(() => null),
      ]);
      setPlans(rows.filter((p) => p.access === "owner"));
      setAllSessions(loadAllClientSessions());
      setBookings(loadBookingsForTrainer(user.id));
    } catch {
      try {
        setPlans((await fetchPlans(user.id)).filter((p) => p.access === "owner"));
      } catch {
        setPlans([]);
      }
      setAllSessions(loadAllClientSessions());
      setBookings(user ? loadBookingsForTrainer(user.id) : []);
    } finally {
      setReady(true);
    }
  }, [user]);

  useEffect(() => {
    if (loading || checking) return;
    if (!user) {
      setReady(true);
      return;
    }
    if (!isTrainer) {
      void navigate({ to: "/narzedzia", replace: true });
      return;
    }
    void refresh();
  }, [user, loading, checking, isTrainer, navigate, refresh]);

  const setTab = (id: TabId) => {
    void navigate({
      to: "/trener",
      search: clientId ? { tab: id, client: clientId } : { tab: id },
    });
  };

  const openClient = (id: string) => {
    void navigate({ to: "/trener", search: { tab: "podopieczni", client: id } });
  };

  const closeClient = () => {
    void navigate({ to: "/trener", search: { tab: "podopieczni" } });
  };

  const addClient = async () => {
    const name = newName.trim();
    if (!name || !user) return;
    try {
      const row = await createPlan(user.id, {
        id: crypto.randomUUID(),
        name,
        goal: "",
        days: [],
        trainingDays: [],
        intake: {},
      });
      setNewName("");
      toast.success(`Dodano: ${name}`);
      await refresh();
      openClient(row.id);
    } catch {
      toast.error("Nie udało się dodać podopiecznego");
    }
  };

  const publish = async (plan: PlanRow) => {
    if (!user) return;
    setPublishing(plan.id);
    try {
      await publishPlanUpdate(plan.id, plan.data);
      toast.success("Wysłano uaktualnienie planu");
    } catch {
      toast.error("Nie udało się opublikować aktualizacji");
    } finally {
      setPublishing(null);
    }
  };

  const active = useMemo(
    () => (clientId ? plans.find((p) => p.id === clientId) ?? null : null),
    [clientId, plans],
  );

  if (loading || checking) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <p className="p-8 text-center text-sm text-muted-foreground">Ładowanie…</p>
        <AppNav />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
            Zaloguj się w{" "}
            <Link to="/profil" className="font-medium text-primary">
              Profilu
            </Link>
            , aby otworzyć panel trenera.
          </p>
        </div>
        <AppNav />
      </main>
    );
  }

  if (!isTrainer) {
    return (
      <main className="min-h-screen bg-background pb-24">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <p className="text-sm text-muted-foreground">Brak dostępu do panelu trenera.</p>
        </div>
        <AppNav />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border px-4 pb-4 pt-8">
        <div className="mx-auto max-w-2xl">
          {active ? (
            <button
              type="button"
              onClick={closeClient}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Podopieczni
            </button>
          ) : (
            <div className="flex items-center gap-2 text-primary">
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]">Panel trenera</span>
            </div>
          )}
          <h1 className="mt-2 text-2xl font-bold text-foreground">
            {active ? active.data.name || "Podopieczny" : "Trener"}
          </h1>
          {active?.data.goal ? (
            <p className="mt-1 text-sm text-muted-foreground">Cel: {active.data.goal}</p>
          ) : !active ? (
            <p className="mt-1 text-sm text-muted-foreground">
              Podopieczni, kalendarz, sesje i ustawienia w jednym miejscu.
            </p>
          ) : null}
        </div>
      </header>

      {!active && (
        <div className="mx-auto max-w-2xl px-4 pt-4">
          <div className="flex gap-1 rounded-xl border border-border bg-card p-1">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-2 text-[11px] font-medium transition-colors ${
                  tab === id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="mx-auto max-w-2xl space-y-4 px-4 py-5">
        {!ready ? (
          <p className="text-sm text-muted-foreground">Ładowanie danych…</p>
        ) : active ? (
          <ClientDetail
            plan={active}
            sessions={loadClientSessions(active.id)}
            bookings={bookings.filter(
              (b) =>
                (b.clientName || "").toLowerCase() === (active.data.name || "").toLowerCase() ||
                b.clientId === active.id,
            )}
            note={notes[active.id] ?? ""}
            onNoteChange={(text) => {
              setNotes((prev) => ({ ...prev, [active.id]: text }));
              savePrivateNote(active.id, text);
            }}
            onPublish={() => void publish(active)}
            publishing={publishing === active.id}
            onStartTraining={() =>
              void navigate({
                to: "/trening-podopieczny",
                search: { plan: active.id },
              })
            }
            onOpenFullPlan={() =>
              void navigate({ to: "/plany", search: { plan: undefined } })
            }
          />
        ) : tab === "podopieczni" ? (
          <PodopieczniTab
            plans={plans}
            allSessions={allSessions}
            bookings={bookings}
            newName={newName}
            setNewName={setNewName}
            onAdd={() => void addClient()}
            onOpen={openClient}
            onStart={(id) =>
              void navigate({ to: "/trening-podopieczny", search: { plan: id } })
            }
            onPublish={(p) => void publish(p)}
            publishing={publishing}
            onOpenPlanEditor={() => void navigate({ to: "/plany" })}
          />
        ) : tab === "kalendarz" ? (
          <KalendarzTab bookings={bookings} />
        ) : tab === "sesje" ? (
          <SesjeTab sessions={allSessions} plans={plans} />
        ) : (
          <UstawieniaTab userId={user.id} onRefresh={() => void refresh()} />
        )}
      </section>
      <AppNav />
    </main>
  );
}

function PodopieczniTab({
  plans,
  allSessions,
  bookings,
  newName,
  setNewName,
  onAdd,
  onOpen,
  onStart,
  onPublish,
  publishing,
  onOpenPlanEditor,
}: {
  plans: PlanRow[];
  allSessions: ClientSession[];
  bookings: Booking[];
  newName: string;
  setNewName: (v: string) => void;
  onAdd: () => void;
  onOpen: (id: string) => void;
  onStart: (id: string) => void;
  onPublish: (p: PlanRow) => void;
  publishing: string | null;
  onOpenPlanEditor: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder="Imię podopiecznego…"
          maxLength={60}
          className="min-w-0 flex-1 rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Dodaj
        </button>
      </div>

      <button
        type="button"
        onClick={onOpenPlanEditor}
        className="w-full rounded-xl border border-dashed border-border px-3 py-2 text-left text-xs text-muted-foreground hover:border-primary hover:text-foreground"
      >
        Pełny edytor planów (dni, serie, udostępnianie) →
      </button>

      {plans.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 text-center">
          <p className="text-sm font-medium text-foreground">Brak podopiecznych</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Dodaj pierwszą osobę, aby tworzyć plany i logować wspólne treningi.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {plans.map((plan) => {
            const sessions = allSessions.filter((s) => s.planId === plan.id);
            const last = sessions[0];
            const st = statusForClient(plan, sessions, bookings);
            return (
              <li
                key={plan.id}
                className="rounded-2xl border border-border bg-card p-4 shadow-sm"
              >
                <button type="button" onClick={() => onOpen(plan.id)} className="w-full text-left">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-foreground">
                        {plan.data.name || "Bez nazwy"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {plan.data.goal?.trim()
                          ? plan.data.goal
                          : "Brak ustawionego celu"}
                      </p>
                    </div>
                    <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                  </div>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                    <span className={`font-medium ${st.tone}`}>{st.label}</span>
                    <span className="text-muted-foreground">
                      · Ostatni trening:{" "}
                      {last ? shortDatePL(last.date) : "—"}
                    </span>
                  </div>
                </button>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <ActionBtn
                    icon={ClipboardList}
                    label="Plan"
                    onClick={() => onOpen(plan.id)}
                  />
                  <ActionBtn
                    icon={Play}
                    label="Start"
                    onClick={() => onStart(plan.id)}
                  />
                  <ActionBtn
                    icon={History}
                    label="Historia"
                    onClick={() => onOpen(plan.id)}
                  />
                  <ActionBtn
                    icon={Share2}
                    label={publishing === plan.id ? "…" : "Aktualizacja"}
                    onClick={() => onPublish(plan)}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Play;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-primary"
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function ClientDetail({
  plan,
  sessions,
  bookings,
  note,
  onNoteChange,
  onPublish,
  publishing,
  onStartTraining,
  onOpenFullPlan,
}: {
  plan: PlanRow;
  sessions: ClientSession[];
  bookings: Booking[];
  note: string;
  onNoteChange: (t: string) => void;
  onPublish: () => void;
  publishing: boolean;
  onStartTraining: () => void;
  onOpenFullPlan: () => void;
}) {
  const progress = useMemo(() => {
    let volume = 0;
    let sets = 0;
    const byEx = new Map<string, { name: string; volume: number; top: number }>();
    for (const s of sessions) {
      const as = clientSessionAsSession(s);
      volume += sessionVolume(as);
      for (const ex of as.exercises ?? []) {
        const ws = workingSets(ex.sets ?? []);
        sets += ws.length;
        const key = (ex.name || "").toLowerCase().trim();
        if (!key) continue;
        const vol = ws.reduce((a, x) => a + (Number(x.weight) || 0) * (Number(x.reps) || 0), 0);
        const top = ws.reduce((a, x) => Math.max(a, Number(x.weight) || 0), 0);
        const prev = byEx.get(key);
        if (!prev) byEx.set(key, { name: ex.name, volume: vol, top });
        else byEx.set(key, { name: ex.name, volume: prev.volume + vol, top: Math.max(prev.top, top) });
      }
    }
    const topEx = [...byEx.values()].sort((a, b) => b.volume - a.volume).slice(0, 6);
    return { volume, sets, sessions: sessions.length, topEx };
  }, [sessions]);

  const upcoming = bookings
    .filter((b) => b.status === "pending" || b.status === "confirmed")
    .sort((a, b) => (a.date + a.startMin).localeCompare(b.date + b.startMin))
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onStartTraining}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Play className="h-4 w-4" /> Start treningu
        </button>
        <button
          type="button"
          onClick={onOpenFullPlan}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm font-medium text-foreground"
        >
          <ClipboardList className="h-4 w-4" /> Edytuj plan
        </button>
        <button
          type="button"
          onClick={onPublish}
          disabled={publishing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary disabled:opacity-50"
        >
          <Share2 className="h-4 w-4" />
          {publishing ? "Wysyłanie…" : "Udostępnij aktualizację"}
        </button>
      </div>

      {/* Plan */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Plan treningowy</h2>
        {(plan.data.days ?? []).length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Brak dni w planie. Użyj „Edytuj plan”, aby dodać ćwiczenia.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {(plan.data.days ?? []).map((d) => (
              <li key={d.id} className="rounded-xl border border-border/80 bg-secondary/30 p-3">
                <p className="text-sm font-medium text-foreground">
                  {d.name}
                  {d.weekday ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      {d.weekday}
                    </span>
                  ) : null}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {(d.exercises ?? []).map((ex) => (
                    <li key={ex.id} className="text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{ex.name}</span>
                      {" · "}
                      {(ex.sets ?? []).length} serii
                      {ex.coachNote || ex.note ? (
                        <span className="block text-[11px] text-muted-foreground/90">
                          {ex.coachNote || ex.note}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Historia */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Historia treningów</h2>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Sesje z „Trening z podopiecznym”
        </p>
        {sessions.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Brak zapisionych sesji.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {sessions.slice(0, 12).map((s) => {
              const vol = sessionVolume(clientSessionAsSession(s));
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-xs"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {shortDatePL(s.date)}
                      {s.dayName ? ` · ${s.dayName}` : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {(s.exercises ?? []).length} ćw. · {Math.round(vol)} kg
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Postępy */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Postępy</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Sesje" value={String(progress.sessions)} />
          <Stat label="Objętość" value={`${Math.round(progress.volume)} kg`} />
          <Stat label="Serie" value={String(progress.sets)} />
        </div>
        {progress.topEx.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {progress.topEx.map((ex) => (
              <li
                key={ex.name}
                className="flex justify-between text-xs text-muted-foreground"
              >
                <span className="truncate font-medium text-foreground">{ex.name}</span>
                <span className="tabular-nums">
                  max {ex.top} kg · {Math.round(ex.volume)} kg obj.
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notatki prywatne */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <NotebookPen className="h-4 w-4 text-primary" />
         <h2 className="text-sm font-semibold text-foreground">Notatki trenera</h2>
        </div>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          Widoczne tylko dla Ciebie — nie trafiają do planu klienta.
        </p>
        <textarea
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          rows={4}
          placeholder="Obserwacje, kontuzje, ustalenia…"
          className="mt-2 w-full resize-y rounded-xl border border-input bg-secondary px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
        />
      </section>

      {/* Rezerwacje */}
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Rezerwacje</h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Brak nadchodzących terminów z tą osobą.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="rounded-lg border border-border/70 px-3 py-2 text-xs text-muted-foreground"
              >
                <span className="font-medium text-foreground">
                  {formatDatePL(b.date)} · {minutesToLabel(b.startMin)}–
                  {minutesToLabel(b.endMin)}
                </span>
                {" · "}
                {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                {b.location ? ` · ${b.location}` : ""}
              </li>
            ))}
          </ul>
        )}
        <Link
          to="/rezerwacje"
          className="mt-2 inline-block text-[11px] font-medium text-primary"
        >
          Otwórz rezerwacje →
        </Link>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 px-2 py-2 text-center">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}

function KalendarzTab({ bookings }: { bookings: Booking[] }) {
  const list = [...bookings].sort((a, b) =>
    (a.date + String(a.startMin)).localeCompare(b.date + String(b.startMin)),
  );
  const upcoming = list.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  );
  const past = list.filter(
    (b) => b.status === "declined" || b.status === "cancelled" || b.status === "completed",
  );

  return (
    <div className="space-y-4">
      <Link
        to="/rezerwacje"
        className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground"
      >
        <span>Pełny widok rezerwacji i potwierdzeń</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </Link>

      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Nadchodzące
        </h2>
        {upcoming.length === 0 ? (
          <p className="mt-2 text-xs text-muted-foreground">Brak nadchodzących terminów.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {upcoming.map((b) => (
              <BookingRow key={b.id} b={b} />
            ))}
          </ul>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Archiwum
          </h2>
          <ul className="mt-2 space-y-2">
            {past.slice(0, 10).map((b) => (
              <BookingRow key={b.id} b={b} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function BookingRow({ b }: { b: Booking }) {
  return (
    <li className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs">
      <p className="font-medium text-foreground">
        {formatDatePL(b.date)} · {minutesToLabel(b.startMin)}–{minutesToLabel(b.endMin)}
      </p>
      <p className="text-muted-foreground">
        {b.clientName}
        {b.location ? ` · ${b.location}` : ""} · {BOOKING_STATUS_LABEL[b.status] ?? b.status}
      </p>
    </li>
  );
}

function SesjeTab({
  sessions,
  plans,
}: {
  sessions: ClientSession[];
  plans: PlanRow[];
}) {
  const nameByPlan = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of plans) m.set(p.id, p.data.name || "Bez nazwy");
    return m;
  }, [plans]);

  const sorted = [...sessions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Ostatnie sesje zalogowane z podopiecznymi. Uzupełniaj je przez „Start treningu”.
      </p>
      {sorted.length === 0 ? (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Brak sesji. Otwórz podopiecznego i uruchom trening.
        </p>
      ) : (
        <ul className="space-y-2">
          {sorted.slice(0, 30).map((s) => (
            <li
              key={s.id}
              className="rounded-xl border border-border bg-card px-3 py-2.5 text-xs"
            >
              <p className="font-medium text-foreground">
                {nameByPlan.get(s.planId) || s.clientName || "Podopieczny"}
              </p>
              <p className="text-muted-foreground">
                {shortDatePL(s.date)}
                {s.dayName ? ` · ${s.dayName}` : ""} · {(s.exercises ?? []).length} ćw. ·{" "}
                {Math.round(sessionVolume(clientSessionAsSession(s)))} kg
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UstawieniaTab({
  userId,
  onRefresh,
}: {
  userId: string;
  onRefresh: () => void;
}) {
  const avail = loadAvailability(userId);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Dostępność i siłownie</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Godziny, lokalizacje i wykluczone dni ustawiasz w module rezerwacji.
        </p>
        {avail ? (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            <li>
              Siłownie:{" "}
              <span className="text-foreground">
                {(avail.locations ?? []).filter(Boolean).join(", ") || "—"}
              </span>
            </li>
            <li>
              Wyprzedzenie min.:{" "}
              <span className="text-foreground">{avail.minNoticeHours ?? "—"} h</span>
            </li>
            <li>
              Rezerwacja do:{" "}
              <span className="text-foreground">{avail.bookAheadDays ?? "—"} dni</span>
            </li>
          </ul>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">
            Brak zapisanej dostępności — uzupełnij w Rezerwacjach.
          </p>
        )}
        <Link
          to="/rezerwacje"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary"
        >
          <Settings2 className="h-4 w-4" /> Otwórz ustawienia dostępności
        </Link>
      </section>

      <section className="rounded-2xl border border-border bg-card p-4">
        <h2 className="text-sm font-semibold text-foreground">Narzędzia</h2>
        <div className="mt-2 flex flex-col gap-2">
          <Link to="/narzedzia" className="text-sm text-primary">
            Narzędzia treningowe (szablony, przerwy) →
          </Link>
          <Link to="/plany" className="text-sm text-primary">
            Klasyczny edytor planów →
          </Link>
        </div>
      </section>

      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-sm text-foreground"
      >
        <RefreshCw className="h-4 w-4" /> Odśwież dane panelu
      </button>
    </div>
  );
}

