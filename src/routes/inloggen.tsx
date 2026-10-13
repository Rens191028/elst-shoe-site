import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AuthShell, Field, FormError, inputCls, SubmitButton } from "@/components/site/auth-ui";
import { safeRedirect, useAuth } from "@/lib/auth";

type Search = { redirect?: string | undefined; reden?: "favorieten" | undefined };

export const Route = createFileRoute("/inloggen")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["redirect"] === "string" ? { redirect: safeRedirect(s["redirect"]) } : {}),
    ...(s["reden"] === "favorieten" ? { reden: "favorieten" as const } : {}),
  }),
  head: () => ({
    meta: [{ title: "Inloggen — GoedkopeSchoenen.com" }, { name: "robots", content: "noindex" }],
  }),
  component: Login,
});

const schema = z.object({
  email: z.string().trim().email("Vul een geldig e-mailadres in."),
  password: z.string().min(1, "Vul je wachtwoord in."),
});

function Login() {
  const { redirect, reden } = Route.useSearch();
  const router = useRouter();
  const { user, signIn } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const target = safeRedirect(redirect);

  // Al ingelogd (of net ingelogd): door naar de bestemming.
  useEffect(() => {
    if (user) void router.navigate({ href: target, replace: true });
  }, [user, target, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ email: fd.get("email"), password: fd.get("password") });
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? "Controleer je gegevens.");
    setBusy(true);
    setError("");
    const err = await signIn(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (err) setError(err);
  };

  return (
    <AuthShell
      title="Inloggen"
      intro={
        reden === "favorieten" ? (
          <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-ink">
            <strong>Log in om favorieten op te slaan.</strong> Na het inloggen bewaren we je product
            direct.
          </p>
        ) : (
          <p>Welkom terug! Log in om je bestellingen en favorieten te bekijken.</p>
        )
      }
    >
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
        <Field label="Wachtwoord" id="password">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={inputCls}
          />
        </Field>
        <div className="text-right text-sm">
          <Link
            to="/wachtwoord-vergeten"
            className="font-medium underline underline-offset-4 hover:text-primary"
          >
            Wachtwoord vergeten?
          </Link>
        </div>
        <SubmitButton busy={busy}>Inloggen</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nog geen account?{" "}
        <Link
          to="/registreren"
          search={{ ...(redirect ? { redirect } : {}), ...(reden ? { reden } : {}) }}
          className="font-semibold text-ink underline underline-offset-4 hover:text-primary"
        >
          Registreren
        </Link>
      </p>
    </AuthShell>
  );
}
