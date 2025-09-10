import { useEffect, useMemo, useState } from "react";
import { closetrade, getclosedtrades, getopentrades } from "../api/trade";
import {
  calculatePnlCents,
  toDisplayPrice,
  toDisplayPriceUSD,
} from "../utils/utils";
import { subscribePrices, type LivePrices } from "../utils/price_store";

interface OpenOrder {
  orderId: string;
  type: "buy" | "sell";
  margin: number;
  leverage: number;
  openPrice: number;
  asset?: string;
  takeProfit?: number;
  stopLoss?: number;
  liquidationPrice?: number;
}

interface ClosedOrder extends OpenOrder {
  closePrice: number;
  pnl: number;
}

type OpenOrderWithPnl = OpenOrder & { pnlUsd: number };

export default function OrdersPanel() {
  const [activeTab, setActiveTab] = useState<"open" | "closed">("open");
  const [openOrders, setOpenOrders] = useState<OpenOrder[]>([]);
  const [closedOrders, setClosedOrders] = useState<ClosedOrder[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClosingPosition, setIsClosingPosition] = useState<string | null>(
    null
  );
  const [latestPrices, setLatestPrices] = useState<LivePrices>({
    BTC: { bid: 0, ask: 0 },
    ETH: { bid: 0, ask: 0 },
    SOL: { bid: 0, ask: 0 },
  });

  const fetchOpenOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token") || "";

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
      const token = localStorage.getItem("token") || "";

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

  useEffect(() => {
    const unsubscribe = subscribePrices((p: LivePrices) => {
      setLatestPrices(p);
    });
    return () => unsubscribe();
  }, []);

  const openWithPnl: OpenOrderWithPnl[] = useMemo(() => {
    return openOrders.map((o): OpenOrderWithPnl => {
      const sym = (o.asset || "BTC").replace("USDT", "");
      const p = latestPrices[sym as keyof LivePrices];
      if (!p || p.bid === 0 || p.ask === 0) {
        return { ...o, pnlUsd: 0 };
      }

      const currentcloseprice = o.type === "buy" ? p.bid : p.ask;
      // Dynamic P&L based on side: buy uses current buyPrice; sell uses current sellPrice
      const pnlInCents = calculatePnlCents({
        side: o.type,
        openPrice: o.openPrice,
        closePrice: currentcloseprice,
        marginCents: o.margin,
        leverage: o.leverage,
      });
      return { ...o, pnlUsd: pnlInCents };
    });
  }, [openOrders, latestPrices]);

  // Helper function to get TP/SL status
  const getTpSlStatus = (order: OpenOrderWithPnl) => {
    const sym = (order.asset || "BTC").replace("USDT", "");
    const p = latestPrices[sym as keyof LivePrices];
    if (!p) return { tpStatus: "none", slStatus: "none" };

    const currentPrice = order.type === "buy" ? p.bid : p.ask;

    let tpStatus = "none";
    let slStatus = "none";

    if (order.takeProfit) {
      if (order.type === "buy" && currentPrice >= order.takeProfit) {
        tpStatus = "hit";
      } else if (order.type === "sell" && currentPrice <= order.takeProfit) {
        tpStatus = "hit";
      } else {
        const distance =
          Math.abs(currentPrice - order.takeProfit) / order.takeProfit;
        tpStatus = distance < 0.02 ? "close" : "active";
      }
    }

    if (order.stopLoss) {
      if (order.type === "buy" && currentPrice <= order.stopLoss) {
        slStatus = "hit";
      } else if (order.type === "sell" && currentPrice >= order.stopLoss) {
        slStatus = "hit";
      } else {
        const distance =
          Math.abs(currentPrice - order.stopLoss) / order.stopLoss;
        slStatus = distance < 0.02 ? "close" : "active";
      }
    }

    return { tpStatus, slStatus };
  };

  const closePosition = async (orderId: string) => {
    try {
      setIsClosingPosition(orderId);
      const token = localStorage.getItem("token") || "";

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
          <>
            {/* Status Legend */}
            <div className="mb-3 p-2 bg-[#0f171b] border border-[#263136] rounded-md">
              <div className="flex items-center gap-4 text-xs text-white/60">
                <div className="flex items-center gap-1">
                  <span className="text-green-500">✓</span>
                  <span>TP/SL Hit</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-yellow-500 animate-pulse">!</span>
                  <span>Close to TP/SL</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-red-500 animate-pulse">⚠</span>
                  <span>Near Liquidation</span>
                </div>
              </div>
            </div>
            {openWithPnl.length > 0 ? (
              <div className="overflow-x-auto h-full">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-[#141D22] z-10">
                    <tr className="text-xs text-white/60 border-b border-[#263136]">
                      <th className="py-2 px-2 text-left">Symbol</th>
                      <th className="py-2 px-2 text-right">Type</th>
                      <th className="py-2 px-2 text-right">Margin</th>
                      <th className="py-2 px-2 text-right">Leverage</th>
                      <th className="py-2 px-2 text-right">Open Price</th>
                      <th className="py-2 px-2 text-right">Take Profit</th>
                      <th className="py-2 px-2 text-right">Stop Loss</th>
                      <th className="py-2 px-2 text-right">Liquidation</th>
                      <th className="py-2 px-2 text-right">Unreal. P&L</th>
                      <th className="py-2 px-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openWithPnl.map((order) => {
                      const { tpStatus, slStatus } = getTpSlStatus(order);
                      const sym = (order.asset || "BTC").replace("USDT", "");
                      const p = latestPrices[sym as keyof LivePrices];
                      const currentPrice = p
                        ? order.type === "buy"
                          ? p.bid
                          : p.ask
                        : 0;
                      const liquidationDistance = order.liquidationPrice
                        ? Math.abs(currentPrice - order.liquidationPrice) /
                          order.liquidationPrice
                        : 1;

                      let rowStatus = "normal";
                      if (tpStatus === "hit" || slStatus === "hit") {
                        rowStatus = "executed";
                      } else if (
                        tpStatus === "close" ||
                        slStatus === "close" ||
                        liquidationDistance < 0.05
                      ) {
                        rowStatus = "warning";
                      }

                      return (
                        <tr
                          key={order.orderId}
                          className={`border-b border-[#263136]/40 hover:bg-[#1c2a31] ${
                            rowStatus === "executed"
                              ? "bg-green-500/5"
                              : rowStatus === "warning"
                              ? "bg-yellow-500/5"
                              : ""
                          }`}
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
                            {order.takeProfit ? (
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-green-400 font-medium">
                                  ${toDisplayPrice(order.takeProfit)}
                                </span>
                                {(() => {
                                  const { tpStatus } = getTpSlStatus(order);
                                  if (tpStatus === "hit") {
                                    return (
                                      <span className="text-green-500 text-xs">
                                        ✓
                                      </span>
                                    );
                                  } else if (tpStatus === "close") {
                                    return (
                                      <span className="text-yellow-500 text-xs animate-pulse">
                                        !
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            ) : (
                              <span className="text-white/40 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {order.stopLoss ? (
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-red-400 font-medium">
                                  ${toDisplayPrice(order.stopLoss)}
                                </span>
                                {(() => {
                                  const { slStatus } = getTpSlStatus(order);
                                  if (slStatus === "hit") {
                                    return (
                                      <span className="text-red-500 text-xs">
                                        ✓
                                      </span>
                                    );
                                  } else if (slStatus === "close") {
                                    return (
                                      <span className="text-yellow-500 text-xs animate-pulse">
                                        !
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            ) : (
                              <span className="text-white/40 text-xs">—</span>
                            )}
                          </td>
                          <td className="py-2 px-2 text-right">
                            {order.liquidationPrice ? (
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-orange-400 font-medium">
                                  ${toDisplayPrice(order.liquidationPrice)}
                                </span>
                                {(() => {
                                  const sym = (order.asset || "BTC").replace(
                                    "USDT",
                                    ""
                                  );
                                  const p =
                                    latestPrices[sym as keyof LivePrices];
                                  if (!p) return null;
                                  const currentPrice =
                                    order.type === "buy" ? p.bid : p.ask;
                                  const distance =
                                    Math.abs(
                                      currentPrice - order.liquidationPrice
                                    ) / order.liquidationPrice;
                                  if (distance < 0.05) {
                                    return (
                                      <span className="text-red-500 text-xs animate-pulse">
                                        ⚠
                                      </span>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            ) : (
                              <span className="text-white/40 text-xs">—</span>
                            )}
                          </td>
                          <td
                            className={`py-2 px-2 text-right font-medium ${
                              order.pnlUsd >= 0
                                ? "text-green-500"
                                : "text-[#EB483F]"
                            }`}
                          >
                            {order.pnlUsd >= 0 ? "+" : ""}
                            {toDisplayPriceUSD(order.pnlUsd)} USD
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-white/50">
                No open positions
              </div>
            )}
          </>
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
