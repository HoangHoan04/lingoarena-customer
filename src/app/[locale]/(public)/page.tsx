import {
  AboutSection,
  ArenaGamificationSection,
  ContactSection,
  CtaSection,
  ExamCertificatesSection,
  FaqSection,
  HeroSection,
  PricingSection,
  StepsSection,
  TestimonialsSection,
} from "@/components/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LingoArena – Luyện Thi Tiếng Anh Thông Minh TOEIC, IELTS, VSTEP & Aptis",
  description:
    "Nền tảng học và luyện thi chứng chỉ tiếng Anh trực tuyến hàng đầu. Thi thử mô phỏng thời gian thực, lộ trình cá nhân hóa, flashcard ghi nhớ ngắt quãng và chấm Writing/Speaking chuẩn Rubric quốc tế.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 overflow-x-hidden">
      <HeroSection />
      <ExamCertificatesSection />
      <StepsSection />
      <ArenaGamificationSection />
      <TestimonialsSection />
      <FaqSection />
      <AboutSection />
      <ContactSection />
      <CtaSection />
      <div className="flex items-center justify-center gap-4 px-6 pb-16 pt-8 text-xs text-[#2b417e]/40 dark:text-[#7b9bee]/40 tracking-[4px] select-none">
        <span className="w-12 h-px bg-linear-to-r from-transparent to-[#2b417e]/30 dark:to-[#7b9bee]/30" />
        <span className="text-[#2b417e] dark:text-[#7b9bee] font-bold">
          ✦
        </span>
        <span className="w-12 h-px bg-linear-to-l from-transparent to-[#2b417e]/30 dark:to-[#7b9bee]/30" />
      </div>
    </div>
  );
}
