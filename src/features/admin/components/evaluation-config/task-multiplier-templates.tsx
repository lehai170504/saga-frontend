import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Plus, Trash2, ShieldAlert, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Mẫu Đồ án Công nghệ Thông tin (IT)",
    description: "Dành cho các lớp PBL chuyên ngành IT, phần mềm, ứng dụng.",
    multipliers: [
      { id: "1a", name: "Lập trình & Logic", value: 2.0 },
      { id: "1b", name: "Thiết kế Kiến trúc/Database", value: 2.5 },
      { id: "1c", name: "Viết Tài liệu & Test", value: 1.0 },
    ]
  },
  {
    id: "2",
    name: "Mẫu Đồ án Kinh tế / Marketing",
    description: "Dành cho các lớp PBL chuyên ngành Quản trị, Marketing.",
    multipliers: [
      { id: "2a", name: "Nghiên cứu Thị trường", value: 2.0 },
      { id: "2b", name: "Chạy chiến dịch Ads", value: 2.0 },
      { id: "2c", name: "Viết Content/Design", value: 1.5 },
      { id: "2d", name: "Thuyết trình & Pitching", value: 1.5 },
    ]
  }
];

export function TaskMultiplierTemplates() {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDesc, setNewTemplateDesc] = useState("");

  const handleAddTemplate = () => {
    if (!newTemplateName.trim()) return;
    setTemplates([...templates, {
      id: Date.now().toString(),
      name: newTemplateName,
      description: newTemplateDesc || "Không có mô tả",
      multipliers: [{ id: Date.now().toString(), name: "Công việc cốt lõi", value: 1.0 }]
    }]);
    setNewTemplateName("");
    setNewTemplateDesc("");
    setIsAddModalOpen(false);
  };

  const removeTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
  };

  const duplicateTemplate = (template: Template) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      multipliers: template.multipliers.map(m => ({ ...m, id: m.id + "-copy-" + Date.now() }))
    };
    setTemplates([...templates, newTemplate]);
  };

  const updateTemplateField = (tplId: string, field: "name" | "description", value: string) => {
    setTemplates(templates.map(t => t.id === tplId ? { ...t, [field]: value } : t));
  };

  const updateMultiplier = (tplId: string, multId: string, field: "name" | "value", value: string | number) => {
    setTemplates(templates.map(t => {
      if (t.id !== tplId) return t;
      return {
        ...t,
        multipliers: t.multipliers.map(m => m.id === multId ? { ...m, [field]: value } : m)
      };
    }));
  };

  const addMultiplier = (tplId: string) => {
    setTemplates(templates.map(t => {
      if (t.id !== tplId) return t;
      return {
        ...t,
        multipliers: [...t.multipliers, { id: Date.now().toString(), name: "Công việc mới", value: 1.0 }]
      };
    }));
  };

  const removeMultiplier = (tplId: string, multId: string) => {
    setTemplates(templates.map(t => {
      if (t.id !== tplId) return t;
      return {
        ...t,
        multipliers: t.multipliers.filter(m => m.id !== multId)
      };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Quản lý Bộ khung Hệ số (Templates)</p>
            <p className="text-xs mt-1">Vì mỗi môn học có tính chất khác nhau, Admin chỉ tạo ra các "Bộ khung mẫu". Giảng viên sẽ chọn khung phù hợp và có quyền tự chỉnh sửa Hệ số cho từng lớp của mình.</p>
          </div>
        </div>

        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="shrink-0 bg-background hover:bg-muted border-emerald-500/30 text-emerald-700 dark:text-emerald-400 font-bold ml-4">
              <Plus className="w-4 h-4 mr-2" /> Tạo Bộ khung mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-2xl">
            <DialogHeader>
              <DialogTitle>Tạo Bộ khung Hệ số mới</DialogTitle>
              <DialogDescription>
                Nhập tên và mô tả cho bộ khung mới. Sau khi tạo, bạn có thể chỉnh sửa chi tiết các loại công việc ở bên dưới.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name" className="text-sm font-bold">Tên Bộ khung</Label>
                <Input
                  id="name"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="VD: Đồ án Kỹ thuật Điện"
                  className="rounded-xl h-10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="desc" className="text-sm font-bold">Mô tả ngắn</Label>
                <Input
                  id="desc"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="Dành cho sinh viên khối ngành kỹ thuật..."
                  className="rounded-xl h-10"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)} className="rounded-xl">Hủy</Button>
              <Button onClick={handleAddTemplate} className="rounded-xl bg-primary text-primary-foreground font-bold">Tạo Bộ khung</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {templates.map((tpl) => (
          <Card key={tpl.id} className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-all flex flex-col">
            <CardHeader className="pb-4">
              <div className="space-y-3">
                <Input
                  value={tpl.name}
                  onChange={(e) => updateTemplateField(tpl.id, "name", e.target.value)}
                  className="font-extrabold text-lg h-10 rounded-xl bg-background border-border/50 focus-visible:ring-primary/20"
                />
                <Input
                  value={tpl.description}
                  onChange={(e) => updateTemplateField(tpl.id, "description", e.target.value)}
                  className="text-sm h-8 rounded-lg bg-transparent border-transparent focus-visible:ring-primary/20 px-1"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1 mb-6">
                <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Danh sách Loại công việc & Hệ số</Label>
                <div className="p-3 bg-muted/30 rounded-xl border border-border/50 space-y-3">
                  {tpl.multipliers.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <Input
                        value={m.name}
                        onChange={(e) => updateMultiplier(tpl.id, m.id, "name", e.target.value)}
                        className="h-8 text-sm font-medium bg-background"
                      />
                      <Input
                        type="number"
                        step="0.1"
                        value={m.value}
                        onChange={(e) => updateMultiplier(tpl.id, m.id, "value", parseFloat(e.target.value) || 0)}
                        className="h-8 w-20 text-center font-bold text-primary bg-primary/5"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMultiplier(tpl.id, m.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addMultiplier(tpl.id)}
                    className="w-full h-8 border border-dashed border-border/50 text-xs font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Thêm loại công việc
                  </Button>
                </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-border/50 gap-2">
                <Button onClick={() => duplicateTemplate(tpl)} variant="ghost" className="text-muted-foreground hover:bg-primary/10 hover:text-primary h-8 px-3 rounded-lg text-xs font-bold">
                  <Copy className="w-3 h-3 mr-1.5" /> Nhân bản
                </Button>
                <Button onClick={() => removeTemplate(tpl.id)} variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3 rounded-lg text-xs font-bold">
                  <Trash2 className="w-3 h-3 mr-1.5" /> Xóa bộ khung
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
