import React from "react";

export function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden scroll-smooth relative">
      <div className="mx-auto max-w-7xl pb-8">{children}</div>
    </main>
  );
}
