import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Field, FormError, inputCls, SubmitButton } from "@/components/site/auth-ui";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account/gegevens")({ component: Details });

const profileSchema = z.object({
  full_name: z.string().trim().max(120),
  phone: z.string().trim().max(30),
  street: z.string().trim().max(160),
  postcode: z.string().trim().max(12),
  city: z.string().trim().max(80),
});
const passwordSchema = z
  .object({
    password: z.string().min(8, "Je wachtwoord moet minimaal 8 tekens hebben.").max(72),
    again: z.string(),
  })
  .refine((v) => v.password === v.again, {
    message: "De wachtwoorden komen niet overeen.",
    path: ["again"],
  });

type Profile = z.infer<typeof profileSchema>;
const empty: Profile = { full_name: "", phone: "", street: "", postcode: "", city: "" };

function Details() {
  const { user, updatePassword } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwDone, setPwDone] = useState(false);
  const [pwBusy, setPwBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase
      .from("profiles")
      .select("full_name,phone,street,postcode,city")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!active) return;
        setProfile({
          full_name:
            data?.full_name ?? (user.user_metadata?.["full_name"] as string | undefined) ?? "",
          phone: data?.phone ?? "",
          street: data?.street ?? "",
          postcode: data?.postcode ?? "",
          city: data?.city ?? "",
        });
      });
    return () => {
      active = false;
    };
  }, [user]);

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = profileSchema.safeParse(fd);
    if (!parsed.success) return setError("Controleer je gegevens: een veld is te lang.");
    setBusy(true);
    setError("");
    setSaved(false);
    const v = parsed.data;
    const { error: err } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: v.full_name || null,
      phone: v.phone || null,
      street: v.street || null,
      postcode: v.postcode || null,
      city: v.city || null,
    });
    setBusy(false);
    if (err) setError("Opslaan is niet gelukt. Probeer het later opnieuw.");
    else {
      setSaved(true);
      setProfile(v);
    }
  };

  const savePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const parsed = passwordSchema.safeParse({
      password: fd.get("password"),
      again: fd.get("again"),
    });
    if (!parsed.success)
      return setPwError(parsed.error.issues[0]?.message ?? "Controleer je wachtwoord.");
    setPwBusy(true);
    setPwError("");
    setPwDone(false);
    const err = await updatePassword(parsed.data.password);
    setPwBusy(false);
    if (err) setPwError(err);
    else {
      setPwDone(true);
      form.reset();
    }
  };

  if (!user || !profile)
    return (
      <p className="text-muted-foreground" aria-busy="true">
        Laden…
      </p>
    );
  const p = profile ?? empty;

  return (
    <div className="space-y-10">
      <form
        key={JSON.stringify(p)}
        onSubmit={saveProfile}
        className="max-w-xl space-y-5"
        noValidate
      >
        <h2 className="font-display text-2xl font-bold">Mijn gegevens</h2>
        <FormError>{error}</FormError>
        {saved && (
          <p role="status" className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm font-medium">
            Je gegevens zijn opgeslagen.
          </p>
        )}
        <Field
          label="E-mailadres"
          id="email"
          hint="Neem contact met ons op als je je e-mailadres wilt wijzigen."
        >
          <input
            id="email"
            value={user.email ?? ""}
            readOnly
            className={`${inputCls} bg-secondary text-muted-foreground`}
          />
        </Field>
        <Field label="Naam" id="full_name">
          <input
            id="full_name"
            name="full_name"
            defaultValue={p.full_name}
            autoComplete="name"
            className={inputCls}
          />
        </Field>
        <Field label="Telefoon" id="phone">
          <input
            id="phone"
            name="phone"
            defaultValue={p.phone}
            autoComplete="tel"
            className={inputCls}
          />
        </Field>
        <Field label="Straat en huisnummer" id="street">
          <input
            id="street"
            name="street"
            defaultValue={p.street}
            autoComplete="street-address"
            className={inputCls}
          />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Postcode" id="postcode">
            <input
              id="postcode"
              name="postcode"
              defaultValue={p.postcode}
              autoComplete="postal-code"
              className={inputCls}
            />
          </Field>
          <Field label="Woonplaats" id="city">
            <input
              id="city"
              name="city"
              defaultValue={p.city}
              autoComplete="address-level2"
              className={inputCls}
            />
          </Field>
        </div>
        <SubmitButton busy={busy} className="sm:w-auto sm:px-8">
          Gegevens opslaan
        </SubmitButton>
      </form>

      <form
        onSubmit={savePassword}
        className="max-w-xl space-y-5 border-t border-border pt-10"
        noValidate
      >
        <h2 className="font-display text-2xl font-bold">Wachtwoord wijzigen</h2>
        <FormError>{pwError}</FormError>
        {pwDone && (
          <p role="status" className="rounded-lg bg-secondary px-3.5 py-2.5 text-sm font-medium">
            Je wachtwoord is gewijzigd.
          </p>
        )}
        <Field label="Nieuw wachtwoord" id="password" hint="Minimaal 8 tekens.">
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            className={inputCls}
          />
        </Field>
        <Field label="Herhaal nieuw wachtwoord" id="again">
          <input
            id="again"
            name="again"
            type="password"
            autoComplete="new-password"
            className={inputCls}
          />
        </Field>
        <SubmitButton busy={pwBusy} className="sm:w-auto sm:px-8">
          Wachtwoord opslaan
        </SubmitButton>
      </form>
    </div>
  );
}
