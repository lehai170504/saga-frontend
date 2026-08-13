"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, ShieldAlert, AlertTriangle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/shared/Skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useGetWeightRequests, useDecideWeightRequest } from "../../hooks/useContributionWeight";
import { ContributionWeightRequest } from "../../api/contributionWeightApi";
import { toast } from "sonner";

export function OverrideRequests() {
  const { data: requestsResponse, isLoading: isLoadingRequests } = useGetWeightRequests();
  const decideMutation = useDecideWeightRequest();

  const requests: ContributionWeightRequest[] = Array.isArray(requestsResponse) ? requestsResponse : ((requestsResponse as any)?.content ?? []);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    requestId: string | number | null;
    type: "APPROVED" | "REJECTED" | null;
  }>({ isOpen: false, requestId: null, type: null });
  const [feedback, setFeedback] = useState("");

  const handleOpenDialog = (id: string | number, type: "APPROVED" | "REJECTED") => {
    setConfirmDialog({ isOpen: true, requestId: id, type });
    setFeedback(type === "APPROVED" ? "Nhận xét hợp lý, trọng số đã cập nhật" : "");
  };

  const handleSubmitDecision = () => {
    if (!confirmDialog.requestId || !confirmDialog.type) return;

    if (confirmDialog.type === "REJECTED" && !feedback.trim()) {
      toast.error("Vui lòng nhập lý do từ chối!");
      return;
    }

    decideMutation.mutate(
      { requestId: confirmDialog.requestId, data: { decision: confirmDialog.type, feedbackMessage: feedback } },
      {
        onSuccess: () => {
          setConfirmDialog({ isOpen: false, requestId: null, type: null });
          setFeedback("");
        }
      }
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
        <div className="grid grid-cols-1 gap-4 mt-4">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
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
                      <div className="flex-1 space-y-5">
                        <div className="flex items-start justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                              {req.lecturerName?.charAt(0) || "G"}
                            </div>
                            <div>
                              <p className="text-sm font-black text-foreground">{req.lecturerName || "Giảng viên"}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[10px] uppercase font-bold text-primary bg-primary/10">
                                  Thay đổi Trọng số
                                </Badge>
                                {req.courseCode && (
                                  <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                                    <BookOpen className="w-3 h-3" />
                                    {req.courseCode} - {req.courseName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                            {new Date(req.createdAt).toLocaleString('vi-VN')}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Trọng số đề xuất</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {[
                              { label: 'Code', value: req.proposedCodeWeight },
                              { label: 'Document', value: req.proposedDocumentWeight },
                              { label: 'Design', value: req.proposedDesignWeight },
                              { label: 'Testing', value: req.proposedTestingWeight }
                            ].map(item => (
                              <div key={item.label} className="flex flex-col bg-background/50 border border-border/60 p-3 rounded-2xl">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</span>
                                <span className="text-lg font-black text-foreground">
                                  {item.value != null ? Number(item.value).toFixed(1).replace(/\.0$/, '') : 0}%
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {req.reason && (
                          <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-start">
                            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-500 rounded-xl shrink-0">
                              <AlertTriangle className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-1">Lý do thay đổi</p>
                              <p className="text-sm font-medium text-foreground leading-relaxed">{req.reason}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col justify-end lg:justify-center gap-3 shrink-0 lg:border-l lg:border-border/50 lg:pl-6">
                        <Button onClick={() => handleOpenDialog(req.requestId, "APPROVED")} disabled={decideMutation.isPending} className="bg-success hover:bg-emerald-700 text-white font-bold rounded-xl h-10 w-full lg:w-32">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Phê duyệt
                        </Button>
                        <Button onClick={() => handleOpenDialog(req.requestId, "REJECTED")} disabled={decideMutation.isPending} variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 font-bold rounded-xl h-10 w-full lg:w-32">
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
                          {req.courseCode && (
                            <span className="text-sm font-bold text-muted-foreground flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {req.courseCode} - {req.courseName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{req.lecturerName || "Giảng viên"} • {new Date(req.createdAt).toLocaleString('vi-VN')}</p>
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

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setConfirmDialog({ ...confirmDialog, isOpen: false })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.type === "APPROVED" ? "Phê duyệt yêu cầu" : "Từ chối yêu cầu"}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.type === "APPROVED"
                ? "Bạn có chắc chắn muốn phê duyệt yêu cầu thay đổi trọng số này? Bạn có thể để lại nhận xét bên dưới."
                : "Vui lòng cung cấp lý do từ chối yêu cầu này. Lý do này sẽ được gửi đến giảng viên."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="feedback" className={confirmDialog.type === "REJECTED" ? "text-destructive font-bold" : "font-bold"}>
                Nhận xét {confirmDialog.type === "REJECTED" ? "(bắt buộc)" : "(tùy chọn)"}
              </Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder={confirmDialog.type === "REJECTED" ? "Nhập lý do từ chối..." : "Nhập nhận xét..."}
                className="col-span-3 min-h-[100px] rounded-xl"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-xl font-bold" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
              Hủy
            </Button>
            <Button
              type="button"
              className={`rounded-xl font-bold ${confirmDialog.type === "REJECTED" ? "bg-destructive text-white hover:bg-destructive/90" : "bg-success text-white hover:bg-emerald-700"}`}
              onClick={handleSubmitDecision}
              disabled={decideMutation.isPending}
            >
              Xác nhận {confirmDialog.type === "APPROVED" ? "Phê duyệt" : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
