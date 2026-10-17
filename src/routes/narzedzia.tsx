import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExerciseAtlas } from "@/components/ExerciseAtlas";
import {
  Check,
  ClipboardList,
  ChevronDown,
  ChevronRight,
  Download,
  Eye,
  FileDown,
  Inbox,
  LayoutGrid,
  Plus,
  Timer,
  Trash2,
  Upload,
  Volume2,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { exportSessionsToPdf } from "@/lib/pdf-export";
import {
  DEFAULT_REST,
  SOUNDS,
  ensureNotifyPermission,
  formatRest,
  loadRest,
  playSound,
  saveRest,
  vibrate,
  type RestSettings,
  type SoundKey,
} from "@/lib/rest-settings";
import {
  downloadFile,
  loadPlan,
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

import {
  activateReceivedPlan,
  loadReceivedPlans,
  removeReceivedPlan,
  saveAllReceivedDaysAsTemplates,
  saveReceivedDayAsTemplate,
  type ReceivedPlan,
} from "@/lib/received-plans";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
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
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [rest, setRest] = useState<RestSettings>(DEFAULT_REST);
  const [received, setReceived] = useState<ReceivedPlan[]>([]);
    const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    setTemplates(loadTemplates());
    setSessions(loadSessions());
    setReceived(loadReceivedPlans());
    setRest(loadRest());
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

  const startReceivedPlan = (plan: ReceivedPlan) => {
    if (
      !confirm(
        `Aktywować plan „${plan.name}”?\n\nRozkład tygodnia zostanie nadpisany (dni bez treningu = Rest day), a ćwiczenia z dziś wstawią się do zakładki Trening, jeśli dziś jest dniem treningowym.`,
      )
    ) {
      return;
    }
    const { todayFilled } = activateReceivedPlan(plan);
    setTemplates(loadTemplates());
    setSessions(loadSessions());
    toast.success(
      todayFilled
        ? `Plan „${plan.name}” aktywny — ćwiczenia na dziś są w zakładce Trening`
        : `Plan „${plan.name}” aktywny — sprawdź Rozkład tygodnia i szablony`,
    );
  };

  const deleteReceived = (id: string) => {
    setReceived(removeReceivedPlan(id));
    toast.success("Usunięto otrzymany plan");
  };

    const togglePreview = (id: string) => {
    setPreviewId((cur) => (cur === id ? null : id));
  };

  const saveDayTemplate = (plan: ReceivedPlan, dayId: string) => {
    const tpl = saveReceivedDayAsTemplate(plan, dayId);
    if (!tpl) {
      toast.error("Ten dzień nie ma ćwiczeń do zapisania");
      return;
    }
    setTemplates(loadTemplates());
    toast.success(`Zapisano szablon „${tpl.name}”`);
  };

  const saveAllTemplates = (plan: ReceivedPlan) => {
    const n = saveAllReceivedDaysAsTemplates(plan);
    if (!n) {
      toast.error("Brak dni z ćwiczeniami");
      return;
    }
    setTemplates(loadTemplates());
    toast.success(`Zapisano ${n} szablon${n === 1 ? "" : n < 5 ? "y" : "ów"}`);
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

  const updateRest = (next: RestSettings) => {
    setRest(next);
    saveRest(next);
  };

  const exportPDF = () => exportSessionsToPdf(loadSessions(), loadPlan());

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
<div className="mx-auto max-w-2xl px-4 py-6 space-y-6">
              <section className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <Inbox className="h-4.5 w-4.5 text-primary" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Otrzymane plany treningowe</h2>
              <p className="text-xs text-muted-foreground">
                Plany udostępnione linkiem. Możesz je aktywować w Treningu i Rozkładzie tygodnia.
              </p>
            </div>
          </div>

          {received.length === 0 ? (
            <p className="mt-3 rounded-xl border border-dashed border-border bg-secondary/30 p-4 text-center text-xs text-muted-foreground">
              Brak otrzymanych planów. Gdy ktoś udostępni Ci link do planu i go otworzysz (będąc zalogowanym),
              pojawi się tutaj.
            </p>
          ) : (
                        <ul className="mt-3 space-y-3">
              {received.map((plan) => {
                const isOpen = previewId === plan.id;
                const daysWithEx = plan.days.filter((d) => d.exercises.length > 0);
                return (
                  <li key={plan.id} className="rounded-xl border border-border bg-secondary/20 p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">{plan.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {daysWithEx.length} dni z ćwiczeniami
                          {plan.trainingDays?.length ? ` · ${plan.trainingDays.join(", ")}` : ""}
                          {plan.receivedAt
                            ? ` · ${new Date(plan.receivedAt).toLocaleDateString("pl-PL")}`
                            : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteReceived(plan.id)}
                        className="shrink-0 p-1.5 text-muted-foreground hover:text-destructive"
                        aria-label="Usuń plan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => togglePreview(plan.id)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        {isOpen ? "Ukryj podgląd" : "Podgląd treningu"}
                      </button>
                      <button
                        type="button"
                        onClick={() => saveAllTemplates(plan)}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-foreground hover:border-primary"
                      >
                        Zapisz dni jako szablony
                      </button>
                    </div>

                    {isOpen ? (
                      <div className="mt-3 space-y-3 border-t border-border pt-3">
                        {plan.days.length === 0 ? (
                          <p className="text-xs text-muted-foreground">Brak dni w planie.</p>
                        ) : (
                          plan.days.map((day) => (
                            <div key={day.id} className="rounded-lg border border-border bg-card p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-primary">
                                    {day.weekday ? `${day.weekday} · ` : ""}
                                    {day.name}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {day.exercises.length} ćwiczeń
                                  </p>
                                </div>
                                {day.exercises.length > 0 ? (
                                  <button
                                    type="button"
                                    onClick={() => saveDayTemplate(plan, day.id)}
                                    className="shrink-0 rounded-lg bg-primary/15 px-2.5 py-1.5 text-[11px] font-semibold text-primary"
                                  >
                                    Zapisz jako szablon
                                  </button>
                                ) : null}
                              </div>
                              {day.exercises.length > 0 ? (
                                <ol className="mt-2 space-y-1.5">
                                  {day.exercises.map((ex, i) => (
                                    <li key={ex.id || i} className="text-xs text-foreground">
                                      <span className="font-medium">
                                        {i + 1}. {ex.name}
                                      </span>
                                      <span className="text-muted-foreground">
                                        {" "}
                                        · {ex.sets.length} serii
                                        {ex.sets.length
                                          ? ` (${ex.sets
                                              .map((s) =>
                                                s.warmup ? `${s.reps} rozgrz.` : s.reps || "—",
                                              )
                                              .join(" / ")})`
                                          : ""}
                                      </span>
                                      {ex.note ? (
                                        <p className="mt-0.5 text-[11px] text-muted-foreground">{ex.note}</p>
                                      ) : null}
                                    </li>
                                  ))}
                                </ol>
                              ) : (
                                <p className="mt-1 text-[11px] text-muted-foreground">Brak ćwiczeń w tym dniu.</p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => startReceivedPlan(plan)}
                      className="mt-3 w-full rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground"
                    >
                      Zacznij trenować z tym planem
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

      <section className="mx-auto max-w-2xl space-y-6 px-4 py-6">
        <Link
          to="/plany"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground"
        >
          <ClipboardList className="h-4 w-4" /> Tworzenie planów treningowych
        </Link>
        <ExerciseAtlas />
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
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Twoje szablony
            </h2>
            {templates.length > 0 ? (
              <button
                onClick={() =>
                  setOpen((o) => {
                    const anyOpen = templates.some((t) => o[t.id]);
                    return Object.fromEntries(templates.map((t) => [t.id, !anyOpen]));
                  })
                }
                className="text-xs font-medium text-primary"
              >
                {templates.some((t) => open[t.id]) ? "Zwiń wszystkie" : "Rozwiń wszystkie"}
              </button>
            ) : null}
          </div>
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
              <button
                onClick={() => setOpen((o) => ({ ...o, [tpl.id]: !o[tpl.id] }))}
                aria-expanded={!!open[tpl.id]}
                className="mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {open[tpl.id] ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
                {open[tpl.id] ? "Zwiń" : "Rozwiń"} · {tpl.exercises.length} ćwiczeń
              </button>
              {open[tpl.id] ? (
                <ul className="mt-2 space-y-0.5">
                  {tpl.exercises.map((e, i) => (
                    <li key={i} className="text-xs text-muted-foreground">
                      {i + 1}. {e.name} – {e.sets.length} serii
                    </li>
                  ))}
                </ul>
              ) : null}
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
              onClick={exportPDF}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs text-foreground hover:border-primary"
            >
              <FileDown className="h-3.5 w-3.5" /> PDF
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
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex items-center gap-3 border-b border-border bg-secondary/50 px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
              <Timer className="h-4.5 w-4.5 text-primary" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Przerwa między seriami</h2>
              <p className="text-xs text-muted-foreground">
                Timer przy każdej serii odlicza ten czas i daje znać, że pora na kolejną.
              </p>
            </div>
            <span className="ml-auto rounded-xl bg-primary px-3 py-1.5 font-mono text-sm font-bold tabular-nums text-primary-foreground">
              {formatRest(rest.seconds)}
            </span>
          </div>

          <div className="space-y-5 p-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Długość przerwy
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {[60, 90, 120, 150, 180, 240].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateRest({ ...rest, seconds: sec })}
                    className={`rounded-xl border py-2 text-xs font-semibold tabular-nums transition-colors ${
                      rest.seconds === sec
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-foreground hover:border-primary/60"
                    }`}
                  >
                    {formatRest(sec)}
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-3">
                <input
                  type="range"
                  min={15}
                  max={600}
                  step={5}
                  value={rest.seconds}
                  onChange={(e) => updateRest({ ...rest, seconds: Number(e.target.value) })}
                  aria-label="Długość przerwy"
                  className="h-1.5 flex-1 accent-[var(--primary)]"
                />
                <input
                  type="number"
                  min={10}
                  max={900}
                  step={5}
                  value={rest.seconds}
                  onChange={(e) =>
                    updateRest({
                      ...rest,
                      seconds: Math.min(900, Math.max(10, Number(e.target.value) || 10)),
                    })
                  }
                  aria-label="Długość przerwy w sekundach"
                  className="w-20 rounded-lg border border-input bg-secondary px-2 py-1.5 text-center text-sm tabular-nums text-foreground outline-none focus:border-primary"
                />
                <span className="text-xs text-muted-foreground">sek.</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Dźwięk końca przerwy
                </p>
                <label className="flex items-center gap-2 text-xs text-foreground">
                  <input
                    type="checkbox"
                    checked={rest.soundOn}
                    onChange={(e) => updateRest({ ...rest, soundOn: e.target.checked })}
                    className="h-4 w-4 accent-[var(--primary)]"
                  />
                  włączony
                </label>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {(Object.keys(SOUNDS) as SoundKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      updateRest({ ...rest, sound: key, soundOn: true });
                      playSound(key, rest.volume);
                    }}
                    className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-xs transition-colors ${
                      rest.sound === key
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/60"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        rest.sound === key ? "border-primary bg-primary" : "border-border"
                      }`}
                    >
                      {rest.sound === key ? (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      ) : null}
                    </span>
                    <span className="font-medium">{SOUNDS[key].label}</span>
                    <Volume2 className="ml-auto h-3.5 w-3.5 text-primary" />
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={Math.round(rest.volume * 100)}
                  onChange={(e) => updateRest({ ...rest, volume: Number(e.target.value) / 100 })}
                  aria-label="Głośność sygnału"
                  className="h-1.5 flex-1 accent-[var(--primary)]"
                />
                <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">
                  {Math.round(rest.volume * 100)}%
                </span>
                <button
                  onClick={() => playSound(rest.sound, rest.volume)}
                  className="rounded-lg border border-border px-2.5 py-1.5 text-[11px] font-medium text-primary hover:border-primary"
                >
                  Testuj
                </button>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/5 px-3 py-3 text-foreground">
              <input
                type="checkbox"
                checked={rest.autoStart}
                onChange={(e) => updateRest({ ...rest, autoStart: e.target.checked })}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--primary)]"
              />
              <span>
                <span className="block text-xs font-semibold">Automatycznie startuj przerwę</span>
                <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
                  Timer danej serii ruszy po uzupełnieniu powtórzeń i ciężaru.
                </span>
              </span>
            </label>

            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={rest.vibrate}
                  onChange={(e) => {
                    updateRest({ ...rest, vibrate: e.target.checked });
                    if (e.target.checked) vibrate([200]);
                  }}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Wibracje (telefon)
              </label>
              <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={rest.notify}
                  onChange={(e) => {
                    const on = e.target.checked;
                    updateRest({ ...rest, notify: on });
                    if (on) {
                      void ensureNotifyPermission().then((ok) => {
                        if (!ok) toast.error("Powiadomienia są zablokowane w przeglądarce");
                      });
                    }
                  }}
                  className="h-4 w-4 accent-[var(--primary)]"
                />
                Powiadomienie systemowe
              </label>
            </div>
          </div>
        </div>

      </section>
      <AppNav />
    </main>
  );
}
