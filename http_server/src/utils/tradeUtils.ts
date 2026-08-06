import { CLOSEDORDERS, ORDERS, PRICESTORE, USERS } from "../data";
import { calculatePnlCents } from "./utils";
import { moveOrderToClosed } from "../store";

export async function closeOrder(
  userid: string,
  orderid: string,
  reason: "manual" | "take_profit" | "stop_loss" | "liquidation",
) {
  const order = ORDERS[userid]![orderid];
  if (!order) return;
  const user = USERS[userid];
  if (!user) return;
  const price = PRICESTORE[order.asset];
  const closeprice = order.type === "buy" ? price?.bid : price?.ask;
  if (!closeprice) return;
  const rawPnl = calculatePnlCents({
    side: order.type,
    openPrice: order.openPrice,
    closePrice: closeprice,
    marginCents: order.margin,
    leverage: order.leverage,
  });

  // A position can never lose more than its margin — that is the entire point
  // of a liquidation level. We mark against the CURRENT price, and between two
  // Binance ticks the price can jump straight past the liquidation level, so
  // the raw figure can exceed the margin. Measured on a 10x $100 position: a
  // 20% gap past liquidation returns -18000 cents, i.e. the account goes $180
  // negative. Clamp it.
  const pnl = Math.max(rawPnl, -order.margin);

  user.balance.usd_balance += order.margin + pnl;
  if (!CLOSEDORDERS[userid]) {
    CLOSEDORDERS[userid] = {};
  }
  const closed = {
    ...order,
    closePrice: closeprice,
    pnl: pnl,
    closeTimestamp: Date.now(),
    closeReason: reason,
  };
  CLOSEDORDERS[userid][orderid] = closed;
  console.log(
    `Order ${orderid} for user ${userid} closed due to ${reason}. PnL: ${pnl}`,
  );
  delete ORDERS[userid]![orderid];
  await moveOrderToClosed(orderid, userid, closed, user.balance.usd_balance);
  return pnl;
}
