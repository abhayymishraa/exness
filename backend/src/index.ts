import { WebSocket } from "ws";
import { createClient } from "redis";
import { processandSavetrade } from "./dbops";
import { pushToRedis } from "./redisops";
import { getPrecisedData, getRealValue } from "./utils";

async function main() {
  const redis = await createClient().connect();
  const ws = new WebSocket("wss://stream.binance.com:9443/ws");
  console.log("redis is connected");

  ws.on("open", () => {
    console.log("Connected to the redis db stream of binance ");
    ws.send(
      JSON.stringify({
        method: "SUBSCRIBE",
        params: ["btcusdt@aggTrade"],
        id: 1,
      })
    );
  });

  ws.on("message", (data: string) => {
    const messages = JSON.parse(data);
    if (messages.e === "aggTrade") {
      const intPrice = getPrecisedData(messages.p);
      pushToRedis(redis, getRealValue(intPrice));
      processandSavetrade(messages, intPrice);
    }
  });

  ws.on("error", (err) => {
    console.log("error form the websocket" + err);
  });

  ws.on("close", () => {
    console.log("server is closed ");
  });
}

main();
