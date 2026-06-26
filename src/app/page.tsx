// src/app/page.tsx
"use client";

import Image from "next/image";
import { FloatingHeader } from "@/features/landingpage/components/floating-header";
import {
  HeroSection,
  StatsSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/features/landingpage/components/landing-sections";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary flex flex-col">
      <FloatingHeader />

      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      {/* FOOTER */}
      <footer
        id="about"
        className="bg-card border-t border-border py-10 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-nav.png"
              alt="SAGA Logo"
              width={160}
              height={48}
              className="w-auto h-12 object-contain"
              style={{ width: "auto" }}
            />
          </div>

          <p className="text-muted-foreground text-sm font-medium">
            © {new Date().getFullYear()} SAGA Capstone. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm font-semibold text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
