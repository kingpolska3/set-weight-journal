import { useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shortDatePL, type ExerciseStat } from "@/lib/workout-store";

type Metric = "volume" | "e1rm" | "top";

const LABELS: Record<Metric, string> = {
  volume: "Objętość / tonaż",
  e1rm: "Estym. 1RM",
  top: "Max ciężar",
};

export function ExerciseChart({
  history,
  limit = 8,
}: {
  history: ExerciseStat[];
  limit?: number;
}) {
  const [metric, setMetric] = useState<Metric>("volume");
  const data = history.slice(-limit).map((h) => ({
    date: shortDatePL(h.date),
    volume: Math.round(h.volume),
    e1rm: Math.round(h.e1rm * 10) / 10,
    top: h.top,
  }));

  if (data.length < 2) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-border text-center">
        <p className="text-xs font-medium text-muted-foreground">
          Tutaj pojawią się Twoje postępy
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground/70">
          Zapisz to ćwiczenie co najmniej dwa razy.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex flex-wrap gap-1.5">
        {(Object.keys(LABELS) as Metric[]).map((m) => (
          <button
            key={m}
            onClick={() => setMetric(m)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors ${
              metric === m
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {LABELS[m]}
          </button>
        ))}
      </div>
      <ClientOnly fallback={<div className="h-40" />}>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 6, right: 6, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
                width={44}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 12,
                  color: "var(--foreground)",
                }}
                labelStyle={{ color: "var(--muted-foreground)" }}
                formatter={(v: number) => [`${v} kg`, LABELS[metric]]}
              />
              <Line
                type="monotone"
                dataKey={metric}
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3, fill: "var(--primary)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ClientOnly>
    </div>
  );
}
