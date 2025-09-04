import { Router } from "express";
import { usermiddleware } from "../middleware";
import { CLOSEDORDERS, ORDERS, PRICESTORE, USERS } from "../data";
import { tradeSchema } from "../types/userschema";
import { v4 } from "uuid";
import { USD_SCALE } from "../utils/utils";

export const tradeRouter = Router();

tradeRouter.post("/", usermiddleware, async (req, res) => {
  try {
    const tradeschema = tradeSchema.safeParse(req.body);
    if (!tradeschema.success) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
    const { asset, type, margin, leverage } = tradeschema.data;

    //@ts-ignore
    const userid = req.userId;

    const user = USERS[userid];

    if (!user) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }
    const basePrice = PRICESTORE[asset];

    const currentprice =
      type === "buy"
        ? basePrice?.ask
          ? Number(basePrice.ask)
          : 0
        : basePrice?.bid
        ? Number(basePrice.bid)
        : 0;

    if (user.balance.usd_balance < margin) {
      return res.status(411).json({
        message: "Incorrect inputs",
      });
    }

    if (type === "buy") {
      user.balance.usd_balance -= margin;
    } else {
      user.balance.usd_balance += margin;
    }

    const orderid = v4();

    const order = {
      type,
      margin, // 2 decimals
      leverage,
      asset,
      openPrice: currentprice as number,
      timestamp: Date.now(),
    };

    if (!ORDERS[userid]) {
      ORDERS[userid] = {};
    }

    ORDERS[userid][orderid] = order;

    return res.status(200).json({
      orderId: orderid,
    });
  } catch (e) {
    console.log("eror while trade", e);
    return res.status(411).json({
      message: "Incorrect inputs",
    });
  }
});

tradeRouter.post("/close", usermiddleware, (req, res) => {
  try {
    const { orderid } = req.body;
    //@ts-ignore
    const userid = req.userId;
    if (!ORDERS[userid] || !ORDERS[userid][orderid]) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order = ORDERS[userid][orderid];
    const user = USERS[userid];

    const price = PRICESTORE[order.asset];
    if (!price || !user) {
      return res.status(411).json({
        message: "No matched asset found in price",
      });
    }
    // long (buy first)
    // short (sell first)
    // agar user ne buy kiya tha ask ke price me to wo bid ke price me wo order close krega
    // vice versal for sell if user ne sell kiya hai to closekrega wo current price pe jo ki added margin wla hai
    const closeprice = order.type === "buy" ? price?.bid : price?.ask;

    let pnl = 0;
    const totalamountwithleveraged = order.margin * order.leverage * USD_SCALE;
    if (order.type === "buy") {
      // difference
      const pricechange = closeprice! - order.openPrice;
      // () in bracket part we have just calculated the loss/proft percent that happened during trade and usme then we multiply leveragedamount(eposed totoal)
      // like if profit hua hai to () ye percentage deta hai, but percentage represent kr rha h exposed value pr mtlb exposed me kitna profit hua hai
      pnl = (pricechange / order.openPrice) * totalamountwithleveraged;
    } else {
      const pricechange = order.openPrice - closeprice!;
      pnl = (pricechange / order.openPrice) * totalamountwithleveraged;
    }
    user.balance.usd_balance += order.margin + Math.round(pnl / USD_SCALE);

    if (!CLOSEDORDERS[userid]) CLOSEDORDERS[userid] = {};
    CLOSEDORDERS[userid][orderid] = {
      ...order,
      closePrice: closeprice,
      pnl: Math.round(pnl / USD_SCALE),
      closeTimestamp: Date.now(),
    };

    delete ORDERS[userid][orderid];

    return res.status(200).json({
      message: "Positio closed success",
      pnl: Math.round(pnl / USD_SCALE),
    });
  } catch (e) {
    console.log("Err", e);
    return res.status(411).json({
      message: "Something went down",
    });
  }
});
