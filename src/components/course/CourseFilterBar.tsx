"use client";

import {
  useCourseStore,
  type CourseCefrLevel,
  type CourseExamType,
  type CoursePriceType,
} from "@/stores/useCourseStore";
import { ArrowUpDown, BookOpen, Filter, Flame, Sparkles } from "lucide-react";
import React from "react";

const EXAM_TYPE_TABS: { id: CourseExamType; label: string }[] = [
  { id: "all", label: "Tất cả khóa học" },
  { id: "ielts", label: "IELTS 4 Kỹ Năng" },
  { id: "toeic", label: "TOEIC Nghe - Đọc" },
  { id: "vstep", label: "VSTEP B1 - B2 - C1" },
  { id: "communication", label: "Giao Tiếp & Công Sở" },
  { id: "grammar", label: "Ngữ Pháp Chuyên Sâu" },
];

const CEFR_LEVELS: { id: CourseCefrLevel; label: string }[] = [
  { id: "all", label: "Mọi trình độ" },
  { id: "A1", label: "A1 (Mất gốc)" },
  { id: "A2", label: "A2 (Cơ bản)" },
  { id: "B1", label: "B1 (Trung cấp)" },
  { id: "B2", label: "B2 (Khá)" },
  { id: "C1", label: "C1 (Cao cấp)" },
];

const PRICE_TYPES: { id: CoursePriceType; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "free", label: "Miễn phí 100%" },
  { id: "pro", label: "Khóa VIP Pro" },
  { id: "mentor", label: "Kèm 1-1 Mentor" },
];

export default function CourseFilterBar() {
  const {
    selectedExamType,
    setSelectedExamType,
    selectedCefrLevel,
    setSelectedCefrLevel,
    selectedPriceType,
    setSelectedPriceType,
    sortBy,
    setSortBy,
  } = useCourseStore();

  return (
    <div className="space-y-4 mb-8 select-none">
      {/* Category Tabs (Primary Filter) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {EXAM_TYPE_TABS.map((tab) => {
          const active = selectedExamType === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedExamType(tab.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                active
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-102"
                  : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Sub-Filters Bar (CEFR, Price, Sort) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-card border border-border shadow-xs">
        {/* Left Sub-filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* CEFR Level Pill Dropdown/Select */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-muted-foreground font-semibold flex items-center gap-1">
              <Filter className="size-3.5 text-primary" />
              <span>Trình độ:</span>
            </span>
            <select
              value={selectedCefrLevel}
              onChange={(e) =>
                setSelectedCefrLevel(e.target.value as CourseCefrLevel)
              }
              className="h-8 px-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {CEFR_LEVELS.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price Type Pill */}
          <div className="flex items-center gap-1.5 text-xs pl-2 border-l border-border">
            <span className="text-muted-foreground font-semibold">Loại:</span>
            <select
              value={selectedPriceType}
              onChange={(e) =>
                setSelectedPriceType(e.target.value as CoursePriceType)
              }
              className="h-8 px-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
            >
              {PRICE_TYPES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Sorting Selector */}
        <div className="flex items-center gap-1.5 text-xs">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <span className="text-muted-foreground font-semibold">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-8 px-2.5 rounded-xl bg-muted border border-border text-xs font-bold text-foreground focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="newest">Mới cập nhật</option>
            <option value="rating">Đánh giá cao nhất</option>
            <option value="price_asc">Học phí: Thấp đến Cao</option>
            <option value="price_desc">Học phí: Cao đến Thấp</option>
          </select>
        </div>
      </div>
    </div>
  );
}
