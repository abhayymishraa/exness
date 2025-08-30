const PRECISION = 100;

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



