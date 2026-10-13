import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, Field, FormError, inputCls, SubmitButton } from "@/components/site/auth-ui";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/wachtwoord-vergeten")({
  head: () => ({
    meta: [
      { title: "Wachtwoord vergeten — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const { sendPasswordReset } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const parsed = z
      .string()
      .trim()
      .email("Vul een geldig e-mailadres in.")
      .safeParse(new FormData(e.currentTarget).get("email"));
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? "Controleer je e-mailadres.");
    setBusy(true);
    setError("");
    const err = await sendPasswordReset(parsed.data);
    setBusy(false);
    if (err) setError(err);
    else setSent(true);
  };

  return (
    <AuthShell
      title="Wachtwoord vergeten"
      intro={<p>Vul je e-mailadres in. Je ontvangt een link om een nieuw wachtwoord te kiezen.</p>}
    >
      {sent ? (
        <p role="status" className="text-muted-foreground">
          Staat dit e-mailadres bij ons bekend, dan ontvang je binnen enkele minuten een mail met
          een resetlink. Kijk ook in je spam.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <FormError>{error}</FormError>
          <Field label="E-mailadres" id="email">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputCls}
            />
          </Field>
          <SubmitButton busy={busy}>Verstuur resetlink</SubmitButton>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link
          to="/inloggen"
          className="font-semibold underline underline-offset-4 hover:text-primary"
        >
          Terug naar inloggen
        </Link>
      </p>
    </AuthShell>
  );
}
