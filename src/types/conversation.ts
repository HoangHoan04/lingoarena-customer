export interface ConversationParticipantRecord {
  id: string;
  conversationId: string;
  userId: string;
  role?: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  hasHandRaised?: boolean;
  joinedAt?: string;
  user?: {
    id?: string;
    fullName?: string;
    displayName?: string;
    username?: string;
    avatarUrl?: string;
  } | null;
}

export interface ConversationMessageRecord {
  id: string;
  conversationId: string;
  senderUserId?: string | null;
  senderRole?: string;
  content: string;
  translationVi?: string | null;
  audioUrl?: string | null;
  audioDurationSeconds?: number | null;
  feedbackJson?: Record<string, unknown> | null;
  isSystem?: boolean;
  sentAt?: string;
}

export interface ConversationRecord {
  id: string;
  conversationType?: string;
  title?: string | null;
  topic?: string | null;
  personaId?: string | null;
  hostUserId?: string | null;
  cefrLevel?: string | null;
  maxParticipants?: number | null;
  isPrivate?: boolean;
  icebreakersJson?: string[] | null;
  status?: string;
  messageCount?: number;
  createdAt?: string;
  lastMessageAt?: string | null;
  persona?: AiTutorPersonaApi | null;
  participants?: ConversationParticipantRecord[];
  messages?: ConversationMessageRecord[];
}

export interface AiTutorPersonaApi {
  id: string;
  code?: string;
  name: string;
  title: string;
  gender?: string;
  accent?: string;
  accentLabel?: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  roleDescription?: string;
  personality?: string;
  tagline?: string | null;
  topicsJson?: string[] | null;
  speechRate?: number | string;
  speechPitch?: number | string;
  voiceLang?: string;
  animeId?: string | null;
  welcomeMessage?: string;
  welcomeMessageVi?: string | null;
  samplePromptsJson?: Array<{ en?: string; vi?: string } | Record<string, unknown>> | null;
  isActive?: boolean;
}

export interface SpeakingRoomFilter {
  keyword?: string;
  status?: string;
  conversationType?: string;
  topic?: string;
}

export interface CreateSpeakingRoomPayload {
  title: string;
  topic?: string;
  cefrLevel?: string;
  maxParticipants?: number;
  isPrivate?: boolean;
  password?: string;
  icebreakersJson?: string[];
}
