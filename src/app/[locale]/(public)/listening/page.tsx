"use client";

import {
  AudioListeningStudio,
  YoutubeDictationStudio,
  YoutubeImportBar,
  YoutubeTopBar,
  YoutubeTranscriptSidebar,
  YoutubeVideoCatalog,
  YoutubeVideoPlayer,
} from "@/components/listening";
import { useTopicsQuery } from "@/hooks/queries/useQuestionQueries";
import { mapGroupToYoutubeVideo } from "@/lib/skill-mappers";
import { extractYoutubeId } from "@/lib/youtube";
import { questionService } from "@/services/question.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { YoutubeVideoItem } from "@/types/listening-youtube";
import { Headphones, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function ListeningPage() {
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const { data: topics = [], isLoading: topicsLoading } = useTopicsQuery();
  const [videos, setVideos] = useState<YoutubeVideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopicId, setSelectedTopicId] = useState("ALL");
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideoItem | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [completedSentenceIds, setCompletedSentenceIds] = useState<string[]>([]);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seekTarget, setSeekTarget] = useState<{ sec: number; ts: number } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await questionService.paginationGroups(0, 60, {
          hasAudio: true,
          topicId: selectedTopicId !== "ALL" ? selectedTopicId : undefined,
        });
        if (mounted) setVideos((res.data || []).map(mapGroupToYoutubeVideo));
      } catch {
        if (mounted) setVideos([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedTopicId]);

  const openVideo = async (video: YoutubeVideoItem) => {
    try {
      const detail = await questionService.getGroup(video.id);
      const mapped = mapGroupToYoutubeVideo(detail);
      if (isAuthenticated) {
        await questionService.startGroupSession(video.id).catch(() => null);
      }
      setSelectedVideo(mapped);
      setCurrentSentenceIndex(0);
      setCompletedSentenceIds([]);
      setIsPlaying(false);
    } catch (err: any) {
      addToast(err?.message || "Không mở được bài nghe", "error");
    }
  };

  const handleAnalyzeUrl = (url: string) => {
    const ytId = extractYoutubeId(url);
    if (!ytId) {
      addToast("URL YouTube không hợp lệ.", "error");
      return;
    }
    setIsAnalyzing(true);
    const existing = videos.find((v) => v.youtubeId === ytId);
    if (existing) {
      openVideo(existing);
      addToast("Đã tải video luyện nghe thành công!", "success");
    } else {
      addToast("Chưa có bài luyện nghe cho video này trong catalog.", "info");
    }
    setIsAnalyzing(false);
  };

  const currentSentence =
    selectedVideo?.sentences?.[currentSentenceIndex] || selectedVideo?.sentences?.[0];

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      {selectedVideo ? (
        selectedVideo.youtubeId && currentSentence ? (
          <div className="space-y-5">
            <YoutubeTopBar
              video={selectedVideo}
              isCinemaMode={isCinemaMode}
              onToggleCinemaMode={() => setIsCinemaMode(!isCinemaMode)}
              completedCount={completedSentenceIds.length}
              totalSentences={selectedVideo.sentences.length}
              onBackToCatalog={() => {
                setSelectedVideo(null);
                setIsPlaying(false);
              }}
            />

            {/* BỐ CỤC 2 CỘT HIỆN ĐẠI: CỘT CHÍNH (VIDEO TO + DICTATION STUDIO) & CỘT PHỤ (PHỤ ĐỀ) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 xl:gap-6 items-start">
              {/* 1. CỘT CHÍNH: VIDEO PLAYER TO RÕ Ở TRÊN, Ô GÕ DICTATION Ở DƯỚI */}
              <div
                className={`${
                  isCinemaMode ? "lg:col-span-12" : "lg:col-span-7 xl:col-span-8"
                } min-w-0 space-y-5 transition-all duration-300`}
              >
                <YoutubeVideoPlayer
                  video={selectedVideo}
                  currentSentence={currentSentence}
                  currentIndex={currentSentenceIndex}
                  totalSentences={selectedVideo.sentences.length}
                  isPlaying={isPlaying}
                  seekTarget={seekTarget}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onReplay={() => {
                    setIsPlaying(true);
                    setSeekTarget({ sec: currentSentence.startSec, ts: Date.now() });
                    addToast(`Phát lại câu #${currentSentenceIndex + 1}`, "info");
                  }}
                  onTimeUpdate={(currentTime) => {
                    if (!selectedVideo?.sentences?.length) return;
                    const foundIdx = selectedVideo.sentences.findIndex(
                      (s) =>
                        currentTime >= s.startSec &&
                        currentTime < (s.endSec || s.startSec + 3)
                    );
                    if (foundIdx !== -1 && foundIdx !== currentSentenceIndex) {
                      setCurrentSentenceIndex(foundIdx);
                    }
                  }}
                />

                <YoutubeDictationStudio
                  key={currentSentence.id}
                  sentence={currentSentence}
                  currentIndex={currentSentenceIndex}
                  totalSentences={selectedVideo.sentences.length}
                  isPlaying={isPlaying}
                  onPlayToggle={() => setIsPlaying(!isPlaying)}
                  onReplay={() => {
                    setIsPlaying(true);
                    setSeekTarget({ sec: currentSentence.startSec, ts: Date.now() });
                    addToast(`Phát lại câu #${currentSentenceIndex + 1}`, "info");
                  }}
                  onPrevious={() => {
                    if (currentSentenceIndex > 0) {
                      const prevIdx = currentSentenceIndex - 1;
                      setCurrentSentenceIndex(prevIdx);
                      setIsPlaying(true);
                      setSeekTarget({
                        sec: selectedVideo.sentences[prevIdx]?.startSec ?? 0,
                        ts: Date.now(),
                      });
                    }
                  }}
                  onNext={() => {
                    if (currentSentenceIndex + 1 < selectedVideo.sentences.length) {
                      const nextIdx = currentSentenceIndex + 1;
                      setCurrentSentenceIndex(nextIdx);
                      setIsPlaying(true);
                      setSeekTarget({
                        sec: selectedVideo.sentences[nextIdx]?.startSec ?? 0,
                        ts: Date.now(),
                      });
                    } else {
                      addToast("Bạn đã hoàn thành các câu trong video này.", "success");
                    }
                  }}
                  onSentenceCompleted={(sentenceId) => {
                    setCompletedSentenceIds((prev) =>
                      prev.includes(sentenceId) ? prev : [...prev, sentenceId]
                    );
                  }}
                />
              </div>

              {/* 2. CỘT PHỤ: BẢN CHÉP PHỤ ĐỀ STICKY */}
              {!isCinemaMode && (
                <div className="lg:col-span-5 xl:col-span-4 min-w-0 sticky top-24">
                  <YoutubeTranscriptSidebar
                    sentences={selectedVideo.sentences}
                    currentIndex={currentSentenceIndex}
                    completedSentenceIds={completedSentenceIds}
                    onSelectSentence={(idx) => {
                      setCurrentSentenceIndex(idx);
                      setIsPlaying(true);
                      setSeekTarget({
                        sec: selectedVideo.sentences[idx]?.startSec ?? 0,
                        ts: Date.now(),
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <AudioListeningStudio
            video={selectedVideo}
            onBackToCatalog={() => {
              setSelectedVideo(null);
              setIsPlaying(false);
            }}
          />
        )
      ) : (
        <div className="space-y-6">
          {/* COMPACT SLEEK BANNER */}
          <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-slate-950 via-[#27102e] to-slate-950 text-white p-5 sm:p-7 border border-slate-800 shadow-md">
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[11px] font-bold uppercase tracking-wider text-purple-200">
                  <Sparkles className="size-3 text-amber-400" />
                  <span>Phòng Luyện Nghe Toàn Diện</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-snug">
                  Luyện Nghe Tiếng Anh{" "}
                  <span className="bg-linear-to-r from-purple-300 via-pink-200 to-amber-200 bg-clip-text text-transparent">
                    Video &amp; Audio Đề Thi
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                  Luyện nghe chép chính tả qua Video YouTube tương tác và luyện giải đề nghe chuẩn hóa (VSTEP, TOEIC, IELTS) có giải thích chi tiết.
                </p>
              </div>

              {/* Quick stats on md+ */}
              <div className="hidden sm:flex items-center gap-2.5 shrink-0 self-start md:self-center">
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
                  <div className="text-base font-black text-purple-300">{videos.length}</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bài nghe</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
                  <div className="text-base font-black text-rose-300">YouTube</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Chính tả</div>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs text-center space-y-0.5">
                  <div className="text-base font-black text-emerald-300">Audio</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Đề thi</div>
                </div>
              </div>
            </div>
          </div>

          <YoutubeImportBar onAnalyzeUrl={handleAnalyzeUrl} isLoading={isAnalyzing} />

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <YoutubeVideoCatalog
              videos={videos}
              topics={topics}
              selectedTopicId={selectedTopicId}
              topicsLoading={topicsLoading}
              onSelectTopic={setSelectedTopicId}
              onSelectVideo={openVideo}
            />
          )}
        </div>
      )}
    </div>
  );
}
