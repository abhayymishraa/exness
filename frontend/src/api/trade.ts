import axios from "axios";
import { toDisplayPrice } from "../utils/utils";

const BASE_URL = "http://localhost:5000/api/v1/candles";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getKlineData(
  asset: any,
  duration: any,
  startTime?: any,
  endTime?: string
) {
  const currentTimeSec = Math.floor(Date.now() / 1000);

  // if user provided custom start/end, use those (already in seconds),
  // otherwise default: last 1 hour range
  const startTimestamp = startTime ? Number(startTime) : currentTimeSec - 3600; // 1 hour ago
  const endTimestamp = endTime ? Number(endTime) : currentTimeSec;

  const res = await axios.get(BASE_URL, {
    params: {
      asset,
      ts: duration,
      startTime: startTimestamp,
      endTime: endTimestamp,
    },
  });

  if (res.data && Array.isArray(res.data.candles)) {
    res.data.candles = res.data.candles.map((candle: any) => ({
      open: toDisplayPrice(candle.open),
      high: toDisplayPrice(candle.high),
      low: toDisplayPrice(candle.low),
      close: toDisplayPrice(candle.close),
      time: candle.timestamp,
      decimal: candle.decimal,
    }));
  }
  return res.data;
}
