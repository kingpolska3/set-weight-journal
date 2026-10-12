import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircle, Sparkles, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePlan } from "@/lib/plan-generation.functions";
import type { GeneratedPlan } from "@/lib/plan-generation-schema";
import type { Client, PlanRow } from "@/lib/trainer-plans";
import { uid } from "@/lib/workout-store";
import { savePlanData } from "@/lib/trainer-plans";

export function PlanGenerator({ row, onChange }: { row: PlanRow; onChange: (client: Client) => void }) {
  const generate = useServerFn(generatePlan);
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<GeneratedPlan | null>(null);
  const [error, setError] = useState("");
  const [snapshot, setSnapshot] = useState("");
  const run = async () => {
    setError(""); setBusy(true); setDraft(null);
    try {
      await savePlanData(row.id, row.data);
      const result = await generate({ data: { planId: row.id } });
      if ("error" in result) setError(result.error ?? "Nie udało się wygenerować planu.");
      else { setDraft(result.plan); setSnapshot(JSON.stringify(row.data)); }
    } catch { setError("Nie udało się wygenerować planu. Sprawdź połączenie."); }
    finally { setBusy(false); }
  };
  return <section className="space-y-3 border-t border-border pt-4">
    <Button disabled={busy || !row.data.trainingDays?.length || !row.data.goal.trim()} onClick={() => void run()} className="h-auto w-full whitespace-normal py-3">
      {busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />} {busy ? "Przygotowywanie szkicu…" : "Wygeneruj plan z danych podopiecznego"}
    </Button>
    {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    {draft ? <div className="space-y-3">
      <h3 className="font-semibold">Szkic do oceny trenera</h3>
      <p className="text-sm text-muted-foreground">{draft.summary}</p>
      {draft.warnings.map((warning, i) => <p key={i} className="text-xs text-danger">{warning}</p>)}
      {draft.days.map((day) => <div key={day.weekday} className="border-t border-border pt-2">
        <h4 className="text-sm font-semibold text-primary">{day.weekday} — {day.name}</h4>
        {day.exercises.map((ex, i) => <div key={i} className="mt-2 text-sm">
          <p>{i + 1}. {ex.name} · {ex.sets.length} serii · {ex.sets.map((s) => s.reps).join(" / ")}</p>
          <p className="text-xs text-muted-foreground">{ex.note}</p>
        </div>)}
      </div>)}
      <div className="flex flex-wrap gap-2">
        <Button disabled={snapshot !== JSON.stringify(row.data)} onClick={() => {
          if (row.data.days.some((d) => d.exercises.length) && !confirm("Zastąpić dotychczasowy rozpisany plan tym szkicem?")) return;
          onChange({ ...row.data, days: draft.days.map((d) => ({ id: uid(), name: `${d.weekday} — ${d.name}`, weekday: d.weekday,
            exercises: d.exercises.map((ex) => ({ ...ex, id: uid() })) })) });
          setDraft(null);
        }}><Check /> Zatwierdź plan</Button>
        <Button variant="ghost" onClick={() => setDraft(null)}><X /> Odrzuć</Button>
      </div>
      {snapshot !== JSON.stringify(row.data) ? <p className="text-xs text-danger">Dane uległy zmianie. Wygeneruj nowy szkic.</p> : null}
    </div> : null}
  </section>;
}