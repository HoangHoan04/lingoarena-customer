"use client";

import type { WritingTopic } from "@/types/writing";
import { useToastStore } from "@/stores/useToastStore";
import { Clock, FileEdit, PenTool, Sparkles, Target } from "lucide-react";
import { useState } from "react";

interface WritingCustomPromptCardProps {
  onStartCustomTopic: (topic: WritingTopic) => void;
}

export function WritingCustomPromptCard({
  onStartCustomTopic,
}: WritingCustomPromptCardProps) {
  const { addToast } = useToastStore();

  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [minWords, setMinWords] = useState(250);
  const [timeLimitMin, setTimeLimitMin] = useState(40);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      addToast("Vui lòng nhập nội dung đề bài bạn muốn viết", "error");
      return;
    }

    const customTopic: WritingTopic = {
      id: `custom-${Date.now()}`,
      title: title.trim() || prompt.trim().slice(0, 60),
      examType: "GENERAL",
      category: "Bài viết tự do",
      level: "B2",
      prompt: prompt.trim(),
      minWords,
      timeLimitMin,
      tags: ["Tự do", "Tự nhập đề"],
      outlineIdeas: [
        "Mở bài: Nêu bối cảnh và quan điểm chính của bạn.",
        "Thân bài 1: Phát triển luận điểm thứ nhất kèm ví dụ thực tế.",
        "Thân bài 2: Phát triển luận điểm thứ hai hoặc phân tích khía cạnh đối lập.",
        "Kết bài: Tóm lược lại các luận điểm và kết luận.",
      ],
      suggestedVocab: [
        { word: "in addition", meaning: "ngoài ra, thêm vào đó", level: "B2" },
        { word: "furthermore", meaning: "hơn thế nữa", level: "B2" },
        { word: "consequently", meaning: "kết quả là, do đó", level: "B2" },
        { word: "significant impact", meaning: "tác động đáng kể", level: "C1" },
      ],
      sampleBand: "Tham khảo",
      sampleAnswer: "Bạn đang viết đề bài tự do. Sau khi nộp bài, AI sẽ chấm điểm và cung cấp bản sửa lỗi chi tiết cho bạn.",
      sampleAnalysisVi: "Bài viết tự do được chấm điểm theo các tiêu chí ngữ pháp, từ vựng và tính liên kết.",
    };

    onStartCustomTopic(customTopic);
  };

  return (
    <div className="max-w-3xl mx-auto rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 shadow-md space-y-6">
      <div className="space-y-1.5 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-xs font-black uppercase">
          <Sparkles className="size-3.5" />
          <span>Tự Nhập Đề Bài / Bài Tập Trên Lớp</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          Luyện Viết Với Đề Bài Của Riêng Bạn
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          Dán bất kỳ đề bài luận tiếng Anh, bài tập ở trường, thư tín hoặc email công việc vào đây. Hệ thống AI sẽ chấm điểm và sửa lỗi ngữ pháp chi tiết cho bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* TIÊU ĐỀ */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Tiêu đề bài viết (không bắt buộc)
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Essay on Climate Change / Cover Letter for Software Engineer"
            className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* NỘI DUNG ĐỀ BÀI (*) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Nội dung đề bài / Yêu cầu viết <strong className="text-rose-500">*</strong></span>
            <span className="text-[11px] text-slate-400 font-normal">Dán đề bài tại đây</span>
          </label>
          <textarea
            required
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ví dụ: Some people believe that university education should be free for all students. To what extent do you agree or disagree?"
            className="w-full p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-emerald-600 focus:outline-none resize-none"
          />
        </div>

        {/* THÔNG SỐ: SỐ TỪ & THỜI GIAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="size-3.5 text-emerald-500" />
              <span>Số từ tối thiểu (Target Words)</span>
            </label>
            <select
              value={minWords}
              onChange={(e) => setMinWords(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:border-emerald-600 focus:outline-none"
            >
              <option value={80}>80 từ (Đoạn văn ngắn / Email ngắn)</option>
              <option value={150}>150 từ (IELTS Task 1 / VSTEP Task 1)</option>
              <option value={250}>250 từ (IELTS Task 2 / VSTEP Task 2)</option>
              <option value={300}>300 từ (TOEIC Opinion Essay / Luận dài)</option>
              <option value={400}>400 từ (Bài luận học thuật nâng cao)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="size-3.5 text-amber-500" />
              <span>Thời gian làm bài khuyến nghị</span>
            </label>
            <select
              value={timeLimitMin}
              onChange={(e) => setTimeLimitMin(Number(e.target.value))}
              className="w-full h-12 px-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-bold focus:border-emerald-600 focus:outline-none"
            >
              <option value={15}>15 phút</option>
              <option value={20}>20 phút</option>
              <option value={30}>30 phút</option>
              <option value={40}>40 phút (Chuẩn IELTS Task 2)</option>
              <option value={60}>60 phút</option>
            </select>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-3">
          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-101 cursor-pointer active:scale-98"
          >
            <PenTool className="size-5" />
            <span>Bắt đầu viết bài ngay</span>
          </button>
        </div>
      </form>
    </div>
  );
}
