import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Trophy, Swords, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: "Trang Chủ – Học Tiếng Anh Trực Tuyến",
  description: "LingoArena – Nền tảng học tiếng Anh trực tuyến. Học từ vựng thông minh, đấu trường 1v1 và bảng xếp hạng toàn cầu. Bắt đầu miễn phí ngay hôm nay!",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16 py-8">
      {/* Hero Section */}
      <section
        aria-labelledby="hero-heading"
        className="flex flex-col items-center text-center gap-6 py-12 md:py-20 max-w-4xl mx-auto"
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 text-sm font-semibold"
          aria-hidden="true"
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          <span>Học Tiếng Anh Nhanh Hơn & Hiệu Quả Hơn</span>
        </div>

        <h1
          id="hero-heading"
          className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent"
        >
          Chào mừng đến LingoArena
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl">
          Nâng cao vốn từ vựng tiếng Anh, cạnh tranh trong đấu trường thời gian thực với người học toàn thế giới và leo lên bảng xếp hạng!
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-4">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Bắt đầu học miễn phí trên LingoArena"
          >
            Bắt Đầu Miễn Phí
          </Link>
          <Link
            href="/courses"
            className="px-8 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
            aria-label="Khám phá các khóa học tiếng Anh trên LingoArena"
          >
            Khám Phá Khóa Học
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section aria-labelledby="features-heading" className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <h2 id="features-heading" className="sr-only">Tính năng nổi bật</h2>

        <article className="flex flex-col gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div
            className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          >
            <BookOpen className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold">Từ Vựng Thông Minh</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Học từ theo ngữ cảnh, flashcard và kỹ thuật lặp lại ngắt quãng để nhớ mãi mãi.
          </p>
        </article>

        <article className="flex flex-col gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div
            className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400"
            aria-hidden="true"
          >
            <Swords className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold">Đấu Trường 1v1</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Thách đấu người chơi toàn thế giới trong trận chiến từ vựng thời gian thực để kiểm tra tốc độ và độ chính xác.
          </p>
        </article>

        <article className="flex flex-col gap-4 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow">
          <div
            className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400"
            aria-hidden="true"
          >
            <Trophy className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-xl font-bold">Bảng Xếp Hạng</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Kiếm điểm, hoàn thành nhiệm vụ hàng ngày và leo lên đỉnh Bảng Xếp Hạng Toàn Cầu.
          </p>
        </article>
      </section>
    </div>
  );
}
