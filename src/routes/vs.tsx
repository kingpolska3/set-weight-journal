import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, Swords } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/vs")({
  head: () => ({
    meta: [
      { title: "VS — porównaj swoje treningi z innymi" },
      {
        name: "description",
        content:
          "Wyszukaj innych użytkowników po nazwie i porównaj objętość, liczbę treningów oraz serie z ostatnich 30 dni.",
      },
      { property: "og:title", content: "VS — pojedynek treningowy" },
      {
        property: "og:description",
        content: "Porównaj swoje wyniki z innymi zalogowanymi użytkownikami dziennika treningowego.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VsPage,
});

type Profile = { id: string; display_name: string; username: string | null; avatar_url: string | null };
type Stats = {
  user_id: string;
  display_name: string;
  sessions: number;
  total_volume: number;
  total_sets: number;
  last_date: string | null;
};

type RivalDay = {
  date: string;
  exercises: { name: string; sets: { reps: number; weight: number; warmup?: boolean }[] }[];
  note?: string;
};

const DAYS = 30;

function StatRow({ label, mine, theirs }: { label: string; mine: number; theirs: number }) {
  const total = mine + theirs;
  const minePct = total > 0 ? (mine / total) * 100 : 50;
  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">{Math.round(mine).toLocaleString("pl-PL")}</span>
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">{Math.round(theirs).toLocaleString("pl-PL")}</span>
      </div>
      <div className="mt-1 flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-primary" style={{ width: `${minePct}%` }} />
        <div className="bg-accent-foreground/40" style={{ width: `${100 - minePct}%` }} />
      </div>
    </div>
  );
}

function VsPage() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [mine, setMine] = useState<Stats | null>(null);
  const [rival, setRival] = useState<Stats | null>(null);
  const [searching, setSearching] = useState(false);
  const [rivalPlan, setRivalPlan] = useState<RivalDay[] | null>(null);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase.rpc("public_stats", { target: user.id, days: DAYS });
      setMine((data as Stats[] | null)?.[0] ?? null);
    })();
  }, [user]);

  const search = async () => {
    if (!query.trim()) return;
    setSearching(true);
    const { data, error } = await supabase.rpc("search_profiles", { q: query.trim() });
    setSearching(false);
    if (error) {
      toast.error("Wyszukiwanie nie powiodło się");
      return;
    }
    const list = ((data as Profile[] | null) ?? []).filter((p) => p.id !== user?.id);
    setResults(list);
    if (list.length === 0) toast.info("Brak użytkowników o tej nazwie");
  };

  const pick = async (p: Profile) => {
    const { data, error } = await supabase.rpc("public_stats", { target: p.id, days: DAYS });
    if (error) {
      toast.error("Nie udało się pobrać statystyk");
      return;
    }
    setRival((data as Stats[] | null)?.[0] ?? null);

    // Pełny plan zobaczymy tylko wtedy, gdy właściciel wyraził na to zgodę w profilu.
    const { data: days } = await supabase
      .from("workout_days")
      .select("date, data")
      .eq("user_id", p.id)
      .order("date", { ascending: false })
      .limit(10);
    const plan = (days ?? [])
      .map((row) => {
        const payload = row.data as unknown as RivalDay;
        return { date: row.date, exercises: payload?.exercises ?? [], note: payload?.note };
      })
      .filter((d) => d.exercises.length > 0);
    setRivalPlan(plan.length > 0 ? plan : null);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-5 flex items-center gap-2">
          <Swords className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">VS</h1>
        </header>

        {loading ? (
          <p className="text-sm text-muted-foreground">Ładowanie…</p>
        ) : !user ? (
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            Zaloguj się w zakładce <span className="font-semibold text-foreground">Profil</span>, aby porównywać
            swoje treningi z innymi.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-4">
              <label htmlFor="vs-search" className="text-xs text-muted-foreground">
                Znajdź osobę po nazwie konta
              </label>
              <div className="mt-2 flex gap-2">
                <input
                  id="vs-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && void search()}
                  placeholder="np. Jan Kowalski"
                  className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
                <button
                  onClick={() => void search()}
                  disabled={searching}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  <Search className="h-4 w-4" /> Szukaj
                </button>
              </div>
              {results.length > 0 && (
                <ul className="mt-3 divide-y divide-border">
                  {results.map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => void pick(p)}
                        className="flex w-full items-center justify-between py-2 text-left text-sm text-foreground"
                      >
                        <span>
                          {p.display_name || "Bez nazwy"}
                          {p.username ? (
                            <span className="ml-1 text-xs text-muted-foreground">@{p.username}</span>
                          ) : null}
                        </span>
                        <span className="text-xs font-medium text-primary">Porównaj</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {rival && (
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                  <span>Ty</span>
                  <span className="text-xs text-muted-foreground">ostatnie {DAYS} dni</span>
                  <span>{rival.display_name || "Rywal"}</span>
                </div>
                <div className="mt-3">
                  <StatRow label="objętość (kg)" mine={mine?.total_volume ?? 0} theirs={rival.total_volume} />
                  <StatRow label="treningi" mine={mine?.sessions ?? 0} theirs={rival.sessions} />
                  <StatRow label="serie robocze" mine={mine?.total_sets ?? 0} theirs={rival.total_sets} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Ostatni trening rywala: {rival.last_date ?? "brak danych"}
                </p>
              </div>
            )}

            {rival && (
              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold text-foreground">Plan treningowy rywala</h3>
                {rivalPlan ? (
                  <div className="mt-2 space-y-3">
                    {rivalPlan.map((day) => (
                      <div key={day.date}>
                        <p className="text-xs font-semibold text-primary">{day.date}</p>
                        <ul className="mt-1 space-y-0.5">
                          {day.exercises.map((ex, i) => (
                            <li key={i} className="text-xs text-muted-foreground">
                              {i + 1}. {ex.name} —{" "}
                              {ex.sets
                                .filter((set) => !set.warmup)
                                .map((set) => `${set.reps}×${set.weight}kg`)
                                .join(", ")}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ta osoba nie udostępnia pełnego planu — widoczne są tylko statystyki powyżej.
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Domyślnie widoczne są tylko zbiorcze statystyki. Pełny plan treningowy pokazuje się wyłącznie
              wtedy, gdy dana osoba wyraziła na to zgodę w swoim profilu — Twoją zgodę ustawisz w zakładce Profil.
            </p>
          </div>
        )}
      </div>
      <AppNav />
    </div>
  );
}
