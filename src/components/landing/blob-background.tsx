"use client";

import { useEffect, useState } from "react";

const bubbles = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 20 + Math.random() * 50,
  left: Math.random() * 100,
  delay: Math.random() * 8,
  duration: 10 + Math.random() * 15,
  opacity: 0.2 + Math.random() * 0.3,
}));

export function BlobBackground() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute"
        style={{
          width: "600px", height: "600px", borderRadius: "50%",
          filter: "blur(80px)", opacity: 0.35,
          background: "radial-gradient(circle, #a0f0d0, #4dd9f5)",
          top: "-100px", left: "-150px",
          animation: "float-drift 14s ease-in-out infinite",
        }}
      />
      <div
        className="absolute"
        style={{
          width: "500px", height: "500px", borderRadius: "50%",
          filter: "blur(80px)", opacity: 0.35,
          background: "radial-gradient(circle, #b8eaff, #72c8f8)",
          bottom: "-100px", right: "-100px",
          animation: "float-drift 16s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
      <div
        className="absolute"
        style={{
          width: "350px", height: "350px", borderRadius: "50%",
          filter: "blur(80px)", opacity: 0.3,
          background: "radial-gradient(circle, #d0f8e8, #8de8f5)",
          top: "40%", left: "50%",
          transform: "translate(-50%,-50%)",
          animation: "float-drift 18s ease-in-out infinite",
          animationDelay: "1.5s",
        }}
      />
      {mounted && bubbles.map((b) => (
        <div
          key={b.id}
          className="absolute"
          style={{
            width: b.size, height: b.size,
            borderRadius: "50%",
            left: `${b.left}%`,
            bottom: "-10%",
            background: "radial-gradient(circle at 30% 24%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 50%, transparent 70%)",
            border: "1px solid rgba(255,255,255,0.5)",
            boxShadow: "inset 0 1px 4px rgba(255,255,255,0.5)",
            animation: `bubble-rise ${b.duration}s ease-in infinite`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </div>
  );
}
