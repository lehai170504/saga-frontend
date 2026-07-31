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
      <div className="flex flex-col items-center justify-center py-20 text-destructive animate-in fade-in duration-500">
        <AlertTriangle size={48} className="opacity-50" />
        <p className="mt-4 font-bold">{error}</p>
        {onRetry && (
          <Button
            variant="outline"
            onClick={onRetry}
            className="mt-4 border-destructive/20 text-destructive bg-destructive/10"
          >
            Thử lại
          </Button>
        )}
      </div>
    );

  if (isEmpty)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground animate-in fade-in duration-500">
        <Inbox size={48} className="opacity-50" />
        <p className="mt-4 font-medium text-muted-foreground">
          Chưa có dữ liệu để hiển thị
        </p>
        <Button variant="link" className="mt-2 text-primary">
          Hướng dẫn tích hợp
        </Button>
      </div>
    );

  return <>{children}</>;
}
