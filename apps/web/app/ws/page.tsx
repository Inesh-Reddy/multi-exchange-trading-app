"use client";
import React, { useEffect, useRef, useState } from "react";

export default function Home() {
  const [wsMessage, setWsMessage] = useState<any>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsRef.current = new WebSocket("ws://localhost:3000/md");

    wsRef.current.binaryType = "arraybuffer";

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket connected");
      wsRef.current?.send(
        JSON.stringify({ action: "subscribe", symbols: ["BTCUSDT"] }),
      );
    };

    wsRef.current.onmessage = (event) => {
      try {
        if (event.data instanceof ArrayBuffer) {
          console.log("🔹 got binary data:", event.data.byteLength, "bytes");
        } else {
          const msg = JSON.parse(event.data);
          if (msg.type === "marketData") {
            setWsMessage(msg.payload);
          } else {
            console.log("Other msg:", msg);
          }
        }
      } catch (err) {
        console.error("❌ Failed to parse WS message:", err);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    wsRef.current.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  return (
    <div>
      <h1>Market Data (Binance → WS → Frontend)</h1>
      {wsMessage ? (
        <pre>{JSON.stringify(wsMessage, null, 2)}</pre>
      ) : (
        <p>Waiting for trades…</p>
      )}
    </div>
  );
}
