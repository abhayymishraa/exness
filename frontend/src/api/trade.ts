import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/candles";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getKlineData(asset: any,duration: any,startTime?: any, endTime?: string
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
  return res.data;
}
