// src/components/shared/Skeleton.tsx
import React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-xl ${className}`}
      {...props}
    />
  );
}
