"use client";

import Image from "next/image";
import Link from "next/link";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingHeader() {
  const { theme, setTheme } = useTheme();

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

        <div className="pr-1 flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/80 transition-all duration-300 cursor-pointer relative"
            aria-label="Chuyển đổi giao diện"
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-amber-500" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </button>
          <AuthModal />
        </div>
      </header>
    </motion.div>
  );
}
