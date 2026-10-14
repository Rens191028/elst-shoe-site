import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { CartProvider } from "@/lib/cart";
import { AuthProvider } from "@/lib/auth";
import { FavoritesProvider } from "@/lib/favorites";
import { ShopperProvider } from "@/lib/shopper";
import { CompareTray } from "@/components/site/shopper-ui";
import { RippleInit, ScrollProgress } from "@/components/site/motion-extras";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CartDrawer } from "@/components/site/cart";
import { IconSneaker } from "@/components/site/icons";
import { ExitIntent } from "@/components/site/ExitIntent";
import { ShopAssistant } from "@/components/site/ShopAssistant";

function NotFoundComponent() {
  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-4 py-20">
      <div className="mesh" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>
      <div className="max-w-md text-center">
        <IconSneaker className="shoe-hop mx-auto h-14 w-14 text-primary" />
        <p className="mt-4 font-display text-8xl font-extrabold tracking-tight text-ink">
          4<span className="text-primary-text">0</span>4
        </p>
        <h1 className="mt-2 font-display text-2xl font-bold">Deze schoen past hier niet</h1>
        <p className="mt-2 text-muted-foreground">
          Deze pagina bestaat niet (meer). Geen zorgen: onze nieuwste collectie staat voor je klaar.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center rounded-full bg-cta px-7 py-3.5 font-semibold text-white transition hover:-translate-y-0.5 active:scale-[0.98]"
          >
            Terug naar de homepage
          </Link>
          <Link
            to="/collectie/$slug"
            params={{ slug: "nieuw" }}
            className="inline-flex items-center rounded-full border border-ink px-7 py-3.5 font-semibold text-ink transition hover:bg-ink hover:text-white"
          >
            Bekijk het nieuwste
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Deze pagina kon niet laden
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Er ging iets mis aan onze kant. Probeer het opnieuw of ga terug naar de homepage.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Opnieuw proberen
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Naar de homepage
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GoedkopeSchoenen.com — Betaalbare schoenen, tassen & accessoires" },
      {
        name: "description",
        content:
          "Trendy schoenen, tassen en accessoires vanaf €8,99. Op werkdagen voor 15:00 besteld, dezelfde dag verzonden. Gratis verzending vanaf €65.",
      },
      {
        property: "og:title",
        content: "GoedkopeSchoenen.com — Betaalbare schoenen, tassen & accessoires",
      },
      {
        property: "og:description",
        content:
          "Trendy schoenen, tassen en accessoires vanaf €8,99. Op werkdagen voor 15:00 besteld, dezelfde dag verzonden. Gratis verzending vanaf €65.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "GoedkopeSchoenen.com" },
      { property: "og:locale", content: "nl_NL" },
      { property: "og:image", content: "https://goedkopeschoenen.com/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "GoedkopeSchoenen.com: betaalbare schoenen, tassen en accessoires",
      },
      { name: "twitter:image", content: "https://goedkopeschoenen.com/og-image.png" },
      { name: "theme-color", content: "#fafaf8" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..125,600..800&family=Inter:wght@400;500;600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <FavoritesProvider>
          <ShopperProvider>
            <CartProvider>
              <a
                href="#main"
                className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
              >
                Meteen naar de content
              </a>
              <ScrollProgress />
              <RippleInit />
              <Header />
              <main id="main">
                {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
                <Outlet />
              </main>
              <Footer />
              <CartDrawer />
              <CompareTray />
              <ExitIntent />
              <ShopAssistant />
            </CartProvider>
          </ShopperProvider>
        </FavoritesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
