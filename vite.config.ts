// @lovable.dev/vite-tanstack-config already includes TanStack / React / Tailwind plugins.
// Nie duplikuj ich tutaj.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  vite: {
    plugins: [
      VitePWA({
        strategies: "generateSW",
        registerType: "autoUpdate",
        // Rejestracja SW po naszej stronie (src/lib/pwa.ts) – nie wstrzykuj automatycznie
        injectRegister: false,
        filename: "sw.js",
        // Manifest trzymamy w public/manifest.webmanifest (pełna kontrola ścieżek ikon)
        manifest: false,
        includeAssets: [
          "favicon.ico",
          "icons/icon-192.png",
          "icons/icon-512.png",
          "icons/icon-192-maskable.png",
          "icons/icon-512-maskable.png",
          "icons/apple-touch-icon.png",
          "manifest.webmanifest",
        ],
        devOptions: {
          enabled: false,
        },
        workbox: {
          // precache zbudowanych assetów + shell
          globPatterns: ["**/*.{js,css,html,ico,png,svg,webp,woff2,webmanifest}"],
          navigateFallback: "/",
          navigateFallbackDenylist: [/^\/~oauth(?:\/|$)/, /^\/api(?:\/|$)/],
          runtimeCaching: [
            {
              urlPattern: ({ request, url }) =>
                request.mode === "navigate" && !url.pathname.startsWith("/~oauth"),
              handler: "NetworkFirst",
              options: {
                cacheName: "trening-pages-v2",
                networkTimeoutSeconds: 4,
              },
            },
            {
              urlPattern: ({ request, url }) =>
                url.origin === self.location.origin &&
                request.destination !== "document" &&
                /\.(?:js|css|woff2?|png|jpg|jpeg|webp|svg|ico)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "trening-assets-v2",
                expiration: {
                  maxEntries: 120,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
              },
            },
          ],
        },
      }),
    ],
  },
  tanstackStart: {
    server: { entry: "server" },
  },
});
