"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Quote, Star, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  exam: string;
  scoreBefore: string;
  scoreAfter: string;
  avatarText: string;
  avatarBg: string;
  comment: string;
  achievement: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Nguyễn Hoàng Minh",
    role: "HUST Student",
    exam: "TOEIC L&R",
    scoreBefore: "540",
    scoreAfter: "895",
    avatarText: "HM",
    avatarBg: "bg-[#2b417e]",
    comment: "Tính năng Sổ lỗi thông minh của LingoArena thực sự đã cứu rỗi mình. Trước đây mình hay sai Part 5 và 7 vì bẫy từ loại, sau 2 tháng ôn đúng các dạng câu hay sai trên hệ thống, mình đã bứt phá đạt 895 điểm ngay lần thi đầu tiên.",
    achievement: "+355 pts in 8 weeks",
  },
  {
    id: "2",
    name: "Trần Mai Phương",
    role: "Marketing Specialist",
    exam: "IELTS Academic",
    scoreBefore: "6.0",
    scoreAfter: "7.5",
    avatarText: "MP",
    avatarBg: "bg-[#2b417e]",
    comment: "Phần chấm Writing và Speaking của LingoArena cực kỳ chi tiết theo đúng 4 tiêu chí của IDP. Nhờ những lời sửa câu và từ vựng nâng band của thầy cô kèm AI phân tích, kỹ năng Viết của mình từ 5.5 đã tăng vọt lên 7.0.",
    achievement: "IELTS 7.5 Overall",
  },
  {
    id: "3",
    name: "Lê Đức Anh",
    role: "Resident Doctor",
    exam: "VSTEP (Level 3-5)",
    scoreBefore: "B1",
    scoreAfter: "B2 (7.5 pts)",
    avatarText: "DA",
    avatarBg: "bg-[#2b417e]",
    comment: "Mình cần chứng chỉ B2 VSTEP gấp để bảo vệ luận văn Thạc sĩ. Lộ trình ôn tập theo ngày của LingoArena giúp mình phân bổ thời gian học hiệu quả sau giờ làm ở bệnh viện. Đề thi mô phỏng y hệt phòng thi thật của ĐH Quốc Gia.",
    achievement: "VSTEP B2 Certified",
  },
];

export default function TestimonialsSection() {
  const t = useTranslations("home.testimonials");

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Star className="size-3.5 fill-amber-400" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.id}
              className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="size-8 text-slate-200 dark:text-slate-800" />
                </div>

                {/* Score Growth Tag */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      {item.exam}
                    </span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                      {item.scoreBefore} ➔ <strong className="text-[#2b417e] dark:text-[#7b9bee] text-sm">{item.scoreAfter}</strong>
                    </span>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200 text-[10px] font-bold">
                    <TrendingUp className="size-3 mr-1" />
                    {item.achievement}
                  </Badge>
                </div>

                {/* Comment text */}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                  &quot;{item.comment}&quot;
                </p>
              </div>

              {/* Author info */}
              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={`${item.avatarBg} text-white font-bold text-xs`}>
                    {item.avatarText}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
