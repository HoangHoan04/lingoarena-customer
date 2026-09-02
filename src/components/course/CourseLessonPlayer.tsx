"use client";

import {
  type Course,
  type Lesson,
  useCourseStore,
} from "@/stores/useCourseStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowLeft,
  BookOpen,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Download,
  FileCheck,
  FileQuestion,
  FileText,
  HelpCircle,
  Lock,
  Menu,
  MessageSquare,
  PenTool,
  Play,
  PlayCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import React, { useMemo, useRef, useState } from "react";

export default function CourseLessonPlayer({
  course,
  currentLessonId,
}: {
  course: Course;
  currentLessonId: string;
}) {
  const {
    completedLessonIds,
    toggleCompleteLesson,
    markLessonComplete,
    lessonNotes,
    addLessonNote,
    deleteLessonNote,
    getCourseProgress,
  } = useCourseStore();

  const { addToast } = useToastStore();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [activeTab, setActiveTab] = useState<
    "overview" | "quiz" | "notes" | "qa" | "ai"
  >("overview");

  const [newNoteContent, setNewNoteContent] = useState("");
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    course.sections.forEach((sec) => {
      initial[sec.id] = true;
    });
    return initial;
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Flatten lessons list to find current, previous, next lesson
  const allLessons = useMemo(() => {
    const list: { lesson: Lesson; sectionTitle: string; sectionId: string }[] = [];
    course.sections.forEach((sec) => {
      sec.lessons.forEach((l) => {
        list.push({ lesson: l, sectionTitle: sec.title, sectionId: sec.id });
      });
    });
    return list;
  }, [course]);

  const currentIndex = allLessons.findIndex(
    (item) => item.lesson.id === currentLessonId
  );
  const currentLessonData = allLessons[currentIndex >= 0 ? currentIndex : 0];
  const currentLesson = currentLessonData?.lesson;
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1].lesson : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1].lesson
      : null;

  const completedList = completedLessonIds[course.id] || [];
  const isCurrentCompleted = currentLesson
    ? completedList.includes(currentLesson.id)
    : false;

  const progress = getCourseProgress(course.id);

  // Current lesson notes
  const currentNotes = lessonNotes.filter(
    (n) => n.courseId === course.id && n.lessonId === currentLesson?.id
  );

  const handleToggleComplete = async () => {
    if (!currentLesson) return;
    if (isCurrentCompleted) {
      toggleCompleteLesson(course.id, currentLesson.id);
      addToast("Đã bỏ đánh dấu hoàn thành", "success");
      return;
    }
    try {
      await markLessonComplete(course.id, currentLesson.id);
      addToast("Đã hoàn thành bài học (+20 XP)!", "success");
    } catch (error: any) {
      addToast(error?.message || "Không cập nhật được tiến độ bài học", "error");
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !currentLesson) return;

    const currentTime = videoRef.current ? Math.floor(videoRef.current.currentTime) : 0;
    addLessonNote({
      courseId: course.id,
      lessonId: currentLesson.id,
      timestamp: currentTime,
      content: newNoteContent.trim(),
    });

    setNewNoteContent("");
    addToast("Đã lưu ghi chú bài học", "success");
  };

  const formatTimestamp = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const seekVideo = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      videoRef.current.play();
    }
  };

  const getLessonTypeIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <PlayCircle className="size-4 text-primary" />;
      case "reading":
        return <FileText className="size-4 text-amber-500" />;
      case "quiz":
        return <FileQuestion className="size-4 text-emerald-500" />;
      case "ai_practice":
        return <Bot className="size-4 text-purple-500" />;
      default:
        return <PlayCircle className="size-4 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-8 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Breadcrumb & Progress Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-3xl bg-card border border-border shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${course.slug}`}
              className="size-9 rounded-xl bg-muted hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shrink-0"
              title="Quay lại chi tiết khóa học"
            >
              <ArrowLeft className="size-4.5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.2 rounded-md bg-primary/10 text-primary text-[10px] font-black uppercase">
                  {course.examType.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold truncate max-w-xs">
                  {course.title}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-extrabold text-foreground truncate max-w-md sm:max-w-lg mt-0.5">
                {currentLesson?.title}
              </h1>
            </div>
          </div>

          {/* Overall Progress Widget */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground font-semibold block">
                Tiến độ khóa học
              </span>
              <span className="text-xs font-black text-primary">
                {completedList.length}/{allLessons.length} bài ({progress}%)
              </span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-primary to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Two-Column Grid (Main Player 8 Cols + Sticky Curriculum 4 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Video Player + Controls + Interaction Tabs (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Player Card */}
            <div className="relative rounded-3xl overflow-hidden bg-black aspect-16/9 shadow-2xl border border-border">
              <video
                ref={videoRef}
                src={
                  currentLesson?.videoUrl ||
                  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
                controls
                className="w-full h-full object-contain"
              />
            </div>

            {/* Navigation Bar & Complete Action */}
            <div className="p-4 sm:p-5 rounded-3xl bg-card border border-border flex flex-wrap items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase">
                  {currentLesson?.type.toUpperCase()}
                </span>
                <span className="text-xs text-muted-foreground font-semibold">
                  Thời lượng: {currentLesson?.durationMinutes} phút
                </span>
              </div>

              {/* Prev / Complete / Next Buttons */}
              <div className="flex items-center gap-2">
                {prevLesson && (
                  <Link
                    href={`/courses/${course.slug}/learn/${prevLesson.id}`}
                    className="px-3.5 py-2 rounded-xl bg-muted hover:bg-accent text-foreground text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="size-4" />
                    <span>Bài trước</span>
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleToggleComplete}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isCurrentCompleted
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                      : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/25"
                  }`}
                >
                  <CheckCircle2 className="size-4" />
                  <span>
                    {isCurrentCompleted ? "Đã Hoàn Thành" : "Đánh Dấu Đã Học (+20 XP)"}
                  </span>
                </button>

                {nextLesson && (
                  <Link
                    href={`/courses/${course.slug}/learn/${nextLesson.id}`}
                    className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <span>Bài tiếp theo</span>
                    <ChevronRight className="size-4" />
                  </Link>
                )}
              </div>
            </div>

            {/* Structured Interaction Tabs */}
            <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-5">
              {/* Tab Selector Header */}
              <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto no-scrollbar">
                {[
                  { id: "overview", label: "Tổng quan bài giảng", icon: BookOpen },
                  { id: "quiz", label: "Bài tập củng cố", icon: FileQuestion },
                  { id: "notes", label: `Ghi chú (${currentNotes.length})`, icon: PenTool },
                  { id: "qa", label: "Hỏi đáp Q&A", icon: MessageSquare },
                  { id: "ai", label: "Hỏi LingoBot AI", icon: Bot },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                        active
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <Icon className="size-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <h3 className="font-extrabold text-sm sm:text-base text-foreground">
                      Nội Dung Bài Học
                    </h3>
                    {currentLesson?.content ? (
                      <div
                        className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                      />
                    ) : (
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        Trong bài học này, bạn sẽ nắm vững các khái niệm trọng tâm, cấu trúc câu tiêu chuẩn và cách áp dụng vào đề thi thật.
                      </p>
                    )}
                  </div>

                  {/* Downloadable Resources */}
                  {currentLesson?.resources && currentLesson.resources.length > 0 && (
                    <div className="space-y-2.5 pt-4 border-t border-border">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Tài Liệu Đính Kèm Tải Về:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentLesson.resources.map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            download
                            className="inline-flex items-center gap-2 p-2.5 px-3.5 rounded-2xl bg-muted hover:bg-accent border border-border text-xs font-semibold text-foreground transition-colors"
                          >
                            <FileText className="size-4 text-primary" />
                            <span>{res.name}</span>
                            <span className="text-[10px] text-muted-foreground">({res.size})</span>
                            <Download className="size-3.5 ml-1 text-muted-foreground" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: QUIZ PRACTICE */}
              {activeTab === "quiz" && (
                <div className="space-y-4 animate-in fade-in max-w-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                      <FileQuestion className="size-4 text-emerald-500" />
                      <span>Câu Hỏi Thực Hành Củng Cố</span>
                    </h3>
                    <span className="text-xs text-muted-foreground font-semibold">
                      1 / 1 câu hỏi
                    </span>
                  </div>

                  <div className="space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
                      Which sentence uses the most academic vocabulary for IELTS Writing Task 2?
                    </p>

                    <div className="space-y-2">
                      {[
                        "Computers make people lazy because they do everything.",
                        "Excessive reliance on automated systems tends to engender sedentary lifestyle habits.",
                        "People are using phones a lot and it is very bad.",
                        "Technology is good but it has some bad things.",
                      ].map((opt, optIdx) => (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => {
                            setSelectedQuizOption(optIdx);
                            setQuizSubmitted(true);
                          }}
                          className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                            selectedQuizOption === optIdx
                              ? optIdx === 1
                                ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold"
                                : "bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 font-bold"
                              : "bg-muted/40 border-border hover:bg-muted text-foreground"
                          }`}
                        >
                          <span className="mr-2 font-bold">{String.fromCharCode(65 + optIdx)}.</span>
                          {opt}
                        </button>
                      ))}
                    </div>

                    {quizSubmitted && (
                      <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-700 dark:text-emerald-300 space-y-1">
                        <p className="font-bold">✓ Giải thích chi tiết:</p>
                        <p className="font-normal text-muted-foreground leading-relaxed">
                          Đáp án <strong>B</strong> sử dụng cấu trúc danh từ hóa (*excessive reliance*), động từ học thuật C1 (*engender*), và cụm từ nâng band (*sedentary lifestyle habits*).
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: NOTES */}
              {activeTab === "notes" && (
                <div className="space-y-5 animate-in fade-in max-w-2xl">
                  <form onSubmit={handleAddNote} className="space-y-2.5">
                    <textarea
                      rows={2}
                      value={newNoteContent}
                      onChange={(e) => setNewNoteContent(e.target.value)}
                      placeholder="Viết ghi chú cho bài học này... (Mốc thời gian video sẽ tự động gắn)"
                      className="w-full p-3.5 rounded-2xl border border-border bg-muted/50 text-xs sm:text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:border-primary"
                    />
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={!newNoteContent.trim()}
                        className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
                      >
                        Lưu Ghi Chú
                      </button>
                    </div>
                  </form>

                  <div className="space-y-2.5">
                    {currentNotes.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">
                        Chưa có ghi chú nào cho bài học này.
                      </p>
                    ) : (
                      currentNotes.map((note) => (
                        <div
                          key={note.id}
                          className="p-3.5 rounded-2xl bg-muted/40 border border-border flex items-start justify-between gap-3 shadow-2xs"
                        >
                          <div className="space-y-1">
                            <button
                              type="button"
                              onClick={() => seekVideo(note.timestamp)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-black cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                            >
                              <Clock className="size-3" />
                              <span>{formatTimestamp(note.timestamp)}</span>
                            </button>
                            <p className="text-xs sm:text-[13px] text-foreground leading-relaxed">
                              {note.content}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => deleteLessonNote(note.id)}
                            className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                            title="Xóa ghi chú"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: Q&A */}
              {activeTab === "qa" && (
                <div className="space-y-4 animate-in fade-in max-w-2xl">
                  <div className="p-5 rounded-3xl bg-muted/40 border border-border space-y-3">
                    <h4 className="text-xs font-bold text-foreground">
                      Đặt Câu Hỏi Cho Giảng Viên & Bạn Học
                    </h4>
                    <textarea
                      rows={2}
                      placeholder="Mô tả thắc mắc của bạn về bài giảng này..."
                      className="w-full p-3 rounded-2xl border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
                    />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => addToast("Đã gửi câu hỏi lên diễn đàn bài học", "success")}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer shadow-xs"
                      >
                        Gửi Câu Hỏi
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: LINGOBOT AI */}
              {activeTab === "ai" && (
                <div className="space-y-4 animate-in fade-in max-w-2xl p-5 rounded-3xl bg-muted/30 border border-border">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-border">
                    <div className="size-9 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                      <Bot className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">
                        Trợ Lý AI LingoBot Đồng Hành
                      </h3>
                      <p className="text-[11px] text-muted-foreground">
                        Hỏi đáp tức thì về từ vựng, ngữ pháp hoặc bài tập trong video này
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Tóm tắt 3 ý chính của bài giảng",
                      "Trích xuất từ vựng C1 xuất hiện trong video",
                      "Tạo 3 câu bài tập tương tự",
                    ].map((prompt, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => addToast(`Đang gửi: "${prompt}" đến LingoBot`, "info")}
                        className="px-3.5 py-2 rounded-xl bg-card hover:bg-primary/10 hover:text-primary border border-border text-xs font-semibold text-muted-foreground transition-all cursor-pointer shadow-2xs"
                      >
                        {prompt} ➜
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Sticky Curriculum Sidebar (4 Cols) */}
          <div className="lg:col-span-4 sticky top-6 space-y-4">
            <div className="rounded-3xl bg-card border border-border shadow-xl overflow-hidden">
              {/* Header */}
              <div className="p-4 sm:p-5 bg-muted/50 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Giáo Trình Khóa Học
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {course.sections.length} Chương · {allLessons.length} Bài học
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-black">
                  {progress}% Xong
                </span>
              </div>

              {/* Sections & Lessons Accordion List */}
              <div className="divide-y divide-border max-h-[calc(100vh-220px)] overflow-y-auto">
                {course.sections.map((sec, secIdx) => {
                  const isExpanded = !!expandedSections[sec.id];
                  const secLessonsCompleted = sec.lessons.filter((l) =>
                    completedList.includes(l.id)
                  ).length;

                  return (
                    <div key={sec.id} className="p-2 space-y-1">
                      {/* Section Title Header */}
                      <button
                        type="button"
                        onClick={() => toggleSection(sec.id)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted/60 transition-colors text-left cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-xs font-bold text-foreground block truncate">
                            {secIdx + 1}. {sec.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {secLessonsCompleted}/{sec.lessons.length} bài hoàn thành
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="size-3.5 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronDown className="size-3.5 text-muted-foreground shrink-0" />
                        )}
                      </button>

                      {/* Lessons in Section */}
                      {isExpanded && (
                        <div className="space-y-1 pl-2">
                          {sec.lessons.map((l) => {
                            const isSelected = l.id === currentLesson?.id;
                            const isCompleted = completedList.includes(l.id);

                            return (
                              <Link
                                key={l.id}
                                href={`/courses/${course.slug}/learn/${l.id}`}
                                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${
                                  isSelected
                                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                                    : "hover:bg-muted text-foreground font-medium"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0 pr-2">
                                  {isCompleted ? (
                                    <CheckCircle2
                                      className={`size-4 shrink-0 ${
                                        isSelected ? "text-white" : "text-emerald-500"
                                      }`}
                                    />
                                  ) : (
                                    getLessonTypeIcon(l.type)
                                  )}
                                  <span className="truncate text-xs">{l.title}</span>
                                </div>

                                <span
                                  className={`text-[10px] shrink-0 font-medium ${
                                    isSelected
                                      ? "text-white/80"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {l.durationMinutes}m
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
