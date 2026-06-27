"use client";

import { Monitor, Smartphone } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

export function Showcase() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 md:py-28">
      <MotionReveal className="text-center">
        <span className="glass-tag">Preview</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight md:text-4xl text-ocean">
          Veja como fica
        </h2>
        <p className="mt-3 text-base text-muted max-w-md mx-auto">
          Seus links organizados com estilo em qualquer tela.
        </p>
      </MotionReveal>

      <div className="mt-14 grid md:grid-cols-2 gap-8 items-start">
        <MotionReveal variant="left" delay={0.1}>
          <div className="glass-card-strong p-5">
            <div className="flex items-center gap-2 mb-4">
              <Monitor size={16} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Desktop</span>
            </div>
            <div className="rounded-2xl overflow-hidden bg-white/40 border border-white/60">
              <div className="h-32 bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
              </div>
              <div className="px-6 pb-6 -mt-12">
                <div className="w-20 h-20 rounded-full border-[3px] border-white bg-gradient-to-br from-cyan-300 via-blue-300 to-green-300 shadow-lg mx-auto" />
                <div className="text-center mt-2">
                  <p className="font-black text-base text-ocean">itsluca.s</p>
                  <p className="text-sm text-muted font-semibold">criador digital</p>
                </div>
                <div className="mt-4 space-y-2.5 max-w-xs mx-auto">
                  {["Instagram", "YouTube", "Meu Site", "Portfólio"].map((l, i) => (
                    <div key={l} className={`h-10 rounded-xl bg-white/80 border border-white/90 flex items-center justify-center text-xs font-black text-gray-700 shadow-sm ${i < 3 ? "" : "opacity-60"}`}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        <MotionReveal variant="right" delay={0.2}>
          <div className="glass-card-strong p-5">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone size={16} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Mobile</span>
            </div>
            <div className="flex justify-center">
              <div className="w-[200px] h-[400px] rounded-[36px] overflow-hidden bg-gradient-to-b from-blue-50 to-cyan-50 border-2 border-white/60 shadow-lg relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-b-xl z-10" />
                <div className="h-24 bg-gradient-to-r from-cyan-400 via-blue-400 to-green-400">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                </div>
                <div className="mx-auto -mt-8 w-12 h-12 rounded-full border-[3px] border-white bg-gradient-to-br from-cyan-300 via-blue-300 to-green-300 shadow-lg flex items-center justify-center text-white text-sm font-black">
                  L
                </div>
                <div className="text-center mt-1 px-3">
                  <p className="font-black text-xs text-gray-800">itsluca.s</p>
                  <p className="text-[10px] text-gray-500 font-semibold">criador digital</p>
                </div>
                <div className="px-4 mt-2.5 space-y-2">
                  {["Instagram", "YouTube", "Meu Site", "Portfólio"].map((l, i) => (
                    <div key={l} className={`h-7 rounded-lg bg-white/80 border border-white/90 flex items-center justify-center text-[10px] font-black text-gray-700 shadow-sm ${i < 3 ? "" : "opacity-60"}`}>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
