import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, EyeOff, Search, Star, Swords, Trophy } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  loadSessions,
  normalizeName,
  sessionVolume,
  shortDatePL,
  topWeight,
  workingSets,
  type Session,
  formatRepsOrTime,
} from "@/lib/workout-store";

export const Route = createFileRoute("/vs")({
  head: () => ({
    meta: [
      { title: "VS — porównaj swoje treningi z innymi" },
      {
        name: "description",
        content:
          "Wyszukaj innych użytkowników i porównaj objętość, liczbę treningów, serie, rekordy oraz wspólne ćwiczenia w wybranym zakresie dni.",
      },
      { property: "og:title", content: "VS — pojedynek treningowy" },
      {
        property: "og:description",
        content: "Porównaj objętość, treningi, serie i wspólne ćwiczenia z innymi użytkownikami dziennika.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: VsPage,
});

type Profile = { id: string; display_name: string; username: string | null; avatar_url: string | null };

type RangeKey = "30" | "90" | "all" | "custom";

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "30", label: "30 dni" },
  { key: "90", label: "90 dni" },
  { key: "all", label: "Cały czas" },
  { key: "custom", label: "Własny" },
];

const FAV_KEY = "trening-vs-ulubieni-v1";

type Agg = {
  volume: number;
  sessions: number;
  sets: number;
  avgVolume: number;
  prs: number;
  lastDate: string | null;
  byDate: { date: string; volume: number }[];
  exercises: Map<string, { name: string; volume: number; top: number }>;
};

function emptyAgg(): Agg {
  return {
    volume: 0,
    sessions: 0,
    sets: 0,
    avgVolume: 0,
    prs: 0,
    lastDate: null,
    byDate: [],
    exercises: new Map(),
  };
}

function aggregate(sessions: Session[], from: string | null, to: string | null): Agg {
  const inRange = sessions
    .filter((s) => (!from || s.date >= from) && (!to || s.date <= to))
    .filter((s) => !s.rest)
    .sort((a, b) => a.date.localeCompare(b.date));
  const agg = emptyAgg();
  const bestSoFar = new Map<string, number>();
  // Rekordy liczymy chronologicznie: nowy max ciężaru w danym ćwiczeniu = PR.
  for (const s of inRange) {
    const vol = sessionVolume(s);
    if (vol <= 0 && s.exercises.length === 0) continue;
    agg.sessions += 1;
    agg.volume += vol;
    agg.byDate.push({ date: s.date, volume: Math.round(vol) });
    agg.lastDate = s.date;
    for (const ex of s.exercises) {
      const working = workingSets(ex.sets);
      agg.sets += working.length;
      const key = normalizeName(ex.name);
      if (!key) continue;
      const top = topWeight(ex.sets);
      const prev = agg.exercises.get(key);
      agg.exercises.set(key, {
        name: ex.name,
        volume: (prev?.volume ?? 0) + vol * 0,
        top: Math.max(prev?.top ?? 0, top),
      });
      const record = bestSoFar.get(key) ?? 0;
      if (top > record) {
        bestSoFar.set(key, top);
        if (record > 0) agg.prs += 1;
      }
    }
  }
  agg.avgVolume = agg.sessions > 0 ? agg.volume / agg.sessions : 0;
  return agg;
}

function isoDaysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function loadFavs(): Profile[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAV_KEY);
    return raw ? (JSON.parse(raw) as Profile[]) : [];
  } catch {
    return [];
  }
}

