import React from "react";
import { Sparkles } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  workspace?: string;
}

export function PageHeader({ title, description, children, workspace }: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10 pt-2 mb-8">
      <div className="flex flex-col gap-3">
        {workspace && (
          <div className="inline-flex items-center gap-1.5 text-primary text-sm font-semibold">
            <Sparkles size={16} />
            <span>{workspace}</span>
          </div>
        )}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground text-base max-w-2xl">
          {description}
        </p>
      </div>

      {children && (
        <div className="flex gap-2 w-full md:w-auto">
          {children}
        </div>
      )}
    </div>
  );
}
