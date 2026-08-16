"use client";

import { motion } from "framer-motion";
import { GitMerge, CheckCircle2, ChevronRight, Network, Star, PieChart, Code2, PenTool, User } from "lucide-react";
import { fadeUp, scaleUp } from "./animations";

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="max-w-[90rem] mx-auto px-6 relative z-10">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-3xl md:text-5xl font-black tracking-tight text-foreground mb-6"
          >
            Đồng bộ <span className="text-primary">Tự động & Minh bạch</span>
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}
            className="text-muted-foreground font-medium text-lg leading-relaxed"
          >
            SAGA tự động trích xuất dữ liệu từ Jira và GitHub, kết hợp với hệ thống Đánh giá chéo (Peer Review) để tính toán tỷ lệ đóng góp (Slicing Pie) công bằng nhất.
          </motion.p>
        </div>

        <div className="space-y-32 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pr-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider">
                Bước 1
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Quy trình Agile chuẩn</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                Sinh viên làm việc hoàn toàn trên các nền tảng quen thuộc: nhận Task và log Story Points trên <strong className="text-blue-500">Jira</strong>, sau đó commit code lên <strong className="text-foreground">GitHub</strong>.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full -z-10" />

              <div className="bg-card border border-border rounded-2xl p-4 shadow-2xl flex flex-col gap-4 transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                {/* Kanban Header */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-muted/30 rounded-xl p-3 border border-border/50">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase mb-2">To Do</div>
                    <div className="bg-background border border-border p-2 rounded-lg shadow-sm text-xs font-medium text-muted-foreground mb-2 opacity-60">Thiết kế UI/UX</div>
                  </div>
                  <div className="flex-1 bg-muted/50 rounded-xl p-3 border border-primary/20">
                    <div className="text-[10px] font-bold text-primary uppercase mb-2">Done (1)</div>
                    <div className="bg-background border border-primary/40 p-3 rounded-lg shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">SAGA-45</span>
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">H</div>
                      </div>
                      <div className="text-xs font-bold text-foreground mb-2">Build Authentication API</div>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
                        <span className="bg-muted px-1.5 rounded flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-success" /> 5 Story Points</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* GitHub Commit Bar */}
                <div className="bg-[#0d1117] rounded-xl border border-border/50 p-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                    <GitMerge className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-mono text-emerald-500 mb-1">Merge pull request #12 (SAGA-45)</div>
                    <div className="text-[10px] text-muted-foreground font-mono">Le Hoang Hai committed 2 mins ago</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pl-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                Bước 2
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Xây dựng Mạng lưới (Graph)</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                SAGA lắng nghe Webhooks, kiểm chứng Commit và vẽ ra <strong>Sơ đồ mạng lưới</strong> để ánh xạ khối lượng công việc từ các Tiêu chí (Code, Test, Doc) trực tiếp đến từng Sinh viên, tạo ra điểm <strong className="text-emerald-500">Base Slices</strong>.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full -z-10" />

              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl flex flex-col gap-6 transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center gap-2 text-sm font-bold border-b border-border pb-3">
                  <Network className="w-5 h-5 text-emerald-500" />
                  Sơ đồ Mạng lưới Đóng góp
                </div>

                <div className="relative h-48 flex flex-col justify-between">
                  {/* Top: Criteria Nodes */}
                  <div className="flex justify-around">
                    <div className="bg-muted rounded-xl px-4 py-2 border border-border flex items-center gap-2 text-xs font-bold z-10">
                      <Code2 className="w-4 h-4 text-primary" /> Tiêu chí CODE (x0.4)
                    </div>
                    <div className="bg-muted rounded-xl px-4 py-2 border border-border flex items-center gap-2 text-xs font-bold z-10">
                      <PenTool className="w-4 h-4 text-warning" /> Tiêu chí TEST (x0.3)
                    </div>
                  </div>

                  {/* Edges */}
                  <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                    <path d="M 120 40 L 180 150" stroke="var(--primary)" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-50" />
                    <path d="M 320 40 L 220 150" stroke="var(--warning)" strokeWidth="2" strokeDasharray="4 4" fill="none" className="opacity-50" />

                    <text x="120" y="100" fill="var(--foreground)" fontSize="10" fontWeight="bold">5 SP</text>
                    <text x="280" y="100" fill="var(--foreground)" fontSize="10" fontWeight="bold">3 SP</text>
                  </svg>

                  {/* Bottom: Student Nodes */}
                  <div className="flex justify-center">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3 w-48 text-center z-10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <User className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-bold">Lê Hoàng Hải</span>
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground uppercase">Base Slices</div>
                      <div className="text-lg font-black text-emerald-500">2.90</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pr-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold text-xs uppercase tracking-wider">
                Bước 3
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Đánh giá chéo (Peer Review)</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                Cuối mỗi Sprint, sinh viên trong nhóm thực hiện đánh giá lẫn nhau qua hệ thống ẩn danh để tạo ra <strong className="text-amber-500">Hệ số Peer (P)</strong>. Hệ số này được dùng làm trọng số điều chỉnh điểm Base Slices.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full -z-10" />

              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-bold">Lê Hoàng Hải</div>
                      <div className="text-[10px] text-muted-foreground">Bạn đang đánh giá thành viên này</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <div className="text-xs font-bold mb-2">Thái độ làm việc</div>
                    <div className="flex gap-2 text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 opacity-30" />
                    </div>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 border border-border/50">
                    <div className="text-xs font-bold mb-2">Chất lượng Code</div>
                    <div className="flex gap-2 text-amber-400">
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 text-xs font-bold text-amber-500 bg-amber-500/10 p-2 rounded-lg justify-center">
                    <ChevronRight className="w-4 h-4" /> Hệ số Peer (P) được tính: x1.15
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 4 */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-20 group">
            <div className="flex-1 space-y-6 md:pl-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-500 font-bold text-xs uppercase tracking-wider">
                Bước 4
              </motion.div>
              <motion.h3 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">Slicing Pie & Phân tích</motion.h3>
              <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-muted-foreground font-medium leading-relaxed text-lg">
                Cuối cùng, Base Slices x Hệ số Peer (P) sẽ cho ra phần trăm đóng góp Final (Slicing Pie) hoàn toàn chống gian lận. Hệ thống cũng vẽ sẵn <strong>Biểu đồ năng lực (Radar)</strong> dựa trên lịch sử commit.
              </motion.p>
            </div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleUp} className="flex-1 w-full relative">
              <div className="absolute inset-0 bg-purple-500/10 blur-3xl rounded-full -z-10" />

              <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl transform-gpu group-hover:scale-[1.02] transition-transform duration-500">
                <div className="flex items-center gap-2 mb-6 border-b border-border pb-3">
                  <PieChart className="w-5 h-5 text-purple-500" />
                  <h4 className="font-bold text-sm">Điểm Đóng góp (Final)</h4>
                </div>

                <div className="space-y-4">
                  {/* Person 1 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">H</div>
                        <span className="font-bold text-foreground">Lê Hoàng Hải</span>
                      </div>
                      <span className="font-bold text-primary">57.14%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full relative" style={{ width: '57.14%' }}>
                        <div className="absolute inset-0 bg-white/20 w-full animate-[shimmer_2s_infinite]" style={{ transform: 'translateX(-100%)' }} />
                      </div>
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right">Base: 2.90 × Peer: 1.15</div>
                  </div>

                  {/* Person 2 */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-end text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-500">M</div>
                        <span className="font-bold text-foreground">Bùi Phan Nhật Minh</span>
                      </div>
                      <span className="font-bold text-emerald-500">42.86%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: '42.86%' }} />
                    </div>
                    <div className="text-[10px] text-muted-foreground text-right">Base: 2.10 × Peer: 1.00</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
