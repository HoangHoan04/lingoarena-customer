"use client";

import { mapSessionUser } from "@/lib/auth";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Đang xác thực tài khoản...");

  useEffect(() => {
    const error = searchParams.get("error");
    const accessToken = searchParams.get("accessToken") || searchParams.get("token");
    const refreshToken = searchParams.get("refreshToken");

    if (error) {
      useToastStore.getState().addToast(error, "error");
      router.replace("/login");
      return;
    }

    if (!accessToken) {
      setMessage("Thiếu token đăng nhập. Đang chuyển về trang đăng nhập...");
      router.replace("/login");
      return;
    }

    localStorage.setItem("token", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    document.cookie = `token=${accessToken}; path=/; max-age=86400; SameSite=Lax`;

    authService
      .getMe()
      .then((me) => {
        useAuthStore.getState().setAuth(mapSessionUser(me), accessToken, refreshToken || undefined);
        useToastStore.getState().addToast("Đăng nhập tài khoản thành công!", "success");
        router.replace("/");
      })
      .catch((err) => {
        useAuthStore.getState().clearAuth();
        useToastStore.getState().addToast(
          err?.message || "Không thể lấy thông tin tài khoản. Vui lòng thử lại.",
          "error",
        );
        router.replace("/login");
      });
  }, [router, searchParams]);

  return (
    <div className="min-h-[420px] flex flex-col items-center justify-center gap-3">
      <div className="h-8 w-8 rounded-full border-3 border-[#2b417e]/30 border-t-[#2b417e] animate-spin" />
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[420px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-3 border-[#2b417e]/30 border-t-[#2b417e] animate-spin" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
