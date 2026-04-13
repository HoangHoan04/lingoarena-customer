export type NotificationCategory =
  | "system"
  | "booking"
  | "payment"
  | "promotion"
  | "general"
  | string;

export type NotificationPlatform = "WEB" | "APP" | string;
export type NotificationColorType = "BLUE" | "RED" | "GREEN" | "YELLOW" | string;

export interface NotificationItem {
  id: string;
  studentId?: string;
  teacherId?: string;
  userId?: string;
  title: string;
  description?: string;
  titleEn?: string;
  descriptionEn?: string;
  callbackUrl?: string;
  category: NotificationCategory;
  platform: NotificationPlatform;
  colorType: NotificationColorType;
  isNotifyOffScreen: boolean;
  isSeen: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface NotificationFilterDto {
  userId?: string;
  category?: NotificationCategory;
  platform?: NotificationPlatform;
  isSeen?: boolean;
}

export interface NotificationPaginationDto {
  skip?: number;
  take?: number;
  where: NotificationFilterDto;
}

export interface MarkReadListDto {
  lstId: string[];
}

export interface NotificationCountResponse {
  countAll: number;
}

export interface NotificationPaginationResponse {
  data: NotificationItem[];
  total: number;
}
