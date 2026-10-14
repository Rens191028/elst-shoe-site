import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct } from "@/lib/catalog";

/** Vergelijklijst (max 3) en recent bekeken producten; alles blijft lokaal in de browser. */
export const MAX_COMPARE = 3;
const MAX_RECENT = 8;
const COMPARE_KEY = "gs-compare-v1";
const RECENT_KEY = "gs-recent-v1";

type Ctx = {
  compare: string[];
  inCompare: (h: string) => boolean;
  /** Geeft false terug als de lijst vol is en het product niet is toegevoegd. */
  toggleCompare: (h: string) => boolean;
  clearCompare: () => void;
  recent: string[];
  markViewed: (h: string) => void;
};

const ShopperContext = createContext<Ctx | null>(null);

function load(key: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(v)
      ? v.filter((h): h is string => typeof h === "string" && !!getProduct(h))
      : [];
  } catch {
    return [];
  }
}
function save(key: string, value: string[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* opslag niet beschikbaar */
  }
}

export function ShopperProvider({ children }: { children: ReactNode }) {
  const [compare, setCompare] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCompare(load(COMPARE_KEY).slice(0, MAX_COMPARE));
    setRecent(load(RECENT_KEY).slice(0, MAX_RECENT));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) save(COMPARE_KEY, compare);
  }, [compare, ready]);
  useEffect(() => {
    if (ready) save(RECENT_KEY, recent);
  }, [recent, ready]);

  const toggleCompare = useCallback(
    (h: string) => {
      if (compare.includes(h)) {
        setCompare((c) => c.filter((x) => x !== h));
        return true;
      }
      if (compare.length >= MAX_COMPARE) return false;
      setCompare((c) => [...c, h]);
      return true;
    },
    [compare],
  );
  const clearCompare = useCallback(() => setCompare([]), []);
  const markViewed = useCallback((h: string) => {
    setRecent((r) => (r[0] === h ? r : [h, ...r.filter((x) => x !== h)].slice(0, MAX_RECENT)));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      compare,
      inCompare: (h) => compare.includes(h),
      toggleCompare,
      clearCompare,
      recent,
      markViewed,
    }),
    [compare, toggleCompare, clearCompare, recent, markViewed],
  );
  return <ShopperContext.Provider value={value}>{children}</ShopperContext.Provider>;
}

export function useShopper() {
  const ctx = useContext(ShopperContext);
  if (!ctx) throw new Error("useShopper moet binnen ShopperProvider gebruikt worden");
  return ctx;
}
