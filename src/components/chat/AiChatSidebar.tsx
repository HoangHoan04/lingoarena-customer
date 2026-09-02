"use client";

import { useAiChatStore, type AiChatMode, type AiModelId } from "@/stores/useAiChatStore";
import {
  BookOpen,
  Bot,
  Compass,
  Cpu,
  GraduationCap,
  MessageSquare,
  Mic,
  PenTool,
  Plus,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

export const CHAT_MODES: {
  id: AiChatMode;
  label: string;
  desc: string;
  icon: any;
  color: string;
}[] = [
  {
    id: "tutor",
    label: "Gia Sư Tiếng Anh AI",
    desc: "Hỏi đáp ngữ pháp, từ vựng, hội thoại",
    icon: GraduationCap,
    color: "text-blue-500 bg-blue-500/10",
  },
  {
    id: "writing_grader",
    label: "Chấm & Sửa Writing",
    desc: "Đánh giá chi tiết 4 tiêu chí Rubric IDP/BC",
    icon: PenTool,
    color: "text-purple-500 bg-purple-500/10",
  },
  {
    id: "speaking_partner",
    label: "Luyện Phản Xạ Speaking",
    desc: "Đóng vai giám khảo phỏng vấn A.R.E.A",
    icon: Mic,
    color: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "grammar_explainer",
    label: "Phân Tích Bẫy Đề Thi",
    desc: "Giải thích bẫy TOEIC, IELTS, VSTEP",
    icon: BookOpen,
    color: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "roadmap",
    label: "Lập Lộ Trình Cá Nhân Hóa",
    desc: "Thiết kế kế hoạch học theo tuần & tháng",
    icon: Compass,
    color: "text-rose-500 bg-rose-500/10",
  },
];

export const AI_MODELS: {
  id: AiModelId;
  name: string;
  badge: string;
  desc: string;
}[] = [
  {
    id: "gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    badge: "Siêu tốc",
    desc: "Phản hồi tức thì, tối ưu bài tập & hội thoại",
  },
  {
    id: "gemini-pro-vision",
    name: "Gemini 2.5 Pro Vision",
    badge: "Mạnh nhất",
    desc: "Phân tích ảnh đề thi & tài liệu phức tạp",
  },
  {
    id: "ielts-examiner-9.0",
    name: "IELTS Examiner 9.0",
    badge: "Writing/Speaking",
    desc: "Chấm chuẩn ma trận Rubric Cambridge & IDP",
  },
  {
    id: "toeic-trap-master",
    name: "TOEIC Trap Master",
    badge: "Part 5-7",
    desc: "Chuyên sâu bẫy từ loại và liên từ ETS",
  },
];

export default function AiChatSidebar({ isMobile = false }: { isMobile?: boolean }) {
  const {
    sessions,
    currentSessionId,
    mode,
    setMode,
    selectedModel,
    setSelectedModel,
    switchSession,
    createNewSession,
    deleteSession,
  } = useAiChatStore();

  const [search, setSearch] = useState("");

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase().trim();
    return sessions.filter((s) => s.title.toLowerCase().includes(q));
  }, [sessions, search]);

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-muted/40 border-r border-border p-4 space-y-4 select-none">
      {/* Sidebar Header & New Chat */}
      <div className="space-y-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="size-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/25">
            <Bot className="size-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-foreground leading-tight">
              LingoBot AI Studio
            </h3>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
              Gemini Multi-Modal
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => createNewSession()}
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md shadow-primary/20 transition-all hover:scale-101 cursor-pointer active:scale-98"
        >
          <Plus className="size-4" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      {/* Model Selector Pill */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1">
          <Cpu className="size-3" />
          Mô hình AI Lingo
        </span>
        <div className="grid grid-cols-1 gap-1">
          {AI_MODELS.map((m) => {
            const active = selectedModel === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedModel(m.id)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                  active
                    ? "bg-card text-primary font-bold shadow-2xs border border-primary/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                <div className="min-w-0 pr-1">
                  <span className="text-xs truncate block leading-tight">{m.name}</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-primary/10 text-primary text-[9px] font-extrabold shrink-0">
                  {m.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Selector Chips */}
      <div className="space-y-1.5 pt-1 border-t border-border">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-1 flex items-center gap-1">
          <Sparkles className="size-3 text-amber-500" />
          Chế độ chuyên sâu
        </span>
        <div className="space-y-1">
          {CHAT_MODES.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setMode(item.id);
                  createNewSession(item.id);
                }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all cursor-pointer ${
                  active
                    ? "bg-card text-primary shadow-2xs font-bold border border-primary/30"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
                }`}
              >
                <div className={`p-1.5 rounded-lg ${item.color} shrink-0`}>
                  <Icon className="size-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="block text-xs truncate leading-tight">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Sessions */}
      <div className="pt-2 border-t border-border">
        <div className="relative">
          <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm đoạn chat..."
            className="w-full h-8 pl-8 pr-3 rounded-xl border border-border bg-card text-[11px] placeholder:text-muted-foreground text-foreground focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Sessions History List */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground px-1 block mb-1">
          Lịch sử ({filteredSessions.length})
        </span>

        {filteredSessions.map((session) => {
          const isSelected = session.id === currentSessionId;
          return (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={`group flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                isSelected
                  ? "bg-primary/10 text-primary font-bold border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <MessageSquare className="size-3.5 shrink-0 text-muted-foreground group-hover:text-primary" />
                <span className="truncate text-[12px]">{session.title}</span>
              </div>

              {sessions.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-opacity"
                  title="Xóa đoạn chat này"
                >
                  <Trash2 className="size-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
