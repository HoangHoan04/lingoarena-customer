"use client";

import type { YoutubeVideoItem } from "@/types/listening-youtube";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Headphones,
  HelpCircle,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AudioListeningStudioProps {
  video: YoutubeVideoItem;
  onBackToCatalog: () => void;
}

export function AudioListeningStudio({
  video,
  onBackToCatalog,
}: AudioListeningStudioProps) {
  // Audio playback state
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  // Questions and grading state
  const questions = video.questions || [];
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => null);
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && audioRef.current.duration) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (newTime: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skipSeconds = (seconds: number) => {
    if (audioRef.current) {
      const nextTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
      audioRef.current.currentTime = nextTime;
      setCurrentTime(nextTime);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const formatSec = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Grade calculation
  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      const selected = userAnswers[q.id];
      const correctOption = (q.options || []).find((o: any) => o.isCorrect);
      if (selected && correctOption && selected === correctOption.optionKey) {
        correct += 1;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    };
  };

  const score = calculateScore();

  return (
    <div className="space-y-6">
      {/* Hidden Audio Tag */}
      {video.audioUrl && (
        <audio
          ref={audioRef}
          src={video.audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToCatalog}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300">
                Audio Đề Thi
              </span>
              {video.examType?.name && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {video.examType.name}
                </span>
              )}
              {video.difficulty && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {video.difficulty}
                </span>
              )}
            </div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-1">
              {video.title}
            </h1>
          </div>
        </div>

        {/* Practice Timer */}
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3.5 py-1.5 rounded-xl self-end sm:self-auto">
          <Clock className="size-4 text-purple-600" />
          <span>Thời gian làm: {formatSec(elapsedSec)}</span>
        </div>
      </div>

      {/* Main Content: 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: AUDIO PLAYER & STIMULUS */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs p-6 space-y-6">
            {/* Visual Header / Cover */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-linear-to-br from-purple-950 via-slate-900 to-indigo-950 flex flex-col items-center justify-center text-center p-6 text-white shadow-inner">
              {video.thumbnailUrl && (
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative z-10 space-y-2">
                <div className="inline-flex p-3 rounded-full bg-purple-600/30 border border-purple-400/30 text-purple-300">
                  <Headphones className="size-8 animate-pulse" />
                </div>
                <h3 className="font-bold text-sm sm:text-base line-clamp-2 px-4">
                  {video.title}
                </h3>
                <p className="text-xs text-purple-200/80">
                  {video.channel || "Đề thi chuẩn hóa"}
                </p>
              </div>
            </div>

            {/* Audio Progress Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-800 accent-purple-600 cursor-pointer"
              />
              <div className="flex justify-between text-xs font-semibold text-slate-400">
                <span>{formatSec(currentTime)}</span>
                <span>{formatSec(duration)}</span>
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => skipSeconds(-5)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                title="Tua lùi 5 giây"
              >
                <RotateCcw className="size-4" />
              </button>

              <button
                type="button"
                onClick={togglePlay}
                className="p-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? <Pause className="size-6" /> : <Play className="size-6 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={() => skipSeconds(5)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                title="Tua tới 5 giây"
              >
                <RotateCcw className="size-4 scale-x-[-1]" />
              </button>
            </div>

            {/* Speed & Audio Helpers */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 font-bold">Tốc độ:</span>
                {[0.75, 1, 1.25].map((speed) => (
                  <button
                    key={speed}
                    type="button"
                    onClick={() => handleSpeedChange(speed)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      playbackRate === speed
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.muted = !isMuted;
                    setIsMuted(!isMuted);
                  }
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
              </button>
            </div>

            {/* Transcript Accordion */}
            {video.description && (
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTranscript(!showTranscript)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="size-4 text-purple-600" />
                    Bản chép lời & Hướng dẫn làm bài
                  </span>
                  {showTranscript ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </button>
                {showTranscript && (
                  <div className="p-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                    {video.description}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: QUESTIONS LIST & GRADING */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result Banner if submitted */}
          {isSubmitted && (
            <div className={`p-5 rounded-3xl border shadow-sm ${
              score.percentage >= 80
                ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900 text-emerald-900 dark:text-emerald-100"
                : "bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900 text-amber-900 dark:text-amber-100"
            }`}>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-5 text-amber-500" />
                    <h3 className="font-black text-base">
                      {score.percentage >= 80 ? "Xuất sắc! Bạn đã làm rất tốt!" : "Đã hoàn thành bài nghe!"}
                    </h3>
                  </div>
                  <p className="text-xs">
                    Số câu đúng: <span className="font-black text-sm">{score.correct}/{score.total}</span> ({score.percentage}%)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <RotateCcw className="size-3.5 inline mr-1.5" />
                  Làm lại
                </button>
              </div>
            </div>
          )}

          {/* Question List Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="size-5 text-purple-600" />
              <span>Danh sách câu hỏi ({questions.length})</span>
            </h2>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-10 text-center text-slate-500">
              Bài nghe này chưa có câu hỏi trắc nghiệm đính kèm.
            </div>
          ) : (
            <div className="space-y-5">
              {questions.map((q, qIndex) => {
                const selectedKey = userAnswers[q.id];
                const correctOption = (q.options || []).find((o: any) => o.isCorrect);
                const isCorrect = isSubmitted && selectedKey === correctOption?.optionKey;
                const isWrong = isSubmitted && selectedKey && selectedKey !== correctOption?.optionKey;

                return (
                  <div
                    key={q.id}
                    className={`rounded-3xl border transition-all p-5 sm:p-6 space-y-4 ${
                      isSubmitted
                        ? isCorrect
                          ? "border-emerald-300 bg-emerald-50/30 dark:border-emerald-900/60 dark:bg-emerald-950/20"
                          : "border-rose-300 bg-rose-50/30 dark:border-rose-900/60 dark:bg-rose-950/20"
                        : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <span className="flex items-center justify-center size-7 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-xs font-black shrink-0 mt-0.5">
                          {qIndex + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-relaxed">
                            {q.prompt}
                          </p>
                          {q.instructions && (
                            <p className="text-xs text-slate-500 italic">
                              {q.instructions}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSubmitted && (
                        <div className="shrink-0">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                              <CheckCircle2 className="size-3.5" /> Đúng
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-black text-rose-600 bg-rose-100 dark:bg-rose-950 px-2.5 py-1 rounded-full">
                              <XCircle className="size-3.5" /> Sai
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {(q.options || []).map((opt: any) => {
                        const isOptionSelected = selectedKey === opt.optionKey;
                        const isThisOptionCorrect = opt.isCorrect;

                        let optionStyle =
                          "border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 hover:border-purple-300 dark:hover:border-purple-800 text-slate-700 dark:text-slate-300";

                        if (isSubmitted) {
                          if (isThisOptionCorrect) {
                            optionStyle =
                              "border-emerald-500 bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20";
                          } else if (isOptionSelected && !isThisOptionCorrect) {
                            optionStyle =
                              "border-rose-500 bg-rose-100/70 dark:bg-rose-950/70 text-rose-900 dark:text-rose-200 font-semibold";
                          }
                        } else if (isOptionSelected) {
                          optionStyle =
                            "border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-200 font-bold ring-2 ring-purple-600/20";
                        }

                        return (
                          <button
                            key={opt.id || opt.optionKey}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => {
                              setUserAnswers((prev) => ({
                                ...prev,
                                [q.id]: opt.optionKey,
                              }));
                            }}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${optionStyle} ${
                              isSubmitted ? "cursor-default" : ""
                            }`}
                          >
                            <span
                              className={`flex items-center justify-center size-6 rounded-lg text-xs font-black shrink-0 ${
                                isOptionSelected
                                  ? "bg-purple-600 text-white"
                                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {opt.optionKey}
                            </span>
                            <span className="flex-1 leading-snug">{opt.content}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isSubmitted && (q.explanation || q.explanationEn) && (
                      <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-xs space-y-1">
                        <p className="font-black text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-amber-500" />
                          Giải thích đáp án:
                        </p>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {q.explanation || q.explanationEn}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Button */}
              {!isSubmitted && (
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(true)}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-black shadow-lg shadow-purple-600/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
                  >
                    Nộp bài & Chấm điểm
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
