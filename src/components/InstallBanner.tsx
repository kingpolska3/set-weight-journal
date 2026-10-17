import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-border bg-card p-4 shadow-xl flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-primary/20 p-2 text-primary">
          <Download className="h-5 w-5" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Zainstaluj aplikację</h4>
          <p className="text-xs text-muted-foreground">Dodaj do ekranu głównego telefonu.</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleInstall}
          className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm"
        >
          Zainstaluj
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="p-1 text-muted-foreground hover:text-foreground"
          aria-label="Zamknij"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
