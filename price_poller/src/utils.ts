const PRECISION = 10000;

export function getPrecisedData(val: string) {
  return Math.round(parseFloat(val) * PRECISION)
}

export function getRealValue(val: number) {
  return val / PRECISION;
}

export enum Channels {
  SOLUSDT,
  ETHUSDT,
  BTCUSDT,
}






