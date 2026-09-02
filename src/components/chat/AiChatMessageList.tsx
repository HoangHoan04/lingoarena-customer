"use client";

import { useAiChatStore } from "@/stores/useAiChatStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  Bookmark,
  BookmarkCheck,
  Bot,
  Check,
  Copy,
  FileText,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  RotateCcw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function AiChatMessageList() {
  const {
    sessions,
    currentSessionId,
    isStreaming,
    rateMessage,
    toggleBookmarkMessage,
    regenerateLastMessage,
  } = useAiChatStore();

  const { addToast } = useToastStore();
  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const messages = currentSession?.messages || [];
  const endRef = useRef<HTMLDivElement>(null);

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    addToast("Đã sao chép phản hồi", "success");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSpeak = (content: string, id: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      addToast("Trình duyệt không hỗ trợ phát âm", "warning");
      return;
    }

    if (speakingId === id) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel();
    setSpeakingId(id);

    const cleanSpeech = content.replace(/[#*`>_|-]/g, "").slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.lang = "vi-VN";
    utterance.rate = 1.0;
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(utterance);
  };

  // Minimalist Empty State when no messages yet
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-300">
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
          <MessageSquare className="size-7" />
        </div>
        <h3 className="text-base font-bold text-foreground">
          Bạn muốn hỏi gì?
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Nhập câu hỏi hoặc tải tệp lên để bắt đầu trò chuyện với LingoBot AI
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-5 select-text">
      {messages.map((msg, index) => {
        const isUser = msg.role === "user";
        const isLastAi = !isUser && index === messages.length - 1;

        return (
          <div
            key={msg.id}
            className={`flex gap-3 sm:gap-3.5 ${
              isUser ? "flex-row-reverse" : "flex-row"
            } animate-in fade-in slide-in-from-bottom-2 duration-200`}
          >
            {/* Avatar Icon */}
            <div
              className={`size-7 sm:size-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                isUser
                  ? "bg-secondary text-secondary-foreground border border-border"
                  : "bg-primary text-primary-foreground shadow-primary/20"
              }`}
            >
              {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
            </div>

            {/* Bubble & Toolbar Container */}
            <div className={`space-y-2.5 max-w-[88%] sm:max-w-[82%]`}>
              {/* User Attached Files (if any) */}
              {isUser && msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-end mb-1">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-muted border border-border text-xs shadow-xs"
                    >
                      {att.previewUrl ? (
                        <img
                          src={att.previewUrl}
                          alt={att.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                          {att.type.includes("image") ? (
                            <ImageIcon className="size-4" />
                          ) : (
                            <FileText className="size-4" />
                          )}
                        </div>
                      )}
                      <div className="text-left">
                        <p className="text-[11px] font-bold text-foreground max-w-32 truncate">
                          {att.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground">{att.size}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Message Content Bubble */}
              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-[13px] sm:text-[13.5px] leading-relaxed shadow-xs ${
                  isUser
                    ? "bg-primary text-primary-foreground rounded-tr-xs font-normal"
                    : "bg-card border border-border text-card-foreground rounded-tl-xs whitespace-pre-wrap font-normal"
                }`}
              >
                {msg.content}

                {/* Optional Evaluation Breakdown */}
                {msg.feedback && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2.5">
                    {msg.feedback.score && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-accent border border-border">
                        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                          <Sparkles className="size-3.5 text-amber-500" />
                          Đánh giá:
                        </span>
                        <span className="text-xs font-black text-primary">
                          {msg.feedback.score}
                        </span>
                      </div>
                    )}

                    {/* Criteria Grid */}
                    {msg.feedback.criteria && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {msg.feedback.criteria.map((crit, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-muted border border-border text-xs"
                          >
                            <div className="flex items-center justify-between font-bold text-foreground text-[11.5px]">
                              <span>{crit.label}</span>
                              <span className="text-primary font-bold">{crit.score}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                              {crit.note}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Toolbar for AI responses */}
              {!isUser && (
                <div className="flex items-center justify-between pl-1 text-muted-foreground text-xs select-none">
                  <div className="flex items-center gap-1">
                    {/* Copy */}
                    <button
                      type="button"
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                      title="Sao chép"
                    >
                      {copiedId === msg.id ? (
                        <Check className="size-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>

                    {/* Text to speech */}
                    <button
                      type="button"
                      onClick={() => handleSpeak(msg.content, msg.id)}
                      className={`p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                        speakingId === msg.id
                          ? "text-primary bg-primary/10 animate-pulse"
                          : "hover:text-foreground"
                      }`}
                      title={speakingId === msg.id ? "Dừng đọc" : "Nghe đọc"}
                    >
                      {speakingId === msg.id ? (
                        <VolumeX className="size-3.5" />
                      ) : (
                        <Volume2 className="size-3.5" />
                      )}
                    </button>

                    {/* Bookmark */}
                    <button
                      type="button"
                      onClick={() => {
                        toggleBookmarkMessage(msg.id);
                        addToast(
                          msg.isBookmarked
                            ? "Đã bỏ lưu tin nhắn"
                            : "Đã lưu vào Sổ tay ôn tập",
                          "success"
                        );
                      }}
                      className={`p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                        msg.isBookmarked
                          ? "text-amber-500"
                          : "hover:text-foreground"
                      }`}
                      title={msg.isBookmarked ? "Bỏ lưu" : "Lưu vào Sổ tay"}
                    >
                      {msg.isBookmarked ? (
                        <BookmarkCheck className="size-3.5 fill-amber-500 text-amber-500" />
                      ) : (
                        <Bookmark className="size-3.5" />
                      )}
                    </button>

                    {/* Like / Dislike */}
                    <button
                      type="button"
                      onClick={() => rateMessage(msg.id, "like")}
                      className={`p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                        msg.rating === "like"
                          ? "text-emerald-500 bg-emerald-500/10"
                          : "hover:text-foreground"
                      }`}
                      title="Hữu ích"
                    >
                      <ThumbsUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => rateMessage(msg.id, "dislike")}
                      className={`p-1.5 rounded-lg hover:bg-muted transition-colors cursor-pointer ${
                        msg.rating === "dislike"
                          ? "text-destructive bg-destructive/10"
                          : "hover:text-foreground"
                      }`}
                      title="Chưa hài lòng"
                    >
                      <ThumbsDown className="size-3.5" />
                    </button>

                    {/* Regenerate if last AI message */}
                    {isLastAi && (
                      <button
                        type="button"
                        onClick={regenerateLastMessage}
                        disabled={isStreaming}
                        className="p-1.5 rounded-lg hover:bg-muted hover:text-foreground transition-colors cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                        title="Tạo lại câu trả lời"
                      >
                        <RotateCcw className="size-3.5" />
                        <span className="hidden sm:inline">Thử lại</span>
                      </button>
                    )}
                  </div>

                  <span className="text-[10px] text-muted-foreground font-mono">
                    {new Date(msg.timestamp).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Streaming / Typing Indicator */}
      {isStreaming && (
        <div className="flex items-center gap-3 animate-in fade-in select-none">
          <div className="size-7 sm:size-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
            <Bot className="size-4" />
          </div>
          <div className="p-3 rounded-2xl bg-card border border-border flex items-center gap-2 text-xs font-semibold text-muted-foreground shadow-xs">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>LingoAI đang phân tích...</span>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
