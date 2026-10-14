import { Download, Printer } from "lucide-react";
import { useMemo } from "react";
import { voucherSvg } from "@/lib/voucher";
import { cn } from "@/lib/utils";

type Props = {
  amount: number | null;
  to: string;
  message: string;
  code?: string | undefined;
  className?: string;
};

const dataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

export function VoucherCard({ amount, to, message, code, className }: Props) {
  const svg = useMemo(() => voucherSvg({ amount, to, message, code }), [amount, to, message, code]);
  return (
    <img
      src={dataUri(svg)}
      width={800}
      height={500}
      alt={`Cadeaubon van ${amount === null ? "…" : `€${amount}`} ${to ? `voor ${to}` : ""}${message ? `: ${message}` : ""}`}
      className={cn("aspect-[8/5] w-full rounded-3xl shadow-lift", className)}
    />
  );
}

/** Download als PNG (via canvas) of print de bon. Alleen bedoeld voor een betaalde bon met code. */
export function VoucherActions({ amount, to, message, code }: Props) {
  const svg = voucherSvg({ amount, to, message, code });
  const download = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1000;
      canvas.getContext("2d")?.drawImage(img, 0, 0, 1600, 1000);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `cadeaubon-${code ?? "goedkopeschoenen"}.png`;
      a.click();
    };
    img.src = dataUri(svg);
  };
  const print = () => {
    const w = window.open("", "_blank", "width=900,height=640");
    if (!w) return;
    w.document.write(
      `<!doctype html><title>Cadeaubon</title><style>body{margin:0;display:grid;place-items:center;min-height:100vh}img{width:90vw;max-width:900px}@page{size:landscape}</style><img src="${dataUri(svg)}" alt="Cadeaubon" onload="print()">`,
    );
    w.document.close();
  };
  const btn =
    "inline-flex h-11 items-center gap-2 rounded-full border border-ink px-5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white active:scale-[0.98]";
  return (
    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" onClick={download} className={btn}>
        <Download className="h-4 w-4" aria-hidden="true" /> Download als afbeelding
      </button>
      <button type="button" onClick={print} className={btn}>
        <Printer className="h-4 w-4" aria-hidden="true" /> Print de bon
      </button>
    </div>
  );
}
