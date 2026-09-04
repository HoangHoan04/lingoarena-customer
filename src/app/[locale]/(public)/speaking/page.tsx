"use client";

import {
  SpeakingActiveRoomsList,
  SpeakingCreateRoomTab,
  SpeakingLiveRoom,
  SpeakingLobbyHeader,
  SpeakingUsernameModal,
} from "@/components/speaking";
import { useTopicsQuery } from "@/hooks/queries/useQuestionQueries";
import { mapConversationToSpeakingRoom } from "@/lib/skill-mappers";
import { conversationService } from "@/services/conversation.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { SpeakingLevel, SpeakingRoom, UserSpeakingProfile } from "@/types/speaking-room";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function cefrFromLevel(level?: SpeakingLevel) {
  if (level === "A1-A2") return "A2";
  if (level === "B1-B2") return "B1";
  if (level === "C1-C2") return "C1";
  return undefined;
}

export default function SpeakingPage() {
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const { data: topics = [], isLoading: topicsLoading } = useTopicsQuery();
  const [selectedLevel, setSelectedLevel] = useState<SpeakingLevel>("ALL");
  const [selectedTopic, setSelectedTopic] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<"rooms" | "create">("rooms");
  const [rooms, setRooms] = useState<SpeakingRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoom, setActiveRoom] = useState<SpeakingRoom | null>(null);
  const [userProfile, setUserProfile] = useState<UserSpeakingProfile | null>(null);
  const [isUsernameModalOpen, setIsUsernameModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    | { type: "join"; room: SpeakingRoom }
    | { type: "create"; roomData: Partial<SpeakingRoom> }
    | null
  >(null);

  const selectedTopicName = useMemo(() => {
    if (selectedTopic === "ALL") return undefined;
    return topics.find((item) => item.id === selectedTopic || item.value === selectedTopic)?.name;
  }, [selectedTopic, topics]);

  const loadRooms = async () => {
    setLoading(true);
    try {
      const res = await conversationService.paginationSpeakingRooms(0, 40, {
        topic: selectedTopicName,
      });
      setRooms((res.data || []).map(mapConversationToSpeakingRoom));
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("lingoarena_speaking_profile");
      if (saved) setUserProfile(JSON.parse(saved));
    } catch {
      // ignore
    }
    loadRooms();
  }, [selectedTopicName]);

  const ensureAuth = () => {
    if (!isAuthenticated) {
      addToast("Đăng nhập để tạo hoặc tham gia phòng nói.", "info");
      return false;
    }
    return true;
  };

  const joinRoom = async (room: SpeakingRoom) => {
    if (!ensureAuth()) return;
    try {
      const joined = await conversationService.joinSpeakingRoom(room.id, room.password);
      setActiveRoom(mapConversationToSpeakingRoom(joined));
      addToast(`Đã tham gia phòng "${joined.title || room.name}"`, "success");
    } catch (err: any) {
      addToast(err?.message || "Không tham gia được phòng.", "error");
    }
  };

  const handleJoinRoom = (room: SpeakingRoom) => {
    if (!userProfile) {
      setPendingAction({ type: "join", room });
      setIsUsernameModalOpen(true);
      return;
    }
    joinRoom(room);
  };

  const createRoom = async (newRoomData: Partial<SpeakingRoom>) => {
    if (!ensureAuth()) return;
    try {
      const created = await conversationService.createSpeakingRoom({
        title: newRoomData.name || "Phòng luyện nói tiếng Anh",
        topic: newRoomData.topic,
        cefrLevel: cefrFromLevel(newRoomData.level as SpeakingLevel),
        maxParticipants: newRoomData.maxParticipants || 4,
        isPrivate: !!newRoomData.isPrivate,
        password: newRoomData.password,
      });
      const mapped = mapConversationToSpeakingRoom(created);
      setRooms((prev) => [mapped, ...prev]);
      setActiveRoom(mapped);
      addToast("Tạo phòng luyện nói thành công!", "success");
    } catch (err: any) {
      addToast(err?.message || "Không tạo được phòng.", "error");
    }
  };

  const handleCreateRoom = (newRoomData: Partial<SpeakingRoom>) => {
    if (!userProfile) {
      setPendingAction({ type: "create", roomData: newRoomData });
      setIsUsernameModalOpen(true);
      return;
    }
    createRoom(newRoomData);
  };

  const handleSaveProfile = (profile: UserSpeakingProfile) => {
    setUserProfile(profile);
    try {
      localStorage.setItem("lingoarena_speaking_profile", JSON.stringify(profile));
    } catch {
      // ignore
    }
    setIsUsernameModalOpen(false);
    addToast(`Đã thiết lập @${profile.username} thành công!`, "success");
    if (pendingAction?.type === "join") joinRoom(pendingAction.room);
    if (pendingAction?.type === "create") createRoom(pendingAction.roomData);
    setPendingAction(null);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {activeRoom && userProfile ? (
        <SpeakingLiveRoom
          room={activeRoom}
          currentUserProfile={userProfile}
          onLeaveRoom={() => {
            setActiveRoom(null);
            addToast("Đã rời phòng luyện nói", "info");
            loadRooms();
          }}
        />
      ) : (
        <div className="space-y-8">
          <SpeakingLobbyHeader
            selectedLevel={selectedLevel}
            selectedTopic={selectedTopic}
            topics={topics}
            topicsLoading={topicsLoading}
            activeTab={activeTab}
            onSelectLevel={setSelectedLevel}
            onSelectTopic={setSelectedTopic}
            onChangeTab={setActiveTab}
            activeRoomsCount={rooms.length}
          />
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-purple-600" />
            </div>
          ) : activeTab === "rooms" ? (
            <SpeakingActiveRoomsList
              rooms={rooms}
              selectedLevel={selectedLevel}
              selectedTopic={selectedTopicName || "ALL"}
              onJoinRoom={handleJoinRoom}
              onCreateRoomClick={() => setActiveTab("create")}
            />
          ) : (
            <SpeakingCreateRoomTab topics={topics} onCreateRoom={handleCreateRoom} />
          )}
        </div>
      )}
      <SpeakingUsernameModal
        isOpen={isUsernameModalOpen}
        onSaveProfile={handleSaveProfile}
        onClose={() => {
          setIsUsernameModalOpen(false);
          setPendingAction(null);
        }}
      />
    </div>
  );
}
