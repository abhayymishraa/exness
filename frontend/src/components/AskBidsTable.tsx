import { useEffect, useState } from "react";
import { Signalingmanager } from "../utils/subscription_manager";
import { Channels, type SYMBOL } from "../utils/constants";
import { toDisplayPrice } from "../utils/utils";

export interface Trade {
  buyPrice: number;
  sellPrice: number;
  symbol: SYMBOL;
}

const imageUrl = {
  SOL: "https://i.postimg.cc/9MhDvsK9/b2f0c70f-4fb2-4472-9fe7-480ad1592421.png",
  ETH: "https://i.postimg.cc/gcKhPkY2/3a8c9fe6-2a76-4ace-aa07-415d994de6f0.png",
  BTC: "https://i.postimg.cc/TPh0K530/87496d50-2408-43e1-ad4c-78b47b448a6a.png",
};

export default function AskBids({ symbol }: { symbol?: SYMBOL }) {
  const [bid_asks, setBidsAsks] = useState({
    SOL: {
      bids: 0,
      asks: 0,
      symbol: "SOL",
    },
    ETH: {
      bids: 0,
      asks: 0,
      symbol: "ETH",
    },
    BTC: {
      bids: 0,
      asks: 0,
      symbol: "BTC",
    },
  });

  useEffect(() => {
    const signalingManager = Signalingmanager.getInstance();

    const callback = (trade: Trade) => {
      setBidsAsks((prev) => ({
        ...prev,
        [trade.symbol]: {
          bids: toDisplayPrice(trade?.buyPrice),
          asks: toDisplayPrice(trade?.sellPrice),
          symbol: trade?.symbol,
        },
      }));
    };

    const unwatchFunctions = Object.values(Channels).map((ch) =>
      signalingManager.watch(ch, callback)
    );

    return () => {
      unwatchFunctions.forEach((unwatch) => unwatch());
    };
  }, []);

  return (
    <div className="w-full">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-white/60">
            <th className="py-2 text-left">Symbol</th>
            <th className="py-2 text-right">Ask</th>
            <th className="py-2 text-right">Bid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#263136]/40">
          {Object.values(bid_asks).map((item) => (
            <tr
              key={item.symbol}
              className={`hover:bg-[#1c2a31] transition-colors ${
                symbol === `${item.symbol}USDT` ? "bg-[#1c2a31]" : ""
              }`}
            >
              <th className="py-3 text-left font-medium text-white ">
                <img
                  src={imageUrl[item.symbol as keyof typeof imageUrl]}
                  alt={item.symbol}
                  className="h-5 w-5 rounded-full inline-block mr-2"
                />
                {item.symbol}
                <span className="text-xs text-white/50 ml-1">USDT</span>
              </th>
              <td className="py-3 text-right font-mono text-[#EB483F]">
                {item.asks}
              </td>
              <td className="py-3 text-right font-mono text-[#158BF9]">
                {item.bids}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
