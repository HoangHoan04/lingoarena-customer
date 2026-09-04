"use client";

import { BarChart3, ShieldCheck, User } from "lucide-react";
import React from "react";
import type { ProfileTab } from "./types";

interface ProfileTabNavProps {
  activeTab: ProfileTab;
  onChangeTab: (tab: ProfileTab) => void;
}

export default function ProfileTabNav({
  activeTab,
  onChangeTab,
}: ProfileTabNavProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
      <button
        type="button"
        onClick={() => onChangeTab("info")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeTab === "info"
            ? "bg-brand text-white shadow-md shadow-brand/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <User className="size-4" />
        Thông tin cá nhân
      </button>

      <button
        type="button"
        onClick={() => onChangeTab("security")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeTab === "security"
            ? "bg-brand text-white shadow-md shadow-brand/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <ShieldCheck className="size-4" />
        Mật khẩu & Bảo mật
      </button>

      <button
        type="button"
        onClick={() => onChangeTab("stats")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
          activeTab === "stats"
            ? "bg-brand text-white shadow-md shadow-brand/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
      >
        <BarChart3 className="size-4" />
        Tiến độ học tập
      </button>
    </div>
  );
}
