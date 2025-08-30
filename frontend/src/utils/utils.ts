export const PRICISION = 100;

export function toDisplayPrice(intPrice: number): number {
  return intPrice / PRICISION;
}

export function toInternalPrice(price: number): number {
  return Math.round(price * PRICISION);
}
