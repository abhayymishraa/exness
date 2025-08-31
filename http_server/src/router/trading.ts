import { Router } from "express";

export const tradingRouter = Router();

tradingRouter.post("/order/open/:orderID", (req, res) => {
  const query = req.query;
  const orderID = req.params;
});

tradingRouter.post("/order/close/:orderID", (req, res) => {
  const query = req.query;
  const orderID = req.params;
});

tradingRouter.post("/orders", (req, res) => {
  const query = req.query;
});
