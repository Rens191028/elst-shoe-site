import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { AuthShell, Field, FormError, inputCls, SubmitButton } from "@/components/site/auth-ui";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/wachtwoord-resetten")({
  head: () => ({
    meta: [
      { title: "Nieuw wachtwoord — GoedkopeSchoenen.com" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Reset,
});

const schema = z
  .object({
    password: z.string().min(8, "Je wachtwoord moet minimaal 8 tekens hebben.").max(72),
    again: z.string(),
  })
  .refine((v) => v.password === v.again, {
    message: "De wachtwoorden komen niet overeen.",
    path: ["again"],
  });

function Reset() {
  const { user, loading, updatePassword } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({ password: fd.get("password"), again: fd.get("again") });
    if (!parsed.success)
      return setError(parsed.error.issues[0]?.message ?? "Controleer je wachtwoord.");
    setBusy(true);
    setError("");
    const err = await updatePassword(parsed.data.password);
    setBusy(false);
    if (err) setError(err);
    else void router.navigate({ to: "/account" });
  };

  // De resetlink uit de mail logt de gebruiker tijdelijk in; zonder geldige link is er geen sessie.
  if (!loading && !user)
    return (
      <AuthShell title="Link verlopen">
        <p className="text-muted-foreground">
          Deze resetlink is niet (meer) geldig. Vraag een nieuwe aan.
        </p>
        <Link
          to="/wachtwoord-vergeten"
          className="mt-6 flex h-12 items-center justify-center rounded-full bg-cta font-semibold text-white transition"
        >
          Nieuwe link aanvragen
        </Link>
      </AuthShell>
    );

  return (
    <AuthShell title="Nieuw wachtwoord" intro={<p>Kies een nieuw wachtwoord voor je account.</p>}>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError>{error}</FormError>
        <Field label="Nieuw wachtwoord" id="password" hint="Minimaal 8 tekens.">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            className={inputCls}
          />
        </Field>
        <Field label="Herhaal wachtwoord" id="again">
          <input
            id="again"
            name="again"
            type="password"
            autoComplete="new-password"
            required
            className={inputCls}
          />
        </Field>
        <SubmitButton busy={busy}>Wachtwoord opslaan</SubmitButton>
      </form>
    </AuthShell>
  );
}
