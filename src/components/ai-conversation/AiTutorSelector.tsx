"use client";

import type { AiTutorPersona } from "@/types/ai-conversation";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Globe2,
  Mic,
  PhoneCall,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useState } from "react";

import DuolingoAnimeCharacter from "./DuolingoAnimeCharacter";

interface AiTutorSelectorProps {
  personas: AiTutorPersona[];
  selectedPersona: AiTutorPersona;
  onSelectPersona: (persona: AiTutorPersona) => void;
  onStartCall: (persona: AiTutorPersona) => void;
}

export default function AiTutorSelector({
  personas,
  selectedPersona,
  onSelectPersona,
  onStartCall,
}: AiTutorSelectorProps) {
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const handlePreviewVoice = (e: React.MouseEvent, persona: AiTutorPersona) => {
    e.stopPropagation();

    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (playingVoiceId === persona.id) {
      window.speechSynthesis.cancel();
      setPlayingVoiceId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(persona.welcomeMessage);
    utterance.lang = persona.voiceLang;
    utterance.rate = persona.speechRate;
    utterance.pitch = persona.speechPitch;

    utterance.onstart = () => setPlayingVoiceId(persona.id);
    utterance.onend = () => setPlayingVoiceId(null);
    utterance.onerror = () => setPlayingVoiceId(null);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. HERO HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles className="size-3.5 text-amber-500" />
          <span>Gia Sư Anime 1v1 Đồ Họa Chuyển Động Duolingo</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Chọn Bạn Đồng Hành Anime{" "}
          <span className="bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-sky-300 dark:to-purple-300 bg-clip-text text-transparent">
            Nói Chuyện Trực Tiếp
          </span>
        </h1>

        <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Mỗi nhân vật là một animation anime sống động với nhịp thở, mắt chớp tự nhiên và khẩu hình môi chuyển động theo lời nói. Tương tác giọng nói 2 chiều siêu mượt mà!
        </p>
      </div>

      {/* 2. PERSONA CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => {
          const isSelected = selectedPersona.id === persona.id;
          const isPlayingVoice = playingVoiceId === persona.id;

          const accentFlag =
            persona.accent === "US" ? "🇺🇸" : persona.accent === "UK" ? "🇬🇧" : "🇦🇺";

          return (
            <div
              key={persona.id}
              onClick={() => onSelectPersona(persona)}
              className={`group relative rounded-3xl border-2 transition-all duration-300 p-6 flex flex-col justify-between space-y-4 cursor-pointer bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-md hover:shadow-2xl overflow-hidden ${
                isSelected
                  ? "border-blue-600 dark:border-blue-500 ring-4 ring-blue-500/15"
                  : "border-slate-200/80 dark:border-slate-800 hover:border-blue-400/50"
              }`}
            >
              {/* TOP HEADER: BADGE & PREVIEW VOICE BUTTON */}
              <div className="flex items-center justify-between gap-3 relative z-10">
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-black flex items-center gap-1.5">
                  <span>{accentFlag}</span>
                  <span>{persona.accentLabel.split("(")[0]}</span>
                </span>

                <button
                  type="button"
                  onClick={(e) => handlePreviewVoice(e, persona)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                    isPlayingVoice
                      ? "bg-amber-500 text-slate-950 animate-pulse font-black"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700"
                  }`}
                  title="Nghe thử giọng"
                >
                  {isPlayingVoice ? (
                    <>
                      <VolumeX className="size-3.5" />
                      <span>Dừng</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="size-3.5 text-blue-600 dark:text-blue-400" />
                      <span>Nghe thử</span>
                    </>
                  )}
                </button>
              </div>

              {/* CENTER: ANIMATED ANIME CHARACTER DISPLAY */}
              <div className="py-1 flex justify-center">
                <DuolingoAnimeCharacter
                  characterId={persona.animeId || "yuki-sarah"}
                  status={isPlayingVoice ? "speaking" : isSelected ? "listening" : "idle"}
                  className="scale-85 origin-center"
                />
              </div>

              <div className="space-y-3">
                {/* NAME & ACCENT */}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {persona.name}
                    </h3>
                  </div>

                  <p className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                    {persona.title}
                  </p>
                </div>

                {/* TAGLINE QUOTE */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 text-xs italic text-slate-600 dark:text-slate-300 leading-relaxed font-serif">
                  "{persona.tagline}"
                </div>

                {/* SPECIALTIES TAGS */}
                <div className="flex flex-wrap gap-1.5">
                  {persona.topics.map((top, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] font-bold"
                    >
                      {top}
                    </span>
                  ))}
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartCall(persona);
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-blue-600/30 hover:scale-102 active:scale-98"
                      : "bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <PhoneCall className="size-4" />
                  <span>Nói Chuyện Với {persona.name.split(" ")[0]}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
