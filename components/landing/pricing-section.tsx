"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Copy, Zap } from "lucide-react";

const plans = [
  {
    name: "Local-only",
    description: "Nothing leaves your machine. No API key.",
    features: [
      "Ollama or LM Studio",
      "Any two local models — reasoning + code",
      "Nothing else to configure",
    ],
    cta: "wizard init",
    highlight: true,
  },
  {
    name: "Hybrid",
    description: "Keep local models, make a cloud key available for either role.",
    features: [
      "A local provider for the default pair",
      "One cloud API key",
      "Assign roles later from /models",
    ],
    cta: "wizard init --data-mode hybrid --anthropic-key sk-ant-...",
    highlight: false,
  },
  {
    name: "Cloud-only",
    description: "No local weights needed — Anthropic, OpenAI, Gemini, or any gateway.",
    features: [
      "One provider API key",
      "No GPU, no local install",
      "Auto-selects a model on that provider",
    ],
    cta: "wizard init --provider anthropic --anthropic-key sk-ant-...",
    highlight: false,
  },
];

export function PricingSection() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
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

  return (
    <section id="pricing" ref={sectionRef} className="relative py-32 lg:py-40">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Header - Dramatic offset */}
        <div className="grid lg:grid-cols-12 gap-8 mb-20">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-8">
              <span className="w-12 h-px bg-foreground/30" />
              Setups
            </span>
            <h2 className={`text-[clamp(2.2rem,6vw,7.5rem)] font-display tracking-tight leading-[0.92] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}>
              Pick your
              <br />
              <span className="text-stroke">setup.</span>
            </h2>
          </div>
          
          <div className="lg:col-span-5 relative p-0 h-96 lg:h-auto">
            {/* Whale image */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 delay-100 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}>
              <img
                src="/images/whale.png"
                alt="Organic whale"
                className="w-full h-full object-contain object-center"
              />
            </div>

          </div>
        </div>

        {/* Pricing cards - Horizontal layout with overlap */}
        <div className="relative">
          <div className="grid lg:grid-cols-3 gap-4 lg:gap-0">
            {plans.map((plan, index) => (
              <div
                key={plan.name}
                className={`relative bg-background border transition-all duration-700 ${
                  plan.highlight 
                    ? "border-foreground lg:-mx-2 lg:z-10 lg:scale-105" 
                    : "border-foreground/10 lg:first:-mr-2 lg:last:-ml-2"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Default badge */}
                {plan.highlight && (
                  <div className="absolute -top-4 left-8 right-8 flex justify-center">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-foreground text-background text-xs font-mono uppercase tracking-widest">
                      <Zap className="w-3 h-3" />
                      Default
                    </span>
                  </div>
                )}

                <div className="p-8 lg:p-10">
                  {/* Plan header */}
                  <div className="mb-8 pb-8 border-b border-foreground/10">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-2xl lg:text-3xl font-display mt-2">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-10">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#eca8d6] mt-0.5 shrink-0" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA — copy the setup command */}
                  <button
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(plan.cta);
                        setCopiedIndex(index);
                        setTimeout(() => setCopiedIndex(null), 1800);
                      } catch {
                        // clipboard denied — command is still visible to copy by hand
                      }
                    }}
                    className={`w-full py-4 px-4 flex items-center justify-center gap-2 text-xs font-mono transition-all group overflow-hidden ${
                      plan.highlight
                        ? "bg-foreground text-background hover:bg-foreground/90"
                        : "border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <span className="truncate">{copiedIndex === index ? "Copied!" : plan.cta}</span>
                    <Copy className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom note with icons */}
        <div className={`mt-20 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pt-12 border-t border-foreground/10 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}>
          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#eca8d6]" />
              Safe to run again against an existing install
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#eca8d6]" />
              An existing key is never blanked
            </span>
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4 text-[#eca8d6]" />
              Switch setups later from /models
            </span>
          </div>
          <a
            href="/cli"
            className="text-sm underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Full setup recipes
          </a>
        </div>
      </div>

      <style jsx>{`
        .text-stroke {
          -webkit-text-stroke: 1.5px currentColor;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </section>
  );
}
