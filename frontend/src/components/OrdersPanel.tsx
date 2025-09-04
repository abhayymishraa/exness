import { useEffect, useState } from "react";
import { closetrade, getclosedtrades, getopentrades } from "../api/trade";
import { toDisplayPrice, toDisplayPriceUSD } from "../utils/utils";

interface OpenOrder {
  orderId: string;
  type: "buy" | "sell";
  margin: number;
  leverage: number;
  openPrice: number;
  asset?: string;
}

interface ClosedOrder extends OpenOrder {
  closePrice: number;
  pnl: number;
}

export default function OrdersPanel() {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [closedOrders, setClosedOrders] = useState<ClosedOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClosingPosition, setIsClosingPosition] = useState<string | null>(
    null
  );

  const fetchOpenOrders = async () => {
    setIsLoading(true);
    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("Authorization="))
          ?.split("=")[1] || "";

      const response = await getopentrades(token);
      setOpenOrders(response?.data.trades || []);
    } catch (error) {
      console.error("Error fetching open orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClosedOrders = async () => {
    setIsLoading(true);
    try {
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("Authorization="))
          ?.split("=")[1] || "";

      const response = await getclosedtrades(token);
      setClosedOrders(response.data.trades || []);
    } catch (error) {
      console.error("Error fetching closed orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "open") {
      fetchOpenOrders();
    } else {
      fetchClosedOrders();
    }

    // Set up polling to refresh data
    const intervalId = setInterval(() => {
      if (activeTab === "open") {
        fetchOpenOrders();
      } else {
        fetchClosedOrders();
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [activeTab]);

  const closePosition = async (orderId: string) => {
    try {
      setIsClosingPosition(orderId);
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("Authorization="))
          ?.split("=")[1] || "";

      await closetrade(token, orderId);

      fetchOpenOrders();
      fetchClosedOrders();
    } catch (error) {
      console.error("Error closing position:", error);
    } finally {
      setIsClosingPosition(null);
    }
  };

  return (
    <div className="bg-[#141D22] border border-[#263136] rounded-lg w-full h-full flex flex-col">
      <div className="flex border-b border-[#263136]">
        <button
          className={`flex-1 py-2 text-center text-sm transition ${
            activeTab === "open"
              ? "text-[#158BF9] border-b-2 border-[#158BF9]"
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => setActiveTab("open")}
        >
          Open Positions
        </button>
        <button
          className={`flex-1 py-2 text-center text-sm transition ${
            activeTab === "closed"
              ? "text-[#158BF9] border-b-2 border-[#158BF9]"
              : "text-white/70 hover:text-white"
          }`}
          onClick={() => setActiveTab("closed")}
        >
          Order History
        </button>
      </div>

      <div className="p-2 overflow-auto flex-1">
        {isLoading ? (
          <div className="text-center py-4 text-white/50">Loading...</div>
        ) : activeTab === "open" ? (
          openOrders.length > 0 ? (
            <div className="overflow-x-auto h-full">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-[#141D22] z-10">
                  <tr className="text-xs text-white/60 border-b border-[#263136]">
                    <th className="py-2 px-2 text-left">Symbol</th>
                    <th className="py-2 px-2 text-right">Type</th>
                    <th className="py-2 px-2 text-right">Margin</th>
                    <th className="py-2 px-2 text-right">Leverage</th>
                    <th className="py-2 px-2 text-right">Open Price</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {openOrders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="border-b border-[#263136]/40 hover:bg-[#1c2a31]"
                    >
                      <td className="py-2 px-2 font-medium">
                        {order.asset || "BTC"}
                        <span className="text-white/50 text-xs">/USDT</span>
                      </td>
                      <td
                        className={`py-2 px-2 text-right font-medium ${
                          order.type === "buy"
                            ? "text-[#158BF9]"
                            : "text-[#EB483F]"
                        }`}
                      >
                        {order.type === "buy" ? "LONG" : "SHORT"}
                      </td>
                      <td className="py-2 px-2 text-right">
                        {toDisplayPriceUSD(order.margin)} USD
                      </td>
                      <td className="py-2 px-2 text-right">
                        x{order.leverage}
                      </td>
                      <td className="py-2 px-2 text-right">
                        ${toDisplayPrice(order.openPrice)}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => closePosition(order.orderId)}
                          disabled={isClosingPosition === order.orderId}
                          className={`px-2 py-1 text-white rounded text-xs 
                            ${
                              isClosingPosition === order.orderId
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-[#EB483F] hover:bg-[#EB483F]/80"
                            }`}
                        >
                          {isClosingPosition === order.orderId
                            ? "Closing..."
                            : "Close"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-white/50">
              No open positions
            </div>
          )
        ) : closedOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-white/60 border-b border-[#263136]">
                  <th className="py-2 px-2 text-left">Symbol</th>
                  <th className="py-2 px-2 text-right">Type</th>
                  <th className="py-2 px-2 text-right">Margin</th>
                  <th className="py-2 px-2 text-right">Open Price</th>
                  <th className="py-2 px-2 text-right">Close Price</th>
                  <th className="py-2 px-2 text-right">P&L</th>
                </tr>
              </thead>
              <tbody>
                {closedOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="border-b border-[#263136]/40 hover:bg-[#1c2a31]"
                  >
                    <td className="py-2 px-2 font-medium">
                      {order.asset || "BTC"}
                      <span className="text-white/50 text-xs">/USDT</span>
                    </td>
                    <td
                      className={`py-2 px-2 text-right ${
                        order.type === "buy"
                          ? "text-[#158BF9]"
                          : "text-[#EB483F]"
                      }`}
                    >
                      {order.type === "buy" ? "LONG" : "SHORT"}
                    </td>
                    <td className="py-2 px-2 text-right">
                      {toDisplayPriceUSD(order.margin)} USD
                    </td>
                    <td className="py-2 px-2 text-right">
                      ${toDisplayPrice(order.openPrice)}
                    </td>
                    <td className="py-2 px-2 text-right">
                      ${toDisplayPrice(order.closePrice)}
                    </td>
                    <td
                      className={`py-2 px-2 text-right font-medium ${
                        toDisplayPriceUSD(order.pnl) >= 0
                          ? "text-green-500"
                          : "text-[#EB483F]"
                      }`}
                    >
                      {toDisplayPriceUSD(order.pnl) >= 0 ? "+" : ""}
                      {toDisplayPriceUSD(order.pnl)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">No order history</div>
        )}
      </div>
    </div>
  );
}
