"use client";

import SearchDialogHeader from "@/components/common/SearchDialogHeader";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { useTranslateStore } from "@/stores/useTranslateStore";
import { Languages, Menu as MenuIcon, Search, Target, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import HeaderSettingsMenu from "../common/HeaderSettingsMenu";
import Logo from "../common/Logo";
import UserMenu from "../common/UserMenu";
import { GoogleTranslateModal } from "../translate";
import HeaderDesktopNav from "./HeaderDesktopNav";
import HeaderMobileMenu from "./HeaderMobileMenu";

type AppHeaderProps = {
  isScrolled?: boolean;
};

export default function AppHeader({
  isScrolled: isScrolledProp,
}: AppHeaderProps) {
  const tNav = useTranslations("nav");
  const router = useRouter();
  const { openTranslate } = useTranslateStore();

  const [isScrolledLocal, setIsScrolledLocal] = useState(false);
  const isScrolled =
    isScrolledProp !== undefined ? isScrolledProp : isScrolledLocal;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (isScrolledProp !== undefined) return;
    const handleScroll = () => {
      setIsScrolledLocal(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isScrolledProp]);

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
          fixed z-50 overflow-visible transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] text-foreground
          mx-auto left-0 right-0 w-[calc(100%-16px)] sm:w-[calc(100%-32px)] max-w-7xl
          ${
            isScrolled
              ? "top-0 rounded-b-2xl shadow-[0_12px_32px_rgba(43,65,126,0.12)] dark:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
              : "top-2 sm:top-5 rounded-2xl shadow-[0_8px_24px_rgba(43,65,126,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
          }
        `}
      >
        <div
          className={`w-full h-px bg-linear-to-r from-transparent via-brand/20 to-transparent ${
            isScrolled ? "" : "rounded-t-2xl"
          }`}
        />

        <div
          className={`
            border-l border-r border-b border-slate-200/80 dark:border-slate-800 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${
              isScrolled
                ? "backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 rounded-b-2xl"
                : "backdrop-blur-lg bg-white/85 dark:bg-slate-900/85 rounded-2xl"
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div
              className={`flex items-center justify-between gap-1.5 sm:gap-3 transition-all duration-300 ${
                isScrolled ? "h-20" : "h-20"
              }`}
            >
              <button
                type="button"
                className="flex items-center cursor-pointer logo-wrap select-none bg-transparent border-none p-0 shrink-0"
                onClick={() => router.push("/")}
                aria-label="Trang chủ LingoArena"
              >
                <Logo />
              </button>

              <HeaderDesktopNav />

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(true)}
                  className="size-8.5 sm:size-9 rounded-xl hover:bg-brand/10 dark:hover:bg-brand/20 text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-[#7b9bee] cursor-pointer transition-all duration-200 shrink-0"
                  title="Tìm kiếm nhanh (Ctrl+K)"
                  aria-label="Tìm kiếm"
                >
                  <Search className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={openTranslate}
                  className="size-8.5 sm:size-9 rounded-xl hover:bg-brand/10 dark:hover:bg-brand/20 text-slate-600 dark:text-slate-300 hover:text-brand dark:hover:text-[#7b9bee] cursor-pointer transition-all duration-200 shrink-0"
                  title={tNav("translateTooltip")}
                  aria-label="Google Translate"
                >
                  <Languages className="size-4 text-primary dark:text-[#7b9bee]" />
                </Button>

                <HeaderSettingsMenu />

                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 cursor-pointer py-1.5 sm:py-2 px-2.5 sm:px-3.5 rounded-xl bg-brand hover:bg-[#1e2f5e] text-white font-bold text-xs shadow-md shadow-brand/25 transition-all hover:scale-102 shrink-0"
                  onClick={() => router.push("/placement-test")}
                  title={tNav("placementTest")}
                >
                  <Target className="size-3.5 text-amber-300 shrink-0" />
                  <span className="hidden xl:inline whitespace-nowrap">
                    {tNav("placementTest")}
                  </span>
                </button>

                <div className="relative flex items-center shrink-0">
                  <UserMenu />
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-[#7b9bee] transition-colors focus:outline-hidden cursor-pointer shrink-0"
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

          <HeaderMobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            openTranslate={openTranslate}
          />
        </div>

        <div className="w-full h-px bg-linear-to-r from-transparent via-brand/15 to-transparent rounded-b-2xl" />
      </header>

      <SearchDialogHeader open={isSearchOpen} onOpenChange={setIsSearchOpen} />
      <GoogleTranslateModal />
    </>
  );
}
