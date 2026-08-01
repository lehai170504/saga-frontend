"use client";

import Image from "next/image";
import { ArrowRight, Code2, Users, Scale, AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, scaleUp } from "./animations";

export function AboutContent() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        {/* Subtle SaaS Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full -z-10" />

        <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex-1 space-y-8"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
              Câu chuyện của SAGA
            </motion.div>
            <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-tight">
              Sinh ra từ nỗi đau <br /> của những đêm <span className="text-primary">chạy deadline</span>.
            </motion.h1>
            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed max-w-2xl">
              Chúng tôi từng là những sinh viên mệt mỏi vì phải gánh team, và cũng từng bất lực nhìn điểm số cuối kỳ được chia cào bằng một cách đầy cảm tính. SAGA ra đời để chấm dứt điều đó.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={scaleUp}
            className="flex-1 w-full relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-square md:aspect-[4/3] border border-border/50">
              <Image
                src="/images/about_team_collaboration.png"
                alt="Nhóm sinh viên làm việc"
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            {/* Floating Badges */}
            <div className="absolute -bottom-6 -left-6 bg-card border border-border shadow-xl rounded-2xl p-4 flex items-center gap-4 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
                <Scale className="w-6 h-6 text-success" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground font-bold uppercase">Mục tiêu</div>
                <div className="text-sm font-black text-foreground">Công bằng 100%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 bg-muted/30">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16"
        >
          {/* Story 1 */}
          <motion.div variants={fadeUp} className="bg-card border border-border p-10 rounded-3xl shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
            <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-8 shrink-0">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Thực trạng "Hộp Đen"</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Trong hầu hết các đồ án đại học, giảng viên chỉ nhìn thấy <strong>kết quả cuối cùng (sản phẩm)</strong> mà không thể theo dõi <strong>quá trình (ai làm gì, làm bao nhiêu)</strong>. Việc đánh giá phụ thuộc hoàn toàn vào những buổi trình bày chớp nhoáng hoặc các phiếu đánh giá chéo (peer-review) đầy cảm tính, cả nể.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Hệ lụy là: Sinh viên chăm chỉ bị vắt kiệt sức (Bus Factor = 1), còn những thành viên "free-rider" vẫn ung dung nhận điểm cao. Một môi trường thiếu minh bạch sẽ bào mòn động lực sáng tạo.
              </p>
            </div>
          </motion.div>

          {/* Story 2 */}
          <motion.div variants={fadeUp} className="bg-primary text-primary-foreground p-10 rounded-3xl shadow-xl relative overflow-hidden hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-8 backdrop-blur-sm">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Giải pháp của chúng tôi</h2>
              <div className="space-y-4 text-primary-foreground/90">
                <p className="leading-relaxed">
                  Thay vì dựa vào lời khai báo, SAGA dựa vào <strong>Dữ liệu mã nguồn mở (Open Source Data)</strong>. Bằng cách tích hợp sâu vào GitHub và Jira, hệ thống âm thầm ghi nhận từng dòng code, từng thẻ công việc được hoàn thành.
                </p>
                <p className="leading-relaxed">
                  Kết hợp với thuật toán <strong>Slicing Pie</strong>, mọi nỗ lực đều được lượng hóa thành "Cổ phần đóng góp". Giảng viên có một Dashboard rõ ràng như ban ngày, sinh viên có một môi trường làm việc công bằng tuyệt đối.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-foreground mb-4">Giá trị Cốt lõi</h2>
          <p className="text-muted-foreground">Kim chỉ nam trong mọi dòng code của SAGA.</p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[280px]"
        >
          {/* Card 1 */}
          <motion.div variants={fadeUp} className="md:col-span-2 bg-primary text-primary-foreground rounded-[2rem] p-8 md:p-12 shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-white/5 opacity-50 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all relative z-10">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Code is Law</h3>
              <p className="text-primary-foreground/90 leading-relaxed text-lg max-w-xl">
                Không có chỗ cho sự ngụy biện. Dữ liệu từ mã nguồn và lịch sử công việc là bằng chứng duy nhất và chính xác nhất.
              </p>
            </div>
          </motion.div>

          {/* Card 2 */}
          <motion.div variants={fadeUp} className="md:col-span-1 md:row-span-2 bg-emerald-500 text-white rounded-[2rem] p-8 md:p-12 shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute inset-0 bg-black/10 opacity-50 mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all relative z-10">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Công Bằng Tuyệt Đối</h3>
              <p className="text-white/90 leading-relaxed text-lg">
                Công sức bỏ ra phải tỷ lệ thuận với kết quả nhận được. Trả lại điểm số xứng đáng cho những người thực sự nỗ lực.
              </p>
            </div>
          </motion.div>

          {/* Card 3 */}
          <motion.div variants={fadeUp} className="md:col-span-2 bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -z-10" />
            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all">
              <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-3 text-foreground">Trao Quyền (Empowerment)</h3>
              <p className="text-muted-foreground leading-relaxed text-lg max-w-xl">
                Không phải công cụ giám sát, SAGA là công cụ giúp các nhóm sinh viên học cách quản lý dự án chuyên nghiệp.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Đội ngũ Phát triển</h2>
            <p className="text-muted-foreground">Những người đứng sau những dòng code của SAGA.</p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { name: "Lê Hoàng Hải", role: "Fullstack Developer", initials: "HH", color: "from-blue-500 to-cyan-500" },
              { name: "Nguyễn Văn A", role: "UI/UX Designer", initials: "VA", color: "from-emerald-500 to-teal-500" },
              { name: "Trần Thị B", role: "Backend Developer", initials: "TB", color: "from-purple-500 to-pink-500" },
              { name: "Phạm Văn C", role: "Project Manager", initials: "VC", color: "from-amber-500 to-orange-500" },
            ].map((member, i) => (
              <motion.div variants={fadeUp} key={i} className="flex flex-col items-center text-center group">
                <div className={`w-32 h-32 rounded-full mb-6 flex items-center justify-center text-3xl font-black text-white bg-gradient-to-br ${member.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {member.initials}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <h2 className="text-3xl md:text-5xl font-black mb-8">Bạn đã sẵn sàng thay đổi?</h2>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform"
          >
            Trở về Trang chủ
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
