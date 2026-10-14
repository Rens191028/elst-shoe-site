import raw from "@/data/reviews.json";

/** Echte klantreviews per product-handle. Leeg zolang er geen reviews zijn aangeleverd (nooit verzinnen). */
export type Review = {
  name: string;
  stars: number; // 1-5
  text: string;
  date?: string; // YYYY-MM-DD
  photo?: string; // URL van een door de klant geüploade foto
};

const DATA = raw as Record<string, Review[]>;

export const reviewsFor = (handle: string): Review[] => DATA[handle] ?? [];

export function averageStars(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  return Math.round((reviews.reduce((s, r) => s + r.stars, 0) / reviews.length) * 10) / 10;
}
