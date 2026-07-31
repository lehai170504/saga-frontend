import React from "react";
import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState({ message = "Chưa có dữ liệu để hiển thị" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground w-full animate-in fade-in duration-500">
      <Inbox size={48} className="mb-4 opacity-50" />
      <p className="font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({
  message = "Đã xảy ra lỗi khi kết nối dữ liệu",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-destructive w-full animate-in fade-in duration-500">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-medium text-destructive mb-4">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          onClick={onRetry}
          className="border-destructive/20 text-destructive bg-destructive/10"
        >
          Thử lại
        </Button>
      )}
    </div>
  );
}
