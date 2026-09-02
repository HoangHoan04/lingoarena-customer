"use client";

import { useArenaStore } from "@/stores/useArenaStore";
import { useToastStore } from "@/stores/useToastStore";
import { Copy, KeyRound, Play, Sparkles, Users, X } from "lucide-react";
import React, { useState } from "react";

export default function ArenaCustomRoomModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { startMatchmaking } = useArenaStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<"create" | "join">("create");
  const [createdRoomCode, setCreatedRoomCode] = useState("892-416");
  const [inputRoomCode, setInputRoomCode] = useState("");

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(createdRoomCode);
    addToast("Đã sao chép mã phòng đấu: " + createdRoomCode, "success");
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputRoomCode.length < 4) {
      addToast("Vui lòng nhập mã phòng hợp lệ (6 số)", "warning");
      return;
    }
    onClose();
    startMatchmaking("CUSTOM");
  };

  const handleStartHost = () => {
    onClose();
    startMatchmaking("CUSTOM");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-amber-500/30 shadow-2xl p-6 sm:p-7 space-y-6 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <KeyRound className="size-6" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              Phòng Thách Đấu Bạn Bè 1v1
            </h3>
            <p className="text-xs text-muted-foreground">
              Tạo phòng riêng hoặc nhập mã để thi đấu cùng bạn học
            </p>
          </div>
        </div>

        {/* Tab Selector (Tạo Phòng / Tham Gia Phòng) */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/60 border border-border">
          <button
            type="button"
            onClick={() => setActiveTab("create")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "create"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Tạo Phòng Mới
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("join")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "join"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Nhập Mã Vào Phòng
          </button>
        </div>

        {/* TAB 1: CREATE ROOM */}
        {activeTab === "create" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-center space-y-2">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block">
                MÃ PHÒNG CỦA BẠN:
              </span>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl sm:text-3xl font-black text-foreground tracking-widest">
                  {createdRoomCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-2 rounded-xl bg-card border border-border hover:bg-muted text-foreground transition-colors cursor-pointer"
                  title="Sao chép mã phòng"
                >
                  <Copy className="size-4" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Chia sẻ mã này cho bạn bè để cùng tham gia tranh tài
              </p>
            </div>

            <button
              type="button"
              onClick={handleStartHost}
              className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:scale-101 active:scale-98 cursor-pointer"
            >
              Bắt Đầu Chờ Đối Thủ
            </button>
          </div>
        )}

        {/* TAB 2: JOIN ROOM */}
        {activeTab === "join" && (
          <form onSubmit={handleJoin} className="space-y-4 animate-in fade-in">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Nhập Mã Phòng 6 Số:
              </label>
              <input
                type="text"
                maxLength={7}
                value={inputRoomCode}
                onChange={(e) => setInputRoomCode(e.target.value.toUpperCase())}
                placeholder="VD: 892-416"
                className="w-full h-12 px-4 rounded-2xl border border-border bg-muted/50 text-base font-black text-center tracking-widest text-foreground focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={inputRoomCode.length < 4}
              className="w-full py-3.5 px-4 rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              Vào Phòng Đấu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
