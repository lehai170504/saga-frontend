import { CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  indicatorColor?: string;
  rightElement?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  indicatorColor = "bg-slate-500",
  rightElement,
}: SectionHeaderProps) {
  return (
    <CardHeader className="px-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-50">
      <div>
        <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
          {indicatorColor && (
            <span
              className={`w-2 h-6 rounded-full inline-block ${indicatorColor}`}
            ></span>
          )}
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-slate-500 mt-1 pl-4">{description}</p>
        )}
      </div>

      {rightElement && <div>{rightElement}</div>}
    </CardHeader>
  );
}
