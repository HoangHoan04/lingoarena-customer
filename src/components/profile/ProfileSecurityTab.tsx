"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useToastStore } from "@/stores/useToastStore";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  ShieldCheck,
} from "lucide-react";
import React, { useState } from "react";

interface ProfileSecurityTabProps {
  emailVerifiedAt: Date | string | null;
  lastLoginAt: string | null;
}

export default function ProfileSecurityTab({
  emailVerifiedAt,
  lastLoginAt,
}: ProfileSecurityTabProps) {
  const { addToast } = useToastStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Vui lòng điền đầy đủ các trường mật khẩu", "warning");
      return;
    }
    if (newPassword.length < 6) {
      addToast("Mật khẩu mới phải có ít nhất 6 ký tự", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Mật khẩu xác nhận không trùng khớp", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.updatePassword({
        currentPassword,
        newPassword,
      });
      addToast(res.message || "Đổi mật khẩu thành công!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      addToast(err?.message || "Mật khẩu hiện tại không chính xác.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Password Change Form */}
      <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Đổi mật khẩu tài khoản
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Đổi mật khẩu định kỳ giúp bảo vệ tài khoản và lịch sử làm bài thi an
            toàn.
          </p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Mật khẩu hiện tại <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type={showCurrentPassword ? "text" : "password"}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showCurrentPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type={showNewPassword ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Ít nhất 6 ký tự"
                className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showNewPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Xác nhận lại mật khẩu mới <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <KeyRound className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm bg-brand hover:bg-[#1e2f5e] text-white shadow-lg shadow-brand/25 hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Đang cập nhật mật khẩu...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4" />
                  <span>Lưu mật khẩu mới</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Security Status Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="size-4 text-brand" /> Trạng thái bảo mật
        </h3>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 font-medium">Trạng thái Email:</span>
            <div className="font-bold flex items-center gap-1.5">
              {emailVerifiedAt ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="size-3.5" /> Đã xác thực
                </span>
              ) : (
                <span className="text-amber-600 flex items-center gap-1">
                  <AlertCircle className="size-3.5" /> Chưa xác thực
                </span>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 font-medium">
              Lần đăng nhập gần nhất:
            </span>
            <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Clock className="size-3.5 text-slate-400" />
              {lastLoginAt || "Hiện tại"}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
            <span className="text-slate-500 font-medium">Phiên đăng nhập:</span>
            <div className="font-bold text-emerald-600 flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Đang hoạt động
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
