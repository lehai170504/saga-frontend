"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MainContent } from "@/components/layout/main-content";
import { MobileOverlay } from "@/components/layout/mobile-overlay";
import { usePathname } from "next/navigation";
import {
  MobileCloseButton,
} from "@/components/layout/mobile-buttons";
import { RouteGuard } from "@/components/shared/RouteGuard";
import { FilterProvider } from "@/context/FilterContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // Desktop
  const pathname = usePathname();
  const [isSidebarHidden, setIsSidebarHidden] = React.useState(false);

  React.useEffect(() => {
    const checkSidebarVisibility = () => {
      // Hide sidebar on Lecturer Home
      if (pathname === "/lecturer") {
        setIsSidebarHidden(true);
        return;
      }

      // Check Student Routes
      const isStudentRoute = pathname.startsWith("/student");
      const isStudentHome = pathname === "/student";
      const isStudentSettings = pathname === "/student/settings";

      // Hide sidebar ONLY if student is on Home or Settings. 
      // If they are in a class (e.g. /student/123), show sidebar.
      if (isStudentRoute && (isStudentHome || isStudentSettings)) {
        setIsSidebarHidden(true);
      } else {
        setIsSidebarHidden(false);
      }
    };

    checkSidebarVisibility();
  }, [pathname]);

  return (
    <RouteGuard>
      <FilterProvider>
        {/* Changed layout direction to Column to put Header on top */}
        <div className="flex flex-col h-screen w-full overflow-hidden bg-background text-foreground relative">
          {/* Ambient Background Glows */}
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none opacity-50 dark:opacity-20" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px] pointer-events-none opacity-50 dark:opacity-20" />

          {/* Full-width Header */}
          <div className="flex-none w-full z-40 relative">
            <Header onMenuClick={!isSidebarHidden ? () => setIsSidebarOpen(true) : undefined} />
          </div>

          {/* Bottom Area: Sidebar + Main Content */}
          <div className="flex flex-1 overflow-hidden relative">
            {!isSidebarHidden && (
              <MobileOverlay
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
            )}

            {!isSidebarHidden && (
              <div
                className={`fixed inset-y-0 left-0 z-50 bg-card border-r border-border transform transition-all duration-300 ease-in-out lg:static lg:inset-0 flex flex-col shrink-0 shadow-lg lg:shadow-none ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full lg:translate-x-0"
                  } ${isSidebarCollapsed ? "lg:w-[80px]" : "lg:w-64"}`}
              >
                <div className="flex items-center justify-between h-14 px-4 lg:hidden border-b border-border bg-muted/30">
                  <span className="font-bold text-sm text-muted-foreground uppercase tracking-wider">Menu Hệ thống</span>
                  <MobileCloseButton onClick={() => setIsSidebarOpen(false)} />
                </div>

                <div className="flex-1 flex flex-col h-full">
                  <Sidebar
                    onClose={() => setIsSidebarOpen(false)}
                    isCollapsed={isSidebarCollapsed}
                    onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden bg-background">
              <MainContent>{children}</MainContent>
            </div>
          </div>
        </div>
      </FilterProvider>
    </RouteGuard>
  );
}
