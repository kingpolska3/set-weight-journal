import { registerSW } from "virtual:pwa-register";

const APP_SW_PATH = "/sw.js";

function isPreviewContext() {
  const hostname = window.location.hostname;
  return (
    !import.meta.env.PROD ||
    window.self !== window.top ||
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
        const scriptURL = registration.active?.scriptURL ?? registration.waiting?.scriptURL ?? "";
        return scriptURL.endsWith(APP_SW_PATH);
      })
      .map((registration) => registration.unregister()),
  );
}

export async function registerOfflineSupport() {
  if (!("serviceWorker" in navigator)) return;
  if (isPreviewContext()) {
    await unregisterAppWorker();
    return;
  }
  registerSW({ immediate: true });
}