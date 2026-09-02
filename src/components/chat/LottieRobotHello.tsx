"use client";

import robotHelloData from "@/assets/animations/RobotHello.json";
import { Bot } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function LottieRobotHello({
  size = 72,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const [PlayerComponent, setPlayerComponent] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    import("@lottiefiles/react-lottie-player")
      .then((mod) => {
        setPlayerComponent(() => mod.Player);
      })
      .catch((err) => {
        console.error("Failed to load Lottie player", err);
      });
  }, []);

  if (!hasMounted) {
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`flex items-center justify-center ${className}`}
      >
        <Bot className="size-8 text-primary animate-pulse" />
      </div>
    );
  }

  if (PlayerComponent) {
    const Player = PlayerComponent;
    return (
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={`relative flex items-center justify-center pointer-events-none ${className}`}
      >
        <Player
          autoplay
          loop
          src={robotHelloData}
          style={{ height: `${size}px`, width: `${size}px` }}
        />
      </div>
    );
  }

  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`flex items-center justify-center ${className}`}
    >
      <Bot className="size-8 text-primary" />
    </div>
  );
}
