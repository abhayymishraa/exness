import { Router } from "express";
import { usermiddleware } from "../middleware";
import { ORDERS } from "../data";

export const tradingRouter = Router();

tradingRouter.post("/open", usermiddleware, (req, res) => {
  //@ts-ignore
  const userid = req.userId;
  if (!ORDERS[userid]) {
    return res.status(200).json({
      trades: [],
    });
  }

  const formattedTrades = Object.entries(ORDERS[userid]).map(
    ([orderId, order]) => ({
      orderId,
      type: order.type,
      margin: order.quantity,
      openPrice: order.price,
      asset: order.asset,
    })
  );

  return res.status(200).json({
    trades: formattedTrades,
  });
});

tradingRouter.get("/", usermiddleware, (req, res) => {
  //@ts-ignore
  const userid = req.userId;
});

tradingRouter.post("/orders", (req, res) => {
  const query = req.query;
});
