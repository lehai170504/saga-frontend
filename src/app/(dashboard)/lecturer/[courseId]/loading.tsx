import React from "react";

export default function ClassDashboardLoading() {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Page Header Skeleton */}
      <div className="space-y-3 mb-8">
        <div className="h-10 w-1/3 bg-muted/80 rounded-xl animate-pulse" />
        <div className="h-5 w-1/4 bg-muted/60 rounded-xl animate-pulse" />
      </div>

      {/* Grid of 5 summary cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 h-[120px] flex flex-col justify-between">
            <div className="h-4 w-1/2 bg-muted/80 rounded animate-pulse" />
            <div className="h-10 w-1/3 bg-muted/80 rounded-xl animate-pulse mt-4" />
          </div>
        ))}
      </div>

      {/* Grid of charts skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 h-[450px]">
          <div className="h-6 w-1/3 bg-muted/80 rounded-xl animate-pulse mb-8" />
          <div className="h-[320px] w-full bg-muted/40 rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-2 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm p-6 h-[450px]">
          <div className="h-6 w-1/2 bg-muted/80 rounded-xl animate-pulse mb-8" />
          <div className="h-[320px] w-full bg-muted/40 rounded-full animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
