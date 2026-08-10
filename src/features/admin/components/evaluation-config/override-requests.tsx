"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, ShieldAlert, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetWeightRequests, useDecideWeightRequest } from "../../hooks/useContributionWeight";
import { toast } from "sonner";

export function OverrideRequests() {
  const { data: requestsResponse, isLoading: isLoadingRequests } = useGetWeightRequests();
  const decideMutation = useDecideWeightRequest();

  // Handle global page response assuming Page<ContributionWeightRequest>
  const requests = requestsResponse?.content ?? [];

  const handleApprove = (id: string | number) => {
    const message = window.prompt("Nhập nhận xét (tùy chọn):", "Nhận xét hợp lý, trọng số đã cập nhật");
    if (message === null) return; // User cancelled

    decideMutation.mutate(
      { requestId: id, data: { decision: "APPROVED", feedbackMessage: message } }
    );
  };

  const handleReject = (id: string | number) => {
    const message = window.prompt("Nhập nhận xét từ chối (bắt buộc):", "");
    if (message === null) return; // User cancelled
    if (!message) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    decideMutation.mutate(
      { requestId: id, data: { decision: "REJECTED", feedbackMessage: message } }
    );
  };

  const pendingRequests = requests.filter(r => r.status === "PENDING");
  const resolvedRequests = requests.filter(r => r.status !== "PENDING");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl gap-4">
        <div className="flex items-start gap-3 flex-1">
          <ShieldAlert className="w-5 h-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-sm">Quản lý Yêu cầu Thay đổi Trọng số Slices</p>
            <p className="text-xs mt-1">Danh sách các yêu cầu thay đổi Khung Trọng số đóng góp (Code, Doc, Design, Test) từ Giảng viên trên toàn bộ hệ thống.</p>
          </div>
        </div>
      </div>

      {isLoadingRequests ? (
        <div className="p-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card/20 flex items-center justify-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          Đang tải danh sách yêu cầu...
        </div>
      ) : !requestsResponse ? (
        <div className="p-8 text-center text-destructive border border-dashed border-destructive/50 rounded-2xl bg-destructive/10">
          Có lỗi xảy ra khi tải danh sách yêu cầu. Vui lòng thử lại sau.
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Chờ Phê Duyệt ({pendingRequests.length})
            </h3>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground border border-dashed border-border/50 rounded-2xl bg-card/20">
                Không có yêu cầu nào đang chờ xử lý trên hệ thống.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingRequests.map(req => (
                  <Card key={req.requestId} className="rounded-2xl border-border bg-card/40 backdrop-blur-xl shadow-sm hover:border-primary/30 transition-colors">
                    <CardContent className="p-5 flex flex-col lg:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="default" className="rounded-md px-2 py-0.5 text-xs shrink-0">
                            Sửa Trọng Số Slices
                          </Badge>
                          {req.course && (
                            <span className="text-sm font-bold text-primary flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {req.course.courseCode} - {req.course.courseName}
                            </span>
                          )}
                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(req.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-muted-foreground">Người yêu cầu:</p>
                          <p className="text-sm font-medium">{req.requestedBy?.fullName || "Giảng viên"}</p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-muted-foreground">Chi tiết thay đổi đề xuất:</p>
                          <p className="text-sm text-foreground bg-muted/50 p-2 rounded-lg mt-1 font-mono border border-border/50">
                            Code: {req.proposedCodeWeight}%, Doc: {req.proposedDocumentWeight}%, Design: {req.proposedDesignWeight}%, Testing: {req.proposedTestingWeight}%
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-primary" /> Lý do:
                          </p>
                          <p className="text-sm text-foreground italic bg-primary/5 p-2 rounded-lg mt-1 border border-primary/20 text-primary">{req.reason}</p>
                        </div>
                      </div>

                      <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-3 shrink-0 lg:border-l lg:border-border/50 lg:pl-6">
                        <Button onClick={() => handleApprove(req.requestId)} disabled={decideMutation.isPending} className="bg-success hover:bg-emerald-700 text-white font-bold rounded-xl h-10 w-full lg:w-32">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt
                        </Button>
                        <Button onClick={() => handleReject(req.requestId)} disabled={decideMutation.isPending} variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 font-bold rounded-xl h-10 w-full lg:w-32">
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
                  <Card key={req.requestId} className="rounded-2xl border-border bg-card/20 shadow-none">
                    <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="rounded-md px-2 py-0.5 text-xs text-muted-foreground shrink-0">
                            Trọng Số Slices
                          </Badge>
                          {req.course && (
                            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {req.course.courseCode} - {req.course.courseName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{req.requestedBy?.fullName || "Giảng viên"} • {new Date(req.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div>
                        {req.status === "APPROVED" ? (
                          <Badge className="bg-success/20 text-success border-0">Đã phê duyệt</Badge>
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
        </>
      )}
    </div>
  );
}
