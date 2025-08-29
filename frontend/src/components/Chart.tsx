import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { getKlineData } from "../api/trade";
import type { Duration, SYMBOL } from "../utils/constants";
import { Signalingmanager } from "../utils/subscription_manager";
import { processRealupdate, type RealtimeUpdate } from "../utils/chart_agg_ws_api";

export default function ChartComponent({
  duration,
  symbol,
}: {
  duration: Duration;
  symbol: SYMBOL;
}) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "black" },
        textColor: "white",
      },
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
    });

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const fetchData = async () => {
      try {
        const response = await getKlineData(symbol, duration);
        const rawData = response.data;
        candlestickSeries.setData(rawData);
        chart.timeScale().fitContent();
        chart.timeScale().scrollToPosition(5, true);

        const singalingmanger = Signalingmanager.getInstance();

        singalingmanger.registerCallback(symbol, (trade) => {
          const candle = processRealupdate(trade as RealtimeUpdate, duration);
          if (candle) {
            candlestickSeries.update(candle);
          }
        });

        singalingmanger.subscribe({ type: "SUBSCRIBE", symbol: symbol });
      } catch (err) {
        console.error("Failed to fetch candle data:", err);
      }
    };

    fetchData();

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
      const signaling = Signalingmanager.getInstance();
      signaling.deregisterCallback(symbol);
      signaling.subscribe({ type: "SUBSCRIBE", symbol: symbol });
    };
  }, [duration, symbol]);

  return <div ref={chartContainerRef} className="h-[689px] max-w-[1156px] " />;
}
