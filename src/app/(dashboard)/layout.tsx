"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { MainContent } from "@/components/layout/main-content";
import { MobileOverlay } from "@/components/layout/mobile-overlay";
import {
  MobileMenuButton,
  MobileCloseButton,
} from "@/components/layout/mobile-buttons";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900">
      <MobileOverlay
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shrink-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end h-16 px-4 lg:hidden border-b border-slate-100">
          <MobileCloseButton onClick={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </div>
      </div>

      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden relative">
        <div className="flex-none relative flex items-center bg-white border-b border-slate-200 z-30">
          <MobileMenuButton onClick={() => setIsSidebarOpen(true)} />

          <div className="flex-1">
            <Header />
          </div>
        </div>

        <MainContent>{children}</MainContent>

        <div className="flex-none">
          <Footer />
        </div>
      </div>
    </div>
  );
}
