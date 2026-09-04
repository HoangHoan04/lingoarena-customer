"use client";

import type { YoutubeSentence, YoutubeVideoItem } from "@/types/listening-youtube";
import { Clock, Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface YoutubeVideoPlayerProps {
  video: YoutubeVideoItem;
  currentSentence: YoutubeSentence;
  currentIndex?: number;
  totalSentences?: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPause?: () => void;
  onReplay: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  seekTarget?: { sec: number; ts: number } | null;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function YoutubeVideoPlayer({
  video,
  currentSentence,
  currentIndex,
  totalSentences,
  isPlaying,
  onPlay,
  onPause,
  onReplay,
  onTimeUpdate,
  seekTarget,
}: YoutubeVideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  // 1. Initialize YouTube Player using official IFrame API
  useEffect(() => {
    setIsReady(false);
    let checkInterval: NodeJS.Timeout | null = null;

    const createPlayer = () => {
      if (!playerDivRef.current || !window.YT?.Player) return;
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {}
      }

      try {
        const playerInstance = new window.YT.Player(playerDivRef.current, {
          videoId: video.youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
          },
          events: {
            onReady: (event: any) => {
              playerRef.current = event.target || playerInstance;
              setIsReady(true);
            },
            onStateChange: (e: any) => {
              if (e.data === 1) {
                onPlay();
              } else if (e.data === 2 || e.data === 0) {
                onPause?.();
              }
            },
          },
        });
        playerRef.current = playerInstance;
      } catch (err) {
        console.error("Failed to initialize YT.Player:", err);
      }
    };

    if (!window.YT) {
      const existingScript = document.getElementById("youtube-iframe-api");
      if (!existingScript) {
        const tag = document.createElement("script");
        tag.id = "youtube-iframe-api";
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prevCallback?.();
        createPlayer();
      };
      checkInterval = setInterval(() => {
        if (window.YT?.Player) {
          clearInterval(checkInterval!);
          createPlayer();
        }
      }, 200);
    } else if (window.YT.Player) {
      createPlayer();
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      try {
        playerRef.current?.destroy();
      } catch {}
    };
  }, [video.youtubeId]);

  // 2. High-precision 100ms time tracking & GUARANTEED auto-pause at sentence endSec
  useEffect(() => {
    const timer = setInterval(() => {
      const player = playerRef.current;
      if (
        player &&
        typeof player.getCurrentTime === "function" &&
        typeof player.getPlayerState === "function"
      ) {
        const state = player.getPlayerState();
        if (state === 1) { // 1 = PLAYING
          const currentTime = player.getCurrentTime();
          onTimeUpdate?.(currentTime);

          // Auto-pause immediately when sentence endSec is reached so user can type!
          if (
            currentSentence.endSec &&
            currentSentence.endSec > currentSentence.startSec &&
            currentTime >= currentSentence.endSec
          ) {
            if (typeof player.pauseVideo === "function") {
              player.pauseVideo();
            }
            onPause?.();
          }
        }
      }
    }, 100);

    return () => clearInterval(timer);
  }, [currentSentence.endSec, currentSentence.startSec, onPause, onTimeUpdate]);

  // 3. Manual seek when user clicks Replay, Selects a Sentence, or clicks Next/Previous
  useEffect(() => {
    const player = playerRef.current;
    if (seekTarget && player && typeof player.seekTo === "function") {
      player.seekTo(seekTarget.sec, true);
      if (typeof player.playVideo === "function") {
        player.playVideo();
      }
    }
  }, [seekTarget]);

  const handlePlayToggle = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      if (typeof player.pauseVideo === "function") {
        player.pauseVideo();
      }
      onPause?.();
    } else {
      if (typeof player.seekTo === "function") {
        player.seekTo(currentSentence.startSec, true);
      }
      if (typeof player.playVideo === "function") {
        player.playVideo();
      }
      onPlay();
    }
  };

  const handleReplay = () => {
    const player = playerRef.current;
    if (player && typeof player.seekTo === "function") {
      player.seekTo(currentSentence.startSec, true);
    }
    if (player && typeof player.playVideo === "function") {
      player.playVideo();
    }
    onPlay();
    onReplay();
  };

  const sentenceDuration = Math.max(0, (currentSentence.endSec || 0) - (currentSentence.startSec || 0));

  return (
    <div className="relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Ambient background glow when playing */}
      <div
        className={`absolute -inset-1 rounded-3xl bg-linear-to-r from-rose-600/20 via-purple-600/15 to-blue-600/20 blur-xl transition-opacity duration-700 pointer-events-none -z-10 ${
          isPlaying ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* VIDEO EMBED CONTAINER - 16:9 HIGH RESOLUTION FRAME */}
      <div className="relative w-full rounded-2xl overflow-hidden bg-black aspect-video shadow-lg border border-slate-800/80">
        <div
          ref={playerDivRef}
          className="absolute inset-0 w-full h-full [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0"
        />
      </div>

      {/* VIDEO INFO & SENTENCE TIMELINE BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800">
        {/* Left: Current Sentence info badge */}
        <div className="flex flex-wrap items-center gap-2">
          {currentIndex !== undefined && totalSentences !== undefined && (
            <span className="px-2.5 py-1 rounded-xl bg-rose-600 text-white text-xs font-black shadow-xs">
              Câu #{currentIndex + 1} / {totalSentences}
            </span>
          )}

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
            <Clock className="size-3 text-rose-500" />
            <span>
              {formatDuration(currentSentence.startSec)} → {formatDuration(currentSentence.endSec)}
            </span>
            {sentenceDuration > 0 && (
              <span className="text-[10px] text-slate-400 font-sans">
                ({sentenceDuration.toFixed(1)}s)
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-black uppercase">
            {video.difficulty}
          </span>
        </div>

        {/* Right: Quick media buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReplay}
            disabled={!isReady}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer active:scale-98 ${
              !isReady ? "opacity-60 cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <RotateCcw className="size-3.5 text-rose-600" />
            <span>Phát lại</span>
          </button>

          <button
            type="button"
            onClick={handlePlayToggle}
            disabled={!isReady}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md shadow-rose-600/20 transition-all cursor-pointer active:scale-98 ${
              !isReady ? "opacity-60 cursor-not-allowed" : "hover:scale-102"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="size-3.5 fill-current" />
                <span>Tạm dừng</span>
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                <span>{isReady ? "Phát câu này" : "Đang tải video..."}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
