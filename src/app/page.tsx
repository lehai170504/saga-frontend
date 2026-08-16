// src/app/page.tsx
"use client";

import { useEffect } from "react";
import { toast } from "sonner";
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
  const { logout } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const error = searchParams.get("error");

    if (error === "ACCOUNT_DISABLED") {
      toast.error("Tài khoản của bạn đã bị vô hiệu hóa", {
        description: "Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.",
        duration: 8000,
      });
      // Clean up the URL after showing the toast
      window.history.replaceState({}, document.title, "/");
      // Call logout to ensure the session and state are cleared
      logout();
    }
  }, [logout]);

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/25 flex flex-col overflow-x-hidden">
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
