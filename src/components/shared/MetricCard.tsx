import React from "react";

interface MetricCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm transition-all hover:shadow-md hover:border-primary/20 flex flex-col justify-between">
      <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2.5 font-medium">
        <span className="p-2 bg-muted rounded-xl text-foreground/70">{icon}</span> {title}
      </p>
      <p className="text-3xl font-extrabold tracking-tight text-foreground">{value}</p>
    </div>
  );
}
