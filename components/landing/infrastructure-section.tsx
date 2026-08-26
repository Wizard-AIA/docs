"use client";

import { useEffect, useState, useRef } from "react";

const regions = [
  { name: "Linux", nodes: "Landlock + seccomp", status: "enforced" },
  { name: "macOS", nodes: "sandbox-exec (SBPL)", status: "enforced" },
  { name: "Windows", nodes: "Job Object + Low integrity", status: "network not enforced" },
  { name: "Docker", nodes: "cap_drop=ALL, opt-in", status: "operational" },
];

export function InfrastructureSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeRegion, setActiveRegion] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRegion((prev) => (prev + 1) % regions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="infra" ref={sectionRef} className="relative py-32 lg:py-40 overflow-hidden">
        {/* Background accent — retiré, remplacé par l'image sphère */}
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20">
          <span className={`inline-flex items-center gap-4 text-sm font-mono text-muted-foreground mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100" : "opacity-0"
          }`}>
            <span className="w-12 h-px bg-foreground/20" />
            Runtime
          </span>

          <div className="grid lg:grid-cols-[auto_1fr] gap-8 lg:gap-16 items-stretch">
            {/* Containment visual — falls back to an abstract CSS mark until
                /images/runtime.png exists, then shows that instead. */}
            <div className={`w-48 lg:w-72 xl:w-80 aspect-square shrink-0 flex items-center justify-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <div className="relative w-full h-full">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="absolute rounded-2xl border border-foreground/15"
                    style={{ inset: `${i * 12}%` }}
                  />
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eca8d6]" />
                </div>
                <img
                  src="/images/runtime.png"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Titre + description empilés */}
            <div className="flex flex-col justify-center">
              <h2 className={`text-[clamp(2.2rem,6vw,7.5rem)] font-display tracking-tight leading-[0.92] transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}>
                It runs on
                <br />
                <span className="text-muted-foreground">your machine.</span>
              </h2>

              <p className={`mt-8 text-xl text-muted-foreground leading-relaxed max-w-lg transition-all duration-1000 delay-100 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}>
                Generated code runs in a subprocess by default — its own memory ceiling,
                a per-step timeout, a working Stop button. Docker is opt-in, not a fallback.
              </p>
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Large stat card */}
          <div className={`lg:col-span-2 relative p-8 lg:p-12 border border-foreground/10 bg-foreground/[0.02] overflow-hidden transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            {/* Animated dots background with connecting lines */}
            <div className="absolute inset-0 opacity-70">
              {/* SVG for connecting lines */}
              <svg
                className="absolute inset-0 w-full h-full"
                style={{ pointerEvents: "none" }}
              >
                <defs>
                  <style>{`
                    @keyframes drawLine {
                      0%   { stroke-dashoffset: 1000; opacity: 0; }
                      15%  { opacity: 1; }
                      70%  { opacity: 0.7; }
                      100% { stroke-dashoffset: 0; opacity: 0; }
                    }
                    .connecting-line {
                      stroke: #eca8d6;
                      stroke-width: 1.2;
                      fill: none;
                      stroke-dasharray: 1000;
                      animation: drawLine 3s ease-in-out infinite;
                    }
                  `}</style>
                </defs>
                {[...Array(19)].map((_, i) => {
                  const x1 = 10 + (i % 5) * 20;
                  const y1 = 10 + Math.floor(i / 5) * 25;
                  const x2 = 10 + ((i + 1) % 5) * 20;
                  const y2 = 10 + Math.floor((i + 1) / 5) * 25;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={`${x1}%`}
                      y1={`${y1}%`}
                      x2={`${x2}%`}
                      y2={`${y2}%`}
                      className="connecting-line"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  );
                })}
              </svg>

              {/* Dots */}
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-[#eca8d6]"
                  style={{
                    left: `${10 + (i % 5) * 20}%`,
                    top: `${10 + Math.floor(i / 5) * 25}%`,
                    animation: `pulse 2s ease-in-out ${i * 0.1}s infinite`,
                  }}
                />
              ))}
            </div>
            
            <div className="relative z-10">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-8xl lg:text-[10rem] font-display leading-none">3</span>
                <span className="text-2xl text-muted-foreground">execution backends</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                <code className="text-foreground">host</code> — a sandboxed subprocess, the default.{" "}
                <code className="text-foreground">docker</code> — a container per session, opt-in.{" "}
                <code className="text-foreground">inprocess</code> — used only when spawning is forbidden.
              </p>
            </div>
          </div>

          {/* Stacked stat cards */}
          <div className="flex flex-col gap-6">
            <div className={`p-8 border border-foreground/10 bg-foreground/[0.02] transition-all duration-700 delay-100 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <span className="text-5xl lg:text-6xl font-display">4</span>
              <span className="block text-sm text-muted-foreground mt-2">Layers of containment</span>
            </div>

            <div className={`p-8 border border-foreground/10 bg-foreground/[0.02] transition-all duration-700 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              <span className="text-5xl lg:text-6xl font-display">9.5/10</span>
              <span className="block text-sm text-muted-foreground mt-2">OpenSSF Scorecard</span>
            </div>
          </div>
        </div>

        {/* Sandbox mechanism list */}
        <div className={`mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          {regions.map((region, index) => (
            <div
              key={region.name}
              className={`p-6 border transition-all duration-300 cursor-default ${
                activeRegion === index 
                  ? "border-foreground/30 bg-foreground/[0.04]" 
                  : "border-foreground/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full transition-colors ${
                  activeRegion === index ? "bg-[#eca8d6]" : "bg-foreground/20"
                }`} />
                <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                  {region.status}
                </span>
              </div>
              <span className="font-medium block mb-1">{region.name}</span>
              <span className="text-sm text-muted-foreground">{region.nodes}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
