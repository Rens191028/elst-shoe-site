import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("logo-bars flex h-7 items-end gap-[3px]", className)} aria-hidden="true">
      <span className="h-3 bg-primary" />
      <span className="h-5 bg-ink" />
      <span className="h-7 bg-ink" />
    </span>
  );
}

/** `compactOnMobile`: onder 640px alleen het icoon (ruimte voor de winkelwagenbalk in de header). */
export function Logo({
  className,
  compactOnMobile,
}: {
  className?: string;
  compactOnMobile?: boolean;
}) {
  return (
    <Link
      to="/"
      aria-label="GoedkopeSchoenen — naar de homepage"
      className={cn("logo-link flex items-center gap-2 sm:gap-2.5", className)}
    >
      <LogoMark />
      <span
        className={cn(
          "font-display text-[0.92rem] font-extrabold tracking-tight text-ink sm:text-[1.15rem]",
          compactOnMobile && "max-sm:hidden",
        )}
      >
        GoedkopeSchoenen
      </span>
    </Link>
  );
}