function StatRow({ label, mine, theirs, unit }: { label: string; mine: number; theirs: number; unit?: string }) {
  const total = mine + theirs;
  const minePct = total > 0 ? (mine / total) * 100 : 50;
  const diff = mine - theirs;
  const fmt = (n: number) => `${Math.round(n).toLocaleString("pl-PL")}${unit ? ` ${unit}` : ""}`;
  const winner = mine > theirs ? "ty" : theirs > mine ? "rywal" : "remis";

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">{label}</p>
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
            winner === "ty"
              ? "bg-primary/15 text-primary"
              : winner === "rywal"
                ? "bg-foreground/10 text-foreground"
                : "bg-muted text-muted-foreground"
          }`}
        >
          {winner === "ty" ? "Ty prowadzisz" : winner === "rywal" ? "Rywal prowadzi" : "Remis"}
        </span>
      </div>

      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <p className="text-[10px] text-muted-foreground">Ty</p>
          <p className={`text-lg font-bold tabular-nums ${mine >= theirs ? "text-primary" : "text-foreground"}`}>
            {fmt(mine)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-muted-foreground">Rywal</p>
          <p className={`text-lg font-bold tabular-nums ${theirs > mine ? "text-primary" : "text-foreground"}`}>
            {fmt(theirs)}
          </p>
        </div>
      </div>

      <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted">
        <div className="bg-primary transition-all" style={{ width: `${minePct}%` }} />
        <div className="bg-foreground/25" style={{ width: `${100 - minePct}%` }} />
      </div>

      <p className="mt-1.5 text-[11px] text-muted-foreground">
        Różnica:{" "}
        <span className={diff >= 0 ? "text-primary" : "text-foreground"}>
          {diff >= 0 ? "+" : ""}
          {fmt(diff)}
        </span>
      </p>
    </div>
  );
}

function VsPage() {
  const { user, loading } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);
  const [favs, setFavs] = useState<Profile[]>([]);
  const [rival, setRival] = useState<Profile | null>(null);
  const [rivalSessions, setRivalSessions] = useState<Session[] | null>(null);
  const [rivalShares, setRivalShares] = useState(false);
  const [showPlan, setShowPlan] = useState(false);
  const [mySessions, setMySessions] = useState<Session[]>([]);
  const [range, setRange] = useState<RangeKey>("30");
  const [customFrom, setCustomFrom] = useState(isoDaysAgo(180));
  const [customTo, setCustomTo] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    setMySessions(loadSessions());
    setFavs(loadFavs());
  }, []);

  const bounds = useMemo<{ from: string | null; to: string | null }>(() => {
    if (range === "all") return { from: null, to: null };
    if (range === "custom") return { from: customFrom, to: customTo };
    return { from: isoDaysAgo(Number(range)), to: null };
  }, [range, customFrom, customTo]);

  const mine = useMemo(() => aggregate(mySessions, bounds.from, bounds.to), [mySessions, bounds]);
  const theirs = useMemo(
    () => (rivalSessions ? aggregate(rivalSessions, bounds.from, bounds.to) : null),
    [rivalSessions, bounds],
  );

  const toggleFav = (p: Profile) => {
    const next = favs.some((f) => f.id === p.id) ? favs.filter((f) => f.id !== p.id) : [p, ...favs].slice(0, 8);
    setFavs(next);
    try {
      window.localStorage.setItem(FAV_KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  };

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

  const pick = useCallback(async (p: Profile) => {
    setRival(p);
    setShowPlan(false);
    setRivalSessions(null);
    const { data: days, error } = await supabase
      .from("workout_days")
      .select("date, data")
      .eq("user_id", p.id)
      .order("date", { ascending: false })
      .limit(400);
    if (error) {
      toast.error("Nie udało się pobrać danych rywala");
      return;
    }
    const rows = days ?? [];
    setRivalShares(rows.length > 0);
    setRivalSessions(
      rows.map((row) => {
        const payload = row.data as unknown as Partial<Session>;
        return { ...payload, date: row.date, exercises: payload.exercises ?? [] } as Session;
      }),
    );
  }, []);

  const chartData = useMemo(() => {
    if (!theirs) return [];
    const map = new Map<string, { date: string; ja: number | null; rywal: number | null }>();
    for (const d of mine.byDate.slice(-14)) map.set(d.date, { date: d.date, ja: d.volume, rywal: null });
    for (const d of theirs.byDate.slice(-14)) {
      const row = map.get(d.date);
      if (row) row.rywal = d.volume;
      else map.set(d.date, { date: d.date, ja: null, rywal: d.volume });
    }
    return [...map.values()]
      .sort((a, b) => a.date.localeCompare(b.date))
      .map((r) => ({ ...r, label: shortDatePL(r.date) }));
  }, [mine, theirs]);

  const commonExercises = useMemo(() => {
    if (!theirs) return [];
    const out: { name: string; mine: number; theirs: number }[] = [];
    for (const [key, val] of mine.exercises) {
      const other = theirs.exercises.get(key);
      if (other) out.push({ name: val.name, mine: val.top, theirs: other.top });
    }
    return out.sort((a, b) => Math.max(b.mine, b.theirs) - Math.max(a.mine, a.theirs)).slice(0, 12);
  }, [mine, theirs]);

  const rivalPlan = useMemo(
    () =>
      (rivalSessions ?? [])
        .filter((s) => s.exercises.length > 0)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 10),
    [rivalSessions],
  );

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
                Znajdź osobę po nazwie konta lub nazwie użytkownika
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

              {favs.length > 0 && (
                <div className="mt-3">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Ulubione osoby</p>
                  <div className="mt-1.5 flex flex-wrap gap-2">
                    {favs.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => void pick(p)}
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          rival?.id === p.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border text-foreground hover:border-primary"
                        }`}
                      >
                        {p.display_name || p.username || "Bez nazwy"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <ul className="mt-3 divide-y divide-border">
                  {results.map((p) => (
                    <li key={p.id} className="flex items-center gap-2 py-2">
                      <button
                        onClick={() => toggleFav(p)}
                        aria-label="Dodaj do ulubionych"
                        className={favs.some((f) => f.id === p.id) ? "text-primary" : "text-muted-foreground"}
                      >
                        <Star className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => void pick(p)}
                        className="flex flex-1 items-center justify-between text-left text-sm text-foreground"
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

            <div className="flex flex-wrap items-center gap-2">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  onClick={() => setRange(r.key)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                    range === r.key
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary"
                  }`}
                >
                  {r.label}
                </button>
              ))}
              {range === "custom" && (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customFrom}
                    onChange={(e) => setCustomFrom(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                  />
                  <span className="text-xs text-muted-foreground">–</span>
                  <input
                    type="date"
                    value={customTo}
                    onChange={(e) => setCustomTo(e.target.value)}
                    className="rounded-lg border border-input bg-background px-2 py-1.5 text-xs text-foreground"
                  />
                </div>
              )}
            </div>

            {!rival ? (
              <p className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
                Wybierz osobę z wyników wyszukiwania, żeby zobaczyć porównanie.
              </p>
            ) : !theirs ? (
              <p className="text-sm text-muted-foreground">Wczytywanie danych rywala…</p>
            ) : (
              <>
                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                    <div className="rounded-xl border border-border bg-card p-4">
  <div className="flex items-center justify-between gap-3">
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
        TY
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">Ty</p>
    </div>

    <div className="flex flex-col items-center gap-1">
      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">
        VS
      </span>
      <span className="text-[10px] text-muted-foreground">
        {range === "all"
          ? "cały czas"
          : range === "custom"
            ? `${customFrom} – ${customTo}`
            : `ostatnie ${range} dni`}
      </span>
    </div>

    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground/10 text-sm font-bold text-foreground">
        {(rival.display_name || rival.username || "R").slice(0, 2).toUpperCase()}
      </div>
      <p className="mt-2 truncate text-sm font-semibold text-foreground">
        {rival.display_name || rival.username || "Rywal"}
      </p>
    </div>
  </div>

  <div className="mt-4 grid gap-2">
    <StatRow label="Objętość" mine={mine.volume} theirs={theirs.volume} unit="kg" />
    <StatRow label="Treningi" mine={mine.sessions} theirs={theirs.sessions} />
    <StatRow label="Serie" mine={mine.sets} theirs={theirs.sets} />
    <StatRow label="Śr. objętość / trening" mine={mine.avgVolume} theirs={theirs.avgVolume} unit="kg" />
    <StatRow label="Rekordy (PR)" mine={mine.prs} theirs={theirs.prs} />
  </div>
</div>
                  </div>
                  <div className="mt-3">
                    <StatRow label="objętość" mine={mine.volume} theirs={theirs.volume} unit="kg" />
                    <StatRow label="treningi" mine={mine.sessions} theirs={theirs.sessions} />
                    <StatRow label="śr. objętość / trening" mine={mine.avgVolume} theirs={theirs.avgVolume} unit="kg" />
                    <StatRow label="serie robocze" mine={mine.sets} theirs={theirs.sets} />
                    <StatRow label="rekordy (PR)" mine={mine.prs} theirs={theirs.prs} />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Ostatni trening rywala: {theirs.lastDate ?? "brak danych"}
                  </p>
                </div>

                {chartData.length >= 2 && (
                  <div className="rounded-xl border border-border bg-card p-4">
                    <h3 className="text-sm font-semibold text-foreground">Objętość — Ty vs rywal</h3>
                    <ClientOnly fallback={<div className="mt-2 h-52" />}>
                      <div className="mt-2 h-52">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                            <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                            <Tooltip
                              contentStyle={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: 12,
                                fontSize: 12,
                              }}
                            />
                            <Legend wrapperStyle={{ fontSize: 11 }} />
                            <Line type="monotone" dataKey="ja" name="Ty" stroke="var(--primary)" strokeWidth={2} connectNulls dot={false} />
                            <Line
                              type="monotone"
                              dataKey="rywal"
                              name={rival.display_name || "Rywal"}
                              stroke="var(--muted-foreground)"
                              strokeWidth={2}
                              connectNulls
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </ClientOnly>
                  </div>
                )}

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Wspólne ćwiczenia (max ciężar)</h3>
                  </div>
                  {commonExercises.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Brak wspólnych ćwiczeń w tym zakresie — albo rywal nie udostępnia szczegółów treningów.
                    </p>
                  ) : (
                    <div className="mt-2 space-y-1">
                      {commonExercises.map((ex) => (
                        <StatRow key={ex.name} label={ex.name} mine={ex.mine} theirs={ex.theirs} unit="kg" />
                      ))}
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-foreground">Plan treningowy rywala</h3>
                    {rivalShares && rivalPlan.length > 0 ? (
                      <button
                        onClick={() => setShowPlan((v) => !v)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-foreground hover:border-primary"
                      >
                        {showPlan ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {showPlan ? "Ukryj plan" : "Pokaż pełny plan"}
                      </button>
                    ) : null}
                  </div>
                  {!rivalShares || rivalPlan.length === 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ta osoba nie udostępnia pełnego planu — widoczne są tylko statystyki powyżej.
                    </p>
                  ) : showPlan ? (
                    <div className="mt-2 space-y-3">
                      {rivalPlan.map((day) => (
                        <div key={day.date}>
                          <p className="text-xs font-semibold text-primary">{day.date}</p>
                          <ul className="mt-1 space-y-0.5">
                            {day.exercises.map((ex, i) => (
                              <li key={i} className="text-xs text-muted-foreground">
                                {i + 1}. {ex.name} —{" "}
                                {workingSets(ex.sets)
                                  .map((set) => `${formatRepsOrTime(set)}×${set.weight}kg`)
                                  .join(", ")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Ta osoba zgodziła się na pokazywanie pełnego planu — kliknij „Pokaż pełny plan”.
                    </p>
                  )}
                </div>
              </>
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
