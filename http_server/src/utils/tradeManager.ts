import { ORDERS, PRICESTORE } from "../data";
import { RedisManager } from "./redisClient";
import { v4 } from "uuid";

export interface Tradeoptions {
  assset: string;
  type: ordertype;
  margin: number;
  leverage: number; //1, 5, 10,........more nn
}
export type ordertype = "buy" | "sell";

export class TradeManager {
  private static instance: TradeManager;
  private redis: RedisManager;

  private constructor(redis: RedisManager) {
    this.redis = redis;
  }

  static async getInstance() {
    if (!this.instance) {
      const redis = await RedisManager.getInstance();
      this.instance = new TradeManager(redis);
    }
    return this.instance;
  }

  async createOrder(user: string, payload: Tradeoptions) {
    const { assset, type, margin, leverage } = payload;
    const pricedata = PRICESTORE[assset];

    if (!assset || !type || !leverage || !margin || !pricedata) {
      throw { status: 411, message: "Incorrect inputs" };
    }

    const orderid = v4();
    ORDERS[orderid] = {
      orderid,
      userId,
      assset,
      type,
      margin,
      leverage,
      pricedata,
      status: "OPEN",
    };

    user.balance.usd_balance -= margin;
  }
}
