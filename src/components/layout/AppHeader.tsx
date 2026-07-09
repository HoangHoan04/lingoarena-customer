"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  BookOpen,
  ChevronRight,
  Clock,
  Menu as MenuIcon,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import ChangeLanguage from "../common/ChangeLanguage";
import ToggleTheme from "../common/ToggleTheme";
import TranslationButton from "../common/TranslationButton";
import UserMenu from "../common/UserMenu";

export default function AppHeader() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const t = useTranslations("Header");
  const router = useRouter();
  const pathname = usePathname();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<
    { label: string; path: string }[]
  >(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("recent_searches_customer");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
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
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Customer pages list for search
  const customerPages = useMemo(
    () => [
      {
        label: t("home") || "Trang chủ",
        path: "/",
        description: "LingoArena Home Page",
      },
      {
        label: t("courses") || "Khóa học",
        path: "/courses",
        description: "Learn English Courses",
      },
      {
        label: t("leaderboard") || "Bảng xếp hạng",
        path: "/leaderboard",
        description: "Student Rankings",
      },
      {
        label: t("login") || "Đăng nhập",
        path: "/login",
        description: "Sign in to LingoArena",
      },
      {
        label: t("register") || "Đăng ký",
        path: "/register",
        description: "Create a new account",
      },
    ],
    [t],
  );

  // Search filtering
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return customerPages.filter(
      (page) =>
        page.label.toLowerCase().includes(query) ||
        page.path.toLowerCase().includes(query),
    );
  }, [searchQuery, customerPages]);

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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Section: Logo & Hamburger Navigation Menu */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-600 dark:text-blue-400"
          >
            <BookOpen className="w-6 h-6 shrink-0" />
            <span className="hidden sm:inline">LingoArena</span>
          </Link>

          <NavigationMenu align="start">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-lg hover:bg-muted cursor-pointer shrink-0"
                    >
                      <MenuIcon className="w-5 h-5 text-foreground" />
                    </Button>
                  }
                />
                <NavigationMenuContent className="w-48 p-1 flex flex-col gap-0.5 border border-border bg-popover text-popover-foreground shadow-lg rounded-xl z-[9999]">
                  <NavigationMenuLink
                    href="/"
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg text-sm font-medium"
                  >
                    {t("home")}
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/courses"
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg text-sm font-medium"
                  >
                    {t("courses")}
                  </NavigationMenuLink>
                  <NavigationMenuLink
                    href="/leaderboard"
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg text-sm font-medium"
                  >
                    {t("leaderboard")}
                  </NavigationMenuLink>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Center Section: Search Bar Trigger */}
        <div className="flex-1 max-w-md mx-auto flex justify-center">
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 bg-muted/50 hover:bg-muted border border-input rounded-xl px-3 py-1.5 h-9 cursor-pointer w-full text-xs text-muted-foreground transition-all duration-200"
          >
            <Search className="size-4 shrink-0 text-muted-foreground" />
            <span className="truncate flex-1 text-left">Tìm kiếm nhanh...</span>
            <kbd className="hidden md:inline-flex h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[9px] font-medium text-muted-foreground opacity-100">
              Ctrl K
            </kbd>
          </div>
        </div>

        {/* Right Section: Language, Theme, Quick Translate, UserMenu */}
        <div className="flex items-center gap-2.5 shrink-0">
          <ChangeLanguage />
          <ToggleTheme />
          <TranslationButton />

          <UserMenu />
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-xl p-0 overflow-hidden bg-background border border-border shadow-2xl rounded-2xl transition-all duration-300 z-50"
        >
          {/* Dialog Header / Search Input */}
          <DialogHeader className="p-4 border-b border-border flex flex-row items-center justify-between gap-3 bg-muted/20">
            <div className="flex items-center gap-3 flex-1">
              <Search className="size-4 text-muted-foreground shrink-0 animate-pulse" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nhập trang cần tìm kiếm..."
                className="border-0 focus-visible:ring-0 focus-visible:outline-none text-sm w-full bg-transparent placeholder:text-muted-foreground/50 text-foreground"
                autoFocus
              />
            </div>
            <div className="flex items-center gap-2 shrink-0 select-none">
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="size-6 p-0 rounded-full hover:bg-muted"
                  title="Xóa tìm kiếm"
                >
                  <X className="size-3.5 text-muted-foreground" />
                </Button>
              )}
              <span className="hidden sm:inline-flex text-[9px] px-1.5 py-0.5 rounded border border-border bg-muted font-mono text-muted-foreground">
                ESC
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(false)}
                className="size-6 p-0 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Dialog Body / Results & History */}
          <div className="p-3 max-h-96 overflow-y-auto space-y-4">
            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-1 animate-in fade-in duration-200">
                <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block px-2.5 mb-2">
                  Kết quả tìm kiếm
                </span>
                {searchResults.length > 0 ? (
                  searchResults.map((result) => (
                    <button
                      key={result.path}
                      onClick={() =>
                        handleSearchItemClick(result.path, result.label)
                      }
                      className="w-full flex items-center justify-between p-2.5 rounded-xl text-left text-xs transition-all duration-150 group border border-transparent hover:border-blue-500/20 hover:bg-blue-500/5 text-foreground cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-muted text-muted-foreground group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shrink-0">
                          <BookOpen className="size-4" />
                        </div>
                        <div>
                          <span className="font-semibold block">
                            {result.label}
                          </span>
                          <span className="text-[10px] text-muted-foreground block truncate max-w-70">
                            {result.description}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground group-hover:bg-blue-500/10 group-hover:text-blue-600">
                          {result.path}
                        </span>
                        <ChevronRight className="size-3 text-muted-foreground/45 group-hover:text-blue-500 transition-colors" />
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                    <div className="p-3 bg-muted rounded-full text-muted-foreground">
                      <Search className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-semibold text-foreground">
                        Không tìm thấy kết quả nào
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Thử nhập lại từ khóa khác
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Recent Search History */}
            {!searchQuery && (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-2.5 mb-1">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest block">
                    Lịch sử tìm kiếm
                  </span>
                  {recentSearches.length > 0 && (
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-rose-500 hover:underline cursor-pointer"
                    >
                      Xóa tất cả
                    </button>
                  )}
                </div>
                {recentSearches.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {recentSearches.map((item) => (
                      <button
                        key={item.path}
                        onClick={() =>
                          handleSearchItemClick(item.path, item.label)
                        }
                        className="flex items-center justify-between p-2 rounded-xl bg-muted/30 hover:bg-muted text-left text-xs text-foreground group transition-colors duration-200 cursor-pointer border border-transparent"
                      >
                        <div className="flex items-center gap-2.5">
                          <Clock className="size-3.5 text-muted-foreground" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        <span className="text-[9px] font-mono text-muted-foreground group-hover:text-foreground">
                          {item.path}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-center text-muted-foreground py-4">
                    Chưa có lịch sử tìm kiếm gần đây
                  </p>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
