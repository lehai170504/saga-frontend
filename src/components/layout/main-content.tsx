"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [pathname, searchParams]);

  return (
    <main
      ref={mainRef}
      className="h-full flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden scroll-smooth relative"
    >
      <div className="mx-auto max-w-7xl pb-8">{children}</div>
    </main>
  );
}
