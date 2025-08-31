// Lightweight Charts™ Example: Realtime updates
// https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates
import { type CandlestickData, type UTCTimestamp } from "lightweight-charts";
import { getKlineData } from "../api/trade";
import { Duration, type SYMBOL } from "../utils/constants";
import { toDisplayPrice } from "./utils";
export interface RealtimeUpdate {
  symbol: SYMBOL;
  bid: number;
  ask: number;
  time: number;
}

let lastCandle: CandlestickData | null = null;

function getbucketsize(duration: Duration): number {
  let bucketSizeSecond: number;
  switch (duration) {
    case "1m":
      bucketSizeSecond = 60;
      break;
    case "1w":
      bucketSizeSecond = 300;
      break;
    case "1d":
      bucketSizeSecond = 86400;
      break;
    default:
      bucketSizeSecond = 0;
      console.log("invalid durations ");
  }
  return bucketSizeSecond;
}

export function processRealupdate(
  trade: RealtimeUpdate,
  duration: Duration
): CandlestickData | null {
  const price = toDisplayPrice(trade.bid);
  const tradetimeinsecond = trade.time;
  const bucketSize = getbucketsize(duration);

  const currentbucket = (Math.floor(tradetimeinsecond / bucketSize) *
    bucketSize) as UTCTimestamp;

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
  return lastCandle;
}

export async function getChartData(symbol: SYMBOL, duration: Duration) {
  const response = await getKlineData(symbol, duration);
  const initialData = response.data;
  initLastCandle(initialData);
  return initialData;
}

export function initLastCandle(data: CandlestickData[]) {
  if (data.length > 0) {
    lastCandle = data[data.length - 1];
  }
}
