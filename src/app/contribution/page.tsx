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
} from "recharts";

export default function ContributionPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">
            Đóng góp cá nhân
          </h2>
          <p className="text-slate-500">
            Đánh giá đa chiều hiệu suất làm việc của từng thành viên trong dự
            án.
          </p>
        </div>
        <Select defaultValue="sv001">
          <SelectTrigger className="w-[220px] bg-white border-slate-200">
            <SelectValue placeholder="Chọn sinh viên" />
          </SelectTrigger>
          <SelectContent>
            {teamContributionRows.map((student) => (
              <SelectItem key={student.id} value={student.id.toLowerCase()}>
                {student.name} ({student.role})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Radar Chart Chi Tiết 1 Sinh Viên */}
        <Card className="border-slate-200 shadow-sm md:col-span-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">
              Khung năng lực cá nhân
            </CardTitle>
            <CardDescription>So sánh với trung bình nhóm</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="70%"
                data={studentSkillData}
              >
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: "#94a3b8" }}
                />
                <Radar
                  name="Nguyễn Văn A"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Trung bình nhóm"
                  dataKey="B"
                  stroke="#94a3b8"
                  fill="#cbd5e1"
                  fillOpacity={0.1}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ fontSize: "12px", paddingTop: 10 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bảng Điểm Tổng Hợp Cả Nhóm */}
        <Card className="border-slate-200 shadow-sm md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base text-slate-800">
              Bảng tổng hợp xếp hạng Continuous Assessment
            </CardTitle>
            <CardDescription>
              Dữ liệu tổng hợp từ Git Logs, Quản lý Task và Kênh tương tác
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[100px]">Mã SV</TableHead>
                  <TableHead>Họ và Tên</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-center">Commits</TableHead>
                  <TableHead className="text-center">Pull Requests</TableHead>
                  <TableHead className="text-center">Tasks Xử Lý</TableHead>
                  <TableHead className="text-right font-semibold">
                    Điểm SAGA
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamContributionRows.map((row) => (
                  <TableRow
                    key={row.id}
                    className={
                      row.score < 5 ? "bg-rose-50/50 hover:bg-rose-50" : ""
                    }
                  >
                    <TableCell className="font-medium text-slate-600">
                      {row.id}
                    </TableCell>
                    <TableCell className="font-medium text-slate-900">
                      {row.name}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${row.role === "Leader" ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"}`}
                      >
                        {row.role}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {row.commits}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {row.PRs}
                    </TableCell>
                    <TableCell className="text-center text-slate-600">
                      {row.tasks}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${row.score >= 8 ? "text-emerald-600" : row.score < 5 ? "text-rose-600" : "text-slate-700"}`}
                    >
                      {row.score}/10
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
