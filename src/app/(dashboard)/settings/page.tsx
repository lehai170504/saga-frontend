"use client";

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

export default function SettingsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-slate-50/50 min-h-screen">
      <PageHeader
        title="Cài đặt hệ thống"
        description="Quản lý tùy chọn hiển thị và kết nối API ngoại vi"
      />

      <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white pt-2 flex flex-col">
        <SectionHeader
          title="Cấu hình cá nhân"
          description="Tùy chỉnh giao diện và múi giờ"
        />
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-bold text-slate-800">
                Chế độ tối (Dark Mode)
              </Label>
              <p className="text-sm text-slate-500">
                Chuyển đổi giao diện sang nền tối (Đang cập nhật).
              </p>
            </div>
            <Switch disabled />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-base font-bold text-slate-800">
                Múi giờ hệ thống
              </Label>
              <p className="text-sm text-slate-500">
                Đồng bộ thời gian commit và tương tác.
              </p>
            </div>
            <Select defaultValue="gmt7">
              <SelectTrigger className="w-full sm:w-[250px] bg-slate-50 border-slate-200">
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

      <Card className="border-slate-200/60 shadow-sm rounded-2xl bg-white pt-2 flex flex-col">
        <SectionHeader
          title="Tích hợp API (Integrations)"
          description="Kết nối với Jira và GitHub để tự động đồng bộ dữ liệu"
        />
        <CardContent className="p-6 space-y-8">
          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-800">
              GitHub Personal Access Token
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="password"
                placeholder="ghp_xxxxxxxxxxxx"
                className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500"
              />
              <Button variant="secondary" className="shrink-0">
                Xác thực Token
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Cần quyền {"'repo'"} để đọc dữ liệu pull requests và commits.
            </p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-bold text-slate-800">
              Jira API Token
            </Label>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="password"
                placeholder="Nhập Jira token..."
                className="bg-slate-50 border-slate-200 focus-visible:ring-orange-500"
              />
              <Button variant="secondary" className="shrink-0">
                Xác thực Token
              </Button>
            </div>
            <p className="text-xs text-slate-500">
              Sử dụng email tài khoản Atlassian và mã token ứng dụng.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="soft">Hủy thay đổi</Button>
        <Button variant="default">Lưu cấu hình</Button>
      </div>
    </div>
  );
}
