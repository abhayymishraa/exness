import { PrismaClient } from "@prisma/client";
import { CLOSEDORDERS, ORDERS, USERS } from "./data";

export const prisma = new PrismaClient();

// Write-through cache. USERS/ORDERS/CLOSEDORDERS stay the read path because
// checkOpenPositions() walks every open order on every Binance tick — several
// times a second. Querying Neon there would add latency to liquidation checks
// and burn the free tier's compute allowance. So: read from memory, write to
// Neon on mutation, rebuild memory from Neon at boot.
//
// ponytail: no ORM abstraction over this. Five call sites, each one line.
// If a second consumer ever needs the same data, give it a real repository.

export async function loadState() {
  const [users, orders, closed] = await Promise.all([
    prisma.user.findMany(),
    prisma.order.findMany(),
    prisma.closedOrder.findMany(),
  ]);

  for (const u of users) {
    USERS[u.id] = {
      email: u.email,
      password: u.password,
      assets: {},
      balance: { usd_balance: Number(u.usdBalance) },
      createdAt: u.createdAt.getTime(),
    };
  }

  for (const o of orders) {
    (ORDERS[o.userId] ??= {})[o.id] = {
      type: o.type as "buy" | "sell",
      margin: Number(o.margin),
      leverage: o.leverage,
      asset: o.asset,
      openPrice: Number(o.openPrice),
      timestamp: Number(o.timestamp),
      takeProfit: o.takeProfit === null ? undefined : Number(o.takeProfit),
      stopLoss: o.stopLoss === null ? undefined : Number(o.stopLoss),
      liquidationPrice:
        o.liquidationPrice === null ? undefined : Number(o.liquidationPrice),
    };
  }

  for (const c of closed) {
    (CLOSEDORDERS[c.userId] ??= {})[c.id] = {
      type: c.type as "buy" | "sell",
      margin: Number(c.margin),
      leverage: c.leverage,
      asset: c.asset,
      openPrice: Number(c.openPrice),
      closePrice: Number(c.closePrice),
      pnl: Number(c.pnl),
      timestamp: Number(c.timestamp),
      closeTimestamp: Number(c.closeTimestamp),
      closeReason: c.closeReason as
        | "manual"
        | "take_profit"
        | "stop_loss"
        | "liquidation",
    };
  }

  console.log(
    `loaded ${users.length} users, ${orders.length} open orders, ${closed.length} closed`,
  );
}

// Writes are awaited, not fire-and-forget. They are rare — signup, open, close —
// and unordered writes race: a signup followed immediately by a trade can persist
// the order before the user row exists, and the order is silently lost to a
// foreign-key error. Only the READ path needs to stay in memory.
export function saveUser(
  id: string,
  email: string,
  password: string,
  usdBalance: number,
) {
  return prisma.user.create({
    data: { id, email, password, usdBalance: BigInt(usdBalance) },
  });
}

export function saveBalance(userId: string, usdBalance: number) {
  return prisma.user.update({
    where: { id: userId },
    data: { usdBalance: BigInt(usdBalance) },
  });
}

export function saveOrder(id: string, userId: string, o: (typeof ORDERS)[string][string]) {
  return prisma.order.create({
      data: {
        id,
        userId,
        type: o.type,
        margin: BigInt(o.margin),
        leverage: o.leverage,
        asset: o.asset,
        openPrice: BigInt(o.openPrice),
        timestamp: BigInt(o.timestamp),
        takeProfit: o.takeProfit === undefined ? null : BigInt(o.takeProfit),
        stopLoss: o.stopLoss === undefined ? null : BigInt(o.stopLoss),
      liquidationPrice:
        o.liquidationPrice === undefined ? null : BigInt(o.liquidationPrice),
    },
  });
}

// One transaction: the open order must disappear exactly when the closed one
// appears, or a restart would resurrect a position the user already closed.
export function moveOrderToClosed(
  id: string,
  userId: string,
  c: (typeof CLOSEDORDERS)[string][string],
  usdBalance: number,
) {
  return prisma.$transaction([
      // deleteMany, not delete: delete throws P2025 when the row is absent,
      // and that rejection used to take the whole process down.
      prisma.order.deleteMany({ where: { id } }),
      prisma.closedOrder.create({
        data: {
          id,
          userId,
          type: c.type,
          margin: BigInt(c.margin),
          leverage: c.leverage,
          asset: c.asset,
          openPrice: BigInt(c.openPrice),
          closePrice: BigInt(c.closePrice),
          pnl: BigInt(c.pnl),
          timestamp: BigInt(c.timestamp),
          closeTimestamp: BigInt(c.closeTimestamp),
          closeReason: c.closeReason,
        },
      }),
    prisma.user.update({
      where: { id: userId },
      data: { usdBalance: BigInt(usdBalance) },
    }),
  ]);
}
