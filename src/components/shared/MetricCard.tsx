import React from "react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export function MetricCard({ title, value, icon }: MetricCardProps) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 transition-colors hover:bg-slate-100">
      <p className="text-xs text-slate-500 mb-1 flex items-center gap-1.5 font-medium">
        <span className="text-slate-400">{icon}</span> {title}
      </p>
      <p className="text-lg font-bold text-slate-700">{value}</p>
    </div>
  );
}
