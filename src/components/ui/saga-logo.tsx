"use client";

import Image from 'next/image';

export function SagaLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Brand Logomark */}
      <div className="relative w-9 h-9 rounded-xl overflow-hidden shrink-0 shadow-md ring-1 ring-black/10 dark:ring-white/10">
        <Image
          src="/saga-logo.png"
          alt="SAGA Logo"
          fill
          className="object-cover"
          sizes="36px"
          priority
        />
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span className="text-[21px] font-extrabold tracking-tight text-foreground leading-none">
          SAGA
        </span>
      )}
    </div>
  );
}
