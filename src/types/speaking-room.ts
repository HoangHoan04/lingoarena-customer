export type SpeakingLevel = "A1-A2" | "B1-B2" | "C1-C2" | "ALL";

export const SPEAKING_TOPICS = [
  { id: "daily", name: "Đời sống hàng ngày (Daily Life)", icon: "☕" },
  { id: "ielts", name: "Luyện thi IELTS / TOEIC Speaking", icon: "🎯" },
  { id: "interview", name: "Phỏng vấn & Xin việc (Job Interview)", icon: "💼" },
  { id: "tech", name: "Công nghệ & Khởi nghiệp (Tech & Startups)", icon: "🚀" },
  { id: "travel", name: "Du lịch & Giao lưu văn hóa (Travel & Culture)", icon: "🌍" },
  { id: "freetalk", name: "Tám chuyện tự do (Free Talk & Chill)", icon: "✨" },
  { id: "business", name: "Tiếng Anh Thương mại (Business English)", icon: "📊" },
  { id: "entertainment", name: "Âm nhạc & Điện ảnh (Music & Movies)", icon: "🎬" },
];

export interface SpeakingParticipant {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  level: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  isHost: boolean;
  isMuted: boolean;
  isSpeaking: boolean;
  hasHandRaised: boolean;
  joinedAt: string;
}

export interface SpeakingRoom {
  id: string;
  name: string;
  topic: string;
  level: SpeakingLevel;
  maxParticipants: number;
  participants: SpeakingParticipant[];
  isPrivate: boolean;
  password?: string;
  createdAt: string;
  tags: string[];
  icebreakers?: string[];
  hostId: string;
}

export interface SpeakingChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderUsername?: string;
  senderAvatar?: string;
  content: string;
  createdAt: string;
  isSystem?: boolean;
}

export interface UserSpeakingProfile {
  username: string;
  fullName: string;
  gender: "male" | "female" | "other";
  dob: string;
  level: string;
  avatarUrl: string;
}
