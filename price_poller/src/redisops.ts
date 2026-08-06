import { fromInternalPrice, toInternalPrice } from "./utils";

type SymbolMapKey = "SOLUSDT" | "ETHUSDT" | "BTCUSDT";

// 2 bp total (0.02%) is in the right order of magnitude for major crypto pairs.
// Tunable without a redeploy.
const SPREAD_BPS = Number(process.env.SPREAD_BPS ?? 2);

export function pushToRedis(
  redis: any,
  value: any,
  type: SymbolMapKey,
  time: any,
) {
  let symbolmap = {
    SOLUSDT: "SOL",
    ETHUSDT: "ETH",
    BTCUSDT: "BTC",
  };
  //float

  const realVal = fromInternalPrice(value);

  // Total spread in basis points, split symmetrically around the Binance trade
  // price. Was `ask = price * 1.01, bid = price` — a 1% spread, roughly 100x a
  // real BTC spread, and asymmetric: the mid sat 0.5% above the true market.
  // A 10x position paid 10% of its margin the instant it opened. Measured on
  // two live round trips: -$9.90 and -$9.99 on $100 of margin, no price move.
  // No .toFixed(2) either — at a realistic spread SOL's half-spread is
  // sub-cent, so rounding to cents collapsed bid and ask onto the same number.
  const half = SPREAD_BPS / 2 / 10_000;
  const bid = toInternalPrice(realVal * (1 - half));
  const ask = toInternalPrice(realVal * (1 + half));

  redis.publish(
    symbolmap[type],
    JSON.stringify({
      symbol: symbolmap[type],
      askPrice: ask,
      bidPrice: bid,
      // raw trade price: candles are built from trades (Binance-style), never
      // from bid or ask
      price: value,
      decimals: 4,
      time: Math.floor(new Date(time).getTime() / 1000),
    }),
  );
}
