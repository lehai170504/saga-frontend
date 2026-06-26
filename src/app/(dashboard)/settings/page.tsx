"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Moon,
  Sun,
  Globe,
  ExternalLink,
  ChevronRight,
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
  const [theme, setTheme] = useState("light");
  const [timezone, setTimezone] = useState("GMT+7");

  // Load from localStorage on mount
  useEffect(() => {
    const savedGit = localStorage.getItem("saga-git-connected") === "true";
    const savedGitUser = localStorage.getItem("saga-git-username") || "";
    const savedJira = localStorage.getItem("saga-jira-connected") === "true";
    const savedJiraEmail = localStorage.getItem("saga-jira-email") || "";
    const savedTheme = localStorage.getItem("saga-theme") || "light";
    const savedTimezone = localStorage.getItem("saga-timezone") || "GMT+7";

    setGitConnected(savedGit);
    setGitAccount(savedGitUser);
    setGitUsername(savedGitUser);
    setJiraConnected(savedJira);
    setJiraAccount(savedJiraEmail);
    setJiraEmail(savedJiraEmail);
    setTheme(savedTheme);
    setTimezone(savedTimezone);

    const timer = setTimeout(() => setIsLoading(false), 500);
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
    localStorage.setItem("saga-theme", theme);
    localStorage.setItem("saga-timezone", timezone);
    toast.success("Cập nhật cấu hình cá nhân thành công!");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500 min-h-screen pb-16">
      <PageHeader
        title="Kết nối tài khoản & Cài đặt"
        description="Quản lý việc liên kết tài khoản GitHub & Jira cá nhân của sinh viên để đồng bộ hóa chỉ số đóng góp mã nguồn và tiến độ công việc."
      />

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="h-80 animate-pulse bg-slate-100/50 border border-slate-200/50" />
          <Card className="h-80 animate-pulse bg-slate-100/50 border border-slate-200/50" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3 items-start">
          {/* Main Account Integrations Column (Span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* GRID OF INTEGRATION CARDS */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              
              {/* CARD 1: GITHUB CONNECTION */}
              <Card className="relative border border-slate-200/60 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="h-2 w-full bg-slate-900" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-100 rounded-2xl text-slate-800 shadow-sm">
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
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold animate-in zoom-in-95 duration-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-full text-xs font-bold">
                          Chưa kết nối
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-extrabold text-slate-800 text-lg">Đồng bộ GitHub</h4>
                      <p className="text-slate-500 font-medium text-xs mt-2 leading-relaxed">
                        Liên kết Username GitHub để hệ thống SAGA tự động ánh xạ dữ liệu git commits và pull requests của bạn vào báo cáo nhóm.
                      </p>
                    </div>
                  </div>

                  {gitConnected ? (
                    /* Connected UI state */
                    <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                          {gitAccount.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate flex items-center gap-1">
                            {gitAccount}
                            <a
                              href={`https://github.com/${gitAccount}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Tài khoản liên kết</p>
                        </div>
                        <button
                          onClick={handleDisconnectGit}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between px-1">
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 size={10} /> Syncing Auto
                        </span>
                        <span>Đồng bộ: 5 phút trước</span>
                      </div>
                    </div>
                  ) : (
                    /* Connection Form UI */
                    <form onSubmit={handleConnectGit} className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <Label htmlFor="git-user" className="text-slate-600 text-xs font-bold">Username GitHub</Label>
                          <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-slate-400 hover:text-orange-500 font-bold flex items-center gap-0.5"
                          >
                            Tạo tài khoản <ExternalLink size={8} />
                          </a>
                        </div>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-slate-400 font-bold text-sm">@</span>
                          <Input
                            id="git-user"
                            placeholder="Ví dụ: lehai1705"
                            className="pl-8 h-11 bg-white border border-slate-200 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl text-sm font-medium transition-all"
                            value={gitUsername}
                            onChange={(e) => setGitUsername(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isConnectingGit}
                        className="w-full h-11 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
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
              <Card className="relative border border-slate-200/60 shadow-sm rounded-3xl bg-white overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div className="h-2 w-full bg-blue-600" />
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                        {/* Custom Jira SVG */}
                        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11.53 2.308a3.1 3.1 0 0 0-4.385 0L.438 9.015a3.1 3.1 0 0 0 0 4.385l6.707 6.707a3.1 3.1 0 0 0 4.385 0l6.707-6.707a3.1 3.1 0 0 0 0-4.385L11.53 2.308Zm8.769 4.385a3.1 3.1 0 0 0-4.384 0l-6.708 6.707a3.1 3.1 0 0 0 0 4.385l6.708 6.707a3.1 3.1 0 0 0 4.384 0l6.708-6.707a3.1 3.1 0 0 0 0-4.385l-6.708-6.707Z" />
                        </svg>
                      </div>
                      {jiraConnected ? (
                        <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-bold animate-in zoom-in-95 duration-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Đã kết nối
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 border border-slate-200/60 rounded-full text-xs font-bold">
                          Chưa kết nối
                        </span>
                      )}
                    </div>

                    <div className="mt-4">
                      <h4 className="font-extrabold text-slate-800 text-lg">Đồng bộ Jira Cloud</h4>
                      <p className="text-slate-500 font-medium text-xs mt-2 leading-relaxed">
                        Kết nối tài khoản Jira Cloud để đồng bộ hóa trạng thái các Tasks (To Do, In Progress, Done) bạn phụ trách lên Burndown chart của nhóm.
                      </p>
                    </div>
                  </div>

                  {jiraConnected ? (
                    /* Connected UI state */
                    <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                      <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-sm shadow-inner">
                          {jiraAccount.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{jiraAccount}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Email Jira liên kết</p>
                        </div>
                        <button
                          onClick={handleDisconnectJira}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 cursor-pointer"
                          title="Ngắt kết nối"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold flex items-center justify-between px-1">
                        <span className="flex items-center gap-1 text-blue-600">
                          <CheckCircle2 size={10} /> Syncing Auto
                        </span>
                        <span>Đồng bộ: 10 phút trước</span>
                      </div>
                    </div>
                  ) : (
                    /* Connection Form UI */
                    <form onSubmit={handleConnectJira} className="space-y-3 pt-4 border-t border-slate-100 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <Label htmlFor="jira-mail" className="text-slate-600 text-xs font-bold">Email tài khoản Jira</Label>
                        <div className="relative">
                          <AtSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="jira-mail"
                            type="email"
                            placeholder="Ví dụ: student@email.com"
                            className="pl-10 h-11 bg-white border border-slate-200 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl text-sm font-medium transition-all"
                            value={jiraEmail}
                            onChange={(e) => setJiraEmail(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <Label htmlFor="jira-token" className="text-slate-600 text-xs font-bold">Jira API Token</Label>
                          <a
                            href="https://id.atlassian.com/manage-profile/security/api-tokens"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] text-orange-500 hover:underline font-bold flex items-center gap-0.5"
                          >
                            Lấy Token <ExternalLink size={8} />
                          </a>
                        </div>
                        <div className="relative">
                          <Key className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                          <Input
                            id="jira-token"
                            type="password"
                            placeholder="Nhập API Token bảo mật"
                            className="pl-10 h-11 bg-white border border-slate-200 focus-visible:ring-2 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 rounded-xl text-sm font-medium transition-all"
                            value={jiraToken}
                            onChange={(e) => setJiraToken(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={isConnectingJira}
                        className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm disabled:opacity-50"
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
            <Card className="border border-orange-100 bg-orange-50/30 rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-start shadow-sm">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
                <Link2 size={20} />
              </div>
              <div className="space-y-1">
                <h5 className="font-extrabold text-slate-800 text-sm">Vì sao cần kết nối tài khoản?</h5>
                <p className="text-slate-500 text-xs font-medium leading-relaxed">
                  SAGA Continuous Dashboard là nền tảng theo dõi và chấm điểm liên tục (Continuous Grading). Để hệ thống nhận diện đúng vai trò và số lượng đóng góp thực tế của bạn, việc kết nối thông qua Username GitHub và Jira cá nhân là bắt buộc. Hệ thống mã hóa bảo mật toàn bộ API Tokens của bạn.
                </p>
              </div>
            </Card>

          </div>

          {/* Right Preferences Settings Card (Span 1) */}
          <div className="space-y-6">
            <Card className="border border-slate-200/60 shadow-sm rounded-3xl bg-white p-6 hover:shadow-md transition-all duration-300">
              <h3 className="font-extrabold text-slate-800 text-base mb-6 flex items-center gap-2">
                <SettingsIcon className="text-orange-500" size={18} />
                Cấu hình cá nhân
              </h3>
              <div className="space-y-6">
                
                {/* Theme Selection */}
                <div className="space-y-2">
                  <Label className="text-slate-600 text-xs font-bold flex items-center gap-1.5">
                    <Sun size={14} />
                    Chế độ hiển thị
                  </Label>
                  <div className="grid grid-cols-2 gap-2 bg-slate-100/60 p-1 rounded-xl">
                    <button
                      onClick={() => setTheme("light")}
                      className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === "light"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Sun size={13} />
                      Sáng
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === "dark"
                          ? "bg-white text-orange-600 shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      <Moon size={13} />
                      Tối
                    </button>
                  </div>
                </div>

                {/* Timezone Selection */}
                <div className="space-y-2">
                  <Label htmlFor="timezone-select" className="text-slate-600 text-xs font-bold flex items-center gap-1.5">
                    <Globe size={14} />
                    Múi giờ làm việc
                  </Label>
                  <div className="relative">
                    <select
                      id="timezone-select"
                      className="w-full h-10 bg-white border border-slate-200 rounded-xl px-3 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-sm appearance-none cursor-pointer"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option value="GMT+7">Hà Nội (GMT+7)</option>
                      <option value="GMT+8">Singapore (GMT+8)</option>
                      <option value="GMT+0">London (GMT+0)</option>
                    </select>
                    <div className="absolute right-3 top-3.5 pointer-events-none text-slate-400">
                      <ChevronRight size={14} className="rotate-90" />
                    </div>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  onClick={handleSaveGeneral}
                  className="w-full h-10 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Lưu cấu hình cá nhân
                </Button>
              </div>
            </Card>

            {/* Quick Status / Profile Summary Card */}
            <Card className="border border-slate-200/60 shadow-sm rounded-3xl bg-slate-50/50 p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-orange-500/20">
                  LH
                </div>
                <div>
                  <h6 className="font-extrabold text-slate-800 text-xs">Lê Hoàng Hải</h6>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">MSSV: 102210123</p>
                </div>
              </div>
              <div className="border-t border-slate-200/60 pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Lớp sinh hoạt:</span>
                  <span className="text-slate-800 font-bold">21T_DT1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-medium">Vai trò dự án:</span>
                  <span className="text-slate-800 font-bold text-orange-600">Student Developer</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
