export const PRECISION = 10000;

export function toDisplayPrice(intPrice: number){
  return Number.parseFloat((intPrice / PRECISION).toFixed(2)); 
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
