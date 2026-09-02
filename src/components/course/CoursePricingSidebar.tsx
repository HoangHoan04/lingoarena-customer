"use client";

import { type Course, useCourseStore } from "@/stores/useCourseStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  FileCheck,
  Gift,
  Headphones,
  Infinity as InfinityIcon,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Tag,
  Zap,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import React, { useState } from "react";

export default function CoursePricingSidebar({ course }: { course: Course }) {
  const { enrolledCourseIds, enrollCourse } = useCourseStore();
  const { addToast } = useToastStore();
  const isEnrolled = enrolledCourseIds.includes(course.id);

  const [voucherCode, setVoucherCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;
    if (voucherCode.toUpperCase() === "LINGO50" || voucherCode.toUpperCase() === "PRO2026") {
      setDiscountApplied(true);
      addToast("Áp dụng mã giảm giá thành công (-10%)!", "success");
    } else {
      addToast("Mã giảm giá không hợp lệ hoặc đã hết hạn", "warning");
    }
  };

  const handleEnroll = () => {
    enrollCourse(course.id);
    addToast(`Đã kích hoạt khóa học "${course.title}" thành công!`, "success");
  };

  const finalPrice = discountApplied ? Math.round(course.price * 0.9) : course.price;
  const firstLessonId = course.sections[0]?.lessons[0]?.id || "lesson-1";

  return (
    <div className="sticky top-24 rounded-3xl bg-card border border-border shadow-xl p-5 sm:p-6 space-y-5 select-none">
      {/* Video Preview Card */}
      <div
        onClick={() => setShowVideoModal(true)}
        className="group relative aspect-16/9 rounded-2xl overflow-hidden bg-muted cursor-pointer shadow-md"
      >
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 group-hover:bg-black/50 transition-colors">
          <div className="size-13 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-2xl transition-transform group-hover:scale-115">
            <Play className="size-6 ml-0.5" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">
            Xem Video Giới Thiệu
          </span>
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
              src={course.trailerVideoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
              controls
              autoPlay
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Price & Flashsale */}
      <div className="space-y-1">
        <div className="flex items-baseline justify-between">
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
              </div>
            )}
          </div>

          {course.discountPercent && !course.isFree && (
            <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-black">
              Tiết kiệm {course.discountPercent}%
            </span>
          )}
        </div>

        {!course.isFree && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-bold pt-1">
            <Zap className="size-3.5 fill-amber-500 text-amber-500" />
            <span>Ưu đãi áp dụng có hạn trong tháng này</span>
          </div>
        )}
      </div>

      {/* Primary Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {isEnrolled ? (
          <Link
            href={`/courses/${course.slug}/learn/${firstLessonId}`}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-extrabold shadow-lg shadow-primary/25 transition-all hover:scale-101 active:scale-98"
          >
            <Play className="size-4 ml-0.5" />
            <span>Tiếp Tục Bài Học</span>
          </Link>
        ) : (
          <>
            <button
              type="button"
              onClick={handleEnroll}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-extrabold shadow-lg shadow-primary/25 transition-all hover:scale-101 active:scale-98 cursor-pointer"
            >
              <Sparkles className="size-4" />
              <span>{course.isFree ? "Tham Gia Học Miễn Phí" : "Đăng Ký Học Ngay"}</span>
            </button>

            {!course.isFree && (
              <Link
                href={`/courses/${course.slug}/learn/${firstLessonId}`}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl bg-muted hover:bg-muted/80 text-foreground text-xs font-bold transition-colors border border-border"
              >
                <span>Học Thử Bài Mở Đầu (Free Preview)</span>
              </Link>
            )}
          </>
        )}
      </div>

      {/* Voucher Input */}
      {!course.isFree && !isEnrolled && (
        <form onSubmit={handleApplyVoucher} className="space-y-1.5 pt-2">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Nhập mã giảm giá (VD: LINGO50)"
                className="w-full h-9 pl-8 pr-2.5 rounded-xl border border-border bg-muted text-xs placeholder:text-muted-foreground text-foreground focus:outline-none focus:border-primary uppercase font-bold"
              />
            </div>
            <button
              type="submit"
              className="px-3 h-9 rounded-xl bg-secondary hover:bg-muted text-foreground text-xs font-bold border border-border transition-colors cursor-pointer"
            >
              Áp dụng
            </button>
          </div>
        </form>
      )}

      {/* Inclusions Checklist */}
      <div className="space-y-3 pt-4 border-t border-border text-xs">
        <h4 className="font-extrabold text-foreground text-xs uppercase tracking-wider">
          Khóa Học Bao Gồm:
        </h4>

        <ul className="space-y-2.5 text-muted-foreground">
          <li className="flex items-center gap-2.5">
            <Clock className="size-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">
              <strong>{course.totalDurationHours} giờ</strong> video bài giảng chất lượng cao 4K
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">
              <strong>{course.totalLessons} bài học</strong> & tài liệu PDF độc quyền
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <Sparkles className="size-4 text-amber-500 shrink-0" />
            <span className="text-foreground font-medium">
              Chấm bài Writing & Speaking bằng <strong>AI LingoBot 24/7</strong>
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <Award className="size-4 text-emerald-500 shrink-0" />
            <span className="text-foreground font-medium">
              Cấp chứng nhận hoàn thành khóa học chính thức
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <InfinityIcon className="size-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">
              Quyền sở hữu trọn đời & học mọi lúc mọi nơi
            </span>
          </li>
          <li className="flex items-center gap-2.5">
            <RotateCcw className="size-4 text-primary shrink-0" />
            <span className="text-foreground font-medium">
              Cam kết hoàn tiền 100% trong 7 ngày nếu không hài lòng
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
