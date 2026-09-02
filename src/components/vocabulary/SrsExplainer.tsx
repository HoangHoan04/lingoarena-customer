"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "@/i18n/routing";
import {
  BrainCircuit,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";

const TIPS = [
  {
    icon: Target,
    title: "Học theo ngữ cảnh & Chủ đề",
    body: "Từ vựng khi học theo chủ đề (kinh doanh, du lịch, thi TOEIC/IELTS) kết nối với mạng lưới ngữ nghĩa trong não bộ chặt chẽ hơn nhiều so với danh sách từ ngẫu nhiên.",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    icon: CalendarCheck,
    title: "Ôn tập đều đặn mỗi ngày",
    body: "Dành 10–15 phút ôn các thẻ đến hạn mỗi ngày mang lại hiệu quả gấp 5 lần so với việc dồn hàng giờ học từ mới vào cuối tuần.",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/50",
  },
  {
    icon: BrainCircuit,
    title: "Nghe phát âm & Shadowing",
    body: "Sau khi thuộc nghĩa, hãy nghe audio US/UK và nhắc lại to rõ câu ví dụ để kích hoạt cả thính giác và cơ quan phát âm, biến từ vựng thành phản xạ tự nhiên.",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
];

const CEFR_ROWS = [
  {
    level: "A1",
    words: "~500 từ",
    meaning: "Giao tiếp cơ bản, câu ngắn chào hỏi, số đếm, gia đình.",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300",
  },
  {
    level: "A2",
    words: "~1.000 từ",
    meaning: "Tình huống quen thuộc: mua sắm, chỉ đường, giới thiệu bản thân.",
    badgeClass: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300",
  },
  {
    level: "B1",
    words: "~2.000 từ",
    meaning: "Kể chuyện, nêu quan điểm đơn giản, xem tin tức ngắn, thi TOEIC 550+.",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300",
  },
  {
    level: "B2",
    words: "~4.000 từ",
    meaning: "Thảo luận bài báo phức tạp, đàm phán công việc, IELTS 5.5 - 6.5.",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300",
  },
  {
    level: "C1",
    words: "~8.000 từ",
    meaning: "Ngôn ngữ linh hoạt, bài viết học thuật chuyên sâu, IELTS 7.0 - 8.0.",
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/50 dark:text-violet-300",
  },
  {
    level: "C2",
    words: "10.000+ từ",
    meaning: "Gần như bản ngữ: hiểu sâu sắc thái văn phong, thành ngữ tinh tế.",
    badgeClass: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300",
  },
];

const FAQS = [
  {
    id: "srs-1",
    q: "Spaced Repetition (Lặp lại ngắt quãng) hoạt động như thế nào?",
    a: "Theo đường cong quên lãng của Ebbinghaus, não người quên tới 70% kiến thức mới sau 24-48 giờ nếu không được củng cố. SRS (trên LingoArena áp dụng thuật toán SM-2) tính toán chính xác khoảng thời gian bạn sắp quên để nhắc ôn lại: từ mới quên (Again) sẽ hiện lại sau 10 phút, từ khó (Hard) sau 1 ngày, từ nhớ tốt (Good) sau 3-5 ngày, và từ dễ (Easy) giãn ra hàng tuần.",
  },
  {
    id: "srs-2",
    q: "Flashcard khác chế độ Quiz trắc nghiệm như thế nào?",
    a: "Flashcard yêu cầu bạn chủ động truy xuất trí nhớ (Active Recall) rồi tự đánh giá mức độ thuộc (Again/Hard/Good/Easy). Quiz trắc nghiệm cho sẵn 4 phương án nghĩa tiếng Việt, câu trả lời đúng được tính là Good, sai tính là Again. Cả hai chế độ đều cập nhật đồng bộ vào tiến độ SRS của tài khoản.",
  },
  {
    id: "srs-3",
    q: "Mỗi ngày tôi nên dành bao nhiêu thời gian học từ vựng?",
    a: "Chỉ cần 10–15 phút hàng ngày để giải quyết danh sách thẻ đến hạn. Khi hoàn thành thẻ đến hạn, bạn có thể học thêm 10-15 từ mới từ các bộ thẻ đề xuất.",
  },
  {
    id: "srs-4",
    q: "Sổ tay từ vựng (Notebook) được tạo tự động như thế nào?",
    a: "Mọi từ vựng bạn từng gặp và hoàn thành trong các phiên học Flashcard hoặc Quiz sẽ tự động lưu vào Sổ tay cá nhân. Bạn có thể lọc từ theo trạng thái (Mới, Đang học, Ôn tập, Đã thuộc, Quên) bất cứ lúc nào.",
  },
];

export default function SrsExplainer({ compact }: { compact?: boolean }) {
  return (
    <section className="space-y-8">
      {/* Hero Overview Box */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-10 space-y-4 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
          <BrainCircuit className="size-3.5" />
          <span>Khoa Học Về Trí Nhớ</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          {compact ? "Ôn tập đúng lúc bạn sắp quên" : "Bí quyết nhớ từ vựng vĩnh viễn với thuật toán SM-2"}
        </h2>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
          Thay vì học thuộc lòng hàng trăm từ một lúc rồi quên sạch sau một tuần, thuật toán Spaced Repetition (SRS) trên LingoArena tự động tính toán thời gian tối ưu cho từng từ vựng. Từ nào bạn hay quên sẽ xuất hiện thường xuyên hơn, còn từ bạn đã thuộc nhuần nhuyễn sẽ được giãn cách ôn tập thông minh.
        </p>

        {!compact && (
          <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50">
              <h4 className="font-black text-rose-700 dark:text-rose-300 text-sm mb-1">
                ❌ Cách học nhồi nhét truyền thống
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Học dồn 50 từ trong 1 ngày → Quên 80% sau 3 ngày → Tốn công học lại từ đầu.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
              <h4 className="font-black text-emerald-700 dark:text-emerald-300 text-sm mb-1">
                ✅ Lặp lại ngắt quãng SRS trên LingoArena
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Ôn 10 phút/ngày đúng thời điểm chuẩn bị quên → Chuyển vào trí nhớ dài hạn vĩnh viễn.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3 Scientific Tips Cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        {TIPS.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 bg-slate-50/70 dark:bg-slate-900/60 space-y-3 shadow-2xs"
            >
              <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <Icon className="size-6" />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>

      {!compact && (
        <>
          {/* CEFR Framework Table */}
          <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="p-5 sm:p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-lg text-slate-900 dark:text-white">
                Khung Tham Chiếu Trình Độ Châu Âu (CEFR)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Quy đổi dung lượng vốn từ tương ứng với khả năng sử dụng ngôn ngữ thực tế.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-400 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-5 py-3">Cấp độ</th>
                    <th className="px-5 py-3">Vốn từ ước tính</th>
                    <th className="px-5 py-3">Khả năng ứng dụng thực tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {CEFR_ROWS.map((row) => (
                    <tr key={row.level} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-1 rounded-full border text-xs font-black uppercase ${row.badgeClass}`}>
                          {row.level}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-slate-200">
                        {row.words}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {row.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="size-5 text-primary dark:text-[#7b9bee]" />
              <h3 className="font-black text-xl text-slate-900 dark:text-white">
                Câu Hỏi Thường Gặp Về Phương Pháp SRS
              </h3>
            </div>

            <Accordion className="w-full space-y-3">
              {FAQS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl px-5 shadow-2xs hover:border-primary/40 transition-colors"
                >
                  <AccordionTrigger className="text-left font-bold text-sm sm:text-base py-4 hover:no-underline text-slate-900 dark:text-white cursor-pointer">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </>
      )}

      {compact && (
        <div className="pt-2 text-center">
          <Link
            href="/vocabulary/srs"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-primary dark:text-[#7b9bee] hover:underline"
          >
            <span>Tìm hiểu chi tiết về thuật toán SM-2, bảng CEFR và FAQ</span>
            <span>→</span>
          </Link>
        </div>
      )}
    </section>
  );
}
