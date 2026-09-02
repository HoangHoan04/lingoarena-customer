"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTheme } from "@/providers/ThemeProvider";
import { Check, Globe, Moon, Settings, Sun } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function HeaderSettingsMenu() {
  const { theme, toggleTheme } = useTheme();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();

  const languages = [
    { code: "vi", name: "Tiếng Việt", icon: "/icons/vi.svg" },
    { code: "en", name: "English", icon: "/icons/en.svg" },
  ];

  const changeLanguage = (code: string) => {
    router.replace(pathname, { locale: code });
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:bg-[#2b417e]/10 dark:hover:bg-[#2b417e]/20 text-slate-600 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee] cursor-pointer transition-all duration-300 shrink-0"
            title="Cài đặt giao diện & ngôn ngữ"
          >
            <Settings className="size-4.5 hover:rotate-90 transition-transform duration-500" />
          </Button>
        }
      />

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-56 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl space-y-2 z-50 text-foreground"
      >
        {/* Header Label */}
        <div className="px-2 pt-1 pb-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {tNav("displaySettings")}
          </span>
        </div>

        {/* Theme Toggle Section */}
        <div className="space-y-1">
          <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              {theme === "dark" ? (
                <Moon className="size-3.5 text-[#7b9bee]" />
              ) : (
                <Sun className="size-3.5 text-amber-500" />
              )}
              {tNav("theme")}
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 dark:bg-slate-800 hover:bg-[#2b417e]/10 text-slate-700 dark:text-slate-300 hover:text-[#2b417e] dark:hover:text-[#7b9bee] transition-colors cursor-pointer"
            >
              {theme === "dark" ? tNav("dark") : tNav("light")}
            </button>
          </div>
        </div>

        <Separator className="bg-slate-100 dark:bg-slate-800 my-1" />

        {/* Language Selection Section */}
        <div className="space-y-1">
          <div className="px-2 py-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Globe className="size-3.5 text-[#2b417e] dark:text-[#7b9bee]" />
            <span>{tNav("language")}</span>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  locale === lang.code
                    ? "bg-[#2b417e]/10 text-[#2b417e] dark:text-[#7b9bee] font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={lang.icon}
                    alt={lang.name}
                    className="w-4 h-3 object-cover rounded-xs border border-slate-200 dark:border-slate-700"
                  />
                  <span>{lang.name}</span>
                </div>
                {locale === lang.code && (
                  <Check className="size-3.5 text-[#2b417e] dark:text-[#7b9bee] stroke-[2.5]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
