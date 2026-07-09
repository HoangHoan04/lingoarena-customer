import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import AppProviders from "@/providers";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";

  return {
    title: {
      default: isVi
        ? "LingoArena – Học tiếng Anh Trực tuyến"
        : "LingoArena – Learn English Online",
      template: "%s | LingoArena",
    },
    description: isVi
      ? "LingoArena – Nền tảng học tiếng Anh trực tuyến với flashcard thông minh, đấu trường từ vựng 1v1 và bảng xếp hạng toàn cầu."
      : "LingoArena – Learn English online with smart flashcards, 1v1 vocabulary battle arenas, and global leaderboards.",
    keywords: isVi
      ? ["học tiếng Anh", "từ vựng", "flashcard", "đấu trường", "bảng xếp hạng", "lingoarena"]
      : ["learn english", "vocabulary", "flashcard", "battle arena", "leaderboard", "lingoarena"],
    authors: [{ name: "LingoArena Team" }],
    creator: "LingoArena",
    publisher: "LingoArena",
    category: "education",
    applicationName: "LingoArena",
    referrer: "origin-when-cross-origin",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: isVi ? "vi_VN" : "en_US",
      siteName: "LingoArena",
      title: isVi
        ? "LingoArena – Học tiếng Anh Trực tuyến"
        : "LingoArena – Learn English Online",
      description: isVi
        ? "Nền tảng học tiếng Anh trực tuyến với flashcard thông minh và đấu trường từ vựng 1v1."
        : "Learn English online with smart flashcards and 1v1 vocabulary battle arenas.",
    },
    twitter: {
      card: "summary",
      title: isVi
        ? "LingoArena – Học tiếng Anh Trực tuyến"
        : "LingoArena – Learn English Online",
      description: isVi
        ? "Nền tảng học tiếng Anh trực tuyến với flashcard thông minh và đấu trường từ vựng 1v1."
        : "Learn English online with smart flashcards and 1v1 vocabulary battle arenas.",
    },
    icons: {
      icon: [
        { url: "/images/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/images/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/images/favicon.ico" },
      ],
      apple: [
        { url: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.webmanifest",
  };
}


export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Đảm bảo locale nằm trong danh sách hỗ trợ
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Lấy các messages từ server
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  );
}
