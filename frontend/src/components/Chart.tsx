import { createChart, ColorType, CandlestickSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";
import { generateData } from "../utils/utils";

export interface ChartData {
  open: number;
  high: number;
  low: number;
  close: number;
  time: string;
}

export interface Candle {
  time: string; // e.g. "2018-12-22" or unix seconds
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Props {
  initialData: Candle[];
  realtimeUpdates: Candle[];
}

export default function ChartComponent({ data }: Candle[]) {
  const colors = {
    backgroundColor: "black",
    lineColor: "#2962FF",
    textColor: "white",
    areaTopColor: "#2962FF",
    areaBottomColor: "rgba(41, 98, 255, 0.28)",
  };
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current) {
      return;
    }

    const handleResize = () => {
      chart.applyOptions({ width: chartContainerRef?.current?.clientWidth });
    };

    const chart = createChart(chartContainerRef?.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
    });
    chart.timeScale().fitContent();

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
    });
    // candlestickSeries.setData(data);
    window.addEventListener("resize", handleResize);
    const data1 = generateData(2500, 20, 1000);
    candlestickSeries.setData(data1.realtimeUpdates)


    function* getNextRealtimeUpdate(realtimeData :any ) {
      for (const dataPoint of realtimeData) {
        yield dataPoint;
      }
      return null;
    }
    const streamingDataProvider = getNextRealtimeUpdate(data1.realtimeUpdates);

    const intervalID = setInterval(() => {
      const update = streamingDataProvider.next();
      if (update.done) {
        clearInterval(intervalID);
        return;
      }
      candlestickSeries.update(update.value);
    }, 100);

    return () => {
      window.removeEventListener("resize", handleResize);

      chart.remove();
    };
  }, [
    data,
    colors.backgroundColor,
    colors.lineColor,
    colors.textColor,
    colors.areaTopColor,
    colors.areaBottomColor,
  ]);

  return <div ref={chartContainerRef} />;
}
