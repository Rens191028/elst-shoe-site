import { createFileRoute, redirect } from "@tanstack/react-router";

// Favorieten bestaan alleen met een account; /account stuurt zonder login door naar /inloggen.
export const Route = createFileRoute("/favorieten")({
  beforeLoad: () => {
    throw redirect({ to: "/account/favorieten" });
  },
});
