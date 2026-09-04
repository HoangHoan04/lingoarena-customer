"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { pickLocaleText } from "@/lib/locale-text";
import { assessmentService } from "@/services/assessment.service";
import type { AssessmentSummary } from "@/types/assessment";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Headphones,
  Laptop,
  Loader2,
  PenTool,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";

function examCode(item: AssessmentSummary) {
  return item.examType?.code || item.examType?.name || "TEST";
}

function typeLabel(code?: string) {
  const labels: Record<string, string> = {
    MOCK_EXAM: "Thi thử",
    PLACEMENT_TEST: "Xếp lớp",
    PRACTICE_TEST: "Luyện tập",
    MINI_TEST: "Mini test",
    SECTION_TEST: "Theo phần",
  };
  return labels[code || ""] || code || "Đề luyện";
}

function questionCount(item: AssessmentSummary) {
  return (item.sections || []).reduce(
    (sum, section) => sum + (section.items?.length || 0),
    0,
  );
}

export default function PracticeHubPage() {
  const locale = useLocale();
  const router = useRouter();
  const [items, setItems] = useState<AssessmentSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExamType, setSelectedExamType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyFree, setOnlyFree] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    assessmentService
      .list({}, 0, 60)
      .then((res) => {
        if (mounted) setItems(res.data);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const examTypes = useMemo(() => {
    const codes = [...new Set(items.map(examCode).filter(Boolean))];
    return ["ALL", ...codes];
  }, [items]);

  const filteredExams = useMemo(() => {
    return items.filter((exam) => {
      if (selectedExamType !== "ALL" && examCode(exam) !== selectedExamType)
        return false;
      if (onlyFree && !exam.isFree) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = pickLocaleText(locale, exam.title, exam.titleEn)
          .toLowerCase()
          .includes(q);
        const matchesDescription = pickLocaleText(
          locale,
          exam.description,
          exam.descriptionEn,
        )
          .toLowerCase()
          .includes(q);
        if (!matchesTitle && !matchesDescription) return false;
      }
      return true;
    });
  }, [items, locale, onlyFree, searchQuery, selectedExamType]);

  const handleOpen = (assessment: AssessmentSummary) => {
    if (!assessment.isFree) {
      router.push("/pricing");
      return;
    }
    router.push(`/practice/${assessment.slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-brand-dark via-brand to-brand-dark text-white p-8 sm:p-12 shadow-2xl border border-brand/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#a0baff] text-xs font-bold uppercase tracking-wider">
            <Laptop className="size-3.5 text-emerald-400" />
            Phòng thi thử mô phỏng thời gian thực
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Kho Đề Thi Thử Chuẩn Quốc Tế
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Chọn đề đã xuất bản từ hệ thống, làm bài bằng đồng hồ server và nhận
            kết quả ngay sau khi nộp.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" /> Câu hỏi đã
              duyệt
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-[#a0baff]" /> Tự động lưu bài làm
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-300" /> Chấm tự động dạng
              hỗ trợ
            </span>
          </div>
        </div>
      </div>

      {/* 4 DEDICATED CERTIFICATE HUBS */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Phòng Thi Thử Chuẩn Quốc Tế Theo Chứng Chỉ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Chọn chứng chỉ mục tiêu để vào phòng thi mô phỏng định dạng máy
              tính chính thức
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/practice/toeic"
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xl hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-blue-50 text-brand dark:bg-blue-950/40 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Headphones className="size-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-brand dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-black uppercase">
                  4 Kỹ Năng
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                  TOEIC 4 Kỹ Năng
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Listening, Reading (200 câu) kết hợp Speaking (11 câu) &
                  Writing (8 câu) chuẩn ETS.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-primary dark:text-[#7b9bee]">
              <span>Vào phòng thi TOEIC</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/practice/ielts"
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xl hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 group-hover:scale-110 transition-transform">
                  <BookOpen className="size-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 text-[10px] font-black uppercase">
                  Band 0 - 9.0
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 transition-colors">
                  IELTS on Computer
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Giao diện chia đôi màn hình Split-Reading, Writing đếm từ trực
                  tiếp, Cue Card Speaking.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-rose-600 dark:text-rose-400">
              <span>Vào phòng thi IELTS</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/practice/vstep"
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xl hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <PenTool className="size-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-black uppercase">
                  Bậc 3 - 5
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                  VSTEP (B1 - B2 - C1)
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Khung năng lực 6 bậc Bộ GD&ĐT: 4 bài đọc học thuật, viết thư &
                  luận, Mindmap Speaking.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>Vào phòng thi VSTEP</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/practice/aptis"
            className="group relative rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xs hover:shadow-xl hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="size-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-[10px] font-black uppercase">
                  CEFR A1 - C
                </span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                  Aptis ESOL
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  5 phần thi tuần tự chuẩn British Council: Grammar & Vocab,
                  Nghe, Đọc, Viết, Nói.
                </p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>Vào phòng thi Aptis</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <div className="bg-white/95 dark:bg-slate-900/95 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-md backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md flex items-center">
            <Search className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm theo tên đề thi"
              className="pl-10 h-11 rounded-2xl text-xs sm:text-sm bg-slate-50/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyFree}
              onChange={(e) => setOnlyFree(e.target.checked)}
              className="size-4 rounded-md border-slate-300 dark:border-slate-700 text-brand focus:ring-brand cursor-pointer"
            />
            <span>Chỉ hiện đề miễn phí</span>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2">
            Chứng chỉ:
          </span>
          {examTypes.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setSelectedExamType(code)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedExamType === code
                  ? "bg-brand text-white border-brand shadow-xs"
                  : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100"
              }`}
            >
              {code === "ALL" ? "Tất cả chứng chỉ" : code}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Hiển thị <strong>{filteredExams.length}</strong> bộ đề thi thử phù hợp
        </span>
        <span className="text-brand dark:text-[#7b9bee] font-semibold">
          Dữ liệu từ hệ thống đề đã xuất bản
        </span>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-brand" />
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
          <BookOpen className="mx-auto size-10 text-slate-400" />
          <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">
            Chưa có đề phù hợp
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thử đổi bộ lọc hoặc quay lại sau.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-brand/40 dark:hover:border-[#7b9bee]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    variant="outline"
                    className="bg-brand/10 text-brand dark:text-[#7b9bee] border-brand/20 text-[11px] font-bold"
                  >
                    {examCode(exam)}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {exam.isFree && (
                      <Badge className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase">
                        Miễn phí
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-bold"
                    >
                      {typeLabel(exam.assessmentType)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-brand dark:group-hover:text-[#7b9bee] transition-colors line-clamp-1">
                    {pickLocaleText(locale, exam.title, exam.titleEn)}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {pickLocaleText(
                      locale,
                      exam.description,
                      exam.descriptionEn,
                    ) || "Đề luyện tập được xuất bản trên LingoArena."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Thời gian
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="size-3 text-brand dark:text-[#7b9bee]" />
                      {Math.round(Number(exam.durationSeconds || 0) / 60)} phút
                    </span>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Số câu
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {questionCount(exam)} câu
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Lượt tối đa
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {exam.maxAttempts ? `${exam.maxAttempts}` : "∞"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="size-3.5 fill-amber-400" />
                  <span>{exam.isFree ? "Free" : "Premium"}</span>
                </div>

                <Button
                  onClick={() => handleOpen(exam)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand hover:bg-[#1e2f5e] text-white shadow-md shadow-brand/20 cursor-pointer flex items-center gap-1.5"
                >
                  <span>{exam.isFree ? "Vào thi ngay" : "Xem gói học"}</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
