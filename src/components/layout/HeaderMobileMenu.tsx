"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  ChevronDown,
  ChevronRight,
  Languages,
  Target,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { NAV_LINKS, NavLinkItem } from "./HeaderDesktopNav";

interface HeaderMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  openTranslate: () => void;
}

export default function HeaderMobileMenu({
  isOpen,
  onClose,
  openTranslate,
}: HeaderMobileMenuProps) {
  const router = useRouter();
  const pathname = usePathname();
  const tNav = useTranslations("nav");

  const [openMobileSubmenus, setOpenMobileSubmenus] = useState<
    Record<string, boolean>
  >({ practice: false, learn: false });

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const toggleMobileSubmenu = (key: string) => {
    setOpenMobileSubmenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isItemActive = (item: NavLinkItem) => {
    if (isActivePath(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => {
        const basePath = child.path.split("?")[0];
        return pathname === basePath || pathname.startsWith(`${basePath}/`);
      });
    }
    return false;
  };

  return (
    <div
      className={`
        lg:hidden overflow-hidden transition-all duration-500 ease-in-out border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-b-2xl
        ${
          isOpen
            ? "max-h-200 opacity-100 py-4 px-6 overflow-y-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        }
      `}
    >
      <nav className="flex flex-col gap-1.5">
        {NAV_LINKS.map((item) => {
          const isActive = isItemActive(item);
          const hasChildren = Boolean(
            item.children && item.children.length > 0,
          );

          if (hasChildren) {
            const isMobileSubOpen = Boolean(openMobileSubmenus[item.key]);

            return (
              <div key={item.key} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleMobileSubmenu(item.key)}
                  className={`w-full flex items-center justify-between py-2 px-3 rounded-xl transition-colors bg-transparent border-none cursor-pointer text-left text-sm font-semibold ${
                    isActive
                      ? "bg-brand/10 text-brand dark:text-[#7b9bee] font-bold"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  aria-expanded={isMobileSubOpen}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${
                      isMobileSubOpen
                        ? "rotate-180 text-brand dark:text-[#7b9bee]"
                        : ""
                    }`}
                  />
                </button>

                {isMobileSubOpen && (
                  <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-brand/30 ml-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    {item.children?.map((child) => {
                      const isChildActive = isActivePath(
                        child.path.split("?")[0],
                      );
                      const Icon = child.icon;

                      return (
                        <button
                          key={child.key}
                          type="button"
                          onClick={() => {
                            router.push(child.path as any);
                            onClose();
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer ${
                            isChildActive
                              ? "bg-brand/15 text-brand dark:text-[#7b9bee] font-bold"
                              : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg bg-linear-to-br ${child.gradient} shrink-0`}
                          >
                            {Icon && <Icon className="size-3.5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold">
                                {child.label}
                              </span>
                              {child.badge && (
                                <span className="text-[9px] font-mono text-slate-400">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.path}
              type="button"
              onClick={() => {
                router.push(item.path as any);
                onClose();
              }}
              className={`w-full text-left py-2.5 px-3 rounded-xl bg-transparent border-none cursor-pointer text-sm font-semibold transition-colors flex items-center justify-between ${
                isActive
                  ? "bg-brand/10 text-brand dark:text-[#7b9bee] font-bold"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{item.label}</span>
              {isActive && (
                <ChevronRight className="size-4 text-brand dark:text-[#7b9bee]" />
              )}
            </button>
          );
        })}

        <div className="pt-3 mt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
          <Button
            className="w-full py-5 rounded-xl bg-brand hover:bg-brand/80 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => {
              onClose();
              router.push("/placement-test");
            }}
          >
            <Target className="size-4 text-amber-300" />
            {tNav("placementTestDesc")}
          </Button>
          <Button
            variant="outline"
            className="w-full py-5 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-700 cursor-pointer"
            onClick={() => {
              onClose();
              router.push("/practice");
            }}
          >
            <Zap className="size-4 text-brand dark:text-[#7b9bee] mr-1.5" />
            {tNav("practiceRoom")}
          </Button>
          <Button
            variant="outline"
            className="w-full py-5 rounded-xl font-bold text-xs border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 text-primary dark:text-[#7b9bee] cursor-pointer"
            onClick={() => {
              onClose();
              openTranslate();
            }}
          >
            <Languages className="size-4" />
            {tNav("quickTranslate")}
          </Button>
        </div>
      </nav>
    </div>
  );
}
