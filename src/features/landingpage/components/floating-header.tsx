"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthModal } from "@/features/auth/components/auth-modal";

import { motion } from "framer-motion";

export function FloatingHeader() {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <header className="pointer-events-auto bg-background/60 backdrop-blur-2xl border border-border/50 rounded-full px-2 h-14 flex items-center justify-between gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all hover:shadow-md">
        <Link href="/" className="pl-4 flex items-center">
          <Image
            src="/logo-icon.png"
            alt="SAGA Logo"
            width={120}
            height={32}
            className="h-8 w-auto object-contain drop-shadow-sm"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-primary transition-colors"
          >
            Tính năng
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-primary transition-colors"
          >
            Cách hoạt động
          </Link>
          <Link
            href="#about"
            className="hover:text-primary transition-colors"
          >
            Về dự án
          </Link>
        </nav>

        <div className="pr-1">
          <AuthModal />
        </div>
      </header>
    </motion.div>
  );
}
