import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  Check,
  CloudUpload,
  Copy,
  Eye,
  LogOut,
  Palette,
  RefreshCw,
  Share2,
  Trash2,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { syncNow } from "@/lib/cloud-sync";
import { loadPlan, loadSessions, type Session, type WeekPlan, DEFAULT_DAY_PLAN } from "@/lib/workout-store";
import { accountStats } from "@/lib/account-stats";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_THEME,
  applyTheme,
  loadTheme,
  saveTheme,
  type ThemeSettings,
} from "@/lib/theme";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil i synchronizacja — dziennik treningowy" },
      {
        name: "description",
        content:
          "Zaloguj się przez Google, synchronizuj treningi między telefonem i komputerem, personalizuj wygląd i zarządzaj prywatnością.",
      },
      { property: "og:title", content: "Profil i synchronizacja treningów" },
      {
        property: "og:description",
        content: "Logowanie Google, synchronizacja w chmurze, motyw aplikacji i usuwanie konta (RODO).",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameState, setUsernameState] = useState<"idle" | "checking" | "free" | "taken" | "invalid">(
    "idle",
  );
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [shareFull, setShareFull] = useState(false);
  const [online, setOnline] = useState(true);
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [weekPlan, setWeekPlan] = useState<WeekPlan>(DEFAULT_DAY_PLAN);
  const stats = accountStats(sessions, weekPlan);

  useEffect(() => {
    const t = loadTheme();
    setTheme(t);
    applyTheme(t);
    setShareUrl(window.location.origin);
    setSessions(loadSessions());
    setWeekPlan(loadPlan());
  }, []);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  useEffect(() => {
    if (!user) return;
    void (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, username, share_full")
        .eq("id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? (user.user_metadata["full_name"] as string) ?? "");
      setUsername(data?.username ?? "");
      setShareFull(data?.share_full ?? false);
    })();
  }, [user]);

  // Sprawdzanie dostępności nazwy użytkownika na żywo (z opóźnieniem).
  useEffect(() => {
    const value = username.trim().toLowerCase();
    if (!user || value === "") {
      setUsernameState("idle");
      return;
    }
    if (!/^[a-z0-9._-]{3,20}$/.test(value)) {
      setUsernameState("invalid");
      return;
    }
    setUsernameState("checking");
    const t = window.setTimeout(() => {
      void (async () => {
        const { data, error } = await supabase.rpc("username_available", { u: value });
        if (error) {
          setUsernameState("idle");
          return;
        }
        setUsernameState(data ? "free" : "taken");
      })();
    }, 450);
    return () => window.clearTimeout(t);
  }, [username, user]);

  const runSync = useCallback(
    async (silent = false) => {
      if (!user) return;
      setBusy(true);
      try {
        const res = await syncNow(user.id);
        setSessions(loadSessions());
        setWeekPlan(loadPlan());
        setLastSync(new Date().toLocaleTimeString("pl-PL"));
        if (!silent) toast.success(`Zsynchronizowano (pobrano ${res.pulled}, wysłano ${res.pushed})`);
      } catch {
        if (!silent) toast.error("Nie udało się zsynchronizować");
      } finally {
        setBusy(false);
      }
    },
    [user],
  );

  useEffect(() => {
    if (user) void runSync(true);
  }, [user, runSync]);

  const updateTheme = (next: ThemeSettings) => {
    setTheme(next);
    saveTheme(next);
  };

  const signIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Logowanie nie powiodło się");
      return;
    }
    if (result.redirected) return;
    toast.success("Zalogowano");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Wylogowano");
  };

  const saveProfile = async () => {
    if (!user) return;
    if (usernameState === "taken" || usernameState === "invalid") {
      toast.error(
        usernameState === "taken"
          ? "Ta nazwa użytkownika jest zajęta"
          : "Nazwa użytkownika: 3–20 znaków (litery, cyfry, . _ -)",
      );
      return;
    }
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: displayName.trim(),
        username: username.trim() === "" ? null : username.trim().toLowerCase(),
        share_full: shareFull,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      toast.error(
        error.code === "23505" ? "Ta nazwa użytkownika jest zajęta" : "Nie udało się zapisać profilu",
      );
      return;
    }
    toast.success("Profil zapisany");
  };

  const toggleShare = async (value: boolean) => {
    if (!user) return;
    setShareFull(value);
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: displayName.trim(),
        share_full: value,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (error) {
      setShareFull(!value);
      toast.error("Nie udało się zapisać zgody");
      return;
    }
    toast.success(value ? "Pełny plan jest teraz widoczny w VS" : "Udostępnianie planu wyłączone");
  };

  const sharePage = async () => {
    const data = {
      title: "Dziennik treningowy",
      text: "Zapisuj treningi, śledź progres i porównuj wyniki ze znajomymi.",
      url: shareUrl,
    };
    const nav = navigator as Navigator & { share?: (d: ShareData) => Promise<void> };
    if (nav.share) {
      try {
        await nav.share(data);
        return;
      } catch {
        /* anulowano */
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link skopiowany do schowka");
  };

  const deleteAccount = async () => {
    if (!user) return;
    if (deleteEmail.trim().toLowerCase() !== (user.email ?? "").toLowerCase()) {
      toast.error("Wpisany e-mail nie zgadza się z adresem konta");
      return;
    }
    const { error } = await supabase.rpc("delete_my_account");
    if (error) {
      toast.error("Nie udało się usunąć konta");
      return;
    }
    await supabase.auth.signOut();
    toast.success("Konto zostało usunięte");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto max-w-2xl px-4 py-6">
        <header className="mb-5 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Profil</h1>
          <span
            className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
              online ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {online ? "online" : "offline"}
          </span>
        </header>

        <div className="space-y-4">
          <section aria-labelledby="account-stats">
            <p id="account-stats" className="text-xs font-semibold uppercase tracking-wide text-primary">
              Statystyki konta
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {[
                { label: "Trenujesz od", value: stats.days.toLocaleString("pl-PL"), unit: "dni" },
                { label: "Zapisane treningi", value: stats.workouts.toLocaleString("pl-PL"), unit: "treningów" },
                { label: "Łączna objętość", value: stats.volume.toLocaleString("pl-PL"), unit: "kg" },
                { label: "Streak zgodnie z planem", value: stats.streak.toLocaleString("pl-PL"), unit: "treningów z rzędu" },
              ].map((stat) => <div key={stat.label} className="min-w-0 rounded-lg border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="mt-2 break-words text-xl font-bold tabular-nums text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.unit}</p>
              </div>)}
            </div>
          </section>

          {loading ? (
            <p className="text-sm text-muted-foreground">Ładowanie…</p>
          ) : !user ? (
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-base font-semibold text-foreground">Zaloguj się kontem Google</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Treningi zapisują się lokalnie zawsze. Po zalogowaniu synchronizują się automatycznie, więc
                zobaczysz je na telefonie i komputerze.
              </p>
              <button
                onClick={signIn}
                className="mt-4 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Kontynuuj z Google
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Zalogowany jako</p>
              <p className="text-sm font-semibold text-foreground">{user.email}</p>
              <div className="mt-3 grid gap-2">
                <label className="text-xs text-muted-foreground" htmlFor="display-name">
                  Nazwa wyświetlana (po niej znajdą Cię inni)
                </label>
                <input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
                <label className="text-xs text-muted-foreground" htmlFor="username">
                  Nazwa użytkownika (unikalna, opcjonalnie)
                </label>
                <div className="relative">
                  <input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="np. kingpolska"
                    className={`w-full rounded-lg border bg-background px-3 py-2 pr-9 text-sm text-foreground ${
                      usernameState === "free"
                        ? "border-success"
                        : usernameState === "taken" || usernameState === "invalid"
                          ? "border-destructive"
                          : "border-input"
                    }`}
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {usernameState === "checking" ? (
                      <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
                    ) : usernameState === "free" ? (
                      <Check className="h-4 w-4 text-success" />
                    ) : usernameState === "taken" || usernameState === "invalid" ? (
                      <X className="h-4 w-4 text-destructive" />
                    ) : null}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {usernameState === "free"
                    ? "Nazwa jest wolna — możesz ją zapisać."
                    : usernameState === "taken"
                      ? "Ta nazwa jest już zajęta."
                      : usernameState === "invalid"
                        ? "3–20 znaków: małe litery, cyfry oraz . _ -"
                        : "Po nazwie użytkownika znajomi znajdą Cię w zakładce VS."}
                </p>
                <button
                  onClick={() => void saveProfile()}
                  className="mt-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                >
                  Zapisz profil
                </button>
              </div>
            </div>
          )}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Wygląd aplikacji</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Motyw i kolor akcentu zapisują się na tym urządzeniu.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["dark", "light"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => updateTheme({ ...theme, mode })}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    theme.mode === mode
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-foreground hover:border-primary"
                  }`}
                >
                  {mode === "dark" ? "Ciemny" : "Jasny"}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <label htmlFor="accent-color" className="flex items-center gap-3 text-sm">
                <input id="accent-color" type="color" aria-label="Kolor akcentu" value={theme.customColor ?? "#f2b01e"}
                  onChange={(e) => updateTheme({ ...theme, customColor: e.target.value })}
                  className="h-11 w-11 cursor-pointer rounded-full border border-border bg-transparent p-1" />
                <span>Kolor akcentu <span className="block text-xs text-muted-foreground">{theme.customColor ?? "Domyślny"}</span></span>
              </label>
              <Button variant="ghost" size="sm" onClick={() => updateTheme({ ...theme, accent: DEFAULT_THEME.accent, customColor: undefined })}>Przywróć</Button>
            </div>
          </div>

          {user ? (
            <>
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <CloudUpload className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Synchronizacja</h2>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {lastSync
                    ? `Ostatnia synchronizacja: ${lastSync}`
                    : "Synchronizacja uruchamia się automatycznie."}
                </p>
                <button
                  disabled={busy || !online}
                  onClick={() => void runSync()}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
                  Synchronizuj teraz
                </button>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-semibold text-foreground">Prywatność w zakładce VS</h2>
                </div>
                <label className="mt-3 flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={shareFull}
                    onChange={(e) => void toggleShare(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[var(--primary)]"
                  />
                  <span className="text-xs text-muted-foreground">
                    Zgadzam się, żeby{" "}
                    <span className="font-semibold text-foreground">
                      każda zalogowana osoba, która mnie wyszuka
                    </span>
                    , widziała <span className="font-semibold text-foreground">wszystkie moje treningi</span> —
                    ćwiczenia, serie, ciężary, czasy przerw, notatki i zdjęcia — a nie tylko zbiorcze statystyki
                    (objętość, liczba treningów i serii). Po wyłączeniu tej zgody dostęp znika natychmiast.
                  </span>
                </label>
              </div>
            </>
          ) : null}

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Udostępnij stronę znajomemu</h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Wyślij link — znajomy założy własny dziennik i porównacie się w zakładce VS.
            </p>
            <div className="mt-3 flex gap-2">
              <input
                readOnly
                value={shareUrl}
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs text-muted-foreground"
              />
              <button
                onClick={() => void sharePage()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                <Copy className="h-4 w-4" /> Udostępnij
              </button>
            </div>
          </div>

          {user ? (
            <div className="flex flex-col gap-2">
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
              >
                <LogOut className="h-4 w-4" /> Wyloguj się
              </button>

              {confirmDelete ? (
                <div className="rounded-xl border border-destructive/40 bg-card p-4">
                  <p className="text-sm font-semibold text-destructive">Usuwanie konta jest nieodwracalne</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Aby potwierdzić, wpisz adres e-mail swojego konta:{" "}
                    <span className="font-semibold text-foreground">{user.email}</span>
                  </p>
                  <input
                    value={deleteEmail}
                    onChange={(e) => setDeleteEmail(e.target.value)}
                    placeholder="twój@email.com"
                    className="mt-3 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setConfirmDelete(false);
                        setDeleteEmail("");
                      }}
                      className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
                    >
                      Anuluj
                    </button>
                    <button
                      disabled={deleteEmail.trim().toLowerCase() !== (user.email ?? "").toLowerCase()}
                      onClick={() => void deleteAccount()}
                      className="flex-1 rounded-lg bg-destructive px-3 py-2 text-sm font-semibold text-destructive-foreground disabled:opacity-40"
                    >
                      Usuń konto
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Usuń konto i dane (RODO)
                </button>
              )}
            </div>
          ) : null}
        </div>
      </div>
      <AppNav />
    </div>
  );
}
