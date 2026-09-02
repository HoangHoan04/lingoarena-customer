"use client";

import { Link, useRouter } from "@/i18n/routing";
import { learningService } from "@/services/learning.service";
import { questionService } from "@/services/question.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { LearningPath, UserErrorItem } from "@/types/learning";
import type { QuestionLookup } from "@/types/question";
import { BookOpen, CheckCircle2, ClipboardList, Target, Trophy } from "lucide-react";
import { useEffect, useState } from "react";

export default function LearningPathPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const [examTypes, setExamTypes] = useState<QuestionLookup[]>([]);
  const [path, setPath] = useState<LearningPath | null>(null);
  const [errors, setErrors] = useState<UserErrorItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    examTypeId: "",
    targetScore: "",
    minutesPerDay: "30",
  });

  useEffect(() => {
    questionService.lookupExamTypes().then((items) => {
      setExamTypes(items);
      setForm((prev) => ({ ...prev, examTypeId: prev.examTypeId || items[0]?.id || "" }));
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    learningService.currentPath().then(setPath).catch(() => null);
    learningService.errors(0, 5).then((res) => setErrors(res.data)).catch(() => null);
  }, [isAuthenticated]);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    if (!form.examTypeId || !form.targetScore) {
      addToast("Vui lòng chọn kỳ thi và nhập điểm mục tiêu", "error");
      return;
    }
    setLoading(true);
    try {
      await learningService.createGoal({
        examTypeId: form.examTypeId,
        targetScore: Number(form.targetScore),
        minutesPerDay: Number(form.minutesPerDay || 30),
      });
      const nextPath = await learningService.generatePath();
      setPath(nextPath);
      addToast("Đã tạo lộ trình học tập", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể tạo lộ trình", "error");
    } finally {
      setLoading(false);
    }
  };

  const completeItem = async (id: string) => {
    try {
      await learningService.completeItem(id);
      setPath(await learningService.currentPath());
      addToast("Đã hoàn thành hoạt động", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể cập nhật hoạt động", "error");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center space-y-5">
        <Target className="mx-auto size-14 text-primary" />
        <h1 className="text-3xl font-black">Cần đăng nhập để tạo lộ trình</h1>
        <p className="text-muted-foreground">LingoArena sẽ cá nhân hóa mục tiêu, lịch học, sổ lỗi sai và tiến độ hằng ngày cho tài khoản của bạn.</p>
        <Link href="/login" className="inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
          Đăng nhập
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <Target className="size-6" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">Learning Path</p>
            <h1 className="text-2xl sm:text-4xl font-black">Lộ trình học cá nhân</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Chọn mục tiêu, để rule engine gom tài nguyên thật từ từ vựng, bài học, ngữ pháp và đề luyện đã xuất bản.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <select
            value={form.examTypeId}
            onChange={(e) => setForm((prev) => ({ ...prev, examTypeId: e.target.value }))}
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          >
            {examTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label || item.name}
              </option>
            ))}
          </select>
          <input
            value={form.targetScore}
            onChange={(e) => setForm((prev) => ({ ...prev, targetScore: e.target.value }))}
            type="number"
            placeholder="Điểm mục tiêu"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <input
            value={form.minutesPerDay}
            onChange={(e) => setForm((prev) => ({ ...prev, minutesPerDay: e.target.value }))}
            type="number"
            placeholder="Phút mỗi ngày"
            className="rounded-2xl border border-border bg-background px-4 py-3 text-sm"
          />
          <button
            type="button"
            disabled={loading}
            onClick={handleGenerate}
            className="rounded-2xl bg-primary px-4 py-3 text-sm font-black text-primary-foreground disabled:opacity-60"
          >
            {loading ? "Đang tạo..." : "Tạo lộ trình"}
          </button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-black">
            <ClipboardList className="size-5 text-primary" />
            Hoạt động được đề xuất
          </h2>
          {!path?.items?.length && <p className="text-sm text-muted-foreground">Chưa có hoạt động. Hãy tạo lộ trình để bắt đầu.</p>}
          {path?.items?.map((item) => (
            <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">{item.itemType} · {item.scheduledDate}</p>
                <h3 className="font-black">{item.reasonJson?.title || "Hoạt động học tập"}</h3>
                <p className="text-xs text-muted-foreground">Trạng thái: {item.status}</p>
              </div>
              <div className="flex gap-2">
                {item.reasonJson?.href && (
                  <Link href={item.reasonJson.href as any} className="rounded-xl border border-border px-3 py-2 text-xs font-bold">
                    Mở
                  </Link>
                )}
                <button
                  type="button"
                  disabled={item.status === "COMPLETED"}
                  onClick={() => completeItem(item.id)}
                  className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                >
                  <CheckCircle2 className="mr-1 inline size-4" />
                  Hoàn thành
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-3xl border border-border bg-card p-6 space-y-4">
          <h2 className="flex items-center gap-2 text-lg font-black">
            <BookOpen className="size-5 text-amber-500" />
            Sổ lỗi sai
          </h2>
          {!errors.length && <p className="text-sm text-muted-foreground">Chưa có lỗi sai cần ôn.</p>}
          {errors.map((item) => (
            <div key={item.id} className="rounded-2xl bg-muted/50 p-3 text-sm">
              <p className="font-bold">{item.question?.prompt || item.errorType}</p>
              <p className="text-xs text-muted-foreground">Sai {item.wrongCount} lần</p>
            </div>
          ))}
          <div className="rounded-2xl bg-primary/10 p-4 text-sm text-primary">
            <Trophy className="mb-2 size-5" />
            Hoàn thành mục trong lộ trình sẽ cộng điểm gamification.
          </div>
        </aside>
      </section>
    </main>
  );
}
