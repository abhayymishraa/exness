type SymbolMapKey = "SOLUSDT" | "ETHUSDT" | "BTCUSDT";

export function pushToRedis(
  redis: any,
  value: any,
  type: SymbolMapKey,
  time: any
) {
  let symbolmap = {
    SOLUSDT: "SOL",
    ETHUSDT: "ETH",
    BTCUSDT: "BTC",
  };

  redis.publish(
    symbolmap[type],
    JSON.stringify({
      ask: value + 0.01 * value,
      bid: value,
      symbol: symbolmap[type],
      time: Math.floor(new Date(time).getTime() / 1000),
    })
  );

  console.log("pubslished on the redis", symbolmap[type]);
}
