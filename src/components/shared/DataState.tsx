import React from "react";
import { AlertTriangle, Inbox } from "lucide-react";

export function EmptyState({ message = "Chưa có dữ liệu để hiển thị" }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-slate-400 w-full animate-in fade-in duration-500">
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
    <div className="flex flex-col items-center justify-center py-16 text-red-400 w-full animate-in fade-in duration-500">
      <AlertTriangle size={48} className="mb-4 opacity-50" />
      <p className="font-medium text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
