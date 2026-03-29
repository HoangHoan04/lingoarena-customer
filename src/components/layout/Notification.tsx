import { useTheme } from "@/context/ThemeContext";
import type { NotificationType } from "@/dto";
import {
  useMarkAllRead,
  useMarkReadList,
  usePaginationNotification,
  useUnreadCount,
} from "@/hooks/notify/useNotification";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";

export default function Notification() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { data: notifications, refetch } = usePaginationNotification({
    skip: 0,
    take: 10,
    where: {},
  });

  const { count: unreadCount, refetch: refetchCount } = useUnreadCount();

  const { onMarkAllRead } = useMarkAllRead();

  const { onMarkReadList } = useMarkReadList();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleRefresh = () => {
    refetch();
    refetchCount();
  };

  const handleViewAll = () => {
    setIsOpen(false);
  };

  const handleMarkAllAsRead = () => {
    onMarkAllRead();
  };

  const handleNotificationClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      onMarkReadList([id]);
    }
  };

  const getIconByType = (type: NotificationType) => {
    switch (type) {
      case "system":
        return "pi pi-cog text-blue-500";
      case "booking":
        return "pi pi-calendar text-green-500";
      case "payment":
        return "pi pi-wallet text-orange-500";
      case "promotion":
        return "pi pi-gift text-purple-500";
      case "general":
      default:
        return "pi pi-bell text-gray-500";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="relative inline-block" ref={containerRef}>
      <div className="relative">
        <Button
          icon="pi pi-bell"
          rounded
          text
          onClick={() => setIsOpen(!isOpen)}
          tooltip="Thông báo"
          tooltipOptions={{ position: "bottom" }}
          pt={{
            root: {
              className: `
                !border-none !shadow-none !ring-0 !outline-none 
                !focus:ring-0 !focus:outline-none !focus:border-none
                transition-all duration-300 active:scale-90
                w-10 h-10 flex items-center justify-center
                ${isOpen ? "bg-indigo-50 dark:bg-white/10" : "bg-transparent"}
              `,
            },
            icon: {
              className: `text-xl ${isDark ? "text-cyan-400" : "text-black"} opacity-80 group-hover:opacity-100`,
            },
          }}
        />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 9 ? "9+" : unreadCount}
            severity="danger"
            className="absolute -top-1 -right-1 pointer-events-none shadow-sm"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-(--surface-overlay) text-(--text-color) border border-(--surface-border) shadow-2xl rounded-xl z-50 overflow-hidden origin-top-right animate-[fadeIn_0.2s_ease-out]">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-4 py-3 border-b border-(--surface-border)">
              <h3 className="text-lg font-semibold m-0">Thông báo</h3>
              <div className="flex gap-1">
                <Button
                  icon="pi pi-check-square"
                  rounded
                  text
                  size="small"
                  onClick={handleMarkAllAsRead}
                  tooltip="Đánh dấu tất cả là đã đọc"
                  className="w-8! h-8!"
                  disabled={unreadCount === 0}
                />
                <Button
                  icon="pi pi-refresh"
                  rounded
                  text
                  size="small"
                  onClick={handleRefresh}
                  tooltip="Làm mới"
                  className="w-8! h-8!"
                />
              </div>
            </div>

            <div className="flex flex-col max-h-100 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-(--text-color-secondary)">
                  <i className="pi pi-bell-slash text-4xl mb-3 opacity-50" />
                  <p className="m-0 text-sm">Không có thông báo mới</p>
                </div>
              ) : (
                notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    onClick={() =>
                      handleNotificationClick(
                        notification.id,
                        notification.isRead,
                      )
                    }
                    className={`group flex gap-4 p-4 border-b border-(--surface-border) last:border-0 cursor-pointer transition-all duration-200 hover:bg-(--surface-hover) 
                    ${
                      !notification.isRead
                        ? "bg-(--primary-50) dark:bg-white/5"
                        : ""
                    }`}
                  >
                    <div className="shrink-0 mt-1">
                      <i
                        className={`${getIconByType(
                          notification.notificationType,
                        )} text-xl transition-transform group-hover:scale-110`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4
                          className={`text-sm m-0 truncate leading-tight ${
                            !notification.isRead
                              ? "font-bold"
                              : "font-medium opacity-90"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="shrink-0 w-2.5 h-2.5 rounded-full bg-blue-500 mt-1 shadow-sm animate-pulse" />
                        )}
                      </div>

                      <p className="text-sm m-0 mb-2 line-clamp-2 text-(--text-color-secondary) leading-relaxed">
                        {notification.content}
                      </p>

                      <span className="text-xs text-(--text-color-secondary) opacity-70 flex items-center gap-1">
                        <i className="pi pi-clock text-[10px]"></i>
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-(--surface-border) bg-(--surface-ground) text-center">
                <Button
                  label="Xem tất cả thông báo"
                  link
                  size="small"
                  className="w-full text-sm font-semibold no-underline!"
                  onClick={handleViewAll}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
