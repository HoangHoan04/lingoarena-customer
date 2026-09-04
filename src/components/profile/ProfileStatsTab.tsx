"use client";

import { GamificationWidget } from "@/components/gamification";
import { Link } from "@/i18n/routing";
import type { UserVocabStats } from "@/types/vocabulary";
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
} from "lucide-react";

interface ProfileStatsTabProps {
  assessmentTotal: number;
  vocabStats: UserVocabStats | null;
  organizations?: Array<{ id?: string; name?: string; slug?: string }>;
  onGenerateReferral: () => void;
}

export default function ProfileStatsTab({
  assessmentTotal,
  vocabStats,
  organizations = [],
  onGenerateReferral,
}: ProfileStatsTabProps) {
  return (
    <div className="space-y-6">
      {/* Gamification Widget */}
      <GamificationWidget />

      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Tổ chức của tôi
        </h3>
        {organizations.length === 0 ? (
          <p className="text-sm text-slate-500">Chưa có dữ liệu</p>
        ) : (
          <ul className="space-y-1 text-sm">
            {organizations.map((org) => (
              <li key={org.id || org.slug || org.name}>
                {org.name || org.slug}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Exam & Tests */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Bài thi & Đề luyện
            </span>
            <div className="size-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-brand dark:text-blue-400 flex items-center justify-center">
              <Award className="size-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {assessmentTotal}{" "}
            <span className="text-sm font-semibold text-slate-500">
              đề / bài test
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {assessmentTotal > 0
              ? `Đã hoàn thành các bài test trắc nghiệm & đề thi full`
              : "Chưa tham gia bài thi nào, hãy bắt đầu luyện tập ngay"}
          </p>
          <div className="pt-2">
            <Link
              href="/practice"
              className="inline-flex items-center gap-1 text-xs font-bold text-brand dark:text-[#7b9bee] hover:underline"
            >
              Luyện đề ngay <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Mastered Vocabulary */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Từ vựng đã làm chủ
            </span>
            <div className="size-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="size-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {vocabStats?.totalMasteredWords || vocabStats?.masteredCount || 0}{" "}
            <span className="text-sm font-semibold text-slate-500">từ</span>
          </div>
          <p className="text-xs text-slate-500">
            Đã ghi nhớ sâu thông qua thuật toán ngắt quãng FSRS
          </p>
          <div className="pt-2">
            <Link
              href="/vocabulary/notebook"
              className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Xem sổ từ vựng <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>

        {/* Learning / In Progress */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Đang trong tiến trình học
            </span>
            <div className="size-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="size-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {vocabStats?.learningWords || vocabStats?.learningCount || 0}{" "}
            <span className="text-sm font-semibold text-slate-500">từ</span>
          </div>
          <p className="text-xs text-slate-500">
            {vocabStats?.dueTodayCount && vocabStats.dueTodayCount > 0
              ? `Hôm nay có ${vocabStats.dueTodayCount} từ cần ôn tập`
              : "Đã hoàn thành toàn bộ mục tiêu từ vựng hôm nay"}
          </p>
          <div className="pt-2">
            <Link
              href="/vocabulary/review"
              className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Ôn tập thẻ Flashcard <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* SRS Detail Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="size-5 text-brand" /> Chi tiết hệ thống ghi
              nhớ từ vựng FSRS
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống theo dõi tần suất lặp lại ngắt quãng để tối ưu hóa khả
              năng ghi nhớ dài hạn.
            </p>
          </div>
          <Link
            href="/vocabulary"
            className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-brand hover:bg-[#1e2f5e] text-white text-xs font-bold transition-all shadow-md"
          >
            Khám phá kho từ vựng
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              Hôm nay cần ôn
            </span>
            <div className="text-2xl font-black text-rose-600">
              {vocabStats?.dueTodayCount || 0}
            </div>
            <span className="text-[11px] text-slate-400">từ vựng</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              Tổng lượt ôn
            </span>
            <div className="text-2xl font-black text-brand dark:text-[#7b9bee]">
              {vocabStats?.totalReviewed || 0}
            </div>
            <span className="text-[11px] text-slate-400">lượt phản hồi</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              Chuỗi ngày học
            </span>
            <div className="text-2xl font-black text-orange-500">
              {vocabStats?.streakDays || 0}
            </div>
            <span className="text-[11px] text-slate-400">ngày liên tiếp</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-1">
            <span className="text-xs text-slate-500 font-medium">
              Độ chính xác
            </span>
            <div className="text-2xl font-black text-emerald-600">
              {vocabStats?.accuracy
                ? `${Math.round(vocabStats.accuracy * 100)}%`
                : "100%"}
            </div>
            <span className="text-[11px] text-slate-400">tỉ lệ nhớ đúng</span>
          </div>
        </div>
      </div>
    </div>
  );
}
