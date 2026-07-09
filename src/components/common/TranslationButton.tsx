"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/ThemeProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowLeftRight,
  Check,
  Copy,
  Languages,
  Loader2,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const SUPPORTED_LANGUAGES: Record<
  string,
  { displayName: string; name: string; code: string }
> = {
  en: { displayName: "English", name: "Tiếng Anh", code: "en" },
  vi: { displayName: "Tiếng Việt", name: "Tiếng Việt", code: "vi" },
  ja: { displayName: "日本語", name: "Tiếng Nhật", code: "ja" },
  ko: { displayName: "한국어", name: "Tiếng Hàn", code: "ko" },
  zh: { displayName: "中文", name: "Tiếng Trung", code: "zh" },
  fr: { displayName: "Français", name: "Tiếng Pháp", code: "fr" },
  es: { displayName: "Español", name: "Tiếng Tây Ban Nha", code: "es" },
};

const countWords = (text: string) => {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
};

export function useSupportedLanguages() {
  return useQuery({
    queryKey: ["supportedLanguages"],
    queryFn: async () => SUPPORTED_LANGUAGES,
    staleTime: Infinity,
  });
}

export function useTranslateText() {
  return useMutation({
    mutationFn: async ({
      text,
      to,
      from,
    }: {
      text: string;
      to: string;
      from?: string;
    }) => {
      const fromLang = from || "auto";
      const response = await axios.get(
        "https://api.mymemory.translated.net/get",
        {
          params: {
            q: text,
            langpair: `${fromLang}|${to}`,
          },
        },
      );

      const translatedText = response.data?.responseData?.translatedText || "";
      return { translatedText };
    },
  });
}

export function useDetectLanguage(text: string) {
  return useQuery({
    queryKey: ["detectLanguage", text],
    queryFn: async () => {
      if (!text.trim()) return { language: "" };
      return { language: "auto" };
    },
    enabled: text.trim().length > 0,
  });
}

export default function TranslationButton() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [sourceLang, setSourceLang] = useState<string>("auto");
  const [targetLang, setTargetLang] = useState<string>("vi");
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  const { data: allLanguages } = useSupportedLanguages();
  const { mutate: translate, isPending } = useTranslateText();
  const { data: detectedData } = useDetectLanguage(sourceText);

  const languageOptions = useMemo(() => {
    if (!allLanguages) return [];
    return Object.values(allLanguages).sort((a, b) =>
      a.displayName.localeCompare(b.displayName),
    );
  }, [allLanguages]);

  const currentSourceLabel = useMemo(() => {
    if (sourceLang === "auto") return "Tự động phát hiện";
    return allLanguages?.[sourceLang]?.name || sourceLang;
  }, [sourceLang, allLanguages]);

  const currentTargetLabel = useMemo(() => {
    return allLanguages?.[targetLang]?.name || targetLang;
  }, [targetLang, allLanguages]);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (sourceText.trim().length > 0) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        translate(
          {
            text: sourceText,
            to: targetLang,
            from: sourceLang === "auto" ? undefined : sourceLang,
          },
          {
            onSuccess: (data) => {
              setTranslatedText(data?.translatedText || "");
            },
            onError: (error: any) => {
              if (error.name === "AbortError") return;
            },
          },
        );
      } else {
        setTranslatedText("");
      }
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [sourceText, sourceLang, targetLang, translate]);

  const swapLanguages = () => {
    const effectiveSource = sourceLang === "auto" ? "en" : sourceLang;
    setSourceLang(targetLang);
    setTargetLang(effectiveSource);
    if (translatedText) {
      const oldSource = sourceText;
      setSourceText(translatedText);
      setTranslatedText(oldSource);
    }
  };

  const speak = (text: string, lang: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center w-fit">
      <Tooltip>
        <Popover>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="rounded-lg transition-all active:scale-95 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                  >
                    <Languages className="w-5 h-5" />
                  </Button>
                }
              />
            }
          />
          <TooltipContent side="bottom">Dịch thuật nhanh</TooltipContent>

          <PopoverContent
            align="end"
            sideOffset={8}
            className={`w-95 md:w-112.5 shadow-2xl border rounded-2xl overflow-hidden p-4 ${
              isDark
                ? "bg-[#18181b] border-zinc-800 text-zinc-100"
                : "bg-white border-slate-100 text-slate-900"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="xs"
                      variant={sourceLang === "auto" ? "default" : "outline"}
                      onClick={() => setSourceLang("auto")}
                      className="text-xs font-bold"
                    >
                      Phát hiện{" "}
                      {detectedData?.language && `(${detectedData.language})`}
                    </Button>

                    <div className="h-4 w-px bg-slate-200 dark:bg-zinc-800"></div>

                    <Select
                      value={sourceLang}
                      onValueChange={(val) => setSourceLang(val || "auto")}
                    >
                      <SelectTrigger className="h-8 text-xs font-semibold max-w-35 border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                        <SelectValue placeholder={currentSourceLabel} />
                      </SelectTrigger>
                      <SelectContent className="max-h-60 dark:bg-zinc-900 dark:border-zinc-800">
                        <SelectItem value="auto">Tự động phát hiện</SelectItem>
                        {languageOptions.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.displayName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={swapLanguages}
                    className="text-cyan-500 hover:bg-slate-100 dark:hover:bg-zinc-800"
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <Textarea
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    placeholder="Nhập nội dung cần dịch..."
                    className={`w-full min-h-24 p-3 text-sm rounded-xl resize-none border border-slate-200 dark:border-zinc-800 ${
                      isDark
                        ? "bg-zinc-900/40 text-white placeholder:text-zinc-600 focus:bg-zinc-900"
                        : "bg-slate-50/50 text-slate-900 placeholder:text-slate-400 focus:bg-slate-50"
                    }`}
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] font-bold text-slate-400 dark:text-zinc-500 opacity-60">
                    Từ: {countWords(sourceText)}
                  </div>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800 pt-3">
                <div className="flex items-center">
                  <Select
                    value={targetLang}
                    onValueChange={(val) => setTargetLang(val || "vi")}
                  >
                    <SelectTrigger className="h-8 text-xs font-semibold max-w-35 border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                      <SelectValue placeholder={currentTargetLabel} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 dark:bg-zinc-900 dark:border-zinc-800">
                      {languageOptions
                        .filter((lang) => lang.code !== "auto")
                        .map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.displayName}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className={`p-3 rounded-xl min-h-24 relative border transition-colors ${
                    isDark
                      ? "bg-indigo-500/5 border-indigo-500/10"
                      : "bg-slate-50/50 border-slate-100"
                  }`}
                >
                  {isPending && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 dark:bg-zinc-950/70 z-10">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    </div>
                  )}

                  <p
                    className={`text-sm min-h-17.5 font-medium leading-normal ${
                      isDark ? "text-zinc-200" : "text-slate-700"
                    }`}
                  >
                    {translatedText || (
                      <span className="opacity-40 italic font-normal text-slate-400 dark:text-zinc-500">
                        Kết quả dịch...
                      </span>
                    )}
                  </p>

                  {translatedText && (
                    <div className="flex gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => speak(translatedText, targetLang)}
                        className="text-slate-500 hover:text-cyan-500 dark:text-zinc-400 dark:hover:text-cyan-400"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={handleCopy}
                        className="text-slate-500 hover:text-cyan-500 dark:text-zinc-400 dark:hover:text-cyan-400"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  href="/translation"
                  className="text-[11px] font-bold text-cyan-500 hover:underline hover:text-cyan-400 transition-colors"
                >
                  © {currentYear} LingoArena Translate
                </Link>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </Tooltip>
    </div>
  );
}
