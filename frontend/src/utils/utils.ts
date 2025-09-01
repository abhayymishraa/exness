export const PRECISION = 10000;

export function toDisplayPrice(intPrice: number): string {
  return (intPrice / PRECISION).toFixed(2); // <-- always 2 decimals
}

export function toInternalPrice(price: number): number {
  return Math.round(price * PRECISION);
}

export function getPrecisedData(val: string) {
  return Math.round(parseFloat(val) * PRECISION);
}

export function getRealValue(val: number) {
  return val / PRECISION;
}
