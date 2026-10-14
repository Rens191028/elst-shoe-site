export type Fit = "smal" | "normaal" | "breed";

/** EU-maat ≈ (voetlengte + 1,5 cm ruimte) × 1,5; bij een brede voet een maat groter. */
export function adviseSize(lengthCm: number, fit: Fit) {
  const base = Math.round((lengthCm + 1.5) * 1.5);
  return base + (fit === "breed" ? 1 : 0);
}

/** Voetlengte (cm) waarbij deze maat precies past, volgens dezelfde formule. */
export const footLengthFor = (size: number) => Math.round((size / 1.5 - 1.5) * 10) / 10;
