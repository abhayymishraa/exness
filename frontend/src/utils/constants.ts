export const Duration = {
  candles_1m: "candles_1m",
  candles_5m: "candles_5m",
  candles_1d: "candles_1d",
} as const;
export type Duration = (typeof Duration)[keyof typeof Duration];

export const Channels = {
  SOLUSDT: "SOLUSDT",
  ETHUSDT: "ETHUSDT",
  BTCUSDT: "BTCUSDT",
} as const;
export type SYMBOL = (typeof Channels)[keyof typeof Channels];
