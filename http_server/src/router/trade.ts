import { Router, NextFunction, Request, Response } from "express";
import { CustomError } from "../middleware/errorHandler";
import { usermiddleware } from "../middleware";
import { CLOSEDORDERS, ORDERS, PRICESTORE, USERS } from "../data";
import { tradeSchema } from "../types/userschema";
import { v4 } from "uuid";
import { USD_SCALE, calculatePnlCents } from "../utils/utils";
import { closeOrder } from "../utils/tradeUtils";

export const tradeRouter = Router();

tradeRouter.post("/", usermiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tradeschema = tradeSchema.safeParse(req.body);
    if (!tradeschema.success) {
      return next(new CustomError("Incorrect inputs", 400, "INVALID_INPUT"));
    }
    let { asset, type, margin, leverage, takeProfit, stopLoss } =
      tradeschema.data;

    //@ts-ignore
    const userid = req.userId;
    const user = USERS[userid];

    if (!user) {
      return next(new CustomError("User not found", 404, "USER_NOT_FOUND"));
    }

    if (asset && asset.endsWith("USDT")) {
      asset = asset.replace("USDT", "") as any;
    }

    const basePriceData = PRICESTORE[asset];
    const openPrice = type === "buy" ? basePriceData?.ask : basePriceData?.bid;

    if (!openPrice || user.balance.usd_balance < margin) {
      return next(new CustomError("Invalid asset or insufficient funds", 400, "INSUFFICIENT_FUNDS"));
    }

    user.balance.usd_balance -= margin;

    const orderid = v4();

    // Compute liquidation price: when unrealized PnL <= -margin
    // PnL = ((close - open) / open) * (margin * leverage)
    // Set liquidation where PnL = -margin -> ((close - open)/open) * leverage = -1
    // => close = open * (1 - 1/leverage) for long; for short, close = open * (1 + 1/leverage)
    // Formula for long: close = open * (1 - 1 / leverage)
    // This calculates the price at which the loss equals 100% of the margin.
    const liquidationPrice =
      type === "buy"
        ? Math.floor((openPrice as number) * (1 - 1 / leverage))
        : // Formula for short: close = open * (1 + 1 / leverage)
          Math.floor((openPrice as number) * (1 + 1 / leverage));

    const order = {
      type,
      margin,
      leverage,
      asset,
      openPrice: openPrice as number,
      timestamp: Date.now(),
      takeProfit: takeProfit ? Math.round(takeProfit * 10000) : undefined,
      stopLoss: stopLoss ? Math.round(stopLoss * 10000) : undefined,
      liquidationPrice,
    };

    if (!ORDERS[userid]) {
      ORDERS[userid] = {};
    }
    ORDERS[userid][orderid] = order;

    return res.status(200).json({ orderId: orderid });
  } catch (error) {
    console.error("Trade creation error:", error);
    next(new CustomError("Server error during trade creation", 500, "INTERNAL_SERVER_ERROR"));
  }
    console.log("error while trade", e);
    return res
      .status(500)
      .json({ message: "Server error during trade creation" });
  }
});

tradeRouter.post("/close", usermiddleware, (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderid } = req.body;
    //@ts-ignore
    const userid = req.userId;
    if (!ORDERS[userid] || !ORDERS[userid][orderid]) {
      return next(new CustomError("Order not found", 404, "ORDER_NOT_FOUND"));
    }

    const pnl = closeOrder(userid, orderid, "manual");

    return res.status(200).json({
      message: "Position closed successfully",
      pnl: pnl,
    });
  } catch (error) {
    console.error("Order closing error:", error);
    next(new CustomError("Something went wrong", 500, "INTERNAL_SERVER_ERROR"));
  }
    console.log("Err", e);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
