import { useState } from "react";
import { BookOpen, ChevronDown, Info } from "lucide-react";
import { ATLAS, type AtlasExercise } from "@/lib/exercise-atlas";

export function ExerciseAtlas() {
  const [gender, setGender] = useState<"m" | "k">("m");
  const [cat, setCat] = useState(0);
  const [openEx, setOpenEx] = useState<string | null>(null);
  const cats = ATLAS[gender];
  const current = cats[Math.min(cat, cats.length - 1)];
  const groups = current?.groups ?? [{ label: "", exercises: current?.exercises ?? [] }];

  const renderEx = (x: AtlasExercise) => {
    const open = openEx === x.name;
    return (
      <li key={x.name} className="rounded-xl border border-border">
        <button
          onClick={() => setOpenEx(open ? null : x.name)}
          className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm font-medium text-foreground"
        >
          {x.name}
          <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        {open ? (
          <div className="space-y-1.5 px-3 pb-3 text-xs leading-relaxed text-muted-foreground">
            <p>{x.desc}</p>
            <p>
              <span className="font-semibold text-primary">Wskazówka: </span>
              {x.tips}
            </p>
          </div>
        ) : null}
      </li>
    );
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <BookOpen className="h-4 w-4 text-primary" /> Atlas ćwiczeń
      </h2>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {(["m", "k"] as const).map((g) => (
          <button
            key={g}
            onClick={() => {
              setGender(g);
              setCat(0);
              setOpenEx(null);
            }}
            className={`rounded-lg py-2 text-sm font-medium ${
              gender === g ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}
          >
            {g === "m" ? "Dla mężczyzn" : "Dla kobiet"}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {cats.map((c, i) => (
          <button
            key={c.key}
            onClick={() => {
              setCat(i);
              setOpenEx(null);
            }}
            className={`rounded-full px-3 py-1 text-xs ${
              i === cat ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-4">
        {groups.map((g, gi) => (
          <div key={g.label || gi}>
            {g.label ? (
              <h3 className="mb-2 border-b border-border pb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                {gi + 1}. {g.label}
              </h3>
            ) : null}
            <ul className="space-y-2">{g.exercises.map(renderEx)}</ul>
          </div>
        ))}
      </div>
      {current?.note ? (
        <div className="mt-4 flex gap-2 rounded-xl bg-secondary/60 p-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <p className="whitespace-pre-line">{current.note}</p>
        </div>
      ) : null}
    </div>
  );
}
