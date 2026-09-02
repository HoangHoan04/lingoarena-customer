"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { Check, HelpCircle, Sparkles, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface PricingTier {
  id: string;
  name: string;
  badgeSubtitle: string;
  priceVnd: number;
  originalPriceVnd?: number;
  billingPeriod: string;
  description: string;
  features: string[];
  ctaLabel: string;
  isPopular?: boolean;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Tài Khoản Miễn Phí",
    badgeSubtitle: "DÀNH CHO NGƯỜI BẮT ĐẦU",
    priceVnd: 0,
    billingPeriod: "Miễn phí vĩnh viễn",
    description: "Đầy đủ các công cụ kiểm tra đầu vào và làm quen với định dạng đề thi chuẩn quốc tế.",
    features: [
      "1 Lượt làm bài kiểm tra đầu vào (Placement Test)",
      "3 Bộ đề thi thử rút gọn (Mini-test)",
      "Học 100 từ vựng flashcard mỗi ngày (SM-2)",
      "Xem bài giảng mẫu và ngân hàng ngữ pháp cơ bản",
      "Lưu 30 câu hỏi vào Sổ lỗi thông minh",
    ],
    ctaLabel: "Bắt đầu miễn phí",
  },
  {
    id: "pro_practice",
    name: "Luyện Thi Chuyên Sâu (Standard)",
    badgeSubtitle: "ĐƯỢC 85% HỌC VIÊN LỰA CHỌN",
    priceVnd: 299000,
    originalPriceVnd: 599000,
    billingPeriod: "tháng (hoặc 1.499.000đ/năm)",
    description: "Mở khóa toàn bộ ngân hàng câu hỏi, đề thi thử không giới hạn và lộ trình học tập cá nhân hóa.",
    features: [
      "Mở khóa 100% đề thi thử Full Test TOEIC, IELTS, VSTEP, Aptis",
      "Không giới hạn ngân hàng 50.000+ câu hỏi có lời giải chi tiết",
      "Học từ vựng Flashcard không giới hạn với thuật toán FSRS",
      "Sinh lộ trình học tập thích ứng tự động theo ngày và tuần",
      "Sổ lỗi thông minh không giới hạn câu hỏi ôn tập",
      "Đấu trường từ vựng 1v1 & Bảng xếp hạng vinh danh",
    ],
    ctaLabel: "Đăng ký gói Standard",
    isPopular: true,
  },
  {
    id: "vip_grading",
    name: "VIP + Chấm Writing/Speaking 1:1",
    badgeSubtitle: "CHINH PHỤC BAND CAO",
    priceVnd: 699000,
    originalPriceVnd: 1290000,
    billingPeriod: "tháng (hoặc 2.890.000đ/năm)",
    description: "Dành riêng cho thí sinh IELTS, VSTEP, TOEIC S&W cần chấm chữa chi tiết kỹ năng Nói và Viết cùng Giảng viên.",
    features: [
      "Tất cả quyền lợi của gói Luyện Thi Chuyên Sâu (Standard)",
      "15 Lượt chấm bài Writing Task 1 & 2 chi tiết từng tiêu chí Rubric",
      "10 Lượt chấm ghi âm Speaking nhận xét ngữ điệu & phát âm",
      "Sửa bài & gợi ý từ vựng, cấu trúc ngữ pháp nâng band",
      "Cho phép nộp lại bài viết sau khi sửa (Version History)",
      "Hỗ trợ giải đáp thắc mắc chuyên môn 1:1 cùng Giảng viên",
    ],
    ctaLabel: "Nâng cấp gói VIP",
  },
];

function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

export default function PricingSection() {
  const router = useRouter();
  const t = useTranslations("home.pricing");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 text-[#2b417e] dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
            <Zap className="size-3.5" />
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            {t("subtitle")}
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center">
            <div className="inline-flex items-center p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  billingCycle === "monthly"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Thanh toán theo tháng
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("yearly")}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === "yearly"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span>Thanh toán theo năm</span>
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black">
                  -40%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {PRICING_TIERS.map((tier) => {
            const calculatedPrice =
              billingCycle === "yearly" && tier.priceVnd > 0
                ? Math.round(tier.priceVnd * 0.6)
                : tier.priceVnd;

            return (
              <div
                key={tier.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  tier.isPopular
                    ? "bg-white dark:bg-slate-900 border-2 border-[#2b417e] dark:border-[#7b9bee] shadow-2xl scale-102 z-10"
                    : "bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg"
                }`}
              >
                {tier.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-linear-to-r from-[#2b417e] to-[#4563b0] text-white text-xs font-black uppercase tracking-wider shadow-md">
                    Phổ biến nhất
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                      {tier.badgeSubtitle}
                    </span>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {tier.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {tier.description}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                        {tier.priceVnd === 0 ? "Miễn phí" : formatVnd(calculatedPrice)}
                      </span>
                      {tier.priceVnd > 0 && (
                        <span className="text-xs font-medium text-slate-500">
                          / {billingCycle === "yearly" ? "tháng (trả theo năm)" : "tháng"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-3 pt-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Quyền lợi bao gồm:
                    </p>
                    <ul className="space-y-2.5">
                      {tier.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <Check className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-100 dark:border-slate-800">
                  <Button
                    className={`w-full py-6 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer ${
                      tier.isPopular
                        ? "bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25"
                        : "bg-slate-100 dark:bg-slate-800 hover:bg-[#2b417e]/10 text-slate-900 dark:text-white hover:text-[#2b417e]"
                    }`}
                    onClick={() => router.push("/register")}
                  >
                    {tier.ctaLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
