"use client";

import { mapSessionUser } from "@/lib/auth";
import { authService, LoginDto, RegisterDto } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useState } from "react";

export function useAuth() {
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const persistAuth = (res: any) => {
    if (!res?.accessToken || !res?.user) {
      throw new Error("Phản hồi đăng nhập không có token hoặc thông tin người dùng");
    }
    setAuth(mapSessionUser(res.user), res.accessToken, res.refreshToken);
    return res;
  };

  const login = async (emailOrDto: string | LoginDto, password?: string) => {
    setLoading(true);
    setError("");
    try {
      const payload: LoginDto =
        typeof emailOrDto === "string"
          ? { email: emailOrDto, password: password || "" }
          : emailOrDto;

      return persistAuth(await authService.login(payload));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterDto) => {
    setLoading(true);
    setError("");
    try {
      const res = await authService.register(data);
      if (res.accessToken) persistAuth(res);
      return res;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtpRegistration = async (email: string) => {
    setLoading(true);
    setError("");
    try {
      return await authService.sendOtpRegistration(email);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Gửi OTP thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (target: string, _method?: string) => {
    setLoading(true);
    setError("");
    try {
      return await authService.sendOtp(target, "PASSWORD_RESET");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Gửi OTP thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (data: {
    identifier: string;
    otpCode: string;
    newPassword: string;
    method?: string;
  }) => {
    setLoading(true);
    setError("");
    try {
      return await authService.forgotPassword(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Khôi phục mật khẩu thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (idToken: string) => {
    setLoading(true);
    setError("");
    try {
      return persistAuth(await authService.googleLogin({ idToken }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Đăng nhập Google thất bại.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async (accessToken: string) => {
    setLoading(true);
    setError("");
    try {
      return persistAuth(await authService.facebookLogin({ accessToken }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Đăng nhập Facebook thất bại.";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    setError,
    login,
    register,
    sendOtpRegistration,
    sendOtp,
    forgotPassword,
    loginWithGoogle,
    loginWithFacebook,
    logout: async () => {
      const refreshToken = useAuthStore.getState().refreshToken;
      try {
        await authService.logout(refreshToken || undefined);
      } catch {
        // Still clear local session if the API call fails.
      }
      clearAuth();
    },
  };
}

export default useAuth;
