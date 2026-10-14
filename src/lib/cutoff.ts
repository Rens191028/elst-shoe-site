/** Verzendbelofte: op werkdagen voor 15:00 (Nederlandse tijd) besteld, dezelfde dag verzonden. */
export const CUTOFF_HOUR = 15;

const WEEKDAY: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

function amsterdam(now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Europe/Amsterdam",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return {
    day: WEEKDAY[parts["weekday"] ?? "Mon"] ?? 1,
    seconds: Number(parts["hour"]) * 3600 + Number(parts["minute"]) * 60 + Number(parts["second"]),
  };
}

export type Cutoff =
  | { open: true; secondsLeft: number }
  /** `shipsOn`: wanneer de bestelling dan verzonden wordt */
  | { open: false; shipsOn: "morgen" | "maandag" };

/** Feestdagen zijn niet meegenomen; de tekst blijft dan gelijk aan de belofte op de site. */
export function shippingCutoff(now: Date = new Date()): Cutoff {
  const { day, seconds } = amsterdam(now);
  const workday = day >= 1 && day <= 5;
  if (workday && seconds < CUTOFF_HOUR * 3600) {
    return { open: true, secondsLeft: CUTOFF_HOUR * 3600 - seconds };
  }
  // Na 15:00 op vrijdag, of in het weekend: maandag. Anders morgen.
  const nextIsMonday = day === 5 || day === 6 || day === 0;
  return { open: false, shipsOn: nextIsMonday ? "maandag" : "morgen" };
}

export function formatLeft(secondsLeft: number) {
  const h = Math.floor(secondsLeft / 3600);
  const m = Math.floor((secondsLeft % 3600) / 60);
  const s = secondsLeft % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return h > 0 ? `${h} uur ${pad(m)} min` : `${m} min ${pad(s)} sec`;
}
