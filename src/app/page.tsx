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
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 flex flex-col">
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
        className="bg-white border-t border-slate-200/60 py-10 mt-auto"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-nav.png"
              alt="SAGA Logo"
              width={160}
              height={48}
              className="w-auto h-12 object-contain"
            />
          </div>

          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} SAGA Capstone. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-orange-600 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-600 transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-orange-600 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
