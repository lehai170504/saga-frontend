"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, Trash2, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const defaultMultipliers = [
  { id: "1a", name: "Lập trình & Logic (Code)", value: 2.0 },
  { id: "1b", name: "Thiết kế Kiến trúc/Database", value: 1.5 },
  { id: "1c", name: "Viết Tài liệu (Docs)", value: 1.0 },
  { id: "1d", name: "Kiểm thử (Testing)", value: 1.0 },
];

export function TemplateSelector() {
  const [multipliers, setMultipliers] = useState([...defaultMultipliers]);
  const [overrideReason, setOverrideReason] = useState("");

  const updateMultiplier = (id: string, field: "name" | "value", value: string | number) => {
    setMultipliers(multipliers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMultiplier = (id: string) => {
    setMultipliers(multipliers.filter(m => m.id !== id));
  };

  const addMultiplier = () => {
    setMultipliers([...multipliers, { id: Date.now().toString(), name: "Công việc mới", value: 1.0 }]);
  };

  const isModified = JSON.stringify(multipliers) !== JSON.stringify(defaultMultipliers);

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Kế thừa & Tùy chỉnh Khung Hệ số
          </CardTitle>
          <CardDescription>
            Lớp học này tự động kế thừa <strong>Bộ Khung Hệ số Kỹ thuật Phần mềm (SE)</strong> do Admin thiết lập. Bạn có thể tự do thêm, bớt hoặc điều chỉnh Hệ số (Multipliers) sao cho phù hợp với đặc thù riêng của Lớp học này.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">
              {/* Template Info */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Info className="w-4 h-4" />
                  <span>Đang sử dụng: Bộ Khung Chuẩn SE</span>
                </div>
                <p className="text-sm">
                  Mọi sự thay đổi về loại công việc và hệ số ở bảng bên dưới sẽ chỉ áp dụng riêng cho tiến độ đánh giá của lớp học này. Việc ghi đè sẽ cần Admin kiểm duyệt.
                </p>
              </div>

              {/* Customizing Multipliers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold mb-2">
                  <Settings2 className="w-5 h-5 text-primary" />
                  <h3>Tinh chỉnh Hệ số Công việc của Lớp</h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {multipliers.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-3 bg-background border border-border/50 rounded-xl hover:border-primary/30 transition-colors">
                      <Input
                        value={m.name}
                        onChange={(e) => updateMultiplier(m.id, "name", e.target.value)}
                        className="flex-1 h-10 text-sm font-medium bg-transparent border-transparent focus-visible:ring-primary/20 px-2"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <Input
                          type="number"
                          step="0.1"
                          value={m.value}
                          onChange={(e) => updateMultiplier(m.id, "value", parseFloat(e.target.value) || 0)}
                          className="h-10 w-24 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMultiplier(m.id)}
                          className="h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Button
                    variant="outline"
                    onClick={addMultiplier}
                    className="h-12 border-dashed border-2 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-xl font-bold transition-all"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm Loại Công Việc Mới
                  </Button>
                </div>
              </div>

              {/* Reason for Override */}
              {isModified && (
                <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-4 animate-in fade-in slide-in-from-top-4">
                  <div className="flex items-start gap-2 text-amber-600 dark:text-amber-500">
                    <Info className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <Label className="font-bold">Yêu cầu Kiểm duyệt từ Admin</Label>
                      <p className="text-xs">Hệ số công việc đã bị thay đổi so với khung chuẩn SE. Bạn cần ghi rõ lý do để Admin xem xét duyệt.</p>
                    </div>
                  </div>

                  <Textarea
                    placeholder="Ví dụ: Đồ án lớp này tập trung mạnh vào AI, nên cần thêm task Train Model với hệ số 2.5..."
                    className="min-h-[100px] border-amber-500/30 focus-visible:ring-amber-500/20"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />

                  <div className="flex justify-end">
                    <Button
                      disabled={!overrideReason.trim()}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl"
                    >
                      Gửi yêu cầu Ghi đè Khung Hệ số
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-1">
              <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-lg">Quy chuẩn Hệ số Gốc</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground pt-4">
                  <div>
                    <strong className="text-foreground">1. Lập trình & Logic (2.0):</strong>
                    <p className="mt-1">Code đòi hỏi tư duy phức tạp và tốn nhiều effort nhất trong Sprint để ra được Working Software.</p>
                  </div>
                  <div>
                    <strong className="text-foreground">2. Thiết kế Kiến trúc/DB (1.5):</strong>
                    <p className="mt-1">Dù ít code hơn nhưng mang tính rủi ro cốt lõi. Sai kiến trúc sẽ phải xây lại toàn bộ dự án.</p>
                  </div>
                  <div>
                    <strong className="text-foreground">3. Kiểm thử / QA (1.0):</strong>
                    <p className="mt-1">Mức độ đồ án sinh viên thường tập trung vào test cơ bản, chất xám bỏ ra ổn định ở mức tiêu chuẩn.</p>
                  </div>
                  <div>
                    <strong className="text-foreground">4. Viết Tài liệu (1.0):</strong>
                    <p className="mt-1">Quan trọng để bàn giao nhưng độ phức tạp kỹ thuật thấp, tránh làm chênh lệch điểm quá lớn với Dev.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
