import {
  formatDatePL,
  planForDate,
  sessionVolume,
  workingSets,
  type Session,
  type WeekPlan,
} from "./workout-store";

function esc(text: string): string {
  return text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);
}

/**
 * Otwiera gotowy do zapisania dokument PDF (okno drukowania → „Zapisz jako PDF”).
 */
export function exportSessionsToPdf(sessions: Session[], plan: WeekPlan, title = "Dziennik treningowy") {
  if (typeof window === "undefined") return;
  const sorted = [...sessions]
    .filter((s) => s.exercises.length > 0)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  const body = sorted
    .map((s) => {
      const rows = s.exercises
        .map((ex, i) => {
          const sets = ex.sets
            .map(
              (set, si) =>
                `${set.warmup ? "R" : si + 1}. ${set.reps}×${set.weight} kg${set.note ? ` (${esc(set.note)})` : ""}`,
            )
            .join("<br/>");
          return `<tr><td class="num">${i + 1}</td><td>${esc(ex.name || "—")}</td><td>${sets}</td><td class="num">${workingSets(
            ex.sets,
          ).length}</td></tr>`;
        })
        .join("");
      return `<section>
        <h2>${esc(planForDate(s.date, plan))} — ${esc(formatDatePL(s.date))}</h2>
        <p class="meta">Objętość: ${Math.round(sessionVolume(s))} kg${s.note ? ` · ${esc(s.note)}` : ""}</p>
        <table><thead><tr><th>#</th><th>Ćwiczenie</th><th>Serie</th><th>Serie rob.</th></tr></thead><tbody>${rows}</tbody></table>
      </section>`;
    })
    .join("");

  const html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><title>${esc(title)}</title>
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#111;margin:32px;}
    h1{font-size:22px;margin:0 0 4px;}
    h2{font-size:15px;margin:0 0 4px;}
    .meta{font-size:12px;color:#555;margin:0 0 8px;}
    section{page-break-inside:avoid;margin-bottom:22px;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th,td{border:1px solid #ddd;padding:6px 8px;text-align:left;vertical-align:top;}
    th{background:#f4f4f5;}
    td.num,th:last-child{width:60px;text-align:center;}
    @page{margin:16mm;}
  </style></head><body>
  <h1>${esc(title)}</h1>
  <p class="meta">Wygenerowano ${new Date().toLocaleString("pl-PL")} · ${sorted.length} treningów</p>
  ${body || "<p>Brak treningów do wyeksportowania.</p>"}
  <script>window.onload = () => { window.focus(); window.print(); };<\/script>
  </body></html>`;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
}
