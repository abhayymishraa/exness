import { useEffect, useState } from "react";
import { Signalingmanager } from "../utils/subscription_manager";
import { Channels, type SYMBOL } from "../utils/constants";

export interface Trade {
  bid: number;
  ask: number;
  symbol: SYMBOL;
}
export default function AskBids() {
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
    const signalingmanger = Signalingmanager.getInstance();

    const callback = (trade: Trade) => {
      setBidsAsks((prev) => ({
        ...prev,
        [trade.symbol]: {
          bids: trade?.bid,
          asks: trade?.ask,
          symbol: trade?.symbol,
        },
      }));
    };

    // register + subscribe for all symbols
    Object.values(Channels).forEach((ch) => {
      signalingmanger.registerCallback(ch, callback);
      signalingmanger.subscribe({
        type: "SUBSCRIBE",
        symbol: ch,
      });
    });

    return () => {
      Object.values(Channels).forEach((ch) => {
        signalingmanger.deregisterCallbackNew(ch, callback);
        signalingmanger.subscribe({
          type: "UNSUBSCRIBE",
          symbol: ch,
        });
      });
    };
  }, []);

  return (
    <div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3">
                Ask
              </th>
              <th scope="col" className="px-6 py-3">
                Bid
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.values(bid_asks).map((item) => (
              <tr
                key={item.symbol}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.symbol}
                </th>
                <td className="px-6 py-4">{item.asks}</td>
                <td className="px-6 py-4">{item.bids}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
