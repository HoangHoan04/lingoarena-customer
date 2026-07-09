"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth, setLoading, isLoading } = useAuthStore();
  const { addToast } = useToastStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      addToast("Please fill in all fields", "warning");
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser = {
        id: "123",
        email: email,
        name: name,
        role: "student",
      };

      setAuth(mockUser, "mock-jwt-token-123456");
      addToast("Account created successfully!", "success");
      router.push("/");
    } catch {
      addToast("Failed to create account. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: "google" | "facebook") => {
    addToast(
      `Registering with ${provider === "google" ? "Google" : "Facebook"}...`,
      "success",
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col justify-between min-h-screen px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center my-auto">
        <div className="md:col-span-5 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-16 h-16 rounded-full bg-neutral-300 dark:bg-neutral-700" />
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 text-left mt-2">
              Create Account
            </h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Join LingoArena today and start your learning journey with us.
            </p>
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none">
          <Card className="p-6">
            <CardContent className="p-0 flex flex-col gap-5">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="email">Your email</Label>
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
                    <Label htmlFor="password">Your password</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 mr-1" /> Hide
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 mr-1" /> Show
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

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2"
                >
                  {isLoading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-border"></div>
                <span className="shrink mx-4 text-xs text-muted-foreground uppercase">
                  Or sign up with
                </span>
                <div className="grow border-t border-border"></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10 rounded-xl"
                  onClick={() => handleSocialRegister("google")}
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
                  onClick={() => handleSocialRegister("facebook")}
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

          <Link href="/login" className="w-full">
            <Button
              variant="outline"
              className="w-full py-6 text-neutral-900 dark:text-neutral-100 font-semibold rounded-full shadow-sm text-sm"
            >
              Already have an account? Log in
            </Button>
          </Link>
        </div>
      </div>

      <footer className="w-full border-t border-neutral-200 dark:border-neutral-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          <Link href="/register" className="hover:underline">
            Sign up
          </Link>
          <Link href="/login" className="hover:underline">
            Log in
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
