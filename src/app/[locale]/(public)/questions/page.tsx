"use client";

import { QuestionCard } from "@/components/question";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useRouter } from "@/i18n/routing";
import { questionService } from "@/services/question.service";
import { useToastStore } from "@/stores/useToastStore";
import type { PracticeFilter, PublicQuestion, QuestionLookup } from "@/types/question";
import {
  BookOpen,
  CheckCircle2,
  Database,
  Filter,
  Flame,
  Headphones,
  HelpCircle,
  Layers,
  Play,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type FilterOption = { value: string; label: string };

const CEFR_OPTIONS: FilterOption[] = ["A1", "A2", "B1", "B2", "C1", "C2"].map((item) => ({
  value: item,
  label: `CEFR ${item}`,
}));

const LIMIT_OPTIONS = [5, 10, 20, 30] as const;

function toOptions(rows: QuestionLookup[]): FilterOption[] {
  return rows.map((item) => ({
    value: item.id,
    label: item.name || item.label || item.id,
  }));
}

function FilterCombobox({
  items,
  value,
  onChange,
  placeholder,
  icon: Icon,
}: {
  items: FilterOption[];
  value?: string;
  onChange: (value?: string) => void;
  placeholder: string;
  icon?: any;
}) {
  const selected = useMemo(
    () => items.find((item) => item.value === value) ?? null,
    [items, value],
  );

  return (
    <div className="relative w-full">
      <Combobox
        items={items}
        value={selected}
        onValueChange={(next) => onChange(next?.value || undefined)}
        itemToStringLabel={(item) => item.label}
        itemToStringValue={(item) => item.value}
        isItemEqualToValue={(a, b) => a.value === b.value}
      >
        <ComboboxInput
          placeholder={placeholder}
          showClear
          className="h-11 w-full rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-primary"
        />
        <ComboboxContent className="max-h-64 dark:bg-slate-900 dark:border-slate-800">
          <ComboboxEmpty>Không tìm thấy lựa chọn.</ComboboxEmpty>
          <ComboboxList>
            {(item: FilterOption) => (
              <ComboboxItem key={item.value} value={item} className="text-xs sm:text-sm font-medium">
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}

export default function QuestionsPage() {
  const { addToast } = useToastStore();
  const router = useRouter();
  const [examTypes, setExamTypes] = useState<QuestionLookup[]>([]);
  const [skills, setSkills] = useState<QuestionLookup[]>([]);
  const [types, setTypes] = useState<QuestionLookup[]>([]);
  const [topics, setTopics] = useState<QuestionLookup[]>([]);
  const [filter, setFilter] = useState<PracticeFilter>({});
  const [searchKeyword, setSearchKeyword] = useState("");
  const [practiceLimit, setPracticeLimit] = useState<number>(10);
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [starting, setStarting] = useState(false);
  const PAGE_SIZE = 18;

  useEffect(() => {
    (async () => {
      try {
        const [exam, typeRows, topicRows] = await Promise.all([
          questionService.lookupExamTypes(),
          questionService.lookupTypes(),
          questionService.lookupTopics(),
        ]);
        setExamTypes(exam);
        setTypes(typeRows);
        setTopics(topicRows);
      } catch (err: any) {
        addToast(err?.message || "Không tải được bộ lọc câu hỏi", "error");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setSkills(await questionService.lookupSkills(filter.examTypeId));
      } catch {
        setSkills([]);
      }
    })();
  }, [filter.examTypeId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await questionService.pagination(0, PAGE_SIZE, filter);
        if (!cancelled) {
          setQuestions(res.data);
          setTotal(res.total);
        }
      } catch (err: any) {
        addToast(err?.message || "Không tải được danh sách câu hỏi", "error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [filter.examTypeId, filter.examSkillId, filter.questionTypeId, filter.topicId, filter.cefrLevel]);

  const examTypeOptions = useMemo(() => toOptions(examTypes), [examTypes]);
  const skillOptions = useMemo(() => toOptions(skills), [skills]);
  const typeOptions = useMemo(() => toOptions(types), [types]);
  const topicOptions = useMemo(() => toOptions(topics), [topics]);

  // Filtered by local keyword search
  const displayedQuestions = useMemo(() => {
    if (!searchKeyword.trim()) return questions;
    const q = searchKeyword.toLowerCase().trim();
    return questions.filter(
      (item) =>
        item.prompt.toLowerCase().includes(q) ||
        (item.instructions && item.instructions.toLowerCase().includes(q)),
    );
  }, [questions, searchKeyword]);

  const handleStartPractice = async (overrideLimit?: number) => {
    setStarting(true);
    try {
      const res = await questionService.startPractice({
        ...filter,
        limit: overrideLimit || practiceLimit,
      });
      if (!res.items.length) {
        addToast("Chưa có câu hỏi phù hợp để luyện tập theo bộ lọc đã chọn", "error");
        return;
      }
      sessionStorage.setItem("lingoarena.practice", JSON.stringify(res.items));
      router.push("/questions/practice");
    } catch (err: any) {
      addToast(err?.message || "Không bắt đầu được phiên luyện tập", "error");
    } finally {
      setStarting(false);
    }
  };

  const handlePracticeSingle = (singleQuestion: PublicQuestion) => {
    sessionStorage.setItem("lingoarena.practice", JSON.stringify([singleQuestion]));
    router.push("/questions/practice");
  };

  const handleClearFilters = () => {
    setFilter({});
    setSearchKeyword("");
  };

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const res = await questionService.pagination(questions.length, PAGE_SIZE, filter);
      setQuestions((prev) => [...prev, ...res.data]);
      setTotal(res.total);
    } catch (err: any) {
      addToast(err?.message || "Không tải thêm được câu hỏi", "error");
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* HERO HEADER BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-slate-900 via-[#1e2f5e] to-slate-900 text-white p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Sparkles className="size-3.5 text-amber-400 animate-pulse" />
            <span>Ngân Hàng Đề Thi & Luyện Dạng Câu</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Ngân Hàng Câu Hỏi{" "}
            <span className="bg-linear-to-r from-blue-300 via-indigo-200 to-sky-300 bg-clip-text text-transparent">
              Chuẩn Hóa Quốc Tế
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Hàng ngàn câu hỏi phân loại chi tiết theo kỳ thi (TOEIC, IELTS, VSTEP), dạng bài và cấp độ CEFR. Tự chọn dạng câu yếu để luyện tập và nhận lời giải chi tiết ngay lập tức.
          </p>

          {/* Quick Practice Launcher Controls */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/15 p-1 rounded-2xl">
              <span className="text-xs font-bold px-2 text-slate-300">Số câu:</span>
              {LIMIT_OPTIONS.map((limit) => (
                <button
                  key={limit}
                  type="button"
                  onClick={() => setPracticeLimit(limit)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    practiceLimit === limit
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {limit} câu
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleStartPractice()}
              disabled={starting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-black shadow-lg shadow-primary/30 transition-all hover:scale-102 cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Play className="size-4 fill-current" />
              <span>Bắt đầu luyện tập ({practiceLimit} câu)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 STATISTICAL CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 shrink-0">
            <Database className="size-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {total.toLocaleString("vi-VN")}
            </div>
            <div className="text-xs text-slate-500 font-semibold">Câu hỏi sẵn có</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 shrink-0">
            <Headphones className="size-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Listening
            </div>
            <div className="text-xs text-slate-500 font-semibold">Kỹ năng Nghe audio</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Reading
            </div>
            <div className="text-xs text-slate-500 font-semibold">Đọc hiểu đoạn văn</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              A1 - C2
            </div>
            <div className="text-xs text-slate-500 font-semibold">Đa dạng cấp độ</div>
          </div>
        </div>
      </div>

      {/* FILTER TOOLBAR PANEL */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <SlidersHorizontal className="size-5 text-primary dark:text-[#7b9bee]" />
              <span>Bộ Lọc Ngân Hàng Câu Hỏi</span>
            </h2>
            <p className="text-xs text-slate-500">
              Lọc chính xác theo kỳ thi, kỹ năng, dạng bài và mức độ khó
            </p>
          </div>

          {/* Prompt Keyword Search */}
          <div className="relative w-full sm:w-72">
            <Search className="size-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Tìm theo nội dung đề bài..."
              className="w-full h-10 pl-10 pr-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Filters Grid */}
        <div className="rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 shadow-2xs">
          <FilterCombobox
            items={examTypeOptions}
            value={filter.examTypeId}
            placeholder="Mọi kỳ thi"
            onChange={(examTypeId) =>
              setFilter((prev) => ({ ...prev, examTypeId, examSkillId: undefined }))
            }
          />
          <FilterCombobox
            items={skillOptions}
            value={filter.examSkillId}
            placeholder="Mọi kỹ năng"
            onChange={(examSkillId) => setFilter((prev) => ({ ...prev, examSkillId }))}
          />
          <FilterCombobox
            items={typeOptions}
            value={filter.questionTypeId}
            placeholder="Mọi dạng câu"
            onChange={(questionTypeId) => setFilter((prev) => ({ ...prev, questionTypeId }))}
          />
          <FilterCombobox
            items={topicOptions}
            value={filter.topicId}
            placeholder="Mọi chủ đề"
            onChange={(topicId) => setFilter((prev) => ({ ...prev, topicId }))}
          />
          <FilterCombobox
            items={CEFR_OPTIONS}
            value={filter.cefrLevel}
            placeholder="Mọi CEFR"
            onChange={(cefrLevel) => setFilter((prev) => ({ ...prev, cefrLevel }))}
          />
        </div>
      </section>

      {/* RESULTS LIST & META */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
          <span>
            Hiển thị <strong className="text-primary dark:text-[#7b9bee]">{displayedQuestions.length}</strong> / {total} câu hỏi đã duyệt
          </span>
          {(filter.examTypeId ||
            filter.examSkillId ||
            filter.questionTypeId ||
            filter.topicId ||
            filter.cefrLevel ||
            searchKeyword) && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1 text-primary dark:text-[#7b9bee] hover:underline cursor-pointer"
            >
              <RotateCcw className="size-3" /> Đặt lại bộ lọc
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse border border-slate-200/50 dark:border-slate-800"
              />
            ))}
          </div>
        ) : displayedQuestions.length > 0 ? (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedQuestions.map((q) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  onPracticeSingle={handlePracticeSingle}
                />
              ))}
            </div>
            {questions.length < total && !searchKeyword.trim() && (
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200 hover:border-primary cursor-pointer disabled:opacity-50"
                >
                  {loadingMore ? "Đang tải..." : `Xem thêm (${questions.length}/${total})`}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center space-y-3 bg-white dark:bg-slate-900/40">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="size-7" />
            </div>
            <h3 className="text-lg font-black text-slate-800 dark:text-slate-200">
              Không tìm thấy câu hỏi phù hợp
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              Hãy thử chọn bộ lọc kỳ thi hoặc kỹ năng khác để xem thêm câu hỏi.
            </p>
            <button
              type="button"
              onClick={handleClearFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-sm hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <RotateCcw className="size-3.5" /> Xóa toàn bộ bộ lọc
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
