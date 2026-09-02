"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import { useToastStore } from "@/stores/useToastStore";
import { useRouter } from "@/i18n/routing";
import { arenaService } from "@/services/arena.service";
import { questionService } from "@/services/question.service";
import {
  ArrowRight,
  Bot,
  Flame,
  KeyRound,
  Play,
  ShieldAlert,
  Sparkles,
  Swords,
  Users,
  Zap,
} from "lucide-react";
import React, { useState } from "react";

export default function ArenaGameModesGrid({
  onOpenCustomRoom,
}: {
  onOpenCustomRoom: () => void;
}) {
  const { startMatchmaking } = useArenaStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  const [loadingMode, setLoadingMode] = useState<string | null>(null);

  const firstSkillId = async () => {
    const skills = await questionService.lookupSkills();
    const id = skills[0]?.id;
    if (!id) throw new Error("Chưa có kỹ năng thi đấu khả dụng");
    return id;
  };

  const handleStartRanked = async () => {
    setLoadingMode("RANKED");
    startMatchmaking("RANKED");
    try {
      const ticket = await arenaService.queue(await firstSkillId(), "RANKED");
      if (ticket.matchedMatchId) {
        router.push(`/arena/match/${ticket.matchedMatchId}`);
      } else {
        addToast("Đã vào hàng đợi. Hãy thử lại khi có đối thủ hoặc chọn đấu bot.", "info", 5000);
      }
    } catch (err: any) {
      addToast(err?.message || "Không thể vào hàng đợi Arena", "error");
    } finally {
      setLoadingMode(null);
    }
  };

  const handleStartCasual = async () => {
    setLoadingMode("CASUAL");
    startMatchmaking("CASUAL");
    try {
      const match = await arenaService.practiceMatch(await firstSkillId(), 5);
      router.push(`/arena/match/${match.id}`);
    } catch (err: any) {
      addToast(err?.message || "Không thể tạo trận luyện", "error");
    } finally {
      setLoadingMode(null);
    }
  };

  const handleStartBot = async () => {
    setLoadingMode("BOT");
    startMatchmaking("BOT");
    try {
      const match = await arenaService.practiceMatch(await firstSkillId(), 5);
      router.push(`/arena/match/${match.id}`);
    } catch (err: any) {
      addToast(err?.message || "Không thể tạo trận bot", "error");
    } finally {
      setLoadingMode(null);
    }
  };

  return (
    <div className="space-y-4 select-none">
      <div className="flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-extrabold text-foreground flex items-center gap-2">
          <Swords className="size-5 text-primary" />
          <span>Chọn Chế Độ Tranh Tài</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MODE 1: RANKED 1V1 */}
        <div className="group relative rounded-3xl p-6 bg-linear-to-b from-purple-900/30 via-card to-card border border-purple-500/30 hover:border-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center shadow-inner">
                <Swords className="size-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10.5px] font-black uppercase tracking-wider">
                Tính Điểm ELO
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-purple-400 transition-colors">
                Đấu Xếp Hạng 1v1
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Ghép ngẫu nhiên đối thủ cùng trình độ Elo. Thắng nhận +25 Elo và leo Rank mùa giải.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartRanked}
            className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-purple-600/30 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loadingMode === "RANKED" ? "Đang tìm..." : "Tìm Trận Rank"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* MODE 2: CASUAL QUICK MATCH */}
        <div className="group relative rounded-3xl p-6 bg-linear-to-b from-blue-900/30 via-card to-card border border-blue-500/30 hover:border-blue-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center shadow-inner">
                <Zap className="size-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10.5px] font-black uppercase tracking-wider">
                Giải Trí Nhanh
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-blue-400 transition-colors">
                Đấu Nhanh Thường
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Luyện tập tự do không lo tụt Rank. Vẫn nhận đầy đủ điểm kinh nghiệm (+XP) và huy hiệu.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartCasual}
            className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-blue-600 to-sky-600 hover:from-blue-500 hover:to-sky-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loadingMode === "CASUAL" ? "Đang tạo..." : "Vào Đấu Nhanh"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* MODE 3: AI BOT TRAINING */}
        <div className="group relative rounded-3xl p-6 bg-linear-to-b from-emerald-900/30 via-card to-card border border-emerald-500/30 hover:border-emerald-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-inner">
                <Bot className="size-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10.5px] font-black uppercase tracking-wider">
                Luyện Tập AI
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-emerald-400 transition-colors">
                Đấu Luyện Với AI
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Thi đấu với LingoBot AI mô phỏng theo tốc độ phản xạ của tuyển thủ chuyên nghiệp.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartBot}
            className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loadingMode === "BOT" ? "Đang tạo..." : "Đấu Với Bot"}</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

        {/* MODE 4: CUSTOM ROOM */}
        <div className="group relative rounded-3xl p-6 bg-linear-to-b from-amber-900/30 via-card to-card border border-amber-500/30 hover:border-amber-500 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="size-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shadow-inner">
                <KeyRound className="size-6" />
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10.5px] font-black uppercase tracking-wider">
                Phòng Bạn Bè
              </span>
            </div>

            <div>
              <h3 className="text-base font-black text-foreground group-hover:text-amber-400 transition-colors">
                Thách Đấu Bạn Bè
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Tạo phòng riêng hoặc nhập mã PIN 6 số để so tài trực tiếp cùng bạn bè hoặc nhóm học tập.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenCustomRoom}
            className="w-full py-3 px-4 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30 transition-all hover:scale-102 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Tạo / Nhập Phòng</span>
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
