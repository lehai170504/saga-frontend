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
      <div className="flex flex-col gap-4">
        {workspace && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary w-fit text-sm font-medium backdrop-blur-md">
            <Sparkles size={16} className="animate-pulse" />
            <span>{workspace}</span>
          </div>
        )}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/60">
          {title}
        </h1>
        <p className="text-muted-foreground font-medium max-w-2xl text-base">
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
