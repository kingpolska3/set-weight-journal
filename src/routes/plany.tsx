import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  Copy,
  Eye,
  Flame,
  Pencil,
  Plus,
  Share2,
  Timer,
  Trash2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { ClientIntake } from "@/components/ClientIntake";
import { ExerciseAtlas } from "@/components/ExerciseAtlas";
import { useAuth } from "@/hooks/useAuth";
import { ATLAS_NAMES } from "@/lib/exercise-atlas";
import { formatTime, parseRepsOrTime, uid } from "@/lib/workout-store";
import {
  LOCAL_KEY,
  claimLink,
  createPlan,
  deletePlan,
  fetchPlans,
  leavePlan,
  listShares,
  removeShare,
  savePlanData,
  setLinkAccess,
  sharePlan,
  type Client,
  type LinkAccess,
  type PlanDay,
  type PlanExercise,
  type PlanRow,
  type PlanSet,
  type ShareEntry,
} from "@/lib/trainer-plans";
import { clientToReceivedPlan, upsertReceivedPlan } from "@/lib/received-plans";

export const Route = createFileRoute("/plany")({
  validateSearch: (s: Record<string, unknown>): { plan?: string } =>
    typeof s["plan"] === "string" ? { plan: s["plan"] } : {},
  head: () => ({
    meta: [
      { title: "Tworzenie planów treningowych dla podopiecznych" },
      {
        name: "description",
        content: "Dziennik trenera: twórz i udostępniaj plany treningowe podopiecznym.",
      },
      { property: "og:title", content: "Tworzenie planów treningowych dla podopiecznych" },
      {
        property: "og:description",
        content: "Twórz plany treningowe, oznaczaj serie rozgrzewkowe i udostępniaj je innym.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlansPage,
});

function setTonnage(s: PlanSet) {
  if (s.warmup) return 0;
  const p = parseRepsOrTime(s.reps);
  const w = Number(s.weight.replace(",", ".")) || 0;
  return p.timeSec ? 0 : p.reps * w;
}

function PlansPage() {
  const { user, loading } = useAuth();
  const { plan: linkToken } = Route.useSearch();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [ready, setReady] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  useEffect(() => {
    if (loading) return;
    let cancelled = false;
    (async () => {
      let local: Client[] = [];
      try {
        local = JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
      } catch {
        /* ignore */
      }
      if (!user) {
        setPlans(
          local.map((c) => ({
            id: c.id,
            owner_id: "",
            data: c,
            link_token: "",
            link_access: "none",
            access: "local",
          })),
        );
        setReady(true);
        return;
      }
      try {
        if (local.length) {
          for (const c of local) await createPlan(user.id, c);
          localStorage.removeItem(LOCAL_KEY);
        }
        let claimed: string | null = null;
        if (linkToken) {
          claimed = await claimLink(linkToken);
          if (!claimed) {
            toast.error("Link do planu jest nieaktywny");
          } else {
            try {
              const rowsAfter = await fetchPlans(user.id);
              const claimedRow = rowsAfter.find((r) => r.id === claimed);
              if (claimedRow) {
                upsertReceivedPlan(
                  clientToReceivedPlan(claimedRow.id, claimedRow.data, {
                    token: linkToken,
                    sourceLabel: "Link udostępnienia",
                  }),
                );
                toast.success("Plan zapisany w Narzędziach → Otrzymane plany");
                void navigate({ to: "/narzedzia", search: {}, replace: true });
                if (cancelled) return;
                setPlans(rowsAfter);
                setReady(true);
                return;
              }
            } catch (e) {
              console.error(e);
            }
          }
          void navigate({ to: "/plany", search: {}, replace: true });
        }
        const rows = await fetchPlans(user.id);
        if (cancelled) return;
        setPlans(rows);
        if (claimed) setActiveId(claimed);
      } catch (e) {
        toast.error("Nie udało się wczytać planów");
        console.error(e);
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, loading]);

  useEffect(() => {
    if (ready && !user) localStorage.setItem(LOCAL_KEY, JSON.stringify(plans.map((p) => p.data)));
  }, [plans, ready, user]);

  const active = plans.find((p) => p.id === activeId) ?? null;
  const own = plans.filter((p) => p.access === "owner" || p.access === "local");
  const shared = plans.filter((p) => p.access === "edit" || p.access === "view");

  const patchPlan = (row: PlanRow, data: Client) => {
    setPlans((l) => l.map((x) => (x.id === row.id ? { ...x, data } : x)));
    if (row.access === "local") return;
    clearTimeout(timers.current[row.id]);
    timers.current[row.id] = setTimeout(() => {
      savePlanData(row.id, data).catch(() => toast.error("Nie zapisano zmian w planie"));
    }, 600);
  };

  const addClient = async () => {
    const name = newName.trim();
    if (!name) return;
    const data: Client = { id: uid(), name, goal: "", days: [] };
    setNewName("");
    if (!user) {
      setPlans((l) => [
        ...l,
        {
          id: data.id,
          owner_id: "",
          data,
          link_token: "",
          link_access: "none",
          access: "local",
        },
      ]);
      setActiveId(data.id);
      return;
    }
    try {
      const row = await createPlan(user.id, data);
      setPlans((l) => [...l, row]);
      setActiveId(row.id);
    } catch {
      toast.error("Nie udało się dodać podopiecznego");
    }
  };

  const removeActive = async () => {
    if (!active) return;
    const mine = active.access === "owner" || active.access === "local";
    if (
      !confirm(
        mine
          ? `Usunąć plan „${active.data.name}”?`
          : `Usunąć udostępniony plan „${active.data.name}” ze swojej biblioteki?`,
      )
    )
      return;
    try {
      if (active.access === "owner") await deletePlan(active.id);
      else if (user && active.access !== "local") await leavePlan(active.id, user.id);
      setPlans((l) => l.filter((x) => x.id !== active.id));
      setActiveId(null);
    } catch {
      toast.error("Nie udało się usunąć");
    }
  };

  const chip = (p: PlanRow) => (
    <button
      key={p.id}
      onClick={() => setActiveId(p.id)}
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
        p.id === activeId
          ? "bg-primary text-primary-foreground"
          : "bg-secondary text-muted-foreground"
      }`}
    >
      {p.access === "view" ? (
        <Eye className="h-3 w-3" />
      ) : p.access === "edit" ? (
        <Pencil className="h-3 w-3" />
      ) : null}
      {p.data.name || "Bez nazwy"}
    </button>
  );

  return (
    <main className="min-h-screen bg-background pb-24">
      <datalist id="plan-ex-names">
        {ATLAS_NAMES.map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
      <header className="border-b border-border px-4 pb-5 pt-8">
        <div className="mx-auto max-w-2xl">
          <Link to="/narzedzia" className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Narzędzia
          </Link>
          <div className="mt-2 flex items-center gap-2 text-primary">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Dziennik trenera</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Tworzenie planów treningowych</h1>
        </div>
      </header>
      <section className="mx-auto max-w-2xl space-y-4 px-4 py-6">
        {!loading && !user ? (
          <p className="rounded-xl bg-secondary/60 p-3 text-xs text-muted-foreground">
            Plany zapisują się na tym urządzeniu.{" "}
            <Link to="/profil" className="font-medium text-primary">
              Zaloguj się w Profilu
            </Link>
            , aby je synchronizować i udostępniać.
          </p>
        ) : null}
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && void addClient()}
            placeholder="Imię podopiecznego…"
            maxLength={60}
            className="min-w-0 flex-1 rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button
            onClick={() => void addClient()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
          >
            <UserPlus className="h-4 w-4" /> Dodaj
          </button>
        </div>
        {ready && plans.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Brak podopiecznych. Dodaj pierwszą osobę, aby zacząć tworzyć jej plan.
          </div>
        ) : null}
        {own.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Moje plany
            </p>
            <div className="flex flex-wrap gap-1.5">{own.map(chip)}</div>
          </div>
        ) : null}
        {shared.length ? (
          <div>
            <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Udostępnione mi
            </p>
            <div className="flex flex-wrap gap-1.5">{shared.map(chip)}</div>
          </div>
        ) : null}
        {active ? (
          <ClientEditor
            key={active.id}
            row={active}
            onChange={(d) => patchPlan(active, d)}
            onRemove={() => void removeActive()}
            onShare={() => setShareOpen(true)}
          />
        ) : null}
        <ExerciseAtlas />
      </section>
      {shareOpen && active && active.access === "owner" ? (
        <ShareDialog
          row={active}
          onClose={() => setShareOpen(false)}
          onLinkAccess={(a) =>
            setPlans((l) => l.map((x) => (x.id === active.id ? { ...x, link_access: a } : x)))
          }
        />
      ) : null}
      <AppNav />
    </main>
  );
}

function ShareDialog({
  row,
  onClose,
  onLinkAccess,
}: {
  row: PlanRow;
  onClose: () => void;
  onLinkAccess: (a: LinkAccess) => void;
}) {
  const [ident, setIdent] = useState("");
  const [canEdit, setCanEdit] = useState(false);
  const [shares, setShares] = useState<ShareEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/plany?plan=${row.link_token}` : "";
  const reload = () => listShares(row.id).then(setShares).catch(() => {});
  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [row.id]);

  const changeLink = async (a: LinkAccess) => {
    try {
      await setLinkAccess(row.id, a);
      onLinkAccess(a);
    } catch {
      toast.error("Nie udało się zmienić ustawień linku");
    }
  };
  const copy = async () => {
    if (row.link_access === "none") await changeLink("view");
    await navigator.clipboard.writeText(url).catch(() => {});
    toast.success("Skopiowano link do planu");
  };
  const send = async () => {
    if (!ident.trim()) return;
    setBusy(true);
    try {
      const r = await sharePlan(row.id, ident, canEdit);
      if (r === "ok") {
        toast.success("Plan udostępniony");
        setIdent("");
        void reload();
      } else if (r === "self") toast.error("To Twoje konto");
      else toast.error("Nie znaleziono użytkownika o tej nazwie lub e-mailu");
    } catch {
      toast.error("Nie udało się udostępnić planu");
    }
    setBusy(false);
  };
  const toggle = async (s: ShareEntry) => {
    const name = s.username ?? s.display_name ?? "";
    if (!name) return;
    await sharePlan(row.id, name, !s.can_edit).catch(() =>
      toast.error("Nie udało się zmienić uprawnień"),
    );
    void reload();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md space-y-4 rounded-t-2xl border border-border bg-card p-5 sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-semibold text-foreground">
            <Share2 className="h-4 w-4 text-primary" /> Udostępnij plan „{row.data.name}”
          </h2>
          <button onClick={onClose} aria-label="Zamknij" className="text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Link do planu
          </p>
          <div className="grid grid-cols-3 gap-1.5 text-xs">
            {(["none", "view", "edit"] as const).map((a) => (
              <button
                key={a}
                onClick={() => void changeLink(a)}
                className={`rounded-lg py-1.5 ${
                  row.link_access === a
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {a === "none" ? "Wyłączony" : a === "view" ? "Podgląd" : "Edycja"}
              </button>
            ))}
          </div>
          <button
            onClick={() => void copy()}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2 text-sm font-medium text-primary"
          >
            <Copy className="h-4 w-4" /> Kopiuj link
          </button>
          <p className="text-[11px] text-muted-foreground">
            Osoba otwierająca link musi być zalogowana – plan trafi do jej biblioteki.
          </p>
        </div>
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Udostępnij osobie
          </p>
          <input
            value={ident}
            onChange={(e) => setIdent(e.target.value)}
            placeholder="nazwa użytkownika lub e-mail"
            className="w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="flex gap-2">
            <div className="grid flex-1 grid-cols-2 gap-1.5 text-xs">
              <button
                onClick={() => setCanEdit(false)}
                className={`rounded-lg py-1.5 ${
                  !canEdit ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                Tylko podgląd
              </button>
              <button
                onClick={() => setCanEdit(true)}
                className={`rounded-lg py-1.5 ${
                  canEdit ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
                }`}
              >
                Może edytować
              </button>
            </div>
            <button
              disabled={busy}
              onClick={() => void send()}
              className="rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Udostępnij
            </button>
          </div>
        </div>
        {shares.length ? (
          <ul className="space-y-1.5">
            {shares.map((s) => (
              <li
                key={s.user_id}
                className="flex items-center gap-2 rounded-lg bg-secondary/60 px-3 py-2 text-sm"
              >
                <span className="min-w-0 flex-1 truncate">
                  {s.display_name || s.username || "Użytkownik"}
                  {s.username ? <span className="text-muted-foreground"> @{s.username}</span> : null}
                </span>
                <button
                  onClick={() => void toggle(s)}
                  className="rounded-md bg-card px-2 py-0.5 text-[11px] text-primary"
                >
                  {s.can_edit ? "edycja" : "podgląd"}
                </button>
                <button
                  onClick={() => void removeShare(row.id, s.user_id).then(reload)}
                  aria-label="Cofnij dostęp"
                  className="text-muted-foreground hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

function SetChip({
  s,
  readOnly,
  onPatch,
  onRemove,
  label,
}: {
  s: PlanSet;
  readOnly: boolean;
  onPatch: (p: Partial<PlanSet>) => void;
  onRemove: () => void;
  label: string;
}) {
  const parsed = parseRepsOrTime(s.reps);
  return (
    <div
      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs ${
        s.warmup
          ? "border border-dashed border-muted-foreground/40 bg-transparent"
          : "bg-secondary"
      }`}
    >
      <button
        disabled={readOnly}
        onClick={() => onPatch({ warmup: !s.warmup })}
        title={
          s.warmup
            ? "Seria rozgrzewkowa – kliknij, by zmienić na roboczą"
            : "Oznacz jako rozgrzewkową"
        }
        className={`inline-flex items-center gap-0.5 font-semibold ${
          s.warmup ? "text-muted-foreground" : "text-primary"
        }`}
      >
        {s.warmup ? <Flame className="h-3 w-3" /> : null}
        {label}
      </button>
      <input
        readOnly={readOnly}
        value={s.reps}
        onChange={(e) => onPatch({ reps: e.target.value })}
        placeholder="—"
        aria-label="Powtórzenia / Czas"
        title="Powtórzenia lub czas (np. 12, 40s, 1:20)"
        className="w-12 bg-transparent text-center outline-none"
      />
      {parsed.timeSec ? <Timer className="h-3 w-3 text-primary" /> : null}
      <span className="text-muted-foreground">×</span>
      <input
        readOnly={readOnly}
        value={s.weight}
        onChange={(e) => onPatch({ weight: e.target.value })}
        placeholder="—"
        className="w-12 bg-transparent text-center outline-none"
      />
      <span className="text-muted-foreground">kg</span>
      {!readOnly ? (
        <button
          onClick={onRemove}
          aria-label="Usuń serię"
          className="text-muted-foreground hover:text-danger"
        >
          <X className="h-3 w-3" />
        </button>
      ) : null}
    </div>
  );
}

function ClientEditor({
  row,
  onChange,
  onRemove,
  onShare,
}: {
  row: PlanRow;
  onChange: (c: Client) => void;
  onRemove: () => void;
  onShare: () => void;
}) {
  const navigate = useNavigate();
  const client = row.data;
  const readOnly = row.access === "view";
  const setDays = (days: PlanDay[]) => onChange({ ...client, days });
  const patchDay = (d: PlanDay) => setDays(client.days.map((x) => (x.id === d.id ? d : x)));

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <input
            readOnly={readOnly}
            value={client.name}
            onChange={(e) => onChange({ ...client, name: e.target.value })}
            className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-foreground outline-none"
          />
          {row.access === "owner" ? (
            <button
              onClick={onShare}
              className="inline-flex items-center gap-1 rounded-lg bg-primary/15 px-2.5 py-1.5 text-xs font-medium text-primary"
            >
              <Share2 className="h-3.5 w-3.5" /> Udostępnij plan
            </button>
          ) : row.access === "local" ? (
            <button
              onClick={() => toast.info("Zaloguj się w Profilu, aby udostępniać plany")}
              className="inline-flex items-center gap-1 rounded-lg bg-secondary px-2.5 py-1.5 text-xs text-muted-foreground"
            >
              <Share2 className="h-3.5 w-3.5" /> Udostępnij plan
            </button>
          ) : (
            <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] text-muted-foreground">
              {readOnly ? "tylko podgląd" : "możesz edytować"}
            </span>
          )}
          <button
            onClick={onRemove}
            aria-label="Usuń plan"
            className="p-1.5 text-muted-foreground hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {!readOnly && client.days.some((d) => d.exercises.length > 0) ? (
          <div className="mt-3 space-y-2 border-t border-border pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Trening z podopiecznym
            </p>
            <div className="flex flex-wrap gap-2">
              {client.days
                .filter((d) => d.exercises.length > 0)
                .map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() =>
                      void navigate({
                        to: "/plany/trening",
                        search: { plan: row.id, day: d.id },
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                  >
                    Start: {d.name || d.weekday || "Dzień"}
                  </button>
                ))}
              <button
                type="button"
                onClick={() =>
                  void navigate({
                    to: "/plany/trening",
                    search: { plan: row.id },
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
              >
                Wolny trening
              </button>
            </div>
          </div>
        ) : null}

        {row.access === "owner" || row.access === "local" ? (
          <ClientIntake client={client} onChange={onChange} />
        ) : null}
      </div>

      {client.days.map((d) => {
        const dayTonnage = d.exercises.reduce(
          (sum, ex) => sum + ex.sets.reduce((a, s) => a + setTonnage(s), 0),
          0,
        );
        return (
          <article key={d.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <input
                readOnly={readOnly}
                value={d.name}
                onChange={(e) => patchDay({ ...d, name: e.target.value })}
                placeholder="Nazwa dnia (np. Pon – Push)"
                className="min-w-0 flex-1 bg-transparent font-semibold text-foreground outline-none"
              />
              <span className="text-[11px] tabular-nums text-muted-foreground">
                {Math.round(dayTonnage)} kg
              </span>
              {!readOnly ? (
                <button
                  onClick={() => setDays(client.days.filter((x) => x.id !== d.id))}
                  aria-label="Usuń dzień"
                  className="p-1.5 text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="mt-3 space-y-3">
              {d.exercises.map((ex, ei) => {
                const patchEx = (p: Partial<PlanExercise>) =>
                  patchDay({
                    ...d,
                    exercises: d.exercises.map((x) => (x.id === ex.id ? { ...x, ...p } : x)),
                  });
                const patchSet = (si: number, p: Partial<PlanSet>) =>
                  patchEx({ sets: ex.sets.map((x, i) => (i === si ? { ...x, ...p } : x)) });
                const indexed = ex.sets.map((s, i) => ({ s, i }));
                const warm = indexed.filter((x) => x.s.warmup);
                const work = indexed.filter((x) => !x.s.warmup);
                const tonnage = ex.sets.reduce((a, s) => a + setTonnage(s), 0);
                const renderSet = (
                  { s, i }: { s: PlanSet; i: number },
                  label: string,
                ) => (
                  <SetChip
                    key={i}
                    s={s}
                    label={label}
                    readOnly={readOnly}
                    onPatch={(p) => patchSet(i, p)}
                    onRemove={() => patchEx({ sets: ex.sets.filter((_, k) => k !== i) })}
                  />
                );
                return (
                  <div key={ex.id} className="rounded-xl border border-border p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-primary">{ei + 1}.</span>
                      <input
                        readOnly={readOnly}
                        list="plan-ex-names"
                        value={ex.name}
                        onChange={(e) => patchEx({ name: e.target.value })}
                        placeholder="Dodaj ćwiczenie…"
                        className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                      />
                      {!readOnly ? (
                        <button
                          onClick={() =>
                            patchDay({
                              ...d,
                              exercises: d.exercises.filter((x) => x.id !== ex.id),
                            })
                          }
                          aria-label="Usuń ćwiczenie"
                          className="text-muted-foreground hover:text-danger"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>

                    {warm.length ? (
                      <div className="mt-2">
                        <p className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          <Flame className="h-3 w-3" /> Rozgrzewka
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {warm.map((x, k) => renderSet(x, `R${k + 1}`))}
                        </div>
                      </div>
                    ) : null}

                    <div className={warm.length ? "mt-2 border-t border-border pt-2" : "mt-2"}>
                      {warm.length ? (
                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                          Serie robocze
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-2">
                        {work.map((x, k) => renderSet(x, `${k + 1}.`))}
                        {!readOnly ? (
                          <>
                            <button
                              onClick={() =>
                                patchEx({ sets: [...ex.sets, { reps: "", weight: "" }] })
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary hover:bg-secondary"
                            >
                              <Plus className="h-3 w-3" /> Seria
                            </button>
                            <button
                              onClick={() =>
                                patchEx({
                                  sets: [...ex.sets, { reps: "", weight: "", warmup: true }],
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-secondary"
                            >
                              <Flame className="h-3 w-3" /> Rozgrzewkowa
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2 py-1 text-xs">
                        <span className="text-[11px] text-muted-foreground">Zakres:</span>
                        <input
                          readOnly={readOnly}
                          value={ex.range || ""}
                          onChange={(e) => patchEx({ range: e.target.value })}
                          placeholder="8–12 / 40s"
                          className="w-20 bg-transparent text-right font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <div className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary/40 px-2 py-1 text-xs">
                        <Timer className="h-3 w-3 text-primary" />
                        <span className="text-[11px] text-muted-foreground">Przerwa:</span>
                        <input
                          readOnly={readOnly}
                          value={ex.rest || ""}
                          onChange={(e) => patchEx({ rest: e.target.value })}
                          placeholder="np. 90s / 2 min"
                          className="w-20 bg-transparent text-right font-medium text-foreground outline-none placeholder:text-muted-foreground/50"
                        />
                      </div>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        tonaż roboczy {Math.round(tonnage)} kg
                      </span>
                    </div>

                    <input
                      readOnly={readOnly}
                      value={ex.note || ""}
                      onChange={(e) => patchEx({ note: e.target.value })}
                      placeholder="uwagi dla podopiecznego…"
                      className="mt-1.5 w-full bg-transparent text-xs text-muted-foreground outline-none"
                    />

                    {ex.sets.some((s) => parseRepsOrTime(s.reps).timeSec) ? (
                      <p className="mt-1 text-[10px] text-primary">
                        Na czas:{" "}
                        {ex.sets
                          .map((s) => parseRepsOrTime(s.reps).timeSec)
                          .filter((t): t is number => !!t)
                          .map(formatTime)
                          .join(", ")}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              {!readOnly ? (
                <button
                  onClick={() =>
                    patchDay({
                      ...d,
                      exercises: [
                        ...d.exercises,
                        {
                          id: uid(),
                          name: "",
                          sets: [{ reps: "", weight: "" }],
                          note: "",
                          rest: "",
                          range: "",
                        },
                      ],
                    })
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
                >
                  <Plus className="h-3.5 w-3.5" /> Dodaj ćwiczenie
                </button>
              ) : null}
            </div>
          </article>
        );
      })}

      {!readOnly ? (
        <button
          onClick={() => setDays([...client.days, { id: uid(), name: "", exercises: [] }])}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-3 text-sm font-medium text-primary"
        >
          <Plus className="h-4 w-4" /> Dodaj dzień treningowy
        </button>
      ) : null}
    </div>
  );
}
