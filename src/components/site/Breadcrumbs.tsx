import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type Crumb = { label: string; to?: string; slug?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav
      aria-label="Kruimelpad"
      className="mx-auto max-w-7xl px-4 pt-6 text-sm text-muted-foreground lg:px-6"
    >
      <ol className="flex flex-wrap items-center gap-1">
        <li>
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-1">
            <ChevronRight className="h-3.5 w-3.5" />
            {c.slug ? (
              <Link to="/collectie/$slug" params={{ slug: c.slug }} className="hover:text-ink">
                {c.label}
              </Link>
            ) : (
              <span
                className={i === items.length - 1 ? "font-medium text-ink" : ""}
                aria-current={i === items.length - 1 ? "page" : undefined}
              >
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
