import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/buspay")({
  beforeLoad: () => {
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem("buspay.autenticado") !== "1") {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
