"use client";

import { RefreshCw } from "lucide-react";
import React from "react";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8 animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-800 rounded-md" />
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
        </div>

        {/* Hero Banner skeleton */}
        <div className="rounded-3xl bg-slate-200 dark:bg-slate-800/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="size-24 sm:size-28 rounded-full bg-slate-300 dark:bg-slate-700 shrink-0" />
          <div className="space-y-3 w-full max-w-md">
            <div className="h-7 w-48 bg-slate-300 dark:bg-slate-700 rounded-xl" />
            <div className="h-4 w-64 bg-slate-300 dark:bg-slate-700 rounded-lg" />
            <div className="flex gap-2 pt-1">
              <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-full" />
              <div className="h-6 w-28 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>
          </div>
        </div>

        {/* Tab Navigation skeleton */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-10 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>

        {/* Body card skeleton */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 text-slate-400 py-20">
          <RefreshCw className="size-5 animate-spin text-brand" />
          <span className="text-sm font-semibold">
            Đang tải thông tin hồ sơ...
          </span>
        </div>
      </div>
    </div>
  );
}
