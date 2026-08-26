"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Capabilities", href: "/#features" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Runtime", href: "/#infra" },
  { name: "About", href: "/about" },
  { name: "Providers", href: "/#integrations" },
  { name: "Security", href: "/#security" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        isScrolled ? "py-2 sm:py-3" : "py-3 sm:py-4"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-300 px-4 sm:px-6 lg:px-8 ${
          isScrolled
            ? "max-w-[1200px]"
            : "max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-300 px-4 sm:px-6 rounded-2xl ${
            isScrolled
              ? "h-14 bg-black/85 backdrop-blur-xl border border-white/15 shadow-xl"
              : "h-16 bg-black/40 backdrop-blur-md border border-white/10"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl sm:text-2xl text-white tracking-tight">Wizard</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#eca8d6]" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-200 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/docs"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Docs
            </Link>
            <Button
              asChild
              size="sm"
              className="rounded-full bg-white hover:bg-white/90 text-black px-5 font-medium text-xs sm:text-sm h-9"
            >
              <Link href="/download">Download</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md transition-all active:scale-95 hover:bg-white/20"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-white" />
            ) : (
              <Menu className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu - Full Screen Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/98 backdrop-blur-2xl z-[100] transition-all duration-300 overflow-y-auto ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-screen flex flex-col justify-between p-6 pt-6 pb-10 max-w-lg mx-auto">
          {/* Top Bar inside drawer with brand and close button */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-display text-2xl text-white tracking-tight">Wizard</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#eca8d6]" />
            </div>
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white transition-colors hover:bg-white/20 active:scale-95"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-3.5 my-auto py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-display font-medium text-white/90 hover:text-[#eca8d6] transition-colors py-1"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-display text-white/70 hover:text-white transition-colors py-0.5"
            >
              Documentation
            </Link>
            <Link
              href="/cli"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-display text-white/70 hover:text-white transition-colors py-0.5"
            >
              CLI Reference
            </Link>
            <Link
              href="/changelog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-display text-white/70 hover:text-white transition-colors py-0.5"
            >
              Changelog
            </Link>
          </div>
          
          {/* Bottom CTAs */}
          <div className="flex flex-col gap-3 pt-6 border-t border-white/10">
            <Button
              asChild
              className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-12 text-sm font-semibold shadow-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/download">Download Wizard</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-xl h-12 text-sm border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <a href="https://github.com/Wizard-AIA/Wizard-w2" target="_blank" rel="noreferrer">
                GitHub Repository
              </a>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
