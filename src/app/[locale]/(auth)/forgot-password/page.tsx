"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/stores/useToastStore";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Check, CheckCircle2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

type Step = 1 | 2 | 3 | "success";

const STEPS = [
  { step: 1, label: "Email" },
  { step: 2, label: "OTP" },
  { step: 3, label: "Mật khẩu mới" },
] as const;

function Stepper({ current }: { current: Step }) {
  const activeIndex = current === "success" ? STEPS.length : current;

  return (
    <div className="flex w-full items-center justify-between">
      {STEPS.map(({ step, label }, idx) => {
        const isDone = activeIndex > step;
        const isActive = activeIndex === step;
        const isSegmentFilled = activeIndex > step;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-1.5 relative">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  isDone && "border-primary bg-primary text-primary-foreground",
                  isActive && "border-primary bg-background text-primary",
                  !isDone &&
                    !isActive &&
                    "border-border bg-muted text-muted-foreground",
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : step}
              </div>
              <span
                className={cn(
                  "whitespace-nowrap text-[11px] font-medium absolute top-9 left-1/2 -translate-x-1/2",
                  isActive || isDone
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {label}
              </span>
            </div>

            {/* Connecting line segment */}
            {idx < STEPS.length - 1 && (
              <div className="mx-2 h-0.5 flex-1 relative bg-border rounded-full overflow-hidden">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 bg-primary transition-all duration-300",
                    isSegmentFilled ? "w-full" : "w-0",
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const { addToast } = useToastStore();
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleStepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (step === 1) {
        if (!email) throw new Error("Vui lòng nhập email");
        addToast("Mã OTP đã được gửi tới email của bạn!", "success");
        setStep(2);
      } else if (step === 2) {
        if (!otp || otp.length < 6) throw new Error("Mã OTP không hợp lệ");
        addToast("Xác thực OTP thành công!", "success");
        setStep(3);
      } else if (step === 3) {
        if (!password || !confirmPassword)
          throw new Error("Vui lòng điền đầy đủ thông tin");
        if (password !== confirmPassword) {
          addToast("Mật khẩu xác nhận không khớp!", "error");
          return;
        }
        addToast("Đặt lại mật khẩu thành công!", "success");
        setStep("success");
      }
    } catch (err: any) {
      addToast(err.message || "Đã có lỗi xảy ra. Vui lòng thử lại.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-between px-4 py-8 sm:py-12">
      <div className="my-auto grid grid-cols-1 items-center gap-12 md:grid-cols-12">
        <div className="flex flex-col gap-6 md:col-span-5">
          <div className="flex flex-col gap-2">
            <div className="h-16 w-16 rounded-full bg-muted" />
            <h1 className="mt-2 text-left text-3xl font-bold text-foreground">
              {step === "success" ? "Hoàn tất!" : "Đặt lại mật khẩu"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === 1 &&
                "Xác thực danh tính để bảo mật và khôi phục tài khoản của bạn."}
              {step === 2 && "Nhập mã xác thực đã được gửi tới email của bạn."}
              {step === 3 &&
                "Chọn một mật khẩu mạnh và duy nhất để bảo vệ tài khoản."}
              {step === "success" &&
                "Tài khoản của bạn đã được cập nhật thành công."}
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col gap-6 md:col-span-7 md:max-w-none">
          {step !== "success" && (
            <div className="pb-4">
              <Stepper current={step} />
            </div>
          )}

          {/* FIX: Thêm lớp padding chung p-6 để card thông thoáng và đẹp mắt */}
          <Card className="p-6">
            {step === "success" ? (
              <CardContent className="flex flex-col items-center justify-center gap-4 p-0 text-center">
                <CheckCircle2 className="h-16 w-16 text-primary" />
                <p className="text-sm text-muted-foreground">
                  Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật
                  khẩu mới.
                </p>
                <Button
                  className="mt-2 w-full"
                  onClick={() => (window.location.href = "/login")}
                >
                  Về trang đăng nhập
                </Button>
              </CardContent>
            ) : (
              <form onSubmit={handleStepSubmit} className="space-y-4">
                {/* FIX: Thay thế padding bằng `p-0` và quản lý khoảng cách bằng `space-y-4` của form để không bị dính */}
                <CardContent className="p-0">
                  {step === 1 && (
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="email">Địa chỉ email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="flex flex-col gap-3">
                      <Label htmlFor="otp">Nhập mã xác thực (OTP)</Label>
                      <InputOTP
                        id="otp"
                        maxLength={6}
                        value={otp}
                        onChange={setOtp}
                        // FIX: Thêm pattern để CHỈ cho phép nhập số
                        pattern={REGEXP_ONLY_DIGITS}
                        containerClassName="justify-center"
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      <p className="mt-1 text-center text-xs text-muted-foreground">
                        Mã đã gửi tới{" "}
                        <span className="font-medium text-foreground">
                          {email}
                        </span>
                      </p>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password">Mật khẩu mới</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 mr-1" />
                            )}
                            {showPassword ? "Ẩn" : "Hiện"}
                          </Button>
                        </div>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="confirmPassword">
                            Xác nhận mật khẩu
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="xs"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-3.5 w-3.5 mr-1" />
                            ) : (
                              <Eye className="h-3.5 w-3.5 mr-1" />
                            )}
                            {showConfirmPassword ? "Ẩn" : "Hiện"}
                          </Button>
                        </div>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                {/* FIX: Đưa padding của Footer về 0 và đẩy lên bằng khoảng cách form */}
                <CardFooter className="p-0 pt-2">
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading && <Spinner />}
                    {isLoading
                      ? "Đang xử lý..."
                      : step === 1
                        ? "Gửi mã xác thực"
                        : step === 2
                          ? "Xác thực OTP"
                          : "Đặt lại mật khẩu"}
                  </Button>
                </CardFooter>
              </form>
            )}
          </Card>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => (window.location.href = "/login")}
          >
            Về trang đăng nhập
          </Button>
        </div>
      </div>

      <footer className="mt-12 flex w-full flex-col items-center justify-between gap-4 border-t border-border pt-6 text-xs font-medium text-muted-foreground sm:flex-row">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/register" className="hover:underline">
            Đăng ký
          </Link>
          <Link href="/login" className="hover:underline">
            Đăng nhập
          </Link>
          <Link href="#" className="hover:underline">
            Trợ giúp
          </Link>
          <Link href="#" className="hover:underline">
            Điều khoản
          </Link>
          <Link href="#" className="hover:underline">
            Bảo mật
          </Link>
          <Link href="#" className="hover:underline">
            Giới thiệu
          </Link>
          <Link href="#" className="hover:underline">
            Cài đặt
          </Link>
        </div>
        <div className="flex cursor-pointer items-center gap-1 hover:underline">
          <span>Tiếng Việt</span>
          <span className="text-[10px]">▼</span>
        </div>
      </footer>
    </div>
  );
}
