"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useRouter } from "@/i18n/routing";
import { authService } from "@/services/auth.service";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import React, { useEffect, useState } from "react";

type RecoveryStep = "EMAIL" | "OTP" | "NEW_PASSWORD" | "SUCCESS";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToastStore();

  const [step, setStep] = useState<RecoveryStep>("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // 60s countdown timer for OTP resend
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === "OTP" && countdown > 0) {
      timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    } else if (countdown === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Step 1: Send OTP to email
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast("Vui lòng nhập địa chỉ email của bạn", "warning");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPasswordSendOtp(email.trim());
      addToast(`Mã xác thực OTP 6 số đã được gửi tới ${email}`, "success");
      setStep("OTP");
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      addToast(err?.message || "Không tìm thấy tài khoản với email này.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) {
      addToast("Vui lòng nhập đầy đủ mã OTP 6 chữ số", "warning");
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPasswordVerifyOtp(email.trim(), otp.trim());
      addToast("Mã xác thực hợp lệ! Vui lòng nhập mật khẩu mới.", "success");
      setStep("NEW_PASSWORD");
    } catch (err: any) {
      addToast(err?.message || "Mã OTP không chính xác hoặc đã hết hạn.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setLoading(true);
    try {
      await authService.forgotPasswordSendOtp(email.trim());
      addToast("Mã xác thực mới đã được gửi lại vào email!", "success");
      setCountdown(60);
      setCanResend(false);
      setOtp("");
    } catch (err: any) {
      addToast(err?.message || "Gửi lại OTP thất bại.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      addToast("Vui lòng điền đầy đủ mật khẩu mới và xác nhận mật khẩu", "warning");
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
      await authService.forgotPasswordReset(email.trim(), otp.trim(), newPassword);
      addToast("Đặt lại mật khẩu thành công!", "success");
      setStep("SUCCESS");
    } catch (err: any) {
      addToast(err?.message || "Không thể đặt lại mật khẩu. Vui lòng thử lại.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4">
      {/* Left Column: Security Information */}
      <div className="lg:col-span-6 space-y-6 hidden lg:block pr-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          Bảo mật tài khoản & dữ liệu
        </div>

        <h1 className="text-3xl xl:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Khôi phục mật khẩu tài khoản{" "}
          <span className="bg-linear-to-r from-[#2b417e] via-[#405ea7] to-[#2b417e] bg-clip-text text-transparent dark:from-[#7b9bee] dark:via-[#a0baff] dark:to-[#7b9bee]">
            LingoArena
          </span>
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-lg">
          Quy trình khôi phục mật khẩu qua xác thực OTP 2 lớp an toàn, giúp bạn lấy lại quyền truy cập lộ trình học và kho đề thi chỉ trong 1 phút.
        </p>

        {/* 3 Step Indicator Display */}
        <div className="space-y-3 pt-2">
          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
              step === "EMAIL"
                ? "bg-[#2b417e]/10 border-[#2b417e]/30 shadow-xs"
                : "bg-white/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#2b417e] text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Xác thực Email tài khoản
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Nhập email đã đăng ký tài khoản LingoArena để nhận mã xác thực OTP.
              </p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
              step === "OTP"
                ? "bg-[#2b417e]/10 border-[#2b417e]/30 shadow-xs"
                : "bg-white/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#2b417e] text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Nhập mã OTP 6 chữ số
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Kiểm tra hộp thư đến (hoặc Spam) để lấy mã xác thực có hiệu lực trong 5 phút.
              </p>
            </div>
          </div>

          <div
            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all ${
              step === "NEW_PASSWORD"
                ? "bg-[#2b417e]/10 border-[#2b417e]/30 shadow-xs"
                : "bg-white/70 dark:bg-slate-900/60 border-slate-200/70 dark:border-slate-800"
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-[#2b417e] text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Thiết lập mật khẩu mới
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tạo mật khẩu an toàn và đăng nhập lại ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Step-by-Step Form */}
      <div className="lg:col-span-6 w-full max-w-md mx-auto">
        <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-6 sm:p-9 border border-slate-200/80 dark:border-slate-800 shadow-2xl shadow-slate-900/5 dark:shadow-black/50 backdrop-blur-xl space-y-6">
          {/* STEP 1: Enter Email */}
          {step === "EMAIL" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Quên mật khẩu?
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Nhập địa chỉ email liên kết với tài khoản của bạn để nhận mã OTP khôi phục.
                </p>
              </div>

              <form onSubmit={handleSendEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Địa chỉ Email của bạn
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vidu@gmail.com"
                      className="pl-10 h-11 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e] focus:ring-2 focus:ring-[#2b417e]/20"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl hover:shadow-[#2b417e]/35 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang gửi mã xác thực...</span>
                    </>
                  ) : (
                    <>
                      <span>Gửi mã xác thực OTP</span>
                      <ArrowRight className="size-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter OTP */}
          {step === "OTP" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Nhập mã OTP 6 số
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Mã xác thực đã được gửi tới email <strong className="text-slate-900 dark:text-white">{email}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="flex justify-center py-2">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot index={0} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                      <InputOTPSlot index={1} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                      <InputOTPSlot index={2} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                      <InputOTPSlot index={3} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                      <InputOTPSlot index={4} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                      <InputOTPSlot index={5} className="rounded-xl border size-11 sm:size-12 text-lg font-bold border-slate-200 dark:border-slate-700" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                {/* Resend Countdown */}
                <div className="text-center text-xs text-slate-500">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="text-[#2b417e] dark:text-[#7b9bee] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" />
                      Gửi lại mã xác thực
                    </button>
                  ) : (
                    <span>
                      Gửi lại mã xác thực sau <strong className="text-[#2b417e] dark:text-[#7b9bee]">{countdown}s</strong>
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep("EMAIL")}
                    className="w-1/3 h-12 rounded-xl text-xs font-bold border-slate-200 cursor-pointer"
                  >
                    Đổi Email
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || otp.length < 6}
                    className="w-2/3 h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        <span>Đang kiểm tra...</span>
                      </>
                    ) : (
                      <>
                        <span>Xác thực OTP</span>
                        <ArrowRight className="size-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Enter New Password */}
          {step === "NEW_PASSWORD" && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="space-y-1.5">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Mật khẩu mới
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Thiết lập mật khẩu mới an toàn có ít nhất 6 ký tự.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Mật khẩu mới
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pl-10 h-11 rounded-xl text-xs sm:text-sm bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-[#2b417e]"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="size-4" />
                      <span>Đổi mật khẩu & Đăng nhập</span>
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Back to Login Link */}
          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 font-bold text-[#2b417e] dark:text-[#7b9bee] hover:underline"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại màn hình Đăng nhập
            </Link>
          </div>
        </div>
      </div>

      {/* Success Dialog Modal */}
      <Dialog open={step === "SUCCESS"} onOpenChange={() => router.push("/login")}>
        <DialogContent className="sm:max-w-md p-6 rounded-3xl text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="size-9" />
          </div>
          <DialogHeader className="space-y-1.5 text-center">
            <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
              Đổi mật khẩu thành công!
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Mật khẩu mới của bạn đã được cập nhật an toàn trên hệ thống. Bây giờ bạn có thể đăng nhập để tiếp tục học tập.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4">
            <Button
              className="w-full h-11 rounded-xl font-bold bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 cursor-pointer"
              onClick={() => router.push("/login")}
            >
              Đăng nhập ngay bây giờ
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
