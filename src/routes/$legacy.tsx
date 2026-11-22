import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/$legacy")({
  beforeLoad: ({ params }) => {
    if (params.legacy !== "index") throw notFound();
    throw redirect({ to: "/", replace: true });
  },
  head: () => ({ meta: [
    { title: "Otwieranie dziennika treningowego" },
    { name: "description", content: "Przejście do dziennika treningów, serii i ciężarów." },
    { property: "og:title", content: "Otwieranie dziennika treningowego" },
    { property: "og:description", content: "Przejście do dziennika treningów, serii i ciężarów." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
});