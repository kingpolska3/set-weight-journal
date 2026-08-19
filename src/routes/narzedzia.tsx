import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, LayoutGrid, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import {
  downloadFile,
  loadSessions,
  loadTemplates,
  saveSessions,
  saveTemplates,
  sessionsToCSV,
  todayISO,
  uid,
  type Session,
  type Template,
} from "@/lib/workout-store";

export const Route = createFileRoute("/narzedzia")({
  head: () => ({
    meta: [
      { title: "Narzędzia treningowe — szablony i backup" },
      {
        name: "description",
        content:
          "Twórz szablony treningów, startuj trening jednym kliknięciem i eksportuj dane do CSV lub JSON.",
      },
      { property: "og:title", content: "Narzędzia treningowe — szablony i backup" },
      {
        property: "og:description",
        content: "Szablony treningów, szybki start dnia oraz eksport i import kopii zapasowej.",
      },
    ],
  }),
  component: ToolsPage,
});

function ToolsPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [name, setName] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTemplates(loadTemplates());
    setSessions(loadSessions());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) saveTemplates(templates);
  }, [templates, loaded]);

  const createEmpty = () => {
    if (!name.trim()) return;
    setTemplates((t) => [...t, { id: uid(), name: name.trim(), exercises: [] }]);
    setName("");
  };

  const createFromDay = (date: string) => {
    const s = sessions.find((x) => x.date === date);
    if (!s || s.exercises.length === 0) return;
    setTemplates((t) => [
      ...t,
      {
        id: uid(),
        name: name.trim() || `Trening ${date}`,
        exercises: s.exercises.map((e) => ({
          name: e.name,
          sets: e.sets.map((x) => ({ ...x })),
        })),
      },
    ]);
    setName("");
    toast.success("Szablon zapisany");
  };

  const startToday = (tpl: Template) => {
    const date = todayISO();
    const all = loadSessions();
    const next: Session = {
      date,
      exercises: tpl.exercises.map((e) => ({
        id: uid(),
        name: e.name,
        sets: e.sets.map((s) => ({ ...s })),
      })),
    };
    const list = all.some((s) => s.date === date)
      ? all.map((s) => (s.date === date ? next : s))
      : [...all, next];
    saveSessions(list.sort((a, b) => (a.date < b.date ? 1 : -1)));
    setSessions(list);
    toast.success(`Wystartowano „${tpl.name}” na dziś`);
  };

  const exportJSON = () =>
    downloadFile(
      `trening-backup-${todayISO()}.json`,
      JSON.stringify({ sessions: loadSessions(), templates }, null, 2),
      "application/json",
    );

  const exportCSV = () =>
    downloadFile(`trening-${todayISO()}.csv`, sessionsToCSV(loadSessions()), "text/csv");

  const importJSON = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text()) as {
        sessions?: Session[];
        templates?: Template[];
      };
      if (Array.isArray(parsed.sessions)) {
        saveSessions(parsed.sessions);
        setSessions(parsed.sessions);
      }
      if (Array.isArray(parsed.templates)) setTemplates(parsed.templates);
      toast.success("Kopia wczytana");
    } catch {
      toast.error("Nieprawidłowy plik kopii");
    }
  };

  const recentDates = [...sessions]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6)
    .map((s) => s.date);

  return (
    <main className="min-h-screen bg-background pb-24">
      <header className="border-b border-border px-4 pb-5 pt-8">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-2 text-primary">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]">Narzędzia</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Szablony i backup</h1>
        </div>
      </header>

      <section className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Nowy szablon</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Klata+Plecy A"
            maxLength={40}
            className="mt-2 w-full rounded-xl border border-input bg-secondary px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={createEmpty}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Utwórz pusty
            </button>
            {recentDates.map((d) => (
              <button
                key={d}
                onClick={() => createFromDay(d)}
                className="rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:border-primary"
              >
                Z treningu {d}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Twoje szablony
          </h2>
          {templates.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Brak szablonów. Zapisz dowolny trening jako szablon powyżej.
            </p>
          ) : null}
          {templates.map((tpl) => (
            <article key={tpl.id} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  value={tpl.name}
                  onChange={(e) =>
                    setTemplates((list) =>
                      list.map((t) => (t.id === tpl.id ? { ...t, name: e.target.value } : t)),
                    )
                  }
                  className="min-w-0 flex-1 rounded-lg bg-transparent text-sm font-semibold text-foreground outline-none focus:bg-secondary"
                />
                <button
                  onClick={() => setTemplates((l) => l.filter((t) => t.id !== tpl.id))}
                  aria-label="Usuń szablon"
                  className="rounded-lg p-1.5 text-muted-foreground hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <ul className="mt-2 space-y-0.5">
                {tpl.exercises.map((e, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    {i + 1}. {e.name} – {e.sets.length} serii
                  </li>
                ))}
              </ul>
              <button
                onClick={() => startToday(tpl)}
                className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground"
              >
                Start na dziś
              </button>
            </article>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h2 className="text-sm font-semibold text-foreground">Eksport i kopia zapasowa</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:border-primary"
            >
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
            <button
              onClick={exportJSON}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:border-primary"
            >
              <Download className="h-3.5 w-3.5" /> JSON (backup)
            </button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:border-primary">
              <Upload className="h-3.5 w-3.5" /> Wczytaj kopię
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(e) => {
                  void importJSON(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>
      </section>
      <AppNav />
    </main>
  );
}
