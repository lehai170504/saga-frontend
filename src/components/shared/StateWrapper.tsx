import { Skeleton } from "./Skeleton";
import { AlertTriangle, Inbox } from "lucide-react";

interface Props {
  isLoading: boolean;
  isEmpty: boolean;
  error?: string | null;
  children: React.ReactNode;
}

export function StateWrapper({ isLoading, isEmpty, error, children }: Props) {
  if (isLoading) return <Skeleton className="w-full h-64 opacity-50" />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-red-500">
        <AlertTriangle size={48} />
        <p className="mt-4 font-bold">{error}</p>
      </div>
    );
  if (isEmpty)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Inbox size={48} />
        <p className="mt-4 font-medium">Chưa có dữ liệu để hiển thị</p>
        <button className="mt-4 text-orange-600 font-semibold hover:underline">
          Hướng dẫn tích hợp
        </button>
      </div>
    );
  return <>{children}</>;
}
