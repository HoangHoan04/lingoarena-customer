import React from "react";
import { Inter } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Lấy locale từ request để gán lang đúng cho mỗi trang
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={cn("h-full antialiased", inter.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect để giảm DNS/TCP latency khi load font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* color-scheme giúp browser render đúng dark/light mode sớm hơn */}
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
