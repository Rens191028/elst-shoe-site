import { useRouter } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Ctx = {
  /** product-handles van de ingelogde gebruiker; leeg als niet ingelogd */
  handles: string[];
  loading: boolean;
  has: (handle: string) => boolean;
  /** Zonder account: stuurt door naar /inloggen en onthoudt het product. */
  toggle: (handle: string) => Promise<void>;
};

const FavoritesContext = createContext<Ctx | null>(null);
const PENDING_KEY = "gs-pending-favorite";

function readPending(): string | null {
  try {
    return sessionStorage.getItem(PENDING_KEY);
  } catch {
    return null;
  }
}
function writePending(handle: string | null) {
  try {
    if (handle) sessionStorage.setItem(PENDING_KEY, handle);
    else sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* sessionStorage niet beschikbaar */
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [handles, setHandles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = user?.id ?? null;
  const current = useRef<string | null>(null);
  current.current = userId;

  // Favorieten laden bij inloggen; en een eventueel onthouden favoriet alsnog opslaan.
  useEffect(() => {
    if (!userId) {
      setHandles([]);
      return;
    }
    let active = true;
    setLoading(true);
    (async () => {
      const pending = readPending();
      if (pending) {
        writePending(null);
        await supabase
          .from("favorites")
          .upsert(
            { user_id: userId, product_handle: pending },
            { onConflict: "user_id,product_handle", ignoreDuplicates: true },
          );
      }
      const { data } = await supabase
        .from("favorites")
        .select("product_handle")
        .order("created_at", { ascending: false });
      if (active && current.current === userId)
        setHandles((data ?? []).map((r) => r.product_handle));
    })()
      .catch(() => undefined)
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [userId]);

  const toggle = useCallback(
    async (handle: string) => {
      if (!userId) {
        writePending(handle);
        const here = router.state.location.pathname + router.state.location.searchStr;
        void router.navigate({ to: "/inloggen", search: { redirect: here, reden: "favorieten" } });
        return;
      }
      const has = handles.includes(handle);
      setHandles((cur) => (has ? cur.filter((h) => h !== handle) : [handle, ...cur])); // optimistisch
      const { error } = has
        ? await supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_handle", handle)
        : await supabase.from("favorites").insert({ user_id: userId, product_handle: handle });
      if (error) setHandles((cur) => (has ? [handle, ...cur] : cur.filter((h) => h !== handle))); // terugdraaien
    },
    [userId, handles, router],
  );

  const value = useMemo<Ctx>(
    () => ({ handles, loading, has: (h) => handles.includes(h), toggle }),
    [handles, loading, toggle],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites moet binnen FavoritesProvider gebruikt worden");
  return ctx;
}
