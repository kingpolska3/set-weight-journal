import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { BarChart3 } from "lucide-react";
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
        content: "Filtruj historię ruchu, porównuj objętość, 1RM i rekordy w czasie.",
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

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  const names = useMemo(() => allExerciseNames(sessions), [sessions]);
  const selected = ex || names[0] || "";
  const history = useMemo(() => exerciseHistory(sessions, selected), [sessions, selected]);
  const filtered = useMemo(() => {
    if (!dni) return history;
    const limit = Date.now() - dni * 86400000;
    return history.filter((h) => new Date(h.date + "T00:00:00").getTime() >= limit);
  }, [history, dni]);

  const bestVol = Math.max(0, ...filtered.map((h) => h.volume));
  const best1 = Math.max(0, ...filtered.map((h) => h.e1rm));
  const bestW = Math.max(0, ...filtered.map((h) => h.top));

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border px-4 pb-5 pt-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Historia</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Historia ćwiczenia</h1>

          <select
            value={selected}
            onChange={(e) =>
              navigate({ to: ".", search: (prev) => ({ ...prev, ex: e.target.value }) })
            }
            className="mt-4 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none"
          >
            {names.length === 0 ? <option value="">Brak zapisanych ćwiczeń</option> : null}
            {names.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() =>
                  navigate({ to: ".", search: (prev) => ({ ...prev, dni: r.value }) })
                }
                className={`rounded-full px-3 py-1 text-xs font-medium ${
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

        <ul className="mt-4 space-y-3">
          {[...filtered].reverse().map((h) => (
            <li key={h.date} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-baseline justify-between">
                <p className="text-sm font-semibold text-foreground">{formatDatePL(h.date)}</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  1RM {best1RM(h.sets).toFixed(1)} kg
                </p>
              </div>
              <ul className="mt-2 space-y-0.5">
                {h.sets.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground tabular-nums">
                    {s.warmup ? "W-up" : `${i + 1}-`} {formatRepsOrTime(s)}×{s.weight} kg
                    {s.note ? ` · ${s.note}` : ""}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[11px] text-muted-foreground tabular-nums">
                {workingSets(h.sets).length} serii roboczych · {Math.round(h.volume)} kg objętości
                · max {h.top} kg
              </p>
            </li>
          ))}
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
      <p className="text-sm font-bold text-foreground tabular-nums">{value}</p>
    </div>
  );
}
