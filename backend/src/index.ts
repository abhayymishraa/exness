import { WebSocket } from "ws";
import { createClient } from "redis";
import { pushToRedis } from "./redisops";
import { getPrecisedData, getRealValue } from "./utils";
import { savetradeBatch } from "./dbops";

const BATCH_TIMINIGS = 10000; //ms
let tradeBatch: any = [];

async function main() {
  const redis = await createClient().connect();
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
      })
    );
  });

  ws.on("message", (data: string) => {
    const messages = JSON.parse(data);
    if (messages.e === "aggTrade") {
      const intPrice = getPrecisedData(messages.p);
      pushToRedis(redis, getRealValue(intPrice));
      tradeBatch.push({
        symbol: messages.s,
        price: intPrice,
        tradeId: BigInt(messages.a),
        timestamp: new Date(messages.T),
      });
    }
  });

  ws.on("error", (err) => {
    console.log("error form the websocket" + err);
  });

  ws.on("close", () => {
    console.log("server is closed ");
    clearInterval(batchprocess);
    savetradeBatch(tradeBatch);
  });
}

main();
