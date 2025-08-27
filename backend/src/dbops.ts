import prisma from "./dbconfig";
import { getPrecisedData } from "./utils";

export async function processandSavetrade(params: any) {
  try {
    const data = await prisma.trade.create({
      data: {
        symbol: params.s,
        price:  getPrecisedData(params.p),
        tradeId: BigInt(params.a),
        timestamp: new Date(params.T),
      },
    });
    console.log("data is updated :", data);
  } catch (e) {
    console.log(`error while pushing in the db ${e} `);
  }
}
