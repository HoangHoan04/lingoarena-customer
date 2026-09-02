"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { assessmentService } from "@/services/assessment.service";
import type { AssessmentSummary } from "@/types/assessment";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Laptop,
  Loader2,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
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
  return (item.sections || []).reduce((sum, section) => sum + (section.items?.length || 0), 0);
}

export default function PracticeHubPage() {
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
      if (selectedExamType !== "ALL" && examCode(exam) !== selectedExamType) return false;
      if (onlyFree && !exam.isFree) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = exam.title.toLowerCase().includes(q);
        const matchesDescription = String(exam.description || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesDescription) return false;
      }
      return true;
    });
  }, [items, onlyFree, searchQuery, selectedExamType]);

  const handleOpen = (assessment: AssessmentSummary) => {
    if (!assessment.isFree) {
      router.push("/pricing");
      return;
    }
    router.push(`/practice/${assessment.slug}`);
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 sm:py-10 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="relative rounded-3xl overflow-hidden bg-linear-to-r from-[#1b2950] via-[#2b417e] to-[#1b2950] text-white p-8 sm:p-12 shadow-2xl border border-[#2b417e]/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#a0baff] text-xs font-bold uppercase tracking-wider">
            <Laptop className="size-3.5 text-emerald-400" />
            Phòng thi thử mô phỏng thời gian thực
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            Kho Đề Thi Thử Chuẩn Quốc Tế
          </h1>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
            Chọn đề đã xuất bản từ hệ thống, làm bài bằng đồng hồ server và nhận kết quả ngay sau khi nộp.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-400" /> Câu hỏi đã duyệt
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-[#a0baff]" /> Tự động lưu bài làm
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-amber-300" /> Chấm tự động dạng hỗ trợ
            </span>
          </div>
        </div>
      </div>

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
              className="size-4 rounded-md border-slate-300 dark:border-slate-700 text-[#2b417e] focus:ring-[#2b417e] cursor-pointer"
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
                  ? "bg-[#2b417e] text-white border-[#2b417e] shadow-xs"
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
        <span className="text-[#2b417e] dark:text-[#7b9bee] font-semibold">
          Dữ liệu từ hệ thống đề đã xuất bản
        </span>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="size-8 animate-spin text-[#2b417e]" />
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center">
          <BookOpen className="mx-auto size-10 text-slate-400" />
          <h3 className="mt-3 text-lg font-black text-slate-900 dark:text-white">Chưa có đề phù hợp</h3>
          <p className="mt-1 text-sm text-slate-500">Hãy thử đổi bộ lọc hoặc quay lại sau.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredExams.map((exam) => (
            <div
              key={exam.id}
              className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl hover:border-[#2b417e]/40 dark:hover:border-[#7b9bee]/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] border-[#2b417e]/20 text-[11px] font-bold">
                    {examCode(exam)}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {exam.isFree && <Badge className="bg-emerald-500 text-white text-[10px] font-extrabold uppercase">Miễn phí</Badge>}
                    <Badge variant="secondary" className="text-[10px] font-bold">
                      {typeLabel(exam.assessmentType)}
                    </Badge>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#2b417e] dark:group-hover:text-[#7b9bee] transition-colors line-clamp-1">
                    {exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                    {exam.description || "Đề luyện tập được xuất bản trên LingoArena."}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Thời gian</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1 mt-0.5">
                      <Clock className="size-3 text-[#2b417e] dark:text-[#7b9bee]" />
                      {Math.round(Number(exam.durationSeconds || 0) / 60)} phút
                    </span>
                  </div>
                  <div className="border-x border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-400 block font-medium">Số câu</span>
                    <span className="font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {questionCount(exam)} câu
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Lượt tối đa</span>
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
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-md shadow-[#2b417e]/20 cursor-pointer flex items-center gap-1.5"
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
