"use client";

import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/hooks/useAuth";
import { getSocialAuthUrl } from "@/lib/auth";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

type RegisterStep = "form" | "otp";

function RegisterFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const { register, sendOtpRegistration, loading } = useAuth();
  const { addToast } = useToastStore();

  // ── Step state ──────────────────────────────
  const [step, setStep] = useState<RegisterStep>("form");

  // ── Form fields ─────────────────────────────
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── OTP field ────────────────────────────────
  const [otpCode, setOtpCode] = useState("");

  // ── Form validation ─────────────────────────
  const validateForm = (): boolean => {
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      addToast("Vui lòng điền đầy đủ tất cả các trường bắt buộc", "warning");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      addToast("Email không đúng định dạng", "warning");
      return false;
    }
    if (password.length < 6) {
      addToast("Mật khẩu phải có ít nhất 6 ký tự", "warning");
      return false;
    }
    if (password !== confirmPassword) {
      addToast("Mật khẩu nhắc lại không trùng khớp", "warning");
      return false;
    }
    if (!agreedTerms) {
      addToast("Vui lòng đồng ý với điều khoản sử dụng", "warning");
      return false;
    }
    return true;
  };

  // ── Handle: gửi OTP (step 1 → 2) ───────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await sendOtpRegistration(email.trim());
      addToast(`Mã OTP đã được gửi đến ${email.trim()}`, "success");
      setStep("otp");
    } catch (err: any) {
      addToast(
        err?.response?.data?.message || err?.message || "Gửi mã OTP thất bại. Vui lòng thử lại.",
        "error",
      );
    }
  };

  // ── Handle: xác thực OTP + đăng ký (step 2) ─
  const handleRegisterWithOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      addToast("Vui lòng nhập mã OTP 6 số", "warning");
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        displayName: displayName.trim() || fullName.trim(),
        otpCode: otpCode.trim(),
        sendMethod: "EMAIL",
      });
      addToast("Tạo tài khoản thành công! Đang chuyển hướng...", "success");
      router.push(redirectUrl);
    } catch (err: any) {
      addToast(
        err?.response?.data?.message || err?.message || "Đăng ký không thành công. Vui lòng thử lại.",
        "error",
      );
    }
  };

  // ── Handle: gửi lại OTP ───────────────────
  const handleResendOtp = async () => {
    try {
      await sendOtpRegistration(email.trim());
      addToast("Đã gửi lại mã OTP. Vui lòng kiểm tra email.", "success");
    } catch (err: any) {
      addToast(
        err?.response?.data?.message || err?.message || "Gửi lại OTP thất bại.",
        "error",
      );
    }
  };

  // ── OAuth redirects ────────────────────────
  const handleGoogleLogin = () => {
    window.location.href = getSocialAuthUrl("google");
  };

  const handleFacebookLogin = () => {
    window.location.href = getSocialAuthUrl("facebook");
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
      {/* Left Column: Register Value Propositions */}
      <div className="lg:col-span-5 space-y-4 hidden lg:block pr-2">
        {/* Micro-badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-3.5 text-amber-400" />
          Miễn phí tài khoản học viên
        </div>

        {/* Heading */}
        <h1 className="text-2xl xl:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Bắt đầu hành trình bứt phá điểm số cùng{" "}
          <span className="bg-linear-to-r from-[#2b417e] via-[#405ea7] to-[#2b417e] bg-clip-text text-transparent dark:from-[#7b9bee] dark:via-[#a0baff] dark:to-[#7b9bee]">
            LingoArena
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-md">
          Đăng ký tài khoản miễn phí để nhận ngay 1 bài test kiểm tra đầu vào, lộ trình ôn tập cá nhân hóa và làm quen với đề thi chuẩn quốc tế.
        </p>

        {/* Features Checklist */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Kiểm tra trình độ đầu vào miễn phí 15 phút
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nhận phân tích điểm mạnh, điểm yếu và mức điểm dự đoán tức thì.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Kho đề thi thử mô phỏng 100% phòng thi thật
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Đồng hồ đếm ngược server, tự động lưu câu trả lời và bảng điểm quy đổi chuẩn.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="size-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Sổ lỗi thông minh tự động gom câu sai
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Giúp bạn khắc phục bẫy đề thi và các lỗi sai ngữ pháp cho đến khi làm chủ hoàn toàn.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="p-3 rounded-xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 shadow-2xs backdrop-blur-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2b417e] text-white flex items-center justify-center shrink-0">
            <Trophy className="size-4" />
          </div>
          <div className="text-[11px]">
            <span className="font-bold text-slate-900 dark:text-white block">
              Cam kết đồng hành bứt phá điểm số
            </span>
            <span className="text-slate-500">
              98.2% học viên đạt hoặc vượt mục tiêu ban đầu sau lộ trình 8 tuần.
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Register Form */}
      <div className="lg:col-span-7 w-full max-w-lg mx-auto">
        <div className="bg-card text-card-foreground rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 border border-border shadow-xl backdrop-blur-xl space-y-3.5">

          {/* ─── STEP: FORM ─────────────────────────────── */}
          {step === "form" && (
            <>
              {/* Header */}
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Tạo tài khoản mới
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Điền thông tin để bắt đầu hành trình học tập cùng LingoArena.
                </p>
              </div>

              {/* Social Logins */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border bg-slate-50/60 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5 h-9.5"
                >
                  <Image src={GoogleIcon} alt="Google" width={16} height={16} className="shrink-0" />
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-border bg-slate-50/60 dark:bg-neutral-900/60 hover:bg-slate-100 dark:hover:bg-neutral-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer shadow-2xs hover:-translate-y-0.5 h-9.5"
                >
                  <Image src={FacebookIcon} alt="Facebook" width={16} height={16} className="shrink-0" />
                  <span>Facebook</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center py-0.5">
                <div className="grow border-t border-border" />
                <span className="shrink-0 px-3 text-[10px] sm:text-[11px] uppercase tracking-wider font-bold text-slate-400 bg-transparent">
                  Hoặc với email
                </span>
                <div className="grow border-t border-border" />
              </div>

              {/* Form */}
              <form onSubmit={handleSendOtp} className="space-y-3.5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                      <User className="size-4 shrink-0" />
                    </div>
                    <Input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nguyễn Văn A"
                      className="!pl-10 !pr-3.5 h-10.5 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                    />
                  </div>
                </div>

                {/* Display Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Tên hiển thị <span className="text-slate-400 font-normal">(tuỳ chọn)</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                      <UserCheck className="size-4 shrink-0" />
                    </div>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Ví dụ: van_a99 hoặc Nickname"
                      className="!pl-10 !pr-3.5 h-10.5 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email (dùng để đăng nhập) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                      <Mail className="size-4 shrink-0" />
                    </div>
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="!pl-10 !pr-3.5 h-10.5 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                        <Lock className="size-4 shrink-0" />
                      </div>
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="!pl-10 !pr-10 h-10.5 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 z-10"
                        aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Nhắc lại mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-slate-400 z-10">
                        <Lock className="size-4 shrink-0" />
                      </div>
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="!pl-10 !pr-10 h-10.5 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 z-10"
                        aria-label={showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4 shrink-0" /> : <Eye className="size-4 shrink-0" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="pt-0.5">
                  <label className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      className="size-4 mt-0.5 rounded-md border-slate-300 dark:border-slate-700 text-[#2b417e] focus:ring-[#2b417e] cursor-pointer shrink-0"
                    />
                    <span>
                      Tôi đồng ý với{" "}
                      <Link href="/terms" className="text-[#2b417e] dark:text-[#7b9bee] font-bold hover:underline">
                        Điều khoản
                      </Link>{" "}
                      và{" "}
                      <Link href="/privacy" className="text-[#2b417e] dark:text-[#7b9bee] font-bold hover:underline">
                        Chính sách bảo mật
                      </Link>{" "}
                      của LingoArena.
                    </span>
                  </label>
                </div>

                {/* Submit: Gửi OTP */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-md shadow-[#2b417e]/20 hover:shadow-lg hover:shadow-[#2b417e]/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang gửi OTP...</span>
                    </>
                  ) : (
                    <>
                      <GraduationCap className="size-4.5 shrink-0" />
                      <span>Tiếp tục — Xác thực Email</span>
                      <ArrowRight className="size-4 shrink-0" />
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* ─── STEP: OTP ──────────────────────────────── */}
          {step === "otp" && (
            <>
              {/* Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setStep("form"); setOtpCode(""); }}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    aria-label="Quay lại"
                  >
                    <ArrowLeft className="size-4.5" />
                  </button>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Xác thực Email
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mã OTP 6 số đã được gửi đến <strong className="text-slate-700 dark:text-slate-200">{email}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* OTP Icon */}
              <div className="flex justify-center py-3">
                <div className="w-16 h-16 rounded-2xl bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] flex items-center justify-center">
                  <ShieldCheck className="size-8" />
                </div>
              </div>

              {/* OTP Form */}
              <form onSubmit={handleRegisterWithOtp} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 text-center">
                    Nhập mã OTP
                  </label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    required
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="• • • • • •"
                    className="h-14 rounded-xl text-2xl text-center tracking-[0.5em] font-bold bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                  />
                </div>

                {/* Resend OTP */}
                <div className="text-center">
                  <span className="text-xs text-slate-500">Không nhận được mã? </span>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-xs font-bold text-[#2b417e] dark:text-[#7b9bee] hover:underline disabled:opacity-50"
                  >
                    Gửi lại OTP
                  </button>
                </div>

                {/* Submit: Hoàn tất đăng ký */}
                <Button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full h-11 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-md shadow-[#2b417e]/20 hover:shadow-lg hover:shadow-[#2b417e]/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang tạo tài khoản...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4.5 shrink-0" />
                      <span>Hoàn tất đăng ký</span>
                    </>
                  )}
                </Button>
              </form>
            </>
          )}

          {/* Switch to Login */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
            <span>Đã có tài khoản LingoArena? </span>
            <Link
              href={redirectUrl !== "/" ? `/login?redirect=${encodeURIComponent(redirectUrl)}` : "/login"}
              className="font-bold text-[#2b417e] dark:text-[#7b9bee] hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><div className="h-8 w-8 rounded-full border-3 border-[#2b417e]/30 border-t-[#2b417e] animate-spin" /></div>}>
      <RegisterFormContent />
    </Suspense>
  );
}
