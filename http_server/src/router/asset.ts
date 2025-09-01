import { Router } from "express";
import { PRICESTORE } from "../data";

export const assetrouter = Router()

assetrouter.get("/", async (req, res) => {
  const assetDetails = [
    {
      name: "Bitcoin",
      symbol: "BTC",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    },
    {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    },
    {
      name: "Solana",
      symbol: "SOL",
      decimals: 4,
      imageUrl: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  ];

  const responseAssets = assetDetails.map((asset) => {
    const priceData = PRICESTORE[asset.symbol];

    if (!priceData) {
      return {
        name: asset.name,
        symbol: asset.symbol,
        buyPrice: 0,
        sellPrice: 0,
        decimals: asset.decimals,
        imageUrl: asset.imageUrl,
      };
    }

    return {
      name: asset.name,
      symbol: asset.symbol,
      buyPrice: priceData?.ask, //buy price is(more one)
      sellPrice: priceData?.bid, // seel price
      decimals: asset.decimals,
      imageUrl: asset.imageUrl,
    };
  });

  res.status(200).json({ assets: responseAssets });
});