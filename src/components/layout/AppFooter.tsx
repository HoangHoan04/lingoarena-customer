import { Link } from "@/i18n/routing";
import { ArrowRightIcon, MapPinIcon, PhoneIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

const SOCIAL_LINKS = [
  { name: "facebook", href: "https://facebook.com" },
  { name: "youtube", href: "https://youtube.com" },
  { name: "instagram", href: "https://instagram.com" },
  { name: "tiktok", href: "https://tiktok.com" },
];

const FOOTER_LINKS = {
  EXAMS: [
    { idx: 1, label: "IELTS Mastery", path: "#" },
    { idx: 2, label: "TOEIC Đột phá", path: "#" },
    { idx: 3, label: "Giao tiếp hằng ngày", path: "#" },
    { idx: 4, label: "Ngữ pháp cơ bản", path: "#" },
  ],
  FEATURES: [
    { idx: 1, label: "Đấu trường 1vs1", path: "#" },
    { idx: 2, label: "Bảng xếp hạng", path: "#" },
    { idx: 3, label: "Lộ trình AI", path: "#" },
    { idx: 4, label: "Thư viện tài liệu", path: "#" },
  ],
  LEGAL: [
    {
      idx: 1,
      label: "Chính sách bảo mật",
      path: "#",
    },
    {
      idx: 2,
      label: "Điều khoản dịch vụ",
      path: "#",
    },
    { idx: 3, label: "Sitemap", path: "#" },
  ],
};

export default function AppFooter() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("Footer");

  return (
    <footer className="relative overflow-hidden border-t border-border bg-background transition-colors duration-500">
      <div className="absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4 space-y-6">
            <p className="leading-relaxed text-sm max-w-sm font-medium text-muted-foreground transition-colors">
              Hệ thống luyện thi thông minh bậc nhất. Chúng tôi cung cấp lộ
              trình cá nhân hóa giúp bạn chinh phục ngoại ngữ và bứt phá giới
              hạn bản thân.
            </p>
            <div className="flex flex-wrap gap-3">
              {SOCIAL_LINKS.map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="transition-all flex items-center justify-center"
                >
                  <Image
                    src={`/icons/${name}.svg`}
                    alt={name}
                    width={25}
                    height={25}
                    className="opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Luyện thi */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-6 text-lg text-foreground transition-colors">
              {t("examPrep")}
            </h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.EXAMS.map((item) => (
                <li key={item.idx}>
                  <Link
                    href={item.path}
                    className="transition-all text-sm font-bold flex items-center group text-muted-foreground hover:text-primary"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-xs text-primary">
                      <ArrowRightIcon className="w-5" />
                    </span>
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hệ thống */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-6 text-lg text-foreground transition-colors">
              {t("system")}
            </h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.FEATURES.map((item) => (
                <li key={item.idx}>
                  <Link
                    href={item.path}
                    className="transition-all text-sm font-bold flex items-center group text-muted-foreground hover:text-primary"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-xs text-primary">
                      <ArrowRightIcon className="w-5" />
                    </span>
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="font-bold mb-6 text-lg text-foreground transition-colors">
              {t("support")}
            </h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-secondary text-secondary-foreground border-border group-hover:bg-primary group-hover:text-primary-foreground">
                  <PhoneIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-muted-foreground">
                    {t("hotline")}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    1900 123 456
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-secondary text-secondary-foreground border-border group-hover:bg-primary group-hover:text-primary-foreground">
                  <SendIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-muted-foreground">
                    {t("email")}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    support@lingoarena.com
                  </span>
                </div>
              </div>
              {/* Địa chỉ */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-all border bg-secondary text-secondary-foreground border-border group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPinIcon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold text-muted-foreground">
                    Địa chỉ
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    123 LingoArena Street, Hanoi, Vietnam
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs md:text-sm font-medium tracking-wide text-center md:text-left text-muted-foreground transition-colors">
              © {currentYear}{" "}
              <span className="font-bold text-foreground">LingoArena</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold text-muted-foreground/60 transition-colors">
              <span className="w-8 h-px bg-border"></span>
              {t("developedBy")}
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            {FOOTER_LINKS.LEGAL.map((item) => (
              <Link
                key={item.idx}
                href={item.path}
                className="text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors relative group text-muted-foreground hover:text-primary"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full bg-primary"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
