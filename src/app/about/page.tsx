import { FloatingHeader } from "@/features/landingpage/components/floating-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { AboutContent } from "@/features/landingpage/components/about-content";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Về SAGA | Câu chuyện của chúng tôi",
  description: "Tìm hiểu lý do tại sao SAGA ra đời và sứ mệnh minh bạch hóa đánh giá dự án học thuật.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col selection:bg-primary/20">
      <FloatingHeader />
      <AboutContent />
      <SiteFooter />
    </div>
  );
}
