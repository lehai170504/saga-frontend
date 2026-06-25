"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { MobileOverlay } from "@/components/layout/mobile-overlay";
import { usePathname } from "next/navigation";
import {
  MobileMenuButton,
  MobileCloseButton,
} from "@/components/layout/mobile-buttons";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { FilterProvider } from "@/context/FilterContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Hide sidebar exactly on /lecturer (class selection page)
  const isLecturerHome = pathname === "/lecturer";

  return (
    <RouteGuard>
      <FilterProvider>
        {/* Changed layout direction to Column to put Header on top */}
        <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground">

          {/* Full-width Header */}
          <div className="flex-none w-full z-40 relative">
            <Header onMenuClick={!isLecturerHome ? () => setIsSidebarOpen(true) : undefined} />
          </div>

          {/* Bottom Area: Sidebar + Main Content */}
          <div className="flex flex-1 overflow-hidden relative">
            {!isLecturerHome && (
              <MobileOverlay
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            )}

            {!isLecturerHome && (
              <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col shrink-0 shadow-lg lg:shadow-none ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                  }`}
              >
                <div className="flex items-center justify-between h-14 px-4 lg:hidden border-b border-border bg-muted/30">
                  <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Menu Hệ thống</span>
                  <MobileCloseButton onClick={() => setIsSidebarOpen(false)} />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <Sidebar onClose={() => setIsSidebarOpen(false)} />
                </div>
              </div>
            )}

            <div className="flex-1 h-full min-w-0 overflow-hidden bg-background">
              <MainContent>{children}</MainContent>
            </div>
          </div>
        </div>
      </FilterProvider>
    </RouteGuard>
  );
}
