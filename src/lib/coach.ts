import { topWeight, totalReps, volume, type Exercise, type Progress } from "./workout-store";

export type Tip = { text: string; tone: "good" | "warn" | "info" };

/** Realne wskazówki progresji pod hipertrofię / przygotowania kulturystyczne. */
export function coachTips(exercise: Exercise, progress: Progress | null): Tip[] {
  const sets = exercise.sets.filter((s) => (s.reps || 0) > 0);
  const tips: Tip[] = [];

  if (sets.length === 0) {
    return [
      {
        text: "Wpisz serie robocze (bez rozgrzewki). Docelowo 3–4 serie w zakresie 6–12 powtórzeń, 1–2 powtórzenia w zapasie (RIR 1–2).",
        tone: "info",
      },
    ];
  }

  const top = topWeight(sets);
  const reps = totalReps(sets);
  const avgReps = reps / sets.length;
  const maxReps = Math.max(...sets.map((s) => s.reps || 0));
  const minReps = Math.min(...sets.map((s) => s.reps || 0));
  const step = top >= 60 ? 2.5 : top >= 20 ? 1.25 : 1;

  // Double progression
  if (avgReps >= 11 && maxReps >= 12) {
    tips.push({
      text: `Górna granica zakresu osiągnięta — następny trening dołóż +${step} kg i wróć do 8–9 powtórzeń (podwójna progresja).`,
      tone: "good",
    });
  } else if (avgReps < 6) {
    tips.push({
      text: `Za ciężko na masę — zejdź o ${step * 2} kg i celuj w 8–10 czystych powtórzeń; hipertrofia rośnie z objętości, nie z rekordów.`,
      tone: "warn",
    });
  } else {
    tips.push({
      text: `Zostań na ${top} kg i dokładaj po 1 powtórzeniu w każdej serii, aż wszystkie osiągną 12 — dopiero wtedy +${step} kg.`,
      tone: "info",
    });
  }

  if (sets.length < 3) {
    tips.push({
      text: "Dobij do 3–4 serii roboczych — to główny motor objętości tygodniowej (10–20 serii na partię).",
      tone: "warn",
    });
  } else if (sets.length >= 5 && avgReps >= 10) {
    tips.push({
      text: "Dużo serii i powtórzeń — zamiast dokładać kolejne serie, podnieś ciężar lub spowolnij fazę ekscentryczną (3 s w dół).",
      tone: "info",
    });
  }

  if (maxReps - minReps >= 5) {
    tips.push({
      text: "Duży spadek powtórzeń między seriami — wydłuż przerwę do 2–3 min lub zejdź o jeden stopień ciężaru w ostatniej serii.",
      tone: "warn",
    });
  }

  if (progress) {
    if (progress.volumePct > 5) {
      tips.push({
        text: `Objętość ${progress.volumePct.toFixed(1)}% w górę — utrzymaj tempo 2,5–5% tygodniowo i pilnuj snu oraz nadwyżki kalorycznej.`,
        tone: "good",
      });
    } else if (progress.volumePct < -5) {
      tips.push({
        text: "Regres względem poprzedniego razu — sprawdź sen, kalorie i przerwy. Jeśli powtarza się 2. tydzień, zrób deload (-40% objętości).",
        tone: "warn",
      });
    } else {
      tips.push({
        text: "Stagnacja — zmień jeden bodziec: tempo, zakres ruchu, ustawienie chwytu lub dołóż jedną serię z RIR 0 na koniec.",
        tone: "info",
      });
    }
  } else {
    tips.push({
      text: "Pierwszy zapis — zapamiętaj ten ciężar jako bazę i w kolejnym tygodniu pobij powtórzenia lub ciężar.",
      tone: "info",
    });
  }

  const finisher = volume(sets) > 0 && avgReps >= 10;
  tips.push({
    text: finisher
      ? "Pod scenę: ostatnią serię zakończ dropsetem (-20% ciężaru) i pilnuj pełnego napięcia w rozciągnięciu."
      : "Pod scenę: 2 s pauza w najtrudniejszym punkcie i pełen zakres ruchu — jakość powtórzeń buduje detal mięśnia.",
    tone: "info",
  });

  return tips.slice(0, 4);
}
