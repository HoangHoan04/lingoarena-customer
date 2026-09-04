"use client";

import { TopicFilterBar } from "@/components/common/TopicFilterBar";
import type { QuestionLookup } from "@/types/question";
import type { ReadingExamType } from "@/types/reading";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Gauge,
  Newspaper,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";

interface ReadingLobbyHeaderProps {
  selectedExam: ReadingExamType;
  selectedLevel: string;
  selectedTopicId: string;
  topics: QuestionLookup[];
  topicsLoading?: boolean;
  activeMode: "catalog" | "speed";
  searchQuery: string;
  onSelectExam: (exam: ReadingExamType) => void;
  onSelectLevel: (level: string) => void;
  onSelectTopic: (topicId: string) => void;
  onChangeMode: (mode: "catalog" | "speed") => void;
  onSearchChange: (query: string) => void;
  passagesCount: number;
}

const EXAM_OPTIONS: { key: ReadingExamType; label: string; desc: string }[] = [
  { key: "ALL", label: "Tất cả bài đọc", desc: "Mọi dạng đề & chứng chỉ" },
  { key: "IELTS", label: "IELTS Reading", desc: "Passage 1, 2, 3 Academic" },
  { key: "TOEIC", label: "TOEIC Reading", desc: "Part 5, 6, 7 Single & Double" },
  { key: "VSTEP", label: "VSTEP B1 - C1", desc: "Đọc hiểu học thuật & đời sống" },
  { key: "APTIS", label: "Aptis ESOL", desc: "Đọc hiểu câu & sắp xếp đoạn văn" },
  { key: "ACADEMIC", label: "Khoa học & Báo chí", desc: "BBC, Nature, The Economist" },
];

const CEFR_LEVELS = ["ALL", "A2", "B1", "B2", "C1", "C2"];

export function ReadingLobbyHeader({
  selectedExam,
  selectedLevel,
  selectedTopicId,
  topics,
  topicsLoading = false,
  activeMode,
  searchQuery,
  onSelectExam,
  onSelectLevel,
  onSelectTopic,
  onChangeMode,
  onSearchChange,
  passagesCount,
}: ReadingLobbyHeaderProps) {
  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#132338] to-slate-950 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-cyan-200">
            <Sparkles className="size-3.5 text-cyan-400" />
            <span>Phòng Luyện Đọc Hiểu Tiếng Anh Chuyên Sâu</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Luyện Đọc Hiểu{" "}
            <span className="bg-linear-to-r from-cyan-300 via-sky-200 to-amber-200 bg-clip-text text-transparent">
              Reading Studio 24/7
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Nâng cao kỹ năng Skimming, Scanning và phân tích ngữ cảnh qua kho bài đọc chuẩn IELTS, TOEIC, VSTEP, Aptis và báo chí quốc tế. Hỗ trợ hiển thị dịch song ngữ từng đoạn, tra cứu từ vựng học thuật C1/C2 và phân tích trích dẫn đáp án chi tiết.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <BookOpen className="size-4 text-cyan-400" />
              Đầy đủ các dạng bài thi chuẩn quốc tế
            </span>
            <span className="flex items-center gap-1.5">
              <Compass className="size-4 text-amber-300" />
              Dịch song ngữ & Tra từ vựng trực tiếp
            </span>
            <span className="flex items-center gap-1.5">
              <Gauge className="size-4 text-emerald-400" />
              Đo tốc độ đọc (Words Per Minute)
            </span>
          </div>
        </div>
      </div>

      {/* 2 PRACTICE MODES */}
      <div className="flex items-center justify-center">
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2 border border-slate-200 dark:border-slate-700 max-w-md w-full">
          <button
            type="button"
            onClick={() => onChangeMode("catalog")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === "catalog"
                ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="size-4 text-cyan-600" />
            <span>Thư Viện Đọc Hiểu</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeMode("speed")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === "speed"
                ? "bg-white dark:bg-slate-900 text-cyan-700 dark:text-cyan-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Gauge className="size-4 text-amber-500" />
            <span>Luyện Đọc Tốc Độ (WPM)</span>
          </button>
        </div>
      </div>

      {/* FILTER ACCORDION (When in catalog mode) */}
      {activeMode === "catalog" && (
        <div className="space-y-4">
          <TopicFilterBar
            topics={topics}
            selectedId={selectedTopicId}
            onSelect={onSelectTopic}
            accent="cyan"
            loading={topicsLoading}
            title="Chọn chủ đề đọc"
            hint="Bài đọc được gắn chủ đề (Du lịch, Công việc, Môi trường…). Chọn chủ đề để luyện đúng ngữ cảnh."
          />
          {/* EXAMS SELECTOR */}
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <span>Chọn Dạng Đề & Chứng Chỉ Đọc Hiểu</span>
                  <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold lowercase">
                    ({passagesCount} bài đọc)
                  </span>
                </h3>
                <p className="text-xs text-slate-500">
                  Lựa chọn bài đọc theo chuẩn Cambridge IELTS, ETS TOEIC, VSTEP hoặc báo chí học thuật
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {EXAM_OPTIONS.map((ex) => {
                const isSelected = selectedExam === ex.key;

                return (
                  <button
                    key={ex.key}
                    type="button"
                    onClick={() => onSelectExam(ex.key)}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-1.5 ${
                      isSelected
                        ? "border-cyan-600 bg-cyan-50/80 dark:bg-cyan-950/40 text-slate-900 dark:text-white shadow-sm ring-2 ring-cyan-400/20"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-cyan-300 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`text-xs font-black ${isSelected ? "text-cyan-700 dark:text-cyan-300" : "text-slate-800 dark:text-slate-200"}`}>
                      {ex.label}
                    </span>
                    <p className="text-[10px] text-slate-400 line-clamp-1">
                      {ex.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEARCH & LEVEL FILTER BAR */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="relative w-full sm:max-w-md flex items-center">
              <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Tìm bài đọc theo chủ đề, từ khóa..."
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:border-cyan-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">
                CEFR:
              </span>
              {CEFR_LEVELS.map((lvl) => {
                const isSelected = selectedLevel === lvl;

                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onSelectLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border ${
                      isSelected
                        ? "bg-cyan-600 text-white border-cyan-600 shadow-xs font-black"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {lvl === "ALL" ? "Tất cả" : lvl}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
