enum Channels {
  BITCOIN,
  ETHEREUM,
    
}


export function pushToRedis(redis: any, value: any, type: any,  ) {
  redis.publish(
    "ask_bids",
    JSON.stringify({
      ask: value - (2.5 / 100) * value,
      bid: value,
    })
  );
}
