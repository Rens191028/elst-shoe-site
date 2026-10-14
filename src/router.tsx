import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { BrandLoader } from "@/components/site/brand";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultViewTransition: true, // zachte cross-fade tussen pagina's
    defaultPreloadStaleTime: 0,
    defaultPendingComponent: BrandLoader,
    defaultPendingMs: 400, // alleen bij merkbaar traag laden tonen
  });

  return router;
};
