// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { FloatingHeader } from "@/features/landingpage/components/floating-header";
import {
  HeroSection,
  DashboardPreviewSection,
  MarqueeSection,
  FeaturesSection,
  HowItWorksSection,
  CtaSection,
} from "@/features/landingpage/components/landing-sections";
import { SiteFooter } from "@/components/layout/site-footer";

export default function LandingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Tự động redirect về đúng dashboard nếu đã đăng nhập (sau khi từ Cognito trả về)
  useEffect(() => {
    if (!isLoading && user) {
      setTimeout(() => {
        if (user.applicationRole === "ADMIN") {
          router.replace("/admin");
        } else if (user.applicationRole === "LECTURER") {
          router.replace("/lecturer");
        } else {
          router.replace("/student");
        }
      }, 0);
    }
  }, [user, isLoading, router]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary flex flex-col overflow-x-hidden">
      <FloatingHeader />

      <main className="flex-1 overflow-hidden">
        <HeroSection />
        <DashboardPreviewSection />
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
