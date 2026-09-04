"use client";

import type { UserSpeakingProfile } from "@/types/speaking-room";
import { useToastStore } from "@/stores/useToastStore";
import {
  AlertTriangle,
  AtSign,
  Calendar,
  CheckCircle2,
  Lock,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";

interface SpeakingUsernameModalProps {
  isOpen: boolean;
  onSaveProfile: (profile: UserSpeakingProfile) => void;
  onClose?: () => void;
}

export function SpeakingUsernameModal({
  isOpen,
  onSaveProfile,
  onClose,
}: SpeakingUsernameModalProps) {
  const { addToast } = useToastStore();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [dob, setDob] = useState("2000-01-01");
  const [level, setLevel] = useState("B1");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanHandle = username.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
    if (!cleanHandle || cleanHandle.length < 3) {
      addToast("Username phải có ít nhất 3 ký tự (chữ thường, số hoặc dấu gạch dưới)", "error");
      return;
    }

    if (!fullName.trim()) {
      addToast("Vui lòng nhập Họ và tên hiển thị", "error");
      return;
    }

    const avatarUrl =
      gender === "female"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop";

    onSaveProfile({
      username: cleanHandle,
      fullName: fullName.trim(),
      gender,
      dob,
      level,
      avatarUrl,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 my-8">
        {/* HEADER ICON & TITLE */}
        <div className="space-y-3 text-center">
          <div className="size-14 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center mx-auto shadow-md">
            <AtSign className="size-7" />
          </div>

          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Thiết Lập Username & Hồ Sơ Luyện Nói
          </h3>

          {/* EXACT MANDATORY NOTICE */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/80 text-left space-y-1.5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wide">
              <ShieldAlert className="size-4" />
              <span>Thông Báo Bắt Buộc</span>
            </div>
            <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-semibold">
              Bạn cần đặt username để dùng các tính năng cộng đồng như trò chuyện, kết bạn và đấu từ vựng. Đây sẽ là <strong>@handle</strong> duy nhất của bạn.
            </p>
            <p className="text-[11px] text-amber-700 dark:text-amber-400 italic">
              * Thông tin này chỉ có thể thiết lập một lần và không thể thay đổi sau này.
            </p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* USERNAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Username (@handle duy nhất) <strong className="text-rose-500">*</strong></span>
              <span className="text-[10px] text-slate-400 font-normal">Chữ thường, số, dấu _</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 font-bold text-slate-400 text-sm">@</span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                placeholder="vidu: sarah_99 hoặc minhtuan"
                className="w-full h-12 pl-9 pr-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* FULL NAME */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Họ và tên hiển thị <strong className="text-rose-500">*</strong>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Minh Tuấn"
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white focus:border-purple-600 focus:outline-none"
            />
          </div>

          {/* GENDER & DOB */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Giới tính <strong className="text-rose-500">*</strong>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full h-12 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:border-purple-600 focus:outline-none"
              >
                <option value="male">Nam (Male)</option>
                <option value="female">Nữ (Female)</option>
                <option value="other">Khác (Other)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Ngày sinh <strong className="text-rose-500">*</strong>
              </label>
              <input
                type="date"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full h-12 px-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:border-purple-600 focus:outline-none"
              />
            </div>
          </div>

          {/* ENGLISH LEVEL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Trình độ tiếng Anh tự đánh giá
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:border-purple-600 focus:outline-none"
            >
              <option value="A1">🌱 A1 - Mới bắt đầu</option>
              <option value="A2">🌿 A2 - Cơ bản</option>
              <option value="B1">⚡ B1 - Giao tiếp hàng ngày</option>
              <option value="B2">🔥 B2 - Trôi chảy, tự tin</option>
              <option value="C1">🚀 C1 - Nâng cao, chuyên nghiệp</option>
            </select>
          </div>

          {/* ACTIONS */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-base shadow-xl shadow-purple-600/25 transition-all hover:scale-101 cursor-pointer active:scale-98"
            >
              <CheckCircle2 className="size-5" />
              <span>Xác nhận thông tin & Vào phòng nói</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
