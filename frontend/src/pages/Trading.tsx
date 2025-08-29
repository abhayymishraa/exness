import { useState } from "react";
import ChartComponent from "../components/Chart";
import { Channels, Duration } from "../utils/constants";
import type { SYMBOL } from "../utils/constants";

export default function Trading() {
  const [duration, setDuration] = useState<Duration>(Duration.candles_1m);
  const [symbol, setSymbol] = useState<SYMBOL>(Channels.BTCUSDT);

  return (
    <div className="min-h-screen">
      <h1 className=" text-2xl font-serif  font-semibold text-red-600">
        Trading
      </h1>
      <div className=" py-2">
        <div>
          <button
            className={`p-2 border-2 border-black  ${
              duration === Duration.candles_1m
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={duration === Duration.candles_1m}
            onClick={() => setDuration(Duration.candles_1m)}
          >
            1m
          </button>
          <button
            className={`p-2 border-2 border-black  ${
              duration === Duration.candles_5m
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={duration === Duration.candles_5m}
            onClick={() => setDuration(Duration.candles_5m)}
          >
            5m
          </button>
          <button
            className={` p-2  border-2 border-black  ${
              duration === Duration.candles_1d
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={duration === Duration.candles_1d}
            onClick={() => setDuration(Duration.candles_1d)}
          >
            1d
          </button>
        </div>

        <div>
          <button
            className={` p-2  border-2 border-black  ${
              symbol === Channels.BTCUSDT
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={symbol === Channels.BTCUSDT}
            onClick={() => setSymbol(Channels.BTCUSDT)}
          >
            BTCUSDT
          </button>
          <button
            className={` p-2  border-2 border-black  ${
              symbol === Channels.ETHUSDT
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={symbol === Channels.ETHUSDT}
            onClick={() => setSymbol(Channels.ETHUSDT)}
          >
            ETHUSDT
          </button>
          <button
            className={` p-2  border-2 border-black  ${
              symbol === Channels.SOLUSDT
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "cursor-pointer"
            }`}
            disabled={symbol === Channels.SOLUSDT}
            onClick={() => setSymbol(Channels.SOLUSDT)}
          >
            SOLUSDT
          </button>
        </div>
      </div>
      <div>
        <ChartComponent symbol={symbol} duration={duration} />
      </div>
    </div>
  );
}
