import { registerSW } from "virtual:pwa-register";

const APP_SW_PATH = "/sw.js";

/** Preview / iframe Lovable – bez SW, żeby nie psuć edytora. */
function isPreviewContext() {
  if (typeof window === "undefined") return true;
  const hostname = window.location.hostname;
  return (
    !import.meta.env.PROD ||
    window.self !== window.top ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("id-preview--") ||
    hostname.startsWith("preview--") ||
    hostname === "lovableproject.com" ||
    hostname.endsWith(".lovableproject.com") ||
    hostname === "lovableproject-dev.com" ||
    hostname.endsWith(".lovableproject-dev.com") ||
    hostname === "beta.lovable.dev" ||
    hostname.endsWith(".beta.lovable.dev") ||
    new URLSearchParams(window.location.search).get("sw") === "off"
  );
}

async function unregisterAppWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) => {
        const scriptURL =
          registration.active?.scriptURL ??
          registration.waiting?.scriptURL ??
          registration.installing?.scriptURL ??
          "";
        return scriptURL.includes("sw.js") || scriptURL.includes("service-worker");
      })
      .map((registration) => registration.unregister()),
  );
}

/**
 * Rejestruje Service Worker (produkcja) albo czyści stary SW (preview).
 * Wywołuj raz przy starcie aplikacji (np. w __root.tsx).
 */
export async function registerOfflineSupport() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;

  if (isPreviewContext()) {
    await unregisterAppWorker();
    return;
  }

  try {
    registerSW({
      immediate: true,
      onRegisteredSW(swUrl, registration) {
        if (import.meta.env.DEV) {
          console.info("[PWA] SW registered", swUrl, registration?.scope);
        }
      },
      onRegisterError(error) {
        console.warn("[PWA] SW register failed", error);
      },
    });
  } catch (e) {
    console.warn("[PWA] registerSW error", e);
  }
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === "undefined") return false;
  const mq = window.matchMedia("(display-mode: standalone)").matches;
  const ios = ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone) === true;
  return mq || ios;
}
