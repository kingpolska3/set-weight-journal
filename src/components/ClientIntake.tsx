import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Client, PlanDay } from "@/lib/trainer-plans";
import { uid } from "@/lib/workout-store";

export const TRAINING_WEEKDAYS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];
const FIELDS = [
  ["sessionTime", "Czas sesji", "Ile minut jest dostępne na trening?"],
  ["goal", "Cel współpracy", "Jaki jest główny cel?"],
  ["additionalGoals", "Cele dodatkowe", "Jakie są pozostałe cele?"],
  ["level", "Poziom zaawansowania", "Początkujący, średniozaawansowany czy zaawansowany?"],
  ["experience", "Staż treningowy", "Jak długo i jak regularnie trenuje?"],
  ["injuries", "Urazy i kontuzje", "Jakieś urazy, kontuzje lub operacje?"],
  ["joints", "Stawy (joint by joint)", "Czy coś działo się w okolicy stawów/których?"],
  ["pain", "Aktualne dolegliwości bólowe", "Obecnie dolegliwości bólowe?"],
  ["surgeries", "Operacje i blizny", "Przebyte operacje i blizny?"],
  ["chronic", "Choroby przewlekłe", "Czy posiada choroby przewlekłe?"],
  ["meds", "Przyjmowane leki", "Czy przyjmuje leki na stałe?"],
  ["doctor", "Opieka lekarza", "Czy jest pod stałą opieką lekarza?"],
  ["equipment", "Dostępny sprzęt do treningów", "Jaki sprzęt jest dostępny?"],
  ["priority", "Priorytet partii ciała", "Które partie ciała są priorytetem?"],
  ["coachNotes", "Notatki trenera", ""],
] as const;

export function syncTrainingDays(client: Client, selected: string[]): PlanDay[] {
  const existing = client.days;
  const added = selected.filter((weekday) => !existing.some((d) => d.weekday === weekday || d.name === weekday))
    .map((weekday) => ({ id: uid(), name: weekday, weekday, exercises: [] }));
  // Never discard prescribed exercises when availability changes.
  return [...existing.filter((d) => !d.weekday || selected.includes(d.weekday) || d.exercises.length > 0), ...added]
    .sort((a, b) => {
      const ai = TRAINING_WEEKDAYS.indexOf(a.weekday ?? a.name);
      const bi = TRAINING_WEEKDAYS.indexOf(b.weekday ?? b.name);
      return (ai < 0 ? 7 : ai) - (bi < 0 ? 7 : bi);
    });
}

export function ClientIntake({ client, onChange }: { client: Client; onChange: (c: Client) => void }) {
  const [open, setOpen] = useState(true);
  return <section className="mt-4 border-t border-border pt-3">
    <Button variant="ghost" className="w-full justify-between px-0" onClick={() => setOpen(!open)} aria-expanded={open}>
      Dane podopiecznego <ChevronDown className={open ? "rotate-180" : ""} />
    </Button>
    {open ? <div className="mt-3 space-y-4">
      <div>
        <h3 className="text-sm font-semibold">Dni treningowe</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {TRAINING_WEEKDAYS.map((day) => {
            const selected = (client.trainingDays ?? []).includes(day);
            return <Button key={day} size="sm" variant={selected ? "default" : "secondary"} aria-pressed={selected} onClick={() => {
              const days = TRAINING_WEEKDAYS.filter((d) => d === day ? !selected : client.trainingDays?.includes(d));
              onChange({ ...client, trainingDays: days, days: syncTrainingDays(client, days) });
            }}>{day}</Button>;
          })}
        </div>
      </div>
      {FIELDS.map(([key, title, question]) => <label key={key} className="block">
        <span className="block text-sm font-semibold">{title}</span>
        {question ? <span className="block text-xs text-muted-foreground">{question}</span> : null}
        <textarea aria-label={title} value={key === "goal" ? client.goal : client.intake?.[key] ?? ""} rows={key === "coachNotes" ? 4 : 2} maxLength={1000} placeholder="—"
          onChange={(e) => onChange(key === "goal" ? { ...client, goal: e.target.value } : { ...client, intake: { ...client.intake, [key]: e.target.value } })}
          className="mt-2 w-full resize-y rounded-lg border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary" />
      </label>)}
    </div> : null}
  </section>;
}