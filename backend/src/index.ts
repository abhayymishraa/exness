import { WebSocket } from "ws";
import { processandSavetrade } from "./dbops";

const ws = new WebSocket("wss://stream.binance.com:9443/ws");

ws.on("open", () => {
  console.log("Connected to the redis db stream of binance ");
  ws.send(
    JSON.stringify({
      method: "SUBSCRIBE",
      params: ["btcusdt@bookTicker", "btcusdt@aggTrade"],
      id: 1,
    })
  );
});

ws.on("message", (data: string) => {
  const messages = JSON.parse(data);
  if (messages.e === "aggTrade") {
    processandSavetrade(messages);
  }
});

ws.on("error", (err) => {
  console.log("error form the websocket" + err);
});

ws.on("close", () => {
  console.log("server is closed ");
});
