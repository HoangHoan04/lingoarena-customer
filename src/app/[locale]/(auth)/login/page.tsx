"use client";

import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { getSocialAuthUrl } from "@/lib/auth";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  Eye,
  EyeOff,
  Flame,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { login, loading } = useAuth();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Vui lòng điền đầy đủ email và mật khẩu", "warning");
      return;
    }

    try {
      await login(email.trim(), password);
      addToast("Đăng nhập thành công! Chào mừng bạn trở lại.", "success");
      router.push(redirectUrl);
    } catch (err: any) {
      addToast(
        err?.response?.data?.message ||
          err?.message ||
          "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
        "error",
      );
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getSocialAuthUrl("google");
  };

  const handleFacebookLogin = () => {
    window.location.href = getSocialAuthUrl("facebook");
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4">
      {/* Left Column: Brand Value & Social Proof Showcase */}
      <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
        {/* Micro-badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5 text-amber-400" />
          Đấu trường luyện thi thông minh
        </div>

        {/* Heading */}
        <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Chào mừng bạn trở lại với{" "}
          <span className="bg-linear-to-r from-[#2b417e] via-[#405ea7] to-[#2b417e] bg-clip-text text-transparent dark:from-[#7b9bee] dark:via-[#a0baff] dark:to-[#7b9bee]">
            LingoArena
          </span>
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
          Tiếp tục lộ trình học tập thích ứng, mở khóa kho đề thi thử chuẩn quốc
          tế và theo dõi mức độ bứt phá điểm số mỗi ngày.
        </p>

        {/* 3 Value Pillars */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center shrink-0">
              <BrainCircuit className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                50.000+ Câu hỏi có giải thích chi tiết
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bám sát Format đề thi ETS TOEIC, Cambridge IELTS và VSTEP mới
                nhất.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Bot className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Chấm chữa Writing & Speaking Rubric
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nhận xét từng lỗi ngữ pháp, gợi ý từ vựng nâng band và chấm 4
                tiêu chí.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-xs">
            <div className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
              <Flame className="size-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Flashcard lặp lại ngắt quãng (FSRS)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ghi nhớ từ vựng vĩnh viễn theo thời điểm vàng của đường conc
                quên lãng.
              </p>
            </div>
          </div>
        </div>

        {/* Live Social Proof Badge */}
        <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-[#2b417e] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
              TM
            </div>
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
              HN
            </div>
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-slate-900">
              LK
            </div>
          </div>
          <span>
            Hơn{" "}
            <strong className="text-slate-900 dark:text-white font-bold">
              1.200.000+
            </strong>{" "}
            học viên tin tưởng luyện thi
          </span>
        </div>
      </div>

      {/* Right Column: Modern Glassmorphic Login Form */}
      <div className="lg:col-span-6 w-full max-w-md mx-auto">
        <div className="bg-card text-card-foreground rounded-3xl p-6 sm:p-9 border border-border shadow-2xl shadow-slate-900/5 dark:shadow-black/50 backdrop-blur-xl space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Đăng nhập tài khoản
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {redirectUrl.includes("placement-test")
                ? "Đăng nhập để lưu kết quả bài kiểm tra và tạo lộ trình của bạn."
                : "Nhập email và mật khẩu của bạn để vào không gian luyện thi."}
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border bg-slate-50/60 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <Image
                src={GoogleIcon}
                alt="Google"
                width={18}
                height={18}
                className="shrink-0"
              />
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookLogin}
              className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-border bg-slate-50/60 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5"
            >
              <Image
                src={FacebookIcon}
                alt="Facebook"
                width={18}
                height={18}
                className="shrink-0"
              />
              <span>Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="grow border-t border-border" />
            <span className="shrink-0 px-3 text-[11px] uppercase tracking-wider font-bold text-slate-400 bg-transparent">
              Hoặc với email
            </span>
            <div className="grow border-t border-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                Địa chỉ Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                  <Mail className="size-4 shrink-0" />
                </div>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vidu@gmail.com"
                  className="!pl-9.5 !pr-3 h-11 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#2b417e] dark:text-[#7b9bee] hover:underline"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                  <Lock className="size-4 shrink-0" />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="!pl-9.5 !pr-9.5 h-11 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 z-10"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 shrink-0" />
                  ) : (
                    <Eye className="size-4 shrink-0" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="size-4 rounded-md border-slate-300 dark:border-slate-700 text-[#2b417e] focus:ring-[#2b417e] cursor-pointer"
                />
                <span>Ghi nhớ đăng nhập trên thiết bị này</span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl hover:shadow-[#2b417e]/35 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  <span>Đang xử lý đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập ngay</span>
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </form>

          {/* Switch to Register */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <span>Chưa có tài khoản LingoArena? </span>
            <Link
              href={
                redirectUrl !== "/"
                  ? `/register?redirect=${encodeURIComponent(redirectUrl)}`
                  : "/register"
              }
              className="font-bold text-[#2b417e] dark:text-[#7b9bee] hover:underline"
            >
              Đăng ký tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-3 border-[#2b417e]/30 border-t-[#2b417e] animate-spin" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
