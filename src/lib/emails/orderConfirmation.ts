import { SITE } from "@/lib/site";

export type OrderEmailInput = {
  orderNumber: string;
  name?: string;
  digital?: boolean;
  lines: { title: string; variant: string; qty: number; price: number }[];
  price: { subtotal: number; discount: number; shipping: number; total: number };
};

const eur = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" });
const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

/**
 * Orderbevestiging in de huisstijl (kleuren, balken-logo, toon). Tabelgebaseerd met inline CSS,
 * zodat het in e-mailprogramma's goed rendert. Nog niet gekoppeld aan een mailservice.
 */
export function orderConfirmationEmail(o: OrderEmailInput) {
  const subject = `Bedankt voor je bestelling ${o.orderNumber} | ${SITE.name}`;
  const font = "Archivo,'Helvetica Neue',Arial,sans-serif";
  const rows = o.lines
    .map(
      (l) => `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #e4e1d9;font:14px/1.4 ${font};color:#141413">
          <strong>${esc(l.title)}</strong><br><span style="color:#5b5953">${esc(l.variant)} · ${l.qty}×</span>
        </td>
        <td align="right" style="padding:12px 0;border-bottom:1px solid #e4e1d9;font:600 14px ${font};color:#141413">${eur.format(l.price * l.qty)}</td>
      </tr>`,
    )
    .join("");
  const sumRow = (label: string, value: string, bold = false, color = "#141413") =>
    `<tr><td style="padding:4px 0;font:${bold ? "800 17px" : "14px"} ${font};color:${bold ? color : "#5b5953"}">${label}</td><td align="right" style="padding:4px 0;font:${bold ? "800 17px" : "14px"} ${font};color:${color}">${value}</td></tr>`;

  const next = o.digital
    ? "Je cadeaubon wordt per e-mail naar de ontvanger gestuurd."
    : "Op werkdagen voor 15:00 besteld, verzenden we je pakket dezelfde dag met PostNL.";

  const html = `<!doctype html><html lang="nl"><body style="margin:0;background:#f4f1ea">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ea"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
    <tr><td style="padding:0 0 16px 4px;font:800 20px ${font};color:#141413">
      <span style="display:inline-block;width:6px;height:12px;background:#b5582e;margin-right:2px"></span><span style="display:inline-block;width:6px;height:18px;background:#141413;margin-right:2px"></span><span style="display:inline-block;width:6px;height:24px;background:#141413;margin-right:8px"></span>GoedkopeSchoenen
    </td></tr>
    <tr><td style="background:#ffffff;border-radius:24px;padding:36px 32px">
      <h1 style="margin:0 0 8px;font:800 28px/1.15 ${font};color:#141413">Bedankt voor je bestelling${o.name ? `, ${esc(o.name)}` : ""}!</h1>
      <p style="margin:0 0 24px;font:15px/1.5 ${font};color:#5b5953">Bestelnummer <strong style="color:#141413">${esc(o.orderNumber)}</strong>. ${esc(next)}</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px">
        ${sumRow("Subtotaal", eur.format(o.price.subtotal))}
        ${o.price.discount > 0 ? sumRow("Bundelkorting", `−${eur.format(o.price.discount)}`, false, "#99471f") : ""}
        ${o.digital ? "" : sumRow("Verzending", o.price.shipping === 0 ? "Gratis" : eur.format(o.price.shipping))}
        ${sumRow("Totaal", eur.format(o.price.total), true)}
      </table>
      <p style="margin:28px 0 0"><a href="${SITE.url}/account" style="display:inline-block;background:#b5582e;color:#ffffff;text-decoration:none;font:600 15px ${font};padding:14px 28px;border-radius:999px">Bekijk mijn account</a></p>
    </td></tr>
    <tr><td style="padding:20px 8px;font:12px/1.5 ${font};color:#5b5953" align="center">
      Vragen? Bel of app ons op ${SITE.phone} of mail naar <a href="mailto:${SITE.email}" style="color:#99471f">${SITE.email}</a>.<br>
      ${SITE.name} · ${SITE.address.street}, ${SITE.address.zip} ${SITE.address.city} · KvK ${SITE.kvk}
    </td></tr>
  </table>
</td></tr></table></body></html>`;

  const text = [
    `Bedankt voor je bestelling${o.name ? `, ${o.name}` : ""}!`,
    `Bestelnummer ${o.orderNumber}. ${next}`,
    "",
    ...o.lines.map((l) => `- ${l.qty}x ${l.title} (${l.variant}): ${eur.format(l.price * l.qty)}`),
    "",
    `Totaal: ${eur.format(o.price.total)}`,
    "",
    `Vragen? ${SITE.phone} of ${SITE.email}`,
  ].join("\n");

  return { subject, html, text };
}
