"use client";

import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { NotificationPreference, UserNotification } from "@/types/notification";
import { Bell, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const PREF_ROWS: Array<{ channel: string; eventType: string; label: string }> = [
  { channel: "in_app", eventType: "grading_ready", label: "Kết quả chấm bài" },
  { channel: "in_app", eventType: "daily_challenge", label: "Thử thách ngày" },
  { channel: "in_app", eventType: "arena", label: "Arena" },
  { channel: "in_app", eventType: "classroom", label: "Lớp học" },
];

function mergePrefs(loaded: NotificationPreference[]) {
  return PREF_ROWS.map((row) => {
    const match = loaded.find((item) => item.channel === row.channel && item.eventType === row.eventType);
    return { ...row, isEnabled: match?.isEnabled ?? true };
  });
}

export default function NotificationsPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [items, setItems] = useState<UserNotification[]>([]);
  const [prefs, setPrefs] = useState(mergePrefs([]));
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [readingId, setReadingId] = useState<string | null>(null);
  const [savingPrefs, setSavingPrefs] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const [res, nextPrefs] = await Promise.all([
        notificationService.mePagination(0, 50),
        notificationService.preferences().catch(() => []),
      ]);
      setItems(res.data);
      setTotal(res.total);
      setPrefs(mergePrefs(nextPrefs));
    } catch (err: any) {
      addToast(err?.message || "Không tải được thông báo", "error");
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    load();
  }, [isAuthenticated]);

  const markRead = async (id: string) => {
    setReadingId(id);
    try {
      const updated = await notificationService.markRead(id);
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, ...updated, readAt: updated.readAt || new Date().toISOString() } : item,
        ),
      );
    } catch (err: any) {
      addToast(err?.message || "Không đánh dấu được đã đọc", "error");
    } finally {
      setReadingId(null);
    }
  };

  const togglePref = async (eventType: string, channel: string, isEnabled: boolean) => {
    const next = prefs.map((item) =>
      item.eventType === eventType && item.channel === channel ? { ...item, isEnabled } : item,
    );
    setPrefs(next);
    setSavingPrefs(true);
    try {
      await notificationService.upsertPreferences(next);
    } catch (err: any) {
      addToast(err?.message || "Không lưu được tùy chọn", "error");
    } finally {
      setSavingPrefs(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6 space-y-2">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Bell className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black">Thông báo</h1>
            <p className="text-sm text-muted-foreground">{total} thông báo</p>
          </div>
        </div>
      </section>

      {isAuthenticated && (
        <section className="rounded-3xl border border-border bg-card p-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-black">Tùy chọn thông báo</h2>
            {savingPrefs && <Loader2 className="size-4 animate-spin text-primary" />}
          </div>
          <div className="space-y-2">
            {prefs.map((pref) => (
              <label key={`${pref.channel}:${pref.eventType}`} className="flex items-center justify-between gap-3 text-sm">
                <span>{pref.label}</span>
                <input
                  type="checkbox"
                  checked={pref.isEnabled}
                  onChange={(e) => togglePref(pref.eventType, pref.channel, e.target.checked)}
                />
              </label>
            ))}
          </div>
        </section>
      )}

      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="rounded-3xl border border-border bg-card p-8 text-center space-y-2">
          <p className="font-bold">Chưa có dữ liệu</p>
          <p className="text-sm text-muted-foreground">Bạn chưa có thông báo nào.</p>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => {
          const unread = !item.readAt;
          return (
            <article
              key={item.id}
              className={`rounded-3xl border p-5 space-y-2 ${
                unread ? "border-primary/30 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {item.type}
                  </p>
                  <h2 className="font-black text-sm sm:text-base">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">{item.body}</p>
                </div>
                {unread && (
                  <button
                    type="button"
                    disabled={readingId === item.id}
                    onClick={() => markRead(item.id)}
                    className="inline-flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-[11px] font-bold"
                  >
                    <Check className="size-3.5" />
                    Đánh dấu đã đọc
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
