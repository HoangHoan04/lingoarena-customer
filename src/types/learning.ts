import type { PublicQuestion, QuestionLookup } from "./question";

export interface LearningGoal {
  id: string;
  examTypeId: string;
  currentScore?: number | null;
  targetScore: number;
  examDate?: string | null;
  minutesPerDay: number;
  daysPerWeek: number;
  isCurrent: boolean;
  examType?: QuestionLookup | null;
}

export interface LearningPathItem {
  id: string;
  learningPathId: string;
  itemType: string;
  itemId: string;
  scheduledDate: string;
  sortOrder: number;
  status: string;
  reasonJson?: {
    title?: string;
    href?: string;
  } | null;
}

export interface LearningPath {
  id: string;
  userId: string;
  goalId: string;
  version: number;
  status: string;
  generatedBy?: string;
  generatedAt?: string;
  goal?: LearningGoal;
  items?: LearningPathItem[];
}

export interface UserDailyActivity {
  id: string;
  activityDate: string;
  lessonsCompleted: number;
  questionsAnswered: number;
  questionsCorrect: number;
  vocabularyReviewed: number;
  assessmentsAttempted: number;
  arenaMatchesPlayed: number;
  pointsEarned: number;
}

export interface UserErrorItem {
  id: string;
  questionId: string;
  errorType: string;
  errorReason?: string | null;
  userNote?: string | null;
  wrongCount: number;
  lastWrongAt: string;
  isResolved: boolean;
  question?: PublicQuestion;
}

export interface ProductPrice {
  id: string;
  productId: string;
  currency: string;
  amount: number | string;
  originalAmount?: number | string | null;
  billingPeriod?: string | null;
  isActive: boolean;
}

export interface ProductEntitlement {
  id: string;
  productId: string;
  resourceType: string;
  resourceId?: string | null;
  accessLevel: string;
  usageLimit?: number;
  durationDays?: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  nameEn?: string | null;
  productType: string;
  description?: string | null;
  descriptionEn?: string | null;
  thumbnailUrl?: string | null;
  status: string;
  prices?: ProductPrice[];
  entitlements?: ProductEntitlement[];
}

export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  currency: string;
  totalAmount: number | string;
  paidAt?: string | null;
}

export interface LeaderboardRow {
  id: string;
  rank: number;
  userId: string;
  score: number;
  metadataJson?: {
    username?: string;
    currentStreakDays?: number;
  } | null;
}
