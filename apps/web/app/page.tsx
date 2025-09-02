"use client";

import { trpc } from "../utils/trpc";

export default function Home() {
  const marketData = trpc.data.getMarketData.useQuery();

  if (marketData.isLoading) return <div>Loading todos...</div>;
  if (marketData.isError) {
    console.error("TRPC Error:", marketData.error);
    return <div>Error: {marketData.error.message}</div>;
  }
  console.log(marketData);

  return (
    <div>
      <h1>Market Data Binance</h1>
      <p>{marketData.data}</p>
    </div>
  );
}
