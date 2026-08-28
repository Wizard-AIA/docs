"use client";

import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Product: [
    { name: "Capabilities", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "Setups", href: "/#pricing" },
    { name: "Providers", href: "/#integrations" },
  ],
  Docs: [
    { name: "Under the hood", href: "/#developers" },
    { name: "CLI reference", href: "/cli" },
    { name: "Download", href: "/download" },
    { name: "Full documentation", href: "/docs" },
  ],
  Project: [
    { name: "GitHub", href: "https://github.com/Wizard-AIA/Wizard-w2" },
    { name: "Changelog", href: "/changelog" },
    { name: "About", href: "/about" },
    { name: "Contributing", href: "/about#contributing" },
  ],
  Legal: [
    { name: "License (BSD-3)", href: "/about#license" },
    { name: "Code of Conduct", href: "/about#code-of-conduct" },
    { name: "Security policy", href: "/about#security" },
    { name: "Security", href: "/#security" },
  ],
};

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Wizard-AIA/Wizard-w2" },
  { name: "Docs", href: "/docs" },
  { name: "Awesome Wizard", href: "https://github.com/Wizard-AIA/awesome-wizard" },
];

export function FooterSection() {
  return (
    <footer className="relative bg-black">
      {/* Panoramic banner image */}
      <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Upscaled%20Image%20%2810%29-UnDKstODkIENp5xqTYUEpt0Sm8tNOw.png"
          alt="Bioluminescent landscape"
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient fade to black at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black" />
        {/* Subtle dark vignette on sides */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
      </div>

      {/* Footer content — black background, white text */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12">
        {/* Main Footer */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="col-span-2">
              <a href="/" className="inline-flex items-center gap-2 mb-6">
                <span className="text-2xl font-display text-white">Wizard</span>
              </a>

              <p className="text-white/50 leading-relaxed mb-8 max-w-xs text-sm">
                A local-first autonomous data analysis agent. Nothing leaves your machine unless you say so.
              </p>

              {/* Social Links */}
              <div className="flex gap-6">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-white mb-6">{title}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; 2026 Wizard-AIA. BSD 3-Clause License.
          </p>

          <div className="flex items-center gap-4 text-sm text-white/30">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#eca8d6]" />
              Local-first — no telemetry by default
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
