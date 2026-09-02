"use client";

import { useAiChatStore, type FileAttachment } from "@/stores/useAiChatStore";
import { useToastStore } from "@/stores/useToastStore";
import { FileText, Mic, MicOff, Paperclip, Send, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

export default function AiChatInput() {
  const {
    inputMessage,
    setInputMessage,
    sendMessage,
    isStreaming,
    pendingAttachments,
    addAttachment,
    removeAttachment,
  } = useAiChatStore();

  const { addToast } = useToastStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Tự động điều chỉnh độ cao theo độ dài văn bản khi gõ hoặc xuống dòng
  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [inputMessage]);

  const handleSend = () => {
    if (
      (!inputMessage.trim() && pendingAttachments.length === 0) ||
      isStreaming
    )
      return;
    sendMessage(inputMessage);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith("image/");
      const newAttachment: FileAttachment = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
      addAttachment(newAttachment);
    });

    addToast(`Đã đính kèm ${files.length} tệp`, "success");
    e.target.value = "";
  };

  // Drag & drop file support
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const isImg = file.type.startsWith("image/");
      const newAttachment: FileAttachment = {
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
      };
      addAttachment(newAttachment);
    });
    addToast(`Đã thả ${files.length} tệp vào đoạn chat`, "success");
  };

  // Web Speech Recognition for voice input
  const handleToggleVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      addToast("Trình duyệt không hỗ trợ nhận diện giọng nói", "warning");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "vi-VN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        addToast("Đang ghi âm... Hãy nói câu hỏi của bạn", "info");
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(
          inputMessage ? `${inputMessage} ${transcript}` : transcript
        );
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        addToast("Không nhận diện được giọng nói", "warning");
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`p-3 sm:p-4 bg-card/95 border-t border-border backdrop-blur-xl space-y-2.5 transition-colors ${
        isDragging
          ? "bg-primary/5 border-primary/50 ring-2 ring-primary/20"
          : ""
      }`}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Pending Attachments List (Preview Chips) */}
      {pendingAttachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {pendingAttachments.map((file) => (
            <div
              key={file.id}
              className="group relative flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-muted border border-border text-xs shadow-xs animate-in fade-in zoom-in-95"
            >
              {file.previewUrl ? (
                <img
                  src={file.previewUrl}
                  alt={file.name}
                  className="w-7 h-7 rounded-md object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-md bg-primary/10 text-primary flex items-center justify-center">
                  <FileText className="size-3.5" />
                </div>
              )}
              <div className="text-left">
                <span className="block text-[11px] font-bold text-foreground max-w-28 truncate">
                  {file.name}
                </span>
                <span className="block text-[9px] text-muted-foreground">
                  {file.size}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeAttachment(file.id)}
                className="p-1 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer ml-1"
                title="Xóa tệp"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box Wrapper */}
      <div className="relative flex items-end gap-1.5 p-2 rounded-2xl bg-muted/70 border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        {/* Attach File Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-xl text-muted-foreground hover:text-primary hover:bg-accent transition-colors cursor-pointer shrink-0"
          title="Tải ảnh đề thi, bài luận PDF, tài liệu Word..."
        >
          <Paperclip className="size-4" />
        </button>

        {/* Voice Input Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
            isListening
              ? "bg-destructive text-destructive-foreground animate-pulse"
              : "text-muted-foreground hover:text-primary hover:bg-accent"
          }`}
          title={isListening ? "Dừng ghi âm" : "Nhập bằng giọng nói"}
        >
          {isListening ? (
            <MicOff className="size-4" />
          ) : (
            <Mic className="size-4" />
          )}
        </button>

        {/* Dynamic Auto-Expanding Text Area */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bạn muốn hỏi gì..."
          className="flex-1 py-1.5 px-1 bg-transparent text-xs sm:text-[13.5px] text-foreground placeholder:text-muted-foreground focus:outline-none resize-none leading-relaxed font-normal max-h-36 overflow-y-auto"
        />

        {/* Send Button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={
            (!inputMessage.trim() && pendingAttachments.length === 0) ||
            isStreaming
          }
          className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition-all cursor-pointer shrink-0 ${
            (inputMessage.trim() || pendingAttachments.length > 0) &&
            !isStreaming
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:scale-105 active:scale-95"
              : "bg-muted text-muted-foreground/50 cursor-not-allowed"
          }`}
          aria-label="Gửi tin nhắn"
        >
          <Send className="size-4" />
        </button>
      </div>

      <div className="flex items-center justify-between px-1 text-[10px] text-muted-foreground select-none">
        <span className="hidden sm:inline">Shift + Enter để xuống dòng</span>
      </div>
    </div>
  );
}
