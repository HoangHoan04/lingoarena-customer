"use client";

import { TopicFilterBar } from "@/components/common/TopicFilterBar";
import type { QuestionLookup } from "@/types/question";
import type { SpeakingLevel } from "@/types/speaking-room";
import { Mic, PlusCircle, Radio, Sparkles, Users } from "lucide-react";

interface SpeakingLobbyHeaderProps {
  selectedLevel: SpeakingLevel;
  selectedTopic: string;
  topics: QuestionLookup[];
  topicsLoading?: boolean;
  activeTab: "rooms" | "create";
  onSelectLevel: (level: SpeakingLevel) => void;
  onSelectTopic: (topicId: string) => void;
  onChangeTab: (tab: "rooms" | "create") => void;
  liveUsersCount?: number;
  activeRoomsCount?: number;
}

export function SpeakingLobbyHeader({
  selectedLevel,
  selectedTopic,
  topics,
  topicsLoading = false,
  activeTab,
  onSelectLevel,
  onSelectTopic,
  onChangeTab,
  liveUsersCount = 142,
  activeRoomsCount = 28,
}: SpeakingLobbyHeaderProps) {
  const levels: { key: SpeakingLevel; label: string; desc: string }[] = [
    { key: "ALL", label: "Tất cả trình độ", desc: "Mọi cấp độ" },
    { key: "A1-A2", label: "Sơ cấp (A1 - A2)", desc: "Nói chậm, từ vựng cơ bản" },
    { key: "B1-B2", label: "Trung cấp (B1 - B2)", desc: "Giao tiếp trôi chảy, phản xạ tự nhiên" },
    { key: "C1-C2", label: "Nâng cao (C1 - C2)", desc: "Thảo luận chuyên sâu, học thuật" },
  ];

  return (
    <div className="space-y-8">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-950 via-[#1e1035] to-slate-950 text-white p-6 sm:p-12 border border-slate-800 shadow-2xl space-y-6">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-bold uppercase tracking-wider text-purple-200">
            <Radio className="size-3.5 text-emerald-400 animate-pulse" />
            <span>Phòng Luyện Nói Tiếng Anh Online Trực Tiếp Với Người Thật</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
            Luyện Nói Tiếng Anh{" "}
            <span className="bg-linear-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
              Voice Rooms 24/7
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Tham gia các phòng nói chuyện trực tiếp bằng giọng nói thật với người học và bạn bè khắp mọi nơi. Tự do thảo luận theo chủ đề, luyện phản xạ tự nhiên không sợ sai.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500 animate-ping" />
              <strong className="text-white font-bold">{liveUsersCount}</strong> người đang online
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="size-4 text-purple-400" />
              <strong className="text-white font-bold">{activeRoomsCount}</strong> phòng đang trò chuyện
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-300" /> Hoàn toàn miễn phí
            </span>
          </div>
        </div>
      </div>

      {/* SETUP: 1. CHỌN TRÌNH ĐỘ */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-5 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span>1. Chọn Trình Độ Của Bạn</span>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-bold lowercase">
                (bộ lọc phòng phù hợp)
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Hệ thống sẽ ưu tiên các phòng nói có trình độ tương xứng để bạn tự tin giao tiếp
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {levels.map((lvl) => {
            const isSelected = selectedLevel === lvl.key;

            return (
              <button
                key={lvl.key}
                type="button"
                onClick={() => onSelectLevel(lvl.key)}
                className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                  isSelected
                    ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-slate-900 dark:text-white shadow-md ring-2 ring-purple-400/30"
                    : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-purple-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-black ${isSelected ? "text-purple-700 dark:text-purple-300" : "text-slate-800 dark:text-slate-200"}`}>
                    {lvl.label}
                  </span>
                  {isSelected && (
                    <span className="size-2 rounded-full bg-purple-600" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {lvl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <TopicFilterBar
        topics={topics}
        selectedId={selectedTopic}
        onSelect={onSelectTopic}
        accent="purple"
        loading={topicsLoading}
        title="Chọn chủ đề nói"
        hint="Phòng luyện nói theo chủ đề. Chọn chủ đề để vào đúng phòng thảo luận."
      />

      {/* 2 TABS: CHỌN PHÒNG HIỆN CÓ / TẠO PHÒNG RIÊNG */}
      <div className="flex items-center justify-center pt-2">
        <div className="p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center gap-2 border border-slate-200 dark:border-slate-700 max-w-md w-full">
          <button
            type="button"
            onClick={() => onChangeTab("rooms")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "rooms"
                ? "bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Users className="size-4" />
            <span>Phòng Đang Hoạt Động</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeTab("create")}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === "create"
                ? "bg-purple-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <PlusCircle className="size-4" />
            <span>Tạo Phòng Riêng</span>
          </button>
        </div>
      </div>
    </div>
  );
}
