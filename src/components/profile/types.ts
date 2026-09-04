import type { UserVocabStats } from "@/types/vocabulary";

export type ProfileTab = "info" | "security" | "stats";

export interface ProfileHeaderData {
  fullName: string;
  customerCode: string;
  memberRole: string;
  email: string;
  phone: string;
  createdAt: string | null;
  avatarUrl: string;
  emailVerifiedAt: Date | string | null;
  vocabStats: UserVocabStats | null;
  assessmentTotal: number;
}
