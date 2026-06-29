import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, ShieldAlert, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Multiplier = {
  id: string;
  name: string;
  value: number;
};

type Template = {
  id: string;
  name: string;
  description: string;
  multipliers: Multiplier[];
};

const seTemplate: Template = {
  id: "se-fixed-template",
  name: "Bộ Khung Hệ số Kỹ thuật Phần mềm (SE)",
  description: "Bộ khung cố định dành riêng cho các môn học và đồ án thuộc khối ngành Software Engineering.",
  multipliers: [
    { id: "1a", name: "Lập trình & Logic (Code)", value: 2.0 },
    { id: "1b", name: "Thiết kế Kiến trúc/Database", value: 1.5 },
    { id: "1c", name: "Viết Tài liệu (Docs)", value: 1.0 },
    { id: "1d", name: "Kiểm thử (Testing)", value: 1.0 },
  ]
};

export function TaskMultiplierTemplates() {
  const [template, setTemplate] = useState<Template>(seTemplate);

  const updateMultiplier = (multId: string, field: "name" | "value", value: string | number) => {
    setTemplate({
      ...template,
      multipliers: template.multipliers.map(m => m.id === multId ? { ...m, [field]: value } : m)
    });
  };

  const addMultiplier = () => {
    setTemplate({
      ...template,
      multipliers: [...template.multipliers, { id: Date.now().toString(), name: "Công việc mới", value: 1.0 }]
    });
  };

  const removeMultiplier = (multId: string) => {
    setTemplate({
      ...template,
      multipliers: template.multipliers.filter(m => m.id !== multId)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Quản lý Bộ khung Hệ số (Cố định cho SE)</p>
            <p className="text-xs mt-1">Hệ thống hiện tại áp dụng cho khối ngành SE nên chỉ sử dụng một Bộ khung hệ số cố định duy nhất. Admin có thể tùy chỉnh danh sách loại công việc và hệ số ở bên dưới.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm flex flex-col h-full">
            <CardHeader className="pb-4">
              <div className="space-y-1">
                <h3 className="font-extrabold text-xl text-primary">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Danh sách Loại công việc & Hệ số</Label>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 space-y-3">
                  {template.multipliers.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Input
                        value={m.name}
                        onChange={(e) => updateMultiplier(m.id, "name", e.target.value)}
                        className="h-10 text-sm font-medium bg-background"
                      />
                      <Input
                        type="number"
                        step="0.1"
                        value={m.value}
                        onChange={(e) => updateMultiplier(m.id, "value", parseFloat(e.target.value) || 0)}
                        className="h-10 w-24 text-center font-bold text-primary bg-primary/5"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMultiplier(m.id)}
                        className="h-10 w-10 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    onClick={addMultiplier}
                    className="w-full h-10 border border-dashed border-border/50 text-sm font-bold mt-2 hover:bg-muted"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm loại công việc
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="rounded-2xl border-border bg-primary/5 shadow-sm h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-lg">Căn cứ Phân bổ Hệ số</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground pt-4">
              <div>
                <strong className="text-foreground">1. Lập trình & Logic (2.0):</strong>
                <p className="mt-1">Theo chuẩn Agile, thước đo chính là "Phần mềm chạy được". Công việc code đòi hỏi tư duy phức tạp và tốn nhiều effort nhất trong Sprint.</p>
              </div>
              <div>
                <strong className="text-foreground">2. Thiết kế Kiến trúc/DB (1.5):</strong>
                <p className="mt-1">Dù ít dòng code hơn nhưng mang tính rủi ro cốt lõi. Thiết kế sai kiến trúc sẽ dẫn đến phải đập đi xây lại toàn bộ dự án.</p>
              </div>
              <div>
                <strong className="text-foreground">3. Kiểm thử / QA (1.0):</strong>
                <p className="mt-1">Ở cấp độ đồ án sinh viên, khối lượng test thường dừng ở mức manual/unit test cơ bản, chất xám bỏ ra ổn định ở mức tiêu chuẩn.</p>
              </div>
              <div>
                <strong className="text-foreground">4. Viết Tài liệu (1.0):</strong>
                <p className="mt-1">Rất quan trọng để bàn giao, nhưng độ phức tạp kỹ thuật thấp. Hệ số 1.0 giúp sinh viên làm docs không bị chênh lệch điểm quá lớn với Dev.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
