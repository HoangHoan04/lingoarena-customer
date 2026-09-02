"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  Bot,
  Brain,
  CheckCircle2,
  Clock,
  Laptop,
  PenTool,
  RotateCcw,
  Sparkles,
  Volume2,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface FeatureTab {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  bullets: string[];
  icon: React.ElementType;
  interactivePreview: React.ReactNode;
}

export default function FeaturesSection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>("exam_simulator");

  const TABS: FeatureTab[] = [
    {
      id: "exam_simulator",
      badge: "Phòng thi chuẩn quốc tế",
      title: "Mô phỏng 100% áp lực phòng thi thật",
      subtitle: "REAL-TIME EXAM SIMULATOR",
      description: "Trải nghiệm giao diện thi máy tính chuẩn Format TOEIC, IELTS, Aptis và VSTEP với đồng hồ đếm ngược đồng bộ máy chủ, tự động lưu bài làm và chống nộp trùng.",
      bullets: [
        "Đồng hồ đếm ngược server-authoritative chống gian lận",
        "Tự động lưu câu trả lời (Autosave) sau từng thao tác",
        "Snapshot phiên bản câu hỏi cố định, bảo mật tuyệt đối",
        "Bảng quy đổi điểm chuẩn ETS & British Council ngay sau khi nộp",
      ],
      icon: Laptop,
      interactivePreview: (
        <div className="rounded-2xl bg-slate-900 text-white p-5 sm:p-6 shadow-2xl border border-slate-800 space-y-4">
          {/* Header of Mock Test Window */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-bold text-emerald-400 uppercase tracking-wider">ĐANG THI THỬ</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">TOEIC Full Test #04</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
              <Clock className="size-3.5" />
              <span>01:42:18</span>
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-[#7b9bee]">Câu 102 / 200 (Part 5 - Incomplete Sentences)</span>
              <span className="text-emerald-400 font-medium">✓ Đã tự động lưu</span>
            </div>
            <p className="text-sm font-medium text-slate-200 leading-relaxed">
              &quot;The marketing team will present their quarterly report as soon as the manager ________ from London.&quot;
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-300">
                A. return
              </div>
              <div className="p-2.5 rounded-lg border-2 border-[#2b417e] bg-[#2b417e]/30 text-xs text-[#7b9bee] font-bold flex items-center justify-between">
                <span>B. returns</span>
                <CheckCircle2 className="size-3.5 text-[#7b9bee]" />
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-300">
                C. returning
              </div>
              <div className="p-2.5 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-300">
                D. returned
              </div>
            </div>
          </div>

          {/* Mini Action Bar */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-slate-400">Đã làm: <strong className="text-white">102/200</strong> câu</span>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-medium">Câu trước</span>
              <span className="px-3 py-1.5 rounded-lg bg-[#2b417e] text-white font-bold">Câu tiếp theo →</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "srs_flashcard",
      badge: "Ghi nhớ ngắt quãng SM-2 / FSRS",
      title: "Học từ vựng thông minh, không lo quên lãng",
      subtitle: "SPACED REPETITION FLASHCARDS",
      description: "Ứng dụng thuật toán Spaced Repetition khoa học (FSRS/SM-2) tự động tính toán thời điểm vàng cần ôn tập, kèm phát âm chuẩn Audio UK/US và họ từ liên quan.",
      bullets: [
        "Gợi ý ôn tập đúng thời điểm vàng trước khi não bộ quên",
        "Audio giọng đọc bản xứ chuẩn Anh - Anh và Anh - Mỹ",
        "Bộ từ vựng phân loại theo chủ đề TOEIC 990 & IELTS 8.0+",
        "Đánh giá 4 mức độ: Again, Hard, Good, Easy để điều chỉnh chu kỳ",
      ],
      icon: Brain,
      interactivePreview: (
        <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-[#2b417e] dark:text-[#7b9bee]">FLASHCARD ÔN TẬP ĐẾN HẠN</span>
            <span className="px-2 py-0.5 rounded-full bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] font-bold">Thẻ 14/40</span>
          </div>

          <div className="text-center py-4 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
              <Volume2 className="size-3.5 text-[#2b417e] dark:text-[#7b9bee]" />
              <span>/ˌkɒm.prɪˈhen.sɪv/</span>
            </div>
            <h4 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Comprehensive (adj)
            </h4>
            <p className="text-sm font-semibold text-[#2b417e] dark:text-[#7b9bee]">
              Toàn diện, bao quát, đầy đủ mọi khía cạnh
            </p>
            <p className="text-xs text-slate-500 italic max-w-sm mx-auto pt-1">
              &quot;The school offers a comprehensive English preparation program for all international certificates.&quot;
            </p>
          </div>

          {/* 4 Ratings Buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-center border border-rose-200 dark:border-rose-800">
              <span className="block text-[10px] text-rose-500 font-bold">Again</span>
              <span className="text-[10px] text-slate-400">&lt; 10 phút</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-center border border-amber-200 dark:border-amber-800">
              <span className="block text-[10px] text-amber-500 font-bold">Hard</span>
              <span className="text-[10px] text-slate-400">1 ngày</span>
            </div>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-center border border-blue-200 dark:border-blue-800">
              <span className="block text-[10px] text-blue-600 font-bold">Good</span>
              <span className="text-[10px] text-slate-400">3 ngày</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-center border border-emerald-200 dark:border-emerald-800">
              <span className="block text-[10px] text-emerald-500 font-bold">Easy</span>
              <span className="text-[10px] text-slate-400">7 ngày</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "writing_speaking_ai",
      badge: "Chấm Rubric Chuẩn Quốc Tế",
      title: "Chấm chữa Writing & Speaking cùng AI & Giáo viên",
      subtitle: "DETAILED RUBRIC GRADING",
      description: "Không còn nỗi sợ tự học kỹ năng Viết và Nói. Hệ thống nhận xét tức thì từng lỗi ngữ pháp, gợi ý collocation nâng band và đội ngũ giáo viên chấm điểm theo 4 tiêu chí IELTS/VSTEP.",
      bullets: [
        "Phân tích lỗi sai ngữ pháp, từ vựng và cấu trúc câu chi tiết",
        "Chấm điểm theo 4 tiêu chí: Task Response, Coherence, Lexical, Grammar",
        "Ghi âm Speaking trực tiếp và phân tích độ trôi chảy & phát âm",
        "Cho phép học viên viết lại và nộp phiên bản sửa đổi (Version History)",
      ],
      icon: PenTool,
      interactivePreview: (
        <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="size-4 text-[#2b417e] dark:text-[#7b9bee]" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">IELTS Writing Task 2 Evaluation</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              Overall Band: 7.0
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Task Response</span>
              <span className="font-bold text-[#2b417e] dark:text-[#7b9bee] text-sm">7.5</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Coherence</span>
              <span className="font-bold text-[#2b417e] dark:text-[#7b9bee] text-sm">7.0</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Lexical Resource</span>
              <span className="font-bold text-[#2b417e] dark:text-[#7b9bee] text-sm">7.0</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 block">Grammar</span>
              <span className="font-bold text-[#2b417e] dark:text-[#7b9bee] text-sm">6.5</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#2b417e]/5 dark:bg-[#2b417e]/20 border border-[#2b417e]/15 dark:border-[#2b417e]/30 space-y-1.5 text-xs">
            <span className="font-bold text-[#2b417e] dark:text-[#7b9bee] flex items-center gap-1.5">
              <Sparkles className="size-3.5" /> Gợi ý nâng cấp câu văn:
            </span>
            <p className="text-slate-600 dark:text-slate-400 line-through">
              &quot;Many people think that technology has bad effects on children.&quot;
            </p>
            <p className="text-[#2b417e] dark:text-[#a0baff] font-medium">
              ➔ &quot;It is widely believed that the proliferation of modern technology exerts detrimental effects on child development.&quot;
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "mistake_notebook",
      badge: "Sổ Lỗi Tự Động",
      title: "Học từ chính sai lầm với Sổ lỗi thông minh",
      subtitle: "SMART MISTAKE NOTEBOOK",
      description: "Mọi câu làm sai trong quá trình luyện tập và thi thử sẽ tự động được phân loại vào Sổ lỗi theo dạng ngữ pháp hoặc từ vựng để bạn ôn lại cho đến khi thành thạo 100%.",
      bullets: [
        "Tự động thu gom câu sai vào danh mục lỗi (Ngữ pháp, Từ vựng, Bẫy đề)",
        "Cho phép ghi chú cá nhân và đánh dấu câu hỏi cần xem lại",
        "Tạo đề ôn tập riêng biệt chỉ gồm các câu bạn từng làm sai",
        "Theo dõi tỉ lệ khắc phục điểm yếu và mức độ làm chủ kiến thức",
      ],
      icon: RotateCcw,
      interactivePreview: (
        <div className="rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white">SỔ LỖI CẦN KHẮC PHỤC (12 CÂU)</span>
            <span className="text-xs text-amber-500 font-bold bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full">
              Ưu tiên ôn tập
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="font-bold text-rose-500">Lỗi: Mệnh đề quan hệ rút gọn</span>
                <span>Sai 2 lần</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                &quot;The participants ________ for the conference will receive a badge.&quot;
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Đáp án đúng: registering (Chủ động rút gọn của who register)
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 text-xs space-y-1">
              <div className="flex justify-between text-[11px] text-slate-400">
                <span className="font-bold text-rose-500">Lỗi: Từ loại (Word Formation)</span>
                <span>Sai 1 lần</span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                &quot;The board of directors approved the proposal with great ________.&quot;
              </p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Đáp án đúng: enthusiasm (Danh từ sau giới từ with)
              </p>
            </div>
          </div>

          <Button className="w-full py-4 text-xs font-bold bg-[#2b417e] hover:bg-[#1e2f5e] text-white rounded-xl cursor-pointer">
            Luyện tập lại 12 câu sai này ngay
          </Button>
        </div>
      ),
    },
  ];

  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
            <Zap className="size-3.5" />
            Công nghệ học tập độc quyền
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Giải pháp toàn diện cho người học tiếng Anh trực tuyến
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Tích hợp công nghệ hiện đại giải quyết trọn vẹn từ khâu nạp kiến thức, ôn luyện từ vựng ngắt quãng đến thi thử áp lực và chấm chữa bài tập chuyên sâu.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-900 border-[#2b417e] dark:border-[#7b9bee] shadow-lg shadow-[#2b417e]/10 scale-[1.02]"
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-[#2b417e] text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  {isActive && (
                    <span className="h-2 w-2 rounded-full bg-[#2b417e] dark:bg-[#7b9bee]" />
                  )}
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {tab.badge}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                    {tab.title}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="bg-slate-50/70 dark:bg-slate-900/50 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#2b417e] dark:text-[#7b9bee]">
                  {currentTab.subtitle}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                  {currentTab.title}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentTab.description}
              </p>

              {/* Bullet points */}
              <div className="space-y-3 pt-2">
                {currentTab.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="size-5 text-[#2b417e] dark:text-[#7b9bee] mt-0.5 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button
                  size="lg"
                  className="px-8 py-5 rounded-xl font-bold bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/20 cursor-pointer"
                  onClick={() => router.push("/practice")}
                >
                  Trải nghiệm tính năng này
                  <ArrowRight className="size-4 ml-1.5" />
                </Button>
              </div>
            </div>

            {/* Right Interactive Preview */}
            <div className="lg:col-span-6">
              {currentTab.interactivePreview}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
