import { useEffect, useState } from "react";
import ChartComponent from "../components/Chart";
import { Channels, Duration } from "../utils/constants";
import type { SYMBOL } from "../utils/constants";
import AskBids from "../components/AskBidsTable";
import { findUserAmount } from "../api/trade";
import { useNavigate } from "react-router";

export default function Trading() {
  const [duration, setDuration] = useState<Duration>(Duration.candles_1m);
  const [symbol, setSymbol] = useState<SYMBOL>(Channels.BTCUSDT);
  const navigate = useNavigate();
  useEffect(() => {
    async function checkdata() {
      const data = await findUserAmount();
      if (!data.usd_balance) {
        cookieStore.getAll().then((cookies) =>
          cookies.forEach((cookie) => {
            if (cookie.name) {
              cookieStore.delete(cookie.name);
            }
          })
        );
        navigate("/signin");
      }
    }

    checkdata();
  });

  return (
    <div className="min-h-screen bg-[#141D22]">
      <h1 className=" text-2xl font-serif  font-semibold text-red-600">
        Trading
      </h1>

      <div className="flex gap-4">
        <div>
          <AskBids />
          <div className=" py-2 text-white">
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
                  duration === Duration.candles_1w
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                disabled={duration === Duration.candles_1w}
                onClick={() => setDuration(Duration.candles_1w)}
              >
                1w
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
        </div>

        <div className="w-full h-full">
          <ChartComponent symbol={symbol} duration={duration} />
        </div>
      </div>
    </div>
  );
}
