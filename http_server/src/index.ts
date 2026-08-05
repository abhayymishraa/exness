import express from "express";
import cors from "cors";
import { Client } from "pg";
import { userRouter } from "./router/user";
import { RedisManager } from "./utils/redisClient";
import { CLOSEDORDERS, ORDERS, PRICESTORE, USERS } from "./data";
import { calculatePnlCents } from "./utils/utils";
import { candelrouter } from "./router/candles";
import { tradesRouter } from "./router/trades";
import { assetrouter } from "./router/asset";
import { tradeRouter } from "./router/trade";
import { checkOpenPositions } from "./service/orderschecker";

const port = Number(process.env.PORT ?? 5000);

export const pgClient = new Client({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://user:XYZ%40123@localhost:5432/trades_db",
});

await pgClient.connect();

export const app = express();
app.use(express.json());
app.use(
  cors({
    origin: (process.env.CORS_ORIGINS ?? "http://localhost:3000").split(","),
    credentials: true,
  }),
);

app.use("/api/v1/trades", tradesRouter);
app.use("/api/v1/trade", tradeRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/candles", candelrouter);
app.use("/api/v1/asset", assetrouter);

async function startpriceuddate() {
  const redis = await RedisManager.getInstance();
  ["BTC", "ETH", "SOL"].forEach(async (asset) => {
    await redis.subscribe(asset, (msg: string) => {
      const data = JSON.parse(msg);
      PRICESTORE[asset] = { ask: data.askPrice, bid: data.bidPrice };
      checkOpenPositions(asset, { ask: data.askPrice, bid: data.bidPrice });
    });
  });
  setInterval(() => {
    console.log("PRICESTORE", PRICESTORE);
  }, 20000);
}

startpriceuddate();

app.listen(port, () => {
  console.log(`App is listening on the port : ${port}`);
});
