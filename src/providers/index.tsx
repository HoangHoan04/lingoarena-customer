"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { mapSessionUser } from "@/lib/auth";
import QueryProvider from "./QueryProvider";
import ThemeProvider from "./ThemeProvider";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import React, { useEffect } from "react";

let authBootstrapStarted = false;

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined" || authBootstrapStarted) return;
    authBootstrapStarted = true;

    const params = new URLSearchParams(window.location.search);
    const oauthError = params.get("error");
    const accessToken = params.get("accessToken") || params.get("token");
    const refreshToken = params.get("refreshToken");

    if (oauthError || accessToken || refreshToken) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    if (oauthError) {
      useToastStore.getState().addToast(oauthError, "error");
      return;
    }

    const applySession = async (token: string, nextRefreshToken?: string | null) => {
      localStorage.setItem("token", token);
      if (nextRefreshToken) {
        localStorage.setItem("refreshToken", nextRefreshToken);
      }
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;

      const { authService } = await import("@/services/auth.service");
      const me = await authService.getMe();
      useAuthStore.getState().setAuth(
        mapSessionUser(me),
        token,
        nextRefreshToken || undefined,
      );
    };

    if (accessToken) {
      applySession(accessToken, refreshToken).then(
        () => {
          useToastStore.getState().addToast("Đăng nhập tài khoản thành công!", "success");
        },
        (err) => {
          useAuthStore.getState().clearAuth();
          useToastStore.getState().addToast(
            err?.response?.data?.message ||
              err?.message ||
              "Không thể lấy thông tin tài khoản. Vui lòng thử lại.",
            "error",
          );
        },
      );
      return;
    }

    const existingToken = localStorage.getItem("token");
    const existingUser = useAuthStore.getState().user;
    if (existingToken && (!existingUser?.id || !existingUser?.name)) {
      applySession(existingToken, localStorage.getItem("refreshToken")).catch(() => {
        useAuthStore.getState().clearAuth();
      });
    }
  }, []);

  return <>{children}</>;
}

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider>
          <AuthInitializer>{children}</AuthInitializer>
        </TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
