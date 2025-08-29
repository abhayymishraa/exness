import type { Channels } from "./utils";

export function pushToRedis(redis: any, value: any, type: Channels, time: any) {
  redis.publish(
    type,
    JSON.stringify({
      ask: value - (2.5 / 100) * value,
      bid: value,
      symbol: type,
      time: Math.floor(new Date(time).getTime() / 1000),
    })
  );
}
