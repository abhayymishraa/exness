/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { toDisplayPrice } from "../utils/utils";

const BASE_URL = "http://localhost:5000/api/v1";
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

  const res = await axios.get(`${BASE_URL}/candles`, {
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

export async function submitsignup(email: string, pass: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/signup`,
      {
        email: email,
        password: pass,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || error;
    }
  }
}

export async function submitsignin(email: string, pass: string) {
  try {
    const res = await axios.post(
      `${BASE_URL}/user/signin`,
      {
        email: email,
        password: pass,
      },
      {
        withCredentials: true,
      }
    );
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || error;
    }
  }
}

export async function findUserAmount() {
  try {
    const token =
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("Authorization="))
        ?.split("=")[1] || "";

    const res = await axios.get(`${BASE_URL}/user/balance`, {
      headers: {
        Authorization: token,
      },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response?.data || error;
    }
  }
}
