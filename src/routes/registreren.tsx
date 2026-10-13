import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { AuthShell, Field, FormError, inputCls, SubmitButton } from "@/components/site/auth-ui";
import { safeRedirect, useAuth } from "@/lib/auth";

type Search = { redirect?: string | undefined; reden?: "favorieten" | undefined };

export const Route = createFileRoute("/registreren")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["redirect"] === "string" ? { redirect: safeRedirect(s["redirect"]) } : {}),
    ...(s["reden"] === "favorieten" ? { reden: "favorieten" as const } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Account aanmaken — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Register,
});

const schema = z.object({
  name: z.string().trim().min(2, "Vul je naam in.").max(120),
  email: z.string().trim().email("Vul een geldig e-mailadres in."),
  password: z.string().min(8, "Je wachtwoord moet minimaal 8 tekens hebben.").max(72),
});

function Register() {
  const { redirect, reden } = Route.useSearch();
  const router = useRouter();
  const { user, signUp } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const target = safeRedirect(redirect);

  useEffect(() => {
    if (user) void router.navigate({ href: target, replace: true });
  }, [user, target, router]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      name: fd.get("name"),
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? "Controleer je gegevens.");
    setBusy(true);
    setError("");
    const res = await signUp(parsed.data.name, parsed.data.email, parsed.data.password);
    setBusy(false);
    if (res.error) return setError(res.error);
    if (res.needsConfirmation) setConfirm(true); // anders logt de effect hierboven direct in
  };

  if (confirm)
    return (
      <AuthShell title="Check je mail">
        <p className="text-muted-foreground">
          We hebben een bevestigingslink gestuurd. Klik erop om je account te activeren en log
          daarna in.
        </p>
        <Link
          to="/inloggen"
          search={{ ...(redirect ? { redirect } : {}), ...(reden ? { reden } : {}) }}
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-ink font-semibold text-white transition hover:bg-primary"
        >
          Naar inloggen
        </Link>
      </AuthShell>
    );

  return (
    <AuthShell
      title="Account aanmaken"
      intro={
        reden === "favorieten" ? (
          <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-ink">
            <strong>Maak een account om favorieten op te slaan.</strong>
          </p>
        ) : (
          <p>Bewaar je favorieten, bekijk je bestellingen en bestel sneller.</p>
        )
      }
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Naam" id="name">
          <input id="name" name="name" autoComplete="name" required className={inputCls} />
        </Field>
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
        <Field label="Wachtwoord" id="password" hint="Minimaal 8 tekens.">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={inputCls}
          />
        </Field>
        <SubmitButton busy={busy}>Account aanmaken</SubmitButton>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Heb je al een account?{" "}
        <Link
          to="/inloggen"
          search={{ ...(redirect ? { redirect } : {}), ...(reden ? { reden } : {}) }}
          className="font-semibold text-ink underline underline-offset-4 hover:text-primary"
        >
          Inloggen
        </Link>
      </p>
    </AuthShell>
  );
}
