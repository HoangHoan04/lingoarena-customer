import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/context";
import { formatTime } from "@/common/helpers";
import { useChatBot } from "@/hooks/chatbot-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Attachment {
  file: File;
  type: "image" | "document";
  previewUrl?: string;
}

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  time: string;
  attachments?: Attachment[];
}

const QUICK_QUESTIONS = [
  "LingoArena có thể dịch những ngôn ngữ nào?",
  "Làm sao để lưu bản dịch?",
  "Có hỗ trợ dịch tài liệu PDF không?",
  "Cách dịch bằng giọng nói?",
];

interface ChatBotCustomProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBotCustom({ isOpen, onClose }: ChatBotCustomProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 0,
      role: "bot",
      text: "Xin chào! Tôi là trợ lý **LingoArena AI** 🌐\nBạn cần hỗ trợ gì về dịch thuật hoặc học ngôn ngữ hôm nay?",
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);
  const idCounterRef = useRef(1);
  const textBufferRef = useRef("");
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "vi-VN";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognitionRef.current.onerror = () => setIsRecording(false);
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setIsRecording(true);
      recognitionRef.current?.start();
    }
  };

  const startTypingEffect = useCallback((botMsgId: number) => {
    if (typingIntervalRef.current) return;

    typingIntervalRef.current = setInterval(() => {
      if (textBufferRef.current.length > 0) {
        const char = textBufferRef.current.substring(0, 1);
        textBufferRef.current = textBufferRef.current.substring(1);

        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId ? { ...m, text: m.text + char } : m,
          ),
        );
      } else {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
      }
    }, 15); // Faster, smoother typing
  }, []);

  const handleFileSelect = (
    files: FileList | null,
    type: "image" | "document",
  ) => {
    if (!files || files.length === 0) return;
    const newAttachments: Attachment[] = Array.from(files).map((file) => ({
      file,
      type,
      previewUrl: type === "image" ? URL.createObjectURL(file) : undefined,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const updated = [...prev];
      if (updated[index].previewUrl)
        URL.revokeObjectURL(updated[index].previewUrl!);
      updated.splice(index, 1);
      return updated;
    });
  };

  const clearHistory = () => {
    if (window.confirm("Bạn có muốn xóa lịch sử trò chuyện?")) {
      setMessages([
        {
          id: 0,
          role: "bot",
          text: "Lịch sử đã được xóa. Tôi có thể giúp gì thêm cho bạn?",
          time: formatTime(),
        },
      ]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const { sendMessage: callChatApi } = useChatBot();

  const sendMessage = async (text: string) => {
    if (!text.trim() && attachments.length === 0) return;

    const botMsgId = idCounterRef.current + 1; // Anticipate next ID
    const userMsgId = idCounterRef.current++;
    idCounterRef.current++; // Space for bot message

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    textBufferRef.current = "";

    const userMsg: Message = {
      id: userMsgId,
      role: "user",
      text: text.trim() || `[Đã gửi ${attachments.length} tệp đính kèm]`,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setAttachments([]);
    setIsTyping(true);

    const apiHistory = messages.map((m) => ({
      role: (m.role === "user" ? "user" : "assistant") as
        | "user"
        | "assistant"
        | "system",
      content: m.text,
    }));
    apiHistory.push({ role: "user", content: userMsg.text });

    const botMsg: Message = {
      id: botMsgId,
      role: "bot",
      text: "",
      time: formatTime(),
    };
    setMessages((prev) => [...prev, botMsg]);

    await callChatApi(
      apiHistory,
      (chunk) => {
        setIsTyping(false);
        textBufferRef.current += chunk;
        startTypingEffect(botMsgId);
      },
      () => setIsTyping(false),
      (error: any) => {
        setIsTyping(false);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: `⚠️ **Lỗi kết nối:** ${error.message}` }
              : m,
          ),
        );
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div
      className={`
        fixed bottom-6 left-6 z-100
        w-[420px] max-w-[calc(100vw-48px)] h-[650px] max-h-[calc(100vh-100px)]
        flex flex-col
        rounded-[24px] overflow-hidden
        shadow-[0_20px_50px_rgba(0,0,0,0.3)] border
        transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
        ${isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 translate-y-10 pointer-events-none"}
        ${isDark ? "bg-[#0f111a]/95 border-white/10" : "bg-white/95 border-gray-200"}
        backdrop-blur-xl
      `}
    >
      {/* Header - Glassmorphism UI */}
      <div className="relative h-20 bg-linear-to-r from-indigo-600/90 to-violet-600/90 p-4 flex items-center gap-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent)] pointer-events-none" />

        <div className="relative w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0 shadow-lg group">
          <i className="pi pi-bolt text-yellow-300 text-xl animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-indigo-600 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-base tracking-tight leading-none mb-1">
            LingoArena Agent
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-[11px] font-medium uppercase tracking-widest">
              AI Assistant
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-emerald-300 text-[10px] font-semibold">
              ONLINE
            </span>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={clearHistory}
            title="Xóa lịch sử"
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <i className="pi pi-trash text-sm" />
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-white/70 transition-colors"
          >
            <i className="pi pi-times text-base" />
          </button>
        </div>
      </div>

      {/* Messages - Interactive Feed */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.02))] scroll-smooth">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
          >
            <div
              className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {msg.role === "bot" && (
                <div className="w-8 h-8 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shrink-0 shadow-md">
                  <i className="pi pi-sparkles text-white text-[10px]" />
                </div>
              )}

              <div
                className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`
                  px-4 py-3 rounded-[20px] text-[13.5px] leading-[1.6] shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-linear-to-tr from-indigo-600 to-violet-500 text-white rounded-tr-none shadow-indigo-500/20"
                      : isDark
                        ? "bg-white/5 border border-white/5 text-gray-200 rounded-tl-none"
                        : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200/50"
                  }
                `}
                >
                  {msg.role === "bot" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">{children}</p>
                        ),
                        code: ({ children }) => (
                          <code className="bg-black/30 px-1.5 py-0.5 rounded text-[11px] font-mono">
                            {children}
                          </code>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-4 mb-2 space-y-1">
                            {children}
                          </ul>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  ) : (
                    msg.text
                  )}

                  {msg.attachments && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {msg.attachments.map((att, i) => (
                        <div
                          key={i}
                          className="bg-white/10 rounded-lg p-1.5 border border-white/10 flex items-center gap-2"
                        >
                          <i
                            className={`pi ${att.type === "image" ? "pi-image" : "pi-file"} text-xs`}
                          />
                          <span className="text-[10px] opacity-80 truncate max-w-[80px]">
                            {att.file.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[9px] mt-1.5 opacity-40 font-medium px-1">
                  {msg.time}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gray-500/20 flex items-center justify-center">
              <i className="pi pi-spin pi-spinner text-[10px]" />
            </div>
            <div className="bg-gray-500/10 h-10 w-24 rounded-2xl rounded-tl-none" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section - Floating UI */}
      <div className="p-4 pt-1">
        {/* Attachment Preview */}
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-3 p-2 bg-indigo-500/5 rounded-xl border border-indigo-500/10 animate-in slide-in-from-bottom-1">
            {attachments.map((att, idx) => (
              <div
                key={idx}
                className="relative group p-1 bg-white/5 rounded-lg border border-white/10"
              >
                {att.type === "image" ? (
                  <img
                    src={att.previewUrl}
                    className="w-12 h-12 rounded object-cover shadow-sm"
                    alt="preview"
                  />
                ) : (
                  <div className="w-12 h-12 flex flex-col items-center justify-center text-indigo-400">
                    <i className="pi pi-file text-lg" />
                    <span className="text-[8px] truncate w-full text-center px-1">
                      {att.file.name}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="pi pi-times text-[8px]" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div
          className={`
          flex flex-col gap-2 p-2 rounded-[22px] border transition-all duration-300
          ${isDark ? "bg-[#1a1c2a] border-white/10 focus-within:border-indigo-500/50 shadow-lg shadow-black/20" : "bg-white border-gray-200 focus-within:border-indigo-400 shadow-xl shadow-indigo-500/5"}
        `}
        >
          <div className="flex items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isRecording ? "Đang lắng nghe..." : "Nhập tin nhắn..."
              }
              className={`flex-1 bg-transparent border-none outline-none px-3 py-2 text-[14px] placeholder:opacity-50 ${isDark ? "text-white" : "text-gray-800"}`}
            />

            <button
              // eslint-disable-next-line react-hooks/refs
              onClick={sendMessage.bind(null, input)}
              disabled={(!input.trim() && attachments.length === 0) || isTyping}
              className={`w-10 h-10 rounded-[16px] flex items-center justify-center transition-all active:scale-90
                ${
                  (input.trim() || attachments.length > 0) && !isTyping
                    ? "bg-linear-to-tr from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/40"
                    : "bg-gray-500/10 text-gray-500 cursor-not-allowed"
                }
              `}
            >
              <i className="pi pi-send text-xs" />
            </button>
          </div>

          <div className="flex items-center justify-between px-1.5 pb-0.5 border-t border-white/5 pt-1.5">
            <div className="flex gap-1">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <i className="pi pi-image text-sm" />
              </button>
              <button
                onClick={() => docInputRef.current?.click()}
                className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors"
              >
                <i className="pi pi-paperclip text-sm" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleRecording}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${isRecording ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20"}`}
              >
                {isRecording && (
                  <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-75" />
                )}
                <i
                  className={`pi ${isRecording ? "pi-microphone" : "pi-microphone"} text-sm`}
                />
              </button>

              <div className="flex flex-wrap gap-1">
                {QUICK_QUESTIONS.slice(0, 2).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(q)}
                    className="text-[10px] px-2 py-1 rounded-md bg-gray-500/5 hover:bg-gray-500/10 text-gray-400 transition-colors"
                  >
                    {q.length > 15 ? q.substring(0, 15) + "..." : q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files, "image")}
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files, "document")}
        />
      </div>

      {/* Footer Decoration */}
      <div className="h-1 bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 opacity-50" />
    </div>
  );
}
