// Lightweight Charts™ Example: Realtime updates
// https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates
import { type CandlestickData, type UTCTimestamp } from "lightweight-charts";
import { getKlineData } from "../api/trade";
import { Channels, Duration, type SYMBOL } from "../utils/constants";
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
    case "candles_1m":
      bucketSizeSecond = 60;
      break;
    case "candles_5m":
      bucketSizeSecond = 300;
      break;
    case "candles_1d":
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
  const price = trade.bid;
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

export async function updateData(
  symbol: SYMBOL = Channels.BTCUSDT,
  duration: Duration = Duration.candles_1m
) {
  const response = await getKlineData(symbol, duration);
  const initialData = response.data;

  if (initialData.length > 0) {
    lastCandle = initialData[initialData.length - 1];
  }

  return {
    initialData,
    processRealupdate,
  };
}
