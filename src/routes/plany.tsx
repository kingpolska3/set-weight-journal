import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardList, Plus, Trash2, UserPlus, X } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { ATLAS_NAMES } from "@/lib/exercise-atlas";
import { uid } from "@/lib/workout-store";

type PlanSet = { reps: string; weight: string };
type PlanExercise = { id: string; name: string; sets: PlanSet[]; note: string };
type PlanDay = { id: string; name: string; exercises: PlanExercise[] };
type Client = { id: string; name: string; goal: string; days: PlanDay[] };

const KEY = "trainer-plans-v1";

export const Route = createFileRoute("/plany")({
  head: () => ({
    meta: [
      { title: "Tworzenie planów treningowych dla podopiecznych" },
      { name: "description", content: "Pusty dziennik trenera: twórz plany treningowe dla swoich podopiecznych." },
      { property: "og:title", content: "Tworzenie planów treningowych dla podopiecznych" },
      { property: "og:description", content: "Dziennik trenera do układania planów treningowych dla podopiecznych." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlansPage,
});

function PlansPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setClients(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) localStorage.setItem(KEY, JSON.stringify(clients));
  }, [clients, loaded]);

  const active = clients.find((c) => c.id === activeId) ?? null;
  const patchClient = (c: Client) => setClients((l) => l.map((x) => (x.id === c.id ? c : x)));

  const addClient = () => {
    const name = newName.trim();
    if (!name) return;
    const c: Client = { id: uid(), name, goal: "", days: [] };
    setClients((l) => [...l, c]);
    setActiveId(c.id);
    setNewName("");
  };

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
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addClient()}
            placeholder="Imię podopiecznego…"
            maxLength={60}
            className="min-w-0 flex-1 rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <button onClick={addClient} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
            <UserPlus className="h-4 w-4" /> Dodaj
          </button>
        </div>

        {clients.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Brak podopiecznych. Dodaj pierwszą osobę, aby zacząć tworzyć jej plan.
          </div>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {clients.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`rounded-full px-3 py-1 text-sm ${c.id === activeId ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {active ? <ClientEditor client={active} onChange={patchClient} onRemove={() => {
          if (!confirm(`Usunąć podopiecznego ${active.name} i jego plan?`)) return;
          setClients((l) => l.filter((x) => x.id !== active.id));
          setActiveId(null);
        }} /> : null}
      </section>
      <AppNav />
    </main>
  );
}

function ClientEditor({ client, onChange, onRemove }: { client: Client; onChange: (c: Client) => void; onRemove: () => void }) {
  const setDays = (days: PlanDay[]) => onChange({ ...client, days });
  const patchDay = (d: PlanDay) => setDays(client.days.map((x) => (x.id === d.id ? d : x)));

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <input
            value={client.name}
            onChange={(e) => onChange({ ...client, name: e.target.value })}
            className="min-w-0 flex-1 bg-transparent text-lg font-semibold text-foreground outline-none"
          />
          <button onClick={onRemove} aria-label="Usuń podopiecznego" className="p-1.5 text-muted-foreground hover:text-danger">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <input
          value={client.goal}
          onChange={(e) => onChange({ ...client, goal: e.target.value })}
          placeholder="Cel (np. redukcja, siła, masa)…"
          className="mt-2 w-full rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      {client.days.map((d) => (
        <article key={d.id} className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <input
              value={d.name}
              onChange={(e) => patchDay({ ...d, name: e.target.value })}
              placeholder="Nazwa dnia (np. Pon – Push)"
              className="min-w-0 flex-1 bg-transparent font-semibold text-foreground outline-none"
            />
            <button onClick={() => setDays(client.days.filter((x) => x.id !== d.id))} aria-label="Usuń dzień" className="p-1.5 text-muted-foreground hover:text-danger">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {d.exercises.map((ex, ei) => {
              const patchEx = (p: Partial<PlanExercise>) =>
                patchDay({ ...d, exercises: d.exercises.map((x) => (x.id === ex.id ? { ...x, ...p } : x)) });
              return (
                <div key={ex.id} className="rounded-xl border border-border p-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{ei + 1}.</span>
                    <input
                      list="plan-ex-names"
                      value={ex.name}
                      onChange={(e) => patchEx({ name: e.target.value })}
                      placeholder="Dodaj ćwiczenie…"
                      className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none"
                    />
                    <button onClick={() => patchDay({ ...d, exercises: d.exercises.filter((x) => x.id !== ex.id) })} aria-label="Usuń ćwiczenie" className="text-muted-foreground hover:text-danger">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {ex.sets.map((s, si) => (
                      <div key={si} className="flex items-center gap-1 rounded-lg bg-secondary px-2 py-1 text-xs">
                        <span className="text-muted-foreground">{si + 1}.</span>
                        <input value={s.reps} onChange={(e) => patchEx({ sets: ex.sets.map((x, i) => (i === si ? { ...x, reps: e.target.value } : x)) })} placeholder="—" className="w-10 bg-transparent text-center outline-none" />
                        <span className="text-muted-foreground">×</span>
                        <input value={s.weight} onChange={(e) => patchEx({ sets: ex.sets.map((x, i) => (i === si ? { ...x, weight: e.target.value } : x)) })} placeholder="—" className="w-12 bg-transparent text-center outline-none" />
                        <span className="text-muted-foreground">kg</span>
                        <button onClick={() => patchEx({ sets: ex.sets.filter((_, i) => i !== si) })} aria-label="Usuń serię" className="text-muted-foreground hover:text-danger">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => patchEx({ sets: [...ex.sets, { reps: "", weight: "" }] })} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-primary hover:bg-secondary">
                      <Plus className="h-3 w-3" /> Seria
                    </button>
                  </div>
                  <input value={ex.note} onChange={(e) => patchEx({ note: e.target.value })} placeholder="uwagi dla podopiecznego…" className="mt-2 w-full bg-transparent text-xs text-muted-foreground outline-none" />
                </div>
              );
            })}
            <button
              onClick={() => patchDay({ ...d, exercises: [...d.exercises, { id: uid(), name: "", sets: [{ reps: "", weight: "" }], note: "" }] })}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary"
            >
              <Plus className="h-3.5 w-3.5" /> Dodaj ćwiczenie
            </button>
          </div>
        </article>
      ))}

      <button
        onClick={() => setDays([...client.days, { id: uid(), name: "", exercises: [] }])}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 py-3 text-sm font-medium text-primary"
      >
        <Plus className="h-4 w-4" /> Dodaj dzień treningowy
      </button>
    </div>
  );
}
