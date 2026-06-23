"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthModal } from "@/features/auth/components/auth-modal";

export function FloatingHeader() {
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <header className="pointer-events-auto bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-full px-2 h-14 flex items-center justify-between gap-8 shadow-sm transition-all hover:shadow-md">
        <Link href="/" className="pl-4 flex items-center">
          <Image
            src="/logo-icon.png"
            alt="SAGA Logo"
            width={120}
            height={32}
            className="h-8 w-auto object-contain drop-shadow-sm"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <Link
            href="#features"
            className="hover:text-orange-600 transition-colors"
          >
            Tính năng
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-orange-600 transition-colors"
          >
            Cách hoạt động
          </Link>
          <Link
            href="#about"
            className="hover:text-orange-600 transition-colors"
          >
            Về dự án
          </Link>
        </nav>

        <div className="pr-1">
          <AuthModal />
        </div>
      </header>
    </div>
  );
}
