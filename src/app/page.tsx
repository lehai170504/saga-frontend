// src/app/page.tsx
"use client";

import { FloatingHeader } from "@/features/landingpage/components/floating-header";
import {
  HeroSection,
  MarqueeSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/features/landingpage/components/landing-sections";
import { SiteFooter } from "@/components/layout/site-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary flex flex-col overflow-x-hidden">
      <FloatingHeader />

      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <MarqueeSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}
