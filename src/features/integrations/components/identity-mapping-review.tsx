"use client";

import { useState } from "react";
import { useIdentityMappings, useReviewIdentityMapping } from "../hooks/useIdentityMappings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  DISCONNECTED: "bg-muted text-muted-foreground border-muted-foreground/20",
  PENDING_REVIEW: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  REJECTED: "bg-destructive/10 text-destructive border-destructive/20",
};

export function IdentityMappingReview({ studentId }: { studentId: string }) {
  const { data: mappings, isLoading, error } = useIdentityMappings(studentId);
  const { mutate: reviewMapping, isPending } = useReviewIdentityMapping(studentId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive p-4">
        Đã có lỗi xảy ra khi tải danh sách ánh xạ danh tính.
      </div>
    );
  }

  const handleApprove = (mappingId: string) => {
    reviewMapping({ mappingId, data: { action: "APPROVE" } });
  };

  const handleReject = (mappingId: string) => {
    reviewMapping({ mappingId, data: { action: "REJECT" } });
  };

  return (
    <Card className="rounded-3xl border-border/50 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          Duyệt Ánh Xạ Danh Tính (Identity Mapping)
        </CardTitle>
        <CardDescription className="mt-1.5">
          Quản lý các tài khoản Jira/GitHub được ánh xạ tới sinh viên này.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="font-bold">Nền tảng</TableHead>
              <TableHead className="font-bold">Tài khoản (Email)</TableHead>
              <TableHead className="font-bold">Trạng thái</TableHead>
              <TableHead className="font-bold">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mappings && mappings.length > 0 ? (
              mappings.map((mapping, idx) => (
                <TableRow key={idx} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{mapping.provider}</TableCell>
                  <TableCell>
                    {mapping.displayName} <span className="text-muted-foreground">({mapping.email})</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`${statusColors[mapping.status] || "bg-muted"} font-bold`}>
                      {mapping.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {mapping.status === "PENDING_REVIEW" && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
                          onClick={() => handleApprove(mapping.id || "unknown")}
                          disabled={isPending}
                        >
                          <CheckCircle2 className="mr-1.5 h-4 w-4" /> Duyệt
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => handleReject(mapping.id || "unknown")}
                          disabled={isPending}
                        >
                          <XCircle className="mr-1.5 h-4 w-4" /> Từ chối
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                  Sinh viên chưa liên kết tài khoản nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
