"use client";
import React, { useEffect, useRef, useState } from "react";
import { trpc } from "../../utils/trpc";

export default function Home() {
  const [wsMessage, setWsMessage] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const marketData = trpc.data.getMarketData.useQuery();

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3002");

    wsRef.current.onopen = () => {
      console.log("WebSocket connection established.");
    };

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "marketData") {
          setWsMessage(msg.message);
        }
      } catch (err) {
        setWsMessage(event.data);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  if (marketData.isLoading) return <div>Loading market data...</div>;
  if (marketData.isError) {
    console.error("TRPC Error:", marketData.error);
    return <div>Error: {marketData.error.message}</div>;
  }

  return (
    <div>
      <h1>Market Data Binance : Ws</h1>
      <p>tRPC: {marketData.data}</p>
      <p>WebSocket: {wsMessage}</p>
    </div>
  );
}
