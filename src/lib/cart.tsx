import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, shippingFor, type Product } from "@/lib/catalog";

export type CartLine = { h: string; size: string; qty: number };
export type DetailedLine = CartLine & { product: Product };

type Ctx = {
  lines: DetailedLine[];
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  open: boolean;
  /** Telt op bij elk toevoegen (niet bij aantal wijzigen); de header animeert hierop. */
  addTick: number;
  setOpen: (v: boolean) => void;
  add: (h: string, size: string, qty?: number) => void;
  setQty: (h: string, size: string, qty: number) => void;
  remove: (h: string, size: string) => void;
  clear: () => void;
};

const CartContext = createContext<Ctx | null>(null);
const CART_KEY = "gs-cart-v1";

function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* opslag niet beschikbaar: winkelwagen blijft in het geheugen */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [raw, setRaw] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [addTick, setAddTick] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRaw(load<CartLine[]>(CART_KEY, []).filter((l) => getProduct(l.h)));
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready) save(CART_KEY, raw);
  }, [raw, ready]);

  const add = useCallback((h: string, size: string, qty = 1) => {
    setRaw((cur) => {
      const i = cur.findIndex((l) => l.h === h && l.size === size);
      if (i >= 0)
        return cur.map((l, idx) => (idx === i ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
      return [...cur, { h, size, qty }];
    });
    setAddTick((t) => t + 1); // de header bevestigt het toevoegen; de lade opent niet meer vanzelf
  }, []);
  const setQty = useCallback((h: string, size: string, qty: number) => {
    setRaw((cur) =>
      cur.flatMap((l) =>
        l.h === h && l.size === size ? (qty <= 0 ? [] : [{ ...l, qty: Math.min(10, qty) }]) : [l],
      ),
    );
  }, []);
  const remove = useCallback(
    (h: string, size: string) =>
      setRaw((cur) => cur.filter((l) => !(l.h === h && l.size === size))),
    [],
  );
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<Ctx>(() => {
    const lines = raw.flatMap((l) => {
      const product = getProduct(l.h);
      return product ? [{ ...l, product }] : [];
    });
    const subtotal = Math.round(lines.reduce((s, l) => s + l.product.p * l.qty, 0) * 100) / 100;
    const shipping = shippingFor(subtotal);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      shipping,
      total: Math.round((subtotal + shipping) * 100) / 100,
      open,
      addTick,
      setOpen,
      add,
      setQty,
      remove,
      clear,
    };
  }, [raw, open, addTick, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart moet binnen CartProvider gebruikt worden");
  return ctx;
}
