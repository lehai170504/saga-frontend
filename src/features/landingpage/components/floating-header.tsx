"use client";

import Link from "next/link";
import { SagaLogo } from "@/components/ui/saga-logo";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { API_BASE_URL } from "@/lib/axios";

export function FloatingHeader() {
  const { theme, setTheme } = useTheme();
  const { user, isLoading } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <SagaLogo />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link href="/#features" className="hover:text-foreground transition-colors">
            Tính năng
          </Link>
          <Link href="/#how-it-works" className="hover:text-foreground transition-colors">
            Cách hoạt động
          </Link>
          <Link href="/about" className="hover:text-foreground transition-colors">
            Về dự án
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            aria-label="Chuyển đổi giao diện"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {isLoading ? (
            <button disabled className="bg-primary/60 text-primary-foreground font-medium rounded-md px-4 h-9 transition-colors text-sm flex items-center gap-2 cursor-not-allowed">
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Đang tải
            </button>
          ) : user ? (
            <Link href={`/${user.applicationRole.toLowerCase()}`}>
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 h-9 transition-colors text-sm">
                Dashboard
              </button>
            </Link>
          ) : (
            <button
              onClick={() => window.location.assign(`${API_BASE_URL}/api/auth/login`)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-md px-4 h-9 transition-colors text-sm"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
