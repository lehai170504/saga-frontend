// src/components/shared/Skeleton.tsx
import React from "react";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-muted rounded-xl ${className}`}
      {...props}
    />
  );
}
