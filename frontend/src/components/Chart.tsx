import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import type { Duration, SYMBOL } from "../utils/constants";
import { Signalingmanager } from "../utils/subscription_manager";
import {
  getChartData,
  processRealupdate,
  resetLastCandle,
  type RealtimeUpdate,
} from "../utils/chart_agg_ws_api";
import type { Trade } from "./AskBidsTable";
import BuySell from "./BuySell";
import { toDisplayPrice } from "../utils/utils";

export default function ChartComponent({
  duration,
  symbol,
}: {
  duration: Duration;
  symbol: SYMBOL;
}) {
  const [buySellPrice, setBuySellPrice] = useState({
    buyPrice: 0,
    sellPrice: 0,
  });
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.VerticalGradient },
        textColor: "#4C5255",
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#158BF9",
      downColor: "#EB483F",
      borderVisible: false,
      priceLineColor: "#EB483F",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    function tick(trade: Trade) {
      const candle = processRealupdate(trade as RealtimeUpdate, duration);
      setBuySellPrice({
        buyPrice: trade.buyPrice,
        sellPrice: trade.sellPrice,
      });
      if (candle) {
        candlestickSeries.update(candle);
      }
    }

    const fetchData = async () => {
      const rawData = await getChartData(symbol, duration);
      candlestickSeries.setData(rawData);
      chart.timeScale().fitContent();

      const signalingManager = Signalingmanager.getInstance();

      signalingManager.registerCallback(symbol, tick);

      signalingManager.subscribe({ type: "SUBSCRIBE", symbol: symbol });
    };

    fetchData();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      resetLastCandle(symbol, duration);
      const signaling = Signalingmanager.getInstance();
      signaling.deregisterCallbackNew(symbol, tick);
      // signaling.subscribe({ type: "UNSUBSCRIBE", symbol: symbol });
    };
  }, [duration, symbol]);

  return (
    <div className="flex gap-4 text-white">
      <div
        ref={chartContainerRef}
        className="h-[689px] max-w-[1156px] w-full border-2 p-0 border-[#3F474B]"
      />
      <div>
        <BuySell
          symbol={symbol}
          sellPrice={toDisplayPrice(buySellPrice.buyPrice)}
          buyPrice={toDisplayPrice(buySellPrice.sellPrice)}
        />
      </div>
    </div>
  );
}
