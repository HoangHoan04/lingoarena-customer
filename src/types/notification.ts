export interface UserNotification {
  id: string;
  type: string;
  title: string;
  body: string;
  actionUrl?: string | null;
  data?: Record<string, unknown> | null;
  readAt?: string | null;
  createdAt?: string;
}

export interface NotificationPreference {
  id: string;
  eventType: string;
  channel: string;
  isEnabled: boolean;
}
