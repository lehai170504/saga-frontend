// src/app/contribution/page.tsx
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  studentSkillData,
  teamContributionRows,
} from "@/mock-data/contribution";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function ContributionPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200/60">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
            Đóng góp cá nhân
          </h2>
          <p className="text-slate-500 mt-1 font-medium">
            Hệ thống đánh giá liên tục SAGA - Phân tích hiệu suất đa chiều
          </p>
        </div>
        <Select defaultValue="sv001">
          <SelectTrigger className="w-65 h-12 bg-slate-50 border-slate-200 rounded-xl focus:ring-orange-500 focus:border-orange-500 transition-all">
            <SelectValue placeholder="Chọn thành viên..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {teamContributionRows.map((student) => (
              <SelectItem key={student.id} value={student.id.toLowerCase()}>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{student.name}</span>
                  <span className="text-xs text-slate-400">
                    ({student.role})
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Radar Chart Card */}
        <Card className="border-slate-200/60 shadow-sm md:col-span-4 flex flex-col rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-orange-500 rounded-full inline-block"></span>
              Khung năng lực cá nhân
            </CardTitle>
            <CardDescription className="pl-4">
              Đối chiếu chỉ số với trung bình toàn dự án
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-75">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="65%"
                  data={studentSkillData}
                >
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#475569", fontSize: 12, fontWeight: 500 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Radar
                    name="Cá nhân"
                    dataKey="A"
                    stroke="#f97316" /* Orange SAGA */
                    strokeWidth={2}
                    fill="#f97316"
                    fillOpacity={0.35}
                  />
                  <Radar
                    name="Trung bình nhóm"
                    dataKey="B"
                    stroke="#0052CC" /* Jira Blue */
                    strokeWidth={2}
                    fill="#0052CC"
                    fillOpacity={0.15}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{
                      fontSize: "13px",
                      fontWeight: 500,
                      paddingTop: "20px",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Bảng Điểm Tổng Hợp */}
        <Card className="border-slate-200/60 shadow-sm md:col-span-8 rounded-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-600 rounded-full inline-block"></span>
              Bảng xếp hạng Continuous Assessment
            </CardTitle>
            <CardDescription className="pl-4">
              Tổng hợp Real-time từ GitHub Commits & Jira Tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="w-25 pl-6 font-semibold">
                    Mã SV
                  </TableHead>
                  <TableHead className="font-semibold">Họ và Tên</TableHead>
                  <TableHead className="font-semibold">Vai trò</TableHead>
                  <TableHead className="text-center font-semibold">
                    Commits
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Pull Requests
                  </TableHead>
                  <TableHead className="text-center font-semibold">
                    Tasks Xử Lý
                  </TableHead>
                  <TableHead className="text-right pr-6 font-bold text-slate-800">
                    Điểm SAGA
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamContributionRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={`transition-colors border-slate-100 hover:bg-slate-50 ${
                      row.score < 5 ? "bg-red-50/30" : ""
                    }`}
                  >
                    <TableCell className="pl-6 font-mono text-sm text-slate-500">
                      {row.id}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide ${
                          row.role === "Leader"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {row.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-600">
                      {row.commits}
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-600">
                      {row.PRs}
                    </TableCell>
                    <TableCell className="text-center font-medium text-slate-600">
                      {row.tasks}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end items-center gap-2">
                        <span
                          className={`font-bold text-base ${
                            row.score >= 8
                              ? "text-emerald-600"
                              : row.score < 5
                                ? "text-red-600"
                                : "text-orange-500"
                          }`}
                        >
                          {row.score}
                        </span>
                        <span className="text-slate-400 text-xs">/10</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
