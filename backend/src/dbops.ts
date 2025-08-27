import prisma from "./dbconfig";

export async function processandSavetrade(params: any, price: any) {
  try {
    const data = await prisma.trade.create({
      data: {
        symbol: params.s,
        price:  price,
        tradeId: BigInt(params.a),
        timestamp: new Date(params.T),
      },
    });
    console.log("data is updated :", data);

  } catch (e) {
    console.log(`error while pushing in the db ${e}`);
  }
}