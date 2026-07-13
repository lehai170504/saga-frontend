"use client";

import Link from "next/link";
import { AuthModal } from "@/features/auth/components/auth-modal";
import { SagaLogo } from "@/components/ui/saga-logo";
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
      <header className="pointer-events-auto bg-background/70 backdrop-blur-3xl border border-border/50 rounded-full px-2 h-14 flex items-center justify-between gap-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(99,102,241,0.15)] hover:border-indigo-500/30">
        <Link href="/" className="pl-4 flex items-center">
          <SagaLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 relative group"
          >
            Tính năng
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 relative group"
          >
            Cách hoạt động
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
          <Link
            href="#about"
            className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 relative group"
          >
            Về dự án
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-300 group-hover:w-full rounded-full" />
          </Link>
        </nav>

        <div className="pr-1 flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-muted/80 transition-all duration-300 cursor-pointer relative"
            aria-label="Chuyển đổi giao diện"
          >
            <Sun className="h-[18px] w-[18px] rotate-0 scale-100 transition-all duration-500 dark:-rotate-90 dark:scale-0 text-violet-500" />
            <Moon className="absolute h-[18px] w-[18px] rotate-90 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 text-indigo-400" />
          </button>
          <AuthModal />
        </div>
      </header>
    </motion.div>
  );
}
