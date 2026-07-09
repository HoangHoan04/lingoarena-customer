import {
  AboutSection,
  ContactSection,
  FeaturesSection,
  HeroSection,
  SettingSection,
} from "@/components/home";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trang Chủ – Học Tiếng Anh Trực Tuyến",
  description:
    "LingoArena – Nền tảng học tiếng Anh trực tuyến. Học từ vựng thông minh, đấu trường 1v1 và bảng xếp hạng toàn cầu. Bắt đầu miễn phí ngay hôm nay!",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <SettingSection />
      <ContactSection />
    </div>
  );
}
