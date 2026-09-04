"use client";

import { useToastStore } from "@/stores/useToastStore";
import type { QuestionLookup } from "@/types/question";
import type { SpeakingLevel, SpeakingRoom } from "@/types/speaking-room";
import {
  Globe,
  KeyRound,
  Lock,
  Mic,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SpeakingCreateRoomTabProps {
  topics: QuestionLookup[];
  onCreateRoom: (newRoomData: Partial<SpeakingRoom>) => void;
}

export function SpeakingCreateRoomTab({ topics, onCreateRoom }: SpeakingCreateRoomTabProps) {
  const { addToast } = useToastStore();

  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState<SpeakingLevel>("B1-B2");
  const [maxParticipants, setMaxParticipants] = useState<number>(4);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  const [tagsInput, setTagsInput] = useState("Luyện phản xạ, Vui vẻ");

  useEffect(() => {
    if (!topic && topics[0]?.name) setTopic(topics[0].name);
  }, [topics, topic]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

            if (!roomName.trim()) {
      addToast("Vui lòng nhập Tên phòng nói chuyện (*)", "error");
      return;
    }
    if (!topic.trim()) {
      addToast("Vui lòng chọn chủ đề thảo luận", "error");
      return;
    }

    if (isPrivate && !password.trim()) {
      addToast("Vui lòng đặt mật khẩu cho phòng riêng tư", "error");
      return;
    }

    const tags = tagsInput
      .split(/[,#]/)
      .map((t) => t.trim())
      .filter(Boolean);

    onCreateRoom({
      name: roomName.trim(),
      topic,
      level,
      maxParticipants,
      isPrivate,
      password: isPrivate ? password.trim() : undefined,
      tags: tags.length > 0 ? tags : ["Voice Chat", "Tiếng Anh"],
    });
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-md space-y-6">
      <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-black uppercase">
          <Sparkles className="size-3.5" />
          <span>Tạo Phòng Trò Chuyện Trực Tuyến</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Thiết Lập Phòng Luyện Nói Riêng
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Bạn sẽ là Chủ phòng (Host), có quyền quản lý thành viên, bật/tắt mic và điều phối chủ đề thảo luận.
        </p>
      </div>

      <form onSubmit={handleCreate} className="space-y-5">
        {/* TÊN PHÒNG (*) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Tên Phòng Nói Chuyện <strong className="text-rose-500">*</strong></span>
            <span className="text-[11px] text-slate-400 font-normal">Tối đa 60 ký tự</span>
          </label>
          <input
            type="text"
            required
            maxLength={60}
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Ví dụ: ☕ Cà phê sáng luyện phản xạ IELTS 6.5+"
            className="w-full h-13 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
          />
        </div>

        {/* CHỦ ĐỀ & TRÌNH ĐỘ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Chủ đề thảo luận
            </label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-13 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
            >
              {!topics.length ? (
                <option value="">Chưa có chủ đề trên hệ thống</option>
              ) : null}
              {topics.map((t) => (
                <option key={t.id || t.name} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Trình độ khuyến nghị
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as SpeakingLevel)}
              className="w-full h-13 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
            >
              <option value="A1-A2">🌱 Sơ cấp (A1 - A2)</option>
              <option value="B1-B2">⚡ Trung cấp (B1 - B2)</option>
              <option value="C1-C2">🔥 Nâng cao (C1 - C2)</option>
              <option value="ALL">🌐 Mọi trình độ (All Levels)</option>
            </select>
          </div>
        </div>

        {/* SỐ LƯỢNG THÀNH VIÊN TỐI ĐA */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Số thành viên tối đa trong phòng
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 4, 6, 8].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setMaxParticipants(num)}
                className={`py-3 rounded-2xl text-xs font-black border-2 transition-all cursor-pointer ${
                  maxParticipants === num
                    ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 shadow-xs"
                    : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {num} người {num === 2 ? "(1 vs 1)" : ""}
              </button>
            ))}
          </div>
        </div>

        {/* CHẾ ĐỘ: CÔNG KHAI / RIÊNG TƯ */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Chế độ phòng
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsPrivate(false)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                !isPrivate
                  ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Globe className="size-5 text-purple-600" />
              <div>
                <div className="text-xs font-black">Công khai (Public)</div>
                <div className="text-[10px] opacity-70">Mọi người đều có thể vào</div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setIsPrivate(true)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center gap-3 ${
                isPrivate
                  ? "border-purple-600 bg-purple-50/70 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold"
                  : "border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              <Lock className="size-5 text-amber-500" />
              <div>
                <div className="text-xs font-black">Riêng tư (Private)</div>
                <div className="text-[10px] opacity-70">Cần mật khẩu phòng để vào</div>
              </div>
            </button>
          </div>

          {/* PASSWORD FIELD IF PRIVATE */}
          {isPrivate && (
            <div className="space-y-1.5 pt-1 animate-in zoom-in-95 duration-200">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <KeyRound className="size-3.5 text-amber-500" />
                <span>Mật khẩu phòng:</span>
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ví dụ: 123456 hoặc pass nhóm bạn..."
                className="w-full h-12 px-4 rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20 text-xs sm:text-sm font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* TAGS GỢI Ý */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Tags phòng (phân cách bằng dấu phẩy)</span>
            <span className="text-[11px] text-slate-400 font-normal">Không bắt buộc</span>
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="Ví dụ: IELTS 6.5, Luyện phản xạ, Thân thiện..."
            className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:border-purple-600 focus:outline-none"
          />
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/25 transition-all hover:scale-101 cursor-pointer active:scale-98"
          >
            <Mic className="size-5" />
            <span>Tạo phòng nói chuyện ngay</span>
          </button>
        </div>
      </form>
    </div>
  );
}
