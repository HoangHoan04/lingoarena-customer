"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePathname, useRouter } from "@/i18n/routing";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function ChangeLanguage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Header");

  const languages = [
    { code: "en", name: "Tiếng anh", icon: "/icons/en.svg" },
    { code: "vi", name: "Tiếng Việt", icon: "/icons/vi.svg" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === locale) || languages[0];

  const changeLanguage = (code: string) => {
    router.replace(pathname, { locale: code });
  };

  return (
    <Tooltip>
      <Popover>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button variant="ghost">
                  <img
                    src={currentLanguage.icon}
                    alt={""}
                    className="w-5 h-4 object-cover"
                  />
                </Button>
              }
            />
          }
        />
        <TooltipContent side="bottom" sideOffset={6}>
          Đổi ngôn ngữ
        </TooltipContent>

        <PopoverContent
          align="end"
          sideOffset={8}
          className="w-40 rounded-xl overflow-hidden p-1 flex flex-col gap-1 z-50 border border-border bg-popover text-popover-foreground shadow-lg"
        >
          {languages.map((lang) => (
            <Button
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              variant="ghost"
              className={`w-full flex items-center justify-start gap-3 px-3 py-2 text-sm cursor-pointer rounded-lg h-9 font-normal transition-all duration-200 ${
                locale === lang.code
                  ? "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <img
                src={lang.icon}
                alt={lang.name}
                className="w-5 h-3.5 object-cover rounded-sm border border-border/40 shadow-sm"
              />
              <span className="font-medium">{lang.name}</span>
              {locale === lang.code && (
                <Check className="w-4 h-4 ml-auto text-blue-600 dark:text-blue-400 stroke-[2.5px]" />
              )}
            </Button>
          ))}
        </PopoverContent>
      </Popover>
    </Tooltip>
  );
}
