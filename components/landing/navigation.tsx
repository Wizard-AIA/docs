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
      className={`fixed z-50 transition-all duration-500 ${
        isScrolled 
          ? "top-4 left-4 right-4" 
          : "top-0 left-0 right-0"
      }`}
    >
      <nav 
        className={`mx-auto transition-all duration-500 ${
          isScrolled || isMobileMenuOpen
            ? "bg-background/80 backdrop-blur-xl border border-foreground/10 rounded-2xl shadow-lg max-w-[1200px]"
            : "bg-transparent max-w-[1400px]"
        }`}
      >
        <div 
          className={`flex items-center justify-between transition-all duration-500 px-6 lg:px-8 ${
            isScrolled ? "h-14" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className={`font-display tracking-tight transition-all duration-500 ${isScrolled ? "text-xl text-foreground" : "text-2xl text-white"}`}>Wizard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm transition-colors duration-300 relative group ${isScrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white"}`}
              >
                {link.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full ${isScrolled ? "bg-foreground" : "bg-white"}`} />
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/docs"
              className={`transition-all duration-500 ${isScrolled ? "text-xs text-foreground/70 hover:text-foreground" : "text-sm text-white/70 hover:text-white"}`}
            >
              Docs
            </Link>
            <Button
              asChild
              size="sm"
              className={`rounded-full transition-all duration-500 ${isScrolled ? "bg-foreground hover:bg-foreground/90 text-background px-4 h-8 text-xs" : "bg-white hover:bg-white/90 text-black px-6"}`}
            >
              <Link href="/download">Download</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden flex items-center justify-center p-2.5 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md shadow-sm transition-all hover:bg-white/20 active:scale-95"
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
        className={`md:hidden fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 transition-all duration-300 overflow-y-auto ${
          isMobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="min-h-full flex flex-col justify-between p-6 pt-24 pb-12 max-w-md mx-auto">
          {/* Close button at top-right */}
          <div className="absolute top-6 right-6">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2.5 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/20"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 my-auto py-8">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl sm:text-3xl font-display font-medium text-white/90 hover:text-[#eca8d6] transition-colors py-1.5"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10 my-2" />
            <Link
              href="/docs"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display text-white/70 hover:text-white transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/cli"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display text-white/70 hover:text-white transition-colors"
            >
              CLI Guide
            </Link>
            <Link
              href="/changelog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-xl font-display text-white/70 hover:text-white transition-colors"
            >
              Changelog
            </Link>
          </div>
          
          {/* Bottom CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-white/10">
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
            <Button
              asChild
              className="w-full bg-white text-black hover:bg-white/90 rounded-xl h-12 text-sm font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Link href="/download">Download Wizard</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
