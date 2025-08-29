import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/trading";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getKlineData(symbol: any, duration: any) {
  const res = await axios.get(
    `${BASE_URL}/candles/${symbol}?duration=${duration}`
  );
  return res.data;
}

