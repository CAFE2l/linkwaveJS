"use client";

import { useEffect, useRef } from "react";

export function StarCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W: number, H: number;
    let stars: Star[] = [];
    let shooters: Shooter[] = [];
    let t = 0;
    let rafId: number;

    type Star = { x: number; y: number; r: number; base: number; spd: number; ph: number; blue: boolean };
    type Shooter = { x: number; y: number; len: number; spd: number; alpha: number; ang: number };

    function resize() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
    }

    function mkStars(n: number) {
      stars = Array.from({ length: n }, () => {
        const s = Math.random();
        return {
          x: Math.random() * W,
          y: Math.random() * H,
          r: 0.3 + s * 1.5,
          base: 0.2 + s * 0.6,
          spd: 0.003 + s * 0.01,
          ph: Math.random() * Math.PI * 2,
          blue: Math.random() > 0.65,
        };
      });
    }

    function spawnShooter() {
      shooters.push({
        x: Math.random() * W * 0.85,
        y: Math.random() * H * 0.35,
        len: 90 + Math.random() * 130,
        spd: 7 + Math.random() * 9,
        alpha: 1,
        ang: Math.PI / 5 + (Math.random() - 0.5) * 0.35,
      });
    }

    function scheduleShooter() {
      setTimeout(() => {
        spawnShooter();
        scheduleShooter();
      }, 2000 + Math.random() * 5000);
    }

    function draw() {
      ctx!.clearRect(0, 0, W, H);
      t += 0.016;

      for (const s of stars) {
        const a = s.base + Math.sin(t * s.spd * 60 + s.ph) * (s.base * 0.55);
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = s.blue ? `rgba(180,215,255,${a})` : `rgba(255,255,255,${a})`;
        ctx!.fill();
      }

      shooters = shooters.filter((s) => s.alpha > 0);
      for (const s of shooters) {
        const dx = Math.cos(s.ang) * s.len;
        const dy = Math.sin(s.ang) * s.len;
        const g = ctx!.createLinearGradient(s.x, s.y, s.x - dx, s.y - dy);
        g.addColorStop(0, `rgba(200,230,255,${s.alpha})`);
        g.addColorStop(1, "rgba(200,230,255,0)");
        ctx!.beginPath();
        ctx!.moveTo(s.x, s.y);
        ctx!.lineTo(s.x - dx, s.y - dy);
        ctx!.strokeStyle = g;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();
        s.x += Math.cos(s.ang) * s.spd;
        s.y += Math.sin(s.ang) * s.spd;
        s.alpha -= 0.02;
      }

      rafId = requestAnimationFrame(draw);
    }

    resize();
    mkStars(300);
    scheduleShooter();
    draw();

    const onResize = () => { resize(); mkStars(300); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none decoration-canvas absolute inset-0 z-[-1]"
    />
  );
}
