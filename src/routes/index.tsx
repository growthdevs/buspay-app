import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aplicativo Buspay" },
      { name: "description", content: "Aplicativo Buspay" },
      { property: "og:title", content: "Aplicativo Buspay" },
      { property: "og:description", content: "Aplicativo Buspay" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <div className="min-h-screen bg-background" />;
}
