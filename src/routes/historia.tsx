import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { BarChart3, ChevronDown, Search } from "lucide-react";
import { AppNav } from "@/components/AppNav";
import { ExerciseChart } from "@/components/ExerciseChart";
import {
  allExerciseNames,
  best1RM,
  exerciseHistory,
  formatDatePL,
  loadSessions,
  workingSets,
  type Session,
  formatRepsOrTime,
} from "@/lib/workout-store";

const searchSchema = z.object({
  ex: fallback(z.string(), "").default(""),
  dni: fallback(z.number(), 0).default(0),
});

export const Route = createFileRoute("/historia")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Historia ćwiczeń — analiza progresu" },
      {
        name: "description",
        content:
          "Przeglądaj wszystkie treningi danego ćwiczenia, wykresy objętości, estymowanego 1RM i maksymalnego ciężaru.",
      },
      { property: "og:title", content: "Historia ćwiczeń — analiza progresu" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      {
        property: "og:description",
        content: "Filtruj historię ruchu, porównaj objętość, 1RM i rekordy w czasie.",
      },
    ],
  }),
  component: HistoryPage,
});

const RANGES = [
  { label: "Wszystko", value: 0 },
  { label: "30 dni", value: 30 },
  { label: "60 dni", value: 60 },
  { label: "90 dni", value: 90 },
];

function HistoryPage() {
  const { ex, dni } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [collapsedDays, setCollapsedDays] = useState<Set<string>>(() => new Set());
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pickerOpen]);

  const names = useMemo(() => allExerciseNames(sessions), [sessions]);
  const selected = ex || names[0] || "";

  const filteredNames = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return names;
    return names.filter((n) => n.toLowerCase().includes(q));
  }, [names, query]);

  const history = useMemo(() => exerciseHistory(sessions, selected), [sessions, selected]);
  const filtered = useMemo(() => {
    if (!dni) return history;
    const limit = Date.now() - dni * 86400000;
    return history.filter((h) => new Date(h.date + "T00:00:00").getTime() >= limit);
  }, [history, dni]);

  const bestVol = Math.max(0, ...filtered.map((h) => h.volume));
  const best1 = Math.max(0, ...filtered.map((h) => h.e1rm));
  const bestW = Math.max(0, ...filtered.map((h) => h.top));

  const pickExercise = (name: string) => {
    navigate({ to: ".", search: (prev) => ({ ...prev, ex: name }) });
    setQuery("");
    setPickerOpen(false);
    setCollapsedDays(new Set());
  };

  const toggleDay = (date: string) => {
    setCollapsedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border px-4 pb-5 pt-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Historia</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Historia ćwiczenia</h1>

          <div ref={pickerRef} className="relative mt-3">
            <button
              type="button"
              onClick={() => {
                setPickerOpen((o) => !o);
                setQuery("");
              }}
              className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 text-left text-sm text-foreground"
            >
              <span className="truncate">{selected || "Wybierz ćwiczenie"}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                  pickerOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {pickerOpen ? (
              <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
                <div className="flex items-center gap-2 border-b border-border px-3 py-2">
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <input
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Szukaj ćwiczenia…"
                    className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  />
                </div>
                <ul className="max-h-64 overflow-y-auto py-1">
                  {filteredNames.length === 0 ? (
                    <li className="px-3 py-3 text-center text-xs text-muted-foreground">
                      Brak wyników
                    </li>
                  ) : (
                    filteredNames.map((n) => (
                      <li key={n}>
                        <button
                          type="button"
                          onClick={() => pickExercise(n)}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-secondary ${
                            n === selected
                              ? "bg-primary/15 font-medium text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {n}
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() =>
                  navigate({ to: ".", search: (prev) => ({ ...prev, dni: r.value }) })
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  dni === r.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <ExerciseChart history={filtered} limit={12} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
            <Box label="Best objętość" value={`${Math.round(bestVol)} kg`} />
            <Box label="Best ciężar" value={`${bestW} kg`} />
            <Box label="Best 1RM" value={`${best1.toFixed(1)} kg`} />
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-4 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setCollapsedDays(new Set(filtered.map((h) => h.date)))}
              className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-foreground"
            >
              Zwiń wszystkie
            </button>
            <button
              type="button"
              onClick={() => setCollapsedDays(new Set())}
              className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground hover:border-primary hover:text-foreground"
            >
              Rozwiń wszystkie
            </button>
          </div>
        ) : null}

        <ul className="mt-2 space-y-3">
          {[...filtered].reverse().map((h) => {
            const isCollapsed = collapsedDays.has(h.date);
            return (
              <li key={h.date} className="rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  onClick={() => toggleDay(h.date)}
                  className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground">{formatDatePL(h.date)}</p>
                    {isCollapsed ? (
                      <p className="mt-0.5 text-[11px] tabular-nums text-muted-foreground">
                        {workingSets(h.sets).length} serii · {Math.round(h.volume)} kg · max {h.top}{" "}
                        kg
                      </p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <p className="text-[11px] tabular-nums text-muted-foreground">
                      1RM {best1RM(h.sets).toFixed(1)} kg
                    </p>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform ${
                        isCollapsed ? "" : "rotate-180"
                      }`}
                    />
                  </div>
                </button>

                {!isCollapsed ? (
                  <div className="border-t border-border px-4 pb-4 pt-2">
                    <ul className="space-y-0.5">
                      {h.sets.map((s, i) => (
                        <li key={i} className="text-xs tabular-nums text-muted-foreground">
                          {s.warmup ? "W-up" : `${i + 1}-`} {formatRepsOrTime(s)}×{s.weight} kg
                          {s.note ? ` · ${s.note}` : ""}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 text-[11px] tabular-nums text-muted-foreground">
                      {workingSets(h.sets).length} serii roboczych · {Math.round(h.volume)} kg
                      objętości · max {h.top} kg
                    </p>
                  </div>
                ) : null}
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <li className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Brak zapisów w wybranym zakresie.
            </li>
          ) : null}
        </ul>
      </section>
      <AppNav />
    </main>
  );
}

function Box({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-secondary px-2 py-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-bold tabular-nums text-foreground">{value}</p>
    </div>
  );
}
