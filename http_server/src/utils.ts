export const PRICE_SCALE = 100;

export function toDisplayPrice(intPrice: number): number {
  return intPrice / PRICE_SCALE;
}

export function toInternalPrice(price: number): number {
  return Math.round(price * PRICE_SCALE);
}
