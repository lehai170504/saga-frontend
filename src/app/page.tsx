// src/app/page.tsx
"use client";

import { AuthModal } from "@/components/auth-modal";
import {
  GitPullRequest,
  Users,
  ArrowRight,
  BarChart3,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-orange-100 selection:text-orange-900 flex flex-col">
      {/* 1. HEADER (NAVBAR) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo SAGA */}
          <div className="flex items-center cursor-pointer">
            <div className="flex items-center cursor-pointer">
              <Image
                src="/logo-header.png"
                alt="SAGA Logo"
                width={300}
                height={80}
                className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm transition-transform hover:scale-[1.02]"
                priority
              />
            </div>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
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

          {/* Auth Button */}
          <div className="flex items-center">
            <AuthModal />
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="flex-1 pt-16 overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative px-6 pt-24 pb-20 md:pt-32 md:pb-28 max-w-7xl mx-auto flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/15 blur-[120px] rounded-full pointer-events-none -z-10"></div>
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm text-sm font-bold text-slate-600 mb-8 hover:shadow-md transition-shadow cursor-default">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600"></span>
            </span>
            SAGA Capstone System v1.0 đã sẵn sàng
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 max-w-4xl leading-tight">
            Đánh giá tiến độ liên tục với <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Dữ liệu Thực tế
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl font-medium leading-relaxed">
            Hệ thống phân tích và trực quan hóa hoạt động của sinh viên dựa trên
            đồ thị tương tác, Git Logs và quản lý Task từ Jira. Không còn báo
            cáo thủ công!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="scale-105">
              {/* Tái sử dụng AuthModal làm nút chính */}
              <AuthModal />
            </div>
            <Link
              href="#features"
              className="inline-flex items-center justify-center px-6 py-2.5 text-slate-600 font-semibold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:text-slate-900 transition-colors h-11"
            >
              Khám phá tính năng
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* STATS BANNER */}
        <section className="border-y border-slate-200/60 bg-white/50 backdrop-blur-sm py-8">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200/60">
            <div>
              <div className="text-3xl font-extrabold text-slate-800">100%</div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Đồng bộ Tự động
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800">+10k</div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Commits Phân tích
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800">24/7</div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Giám sát Real-time
              </div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-slate-800">3</div>
              <div className="text-sm font-medium text-slate-500 mt-1">
                Nền tảng Tích hợp
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
              Tại sao chọn <span className="text-orange-500">SAGA</span>?
            </h2>
            <p className="text-slate-500 font-medium max-w-2xl mx-auto">
              Công cụ mạnh mẽ giúp giảng viên và sinh viên nắm bắt chính xác
              tiến độ, hiệu suất và sự đóng góp của từng thành viên trong nhóm.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center mb-6 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">
                Đánh giá Real-time
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Theo dõi tiến độ, hiệu suất làm việc và đóng góp cập nhật liên
                tục 24/7 từ các nền tảng mà không có độ trễ.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <GitPullRequest className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">
                Tích hợp GitHub & Jira
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Tự động đồng bộ commit, pull requests và trạng thái công việc
                (To Do, In Progress, Done) thẳng vào hệ thống.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-800 text-xl mb-3">
                Mạng lưới tương tác
              </h3>
              <p className="text-slate-500 font-medium leading-relaxed">
                Sử dụng đồ thị Node-Edge (Graph) để trực quan hóa cách các thành
                viên giao tiếp, cảnh báo sớm sinh viên &quot;mất tích&quot;.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 3. FOOTER */}
      <footer className="bg-white border-t border-slate-200/60 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <BarChart3 size={16} className="text-orange-500" />
            <span>SAGA Project.</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} SAGA Capstone. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-orange-600">
              Privacy
            </a>
            <a href="#" className="hover:text-orange-600">
              Terms
            </a>
            <a href="#" className="hover:text-orange-600">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
