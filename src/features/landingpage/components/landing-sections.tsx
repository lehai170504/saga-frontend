import Link from "next/link";
import {
  ArrowRight,
  GitPullRequest,
  Users,
  Zap,
} from "lucide-react";
import { AuthModal } from "@/features/auth/components/auth-modal";

export function HeroSection() {
  return (
    <section className="relative px-6 pt-32 pb-20 md:pt-40 md:pb-28 max-w-7xl mx-auto flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/4 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm text-sm font-bold text-muted-foreground mb-8 cursor-default">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-600" />
        </span>
        SAGA Capstone System v1.0 đã sẵn sàng
      </div>

      <h1 className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight mb-6 max-w-4xl leading-tight">
        Đánh giá tiến độ liên tục với <br className="hidden md:block" />
        <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
          Dữ liệu Thực tế
        </span>
      </h1>

      <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl font-medium leading-relaxed">
        Hệ thống phân tích và trực quan hóa hoạt động của sinh viên dựa trên đồ
        thị tương tác, Git Logs và quản lý Task từ Jira. Tạm biệt báo cáo thủ
        công.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="scale-105">
          <AuthModal />
        </div>
        <Link
          href="#features"
          className="inline-flex items-center justify-center px-6 py-2.5 text-foreground font-semibold bg-card border border-border rounded-xl hover:bg-accent transition-colors h-11"
        >
          Khám phá tính năng
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="border-y border-border bg-card/50 backdrop-blur-sm py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border">
        {[
          { value: "100%", label: "Đồng bộ Tự động" },
          { value: "+10k", label: "Commits Phân tích" },
          { value: "24/7", label: "Giám sát Real-time" },
          { value: "3", label: "Nền tảng Tích hợp" },
        ].map((stat, i) => (
          <div key={i}>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground">
              {stat.value}
            </div>
            <div className="text-sm font-medium text-muted-foreground mt-2">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
          Tại sao chọn <span className="text-orange-500">SAGA</span>?
        </h2>
        <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
          Công cụ mạnh mẽ giúp giảng viên và sinh viên nắm bắt chính xác tiến
          độ, hiệu suất và sự đóng góp của từng thành viên trong nhóm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<Zap className="w-7 h-7" />}
          title="Đánh giá Real-time"
          desc="Theo dõi tiến độ, hiệu suất làm việc và đóng góp cập nhật liên tục 24/7 từ các nền tảng mà không có độ trễ."
          color="orange"
        />
        <FeatureCard
          icon={<GitPullRequest className="w-7 h-7" />}
          title="Tích hợp GitHub & Jira"
          desc="Tự động đồng bộ commit, pull requests và trạng thái công việc (To Do, In Progress, Done) thẳng vào hệ thống."
          color="blue"
        />
        <FeatureCard
          icon={<Users className="w-7 h-7" />}
          title="Mạng lưới tương tác"
          desc="Sử dụng đồ thị Node-Edge (Graph) để trực quan hóa cách các thành viên giao tiếp, cảnh báo sớm sinh viên mất tích."
          color="emerald"
        />
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="py-24 bg-muted/50 border-t border-border"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-4">
            Hoạt động như thế nào?
          </h2>
          <p className="text-muted-foreground font-medium max-w-2xl mx-auto">
            Chỉ với 3 bước đơn giản để thiết lập và bắt đầu theo dõi dự án của
            bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-8 left-[15%] right-[15%] h-[2px] bg-border -z-10" />
          {[
            {
              step: "01",
              title: "Kết nối tài khoản",
              desc: "Liên kết hệ thống với kho lưu trữ GitHub và Workspace Jira của nhóm.",
            },
            {
              step: "02",
              title: "Đồng bộ dữ liệu",
              desc: "SAGA tự động crawl và phân tích lịch sử commit, ticket mỗi ngày.",
            },
            {
              step: "03",
              title: "Nhận báo cáo",
              desc: "Xem biểu đồ trực quan, điểm số đóng góp và cảnh báo rủi ro dự án.",
            },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-card border-4 border-muted text-orange-500 font-extrabold text-xl flex items-center justify-center shadow-sm mb-6">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {item.title}
              </h3>
              <p className="text-muted-foreground font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-24 px-6 max-w-4xl mx-auto text-center">
      <div className="bg-primary text-primary-foreground rounded-3xl p-10 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[80px] rounded-full pointer-events-none" />
        <h2 className="text-3xl md:text-4xl font-extrabold mb-6 relative z-10">
          Sẵn sàng tối ưu hóa quy trình đánh giá?
        </h2>
        <p className="text-primary-foreground/80 font-medium mb-10 max-w-xl mx-auto relative z-10">
          Tham gia hệ thống ngay hôm nay để quản lý dự án PBL một cách minh bạch
          và hiệu quả nhất.
        </p>
        <div className="relative z-10 inline-block">
          <AuthModal />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: "orange" | "blue" | "emerald";
}) {
  const colorStyles = {
    orange:
      "bg-orange-50 border-orange-100 text-orange-600 group-hover:bg-orange-600",
    blue: "bg-blue-50 border-blue-100 text-blue-600 group-hover:bg-blue-600",
    emerald:
      "bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-600",
  };

  return (
    <div className="bg-card p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl transition-all hover:-translate-y-2 group">
      <div
        className={`w-14 h-14 border rounded-2xl flex items-center justify-center mb-6 group-hover:text-white transition-colors ${colorStyles[color]}`}
      >
        {icon}
      </div>
      <h3 className="font-bold text-foreground text-xl mb-3">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
