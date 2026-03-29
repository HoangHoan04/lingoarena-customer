export type NotificationType =
  | "system"
  | "booking"
  | "payment"
  | "promotion"
  | "general";
export type NotificationPriority = "low" | "normal" | "high" | "urgent";
export type RelatedEntityType = "booking" | "payment" | "tour" | "user";

export interface NotificationItem {
  id: string;
  customerId: string;
  title: string;
  content: string;
  notificationType: NotificationType;
  relatedEntity?: RelatedEntityType | null;
  relatedId?: string | null;
  isRead: boolean;
  readAt?: string | null;
  priority: NotificationPriority;
  actionUrl?: string | null;
  expiresAt?: string | null;
  icon?: string | null;
  color?: string | null;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  customer?: {
    id: string;
    fullName?: string;
    email?: string;
    avatar?: string;
  };
}

export interface NotificationFilterDto {
  notificationType?: NotificationType;
  priority?: NotificationPriority;
  isRead?: boolean;
  relatedEntity?: RelatedEntityType;
}

export interface NotificationPaginationDto {
  skip?: number;
  take?: number;
  where?: NotificationFilterDto;
}

export interface MarkReadListDto {
  lstId: string[];
}

export interface NotificationCountResponse {
  countAll: number;
}

export interface NotificationSettingDto {
  id: string;
  customerId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  promotionNotifications: boolean;
  bookingNotifications: boolean;
  recommendationNotifications: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateNotificationSettingDto {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  smsNotifications?: boolean;
  promotionNotifications?: boolean;
  bookingNotifications?: boolean;
  recommendationNotifications?: boolean;
}

export interface NotificationPaginationResponse {
  data: NotificationItem[];
  total: number;
}
