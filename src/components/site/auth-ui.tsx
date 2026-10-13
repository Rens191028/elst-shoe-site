import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "h-12 w-full rounded-lg border border-border bg-white px-3.5 text-sm outline-none transition focus:border-ink focus:ring-4 focus:ring-primary/15";

export function AuthShell({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto flex max-w-md flex-col px-4 py-14 md:py-20">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
      {intro && <div className="mt-3 text-muted-foreground">{intro}</div>}
      <div className="mt-8 rounded-2xl border border-border bg-white p-6 md:p-8">{children}</div>
    </section>
  );
}

export function Field({
  label,
  id,
  hint,
  children,
}: {
  label: string;
  id: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FormError({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p
      role="alert"
      className="rounded-lg border border-primary/30 bg-primary/5 px-3.5 py-2.5 text-sm text-primary-hover"
    >
      {children}
    </p>
  );
}

export function SubmitButton({
  busy,
  children,
  className,
}: {
  busy?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={busy}
      className={cn(
        "flex h-12 w-full items-center justify-center rounded-full bg-cta font-semibold text-white transition duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0",
        className,
      )}
    >
      {busy ? "Even geduld…" : children}
    </button>
  );
}
