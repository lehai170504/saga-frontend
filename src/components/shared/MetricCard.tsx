import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-muted/30 p-3 rounded-xl border border-border transition-colors hover:bg-muted/50">
      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5 font-medium">
        <span className="text-muted-foreground/70">{icon}</span> {title}
      </p>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}
