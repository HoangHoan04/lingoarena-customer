import {
  AboutSection,
  ArenaGamificationSection,
  ContactSection,
  CtaSection,
  ExamCertificatesSection,
  FaqSection,
  FeaturesSection,
  HeroSection,
  StepsSection,
  TestimonialsSection,
} from "@/components/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "LingoArena – Luyện Thi Tiếng Anh Thông Minh TOEIC, IELTS, VSTEP & Aptis",
  description:
    "Nền tảng học và luyện thi chứng chỉ tiếng Anh trực tuyến. Luyện đề mock exam, flashcard SRS, lộ trình học và đấu trường 1v1 Arena.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-0 overflow-x-hidden">
      <HeroSection />
      <ExamCertificatesSection />
      <FeaturesSection />
      <StepsSection />
      <ArenaGamificationSection />
      <TestimonialsSection />
      <FaqSection />
      <AboutSection />
      <ContactSection />
      <CtaSection />
      <div className="flex items-center justify-center gap-4 px-6 pb-16 pt-8 text-xs text-brand/40 dark:text-[#7b9bee]/40 tracking-[4px] select-none">
        <span className="w-12 h-px bg-linear-to-r from-transparent to-brand/30 dark:to-[#7b9bee]/30" />
        <span className="text-brand dark:text-[#7b9bee] font-bold">✦</span>
        <span className="w-12 h-px bg-linear-to-l from-transparent to-brand/30 dark:to-[#7b9bee]/30" />
      </div>
    </div>
  );
}
