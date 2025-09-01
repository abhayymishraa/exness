import { fromInternalPrice } from "./utils";

type SymbolMapKey = "SOLUSDT" | "ETHUSDT" | "BTCUSDT";

export function pushToRedis(
  redis: any,
  value: any,
  type: SymbolMapKey,
  time: any,
) {
  let symbolmap = {
    SOLUSDT: "SOL",
    ETHUSDT: "ETH",
    BTCUSDT: "BTC",
  };
  //float
  const realVal = fromInternalPrice(value);
  const ask = Number((realVal * 1.01).toFixed(2));
  const bid = Number(realVal.toFixed(2));

  redis.publish(
    symbolmap[type],
    JSON.stringify({
      ask,
      bid,
      symbol: symbolmap[type],
      time: Math.floor(new Date(time).getTime() / 1000),
    }),
  );
}
