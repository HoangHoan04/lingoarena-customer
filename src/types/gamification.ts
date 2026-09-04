export interface GamificationStats {
  id?: string;
  userId?: string;
  totalPoints?: number;
  currentStreakDays?: number;
  longestStreakDays?: number;
  freezeCredits?: number;
  lastActivityDate?: string | null;
}

export interface DailyChallengeProgress {
  id?: string;
  progressCount?: number;
  targetCount?: number;
  completedAt?: string | null;
  pointsAwarded?: number;
}

export interface DailyChallenge {
  id: string;
  code: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
  challengeType?: string;
  targetCount?: number;
  rewardPoints?: number;
  progress?: DailyChallengeProgress | null;
}
