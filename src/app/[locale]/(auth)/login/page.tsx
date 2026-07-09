"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { Eye, EyeOff, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: "123",
        email: email,
        name: email.split("@")[0],
        role: "student",
      };

      setAuth(mockUser, "mock-jwt-token-123456");
      addToast("Successfully logged in!", "success");
      router.push("/");
    } catch {
      addToast("Invalid credentials. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: "google" | "facebook") => {
    addToast(
      `Logging in with ${provider === "google" ? "Google" : "Facebook"}...`,
      "success",
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between min-h-screen px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center my-auto">
        <div className="md:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <FieldLabel className="text-2xl font-bold text-foreground text-left mt-2">
              Đăng nhập tài khoản gần đây
            </FieldLabel>
            <p className="text-sm text-muted-foreground">
              Chọn một tài khoản để tiếp tục hoặc thêm tài khoản mới.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="relative w-36 border border-border rounded-xl overflow-hidden bg-card shadow-xs">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                className="absolute top-1.5 left-1.5 bg-neutral-950/40 hover:bg-neutral-950/60 text-white"
              >
                <X className="w-3 h-3" />
              </Button>
              <div className="w-full h-32 bg-muted overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=60"
                  alt="Mika Lee"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5 text-center text-sm font-medium text-card-foreground truncate">
                Mika Lee
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none">
          <Card className="p-6">
            <CardContent className="p-0 flex flex-col gap-5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 mr-1" /> Án
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 mr-1" /> Hiện
                        </>
                      )}
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
                <div className="text-xs text-right">
                  <Button variant="link" className="text-xs font-semibold">
                    <Link href="/forgot-password">Quên mật khẩu?</Link>
                  </Button>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full ">
                  {isLoading ? "Đang đăng nhâp" : "Đăng nhập"}
                </Button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-border"></div>
                <span className="shrink mx-4 text-xs text-muted-foreground uppercase">
                  Hoăc đăng nhâp bằng
                </span>
                <div className="grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl"
                  onClick={() => handleSocialLogin("google")}
                >
                  <img
                    src="/icons/google.svg"
                    alt="Google"
                    className="w-5 h-5 mr-1"
                  />
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl"
                  onClick={() => handleSocialLogin("facebook")}
                >
                  <img
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    className="w-5 h-5 mr-1"
                  />
                  Facebook
                </Button>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" className="w-full">
            <Link href="/register">Tạo tài khoản</Link>
          </Button>
        </div>
      </div>

      <footer className="w-full border-t border-border mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/register" className="hover:underline">
            Đăng ký
          </Link>
          <Link href="/login" className="hover:underline">
            Đăng nhập
          </Link>
          <Link href="#" className="hover:underline">
            Help Center
          </Link>
          <Link href="#" className="hover:underline">
            Terms of Service
          </Link>
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="#" className="hover:underline">
            About
          </Link>
          <Link href="#" className="hover:underline">
            Settings
          </Link>
        </div>
        <div className="flex items-center gap-1 cursor-pointer hover:underline">
          <span>English (United States)</span>
          <span className="text-[10px]">▼</span>
        </div>
      </footer>
    </div>
  );
}
