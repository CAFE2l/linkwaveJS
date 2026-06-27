"use client";

import Image from "next/image";
import { Monitor, Smartphone, Eye, MousePointerClick, TrendingUp, Users } from "lucide-react";
import { MotionReveal } from "@/components/shared/motion-reveal";

const kpiData = [
  { label: "Visitas", value: "12.5k", change: "+18%", icon: Eye, color: "from-cyan-400 to-blue-500" },
  { label: "Cliques", value: "4.8k", change: "+24%", icon: MousePointerClick, color: "from-green-400 to-emerald-500" },
  { label: "Engajamento", value: "38%", change: "+6%", icon: TrendingUp, color: "from-purple-400 to-indigo-500" },
  { label: "Usuários", value: "2.1k", change: "+12%", icon: Users, color: "from-pink-400 to-rose-500" },
];

const chartBars = [
  { day: "Seg", h: 45 },
  { day: "Ter", h: 62 },
  { day: "Qua", h: 38 },
  { day: "Qui", h: 78 },
  { day: "Sex", h: 55 },
  { day: "Sáb", h: 88 },
  { day: "Dom", h: 72 },
];

const recentActivity = [
  { name: "Instagram", time: "2 min atrás", clicks: 12 },
  { name: "YouTube", time: "15 min atrás", clicks: 8 },
  { name: "Meu Site", time: "1h atrás", clicks: 23 },
  { name: "Portfólio", time: "3h atrás", clicks: 5 },
];

const mobileLinks = [
  { name: "Instagram", icon: "/imgs/icons/links/Instagram.png", color: "from-pink-400 to-purple-500" },
  { name: "YouTube", icon: "/imgs/icons/links/Youtube.png", color: "from-red-500 to-red-600" },
  { name: "Meu Site", icon: "/imgs/icons/links/Google Chrome.png", color: "from-blue-500 to-cyan-500" },
  { name: "WhatsApp", icon: "/imgs/icons/links/Whatsapp.png", color: "from-green-400 to-emerald-500" },
  { name: "Portfólio", icon: "/imgs/icons/links/Discord.png", color: "from-indigo-400 to-purple-500" },
];

export function Showcase() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 md:py-28" id="showcase">
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
        {/* Desktop Preview */}
        <MotionReveal variant="left" delay={0.1}>
          <div className="glass-card-strong p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Monitor size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Desktop</span>
            </div>
            <div className="dashboard-preview">
              <div className="dash-appbar">
                <div className="dash-brand">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center text-white text-[9px] font-black">L</div>
                  <strong>LinkWave</strong>
                </div>
                <div className="dash-actions">
                  <div className="dash-filter">
                    <button className="active">Hoje</button>
                    <button>7d</button>
                    <button>30d</button>
                  </div>
                  <div className="dash-user">G</div>
                </div>
              </div>
              <div className="dash-scroll">
                <div className="dash-canvas">
                  <div className="dash-intro">
                    <div>
                      <h2>Overview</h2>
                      <p>Desempenho dos seus links nos últimos dias</p>
                    </div>
                    <div className="dash-live">Ao vivo</div>
                  </div>

                  <div className="dash-kpis">
                    {kpiData.map((kpi) => (
                      <div key={kpi.label} className="exec-kpi">
                        <div className={`kpi-icon bg-gradient-to-br ${kpi.color}`}>
                          <kpi.icon size={14} className="text-white" />
                        </div>
                        <div className="kpi-label">{kpi.label}</div>
                        <div className="kpi-value">{kpi.value}</div>
                        <div className={`kpi-trend ${kpi.change.startsWith("-") ? "down" : ""}`}>{kpi.change}</div>
                      </div>
                    ))}
                  </div>

                  <div className="dash-panel chart-main">
                    <div className="panel-head">
                      <h3>Cliques por dia</h3>
                      <span>Últimos 7 dias</span>
                    </div>
                    <div className="chart-bars">
                      {chartBars.map((bar) => (
                        <div key={bar.day} className="chart-bar-col">
                          <div className="chart-bar" style={{ height: `${bar.h}%` }} />
                          <span className="chart-bar-label">{bar.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="dash-panel activity-panel">
                    <div className="panel-head">
                      <h3>Atividade</h3>
                      <span>Agora</span>
                    </div>
                    <div className="activity-list">
                      {recentActivity.map((a) => (
                        <div key={a.name} className="activity-item">
                          <div className="activity-dot" />
                          <div className="activity-copy">
                            <strong>{a.name}</strong>
                            <span>{a.time}</span>
                          </div>
                          <span className="activity-time">{a.clicks} cliques</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </MotionReveal>

        {/* Mobile Preview */}
        <MotionReveal variant="right" delay={0.2}>
          <div className="glass-card-strong p-4 md:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={15} className="text-ocean-light" />
              <span className="text-xs font-bold text-ocean-light uppercase tracking-wider">Mobile</span>
            </div>
            <div className="flex justify-center">
              <div className="mobile-preview-shell">
                <div className="mobile-preview-notch" />
                <div className="mobile-preview-banner">
                  <Image src="/imgs/banners/linkwave.png" alt="" width={200} height={80} className="w-full h-full object-cover" />
                </div>
                <div className="mobile-preview-avatar">
                  <Image src="/imgs/essentials/profile.jpg" alt="" width={40} height={40} className="w-full h-full object-cover rounded-full" />
                </div>
                <div className="mobile-preview-name">itsluca.s</div>
                <div className="mobile-preview-bio">criador digital</div>
                <div className="mobile-preview-links">
                  {mobileLinks.map((link) => (
                    <div key={link.name} className="mobile-preview-link">
                      <Image src={link.icon} alt="" width={15} height={15} className="opacity-70" />
                      <span>{link.name}</span>
                      <span className="ml-auto opacity-30 text-[9px]">›</span>
                    </div>
                  ))}
                </div>
                <div className="mobile-preview-badge">🔗 linkwave.app/u/seu-nome</div>
              </div>
            </div>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
