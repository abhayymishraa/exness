import { WebSocket } from "ws";
import { createClient } from "redis";
import { pushToRedis } from "./redisops";
import { toInternalPrice } from "./utils";
import { savetradeBatch } from "./dbops";

const BATCH_TIMINIGS = 10000; //ms
let tradeBatch: any = [];

async function main() {
  const redis = await createClient({
    url: process.env.REDIS_URL ?? "redis://localhost:6379",
  }).connect();
  console.log("redis is connected");

  const batchprocess = setInterval(() => {
    const batchsave = [...tradeBatch];
    tradeBatch = [];
    savetradeBatch(batchsave);
  }, BATCH_TIMINIGS);

  const ws = new WebSocket("wss://stream.binance.com:9443/ws");
  ws.on("open", () => {
    console.log("Connected to the redis db stream of binance ");
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: ["btcusdt@aggTrade", "ethusdt@aggTrade", "solusdt@aggTrade"],
        id: 1,
      }),
    );
  });

  ws.on("message", (data: string) => {
    const messages = JSON.parse(data);
    if (messages.e === "aggTrade") {
      const intPrice = toInternalPrice(messages.p);
      const intQty = toInternalPrice(messages.q);

      pushToRedis(redis, intPrice, messages.s, new Date(messages.T));
      tradeBatch.push({
        symbol: messages.s,
        price: intPrice,
        tradeId: BigInt(messages.a),
        timestamp: new Date(messages.T),
        quantity: intQty,
      });
    }
  });

  // Binance drops the stream routinely. Flush, then EXIT so systemd restarts us —
  // returning leaves the process alive on a dead socket, `is-active` says running,
  // and it publishes nothing forever. ponytail: no reconnect+backoff, RestartSec=5
  // covers it. `ws` always emits close after error, so close alone drives this.
  ws.on("error", (err) => console.log("binance stream error: " + err));
  ws.on("close", async () => {
    console.log("binance stream closed, flushing and exiting for restart");
    clearInterval(batchprocess);
    try {
      await savetradeBatch(tradeBatch);
    } catch (e) {
      console.log("final batch save failed: " + e);
    }
    process.exit(1);
  });
}

main();
