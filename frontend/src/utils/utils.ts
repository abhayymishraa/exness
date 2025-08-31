export const PRICISION = 10000;

export function toDisplayPrice(intPrice: number): number {
  return intPrice / PRICISION;
}

export function toInternalPrice(price: number): number {
  return Math.round(price * PRICISION);
}
