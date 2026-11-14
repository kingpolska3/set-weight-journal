import { useEffect, useMemo, useState } from "react";
import { Download, Share, X } from "lucide-react";
import { isStandaloneDisplay } from "@/lib/pwa";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

const DISMISS_KEY = "pwa-install-dismissed-v2";

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /android/i.test(navigator.userAgent);
}

/**
 * Baner instalacji PWA:
 * - Android / Chrome: natywny beforeinstallprompt
 * - iOS Safari: instrukcja „Udostępnij → Do ekranu głównego”
 * Nie pokazuje się, gdy app jest już zainstalowana (standalone).
 */
export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);

  const platform = useMemo(() => {
    if (isIos()) return "ios" as const;
    if (isAndroid()) return "android" as const;
    return "desktop" as const;
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandaloneDisplay()) return;

    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    const onBip = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
      setIosHelp(false);
    };
    window.addEventListener("beforeinstallprompt", onBip);

    // iOS nie ma beforeinstallprompt – pokaż instrukcję po chwili
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (platform === "ios") {
      timer = setTimeout(() => {
        if (!isStandaloneDisplay()) {
          setIosHelp(true);
          setVisible(true);
        }
      }, 1800);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      if (timer) clearTimeout(timer);
    };
  }, [platform]);

  const dismiss = () => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") setVisible(false);
    } catch {
      /* user closed */
    }
    setDeferredPrompt(null);
  };

  if (!visible || isStandaloneDisplay()) return null;

  return (
    <div className="fixed bottom-20 left-3 right-3 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/15">
          <img src="/icons/icon-192.png" alt="" className="h-11 w-11 rounded-xl" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-foreground">Zainstaluj Dziennik treningowy</h4>
          {iosHelp || platform === "ios" ? (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Na iPhone: kliknij{" "}
              <Share className="inline h-3.5 w-3.5 text-primary" aria-hidden />{" "}
              <strong className="text-foreground">Udostępnij</strong>, potem{" "}
              <strong className="text-foreground">„Do ekranu głównego”</strong>.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Dodaj do ekranu głównego – działa jak zwykła aplikacja, także offline.
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label="Zamknij"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {deferredPrompt ? (
        <button
          type="button"
          onClick={() => void handleInstall()}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" />
          Zainstaluj
        </button>
      ) : platform === "ios" ? (
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Safari → Udostępnij → Do ekranu głównego
        </p>
      ) : platform === "android" ? (
        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          Menu przeglądarki (⋮) → „Zainstaluj aplikację” / „Dodaj do ekranu głównego”
        </p>
      ) : null}
    </div>
  );
}
