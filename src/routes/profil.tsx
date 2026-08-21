import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { CloudUpload, FileDown, LogOut, RefreshCw, Trash2, User } from "lucide-react";
import { toast } from "sonner";
import { AppNav } from "@/components/AppNav";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { syncNow } from "@/lib/cloud-sync";
import { exportSessionsToPdf } from "@/lib/pdf-export";
import { loadPlan, loadSessions } from "@/lib/workout-store";

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Profil i synchronizacja — dziennik treningowy" },
      {
        name: "description",
        content:
          "Zaloguj się przez Google, synchronizuj treningi między telefonem i komputerem, eksportuj PDF lub usuń konto.",
      },
      { property: "og:title", content: "Profil i synchronizacja treningów" },
      {
        property: "og:description",
        content: "Logowanie Google, synchronizacja w chmurze, eksport PDF i usuwanie konta (RODO).",
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
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

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
        .select("display_name, username")
        .eq("id", user.id)
        .maybeSingle();
      setDisplayName(data?.display_name ?? (user.user_metadata["full_name"] as string) ?? "");
      setUsername(data?.username ?? "");
    })();
  }, [user]);

  const runSync = useCallback(
    async (silent = false) => {
      if (!user) return;
      setBusy(true);
      try {
        const res = await syncNow(user.id);
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
    const { error } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        display_name: displayName.trim(),
        username: username.trim() === "" ? null : username.trim().toLowerCase(),
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

  const deleteAccount = async () => {
    if (!user) return;
    if (!window.confirm("Na pewno usunąć konto i wszystkie dane w chmurze? Tej operacji nie da się cofnąć.")) {
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
          <div className="space-y-4">
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
                <input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                />
                <button
                  onClick={saveProfile}
                  className="mt-1 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
                >
                  Zapisz profil
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center gap-2">
                <CloudUpload className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Synchronizacja</h2>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {lastSync ? `Ostatnia synchronizacja: ${lastSync}` : "Synchronizacja uruchamia się automatycznie."}
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
                <FileDown className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">Eksport PDF</h2>
              </div>
              <button
                onClick={() => exportSessionsToPdf(loadSessions(), loadPlan())}
                className="mt-3 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground"
              >
                Pobierz dziennik jako PDF
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => void signOut()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground"
              >
                <LogOut className="h-4 w-4" /> Wyloguj się
              </button>
              <button
                onClick={() => void deleteAccount()}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive"
              >
                <Trash2 className="h-4 w-4" /> Usuń konto i dane (RODO)
              </button>
            </div>
          </div>
        )}
      </div>
      <AppNav />
    </div>
  );
}
