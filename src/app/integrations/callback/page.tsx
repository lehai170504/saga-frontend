"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { consumeIntegrationCallback } from "@/features/integrations/api/personalIntegrationApi";
import { toast } from "sonner";

function IntegrationCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Đang hoàn tất kết nối tích hợp...");
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const hasRun = React.useRef(false);

  useEffect(() => {
    if (hasRun.current) return;

    const resultId = searchParams.get("resultId");

    if (!resultId) {
      setMessage("Thiếu mã kết quả callback (resultId).");
      setErrorDetails("Yêu cầu không hợp lệ hoặc đã bị lỗi.");
      return;
    }

    hasRun.current = true;

    // Clear resultId from address bar immediately
    if (typeof window !== "undefined") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    consumeIntegrationCallback(resultId)
      .then((result: any) => {
        if (!result || typeof result !== "object") {
          throw new Error("Dữ liệu trả về không đúng định dạng.");
        }

        console.log("OAuth Callback Result Payload:", result);

        // Check if response is wrapped in the unified OAuth response envelope
        let actualResult = result;
        if ("success" in result && "flow" in result) {
          if (result.success === false) {
            throw new Error(result.message || "Lỗi xử lý liên kết từ phía máy chủ.");
          }
          if (result.jiraAuthorization) {
            actualResult = result.jiraAuthorization;
          } else if (result.gitHubInstallation) {
            actualResult = result.gitHubInstallation;
          } else if (result.identityConnection) {
            actualResult = result.identityConnection;
          }
        }

        // Store the extracted inner payload to sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.setItem("integration_callback_result", JSON.stringify(actualResult));
        }

        // Handle integration result type based on the extracted payload
        if ("sites" in actualResult && "projectId" in actualResult) {
          // Project Jira
          toast.success("Xác thực Jira thành công! Vui lòng chọn Site.");
          router.replace("/integrations/jira/select-site");
        } else if (
          "installationId" in actualResult &&
          "repositories" in actualResult &&
          "projectId" in actualResult
        ) {
          // Project GitHub
          toast.success("Xác thực GitHub thành công! Vui lòng chọn Repositories.");
          router.replace("/integrations/github/select-repositories");
        } else if ("provider" in actualResult && "status" in actualResult) {
          // Personal Jira/GitHub
          toast.success(`Kết nối tài khoản ${actualResult.provider} cá nhân thành công!`);
          const redirectBack = typeof window !== "undefined" ? sessionStorage.getItem("integration_redirect_back") : null;
          router.replace(redirectBack || "/student/settings");
        } else {
          throw new Error("Phản hồi không xác định từ máy chủ.");
        }
      })
      .catch((error: any) => {
        console.error("Callback error", error);
        if (error?.status === 401) {
          toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
          router.replace("/auth/login");
          return;
        }

        if (error?.status === 403) {
          setMessage("Quyền truy cập không hợp lệ.");
          setErrorDetails("Phiên đăng nhập hoặc mã CSRF không hợp lệ. Vui lòng thử lại.");
          return;
        }

        setMessage("Lỗi kết nối tích hợp.");
        setErrorDetails(
          error?.message ||
          "Kết quả kết nối đã hết hạn, đã được sử dụng hoặc không hợp lệ."
        );
      });
  }, [router, searchParams]);

  return (
    <div className="relative z-10 max-w-md w-full rounded-[2rem] border border-border/50 bg-card/45 backdrop-blur-xl shadow-xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
      {errorDetails ? (
        <div className="space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive border border-destructive/20 p-3">
            <AlertCircle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">{message}</h2>
            <p className="text-xs font-medium text-muted-foreground line-clamp-3">{errorDetails}</p>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                const redirectBack = typeof window !== "undefined" ? sessionStorage.getItem("integration_redirect_back") : null;
                router.replace(redirectBack || "/student/settings");
              }}
              className="w-full h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            >
              Quay lại
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6 py-4">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-extrabold tracking-tight text-foreground">{message}</h2>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Vui lòng không đóng trình duyệt hoặc tải lại trang.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function IntegrationCallbackPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

      <Suspense fallback={
        <div className="relative z-10 max-w-md w-full rounded-[2rem] border border-border/50 bg-card/45 backdrop-blur-xl shadow-xl p-8 text-center space-y-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Loader2 className="h-7 w-7 animate-spin" />
          </div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wide animate-pulse">Đang tải...</p>
        </div>
      }>
        <IntegrationCallbackContent />
      </Suspense>
    </div>
  );
}
