"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { usePathname, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Languages,
  Menu as MenuIcon,
  Search,
  Target,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { GoogleTranslateModal } from "../translate";
import { useTranslateStore } from "@/stores/useTranslateStore";
import { useTranslations } from "next-intl";
import HeaderSettingsMenu from "../common/HeaderSettingsMenu";
import Logo from "../common/Logo";
import UserMenu from "../common/UserMenu";

type AppHeaderProps = {
  isScrolled?: boolean;
};

export default function AppHeader({
  isScrolled: isScrolledProp,
}: AppHeaderProps) {
  const tNav = useTranslations("nav");
  const [isScrolledLocal, setIsScrolledLocal] = useState(false);
  const isScrolled =
    isScrolledProp !== undefined ? isScrolledProp : isScrolledLocal;

  useEffect(() => {
    if (isScrolledProp !== undefined) return;
    const handleScroll = () => {
      setIsScrolledLocal(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolledProp]);

  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { openTranslate } = useTranslateStore();

  const navLinks = useMemo(
    () => [
      { key: "practice", label: tNav("practice"), path: "/practice" },
      { key: "questions", label: tNav("questions"), path: "/questions" },
      { key: "courses", label: tNav("courses"), path: "/courses" },
      { key: "vocabulary", label: tNav("vocabulary"), path: "/vocabulary" },
      { key: "grammar", label: "Ngữ pháp", path: "/grammar" },
      { key: "arena", label: tNav("arena"), path: "/arena" },
    ],
    [tNav],
  );

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const userMenuRef = useRef<HTMLDivElement>(null);

  const [recentSearches, setRecentSearches] = useState<{ label: string; path: string }[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recent_searches_customer");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const searchPages = useMemo(
    () => [
      { label: "Trang chủ", path: "/", description: "LingoArena English Learning Platform" },
      { label: "Kiểm tra đầu vào", path: "/placement-test", description: "Đánh giá năng lực miễn phí 15 phút" },
      { label: "Phòng thi thử (Mock Exam)", path: "/practice", description: "Luyện thi TOEIC, IELTS, VSTEP, Aptis" },
      { label: "Ngân hàng câu hỏi", path: "/questions", description: "Luyện theo dạng câu, tự chấm trắc nghiệm" },
      { label: "Danh sách khóa học", path: "/courses", description: "Chương trình đào tạo theo mục tiêu" },
      { label: "Từ vựng Flashcard (SRS)", path: "/vocabulary", description: "Ghi nhớ ngắt quãng FSRS/SM-2" },
      { label: "Đấu trường 1v1 (Arena)", path: "/arena", description: "Thi đấu từ vựng và phản xạ trực tuyến" },
      { label: "Ngữ pháp", path: "/grammar", description: "Cấu trúc ngữ pháp, ví dụ và luyện tập" },
      { label: "Lộ trình học", path: "/path", description: "Mục tiêu điểm và việc học hôm nay" },
      { label: "Bảng xếp hạng", path: "/leaderboard", description: "Điểm học tập và streak" },
      { label: "Bảng giá & Thuê bao", path: "/pricing", description: "Biểu phí gói học và chấm điểm Writing/Speaking" },
      { label: "Đăng nhập", path: "/login", description: "Đăng nhập tài khoản học viên" },
      { label: "Đăng ký tài khoản", path: "/register", description: "Tạo tài khoản mới bắt đầu học" },
    ],
    [],
  );

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return searchPages.filter(
      (page) =>
        page.label.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query),
    );
  }, [searchQuery, searchPages]);

  const handleSearchItemClick = (path: string, label: string) => {
    const updated = [
      { label, path },
      ...recentSearches.filter((item) => item.path !== path),
    ].slice(0, 5);

    setRecentSearches(updated);
    localStorage.setItem("recent_searches_customer", JSON.stringify(updated));
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(path as any);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recent_searches_customer");
  };

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  return (
    <>
      <style>{`
        .logo {
          display: inline-block;
          transform-origin: 40% 70%;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .logo-wrap:hover .logo {
          transform: rotate(-8deg) translateY(-1px);
        }
      `}</style>

      <header
        className={`
          fixed z-50 overflow-visible transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)] text-foreground
          mx-auto left-0 right-0 w-[calc(100%-24px)] sm:w-[calc(100%-48px)] xl:w-[calc(100%-192px)]
          ${
            isScrolled
              ? "top-0 rounded-b-2xl shadow-[0_12px_32px_rgba(43,65,126,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)] max-w-7xl"
              : "top-3 sm:top-6 rounded-2xl shadow-[0_8px_24px_rgba(43,65,126,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)] max-w-full"
          }
        `}
      >
        <div
          className={`w-full h-px bg-linear-to-r from-transparent via-[#2b417e]/20 to-transparent ${
            isScrolled ? "" : "rounded-t-2xl"
          }`}
        />

        <div
          className={`
            border-l border-r border-b border-slate-200/80 dark:border-slate-800 transition-all duration-800 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              isScrolled
                ? "backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-b-2xl"
                : "backdrop-blur-lg bg-white/85 dark:bg-slate-900/85 rounded-2xl"
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex items-center justify-between h-20 gap-2 sm:gap-4">
              {/* Brand Logo with hover tilt */}
              <button
                type="button"
                className="flex items-center cursor-pointer logo-wrap select-none bg-transparent border-none p-0 shrink-0"
                onClick={() => router.push("/")}
                aria-label="Trang chủ LingoArena"
              >
                <Logo />
              </button>

              {/* Desktop Centered Navigation Links */}
              <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
                {navLinks.map((item) => {
                  const isActive = isActivePath(item.path);
                  return (
                    <button
                      key={item.path}
                      type="button"
                      onClick={() => router.push(item.path as any)}
                      className={`relative px-3.5 py-2 bg-transparent border-none cursor-pointer text-sm whitespace-nowrap transition-colors duration-200 font-semibold ${
                        isActive
                          ? "text-[#2b417e] dark:text-[#7b9bee] font-bold"
                          : "text-slate-700 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee]"
                      }`}
                    >
                      {item.label}
                      <span
                        className={`absolute bottom-0.5 left-3.5 right-3.5 h-0.5 rounded-full bg-[#2b417e] dark:bg-[#7b9bee] transition-transform duration-300 origin-center ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>

              {/* Right Action Cluster */}
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                {/* Search Trigger Button (Icon Only) */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-[#2b417e]/10 dark:hover:bg-[#2b417e]/20 text-slate-600 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee] cursor-pointer transition-all duration-200 shrink-0"
                  title="Tìm kiếm nhanh (Ctrl+K)"
                  aria-label="Tìm kiếm"
                >
                  <Search className="size-4.5" />
                </Button>

                {/* Google Translate Studio Trigger Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openTranslate}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-[#2b417e]/10 dark:hover:bg-[#2b417e]/20 text-slate-600 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee] cursor-pointer transition-all duration-200 shrink-0"
                  title={tNav("translateTooltip")}
                  aria-label="Google Translate"
                >
                  <Languages className="size-4.5 text-primary dark:text-[#7b9bee]" />
                </Button>

                {/* Settings Cog Dropdown (Theme & Language) */}
                <HeaderSettingsMenu />

                {/* Primary Action Button */}
                <button
                  type="button"
                  className="flex items-center gap-1.5 cursor-pointer py-2 px-3.5 sm:px-4 rounded-xl bg-[#2b417e] hover:bg-[#1e2f5e] text-white font-bold text-xs shadow-md shadow-[#2b417e]/25 transition-all hover:scale-105 shrink-0"
                  onClick={() => router.push("/placement-test")}
                >
                  <Target className="size-3.5 text-amber-300" />
                  <span className="whitespace-nowrap">{tNav("placementTest")}</span>
                </button>

                {/* User Profile / Auth Popover */}
                <div ref={userMenuRef} className="relative flex items-center shrink-0">
                  <UserMenu />
                </div>

                {/* Mobile Menu Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee] transition-colors focus:outline-hidden cursor-pointer shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="size-5.5" />
                  ) : (
                    <MenuIcon className="size-5.5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          <div
            className={`
              lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-b-2xl
              ${isMobileMenuOpen ? "max-h-160 opacity-100 py-4 px-6" : "max-h-0 opacity-0 pointer-events-none"}
            `}
          >
            <nav className="flex flex-col gap-1.5">
              {navLinks.map((item) => {
                const isActive = isActivePath(item.path);
                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      router.push(item.path as any);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-2.5 px-3 rounded-xl bg-transparent border-none cursor-pointer text-sm font-semibold transition-colors flex items-center justify-between ${
                      isActive
                        ? "bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="size-4 text-[#2b417e] dark:text-[#7b9bee]" />}
                  </button>
                );
              })}

              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
                <Button
                  className="w-full py-5 rounded-xl bg-[#2b417e] hover:bg-[#1e2f5e] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/placement-test");
                  }}
                >
                  <Target className="size-4 text-amber-300" />
                  {tNav("placementTestDesc")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-700"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/practice");
                  }}
                >
                  <Zap className="size-4 text-[#2b417e] dark:text-[#7b9bee] mr-1.5" />
                  {tNav("practiceRoom")}
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-5 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-primary dark:text-[#7b9bee]"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openTranslate();
                  }}
                >
                  <Languages className="size-4" />
                  {tNav("quickTranslate")}
                </Button>
              </div>
            </nav>
          </div>
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-[#2b417e]/15 to-transparent rounded-b-2xl" />
      </header>

      {/* Quick Search Dialog (Ctrl + K) */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-xl p-0 overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl transition-all duration-300 z-50"
        >
          <DialogHeader className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-3 flex-1">
              <Search className="size-4 text-slate-400 shrink-0 animate-pulse" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm đề thi, khóa học, bài luyện tập..."
                className="border-0 focus-visible:ring-0 focus-visible:outline-hidden text-sm w-full bg-transparent placeholder:text-slate-400 text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 select-none">
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="size-6 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                  title="Xóa tìm kiếm"
                >
                  <X className="size-3.5 text-slate-400" />
                </Button>
              )}
              <span className="hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono text-slate-500">
                ESC
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="size-6 p-0 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="p-3 max-h-96 overflow-y-auto space-y-4">
            {searchQuery && (
              <div className="space-y-1 animate-in fade-in duration-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block px-2.5 mb-2">
                  Kết quả tìm kiếm ({searchResults.length})
                </span>
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.path}
                      onClick={() => handleSearchItemClick(result.path, result.label)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all duration-150 group border border-transparent hover:border-[#2b417e]/20 hover:bg-[#2b417e]/5 dark:hover:bg-[#2b417e]/15 text-slate-900 dark:text-white cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-[#2b417e] group-hover:text-white transition-colors duration-200 shrink-0">
                          <BookOpen className="size-4" />
                        </div>
                        <div>
                          <span className="font-bold block">{result.label}</span>
                          <span className="text-[11px] text-slate-500 block truncate max-w-70">
                            {result.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-[#2b417e]/10 group-hover:text-[#2b417e]">
                          {result.path}
                        </span>
                        <ChevronRight className="size-3 text-slate-400 group-hover:text-[#2b417e] transition-colors" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                      <Search className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white">Không tìm thấy kết quả nào</p>
                      <p className="text-[10px] text-slate-400">Thử nhập từ khóa: TOEIC, IELTS, Test đầu vào, Flashcard...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!searchQuery && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2.5 mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest block">
                    Tìm kiếm gần đây
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Xóa lịch sử
                    </button>
                  )}
                </div>
                {recentSearches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {recentSearches.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleSearchItemClick(item.path, item.label)}
                        className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 group transition-colors duration-200 cursor-pointer border border-transparent"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="size-3.5 text-slate-400" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 group-hover:text-[#2b417e]">
                          {item.path}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-4 text-center space-y-2">
                    <p className="text-xs text-slate-400">Gợi ý tìm kiếm phổ biến:</p>
                    <div className="flex flex-wrap justify-center gap-1.5">
                      {["Kiểm tra đầu vào", "Thi thử TOEIC", "IELTS Cam 19", "Từ vựng Flashcard", "Đấu trường 1v1"].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSearchQuery(tag)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-[#2b417e]/10 hover:text-[#2b417e] cursor-pointer transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Google Translate Studio Modal Workspace */}
      <GoogleTranslateModal />
    </>
  );
}
