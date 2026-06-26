import React from "react";
import { Skeleton } from "./Skeleton";
import { AlertTriangle, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  isLoading: boolean;
  isEmpty: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function StateWrapper({
  isLoading,
  isEmpty,
  error,
  onRetry,
  children,
}: Props) {
  if (isLoading) return <Skeleton className="w-full h-64 opacity-50" />;

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500 animate-in fade-in duration-500">
        <AlertTriangle size={48} className="opacity-50" />
        <p className="mt-4 font-bold">{error}</p>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-4 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Thử lại
          </Button>
        )}
      </div>
    );

  if (isEmpty)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 animate-in fade-in duration-500">
        <Inbox size={48} className="opacity-50" />
        <p className="mt-4 font-medium text-slate-500">
          Chưa có dữ liệu để hiển thị
        </p>
        <Button variant="link" className="mt-2 text-orange-600">
          Hướng dẫn tích hợp
        </Button>
      </div>
    );

  return <>{children}</>;
}
