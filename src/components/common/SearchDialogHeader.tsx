"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "@/i18n/routing";
import { BookOpen, ChevronRight, Clock, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export interface SearchDialogHeaderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SearchPageItem = {
  label: string;
  path: string;
  description: string;
};

const SEARCH_PAGES: SearchPageItem[] = [
  {
    label: "Trang chủ",
    path: "/",
    description: "LingoArena English Learning Platform",
  },
  {
    label: "Kiểm tra đầu vào",
    path: "/placement-test",
    description: "Đánh giá năng lực miễn phí 15 phút",
  },
  {
    label: "Phòng thi thử (Mock Exam)",
    path: "/practice",
    description: "Luyện thi TOEIC, IELTS, VSTEP, Aptis",
  },
  {
    label: "Luyện nghe (Listening)",
    path: "/listening",
    description: "Luyện nghe các dạng đề thi & đoạn hội thoại",
  },
  {
    label: "Luyện nói (Speaking)",
    path: "/speaking",
    description: "Phát âm, đối thoại tương tác trên thiết bị",
  },
  {
    label: "Luyện viết (Writing)",
    path: "/writing",
    description: "Viết câu, đoạn văn và bài luận (bản nháp local)",
  },
  {
    label: "Từ vựng Flashcard (SRS)",
    path: "/vocabulary",
    description: "Ghi nhớ ngắt quãng FSRS/SM-2",
  },
  {
    label: "Ngữ pháp (Grammar)",
    path: "/grammar",
    description: "Cấu trúc ngữ pháp, ví dụ và luyện tập",
  },
  {
    label: "Luyện đọc hiểu (Reading)",
    path: "/reading",
    description: "Luyện đọc hiểu IELTS, TOEIC, VSTEP song ngữ",
  },
  {
    label: "Giao tiếp với AI (AI Live Conversation)",
    path: "/ai-conversation",
    description:
      "Nói chuyện trực tiếp 1v1 với gia sư AI, nhận diện giọng nói và sửa lỗi phát âm",
  },
  {
    label: "Danh sách khóa học",
    path: "/courses",
    description: "Chương trình đào tạo theo mục tiêu",
  },
  {
    label: "Đấu trường 1v1 (Arena)",
    path: "/arena",
    description: "Thi đấu từ vựng và phản xạ trực tuyến",
  },
  {
    label: "Lộ trình học",
    path: "/path",
    description: "Mục tiêu điểm và việc học hôm nay",
  },
  {
    label: "Bảng xếp hạng",
    path: "/leaderboard",
    description: "Điểm học tập và streak",
  },
  {
    label: "Bảng giá & Thuê bao",
    path: "/pricing",
    description: "Biểu phí gói học và quyền lợi luyện thi",
  },
  {
    label: "Đăng nhập",
    path: "/login",
    description: "Đăng nhập tài khoản học viên",
  },
  {
    label: "Đăng ký tài khoản",
    path: "/register",
    description: "Tạo tài khoản mới bắt đầu học",
  },
];

const POPULAR_SEARCH_TAGS = [
  "Kiểm tra đầu vào",
  "Thi thử TOEIC",
  "IELTS Cam 19",
  "Từ vựng Flashcard",
  "Đấu trường 1v1",
];

export default function SearchDialogHeader({
  open,
  onOpenChange,
}: SearchDialogHeaderProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<
    { label: string; path: string }[]
  >(() => {
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return SEARCH_PAGES.filter(
      (page) =>
        page.label.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query) ||
        page.description.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  const handleSearchItemClick = (path: string, label: string) => {
    const updated = [
      { label, path },
      ...recentSearches.filter((item) => item.path !== path),
    ].slice(0, 5);

    setRecentSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("recent_searches_customer", JSON.stringify(updated));
    }
    onOpenChange(false);
    setSearchQuery("");
    router.push(path as any);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    if (typeof window !== "undefined") {
      localStorage.removeItem("recent_searches_customer");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onClick={() => onOpenChange(false)}
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
                    type="button"
                    onClick={() =>
                      handleSearchItemClick(result.path, result.label)
                    }
                    className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all duration-150 group border border-transparent hover:border-brand/20 hover:bg-brand/5 dark:hover:bg-brand/15 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-brand group-hover:text-white transition-colors duration-200 shrink-0">
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
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand/10 group-hover:text-brand">
                        {result.path}
                      </span>
                      <ChevronRight className="size-3 text-slate-400 group-hover:text-brand transition-colors" />
                    </div>
                  </button>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400">
                    <Search className="size-5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Không tìm thấy kết quả nào
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Thử nhập từ khóa: TOEIC, IELTS, Test đầu vào, Flashcard...
                    </p>
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
                    type="button"
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
                      type="button"
                      onClick={() =>
                        handleSearchItemClick(item.path, item.label)
                      }
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 group transition-colors duration-200 cursor-pointer border border-transparent"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="size-3.5 text-slate-400" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 group-hover:text-brand">
                        {item.path}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center space-y-2">
                  <p className="text-xs text-slate-400">
                    Gợi ý tìm kiếm phổ biến:
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {POPULAR_SEARCH_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setSearchQuery(tag)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-brand/10 hover:text-brand cursor-pointer transition-colors"
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
  );
}
