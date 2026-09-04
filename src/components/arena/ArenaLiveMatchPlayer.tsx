"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  Home,
  RotateCcw,
  Sparkles,
  Swords,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import React, { useEffect, useState } from "react";

export default function ArenaLiveMatchPlayer() {
  const [mounted, setMounted] = useState(false);
  const {
    activeMatch,
    matchedOpponent,
    submitAnswer,
    nextQuestion,
    resetMatch,
    startMatchmaking,
  } = useArenaStore();
  const { user } = useAuthStore();
  const router = useRouter();

  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Timer countdown per question
  useEffect(() => {
    if (!activeMatch || activeMatch.isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timeout -> submit answer -1 (wrong)
          if (activeMatch.mySelectedAnswer === null) {
            submitAnswer(-1);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeMatch, submitAnswer]);

  // Reset timer when moving to next question
  useEffect(() => {
    setTimeLeft(10);
  }, [activeMatch?.currentQuestionIndex]);

  if (!activeMatch) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center select-none">
        <Swords className="size-16 text-muted-foreground" />
        <h2 className="text-lg font-bold text-foreground">Không tìm thấy trận đấu</h2>
        <Link
          href="/arena"
          className="px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground text-xs font-bold shadow-md"
        >
          Quay về Sảnh Đấu Trường
        </Link>
      </div>
    );
  }

  const currentQ = activeMatch.questions[activeMatch.currentQuestionIndex];
  const isAnswered = activeMatch.mySelectedAnswer !== null;

  const handleNext = () => {
    nextQuestion();
  };

  const handleReturnLobby = () => {
    resetMatch();
    router.push("/arena");
  };

  const handleRematch = () => {
    const mode = activeMatch.mode;
    resetMatch();
    startMatchmaking(mode);
    router.push("/arena");
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10 select-none">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        {/* 1. TOP 1V1 VS LIVE SCOREBOARD */}
        <div className="grid grid-cols-12 items-center p-4 sm:p-6 rounded-3xl bg-card border border-border shadow-xl relative overflow-hidden">
          {/* Background animated subtle glows */}
          <div className="absolute -top-16 -left-16 size-40 rounded-full bg-primary/15 blur-2xl pointer-events-none" />
          <div className="absolute -top-16 -right-16 size-40 rounded-full bg-rose-500/15 blur-2xl pointer-events-none" />

          {/* ME (Left 5 Cols) */}
          <div className="col-span-5 flex items-center gap-3 min-w-0">
            <img
              src={
                mounted && user?.avatarUrl
                  ? user.avatarUrl
                  : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              }
              alt="Me"
              className="size-11 sm:size-14 rounded-2xl object-cover border-2 border-primary shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xs sm:text-sm text-foreground truncate">
                  {mounted && user?.fullName ? user.fullName : "Bạn"}
                </span>
                {activeMatch.myCombo >= 2 && (
                  <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-500 font-black text-[10px] animate-pulse shrink-0">
                    🔥 x{activeMatch.myCombo}
                  </span>
                )}
              </div>
              <p className="text-base sm:text-2xl font-black text-primary">
                {activeMatch.myScore} <span className="text-xs font-semibold text-muted-foreground">pts</span>
              </p>
            </div>
          </div>

          {/* CENTER: Round & Timer (2 Cols) */}
          <div className="col-span-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10.5px] font-extrabold text-muted-foreground uppercase tracking-wider mb-1">
              Câu {activeMatch.currentQuestionIndex + 1}/{activeMatch.totalQuestions}
            </span>
            <div
              className={`size-11 sm:size-13 rounded-full flex items-center justify-center font-black text-base sm:text-lg border-3 transition-all ${
                timeLeft <= 3
                  ? "bg-rose-500 text-white border-rose-300 animate-ping"
                  : timeLeft <= 5
                  ? "bg-amber-500/20 text-amber-500 border-amber-500"
                  : "bg-primary/20 text-primary border-primary"
              }`}
            >
              {timeLeft}
            </div>
          </div>

          {/* OPPONENT (Right 5 Cols) */}
          <div className="col-span-5 flex items-center justify-end gap-3 min-w-0 text-right">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1.5">
                {activeMatch.opponentCombo >= 2 && (
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-500 font-black text-[10px] shrink-0">
                    🔥 x{activeMatch.opponentCombo}
                  </span>
                )}
                <span className="font-extrabold text-xs sm:text-sm text-foreground truncate">
                  {matchedOpponent?.name || "Đối Thủ"}
                </span>
              </div>
              <p className="text-base sm:text-2xl font-black text-rose-500">
                {activeMatch.opponentScore} <span className="text-xs font-semibold text-muted-foreground">pts</span>
              </p>
            </div>
            <img
              src={
                matchedOpponent?.avatar ||
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              }
              alt="Opponent"
              className="size-11 sm:size-14 rounded-2xl object-cover border-2 border-rose-500 shrink-0 shadow-md"
            />
          </div>
        </div>

        {/* 2. QUESTION BATTLEFIELD CARD */}
        <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl space-y-6">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-black uppercase tracking-wider text-[10px]">
                Câu Hỏi Trắc Nghiệm 1v1
              </span>
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Zap className="size-3.5 text-amber-400 fill-amber-400" />
                <span>Trả lời nhanh nhận thêm Speed Bonus (+80 pts)</span>
              </span>
            </div>

            <h2 className="text-base sm:text-xl font-extrabold text-foreground leading-snug">
              {currentQ.question}
            </h2>

            {currentQ.vietnameseMeaning && (
              <p className="text-xs text-muted-foreground font-medium italic">
                (Gợi ý nghĩa: {currentQ.vietnameseMeaning})
              </p>
            )}
          </div>

          {/* 4 Interactive Option Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, optIdx) => {
              const isSelected = activeMatch.mySelectedAnswer === optIdx;
              const isCorrect = optIdx === currentQ.correctIndex;

              let btnStyle = "bg-muted/40 border-border hover:bg-muted text-foreground hover:border-primary/40";
              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-md shadow-emerald-500/20";
                } else if (isSelected) {
                  btnStyle = "bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-md shadow-rose-500/20";
                } else {
                  btnStyle = "opacity-50 border-border bg-muted text-muted-foreground";
                }
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => submitAnswer(optIdx)}
                  className={`p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="size-6 rounded-lg bg-card text-foreground font-black text-xs flex items-center justify-center border border-border shadow-xs">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="font-semibold">{opt}</span>
                  </div>

                  {isAnswered && isCorrect && (
                    <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isCorrect && (
                    <XCircle className="size-5 text-rose-500 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Next Question Button */}
          {isAnswered && (
            <div className="space-y-4 pt-4 border-t border-border animate-in fade-in">
              <div className="p-4 rounded-2xl bg-muted/60 border border-border text-xs leading-relaxed space-y-1">
                <p className="font-bold text-foreground">
                  {activeMatch.isMyAnswerCorrect ? "🎉 Chính xác!" : "❌ Rất tiếc, chưa chính xác!"}
                </p>
                <p className="text-muted-foreground">{currentQ.explanation}</p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 transition-all hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer"
                >
                  <span>
                    {activeMatch.currentQuestionIndex >= activeMatch.totalQuestions - 1
                      ? "Xem Kết Quả Trận Đấu"
                      : "Câu Tiếp Theo"}
                  </span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. VICTORY / DEFEAT POST-MATCH MODAL */}
        {activeMatch.isFinished && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in zoom-in-95 select-none">
            <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-8 text-center space-y-6 overflow-hidden">
              {/* Header Banner */}
              <div className="space-y-2">
                <div className="size-20 rounded-full mx-auto flex items-center justify-center shadow-xl">
                  {activeMatch.result === "WIN" ? (
                    <div className="size-20 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-amber-400/40 shadow-2xl animate-bounce">
                      <Trophy className="size-10" />
                    </div>
                  ) : activeMatch.result === "DRAW" ? (
                    <div className="size-20 rounded-full bg-purple-500 text-white flex items-center justify-center shadow-2xl">
                      <Swords className="size-10" />
                    </div>
                  ) : (
                    <div className="size-20 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-rose-500/40 shadow-2xl">
                      <XCircle className="size-10" />
                    </div>
                  )}
                </div>

                <h2
                  className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${
                    activeMatch.result === "WIN"
                      ? "text-amber-500"
                      : activeMatch.result === "DRAW"
                      ? "text-purple-500"
                      : "text-rose-500"
                  }`}
                >
                  {activeMatch.result === "WIN"
                    ? "CHIẾN THẮNG TUYỆT ĐỐI! 🏆"
                    : activeMatch.result === "DRAW"
                    ? "TRẬN ĐẤU HÒA ĐIỂM!"
                    : "THẤT BẠI TIẾC NUỐI 💀"}
                </h2>

                <p className="text-xs text-muted-foreground">
                  {activeMatch.result === "WIN"
                    ? "Bạn đã xuất sắc vượt qua đối thủ với điểm số cao hơn!"
                    : "Hãy rèn luyện thêm từ vựng để phục thù ở trận tiếp theo!"}
                </p>
              </div>

              {/* Score & Rewards Box */}
              <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                <div className="space-y-1">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Điểm Số
                  </span>
                  <p className="text-base sm:text-lg font-black text-foreground">
                    {activeMatch.myScore} : {activeMatch.opponentScore}
                  </p>
                </div>

                <div className="space-y-1 border-x border-border">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Biến Động ELO
                  </span>
                  <p
                    className={`text-base sm:text-lg font-black ${
                      activeMatch.eloDelta > 0
                        ? "text-emerald-500"
                        : activeMatch.eloDelta < 0
                        ? "text-rose-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {activeMatch.eloDelta > 0 ? `+${activeMatch.eloDelta}` : activeMatch.eloDelta}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10.5px] text-muted-foreground font-bold block">
                    Kinh Nghiệm XP
                  </span>
                  <p className="text-base sm:text-lg font-black text-amber-500">
                    +{activeMatch.xpEarned} XP
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRematch}
                  className="w-full sm:w-auto flex-1 py-3 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                >
                  Tìm Trận Tiếp Theo
                </button>

                <button
                  type="button"
                  onClick={handleReturnLobby}
                  className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold border border-border transition-colors cursor-pointer"
                >
                  Về Sảnh Đấu Trường
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
