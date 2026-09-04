"use client";

import type {
  SpeakingChatMessage,
  SpeakingParticipant,
  SpeakingRoom,
  UserSpeakingProfile,
} from "@/types/speaking-room";
import { useToastStore } from "@/stores/useToastStore";
import {
  AlertTriangle,
  Check,
  Copy,
  Crown,
  Hand,
  HandMetal,
  Lightbulb,
  LogOut,
  MessageSquare,
  Mic,
  MicOff,
  Radio,
  Send,
  Settings,
  ShieldAlert,
  Sparkles,
  UserMinus,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SpeakingLiveRoomProps {
  room: SpeakingRoom;
  currentUserProfile: UserSpeakingProfile;
  onLeaveRoom: () => void;
}

export function SpeakingLiveRoom({
  room,
  currentUserProfile,
  onLeaveRoom,
}: SpeakingLiveRoomProps) {
  const { addToast } = useToastStore();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Local participant state in room
  const [participants, setParticipants] = useState<SpeakingParticipant[]>(() => {
    // Ensure current user is in participants
    const exists = room.participants.some((p) => p.username === currentUserProfile.username);
    if (!exists) {
      const myParticipant: SpeakingParticipant = {
        id: `user-${currentUserProfile.username}`,
        name: currentUserProfile.fullName,
        username: currentUserProfile.username,
        avatarUrl: currentUserProfile.avatarUrl,
        level: currentUserProfile.level,
        gender: currentUserProfile.gender,
        dob: currentUserProfile.dob,
        isHost: room.hostId === `user-${currentUserProfile.username}` || room.participants.length === 0,
        isMuted: false,
        isSpeaking: false,
        hasHandRaised: false,
        joinedAt: "Vừa tham gia",
      };
      return [myParticipant, ...room.participants];
    }
    return room.participants;
  });

  const isCurrentUserHost = participants.find(
    (p) => p.username === currentUserProfile.username,
  )?.isHost;

  // Audio & Mic controls
  const [isMyMicMuted, setIsMyMicMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);

  // Chat Drawer & Messages
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState<SpeakingChatMessage[]>([
    {
      id: "msg-sys-1",
      senderId: "system",
      senderName: "Hệ thống LingoArena",
      content: `Chào mừng bạn đến với phòng "${room.name}". Hãy bật micro và tự tin giới thiệu bản thân nhé!`,
      createdAt: "10:00",
      isSystem: true,
    },
    {
      id: "msg-1",
      senderId: "host",
      senderName: participants[0]?.name || "Chủ phòng",
      senderUsername: participants[0]?.username || "host",
      senderAvatar: participants[0]?.avatarUrl,
      content: "Hello everyone! Welcome to our English speaking room. Feel free to speak up!",
      createdAt: "10:01",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Leave confirm modal
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Copy link
  const handleCopyInviteLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      addToast("Đã sao chép link phòng! Gửi cho bạn bè để cùng tham gia luyện nói.", "success");
    }
  };

  // Toggle my mic
  const handleToggleMyMic = () => {
    const nextMuted = !isMyMicMuted;
    setIsMyMicMuted(nextMuted);
    if (nextMuted) setIsSpeaking(false);

    setParticipants((prev) =>
      prev.map((p) =>
        p.username === currentUserProfile.username
          ? { ...p, isMuted: nextMuted, isSpeaking: nextMuted ? false : p.isSpeaking }
          : p,
      ),
    );

    addToast(nextMuted ? "Đã tắt micro của bạn" : "Đã bật micro", "info");
  };

  // Toggle raise hand
  const handleToggleHand = () => {
    const nextHand = !isHandRaised;
    setIsHandRaised(nextHand);

    setParticipants((prev) =>
      prev.map((p) =>
        p.username === currentUserProfile.username
          ? { ...p, hasHandRaised: nextHand }
          : p,
      ),
    );

    addToast(nextHand ? "Đã nâng tay xin phát biểu" : "Đã hạ tay", "info");
  };

  // Host: Kick member
  const handleKickMember = (participant: SpeakingParticipant) => {
    if (participant.username === currentUserProfile.username) return;

    setParticipants((prev) => prev.filter((p) => p.id !== participant.id));

    setChatMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        senderId: "system",
        senderName: "Hệ thống",
        content: `Chủ phòng đã mời ${participant.name} (@${participant.username}) rời khỏi phòng.`,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isSystem: true,
      },
    ]);

    addToast(`Đã xóa ${participant.name} khỏi phòng`, "success");
  };

  // Host: Mute member
  const handleMuteMember = (participant: SpeakingParticipant) => {
    setParticipants((prev) =>
      prev.map((p) => (p.id === participant.id ? { ...p, isMuted: true, isSpeaking: false } : p)),
    );
    addToast(`Đã tắt mic của ${participant.name}`, "info");
  };

  // Send Chat Message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: SpeakingChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUserProfile.username,
      senderName: currentUserProfile.fullName,
      senderUsername: currentUserProfile.username,
      senderAvatar: currentUserProfile.avatarUrl,
      content: chatInput.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput("");

    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* ROOM HEADER */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 p-4 sm:p-5 shadow-md flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-300 flex items-center justify-center font-black">
            <Radio className="size-5 text-purple-600 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate max-w-sm lg:max-w-md">
                {room.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-black uppercase">
                {room.level}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Chủ đề: <strong className="text-slate-700 dark:text-slate-300">{room.topic}</strong> · {participants.length}/{room.maxParticipants} thành viên
            </p>
          </div>
        </div>

        {/* HEADER ACTIONS */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyInviteLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 text-xs font-bold cursor-pointer transition-colors shadow-2xs"
            title="Sao chép link phòng"
          >
            <Copy className="size-3.5 text-purple-600" />
            <span className="hidden sm:inline">Sao chép link mời</span>
          </button>

          <button
            type="button"
            onClick={() => setShowLeaveModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-xs font-black transition-colors cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span>Rời phòng</span>
          </button>
        </div>
      </div>

      {/* MAIN SPEAKING ARENA & CHAT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: PARTICIPANTS GRID & ICEBREAKERS */}
        <div className={isChatOpen ? "lg:col-span-8 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* PARTICIPANTS VOICE CARDS GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {participants.map((p) => {
              const isMe = p.username === currentUserProfile.username;

              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl border-2 p-5 text-center transition-all flex flex-col items-center justify-between space-y-3 ${
                    p.isSpeaking
                      ? "border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-lg ring-4 ring-emerald-400/30 animate-pulse"
                      : isMe
                        ? "border-purple-300 dark:border-purple-800/80 bg-purple-50/20 dark:bg-purple-950/10"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900"
                  }`}
                >
                  {/* TOP BADGES: HOST & HAND */}
                  <div className="w-full flex items-center justify-between min-h-5 px-1">
                    {p.isHost ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-[9px] font-black uppercase">
                        <Crown className="size-2.5 text-amber-500" />
                        <span>Chủ phòng</span>
                      </span>
                    ) : (
                      <span />
                    )}

                    {p.hasHandRaised && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[9px] font-black animate-bounce">
                        <Hand className="size-2.5" />
                        <span>Giơ tay</span>
                      </span>
                    )}
                  </div>

                  {/* AVATAR WITH SOUNDWAVE PULSE */}
                  <div className="relative my-1">
                    <div
                      className={`size-20 sm:size-24 rounded-full overflow-hidden border-3 mx-auto transition-all ${
                        p.isSpeaking
                          ? "border-emerald-500 scale-105 shadow-xl shadow-emerald-500/30"
                          : p.isHost
                            ? "border-purple-500"
                            : "border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      <img
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* MIC STATUS FLOATING BADGE */}
                    <span
                      className={`absolute -bottom-1 -right-1 p-1.5 rounded-full shadow-md text-white ${
                        p.isMuted
                          ? "bg-rose-600 ring-2 ring-white dark:ring-slate-900"
                          : p.isSpeaking
                            ? "bg-emerald-600 ring-2 ring-emerald-300 animate-ping"
                            : "bg-emerald-600 ring-2 ring-white dark:ring-slate-900"
                      }`}
                    >
                      {p.isMuted ? <MicOff className="size-3" /> : <Mic className="size-3" />}
                    </span>
                  </div>

                  {/* NAME & HANDLE */}
                  <div className="space-y-0.5 w-full">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white truncate">
                      {p.name} {isMe ? "(Bạn)" : ""}
                    </h4>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold truncate">
                      @{p.username} · {p.level}
                    </p>
                  </div>

                  {/* HOST ACTIONS ON OTHER MEMBERS */}
                  {isCurrentUserHost && !isMe && (
                    <div className="flex items-center gap-1.5 pt-1 w-full border-t border-slate-100 dark:border-slate-800 justify-center">
                      {!p.isMuted && (
                        <button
                          type="button"
                          onClick={() => handleMuteMember(p)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-rose-600 text-[10px] cursor-pointer"
                          title="Tắt mic thành viên này"
                        >
                          <MicOff className="size-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleKickMember(p)}
                        className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold cursor-pointer inline-flex items-center gap-1"
                        title="Xóa thành viên khỏi phòng"
                      >
                        <UserMinus className="size-3" />
                        <span className="text-[9px]">Xóa</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ICEBREAKER TOPIC PROMPTS */}
          {room.icebreakers && room.icebreakers.length > 0 && (
            <div className="rounded-3xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/40 dark:bg-purple-950/20 p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-purple-700 dark:text-purple-300 font-black text-xs uppercase tracking-wider">
                <Lightbulb className="size-4 text-amber-500" />
                <span>Gợi ý câu hỏi mở đầu thảo luận (Icebreakers)</span>
              </div>

              <div className="grid gap-2">
                {room.icebreakers.map((prompt, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-start gap-2.5 shadow-2xs"
                  >
                    <span className="flex items-center justify-center size-5 rounded-full bg-purple-600 text-white text-[10px] font-black shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{prompt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: IN-ROOM REALTIME CHAT */}
        {isChatOpen && (
          <div className="lg:col-span-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-sm space-y-4 h-[600px] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="size-4 text-purple-600" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Trò Chuyện Trực Tiếp
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer lg:hidden"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* MESSAGES LIST */}
            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
              {chatMessages.map((msg) => {
                if (msg.isSystem) {
                  return (
                    <div
                      key={msg.id}
                      className="p-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/30 text-[11px] text-purple-800 dark:text-purple-300 font-semibold text-center border border-purple-100 dark:border-purple-900"
                    >
                      {msg.content}
                    </div>
                  );
                }

                const isMe = msg.senderId === currentUserProfile.username;

                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : ""}`}
                  >
                    {msg.senderAvatar && (
                      <div className="size-7 rounded-full overflow-hidden shrink-0 border">
                        <img
                          src={msg.senderAvatar}
                          alt={msg.senderName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div
                      className={`max-w-[80%] rounded-2xl p-3 text-xs space-y-1 ${
                        isMe
                          ? "bg-purple-600 text-white rounded-tr-none"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 text-[10px] opacity-80">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>{msg.createdAt}</span>
                      </div>
                      <p className="leading-relaxed break-words">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* CHAT INPUT */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Gõ tin nhắn, chia sẻ từ mới..."
                className="w-full h-10 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:border-purple-600 focus:outline-none"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white cursor-pointer shrink-0 shadow-md"
              >
                <Send className="size-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* BOTTOM FIXED VOICE CONTROL TOOLBAR */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-slate-950/90 text-white rounded-full px-6 py-3 shadow-2xl border border-slate-700 backdrop-blur-xl flex items-center gap-3 sm:gap-5">
        {/* MUTE / UNMUTE BUTTON */}
        <button
          type="button"
          onClick={handleToggleMyMic}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs sm:text-sm transition-all cursor-pointer shadow-md ${
            isMyMicMuted
              ? "bg-rose-600 hover:bg-rose-700 text-white"
              : "bg-emerald-600 hover:bg-emerald-700 text-white"
          }`}
        >
          {isMyMicMuted ? <MicOff className="size-4" /> : <Mic className="size-4" />}
          <span>{isMyMicMuted ? "Bật Mic" : "Tắt Mic"}</span>
        </button>

        {/* RAISE HAND */}
        <button
          type="button"
          onClick={handleToggleHand}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            isHandRaised
              ? "bg-amber-500 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          }`}
          title="Nâng tay phát biểu"
        >
          <Hand className="size-4" />
        </button>

        {/* TOGGLE CHAT */}
        <button
          type="button"
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`p-2.5 rounded-full transition-all cursor-pointer ${
            isChatOpen
              ? "bg-purple-600 text-white"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300"
          }`}
          title="Khung trò chuyện"
        >
          <MessageSquare className="size-4" />
        </button>

        {/* LEAVE ROOM */}
        <button
          type="button"
          onClick={() => setShowLeaveModal(true)}
          className="p-2.5 rounded-full bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer"
          title="Rời phòng"
        >
          <LogOut className="size-4" />
        </button>
      </div>

      {/* CONFIRM LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-center shadow-2xl animate-in zoom-in-95">
            <div className="size-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="size-7" />
            </div>

            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Bạn có chắc muốn rời phòng nói chuyện này?
            </h3>
            <p className="text-xs text-slate-500">
              Bạn có thể quay lại sảnh chính để chọn phòng khác bất cứ lúc nào.
            </p>

            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 rounded-xl border text-xs font-bold cursor-pointer"
              >
                Ở lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowLeaveModal(false);
                  onLeaveRoom();
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Rời phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
