"use client";

import robotHelloAnimation from "@/assets/animations/RobotHello.json";
import { useAiChatStore } from "@/stores/useAiChatStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  Download,
  Maximize2,
  Minimize2,
  Minus,
  Plus,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";
import AiChatInput from "./AiChatInput";
import AiChatMessageList from "./AiChatMessageList";
import AiChatSidebar, { CHAT_MODES } from "./AiChatSidebar";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function AiChatWidget() {
  const {
    isOpen,
    isFullscreen,
    isMinimized,
    mode,
    selectedModel,
    currentSessionId,
    sessions,
    closeChat,
    toggleFullscreen,
    toggleMinimize,
    createNewSession,
    clearCurrentSession,
  } = useAiChatStore();

  const { addToast } = useToastStore();

  if (!isOpen) return null;

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const currentModeInfo = CHAT_MODES.find((m) => m.id === mode);

  // Export chat conversation as text
  const handleExportChat = () => {
    if (!currentSession || currentSession.messages.length === 0) return;
    const content = currentSession.messages
      .map(
        (m) =>
          `[${m.role === "user" ? "BẠN" : "LINGOBOT AI"}] (${new Date(
            m.timestamp
          ).toLocaleTimeString()}):\n${m.content}\n`
      )
      .join("\n---\n\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LingoBot-Chat-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("Đã tải xuống lịch sử đoạn chat", "success");
  };

  // ----------------------------------------------------
  // MODE 1: FULL-PAGE WORKSPACE (GEMINI STUDIO CANVAS)
  // ----------------------------------------------------
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col md:flex-row overflow-hidden animate-in fade-in zoom-in-98 duration-200">
        {/* Left Sidebar on Desktop */}
        <div className="hidden md:flex h-full shrink-0">
          <AiChatSidebar />
        </div>

        {/* Right Main Conversation Canvas */}
        <div className="flex-1 h-full flex flex-col bg-card relative overflow-hidden">
          {/* Top Bar Header */}
          <div className="h-16 px-6 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md select-none shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/20 overflow-hidden shrink-0">
                <Player
                  autoplay
                  loop
                  src={robotHelloAnimation}
                  className="w-9 h-9 scale-120"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-extrabold text-foreground">
                    {currentSession?.title || "LingoBot AI Studio"}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase">
                    {selectedModel}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    Chế độ: <strong>{currentModeInfo?.label}</strong> · Trợ lý AI
                    thông minh
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons Cluster */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleExportChat}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Tải đoạn chat (.txt)"
              >
                <Download className="size-4" />
              </button>
              <button
                type="button"
                onClick={clearCurrentSession}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Làm mới cuộc trò chuyện"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={toggleFullscreen}
                className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
                title="Thu nhỏ cửa sổ popup"
              >
                <Minimize2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={closeChat}
                className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Đóng trợ lý AI"
              >
                <X className="size-5" />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <AiChatMessageList />

          {/* Input Box */}
          <AiChatInput />
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // MODE 2: POPUP FLOATING CHAT WIDGET (Positioned to the right of the left float button)
  // ----------------------------------------------------
  return (
    <div
      className={`fixed bottom-4 left-28 sm:left-32 z-50 w-[440px] max-w-[calc(100vw-140px)] bg-card/98 backdrop-blur-2xl rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-left-4 ${
        isMinimized ? "h-16" : "h-[640px] max-h-[86vh]"
      }`}
    >
      {/* Top Header */}
      <div className="h-16 px-4 sm:px-5 border-b border-border flex items-center justify-between bg-card/80 backdrop-blur-md select-none shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative size-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25 overflow-hidden shrink-0">
            <Player
              autoplay
              loop
              src={robotHelloAnimation}
              className="w-9 h-9 scale-120"
            />
            <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 border-2 border-card z-10" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-xs sm:text-[13.5px] text-foreground leading-tight">
                LingoBot AI
              </h3>
              <Sparkles className="size-3 text-amber-500" />
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              {currentModeInfo?.label || "AI Tutor"}
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => createNewSession()}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Đoạn chat mới"
          >
            <Plus className="size-4" />
          </button>
          <button
            type="button"
            onClick={handleExportChat}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Tải đoạn chat (.txt)"
          >
            <Download className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
            title="Mở rộng toàn màn hình"
          >
            <Maximize2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggleMinimize}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title={isMinimized ? "Mở rộng lại" : "Thu gọn"}
          >
            <Minus className="size-4" />
          </button>
          <button
            type="button"
            onClick={closeChat}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
            title="Đóng trợ lý"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* When not minimized: Show Message Area and Input */}
      {!isMinimized && (
        <>
          <AiChatMessageList />
          <AiChatInput />
        </>
      )}
    </div>
  );
}
