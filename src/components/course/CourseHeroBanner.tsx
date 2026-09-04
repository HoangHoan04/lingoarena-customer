"use client";

import { useCourseStore } from "@/stores/useCourseStore";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

export default function CourseHeroBanner() {
  const { searchQuery, setSearchQuery } = useCourseStore();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-[#1b2950] via-brand to-[#405ea7] text-white p-6 sm:p-10 shadow-2xl border border-white/10 select-none mb-8">
      {/* Ambient background glows */}
      <div className="absolute -top-24 -right-24 size-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl space-y-5">
        {/* Top Mini Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-300 shadow-inner">
          <Sparkles className="size-3.5" />
          <span>Hệ Thống Khóa Học Trực Tuyến Chuẩn Quốc Tế 2026</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
          Làm Chủ Ngoại Ngữ & Bứt Phá Mục Tiêu Điểm Số Cùng{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-300 via-orange-200 to-amber-400">
            LingoArena
          </span>
        </h1>

        <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal max-w-2xl">
          Giáo trình bản quyền từ Cambridge, ETS và Bộ GD&ĐT. Tích hợp AI chấm
          chữa bài 24/7 và lộ trình cá nhân hóa giúp bạn đỗ chứng chỉ ngay lần
          thi đầu tiên.
        </p>

        {/* Search Input Box */}
        <div className="relative max-w-xl">
          <Search className="size-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên khóa học, chứng chỉ (IELTS, TOEIC, VSTEP), giảng viên..."
            className="w-full h-12 sm:h-14 pl-12 pr-4 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium shadow-xl border border-white/20 focus:outline-none focus:ring-4 focus:ring-amber-300/30 transition-all"
          />
        </div>

        {/* Key Metrics Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/15">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <BookOpen className="size-4 text-amber-300" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-black leading-tight">
                50+
              </p>
              <p className="text-[11px] text-blue-200 font-medium">
                Khóa học chuẩn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Users className="size-4 text-emerald-300" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-black leading-tight">
                28.000+
              </p>
              <p className="text-[11px] text-blue-200 font-medium">
                Học viên tin chọn
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <Award className="size-4 text-amber-300" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-black leading-tight">
                96.4%
              </p>
              <p className="text-[11px] text-blue-200 font-medium">
                Đạt mục tiêu điểm
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
              <CheckCircle2 className="size-4 text-sky-300" />
            </div>
            <div>
              <p className="text-base sm:text-lg font-black leading-tight">
                Cam kết
              </p>
              <p className="text-[11px] text-blue-200 font-medium">
                Đầu ra bằng văn bản
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
