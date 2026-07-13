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
      <footer id="about" className="bg-card border-t border-border py-10 mt-auto relative z-40">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Link href="/">
              <SagaLogo className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
            </Link>
          </div>

          <p className="text-muted-foreground text-sm font-medium">
            © {new Date().getFullYear()} SAGA. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm font-semibold text-muted-foreground">
            <button onClick={openPrivacy} className="hover:text-primary transition-colors cursor-pointer">
              Chính sách bảo mật
            </button>
            <button onClick={openTerms} className="hover:text-primary transition-colors cursor-pointer">
              Điều khoản sử dụng
            </button>
            <button onClick={openContact} className="hover:text-primary transition-colors cursor-pointer">
              Liên hệ
            </button>
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
