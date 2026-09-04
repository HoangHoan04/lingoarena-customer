"use client";

import HeaderSettingsMenu from "@/components/common/HeaderSettingsMenu";
import Logo from "@/components/common/Logo";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-background text-foreground relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-130 w-220 -translate-x-1/2 rounded-full bg-linear-to-tr from-brand/15 via-[#4563b0]/10 to-brand/15 blur-3xl dark:from-brand/25 dark:via-[#7b9bee]/15 dark:to-brand/20" />
      <div className="pointer-events-none absolute -bottom-40 right-10 -z-10 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />

      {/* Grid Pattern Overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(43, 65, 126, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(43, 65, 126, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Top Auth Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between z-20">
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-200 hover:-translate-x-0.5"
          aria-label="Về trang chủ LingoArena"
        >
          <Logo />
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-brand dark:hover:text-[#7b9bee] px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Về trang chủ</span>
          </Link>
          <HeaderSettingsMenu />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-2 sm:p-4 lg:p-5 z-10">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 border-t border-slate-200/60 dark:border-slate-800/80 z-20">
        <div>
          © {new Date().getFullYear()}{" "}
          <strong className="text-slate-700 dark:text-slate-300">
            LingoArena
          </strong>
          . All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/terms"
            className="hover:text-brand dark:hover:text-[#7b9bee] transition-colors"
          >
            Điều khoản sử dụng
          </Link>
          <Link
            href="/privacy"
            className="hover:text-brand dark:hover:text-[#7b9bee] transition-colors"
          >
            Chính sách bảo mật
          </Link>
          <Link
            href="/contact"
            className="hover:text-brand dark:hover:text-[#7b9bee] transition-colors"
          >
            Trợ giúp & Hỗ trợ
          </Link>
        </div>
      </footer>
    </div>
  );
}
