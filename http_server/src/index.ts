import express from "express";
import cors from "cors";
import { Client } from "pg";
import { userRouter } from "./router/user";
import { RedisManager } from "./utils/redisClient";
import { PRICESTORE } from "./data";
import { candelrouter } from "./router/candles";
import { tradesRouter } from "./router/trades";
import { assetrouter } from "./router/asset";
import { tradeRouter } from "./router/trade";

const port = 5000;

export const pgClient = new Client({
  host: "localhost",
  port: 5433,
  user: "user",
  password: "XYZ@123",
  database: "trades_db",
});

await pgClient.connect();

export const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
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
      PRICESTORE[asset] = { ask: data.sellPrice, bid: data.buyPrice };
    });
  });
  setInterval(() => {
    console.log(PRICESTORE);
  }, 20_000);
}

startpriceuddate();

app.listen(port, () => {
  console.log(`App is listening on the port : ${port}`);
});
