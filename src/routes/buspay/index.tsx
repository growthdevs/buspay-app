import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/buspay/")({
  beforeLoad: () => {
    throw redirect({ to: "/buspay/home" });
  },
});
