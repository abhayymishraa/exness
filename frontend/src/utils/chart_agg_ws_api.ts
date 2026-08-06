import { type CandlestickData, type UTCTimestamp } from "lightweight-charts";
import { getKlineData } from "../api/trade";
import { Duration, type SYMBOL } from "../utils/constants";
import { toDisplayPrice } from "./utils";

export interface RealtimeUpdate {
  symbol: SYMBOL;
  bidPrice: number;
  askPrice: number;
  /** raw trade price from the poller — the series candles aggregate over */
  price?: number;
  /** exchange event time (seconds), not client receive time */
  time: number;
}

function getbucketsize(duration: Duration): number {
  switch (duration) {
    case "1m":
      return 60;
    case "1d":
      return 86400;
    case "1w":
      return 604800;
    default:
      console.warn("invalid duration", duration);
      return 0;
  }
}

const lastCandles: Record<string, CandlestickData | null> = {};

function key(symbol: SYMBOL, duration: Duration) {
  return `${symbol}_${duration}`;
}

// time_bucket('1 week') aligns to Monday (origin 2000-01-03); flooring the raw
// epoch lands on Thursday, so the live weekly candle would sit in a different
// bucket than the one history returns after a reload.
const WEEK_ORIGIN = 345600; // 1970-01-05, a Monday

export function processRealupdate(
  trade: RealtimeUpdate,
  duration: Duration,
): CandlestickData | null {
  const k = key(trade.symbol, duration);
  let lastCandle = lastCandles[k];

  // Candles aggregate TRADES (Binance kline semantics). History is built from
  // Trade.price, so the live candle must be too — it used the bid, which sits
  // half a spread below every historical candle. Mid reconstructs the trade
  // price exactly for a symmetric spread; kept only as a fallback for a stale
  // poller that doesn't publish `price` yet.
  const price = toDisplayPrice(
    trade.price ?? Math.round((trade.bidPrice + trade.askPrice) / 2),
  );
  const bucketSize = getbucketsize(duration);
  const currentbucket = (duration === "1w"
    ? Math.floor((trade.time - WEEK_ORIGIN) / bucketSize) * bucketSize +
      WEEK_ORIGIN
    : Math.floor(trade.time / bucketSize) * bucketSize) as UTCTimestamp;

  // A tick whose bucket predates the last candle (boundary races, clock skew)
  // must be dropped: series.update() throws on an older time.
  if (lastCandle && currentbucket < (lastCandle.time as number)) {
    return null;
  }

  if (!lastCandle || currentbucket > (lastCandle.time as UTCTimestamp)) {
    lastCandle = {
      time: currentbucket,
      open: price,
      high: price,
      low: price,
      close: price,
    };
  } else {
    lastCandle = {
      time: lastCandle.time,
      open: lastCandle.open,
      high: Math.max(lastCandle.high, price),
      low: Math.min(lastCandle.low, price),
      close: price,
    };
  }

  lastCandles[k] = lastCandle;
  return lastCandle;
}

export function initLastCandle(
  symbol: SYMBOL,
  duration: Duration,
  data: CandlestickData[],
) {
  const k = key(symbol, duration);
  lastCandles[k] = data.length > 0 ? data[data.length - 1] : null;
}

export async function getChartData(symbol: SYMBOL, duration: Duration) {
  const response = await getKlineData(symbol, duration);
  console.log("response", response);
  initLastCandle(symbol, duration, response.candles);
  return response.candles;
}

export function resetLastCandle(symbol: SYMBOL, duration: Duration) {
  const k = key(symbol, duration);
  delete lastCandles[k];
}
