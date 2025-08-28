import { createClient } from "redis";
import { WebSocketServer, WebSocket } from "ws";

const redis = createClient();
const websocket = new WebSocketServer({ port: 8080 });
const client = new Set<WebSocket>();

const start = async () => {
  await redis.connect();

  await redis.subscribe("ask_bids", (data) => {
    client.forEach((e: WebSocket) => {
      e.send(JSON.stringify(data));
    });
  });

    websocket.on("connection", (ws: WebSocket) => {
    client.add(ws);
  });
};

start().catch(console.error);
