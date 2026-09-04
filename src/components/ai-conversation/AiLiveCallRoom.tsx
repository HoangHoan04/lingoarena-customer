"use client";

import type {
  AiConversationMessage,
  AiStatusState,
  AiTutorPersona,
  ViewMode,
} from "@/types/ai-conversation";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  CheckCircle2,
  Copy,
  HelpCircle,
  Languages,
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  PhoneOff,
  Radio,
  RefreshCw,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Zap,
} from "lucide-react";
import DuolingoAnimeCharacter from "./DuolingoAnimeCharacter";
import React, { useEffect, useRef, useState } from "react";

interface AiLiveCallRoomProps {
  persona: AiTutorPersona;
  messages: AiConversationMessage[];
  onSendMessage: (text: string) => void;
  onEndCall: () => void;
  status: AiStatusState;
  onReplayAudio: (text: string) => void;
}

export default function AiLiveCallRoom({
  persona,
  messages,
  onSendMessage,
  onEndCall,
  status,
  onReplayAudio,
}: AiLiveCallRoomProps) {
  const { addToast } = useToastStore();

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showViTranslation, setShowViTranslation] = useState(true);
  const [callDurationSeconds, setCallDurationSeconds] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>("split");

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Call timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDurationSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format call duration
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Auto scroll chat in split mode
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Request user camera stream for PiP view
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOn && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          // Camera permission denied or not available, gracefully fallback
          setIsCameraOn(false);
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  // Web Speech Recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsRecording(true);
          setTranscript("");
        };

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          if (event.error !== "no-speech") {
            addToast("Không thể nhận diện giọng nói: " + event.error, "warning");
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [addToast]);

  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording and send if transcript is not empty
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      if (transcript.trim()) {
        onSendMessage(transcript.trim());
        setTranscript("");
      }
    } else {
      if (!recognitionRef.current) {
        addToast(
          "Trình duyệt chưa cấp quyền nhận diện giọng nói. Bạn có thể gõ câu hỏi vào ô bên dưới!",
          "info",
        );
        return;
      }
      try {
        recognitionRef.current.start();
      } catch {
        recognitionRef.current.stop();
      }
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    onSendMessage(textInput.trim());
    setTextInput("");
  };

  // Get the last AI message for live subtitle banner
  const lastAiMessage = [...messages].reverse().find((m) => m.sender === "ai");

  return (
    <div className="space-y-4 select-none">
      {/* 1. TOP CALL STATUS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-3xl bg-card border border-border shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEndCall}
            className="p-2 rounded-xl bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="size-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={persona.avatar}
                alt={persona.name}
                className="size-10 rounded-xl object-cover border-2 border-primary shadow-xs"
              />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full bg-emerald-500 border-2 border-card" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-foreground">
                  {persona.name}
                </span>
                <span className="text-xs">
                  {persona.accent === "US" ? "🇺🇸" : persona.accent === "UK" ? "🇬🇧" : "🇦🇺"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                {persona.title}
              </p>
            </div>
          </div>
        </div>

        {/* CALL DURATION & CONTROLS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Duration Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border text-xs font-mono font-bold text-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
            <span>{formatTime(callDurationSeconds)}</span>
          </div>

          {/* Subtitle Translation Toggle */}
          <button
            type="button"
            onClick={() => setShowViTranslation((prev) => !prev)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showViTranslation
                ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                : "bg-muted border-border text-muted-foreground hover:text-foreground"
            }`}
            title="Bật/Tắt dịch phụ đề tiếng Việt"
          >
            <Languages className="size-3.5" />
            <span className="hidden sm:inline">Dịch Song Ngữ</span>
          </button>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center p-1 rounded-xl bg-muted border border-border">
            <button
              type="button"
              onClick={() => setViewMode("split")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "split"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Hội Thoại
            </button>
            <button
              type="button"
              onClick={() => setViewMode("call")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "call"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Toàn Cảnh
            </button>
          </div>

          {/* End Call Button */}
          <button
            type="button"
            onClick={onEndCall}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-rose-500/25 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <PhoneOff className="size-3.5" />
            <span>Kết Thúc</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN CONVERSATION STAGE (GRID OR FULLSCREEN) */}
      <div
        className={`grid gap-4 ${
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-12" : "grid-cols-1"
        }`}
      >
        {/* LEFT / CENTER: INTERACTIVE AI VIDEO & AVATAR BOX (7 Cols) */}
        <div
          className={`${
            viewMode === "split" ? "lg:col-span-7" : "col-span-1"
          } relative rounded-3xl bg-slate-950 border-2 border-slate-800 text-white overflow-hidden shadow-2xl flex flex-col justify-between min-h-[480px] lg:min-h-[560px] p-6`}
        >
          {/* Background Ambient Glow */}
          <div
            className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
              status === "speaking"
                ? "bg-linear-to-b from-blue-600/20 via-purple-600/15 to-slate-950"
                : status === "listening"
                ? "bg-linear-to-b from-emerald-600/20 via-slate-950 to-slate-950"
                : "bg-slate-950"
            }`}
          />

          {/* Top Info inside Video */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white">
              <span
                className={`size-2 rounded-full ${
                  status === "speaking"
                    ? "bg-blue-400 animate-ping"
                    : status === "listening"
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-amber-400"
                }`}
              />
              <span>
                {status === "speaking"
                  ? `${persona.name} đang nói...`
                  : status === "listening"
                  ? `${persona.name} đang lắng nghe...`
                  : status === "thinking"
                  ? `${persona.name} đang suy nghĩ...`
                  : "Sẵn sàng trò chuyện"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">HD 1080p · AI Live</span>
            </div>
          </div>

          {/* CENTER: DUOLINGO STYLE ANIMATED ANIME CHARACTER */}
          <div className="relative z-10 flex flex-col items-center justify-center py-2 sm:py-4 text-center space-y-2">
            <DuolingoAnimeCharacter
              characterId={persona.animeId || "yuki-sarah"}
              status={status}
            />

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {persona.name}
              </h2>
              <p className="text-xs text-blue-300 font-medium mt-0.5">
                {persona.accentLabel}
              </p>
            </div>
          </div>

          {/* USER PICTURE-IN-PICTURE (PIP) PREVIEW */}
          <div className="absolute top-4 right-4 z-20 w-28 sm:w-36 h-36 sm:h-44 rounded-2xl bg-slate-900 border-2 border-white/20 shadow-xl overflow-hidden flex flex-col justify-between p-2">
            {isCameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 space-y-1">
                <CameraOff className="size-6" />
                <span className="text-[9px] font-bold">Camera Tắt</span>
              </div>
            )}

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-bold text-white">
                Bạn
              </span>
              <div className="size-2 rounded-full bg-emerald-500" />
            </div>

            <div className="relative z-10 flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={() => setIsCameraOn(!isCameraOn)}
                className="p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                title={isCameraOn ? "Tắt Camera" : "Bật Camera"}
              >
                {isCameraOn ? <Camera className="size-3" /> : <CameraOff className="size-3" />}
              </button>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors"
                title={isMuted ? "Bật Mic" : "Tắt Mic"}
              >
                {isMuted ? <MicOff className="size-3 text-rose-400" /> : <Mic className="size-3" />}
              </button>
            </div>
          </div>

          {/* BOTTOM LIVE SUBTITLES BANNER */}
          <div className="relative z-10 mt-4 p-4 rounded-2xl bg-black/75 backdrop-blur-md border border-white/10 space-y-1.5 text-left">
            <div className="flex items-center justify-between text-[11px] text-blue-400 font-bold">
              <span>Phụ Đề Thời Gian Thực:</span>
              {lastAiMessage && (
                <button
                  type="button"
                  onClick={() => onReplayAudio(lastAiMessage.content)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="size-3.5" />
                  <span>Nghe lại</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm font-bold text-white leading-relaxed">
              {lastAiMessage?.content || persona.welcomeMessage}
            </p>

            {showViTranslation && (
              <p className="text-xs text-slate-300 font-medium italic pt-1 border-t border-white/10">
                {lastAiMessage?.translationVi || persona.welcomeMessageVi}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT 5 COLS: INTERACTIVE CHAT TIMELINE & GRAMMAR FEEDBACK (Split View) */}
        {viewMode === "split" && (
          <div className="lg:col-span-5 rounded-3xl bg-card border border-border shadow-xl p-4 sm:p-6 flex flex-col justify-between h-[480px] lg:h-[560px]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="text-xs sm:text-sm font-black text-foreground flex items-center gap-2">
                <MessageSquare className="size-4 text-primary" />
                <span>Nhật Ký Hội Thoại & Sửa Lỗi</span>
              </h3>
              <span className="text-[11px] text-muted-foreground font-mono font-bold">
                {messages.length} lượt thoại
              </span>
            </div>

            {/* Scrollable Messages List */}
            <div className="flex-1 overflow-y-auto space-y-4 py-3 pr-1 text-xs">
              {messages.map((msg) => {
                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
                      <span>{isUser ? "Bạn" : persona.name}</span>
                      <span>·</span>
                      <span>
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] space-y-1.5 ${
                        isUser
                          ? "bg-primary text-primary-foreground rounded-tr-xs"
                          : "bg-muted text-foreground rounded-tl-xs border border-border"
                      }`}
                    >
                      <p className="leading-relaxed font-semibold">{msg.content}</p>

                      {showViTranslation && msg.translationVi && (
                        <p
                          className={`text-[11px] leading-relaxed italic pt-1 border-t ${
                            isUser
                              ? "border-primary-foreground/20 text-primary-foreground/80"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {msg.translationVi}
                        </p>
                      )}
                    </div>

                    {/* AI Grammar Feedback Card if user made a mistake */}
                    {isUser && msg.feedback && (
                      <div className="w-full max-w-[90%] p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1 text-left animate-in fade-in">
                        <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                          <Sparkles className="size-3" />
                          <span>Gợi ý cách diễn đạt tự nhiên hơn:</span>
                        </div>
                        <p className="font-bold text-foreground">
                          "{msg.feedback.improvedText}"
                        </p>
                        <p className="text-[10.5px] text-muted-foreground">
                          {msg.feedback.explanationVi}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Starter Prompts */}
            <div className="pt-2 border-t border-border space-y-2">
              <span className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">
                💡 Gợi ý câu hỏi khi bạn bí ý tưởng:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-16 overflow-y-auto">
                {persona.samplePromptSuggestions.map((prompt, pIdx) => (
                  <button
                    key={pIdx}
                    type="button"
                    onClick={() => onSendMessage(prompt.en)}
                    className="px-2.5 py-1 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary border border-border text-[11px] font-semibold transition-colors text-left truncate max-w-full cursor-pointer"
                    title={prompt.vi}
                  >
                    "{prompt.en}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. BOTTOM VOICE & TEXT INTERACTION CONTROLS BAR */}
      <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border shadow-xl space-y-3">
        {/* Real-time Voice Transcription Indicator */}
        {isRecording && (
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="size-3 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="font-bold text-blue-600 dark:text-blue-400">
                Đang lắng nghe:{" "}
                <span className="text-foreground font-normal">
                  {transcript || "Hãy nói câu tiếng Anh của bạn..."}
                </span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleRecord}
              className="px-3 py-1 rounded-xl bg-blue-600 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              Gửi câu nói
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {/* BIG MICROPHONE RECORDING BUTTON */}
          <button
            type="button"
            onClick={handleToggleRecord}
            className={`p-4 sm:px-6 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 shadow-xl cursor-pointer shrink-0 ${
              isRecording
                ? "bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30"
                : "bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-600/30 hover:scale-102 active:scale-98"
            }`}
          >
            <Mic className={`size-5 ${isRecording ? "animate-bounce" : ""}`} />
            <span className="hidden sm:inline">
              {isRecording ? "Đang Nghe... (Nhấn Để Gửi)" : "Nhấn Để Nói"}
            </span>
          </button>

          {/* FALLBACK TEXT INPUT FORM */}
          <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Hoặc gõ câu tiếng Anh bạn muốn hỏi..."
              className="w-full py-3.5 px-4 rounded-2xl bg-muted border border-border text-xs sm:text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />

            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-3.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all disabled:opacity-40 cursor-pointer shrink-0 shadow-md"
              title="Gửi câu"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
