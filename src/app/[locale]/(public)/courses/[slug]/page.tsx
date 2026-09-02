"use client";

import {
  CourseCurriculumAccordion,
  CourseReviewSection,
} from "@/components/course";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCourseStore } from "@/stores/useCourseStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  FileText,
  Flame,
  Globe,
  GraduationCap,
  Headphones,
  HelpCircle,
  Infinity as InfinityIcon,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Users,
  Zap,
} from "lucide-react";
import { Link, useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const COURSE_FAQS = [
  {
    q: "Tôi có thể xem lại video bài giảng sau khi khóa học kết thúc không?",
    a: "Có! Bạn được quyền sở hữu khóa học trọn đời và có thể xem lại bài giảng bất cứ lúc nào trên máy tính, điện thoại hoặc máy tính bảng mà không giới hạn thời gian.",
  },
  {
    q: "Tính năng AI LingoBot chấm bài hoạt động như thế nào?",
    a: "Trợ lý AI LingoBot được tích hợp trực tiếp trong phòng học, tự động phân tích bài viết Writing và bài nói Speaking của bạn theo 4 tiêu chí chuẩn Rubric quốc tế với phản hồi chi tiết trong vòng 10 giây.",
  },
  {
    q: "Nếu tôi không đạt điểm cam kết thì được hỗ trợ ra sao?",
    a: "LingoArena cam kết đầu ra bằng văn bản. Học viên hoàn thành trên 85% giáo trình và bài tập nếu thi không đạt mục tiêu sẽ được học lại hoặc kèm 1-1 miễn phí 100%.",
  },
  {
    q: "Khóa học có bài tập thực hành và đề thi thử không?",
    a: "Tất cả các bài học đều có bài tập trắc nghiệm củng cố ngay dưới video và ngân hàng 10+ bộ đề thi thử full format có đáp án giải thích chi tiết.",
  },
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { isAuthenticated } = useAuthStore();
  const {
    getCourseBySlug,
    enrolledCourseIds,
    enrollCourse,
    loadCourseBySlug,
    loadMyEnrollments,
    isLoading,
    error,
  } = useCourseStore();
  const { addToast } = useToastStore();

  const course = getCourseBySlug(slug);
  const isEnrolled = course ? enrolledCourseIds.includes(course.id) : false;

  const [activeTab, setActiveTab] = useState<
    "curriculum" | "outcomes" | "instructor" | "reviews" | "faq"
  >("curriculum");

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [voucherCode, setVoucherCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatPrice = (amount: number) => {
    return `${formatNumber(amount)} ₫`;
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    if (
      voucherCode.toUpperCase() === "LINGO50" ||
      voucherCode.toUpperCase() === "PRO2026"
    ) {
      setDiscountApplied(true);
      addToast("Áp dụng mã giảm giá thành công (-10%)!", "success");
    } else {
      addToast("Mã giảm giá không hợp lệ hoặc đã hết hạn", "warning");
    }
  };

  useEffect(() => {
    if (!slug) return;
    loadCourseBySlug(slug);
    if (isAuthenticated) loadMyEnrollments();
  }, [slug, isAuthenticated, loadCourseBySlug, loadMyEnrollments]);

  const handleEnroll = async () => {
    if (!course) return;
    const href = `/courses/${course.slug}/learn/${firstLessonId}`;
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(href)}`);
      return;
    }
    try {
      await enrollCourse(course.id);
      addToast(`Đã kích hoạt khóa học "${course.title}" thành công!`, "success");
      router.push(href);
    } catch (err: any) {
      addToast(err?.message || "Không ghi danh được khóa học", "error");
    }
  };

  if (isLoading && !course) {
    return <div className="min-h-screen py-20 text-center text-sm text-muted-foreground">Đang tải khóa học...</div>;
  }

  if (!course) {
    return (
      <div className="min-h-screen py-20 text-center space-y-4">
        <p className="text-sm text-muted-foreground">{error || "Không tìm thấy khóa học yêu cầu."}</p>
        <Link href="/courses" className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold">
          Quay lại danh mục
        </Link>
      </div>
    );
  }

  const finalPrice = discountApplied
    ? Math.round(course.price * 0.9)
    : course.price;
  const firstLessonId = course.sections[0]?.lessons[0]?.id || "lesson-1";

  return (
    <div className="min-h-screen bg-background text-foreground py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link Breadcrumb */}
        <div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-4" /> Danh mục tất cả khóa học
          </Link>
        </div>

        {/* 1. HERO COURSE CARD (Cover + Visual + Info & CTA) */}
        <div className="grid lg:grid-cols-12 rounded-3xl border border-border overflow-hidden bg-card shadow-xl select-none">
          {/* Cover / Video Preview Column */}
          <div
            onClick={() => setShowVideoModal(true)}
            className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] lg:min-h-full bg-muted overflow-hidden group cursor-pointer"
          >
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/50 transition-colors">
              <div className="size-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl transition-transform group-hover:scale-115">
                <Play className="size-6 ml-0.5" />
              </div>
              <span className="text-xs font-bold text-white drop-shadow-md">
                Xem Video Giới Thiệu
              </span>
            </div>

            {/* Badges on Video Cover */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-primary text-primary-foreground text-xs font-black uppercase tracking-wider shadow-md">
                {course.examType.toUpperCase()}
              </span>
              {course.badge && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/90 text-white text-xs font-bold shadow-md">
                  ★ {course.badge}
                </span>
              )}
            </div>

            <div className="absolute bottom-4 left-4 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-black border border-white/20">
              Trình độ: {course.levelFrom} ➜ {course.levelTo}
            </div>
          </div>

          {/* Course Info & Pricing CTA Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 flex flex-col justify-between">
            <div className="space-y-3.5">
              {/* Rating & Updated info */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-foreground">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm">{course.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    ({formatNumber(course.reviewCount)} đánh giá)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground font-medium">
                  <Calendar className="size-3.5" />
                  <span>Cập nhật {course.updatedAt}</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight leading-tight">
                {course.title}
              </h1>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {course.shortDescription}
              </p>

              {/* Key Metrics */}
              <div className="flex flex-wrap gap-4 pt-1 text-xs sm:text-sm text-foreground font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  <strong>{course.totalDurationHours} giờ</strong> học
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="size-4 text-primary" />
                  <strong>{course.totalLessons}</strong> bài giảng
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="size-4 text-muted-foreground" />
                  {formatNumber(course.studentCount)} học viên
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe className="size-4 text-muted-foreground" />
                  {course.language}
                </span>
              </div>
            </div>

            {/* Price Box & Action Buttons */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  {course.isFree ? (
                    <span className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      Miễn Phí 100%
                    </span>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-black text-primary">
                        {formatPrice(finalPrice)}
                      </span>
                      {course.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through font-normal">
                          {formatPrice(course.originalPrice)}
                        </span>
                      )}
                      {course.discountPercent && (
                        <span className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
                          -{course.discountPercent}%
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {!course.isFree && (
                  <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-bold">
                    <Zap className="size-3.5 fill-amber-500 text-amber-500" />
                    <span>Ưu đãi áp dụng tháng này</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {isEnrolled ? (
                  <Link
                    href={`/courses/${course.slug}/learn/${firstLessonId}`}
                    className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-extrabold shadow-lg shadow-primary/25 transition-all hover:scale-101 active:scale-98"
                  >
                    <Play className="size-4" />
                    <span>Tiếp Tục Học Bài</span>
                  </Link>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={handleEnroll}
                      className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-extrabold shadow-lg shadow-primary/25 transition-all hover:scale-101 active:scale-98 cursor-pointer"
                    >
                      <Sparkles className="size-4" />
                      <span>
                        {course.isFree ? "Tham Gia Học Miễn Phí" : "Đăng Ký Học Ngay"}
                      </span>
                    </button>

                    {!course.isFree && (
                      <Link
                        href={`/courses/${course.slug}/learn/${firstLessonId}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-muted hover:bg-accent text-foreground text-xs font-bold border border-border transition-colors"
                      >
                        <span>Học thử bài mở đầu</span>
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Video Preview Modal */}
        {showVideoModal && (
          <div
            onClick={() => setShowVideoModal(false)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl aspect-16/9 rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/20"
            >
              <video
                src={
                  course.trailerVideoUrl ||
                  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                }
                controls
                autoPlay
                className="w-full h-full"
              />
            </div>
          </div>
        )}

        {/* 2. FOUR QUICK HIGHLIGHT CARDS (Giống Grid chế độ học của từ vựng) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
          <div className="p-5 rounded-3xl bg-card border border-border space-y-2 shadow-xs hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Play className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Video Bài Giảng 4K
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Học lý thuyết và phương pháp làm bài chi tiết từng bước.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border space-y-2 shadow-xs hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Chấm Điểm AI 24/7
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Trợ lý AI LingoBot sửa lỗi Writing và phát âm Speaking tức thì.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border space-y-2 shadow-xs hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Đề Thi & Tài Liệu
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tải tài liệu PDF độc quyền và luyện đề thi thử có giải thích.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-card border border-border space-y-2 shadow-xs hover:border-primary/40 transition-colors">
            <div className="size-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ShieldCheck className="size-5" />
            </div>
            <h3 className="font-bold text-sm text-foreground">
              Cam Kết Đầu Ra
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Hoàn tiền 100% trong 7 ngày hoặc học lại miễn phí nếu không đạt.
            </p>
          </div>
        </div>

        {/* 3. STRUCTURED TABBED CONTENT SECTION */}
        <div className="space-y-6">
          {/* Tab Navigation Buttons */}
          <div className="flex items-center gap-2 border-b border-border pb-2 overflow-x-auto no-scrollbar select-none">
            {[
              {
                id: "curriculum",
                label: `Giáo trình (${course.totalLessons} bài)`,
                icon: BookOpen,
              },
              {
                id: "outcomes",
                label: "Mục tiêu & Yêu cầu",
                icon: CheckCircle2,
              },
              {
                id: "instructor",
                label: "Giảng viên",
                icon: GraduationCap,
              },
              {
                id: "reviews",
                label: `Đánh giá (${course.reviewCount})`,
                icon: Star,
              },
              {
                id: "faq",
                label: "Hỏi đáp FAQ",
                icon: HelpCircle,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
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

          {/* TAB 1: CURRICULUM */}
          {activeTab === "curriculum" && (
            <div className="space-y-4 w-full animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-foreground">
                    Chương Trình Học Chi Tiết
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {course.sections.length} Chương · {course.totalLessons} Bài
                    học · {course.totalDurationHours} Giờ học
                  </p>
                </div>
              </div>

              <CourseCurriculumAccordion
                courseId={course.id}
                slug={course.slug}
                sections={course.sections}
                isEnrolled={isEnrolled}
              />
            </div>
          )}

          {/* TAB 2: OUTCOMES & REQUIREMENTS */}
          {activeTab === "outcomes" && (
            <div className="space-y-6 w-full animate-in fade-in">
              {/* Learning Outcomes */}
              <div className="p-6 rounded-3xl bg-card border border-border space-y-4 shadow-xs">
                <h3 className="font-extrabold text-base sm:text-lg text-foreground flex items-center gap-2">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  <span>Bạn Sẽ Đạt Được Gì Sau Khóa Học?</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-[13.5px]">
                  {course.learningOutcomes.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground leading-relaxed">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements & Target Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
                  <h4 className="font-bold text-sm text-foreground">
                    Yêu Cầu Đầu Vào:
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {course.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-3xl bg-card border border-border space-y-3">
                  <h4 className="font-bold text-sm text-foreground">
                    Khóa Học Phù Hợp Với:
                  </h4>
                  <ul className="space-y-2 text-xs text-muted-foreground">
                    {course.targetAudience.map((aud, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{aud}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INSTRUCTOR */}
          {activeTab === "instructor" && (
            <div className="w-full animate-in fade-in">
              <div className="p-6 rounded-3xl bg-card border border-border space-y-5 shadow-xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="size-20 rounded-2xl object-cover border-2 border-primary/20 shadow-md shrink-0"
                  />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-lg text-foreground">
                      {course.instructor.name}
                    </h4>
                    <p className="text-xs font-semibold text-primary">
                      {course.instructor.role} · {course.instructor.credentials}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                      <span>
                        ⭐ <strong>{course.instructor.rating}</strong> Đánh giá
                      </span>
                      <span>
                        👥 <strong>{formatNumber(course.instructor.totalStudents)}</strong> Học viên
                      </span>
                      <span>
                        📚 <strong>{course.instructor.coursesCount}</strong> Khóa học
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2 border-t border-border">
                  {course.instructor.bio}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === "reviews" && (
            <div className="w-full animate-in fade-in">
              <CourseReviewSection
                rating={course.rating}
                reviewCount={course.reviewCount}
                reviews={course.reviews}
              />
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === "faq" && (
            <div className="w-full space-y-3 animate-in fade-in">
              {COURSE_FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left font-bold text-xs sm:text-sm text-foreground flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="size-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs sm:text-[13px] text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
