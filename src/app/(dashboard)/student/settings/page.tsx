"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/shared/PageHeader";
import { toast } from "sonner";
import {
  Key,
  RefreshCw,
  CheckCircle2,
  Trash2,
  Settings as SettingsIcon,
  Link2,
  AtSign,
  Globe,
  ExternalLink,
  ChevronRight,
  Eye,
  EyeOff,
  Shield,
  Lock,
} from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  // GitHub connection states
  const [gitUsername, setGitUsername] = useState("");
  const [gitConnected, setGitConnected] = useState(false);
  const [isConnectingGit, setIsConnectingGit] = useState(false);
  const [gitAccount, setGitAccount] = useState("");

  // Jira connection states
  const [jiraEmail, setJiraEmail] = useState("");
  const [jiraToken, setJiraToken] = useState("");
  const [jiraConnected, setJiraConnected] = useState(false);
  const [isConnectingJira, setIsConnectingJira] = useState(false);
  const [jiraAccount, setJiraAccount] = useState("");

  // General settings states
  const [timezone, setTimezone] = useState("GMT+7");

  // Change Password states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedGit = localStorage.getItem("saga-git-connected") === "true";
    const savedGitUser = localStorage.getItem("saga-git-username") || "";
    const savedJira = localStorage.getItem("saga-jira-connected") === "true";
    const savedJiraEmail = localStorage.getItem("saga-jira-email") || "";
    const savedTimezone = localStorage.getItem("saga-timezone") || "GMT+7";

    const timer = setTimeout(() => {
      setGitConnected(savedGit);
      setGitAccount(savedGitUser);
      setGitUsername(savedGitUser);
      setJiraConnected(savedJira);
      setJiraAccount(savedJiraEmail);
      setJiraEmail(savedJiraEmail);
      setTimezone(savedTimezone);
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleConnectGit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gitUsername.trim()) {
      toast.error("Vui lòng nhập Username GitHub cá nhân");
      return;
    }

    setIsConnectingGit(true);
    // Simulate connection delay with animations
    setTimeout(() => {
      setIsConnectingGit(false);
      setGitConnected(true);
      setGitAccount(gitUsername);
      localStorage.setItem("saga-git-connected", "true");
      localStorage.setItem("saga-git-username", gitUsername);
      toast.success("Kết nối tài khoản GitHub thành công!");
    }, 1200);
  };

  const handleDisconnectGit = () => {
    setGitConnected(false);
    setGitAccount("");
    setGitUsername("");
    localStorage.removeItem("saga-git-connected");
    localStorage.removeItem("saga-git-username");
    toast.info("Đã ngắt kết nối tài khoản GitHub cá nhân.");
  };

  const handleConnectJira = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jiraEmail.trim()) {
      toast.error("Vui lòng điền Email Atlassian Jira");
      return;
    }
    if (!jiraToken.trim()) {
      toast.error("Vui lòng điền API Token");
      return;
    }

    setIsConnectingJira(true);
    setTimeout(() => {
      setIsConnectingJira(false);
      setJiraConnected(true);
      setJiraAccount(jiraEmail);
      localStorage.setItem("saga-jira-connected", "true");
      localStorage.setItem("saga-jira-email", jiraEmail);
      toast.success("Kết nối tài khoản Jira Cloud thành công!");
    }, 1200);
  };

  const handleDisconnectJira = () => {
    setJiraConnected(false);
    setJiraAccount("");
    setJiraEmail("");
    setJiraToken("");
    localStorage.removeItem("saga-jira-connected");
    localStorage.removeItem("saga-jira-email");
    toast.info("Đã ngắt kết nối tài khoản Jira Cloud.");
  };

  const handleSaveGeneral = () => {
    localStorage.setItem("saga-timezone", timezone);
    toast.success("Cập nhật cấu hình cá nhân thành công!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ thông tin mật khẩu!");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Đổi mật khẩu thành công!");
    }, 1500);
  };

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16 bg-background text-foreground">
      <PageHeader
        title="Kết nối tài khoản & Cài đặt"
        description="Quản lý việc liên kết tài khoản GitHub & Jira cá nhân của sinh viên để đồng bộ hóa chỉ số đóng góp mã nguồn và tiến độ công việc."
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-80 animate-pulse bg-muted border border-border" />
          <Card className="h-80 animate-pulse bg-muted border border-border" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Main Account Integrations Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">

            {/* GRID OF INTEGRATION CARDS */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">

              {/* CARD 1: GITHUB CONNECTION */}
              <Card className="relative border border-border shadow-sm rounded-3xl bg-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="h-2 w-full bg-card" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-card rounded-2xl text-foreground dark:text-slate-200 shadow-sm">
                        {/* Custom GitHub SVG */}
                        <svg
                          className="h-6 w-6 fill-current"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                        </svg>
                      </div>
                      {gitConnected ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 dark:bg-emerald-950/30 text-success border border-success/20 rounded-full text-xs font-bold animate-in zoom-in-95 duration-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-card text-muted-foreground border border-border rounded-full text-xs font-bold">
                          Chưa kết nối
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-extrabold text-foreground text-lg">Đồng bộ GitHub</h4>
                      <p className="text-muted-foreground font-medium text-xs mt-2 leading-relaxed">
                        Liên kết Username GitHub để hệ thống SAGA tự động ánh xạ dữ liệu git commits và pull requests của bạn vào báo cáo nhóm.
                      </p>
                    </div>
                  </div>

                  {gitConnected ? (
                    /* Connected UI state */
                    <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-300">
                      <div className="flex items-center gap-3 bg-card p-4 rounded-2xl border border-border">
                        <div className="w-10 h-10 rounded-full bg-card dark:bg-slate-700 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                          {gitAccount.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate flex items-center gap-1">
                            {gitAccount}
                            <a
                              href={`https://github.com/${gitAccount}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mt-0.5">Tài khoản liên kết</p>
                        </div>
                        <button
                          onClick={handleDisconnectGit}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-between px-1">
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle2 size={10} /> Tự động đồng bộ
                        </span>
                        <span>Đồng bộ: 5 phút trước</span>
                      </div>
                    </div>
                  ) : (
                    /* Connection Form UI */
                    <form onSubmit={handleConnectGit} className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-300">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <Label htmlFor="git-user" className="text-muted-foreground text-xs font-bold">Username GitHub</Label>
                          <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-muted-foreground text-primary dark:text-primary font-bold flex items-center gap-0.5"
                          >
                            Tạo tài khoản <ExternalLink size={8} />
                          </a>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-muted-foreground font-bold text-sm">@</span>
                          <Input
                            id="git-user"
                            placeholder="Ví dụ: lehai1705"
                            className="pl-8 h-11 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary12836 focus-visible:border-primary/20 rounded-xl text-sm font-medium transition-all"
                            value={gitUsername}
                            onChange={(e) => setGitUsername(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isConnectingGit}
                        className="w-full h-11 bg-card dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isConnectingGit ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Đang kết nối...
                          </>
                        ) : (
                          "Kết nối tài khoản GitHub"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Card>

              {/* CARD 2: JIRA CONNECTION */}
              <Card className="relative border border-border shadow-sm rounded-3xl bg-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="h-2 w-full bg-primary bg-primary/20" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-primary/10 dark:bg-blue-950/50 text-primary rounded-2xl shadow-sm">
                        {/* Custom Jira SVG */}
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.004 0c-2.35 2.395-2.365 6.185.133 8.585l3.412 3.413-3.197 3.198a6.501 6.501 0 0 1 1.412 7.04l9.566-9.566a.95.95 0 0 0 0-1.344L12.004 0zm-1.748 1.74L.67 11.327a.95.95 0 0 0 0 1.344C4.45 16.44 8.22 20.244 12 24c2.295-2.298 2.395-6.096-.08-8.533l-3.47-3.469 3.2-3.2c-1.918-1.955-2.363-4.725-1.394-7.057z" />
                        </svg>
                      </div>
                      {jiraConnected ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 dark:bg-blue-950/30 text-primary border border-primary/20 rounded-full text-xs font-bold animate-in zoom-in-95 duration-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-card text-muted-foreground border border-border rounded-full text-xs font-bold">
                          Chưa kết nối
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-extrabold text-foreground text-lg">Đồng bộ Jira Cloud</h4>
                      <p className="text-muted-foreground font-medium text-xs mt-2 leading-relaxed">
                        Kết nối tài khoản Jira Cloud để đồng bộ hóa trạng thái các Tasks (To Do, In Progress, Done) bạn phụ trách lên Burndown chart của nhóm.
                      </p>
                    </div>
                  </div>

                  {jiraConnected ? (
                    /* Connected UI state */
                    <div className="space-y-4 pt-4 border-t border-border animate-in fade-in duration-300">
                      <div className="flex items-center gap-3 bg-card p-4 rounded-2xl border border-border">
                        <div className="w-10 h-10 rounded-full bg-primary/10 dark:bg-blue-950 text-primary font-bold flex items-center justify-center text-sm shadow-inner">
                          {jiraAccount.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-foreground truncate">{jiraAccount}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wide mt-0.5">Email Jira liên kết</p>
                        </div>
                        <button
                          onClick={handleDisconnectJira}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold flex items-center justify-between px-1">
                        <span className="flex items-center gap-1 text-primary">
                          <CheckCircle2 size={10} /> Tự động đồng bộ
                        </span>
                        <span>Đồng bộ: 10 phút trước</span>
                      </div>
                    </div>
                  ) : (
                    /* Connection Form UI */
                    <form onSubmit={handleConnectJira} className="space-y-3 pt-4 border-t border-border animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <Label htmlFor="jira-mail" className="text-muted-foreground text-xs font-bold">Email tài khoản Jira</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="jira-mail"
                            type="email"
                            placeholder="Ví dụ: student@email.com"
                            className="pl-10 h-11 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary19195 focus-visible:border-primary/20 rounded-xl text-sm font-medium transition-all"
                            value={jiraEmail}
                            onChange={(e) => setJiraEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label htmlFor="jira-token" className="text-muted-foreground text-xs font-bold">Jira API Token</Label>
                          <a
                            href="https://id.atlassian.com/manage-profile/security/api-tokens"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-primary hover:underline font-bold flex items-center gap-0.5"
                          >
                            Lấy Token <ExternalLink size={8} />
                          </a>
                        </div>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="jira-token"
                            type="password"
                            placeholder="Nhập API Token bảo mật"
                            className="pl-10 h-11 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary20734 focus-visible:border-primary/20 rounded-xl text-sm font-medium transition-all"
                            value={jiraToken}
                            onChange={(e) => setJiraToken(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isConnectingJira}
                        className="w-full h-11 bg-primary hover:bg-blue-700 dark:bg-blue-700 dark:bg-primary/20 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isConnectingJira ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Đang kết nối...
                          </>
                        ) : (
                          "Kết nối tài khoản Jira Cloud"
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </Card>

            </div>

            {/* INTEGRATION TIPS CARD */}
            <Card className="border border-primary/20 bg-primary/10 dark:bg-indigo-950/10 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start shadow-sm">
              <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                <Link2 size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-foreground text-sm">Vì sao cần kết nối tài khoản?</h5>
                <p className="text-muted-foreground text-xs font-medium leading-relaxed">
                  SAGA Continuous Dashboard là nền tảng theo dõi và chấm điểm liên tục (Continuous Grading). Để hệ thống nhận diện đúng vai trò và số lượng đóng góp thực tế của bạn, việc kết nối thông qua Username GitHub và Jira cá nhân là bắt buộc. Hệ thống mã hóa bảo mật toàn bộ API Tokens của bạn.
                </p>
              </div>
            </Card>

          </div>

          {/* Right Preferences Settings Card (Span 1) */}
          <div className="space-y-6">
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-6 hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-foreground text-base mb-6 flex items-center gap-2">
                <SettingsIcon className="text-primary" size={18} />
                Cấu hình cá nhân
              </h3>
              <div className="space-y-6">



                {/* Timezone Selection */}
                <div className="space-y-2">
                  <Label htmlFor="timezone-select" className="text-muted-foreground text-xs font-bold flex items-center gap-1.5">
                    <Globe size={14} />
                    Múi giờ làm việc
                  </Label>
                  <div className="relative">
                    <select
                      id="timezone-select"
                      className="w-full h-10 bg-background border border-border rounded-xl px-3 text-xs font-bold focus:outline-none focus:ring-2 ring-primary24071 border-primary/20 shadow-sm appearance-none cursor-pointer text-foreground"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="GMT+7">Hà Nội (GMT+7)</option>
                      <option value="GMT+8">Singapore (GMT+8)</option>
                      <option value="GMT+0">London (GMT+0)</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-muted-foreground">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleSaveGeneral}
                  className="w-full h-10 bg-primary hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Lưu cấu hình cá nhân
                </Button>
              </div>
            </Card>

            {/* Change Password Card */}
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-6 hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-foreground text-base mb-6 flex items-center gap-2">
                <Shield className="text-primary" size={18} />
                Đổi mật khẩu
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Mật khẩu hiện tại</Label>
                  <div className="relative flex items-center">
                    <Key className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary26384 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Mật khẩu mới</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary27650 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-muted-foreground text-xs font-bold">Xác nhận mật khẩu mới</Label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-9 pr-10 h-10 bg-background border border-border focus-visible:ring-2 focus-visible:ring-primary28933 focus-visible:border-primary/20 rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full h-10 mt-2 bg-card dark:hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
                >
                  {isChangingPassword ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật mật khẩu"
                  )}
                </Button>
              </form>
            </Card>

            {/* Quick Status / Profile Summary Card */}
            <Card className="border border-border shadow-sm rounded-3xl bg-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary text-white font-extrabold flex items-center justify-center shadow-md shadow-indigo-500/20">
                  LH
                </div>
                <div>
                  <h6 className="font-extrabold text-foreground text-xs">Lê Hoàng Hải</h6>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase mt-0.5">MSSV: 102210123</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Lớp sinh hoạt:</span>
                  <span className="text-foreground font-bold">21T_DT1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">Vai trò dự án:</span>
                  <span className="text-primary font-bold">Student Developer</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
