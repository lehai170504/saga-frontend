"use client";

import Image from 'next/image';

export function SagaLogo({ className = "", showText = true }: { className?: string, showText?: boolean }) {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Brand Logomark */}
      <div className="relative w-10 h-10 shrink-0 drop-shadow-sm hover:scale-105 transition-transform duration-300 rounded-2xl overflow-hidden bg-white shadow-sm ring-1 ring-border/50 flex items-center justify-center p-1">
        <div className="relative w-full h-full">
          <Image
            src="/saga-logo-v2.png"
            alt="SAGA Logo"
            fill
            className="object-contain scale-110"
            sizes="40px"
            priority
          />
        </div>
      </div>

      {/* Brand Wordmark */}
      {showText && (
        <span className="text-[22px] font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 leading-none">
          SAGA
        </span>
      )}
    </div>
  );
}
