import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Phone, Send, X, Footprints } from "lucide-react";
import { getProduct, money, searchProducts, type Product } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { ANNOUNCEMENTS, SITE } from "@/lib/site";
import { Photo } from "@/components/site/product";
import { cn } from "@/lib/utils";

// "Veter": regelgebaseerde winkelassistent, geen taalmodel of externe API.
type Msg = {
  id: number;
  from: "bot" | "user";
  text: string;
  products?: string[];
  sizesFor?: string;
  contact?: boolean;
};

const ORDER_RE =
  /\b(voeg\b.*\btoe|toevoegen|bestel|bestellen|doe (mij|maar)|in (mijn |de )?(winkel)?wagen|neem (ik|deze|die)|wil (ik )?(deze|die|hem|haar))/;
const ORDINALS: [RegExp, number][] = [
  [/\b(eerste|1e|nummer 1|#1)\b/, 0],
  [/\b(tweede|2e|nummer 2|#2)\b/, 1],
  [/\b(derde|3e|nummer 3|#3)\b/, 2],
  [/\b(vierde|4e|nummer 4|#4)\b/, 3],
];

const INFO: { re: RegExp; text: string }[] = [
  {
    re: /verzend|verzending|bezorg|levertijd|lever|wanneer (komt|binnen)|verzendkosten|pakket/,
    text: `Bestel je op werkdagen vóór 15:00, dan versturen we je pakket dezelfde dag. Verzending kost ${money(SITE.shippingCost)} en is gratis vanaf ${money(SITE.freeShippingFrom)}.`,
  },
  {
    re: /retour|terugsturen|ruilen|omruilen|terug sturen|geld terug/,
    text: "Past het niet of vind je het toch niks? Je hebt 30 dagen om je bestelling te retourneren.",
  },
  {
    re: /betal|klarna|ideal|achteraf|creditcard|bancontact/,
    text: "Je kunt achteraf betalen met Klarna. Zo betaal je pas als je je bestelling binnen hebt.",
  },
  {
    re: /contact|bellen|telefoon|whatsapp|mail|adres|bereik|klantenservice|spreken/,
    text: `Je bereikt ons via ${SITE.phone}, WhatsApp of ${SITE.email}. Je vindt ons op ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city}.`,
  },
];

const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

function findSize(text: string, p: Product) {
  const nums = text.match(/\d{2}(?:[.,]5)?/g) ?? [];
  for (const n of nums) {
    const s = n.replace(",", ".");
    const hit = p.m.find((m) => m.replace(",", ".") === s);
    if (hit) return hit;
  }
  return p.m.find((m) => new RegExp(`\\b${m.replace(".", "\\.")}\\b`, "i").test(text));
}

export function ShopAssistant() {
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      id: 0,
      from: "bot",
      text: "Hoi! Ik ben Veter 👟 Zoek je iets? Typ bijvoorbeeld “zwarte laarzen onder €40”, of vraag me naar verzending, retour of betalen.",
    },
  ]);
  const [shown, setShown] = useState<string[]>([]);
  const [pending, setPending] = useState<string | null>(null);
  const idRef = useRef(1);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, open]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const bot = (m: Omit<Msg, "id" | "from">): Msg => ({ id: idRef.current++, from: "bot", ...m });

  const addToCart = (p: Product, size: string): Msg => {
    add(p.h, size);
    setPending(null);
    return bot({
      text: `Top! ${p.t}${size ? ` in maat ${size}` : ""} zit in je winkelwagen. Kan ik je nog ergens mee helpen?`,
    });
  };

  const askSize = (p: Product): Msg => {
    setPending(p.h);
    return bot({ text: `Welke maat wil je voor ${p.t}?`, sizesFor: p.h });
  };

  const respond = (raw: string): Msg => {
    const q = norm(raw);

    // 1. Wacht op een maat voor een gekozen product
    if (pending) {
      const p = getProduct(pending);
      if (p) {
        const size = findSize(q, p);
        if (size) return addToCart(p, size);
        if (/^\s*(maat\s*)?\d{2}/.test(q))
          return bot({
            text: `Die maat hebben we helaas niet van dit product. Kies een van deze:`,
            sizesFor: p.h,
          });
      }
    }

    // 2. Bestel-/toevoeg-intentie op een getoond product
    if (ORDER_RE.test(q)) {
      if (!shown.length)
        return bot({
          text: "Welk product wil je bestellen? Zoek eerst even, bijvoorbeeld “witte sneakers”.",
        });
      let target: Product | undefined;
      const ord = ORDINALS.find(([re]) => re.test(q));
      if (ord) target = getProduct(shown[ord[1]] ?? "");
      if (!target) {
        target = shown
          .map((h) => getProduct(h))
          .find(
            (p) =>
              p &&
              norm(p.t)
                .split(/\s+/)
                .some((w) => w.length > 3 && q.includes(w)),
          );
      }
      if (!target && pending) target = getProduct(pending);
      if (!target && shown.length === 1) target = getProduct(shown[0]!);
      if (!target)
        return bot({
          text: "Welke bedoel je? Zeg bijvoorbeeld “voeg de eerste toe”, of tik op een kaartje.",
          products: shown,
        });
      if (!target.s) return bot({ text: `${target.t} is helaas uitverkocht.` });
      if (!target.m.length) return addToCart(target, "");
      const size = findSize(q, target);
      return size ? addToCart(target, size) : askSize(target);
    }

    // 3. Vaste winkelinfo
    const infos = INFO.filter((i) => i.re.test(q));
    if (infos.length)
      return bot({
        text: infos.map((i) => i.text).join("\n\n"),
        contact: infos.some((i) => i.text.includes(SITE.phone)),
      });

    // 4. Productvraag
    const res = searchProducts(raw);
    if (res.results.length) {
      const top = res.results.slice(0, 4).map((p) => p.h);
      setShown(top);
      setPending(null);
      return bot({
        text: `Ik vond ${res.results.length} ${res.results.length === 1 ? "product" : "producten"}. Dit zijn de beste matches:`,
        products: top,
      });
    }

    // 5. Onbekend
    return bot({
      text: "Dat weet ik helaas niet. Bel of WhatsApp ons gerust, dan helpen we je persoonlijk.",
      contact: true,
    });
  };

  const send = (text: string) => {
    const t = text.trim();
    if (!t) return;
    const user: Msg = { id: idRef.current++, from: "user", text: t };
    const reply = respond(t);
    setMsgs((m) => [...m, user, reply]);
    setInput("");
    inputRef.current?.focus();
  };

  const pickSize = (h: string, size: string) => {
    const p = getProduct(h);
    if (!p) return;
    const user: Msg = { id: idRef.current++, from: "user", text: `Maat ${size}` };
    setMsgs((m) => [...m, user, addToCart(p, size)]);
  };

  const pickProduct = (h: string) => {
    const p = getProduct(h);
    if (!p) return;
    const user: Msg = { id: idRef.current++, from: "user", text: `Voeg ${p.t} toe` };
    const reply = !p.s
      ? bot({ text: `${p.t} is helaas uitverkocht.` })
      : p.m.length
        ? askSize(p)
        : addToCart(p, "");
    setMsgs((m) => [...m, user, reply]);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="Veter, je winkelassistent"
          className="fixed inset-x-3 bottom-24 z-[60] flex max-h-[min(640px,calc(100dvh-8rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300 motion-reduce:animate-none sm:inset-x-auto sm:right-5 sm:w-[380px]"
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-cta text-primary-foreground">
              <Footprints className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-extrabold">Veter</p>
              <p className="text-xs text-muted-foreground">Je winkelassistent</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Chat sluiten"
              className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "user" && "justify-end")}>
                <div className={cn("max-w-[88%] space-y-2", m.from === "user" && "max-w-[80%]")}>
                  <p
                    className={cn(
                      "whitespace-pre-line text-sm leading-relaxed",
                      m.from === "user"
                        ? "rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-background"
                        : "text-foreground",
                    )}
                  >
                    {m.text}
                  </p>
                  {m.products && (
                    <div className="grid grid-cols-2 gap-2">
                      {m.products.map((h) => {
                        const p = getProduct(h);
                        return p ? <MiniCard key={h} p={p} onAdd={() => pickProduct(h)} onNav={() => setOpen(false)} /> : null;
                      })}
                    </div>
                  )}
                  {m.sizesFor && (
                    <div className="flex flex-wrap gap-1.5">
                      {getProduct(m.sizesFor)?.m.map((s) => (
                        <button
                          key={s}
                          onClick={() => pickSize(m.sizesFor!, s)}
                          className="min-w-10 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                  {m.contact && (
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={SITE.phoneHref}
                        className="inline-flex items-center gap-1.5 rounded-full bg-cta px-3.5 py-2 text-xs font-semibold text-primary-foreground"
                      >
                        <Phone className="h-3.5 w-3.5" /> Bel {SITE.phone}
                      </a>
                      <a
                        href={SITE.whatsappHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-2 text-xs font-semibold transition-colors hover:border-primary hover:text-primary"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {msgs.length === 1 && (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {["Witte sneakers", "Verzending", "Retourneren", "Achteraf betalen"].map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Typ je vraag…"
              aria-label="Je bericht"
              className="h-10 min-w-0 flex-1 rounded-full border border-input bg-background px-4 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              aria-label="Versturen"
              disabled={!input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cta text-primary-foreground transition-opacity disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
          <p className="sr-only">{ANNOUNCEMENTS.join(". ")}</p>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Chat sluiten" : "Chat met Veter, je winkelassistent"}
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-cta text-primary-foreground shadow-xl transition-transform duration-200 hover:scale-105 motion-reduce:transition-none"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </>
  );
}

function MiniCard({ p, onAdd, onNav }: { p: Product; onAdd: () => void; onNav: () => void }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <Link to="/products/$handle" params={{ handle: p.h }} onClick={onNav} className="block">
        <Photo product={p} width={240} sizes="160px" className="aspect-[4/5] w-full object-cover" />
      </Link>
      <div className="space-y-1 p-2">
        <p className="line-clamp-2 text-xs font-medium leading-snug">{p.t}</p>
        <p className="text-xs">
          <span className="font-bold">{money(p.p)}</span>
          {p.w && <span className="ml-1 text-muted-foreground line-through">{money(p.w)}</span>}
        </p>
        <p className={cn("text-[11px]", p.s ? "text-muted-foreground" : "text-primary")}>
          {p.s ? "Op voorraad" : "Uitverkocht"}
        </p>
        {p.s && (
          <button
            onClick={onAdd}
            className="mt-1 w-full rounded-full bg-foreground py-1.5 text-[11px] font-semibold text-background transition-opacity hover:opacity-85"
          >
            Toevoegen
          </button>
        )}
      </div>
    </div>
  );
}
