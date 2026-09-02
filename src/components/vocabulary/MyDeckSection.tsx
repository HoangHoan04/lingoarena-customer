"use client";

import DeckCatalogCard from "@/components/vocabulary/DeckCatalogCard";
import { Link } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { VocabDeck } from "@/types/vocabulary";
import { ArrowRight, BookMarked, FolderPlus, LogIn, Sparkles } from "lucide-react";

export default function MyDeckSection({
  popularDecks,
  mounted,
}: {
  popularDecks: VocabDeck[];
  mounted: boolean;
}) {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();

  const onCreateDeck = () => {
    if (!mounted || !isAuthenticated) {
      addToast("Đăng nhập để tạo bộ thẻ riêng", "info");
      return;
    }
    addToast("Tính năng tự tạo bộ thẻ cá nhân sắp ra mắt!", "info");
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Không Gian Học Của Bạn
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Xem sổ tay từ vựng SRS cá nhân hóa hoặc tiếp tục các bộ thẻ đề xuất.
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Create Deck Teaser */}
        <button
          type="button"
          onClick={onCreateDeck}
          className="group relative flex flex-col justify-between min-h-[190px] rounded-3xl border-2 border-dashed border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 p-6 text-left transition-all duration-300 cursor-pointer shadow-2xs hover:shadow-md"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-[#7b9bee] mb-3 group-hover:scale-110 transition-transform">
              <FolderPlus className="size-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary dark:group-hover:text-[#7b9bee] transition-colors">
              Tạo bộ thẻ của riêng bạn
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Tự gom các từ bạn hay quên hoặc từ vựng chuyên ngành vào bộ thẻ riêng.
            </p>
          </div>
          <div className="text-xs font-bold text-primary dark:text-[#7b9bee] inline-flex items-center gap-1 mt-3">
            <span>Sắp ra mắt</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        {/* Notebook Card or Login Card */}
        {mounted && isAuthenticated ? (
          <Link
            href="/vocabulary/notebook"
            className="group relative flex flex-col justify-between min-h-[190px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400/60 p-6 transition-all duration-300 shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-500 mb-3 group-hover:scale-110 transition-transform">
                <BookMarked className="size-6" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-amber-600 transition-colors">
                  Sổ tay từ vựng SRS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-bold">
                  Cá nhân
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Xem toàn bộ từ bạn đã học, lọc từ cần ôn, và kiểm tra lịch ôn SM-2.
              </p>
            </div>
            <div className="text-xs font-bold text-amber-600 dark:text-amber-400 inline-flex items-center gap-1 mt-3">
              <span>Mở sổ tay ngay</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ) : (
          <Link
            href={`/login?redirect=${encodeURIComponent("/vocabulary")}`}
            className="group relative flex flex-col justify-between min-h-[190px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-primary/60 p-6 transition-all duration-300 shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-primary dark:text-[#7b9bee] mb-3 group-hover:scale-110 transition-transform">
                <LogIn className="size-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                Đăng nhập tài khoản
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Đồng bộ lịch học SRS thông minh và ghi nhận tiến độ thuộc từ trên mọi thiết bị.
              </p>
            </div>
            <div className="text-xs font-bold text-primary dark:text-[#7b9bee] inline-flex items-center gap-1 mt-3">
              <span>Đăng nhập ngay</span>
              <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        )}

        {/* Quick Quiz Match Teaser */}
        <Link
          href="/vocabulary/games"
          className="group relative flex flex-col justify-between min-h-[190px] rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-400/60 p-6 transition-all duration-300 shadow-2xs hover:shadow-lg hover:-translate-y-0.5"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="size-6" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
              Đấu phản xạ & Trò chơi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Ghép thẻ nối nghĩa nhanh và trả lời Quiz từ vựng tính giờ.
            </p>
          </div>
          <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1 mt-3">
            <span>Vào khu trò chơi</span>
            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {popularDecks.length > 0 && (
        <div className="pt-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider text-xs">
              Bộ thẻ thịnh hành nhất
            </h3>
            <span className="text-xs text-slate-400">Được học nhiều nhất tuần qua</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularDecks.slice(0, 3).map((deck) => (
              <DeckCatalogCard key={deck.id} deck={deck} compact />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
