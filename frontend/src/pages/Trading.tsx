import { useEffect, useState } from "react";
import ChartComponent from "../components/Chart";
import { Channels, Duration } from "../utils/constants";
import type { SYMBOL } from "../utils/constants";
import AskBids from "../components/AskBidsTable";
import { findUserAmount } from "../api/trade";
import { useNavigate } from "react-router";
import OrdersPanel from "../components/OrdersPanel";
import BuySell from "../components/BuySell";
import { toDisplayPrice } from "../utils/utils";

export default function Trading() {
  const [duration, setDuration] = useState<Duration>(Duration.candles_1m);
  const [symbol, setSymbol] = useState<SYMBOL>(Channels.BTCUSDT);
  const [prices, setPrices] = useState({ buyPrice: 0, sellPrice: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    async function checkdata() {
      try {
        const data = await findUserAmount();
        if (!data.usd_balance) {
          if (typeof window !== "undefined") {
            document.cookie = "";
          }
          navigate("/signin");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/signin");
      }
    }

    checkdata();
  }, [navigate]);

  return (
    <div className="h-[calc(100vh-10px)] bg-[#0c1418] overflow-hidden flex flex-col">
      <div className="w-full h-full flex flex-col p-1 md:p-2">
        <div className="bg-[#141D22] border border-[#263136] p-2 rounded-lg mb-2 flex gap-2 overflow-x-auto">
          <button
            className={`px-3 py-1.5 rounded-md transition-all ${
              symbol === Channels.BTCUSDT
                ? "bg-[#158BF9]/10 text-[#158BF9] border border-[#158BF9]/30"
                : "text-white hover:bg-[#1c2a31] border border-transparent"
            }`}
            disabled={symbol === Channels.BTCUSDT}
            onClick={() => setSymbol(Channels.BTCUSDT)}
          >
            <div className="flex items-center">
              <span className="font-medium text-sm">BTC/USDT</span>
              <span className="ml-2 text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">
                +2.4%
              </span>
            </div>
          </button>

          <button
            className={`px-3 py-1.5 rounded-md transition-all ${
              symbol === Channels.ETHUSDT
                ? "bg-[#158BF9]/10 text-[#158BF9] border border-[#158BF9]/30"
                : "text-white hover:bg-[#1c2a31] border border-transparent"
            }`}
            disabled={symbol === Channels.ETHUSDT}
            onClick={() => setSymbol(Channels.ETHUSDT)}
          >
            <div className="flex items-center">
              <span className="font-medium text-sm">ETH/USDT</span>
              <span className="ml-2 text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">
                +1.9%
              </span>
            </div>
          </button>

          <button
            className={`px-3 py-1.5 rounded-md transition-all ${
              symbol === Channels.SOLUSDT
                ? "bg-[#158BF9]/10 text-[#158BF9] border border-[#158BF9]/30"
                : "text-white hover:bg-[#1c2a31] border border-transparent"
            }`}
            disabled={symbol === Channels.SOLUSDT}
            onClick={() => setSymbol(Channels.SOLUSDT)}
          >
            <div className="flex items-center">
              <span className="font-medium text-sm">SOL/USDT</span>
              <span className="ml-2 text-xs bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
                -0.8%
              </span>
            </div>
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="bg-[#141D22] rounded-md p-1 flex border border-[#263136]">
              <button
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition ${
                  duration === Duration.candles_1m
                    ? "bg-[#263136] text-white"
                    : "text-white/70 hover:text-white"
                }`}
                disabled={duration === Duration.candles_1m}
                onClick={() => setDuration(Duration.candles_1m)}
              >
                1m
              </button>
              <button
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition ${
                  duration === Duration.candles_1d
                    ? "bg-[#263136] text-white"
                    : "text-white/70 hover:text-white"
                }`}
                disabled={duration === Duration.candles_1d}
                onClick={() => setDuration(Duration.candles_1d)}
              >
                1d
              </button>
              <button
                className={`px-2 md:px-3 py-1 rounded text-xs md:text-sm font-medium transition ${
                  duration === Duration.candles_1w
                    ? "bg-[#263136] text-white"
                    : "text-white/70 hover:text-white"
                }`}
                disabled={duration === Duration.candles_1w}
                onClick={() => setDuration(Duration.candles_1w)}
              >
                1w
              </button>
            </div>
          </div>
        </div>

        <div className="flex-grow grid grid-cols-12 gap-1 h-[calc(100vh-80px)]">
          <div className="col-span-12 md:col-span-2 order-2 md:order-1 overflow-auto h-full">
            <div className="bg-[#141D22] rounded-lg border border-[#263136] p-1.5 h-full">
              <h3 className="text-white text-sm font-medium mb-1 flex justify-between items-center">
                <span>Market Data</span>
                <span className="text-xs text-white/50">Live</span>
              </h3>
              <AskBids symbol={symbol} />
            </div>
          </div>

          <div className="col-span-12 md:col-span-10 order-1 md:order-2 flex overflow-hidden h-[calc(100vh-130px)]">
            <div className="w-full h-full md:w-3/4 flex flex-col gap-2 pr-2">
              <div className="h-[65%] flex flex-col">
                <ChartComponent
                  symbol={symbol}
                  duration={duration}
                  onPriceUpdate={setPrices}
                />
              </div>

              <div className="h-[35%]">
                <OrdersPanel />
              </div>
            </div>

            <div className="w-full h-full md:w-1/4">
              <BuySell
                symbol={symbol}
                sellPrice={toDisplayPrice(prices.sellPrice)}
                buyPrice={toDisplayPrice(prices.buyPrice)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
