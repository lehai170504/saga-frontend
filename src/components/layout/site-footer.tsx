"use client";

import Link from "next/link";
import { SagaLogo } from "@/components/ui/saga-logo";
import { useState } from "react";
import { LegalModal } from "../modals/legal-modal";
import { ContactModal } from "../modals/contact-modal";

export function SiteFooter() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"privacy" | "terms">("privacy");

  const openPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    setLegalTab("privacy");
    setLegalModalOpen(true);
  };

  const openTerms = (e: React.MouseEvent) => {
    e.preventDefault();
    setLegalTab("terms");
    setLegalModalOpen(true);
  };

  const openContact = (e: React.MouseEvent) => {
    e.preventDefault();
    setContactModalOpen(true);
  };

  return (
    <>
      <footer id="about" className="bg-card border-t border-border pt-16 pb-8 mt-auto relative z-40">
        <div className="max-w-7xl mx-auto px-6">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6">
              <Link href="/">
                <SagaLogo className="hover:opacity-80 transition-opacity duration-300" />
              </Link>
              <p className="text-muted-foreground text-sm font-medium leading-relaxed max-w-sm">
                Nền tảng quản trị và đánh giá dự án học thuật minh bạch nhất, kết hợp sức mạnh của dữ liệu thời gian thực và thuật toán Slicing Pie.
              </p>
            </div>

            {/* Links Column 1 */}
            <div>
              <h4 className="font-bold text-foreground mb-6">Sản phẩm</h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">Về Dự Án</Link></li>
                <li><Link href="#features" className="hover:text-primary transition-colors">Tính năng</Link></li>
                <li><Link href="#how-it-works" className="hover:text-primary transition-colors">Cách hoạt động</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Bảng giá</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Cập nhật mới</Link></li>
              </ul>
            </div>

            {/* Links Column 2 */}
            <div>
              <h4 className="font-bold text-foreground mb-6">Hỗ trợ</h4>
              <ul className="space-y-4 text-sm font-medium text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Tài liệu API</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
                <li><button onClick={openContact} className="hover:text-primary transition-colors cursor-pointer">Liên hệ</button></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm font-medium">
              © {new Date().getFullYear()} SAGA. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <button onClick={openPrivacy} className="hover:text-primary transition-colors cursor-pointer">
                Chính sách bảo mật
              </button>
              <button onClick={openTerms} className="hover:text-primary transition-colors cursor-pointer">
                Điều khoản sử dụng
              </button>
            </div>
          </div>
        </div>
      </footer>

      {legalModalOpen && (
        <LegalModal
          isOpen={legalModalOpen}
          onClose={() => setLegalModalOpen(false)}
          defaultTab={legalTab}
        />
      )}

      {contactModalOpen && (
        <ContactModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />
      )}
    </>
  );
}
