import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Duration, SYMBOL } from "../utils/constants";
import { Signalingmanager } from "../utils/subscription_manager";
import {
  getChartData,
  processRealupdate,
  type RealtimeUpdate,
} from "../utils/chart_agg_ws_api";
import { StayonTimeline } from "../utils/chartviewmanager";

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
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });

    const fetchData = async () => {
      try {
        const rawData = await getChartData(symbol, duration);
        candlestickSeries.setData(rawData);
        chart.timeScale().scrollToRealTime();
        chart.timeScale().subscribeVisibleTimeRangeChange(()=>{

        })

        const singalingmanger = Signalingmanager.getInstance();

        singalingmanger.registerCallback(symbol, (trade) => {
          const candle = processRealupdate(trade as RealtimeUpdate, duration);
          if (candle) {
            candlestickSeries.update(candle);
            StayonTimeline(chart, candlestickSeries, 20);
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
      signaling.subscribe({ type: "UNSUBSCRIBE", symbol: symbol });
    };
  }, [duration, symbol]);

  return <div ref={chartContainerRef} className="h-[689px] max-w-[1156px] " />;
}
