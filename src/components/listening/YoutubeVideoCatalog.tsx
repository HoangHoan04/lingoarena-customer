"use client";

import { TopicFilterBar } from "@/components/common/TopicFilterBar";
import type { YoutubeVideoItem } from "@/types/listening-youtube";
import type { QuestionLookup } from "@/types/question";
import { Headphones, Play, Sparkles, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { YoutubeIcon } from "./YoutubeIcon";

interface YoutubeVideoCatalogProps {
  videos: YoutubeVideoItem[];
  topics: QuestionLookup[];
  selectedTopicId: string;
  topicsLoading?: boolean;
  onSelectTopic: (topicId: string) => void;
  onSelectVideo: (video: YoutubeVideoItem) => void;
}

export function YoutubeVideoCatalog({
  videos,
  topics,
  selectedTopicId,
  topicsLoading = false,
  onSelectTopic,
  onSelectVideo,
}: YoutubeVideoCatalogProps) {
  const [mediaFilter, setMediaFilter] = useState<"ALL" | "youtube" | "audio">("ALL");

  const filteredVideos = useMemo(() => {
    if (mediaFilter === "ALL") return videos;
    return videos.filter((v) => v.mediaType === mediaFilter);
  }, [videos, mediaFilter]);

  const youtubeCount = videos.filter((v) => v.mediaType === "youtube").length;
  const audioCount = videos.filter((v) => v.mediaType === "audio").length;

  return (
    <div className="space-y-6">
      {/* Media Type Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-850 w-fit">
        <button
          type="button"
          onClick={() => setMediaFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mediaFilter === "ALL"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          Tất cả bài nghe ({videos.length})
        </button>
        <button
          type="button"
          onClick={() => setMediaFilter("youtube")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mediaFilter === "youtube"
              ? "bg-rose-600 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <YoutubeIcon className="size-3.5" />
          <span>Video YouTube ({youtubeCount})</span>
        </button>
        <button
          type="button"
          onClick={() => setMediaFilter("audio")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            mediaFilter === "audio"
              ? "bg-purple-600 text-white shadow-xs"
              : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Headphones className="size-3.5" />
          <span>Audio Đề thi ({audioCount})</span>
        </button>
      </div>

      <TopicFilterBar
        topics={topics}
        selectedId={selectedTopicId}
        onSelect={onSelectTopic}
        accent="rose"
        loading={topicsLoading}
        title="Chọn chủ đề nghe"
        hint="Bài luyện nghe được gắn chủ đề. Chọn chủ đề để luyện từ vựng và ngữ cảnh phù hợp."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVideos.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2">
            <Play className="size-10 mx-auto text-slate-400" />
            <h3 className="font-black">Chưa có bài luyện nghe phù hợp</h3>
            <p className="text-sm text-slate-500">
              {selectedTopicId !== "ALL"
                ? "Chủ đề này chưa có bài nghe đã xuất bản."
                : "Catalog trống cho đến khi quản trị viên xuất bản nhóm bài nghe."}
            </p>
          </div>
        ) : null}
        {filteredVideos.map((v) => {
          const isAudio = v.mediaType === "audio";
          const mins = Math.floor(v.durationSec / 60);
          const secs = v.durationSec % 60;
          const durationStr = `${mins}:${secs.toString().padStart(2, "0")}`;

          return (
            <div
              key={v.id}
              onClick={() => onSelectVideo(v)}
              className="group rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-2xs hover:shadow-xl hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3.5">
                <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
                  {v.thumbnailUrl ? (
                    <img
                      src={v.thumbnailUrl}
                      alt={v.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-purple-900 to-indigo-950 flex items-center justify-center">
                      <Headphones className="size-12 text-purple-300/60" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className={`size-12 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                      isAudio ? "bg-purple-600 shadow-purple-600/30" : "bg-rose-600 shadow-rose-600/30"
                    }`}>
                      <Play className="size-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {v.durationSec > 0 && (
                    <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                      {durationStr}
                    </span>
                  )}

                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {isAudio ? (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-xs">
                        <Headphones className="size-3" /> Audio Đề thi
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase flex items-center gap-1 shadow-xs">
                        <YoutubeIcon className="size-3" /> YouTube
                      </span>
                    )}
                    {v.difficulty && (
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-black uppercase">
                        {v.difficulty}
                      </span>
                    )}
                  </div>
                </div>

                <div className="px-5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 gap-2">
                    <span className="font-bold truncate max-w-[160px]">{v.channel}</span>
                    {isAudio ? (
                      <span className="text-purple-600 dark:text-purple-400 font-bold">
                        {v.questionsCount || (v.questions || []).length || 0} câu trắc nghiệm
                      </span>
                    ) : (
                      <span>{v.sentences.length} câu chép</span>
                    )}
                  </div>

                  {v.topic ? (
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 text-[10px] font-black uppercase">
                      {v.topic}
                    </span>
                  ) : null}

                  <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-snug">
                    {v.title}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {v.description}
                  </p>
                </div>
              </div>

              <div className={`p-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold ${
                isAudio ? "text-purple-600 dark:text-purple-400" : "text-rose-600 dark:text-rose-400"
              }`}>
                <span className="flex items-center gap-1">
                  {isAudio ? <Headphones className="size-3.5" /> : <YoutubeIcon className="size-3.5" />}
                  {isAudio ? "Luyện nghe & Trả lời câu hỏi" : "Luyện nghe video này"}
                </span>
                <Play className="size-3.5 fill-current" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
