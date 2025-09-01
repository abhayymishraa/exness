import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Duration, SYMBOL } from "../utils/constants";
import { Signalingmanager } from "../utils/subscription_manager";
import {
  getChartData,
  processRealupdate,
  resetLastCandle,
  type RealtimeUpdate,
} from "../utils/chart_agg_ws_api";

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
      upColor: "#158BF9",
      downColor: "#EB483F",
      borderVisible: false,
      priceLineColor: "#EB483F",
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    function tick(trade) {
      const candle = processRealupdate(trade as RealtimeUpdate, duration);
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
      resetLastCandle();
      const signaling = Signalingmanager.getInstance();
      signaling.deregisterCallbackNew(symbol, tick);

      // signaling.subscribe({ type: "UNSUBSCRIBE", symbol: symbol });
    };
  }, [duration, symbol]);

  return <div ref={chartContainerRef} className="h-[689px] max-w-[1156px] " />;
}
