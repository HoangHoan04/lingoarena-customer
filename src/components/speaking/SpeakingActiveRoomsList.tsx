"use client";

import type { SpeakingRoom } from "@/types/speaking-room";
import { useToastStore } from "@/stores/useToastStore";
import {
  KeyRound,
  Lock,
  Mic,
  PlusCircle,
  Radio,
  Search,
  Sparkles,
  Users,
  Volume2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

interface SpeakingActiveRoomsListProps {
  rooms: SpeakingRoom[];
  selectedLevel: string;
  selectedTopic: string;
  onJoinRoom: (room: SpeakingRoom) => void;
  onCreateRoomClick: () => void;
}

export function SpeakingActiveRoomsList({
  rooms,
  selectedLevel,
  selectedTopic,
  onJoinRoom,
  onCreateRoomClick,
}: SpeakingActiveRoomsListProps) {
  const { addToast } = useToastStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Private room password modal
  const [passwordRoom, setPasswordRoom] = useState<SpeakingRoom | null>(null);
  const [enteredPassword, setEnteredPassword] = useState("");

  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      // Filter level
      if (selectedLevel !== "ALL" && r.level !== selectedLevel && r.level !== "ALL") {
        return false;
      }
      // Filter topic
      if (selectedTopic !== "ALL" && r.topic !== selectedTopic) {
        return false;
      }
      // Filter availability
      if (onlyAvailable && r.participants.length >= r.maxParticipants) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = r.name.toLowerCase().includes(q);
        const matchesTopic = r.topic.toLowerCase().includes(q);
        const matchesTag = r.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesTopic && !matchesTag) return false;
      }
      return true;
    });
  }, [rooms, selectedLevel, selectedTopic, onlyAvailable, searchQuery]);

  const handleRoomClick = (room: SpeakingRoom) => {
    if (room.participants.length >= room.maxParticipants) {
      addToast("Phòng này hiện đã đầy. Vui lòng chọn phòng khác hoặc tạo phòng mới.", "info");
      return;
    }

    if (room.isPrivate) {
      setPasswordRoom(room);
      setEnteredPassword("");
      return;
    }

    onJoinRoom(room);
  };

  const handleVerifyPassword = () => {
    if (!passwordRoom) return;

    if (passwordRoom.password && enteredPassword !== passwordRoom.password) {
      addToast("Mật khẩu phòng không chính xác!", "error");
      return;
    }

    const target = passwordRoom;
    setPasswordRoom(null);
    onJoinRoom(target);
  };

  return (
    <div className="space-y-6">
      {/* SEARCH & FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative w-full sm:max-w-md flex items-center">
          <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm theo tên phòng, chủ đề, tag..."
            className="w-full h-11 pl-10 pr-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:border-purple-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="size-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
            <span>Chỉ hiện phòng còn chỗ</span>
          </label>

          <span className="text-xs font-mono font-bold text-slate-400">
            {filteredRooms.length} phòng tìm thấy
          </span>
        </div>
      </div>

      {/* ROOMS GRID */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRooms.map((room) => {
            const isFull = room.participants.length >= room.maxParticipants;
            const speakingMember = room.participants.find((p) => p.isSpeaking);

            return (
              <div
                key={room.id}
                className={`group rounded-3xl border-2 transition-all p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4 ${
                  isFull
                    ? "border-slate-200/70 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 opacity-80"
                    : "border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/60 hover:shadow-xl"
                }`}
              >
                <div className="space-y-3.5">
                  {/* TOP BADGES */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-black uppercase">
                        {room.level}
                      </span>

                      {room.isPrivate ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                          <Lock className="size-2.5" />
                          <span>Riêng tư</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold">
                          <span className="size-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Công khai</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-500">
                      <Users className="size-3.5 text-purple-500" />
                      <span>
                        <strong className="text-purple-600 dark:text-purple-400 font-black">{room.participants.length}</strong>/{room.maxParticipants}
                      </span>
                    </div>
                  </div>

                  {/* ROOM TITLE & TOPIC */}
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 transition-colors leading-snug">
                      {room.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <span>Chủ đề:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{room.topic}</strong>
                    </p>
                  </div>

                  {/* PARTICIPANTS AVATARS & SPEAKING WAVE */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400">
                        Thành viên trong phòng:
                      </span>
                      {speakingMember && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 animate-pulse">
                          <Mic className="size-3" />
                          <span>{speakingMember.name.split(" ")[0]} đang nói</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto py-1">
                      {room.participants.map((p) => (
                        <div
                          key={p.id}
                          className="relative group/user shrink-0"
                          title={`${p.name} (@${p.username}) - ${p.level}${p.isHost ? " (Chủ phòng)" : ""}`}
                        >
                          <div
                            className={`size-9 rounded-full overflow-hidden border-2 ${
                              p.isSpeaking
                                ? "border-emerald-500 ring-2 ring-emerald-400 animate-pulse"
                                : p.isHost
                                  ? "border-purple-600"
                                  : "border-slate-200 dark:border-slate-700"
                            }`}
                          >
                            <img
                              src={p.avatarUrl}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {p.isMuted && (
                            <span className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-slate-800 text-white flex items-center justify-center text-[8px]">
                              ✕
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TAGS */}
                  <div className="flex flex-wrap gap-1.5">
                    {room.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-medium"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* JOIN BUTTON */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleRoomClick(room)}
                    disabled={isFull}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md ${
                      isFull
                        ? "bg-slate-200 text-slate-500 cursor-not-allowed shadow-none"
                        : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/25 hover:scale-102 active:scale-98"
                    }`}
                  >
                    {isFull ? (
                      <span>Phòng đã đầy</span>
                    ) : room.isPrivate ? (
                      <>
                        <KeyRound className="size-4" />
                        <span>Nhập mã để tham gia</span>
                      </>
                    ) : (
                      <>
                        <Mic className="size-4" />
                        <span>Vào phòng nói chuyện ngay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="size-16 rounded-3xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center mx-auto shadow-md">
            <Mic className="size-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h4 className="text-base font-black text-slate-900 dark:text-white">
              Chưa có phòng nào khớp với bộ lọc của bạn
            </h4>
            <p className="text-xs text-slate-500">
              Hãy thử chọn "Tất cả trình độ / Tất cả chủ đề" hoặc tự tạo một phòng nói chuyện của riêng bạn!
            </p>
          </div>
          <button
            type="button"
            onClick={onCreateRoomClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-lg shadow-purple-600/25 cursor-pointer"
          >
            <PlusCircle className="size-4" />
            <span>Tạo phòng nói chuyện mới ngay</span>
          </button>
        </div>
      )}

      {/* PRIVATE ROOM PASSWORD MODAL */}
      {passwordRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-sm">
                <Lock className="size-4" />
                <span>Phòng Riêng Tư - Cần Mật Khẩu</span>
              </div>
              <button
                type="button"
                onClick={() => setPasswordRoom(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {passwordRoom.name}
              </h4>
              <p className="text-xs text-slate-500">
                Vui lòng nhập mật khẩu do chủ phòng cung cấp để tham gia phòng nói chuyện này.
              </p>
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
                placeholder="Nhập mật khẩu phòng..."
                className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-bold focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setPasswordRoom(null)}
                className="px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleVerifyPassword}
                className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-black shadow-md cursor-pointer"
              >
                Vào phòng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
