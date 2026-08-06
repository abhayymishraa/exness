export const USERS: Record<
  string,
  {
    email: string;
    password: string;
    balance: { usd_balance: number };
    assets: Record<string, number>;
    /** epoch ms, mirrored from the Neon row so /user/me needs no query */
    createdAt: number;
  }
> = {};

// Refuse to boot in production rather than silently signing every JWT with a
// value that is public in git history.
if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is required when NODE_ENV=production");
}
export const SECRET = process.env.JWT_SECRET ?? "dev-only-insecure-secret";

export const ORDERS: Record<
  string,
  Record<
    string,
    {
      type: "buy" | "sell";
      margin: number; // cents
      leverage: number;
      asset: string; // BTC/ETH/SOL
      openPrice: number; // PRICE_SCALE
      timestamp: number;
      takeProfit?: number; // PRICE_SCALE
      stopLoss?: number; // PRICE_SCALE
      liquidationPrice?: number; // PRICE_SCALE
    }
  >
> = {};

export const PRICESTORE: Record<string, { bid: number; ask: number }> = {};

export const CLOSEDORDERS: Record<
  string,
  Record<
    string,
    {
      type: "buy" | "sell";
      margin: number;
      leverage: number;
      asset: string;
      openPrice: number;
      closePrice: number;
      pnl: number;
      timestamp: number;
      closeTimestamp: number;
      closeReason: "manual" | "take_profit" | "stop_loss" | "liquidation";
    }
  >
> = {};
