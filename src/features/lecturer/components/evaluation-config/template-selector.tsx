"use client";
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2, BookOpen, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function TemplateSelector() {
  const [selectedTemplate, setSelectedTemplate] = useState("1");
  const [multipliers, setMultipliers] = useState([
    { id: "1a", name: "Lập trình & Logic", value: 2.0 },
    { id: "1b", name: "Thiết kế Kiến trúc/Database", value: 2.5 },
    { id: "1c", name: "Viết Tài liệu & Test", value: 1.0 },
  ]);

  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    // Simulate fetching template data
    if (value === "1") {
      setMultipliers([
        { id: "1a", name: "Lập trình & Logic", value: 2.0 },
        { id: "1b", name: "Thiết kế Kiến trúc/Database", value: 2.5 },
        { id: "1c", name: "Viết Tài liệu & Test", value: 1.0 },
      ]);
    } else {
      setMultipliers([
        { id: "2a", name: "Nghiên cứu Thị trường", value: 2.0 },
        { id: "2b", name: "Chạy chiến dịch Ads", value: 2.0 },
        { id: "2c", name: "Viết Content/Design", value: 1.5 },
        { id: "2d", name: "Thuyết trình & Pitching", value: 1.5 },
      ]);
    }
  };

  const updateMultiplier = (id: string, field: "name" | "value", value: string | number) => {
    setMultipliers(multipliers.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMultiplier = (id: string) => {
    setMultipliers(multipliers.filter(m => m.id !== id));
  };

  const addMultiplier = () => {
    setMultipliers([...multipliers, { id: Date.now().toString(), name: "Công việc mới", value: 1.0 }]);
  };

  return (
    <Card className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" /> Kế thừa & Tùy chỉnh Khung Hệ số
        </CardTitle>
        <CardDescription>
          Chọn Bộ khung được Admin thiết lập sẵn cho Khối ngành, sau đó bạn có thể tự do thêm, bớt hoặc điều chỉnh Hệ số (Multipliers) sao cho phù hợp với Lớp học này.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Template Selection */}
        <div className="p-4 bg-muted/30 border border-border/50 rounded-xl space-y-3">
          <Label className="font-bold text-sm">Chọn Bộ khung Mẫu (Template)</Label>
          <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
            <SelectTrigger className="h-12 rounded-xl bg-background border-border/50 font-medium">
              <SelectValue placeholder="Chọn một bộ khung mẫu..." />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1">Mẫu Đồ án Công nghệ Thông tin (IT)</SelectItem>
              <SelectItem value="2">Mẫu Đồ án Kinh tế / Marketing</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-2">
            Mẹo: Khi đổi Template, toàn bộ danh sách công việc bên dưới sẽ bị reset về mặc định của Template đó.
          </p>
        </div>

        {/* Customizing Multipliers */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold mb-2">
            <Settings2 className="w-5 h-5 text-primary" />
            <h3>Tinh chỉnh Hệ số Công việc của Lớp</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="h-10 w-20 text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20" 
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
              className="h-[66px] border-dashed border-2 border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/50 rounded-xl font-bold transition-all"
            >
              <Plus className="w-4 h-4 mr-2" /> Thêm Loại Công Việc Mới
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
