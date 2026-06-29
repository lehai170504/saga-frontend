"use client";
import React, { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, ShieldAlert, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Request = {
  id: string;
  lecturerName: string;
  className: string;
  type: "template" | "policy";
  requestDate: string;
  reason: string;
  details: string;
  status: "pending" | "approved" | "rejected";
};

const initialRequests: Request[] = [
  {
    id: "REQ-001",
    lecturerName: "ThS. Nguyễn Văn A",
    className: "SE1601 - Kỹ thuật Phần mềm",
    type: "template",
    requestDate: "2023-10-25T08:30:00",
    reason: "Đồ án lớp này tập trung mạnh vào AI, nên cần thêm task Train Model với hệ số 2.5 để đánh giá công bằng công sức của các bạn modeler.",
    details: "Thêm loại công việc: Train Model (Hệ số: 2.5), Giảm hệ số Viết Tài liệu xuống 0.5",
    status: "pending"
  },
  {
    id: "REQ-002",
    lecturerName: "TS. Trần Thị B",
    className: "SE1602 - Kỹ thuật Phần mềm",
    type: "policy",
    requestDate: "2023-10-26T14:15:00",
    reason: "Lớp này có nhiều sinh viên part-time vừa học vừa làm, cần nới lỏng cảnh báo Ghosting lên 7 ngày để tránh bị red flag liên tục.",
    details: "Sửa Cảnh báo Lười biếng (Ghosting) thành: 7 ngày",
    status: "pending"
  }
];

export function OverrideRequests() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const handleApprove = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "approved" } : r));
  };

  const handleReject = (id: string) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: "rejected" } : r));
  };

  const pendingRequests = requests.filter(r => r.status === "pending");
  const resolvedRequests = requests.filter(r => r.status !== "pending");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-500 p-4 rounded-xl">
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Quản lý Yêu cầu Ghi đè (Policy Overrides)</p>
            <p className="text-xs mt-1">Danh sách các yêu cầu thay đổi Khung Hệ số hoặc Luật Cảnh báo từ Giảng viên. Admin cần xem xét kỹ lý do trước khi phê duyệt vì nó ảnh hưởng đến điểm số của sinh viên.</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> Chờ Phê Duyệt ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card/20">
            Không có yêu cầu nào đang chờ xử lý.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {pendingRequests.map(req => (
              <Card key={req.id} className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-colors">
                <CardContent className="p-5 flex flex-col lg:flex-row gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={req.type === "template" ? "default" : "destructive"} className="rounded-md px-2 py-0.5 text-xs">
                        {req.type === "template" ? "Sửa Khung Hệ số" : "Sửa Luật Cảnh báo"}
                      </Badge>
                      <span className="text-sm font-bold">{req.className}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(req.requestDate).toLocaleString('vi-VN')}
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Người yêu cầu:</p>
                      <p className="text-sm font-medium">{req.lecturerName}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted-foreground">Chi tiết thay đổi:</p>
                      <p className="text-sm text-foreground bg-muted/50 p-2 rounded-lg mt-1 font-mono border border-border/50">{req.details}</p>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-500" /> Lý do ghi đè:
                      </p>
                      <p className="text-sm text-foreground italic bg-amber-500/5 p-2 rounded-lg mt-1 border border-amber-500/20 text-amber-900 dark:text-amber-200">{req.reason}</p>
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-3 shrink-0 lg:border-l lg:border-border/50 lg:pl-6">
                    <Button onClick={() => handleApprove(req.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 w-full lg:w-32">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt
                    </Button>
                    <Button onClick={() => handleReject(req.id)} variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 font-bold rounded-xl h-10 w-full lg:w-32">
                      <XCircle className="w-4 h-4 mr-2" /> Từ chối
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {resolvedRequests.length > 0 && (
        <div className="space-y-4 pt-8">
          <h3 className="font-bold text-lg flex items-center gap-2 text-muted-foreground">
            <CheckCircle2 className="w-5 h-5" /> Đã Xử Lý ({resolvedRequests.length})
          </h3>
          <div className="grid grid-cols-1 gap-4 opacity-70">
            {resolvedRequests.map(req => (
              <Card key={req.id} className="rounded-2xl border-border bg-card/20 shadow-none">
                <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="rounded-md px-2 py-0.5 text-xs text-muted-foreground">
                        {req.type === "template" ? "Khung Hệ số" : "Luật Cảnh báo"}
                      </Badge>
                      <span className="text-sm font-bold text-muted-foreground">{req.className}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{req.lecturerName} • {new Date(req.requestDate).toLocaleString('vi-VN')}</p>
                  </div>
                  <div>
                    {req.status === "approved" ? (
                      <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/20 border-0">Đã phê duyệt</Badge>
                    ) : (
                      <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/20 border-0">Đã từ chối</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
