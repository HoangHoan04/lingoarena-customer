import { cn } from "@/lib/utils";
import AppProviders from "@/providers";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LingoArena – Nền Tảng Luyện Thi Tiếng Anh Thông Minh TOEIC, IELTS, VSTEP & Aptis",
    template: "%s | LingoArena",
  },
  description:
    "Hệ thống luyện thi chứng chỉ tiếng Anh trực tuyến hàng đầu. Thi thử mô phỏng thời gian thực, lộ trình cá nhân hóa, flashcard ghi nhớ ngắt quãng (SRS) và chấm chữa Writing & Speaking chi tiết chuẩn Rubric quốc tế.",
  keywords: [
    "LingoArena",
    "luyện thi tiếng Anh",
    "thi thử TOEIC online",
    "luyện thi IELTS 4 kỹ năng",
    "ôn thi VSTEP B1 B2 C1",
    "Aptis ESOL British Council",
    "học từ vựng flashcard SRS",
    "chấm writing speaking AI",
  ],
  metadataBase: new URL("https://lingoarena.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LingoArena – Nền Tảng Luyện Thi Tiếng Anh Thông Minh",
    description:
      "Chinh phục TOEIC, IELTS, VSTEP & Aptis với lộ trình học tập thích ứng cá nhân hóa, thi thử áp lực phòng thi thật và chấm chữa chuẩn quốc tế.",
    type: "website",
    locale: "vi_VN",
    url: "https://lingoarena.com",
    siteName: "LingoArena",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={cn("h-full antialiased", inter.variable, outfit.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
