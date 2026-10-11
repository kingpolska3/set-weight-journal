import { daysBetween, sessionVolume, todayISO, type Session, type WeekPlan } from "./workout-store";

export function hasTraining(session: Session) {
  return !session.rest && session.exercises.some((ex) => ex.sets.some((s) => s.reps > 0 || (s.timeSec ?? 0) > 0));
}

export function accountStats(sessions: Session[], plan: WeekPlan, today = todayISO()) {
  const training = sessions.filter((s) => s.date <= today && hasTraining(s));
  const first = training.map((s) => s.date).sort()[0];
  const dates = new Set(training.map((s) => s.date));
  let streak = 0;
  if (first) {
    const cursor = new Date(today + "T12:00:00");
    // Today remains open until the day ends; planned rest days never reset a streak.
    if (!dates.has(today)) cursor.setDate(cursor.getDate() - 1);
    while (true) {
      const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
      if (iso < first) break;
      const label = (plan[cursor.getDay()] ?? "").trim();
      const scheduled = label !== "" && !/^(bez treningu|odpoczynek|wolne|rest)$/i.test(label);
      if (scheduled && !dates.has(iso)) break;
      if (dates.has(iso)) streak++;
      cursor.setDate(cursor.getDate() - 1);
    }
  }
  return { days: first ? daysBetween(first, today) + 1 : 0, workouts: dates.size, volume: Math.round(training.reduce((sum, s) => sum + sessionVolume(s), 0)), streak };
}