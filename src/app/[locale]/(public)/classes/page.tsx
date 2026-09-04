"use client";

import { Link } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import { classroomService } from "@/services/classroom.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { Classroom } from "@/types/classroom";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  KeyRound,
  Loader2,
  Users,
  Video,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function ClassesPage() {
  const locale = useLocale();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [code, setCode] = useState("");
  const [classCards, setClassCards] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  const loadClasses = async () => {
    setLoading(true);
    try {
      if (!isAuthenticated) {
        setClassCards([]);
        return;
      }
      const res = await classroomService.myClasses();
      const apiClasses = [
        ...((res.memberships?.map((item) => item.classroom).filter(Boolean) as Classroom[]) || []),
        ...((res.taught as Classroom[]) || []),
      ].filter((item, index, list) => list.findIndex((row) => row.id === item.id) === index);
      setClassCards(apiClasses);
    } catch {
      setClassCards([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, [isAuthenticated]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    if (!isAuthenticated) {
      addToast("Đăng nhập để tham gia lớp học", "warning");
      return;
    }
    setJoining(true);
    try {
      await classroomService.join(code.trim());
      addToast("Đã tham gia lớp học thành công!", "success");
      setCode("");
      await loadClasses();
    } catch (err: any) {
      addToast(err?.message || "Không thể tham gia lớp học", "error");
    } finally {
      setJoining(false);
    }
  };

  const totalClasses = classCards.length;
  const pendingAssignments = classCards.reduce((acc, cls) => {
    const pending = cls.assignments?.filter((a) => a.status === "PENDING").length || 0;
    return acc + pending;
  }, 0);
  const assignmentTotal = classCards.reduce((acc, cls) => acc + (cls.assignments?.length || 0), 0);
  const submittedCount = classCards.reduce(
    (acc, cls) => acc + (cls.assignments?.filter((a) => a.status && a.status !== "PENDING").length || 0),
    0,
  );
  const submitRate = assignmentTotal > 0 ? Math.round((submittedCount / assignmentTotal) * 1000) / 10 : null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:py-12 space-y-8 select-none">
      <section className="relative overflow-hidden rounded-3xl border border-blue-500/20 bg-linear-to-br from-slate-950 via-[#0d1e44] to-slate-950 text-white p-6 sm:p-10 shadow-2xl space-y-6">
        <div className="absolute -top-20 -right-20 size-72 rounded-full bg-blue-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-black uppercase tracking-wider text-sky-300">
            <GraduationCap className="size-4 text-sky-400" />
            <span>Phân Hệ Lớp Học Trực Tuyến & Bài Tập Về Nhà</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Lớp Học Của Tôi ·{" "}
            <span className="bg-linear-to-r from-sky-400 via-blue-300 to-purple-300 bg-clip-text text-transparent">
              Virtual Classroom
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Tham gia lớp học do giảng viên cấp mã để nộp bài tập về nhà, xem tài liệu giáo trình, tham gia thi thử và theo dõi bảng xếp hạng học viên.
          </p>
        </div>

        <div className="relative z-10 space-y-3 pt-2">
          <form onSubmit={handleJoin} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Nhập mã lớp học do giảng viên cấp..."
                className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md px-5 py-3.5 text-xs sm:text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400/50 uppercase font-mono font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={joining || !code.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-7 py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-blue-600/30 transition-all hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer shrink-0"
            >
              {joining ? <Loader2 className="size-4 animate-spin" /> : <KeyRound className="size-4 text-sky-200" />}
              <span>Tham Gia Lớp</span>
            </button>
          </form>
        </div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen className="size-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-bold block">Lớp Đang Theo Học</span>
            <span className="text-xl sm:text-2xl font-black text-foreground">{totalClasses} Lớp</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Clock className="size-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-bold block">Bài Tập Cần Hoàn Thành</span>
            <span className="text-xl sm:text-2xl font-black text-amber-500">{pendingAssignments} Bài</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border flex items-center gap-4 shadow-sm">
          <div className="size-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="size-6" />
          </div>
          <div>
            <span className="text-xs text-muted-foreground font-bold block">Tỷ Lệ Nộp Bài</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500">{submitRate === null ? "—" : `${submitRate}%`}</span>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-foreground flex items-center gap-2">
            <GraduationCap className="size-5 text-primary" />
            <span>Danh Sách Lớp Học Đã Tham Gia</span>
          </h2>
          <span className="text-xs font-bold text-muted-foreground">{classCards.length} lớp học hoạt động</span>
        </div>

        {loading ? (
          <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-3">
            <Loader2 className="size-8 animate-spin mx-auto text-primary" />
            <p className="text-sm font-bold text-muted-foreground">Đang tải dữ liệu lớp học...</p>
          </div>
        ) : classCards.length === 0 ? (
          <div className="p-12 rounded-3xl bg-card border border-border text-center space-y-4">
            <GraduationCap className="size-16 text-muted-foreground mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-black text-foreground">
                {isAuthenticated ? "Bạn chưa tham gia lớp học nào" : "Đăng nhập để xem lớp học"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isAuthenticated
                  ? "Hãy nhập mã lớp học ở phía trên để bắt đầu trải nghiệm!"
                  : "Lớp học chỉ hiển thị sau khi bạn đăng nhập và tham gia bằng mã lớp."}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classCards.map((classroom) => {
              const pendingCount = classroom.assignments?.filter((a) => a.status === "PENDING").length || 0;

              return (
                <div
                  key={classroom.id}
                  className="group relative rounded-3xl border-2 border-border bg-card p-6 shadow-md hover:shadow-xl hover:border-primary/40 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-mono text-xs font-black uppercase tracking-wider">
                        {classroom.code}
                      </span>

                      {pendingCount > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                          {pendingCount} bài tập cần nộp
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[11px]">
                          Không có bài chờ nộp
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors leading-snug">
                        {pickLocaleText(locale, classroom.name, classroom.nameEn)}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 font-medium">
                        Giảng viên:{" "}
                        <strong className="text-foreground">
                          {classroom.teacher?.fullName || classroom.teacher?.displayName || "Giáo viên"}
                        </strong>
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-border/80 text-xs">
                      {classroom.schedule && (
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Calendar className="size-3.5 text-primary shrink-0" />
                          <span>{classroom.schedule}</span>
                        </div>
                      )}
                      {classroom.roomType && (
                        <div className="flex items-center gap-2 text-muted-foreground font-medium">
                          <Video className="size-3.5 text-blue-500 shrink-0" />
                          <span>{classroom.roomType}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Users className="size-3.5 text-emerald-500 shrink-0" />
                        <span>
                          {classroom.studentCount ?? classroom.members?.length ?? 0}
                          {classroom.capacity ? ` / ${classroom.capacity}` : ""} học viên đã đăng ký
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono text-muted-foreground font-bold">
                      {classroom.assignments?.length || 0} bài tập tổng
                    </span>

                    <Link
                      href={`/classes/${classroom.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer"
                    >
                      <span>Vào Lớp Học</span>
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
