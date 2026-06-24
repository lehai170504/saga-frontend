"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [githubToken, setGithubToken] = useState("");
  const [jiraToken, setJiraToken] = useState("");
  const [isValidatingGithub, setIsValidatingGithub] = useState(false);
  const [isValidatingJira, setIsValidatingJira] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleValidateToken = async (type: "github" | "jira") => {
    const token = type === "github" ? githubToken : jiraToken;
    const setter =
      type === "github" ? setIsValidatingGithub : setIsValidatingJira;
    const label = type === "github" ? "GitHub" : "Jira";

    if (!token.trim()) {
      toast.error(`Vui lòng nhập ${label} Token trước!`);
      return;
    }

    setter(true);
    toast.loading(`Đang xác thực ${label} Token...`, {
      id: `validate-${type}`,
    });

    await new Promise((res) => setTimeout(res, 1500));

    setter(false);

    // Mock: token hợp lệ nếu dài hơn 6 ký tự
    if (token.length > 6) {
      toast.success(`✅ ${label} Token hợp lệ! Kết nối thành công.`, {
        id: `validate-${type}`,
        duration: 3000,
      });
    } else {
      toast.error(
        `❌ ${label} Token không hợp lệ. Vui lòng kiểm tra lại.`,
        { id: `validate-${type}`, duration: 4000 }
      );
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading("Đang lưu cấu hình...", { id: "save-config" });
    await new Promise((res) => setTimeout(res, 1200));
    setIsSaving(false);
    toast.success("Cấu hình đã được lưu thành công!", {
      id: "save-config",
      duration: 3000,
    });
  };

  const handleCancel = () => {
    setGithubToken("");
    setJiraToken("");
    toast.info("Đã hủy các thay đổi chưa lưu.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý tùy chọn hiển thị và kết nối API ngoại vi"
      />

      {/* Cấu hình cá nhân */}
      <Card className="border-border shadow-sm rounded-2xl pt-2 flex flex-col">
        <SectionHeader
          title="Cấu hình cá nhân"
          description="Tùy chỉnh giao diện và múi giờ"
        />
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold">
                Chế độ tối (Dark Mode)
              </Label>
              <p className="text-sm text-muted-foreground">
                Chuyển đổi giao diện sang nền tối.
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) => {
                setTheme(checked ? "dark" : "light");
                toast.success(
                  checked ? "Đã bật chế độ tối 🌙" : "Đã bật chế độ sáng ☀️"
                );
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base font-bold">Múi giờ hệ thống</Label>
              <p className="text-sm text-muted-foreground">
                Đồng bộ thời gian commit và tương tác.
              </p>
            </div>
            <Select defaultValue="gmt7">
              <SelectTrigger className="w-full sm:w-[250px] bg-background border-border">
                <SelectValue placeholder="Chọn múi giờ" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="gmt7">
                  (GMT+07:00) Bangkok, Hanoi, Jakarta
                </SelectItem>
                <SelectItem value="utc">
                  (UTC) Coordinated Universal Time
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tích hợp API */}
      <Card className="border-border shadow-sm rounded-2xl pt-2 flex flex-col">
        <SectionHeader
          title="Tích hợp API (Integrations)"
          description="Kết nối với Jira và GitHub để tự động đồng bộ dữ liệu"
        />
        <CardContent className="p-6 space-y-8">
          {/* GitHub Token */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">
              GitHub Personal Access Token
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                className="bg-background border-border focus-visible:ring-orange-500"
              />
              <Button
                variant="secondary"
                className="shrink-0"
                onClick={() => handleValidateToken("github")}
                disabled={isValidatingGithub}
              >
                {isValidatingGithub ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực Token"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Cần quyền {"'repo'"} để đọc dữ liệu pull requests và commits.
            </p>
          </div>

          {/* Jira Token */}
          <div className="space-y-3">
            <Label className="text-sm font-bold">Jira API Token</Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="password"
                placeholder="Nhập Jira token..."
                value={jiraToken}
                onChange={(e) => setJiraToken(e.target.value)}
                className="bg-background border-border focus-visible:ring-orange-500"
              />
              <Button
                variant="secondary"
                className="shrink-0"
                onClick={() => handleValidateToken("jira")}
                disabled={isValidatingJira}
              >
                {isValidatingJira ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xác thực...
                  </>
                ) : (
                  "Xác thực Token"
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Sử dụng email tài khoản Atlassian và mã token ứng dụng.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={handleCancel}>
          Hủy thay đổi
        </Button>
        <Button
          variant="default"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            "Lưu cấu hình"
          )}
        </Button>
      </div>
    </div>
  );
}
