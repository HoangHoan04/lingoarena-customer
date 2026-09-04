"use client";

import { Link } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import { classroomService } from "@/services/classroom.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { Classroom, ClassroomAssignment } from "@/types/classroom";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  Trophy,
  UploadCloud,
  Users,
  Video,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ClassDetailPage() {
  const locale = useLocale();
  const params = useParams<{ id: string }>();
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"assignments" | "announcements" | "syllabus">("assignments");

  // Assignment submission modal state
  const [submittingAssignment, setSubmittingAssignment] = useState<ClassroomAssignment | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const classId = params?.id;
    if (!classId) return;

    setLoading(true);

    if (!isAuthenticated) {
      setClassroom(null);
      setLoading(false);
      return;
    }

    classroomService
      .detail(classId)
      .then((data) => {
        setClassroom(data?.id ? data : null);
      })
      .catch(() => {
        setClassroom(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [params?.id, isAuthenticated]);

  const handleOpenSubmitModal = (assignment: ClassroomAssignment) => {
    setSubmittingAssignment(assignment);
    setSubmissionText("");
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingAssignment || !classroom) return;

    setIsSubmitting(true);
    try {
      await classroomService.submitAssignment(submittingAssignment.id);
      const refreshed = await classroomService.detail(classroom.id);
      if (refreshed?.id) setClassroom(refreshed);
      addToast("Đã nộp bài tập.", "success");
      setSubmittingAssignment(null);
    } catch (err: any) {
      addToast(err?.message || "Không thể nộp bài tập", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!classroom) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center space-y-4">
        <AlertCircle className="size-12 text-muted-foreground mx-auto" />
        <h2 className="text-xl font-bold">Không tìm thấy thông tin lớp học</h2>
        <Link
          href="/classes"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold text-xs"
        >
          Quay lại danh sách lớp
        </Link>
      </main>
    );
  }

  const assignments = classroom.assignments || [];
  const announcements = classroom.announcements || [];

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12 space-y-6 select-none">
      {/* 1. TOP BREADCRUMB */}
      <Link
        href="/classes"
        className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Tất cả lớp học của tôi</span>
      </Link>

      {/* 2. CLASSROOM HERO CARD */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary font-mono text-xs font-black uppercase tracking-wider">
                MÃ LỚP: {classroom.code}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                ● Đang diễn ra
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-foreground leading-tight">
              {pickLocaleText(locale, classroom.name, classroom.nameEn)}
            </h1>

            <p className="text-xs sm:text-sm text-muted-foreground">
              Giảng viên phụ trách:{" "}
              <strong className="text-foreground">
                {classroom.teacher?.fullName || classroom.teacher?.displayName || "Giảng viên"}
              </strong>
              {classroom.teacher?.email ? ` (${classroom.teacher.email})` : ""}
            </p>
          </div>

          {/* Quick Zoom Link Button */}
          {classroom.meetingLink && (
            <a
              href={classroom.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/25 transition-all hover:scale-102 active:scale-98 cursor-pointer shrink-0"
            >
              <Video className="size-4" />
              <span>Vào Phòng Học Trực Tuyến</span>
              <ExternalLink className="size-3.5" />
            </a>
          )}
        </div>

        {/* Schedule & Capacity Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border/80 text-xs">
          {classroom.schedule && (
            <div className="p-3 rounded-2xl bg-muted/60 flex items-center gap-3">
              <Calendar className="size-4 text-primary shrink-0" />
              <div>
                <span className="text-[10.5px] text-muted-foreground font-bold block">Lịch Học</span>
                <span className="font-bold text-foreground">{classroom.schedule}</span>
              </div>
            </div>
          )}

          <div className="p-3 rounded-2xl bg-muted/60 flex items-center gap-3">
            <Users className="size-4 text-emerald-500 shrink-0" />
            <div>
              <span className="text-[10.5px] text-muted-foreground font-bold block">Sĩ Số Lớp</span>
              <span className="font-bold text-foreground">
                {classroom.studentCount ?? classroom.members?.length ?? 0}
                {classroom.capacity ? ` / ${classroom.capacity}` : ""} học viên
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-muted/60 flex items-center gap-3">
            <Trophy className="size-4 text-amber-500 shrink-0" />
            <div>
              <span className="text-[10.5px] text-muted-foreground font-bold block">Tiến Độ Khóa Học</span>
              <span className="font-bold text-foreground">
                {classroom.startDate || classroom.endDate
                  ? [classroom.startDate, classroom.endDate].filter(Boolean).join(" → ")
                  : "Chưa có lịch khóa"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TABS SELECTOR (Bài tập / Bảng tin / Lộ trình) */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          type="button"
          onClick={() => setActiveTab("assignments")}
          className={`pb-3 px-4 text-xs sm:text-sm font-black transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === "assignments"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <FileCheck2 className="size-4" />
          <span>Bài Tập Về Nhà ({assignments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("announcements")}
          className={`pb-3 px-4 text-xs sm:text-sm font-black transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === "announcements"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <MessageSquare className="size-4" />
          <span>Bảng Tin Lớp ({announcements.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("syllabus")}
          className={`pb-3 px-4 text-xs sm:text-sm font-black transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === "syllabus"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="size-4" />
          <span>Giáo Trình Tuần</span>
        </button>
      </div>

      {/* 4. TAB 1: ASSIGNMENTS LIST */}
      {activeTab === "assignments" && (
        <div className="space-y-4">
          {assignments.length === 0 ? (
            <div className="p-8 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              Hiện chưa có bài tập nào được giao.
            </div>
          ) : (
            assignments.map((item) => {
              const isGraded = item.status === "GRADED";
              const isPending = item.status === "PENDING";

              return (
                <div
                  key={item.id}
                  className={`p-6 rounded-3xl border-2 bg-card space-y-4 transition-all ${
                    isGraded
                      ? "border-emerald-500/30 shadow-xs"
                      : "border-border shadow-md hover:border-primary/40"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10.5px] font-black uppercase">
                          {item.assignmentType}
                        </span>

                        {isGraded ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-black flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            <span>Đã chấm điểm: {item.score} / {item.maxScore}</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-[10.5px] font-black animate-pulse flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>Chưa nộp bài</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-black text-foreground">
                        {pickLocaleText(locale, item.title, item.titleEn)}
                      </h3>

                      {item.description && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    {/* Submit or Review Button */}
                    <div className="shrink-0 pt-2 sm:pt-0">
                      {isPending ? (
                        <button
                          type="button"
                          onClick={() => handleOpenSubmitModal(item)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider shadow-md transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                        >
                          <Send className="size-3.5" />
                          <span>Nộp Bài Tập</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-muted text-muted-foreground text-xs font-bold border border-border">
                          <CheckCircle2 className="size-3.5 text-emerald-500" />
                          <span>Đã nộp bài</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teacher Feedback Box if graded */}
                  {isGraded && item.teacherFeedback && (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-black text-emerald-600 dark:text-emerald-400 text-[11px]">
                        <Sparkles className="size-3.5" />
                        <span>Nhận xét của Giảng Viên:</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed italic">
                        "{item.teacherFeedback}"
                      </p>
                    </div>
                  )}

                  {/* Footer Due Date */}
                  <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-muted-foreground" />
                      Hạn nộp: {item.dueAt ? new Date(item.dueAt).toLocaleString("vi-VN") : "Không thời hạn"}
                    </span>
                    <span className="font-bold">Điểm tối đa: {item.maxScore || 100} pts</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 5. TAB 2: ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          {announcements.length === 0 ? (
            <div className="p-8 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              Chưa có thông báo nào từ giảng viên.
            </div>
          ) : (
            announcements.map((post) => (
              <div key={post.id} className="p-6 rounded-3xl border border-border bg-card shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${post.authorName || "GV"}`}
                      alt={post.authorName || "Giảng viên"}
                      className="size-10 rounded-2xl object-cover border border-border"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-foreground">
                        {post.authorName}
                      </h4>
                      <p className="text-[10.5px] text-muted-foreground">{post.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium">{post.createdAt}</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-black text-foreground">{post.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Attachments */}
                {post.attachments && post.attachments.length > 0 && (
                  <div className="pt-2 border-t border-border flex flex-wrap gap-2">
                    {post.attachments.map((att, idx) => (
                      <a
                        key={idx}
                        href={att.url}
                        className="inline-flex items-center gap-2 p-2.5 px-3 rounded-xl bg-muted/60 hover:bg-muted border border-border text-xs font-bold text-foreground transition-colors"
                      >
                        <Paperclip className="size-3.5 text-primary" />
                        <span>{att.name}</span>
                        <span className="text-[10px] text-muted-foreground">({att.size})</span>
                        <Download className="size-3 text-muted-foreground ml-1" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 6. TAB 3: SYLLABUS ROADMAP */}
      {activeTab === "syllabus" && (
        <div className="space-y-3">
          {(classroom.syllabus || []).length === 0 ? (
            <div className="p-8 rounded-3xl bg-card border border-border text-center text-xs text-muted-foreground">
              Chưa có giáo trình tuần cho lớp này.
            </div>
          ) : (
            (classroom.syllabus || []).map((item, idx) => (
            <div
              key={idx}
              className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                item.status === "CURRENT"
                  ? "bg-primary/5 border-primary shadow-sm"
                  : "bg-card border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="size-8 rounded-xl bg-muted text-foreground font-black text-xs flex items-center justify-center border border-border">
                  {idx + 1}
                </span>
                <div>
                  <span className="text-[10.5px] font-black uppercase text-primary tracking-wider block">
                    {item.week}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-foreground">{item.topic}</p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-[10.5px] font-black uppercase tracking-wider ${
                  item.status === "COMPLETED"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : item.status === "CURRENT"
                    ? "bg-primary text-primary-foreground animate-pulse"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {item.status === "COMPLETED"
                  ? "Đã học"
                  : item.status === "CURRENT"
                  ? "Đang học"
                  : "Sắp tới"}
              </span>
            </div>
            ))
          )}
        </div>
      )}

      {/* 7. ASSIGNMENT SUBMISSION MODAL */}
      {submittingAssignment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in select-none">
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl p-6 sm:p-7 space-y-5">
            <button
              type="button"
              onClick={() => setSubmittingAssignment(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>

            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10.5px] font-black uppercase">
                {submittingAssignment.assignmentType}
              </span>
              <h3 className="text-lg font-black text-foreground mt-1">
                {pickLocaleText(locale, submittingAssignment.title, submittingAssignment.titleEn)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Điểm tối đa: <strong>{submittingAssignment.maxScore || 100} pts</strong> · Hạn:{" "}
                {new Date(submittingAssignment.dueAt).toLocaleDateString("vi-VN")}
              </p>
            </div>

            <form onSubmit={handleConfirmSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground block">
                  Nội dung câu trả lời / Bài luận của bạn:
                </label>
                <textarea
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Nhập nội dung bài làm hoặc ghi chú bài nộp tại đây..."
                  className="w-full rounded-2xl border border-border bg-muted/40 p-4 text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                />
              </div>

              {/* Upload simulated file */}
              <div className="p-4 rounded-2xl border border-dashed border-border text-center space-y-1 bg-muted/20">
                <UploadCloud className="size-6 text-muted-foreground mx-auto" />
                <p className="text-xs font-bold text-foreground">Kéo thả tài liệu bài làm hoặc nhấn chọn tệp</p>
                <p className="text-[10px] text-muted-foreground">Hỗ trợ PDF, DOCX, XLSX, MP3 (Tối đa 25MB)</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-5 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-black uppercase tracking-wider shadow-lg shadow-primary/25 transition-all hover:scale-102 active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  <span>Xác Nhận Nộp Bài</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubmittingAssignment(null)}
                  className="py-3 px-5 rounded-2xl bg-muted text-foreground text-xs font-bold border border-border hover:bg-accent transition-colors cursor-pointer"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
