"use client";

import { useToastStore } from "@/stores/useToastStore";
import { useTranslateStore, type TranslateMode } from "@/stores/useTranslateStore";
import { translateService } from "@/services/translate.service";
import type { TranslateDictionaryData } from "@/types/translate";
import {
  ALL_LANGUAGES,
  POPULAR_SOURCE_LANGUAGES,
  POPULAR_TARGET_LANGUAGES,
} from "./TranslateLanguages";
import TranslateDictionaryView from "./TranslateDictionaryView";
import TranslateHistoryDrawer from "./TranslateHistoryDrawer";
import TranslateLanguagePicker from "./TranslateLanguagePicker";
import {
  ArrowLeftRight,
  ArrowUpRight,
  BookMarked,
  Check,
  ChevronDown,
  Copy,
  FileText,
  Globe2,
  History,
  Image as ImageIcon,
  Languages,
  Loader2,
  Maximize2,
  Mic,
  Minimize2,
  RotateCcw,
  Share2,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  UploadCloud,
  Volume2,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const MAX_CHARS = 5000;

const SPEECH_LANG: Record<string, string> = {
  auto: "en-US",
  en: "en-US",
  vi: "vi-VN",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  "zh-TW": "zh-TW",
  fr: "fr-FR",
  de: "de-DE",
  es: "es-ES",
  it: "it-IT",
  ru: "ru-RU",
  pt: "pt-PT",
  th: "th-TH",
  id: "id-ID",
  ar: "ar-SA",
};

const PROVIDER_LABEL: Record<string, string> = {
  azure: "Azure Translator",
  google: "Google Cloud Translation",
  mymemory: "MyMemory (miễn phí)",
  none: "Không cần dịch",
};

export default function GoogleTranslateModal() {
  const {
    isOpen,
    isFullscreen,
    mode,
    sourceLang,
    targetLang,
    sourceText,
    translatedText,
    isTranslating,
    showHistoryDrawer,
    showSavedDrawer,
    closeTranslate,
    toggleFullscreen,
    setMode,
    setSourceLang,
    setTargetLang,
    setSourceText,
    setTranslatedText,
    setIsTranslating,
    swapLanguages,
    addToHistory,
    toggleStarPhrase,
    setShowHistoryDrawer,
    setShowSavedDrawer,
    savedPhrases,
  } = useTranslateStore();

  const { addToast } = useToastStore();

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerIsSource, setPickerIsSource] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<"up" | "down" | null>(null);
  const [dictionary, setDictionary] = useState<TranslateDictionaryData | null>(null);
  const [detectedLang, setDetectedLang] = useState<string | undefined>();
  const [providerName, setProviderName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  // Textarea auto-resize or focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Debounced translation via backend (Azure / Google / MyMemory)
  useEffect(() => {
    const text = sourceText.trim();
    if (!text) {
      setTranslatedText("");
      setIsTranslating(false);
      setDictionary(null);
      setDetectedLang(undefined);
      return;
    }

    const controller = new AbortController();
    setIsTranslating(true);
    const timer = setTimeout(async () => {
      try {
        const res = await translateService.translate(
          { text, sourceLang, targetLang },
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        setTranslatedText(res.translatedText || "");
        setDictionary(res.dictionary || null);
        setDetectedLang(res.detectedSourceLang);
        setProviderName(res.provider || "");
        if (text.length > 2 && res.translatedText) {
          addToHistory({
            sourceText: text,
            translatedText: res.translatedText,
            sourceLang: res.detectedSourceLang || sourceLang,
            targetLang,
          });
        }
      } catch (err: any) {
        if (controller.signal.aborted || /canceled/i.test(err?.message || "")) return;
        setTranslatedText("");
        setDictionary(null);
        addToast(err?.message || "Không dịch được văn bản", "error");
      } finally {
        if (!controller.signal.aborted) setIsTranslating(false);
      }
    }, 500);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [sourceText, sourceLang, targetLang]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    addToast("Đã sao chép bản dịch vào bộ nhớ tạm", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string, isSource: boolean) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isSource) setIsSpeakingSource(true);
    else setIsSpeakingTarget(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANG[lang] || (lang === "auto" ? "en-US" : lang);
    utterance.onend = () => {
      setIsSpeakingSource(false);
      setIsSpeakingTarget(false);
    };
    utterance.onerror = () => {
      setIsSpeakingSource(false);
      setIsSpeakingTarget(false);
    };
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    if (typeof window === "undefined" || !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      addToast("Trình duyệt không hỗ trợ nhận dạng giọng nói trực tiếp", "info");
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = SPEECH_LANG[sourceLang] || (sourceLang === "auto" ? "en-US" : sourceLang);
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const current = useTranslateStore.getState().sourceText;
        setSourceText(current ? `${current} ${transcript}` : transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleWebsiteTranslate = () => {
    const raw = websiteUrl.trim();
    if (!raw) {
      addToast("Nhập URL trang web cần dịch", "info");
      return;
    }
    try {
      const parsed = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
      const sl = sourceLang === "auto" ? "auto" : sourceLang;
      window.open(
        `https://translate.google.com/translate?sl=${sl}&tl=${targetLang}&u=${encodeURIComponent(parsed.toString())}`,
        "_blank",
        "noopener,noreferrer",
      );
    } catch {
      addToast("URL không hợp lệ", "error");
    }
  };

  const openPicker = (isSource: boolean) => {
    setPickerIsSource(isSource);
    setPickerOpen(true);
  };

  const detectedLangLabel = detectedLang
    ? ALL_LANGUAGES.find((l) => l.code === detectedLang)?.name || detectedLang
    : "";

  const sourceLangLabel =
    sourceLang === "auto"
      ? detectedLangLabel
        ? `Phát hiện: ${detectedLangLabel}`
        : "Phát hiện ngôn ngữ"
      : ALL_LANGUAGES.find((l) => l.code === sourceLang)?.name || sourceLang;

  const targetLangLabel =
    ALL_LANGUAGES.find((l) => l.code === targetLang)?.name || targetLang;

  const isCurrentStarred = savedPhrases.some(
    (item) => item.sourceText === sourceText && item.translatedText === translatedText,
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeTranslate}
    >
      {/* Master Container (Windowed or Fullscreen) */}
      <div
        className={`relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xl transition-all duration-300 overflow-hidden ${
          isFullscreen
            ? "fixed inset-0 w-full h-full rounded-none"
            : "w-full max-w-6xl max-h-[92vh] sm:rounded-3xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP NAVIGATION BAR */}
        <div className="p-3 sm:p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/80 dark:bg-slate-850">
          {/* Logo & Mode Tabs */}
          <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-primary to-blue-500 text-white flex items-center justify-center shadow-md shadow-primary/25">
                <Languages className="size-5" />
              </div>
              <div className="hidden sm:block">
                <h2 className="font-black text-sm text-slate-900 dark:text-white leading-tight">
                  LingoArena Translate
                </h2>
                <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">
                  Google Translate Studio
                </p>
              </div>
            </div>

            {/* Mode Tabs (Text, Images, Documents, Websites) */}
            <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-2xl shrink-0">
              {(
                [
                  { id: "text", label: "Văn bản", icon: FileText },
                  { id: "documents", label: "Tài liệu", icon: UploadCloud },
                  { id: "images", label: "Hình ảnh", icon: ImageIcon },
                  { id: "websites", label: "Trang web", icon: Globe2 },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                const active = mode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setMode(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      active
                        ? "bg-white dark:bg-slate-900 text-primary dark:text-[#7b9bee] shadow-xs scale-102"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="size-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Controls (History, Saved, Fullscreen, Close) */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setShowHistoryDrawer(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
              title="Lịch sử dịch"
              aria-label="Lịch sử dịch"
            >
              <History className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={() => setShowSavedDrawer(true)}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-amber-500 transition-colors cursor-pointer"
              title="Cụm từ đã lưu"
              aria-label="Cụm từ đã lưu"
            >
              <Star className="size-4.5" />
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary transition-colors cursor-pointer"
              title={isFullscreen ? "Thu nhỏ cửa sổ" : "Mở rộng toàn màn hình"}
              aria-label="Toàn màn hình"
            >
              {isFullscreen ? <Minimize2 className="size-4.5" /> : <Maximize2 className="size-4.5" />}
            </button>

            <button
              type="button"
              onClick={closeTranslate}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-1"
              aria-label="Đóng"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* BODY CONTENT BY MODE */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {mode === "text" && (
            <>
              {/* LANGUAGE SELECTION BAR */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                {/* Source Languages Toolbar */}
                <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {POPULAR_SOURCE_LANGUAGES.map((lang) => {
                    const active = sourceLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setSourceLang(lang.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => openPicker(true)}
                    className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    title="Tất cả ngôn ngữ nguồn"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>

                {/* Swap Button (Center) */}
                <div className="md:col-span-2 flex justify-center">
                  <button
                    type="button"
                    onClick={swapLanguages}
                    className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary hover:bg-primary/10 text-primary dark:text-[#7b9bee] shadow-2xs hover:rotate-180 transition-all duration-300 cursor-pointer"
                    title="Đổi chiều ngôn ngữ"
                  >
                    <ArrowLeftRight className="size-4" />
                  </button>
                </div>

                {/* Target Languages Toolbar */}
                <div className="md:col-span-5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {POPULAR_TARGET_LANGUAGES.map((lang) => {
                    const active = targetLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTargetLang(lang.code)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          active
                            ? "bg-primary text-white shadow-xs"
                            : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        {lang.name}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => openPicker(false)}
                    className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 text-xs font-bold cursor-pointer"
                    title="Tất cả ngôn ngữ đích"
                  >
                    <ChevronDown className="size-4" />
                  </button>
                </div>
              </div>

              {/* DUAL TRANSLATION CANVAS */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* SOURCE TEXT BOX */}
                <div className="relative flex flex-col rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6 shadow-sm focus-within:border-primary/80 transition-colors min-h-[260px] sm:min-h-[320px]">
                  <textarea
                    ref={textareaRef}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value.slice(0, MAX_CHARS))}
                    placeholder="Nhập văn bản, đoạn văn hoặc cụm từ cần dịch..."
                    className="w-full flex-1 resize-none bg-transparent text-base sm:text-lg font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none leading-relaxed"
                  />

                  {/* Source Bottom Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!sourceText}
                        onClick={() => handleSpeak(sourceText, sourceLang, true)}
                        className={`p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 ${
                          isSpeakingSource ? "text-primary animate-pulse" : ""
                        }`}
                        title="Nghe phát âm"
                      >
                        <Volume2 className="size-4.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleVoiceInput}
                        className={`p-2 rounded-xl transition-colors cursor-pointer ${
                          isListening
                            ? "bg-rose-500 text-white animate-pulse"
                            : "text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                        title="Dịch bằng giọng nói"
                      >
                        <Mic className="size-4.5" />
                      </button>

                      {sourceText && (
                        <button
                          type="button"
                          onClick={() => setSourceText("")}
                          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Xóa văn bản"
                        >
                          <X className="size-4.5" />
                        </button>
                      )}
                    </div>

                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {sourceText.length} / {MAX_CHARS.toLocaleString("en-US")}
                    </span>
                  </div>
                </div>

                {/* TARGET TRANSLATION BOX */}
                <div className="relative flex flex-col justify-between rounded-3xl border-2 border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850 p-5 sm:p-6 shadow-sm min-h-[260px] sm:min-h-[320px]">
                  {/* Loading spinner overlay */}
                  {isTranslating && (
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 text-xs font-bold text-primary dark:text-[#7b9bee] bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Đang dịch...</span>
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    {translatedText ? (
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed select-text">
                        {translatedText}
                      </div>
                    ) : (
                      <p className="text-base text-slate-400 italic">
                        Bản dịch sẽ tự động xuất hiện tại đây...
                      </p>
                    )}
                  </div>

                  {/* Target Bottom Controls */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-200/70 dark:border-slate-750">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={!translatedText}
                        onClick={() => handleSpeak(translatedText, targetLang, false)}
                        className={`p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30 ${
                          isSpeakingTarget ? "text-primary animate-pulse" : ""
                        }`}
                        title="Nghe bản dịch"
                      >
                        <Volume2 className="size-4.5" />
                      </button>

                      <button
                        type="button"
                        disabled={!translatedText}
                        onClick={handleCopy}
                        className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
                        title="Sao chép bản dịch"
                      >
                        {copied ? (
                          <Check className="size-4.5 text-emerald-500" />
                        ) : (
                          <Copy className="size-4.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        disabled={!translatedText}
                        onClick={() => {
                          if (!sourceText || !translatedText) return;
                          toggleStarPhrase({
                            id: `star-${Date.now()}`,
                            sourceText,
                            translatedText,
                            sourceLang,
                            targetLang,
                            timestamp: Date.now(),
                          });
                          addToast("Đã lưu cụm từ vào danh sách yêu thích", "success");
                        }}
                        className="p-2 rounded-xl text-slate-500 hover:text-amber-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
                        title="Lưu cụm từ"
                      >
                        <Star className={`size-4.5 ${isCurrentStarred ? "text-amber-500 fill-amber-500" : ""}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackGiven("up");
                          addToast("Cảm ơn bạn đã đánh giá bản dịch tốt!", "success");
                        }}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer ${
                          feedbackGiven === "up" ? "text-emerald-500 bg-emerald-50" : ""
                        }`}
                        title="Bản dịch tốt"
                      >
                        <ThumbsUp className="size-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFeedbackGiven("down");
                          addToast("Đã ghi nhận góp ý cải thiện bản dịch!", "info");
                        }}
                        className={`p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 cursor-pointer ${
                          feedbackGiven === "down" ? "text-rose-500 bg-rose-50" : ""
                        }`}
                        title="Bản dịch chưa chuẩn"
                      >
                        <ThumbsDown className="size-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RICH DICTIONARY SECTION */}
              <TranslateDictionaryView
                data={dictionary}
                sourceText={sourceText}
                translatedText={translatedText}
                onSaveToNotebook={() =>
                  addToast("Đã lưu từ vựng vào Sổ tay SRS cá nhân", "success")
                }
              />
            </>
          )}

          {/* DOCUMENTS TRANSLATE TAB */}
          {mode === "documents" && (
            <div className="p-8 sm:p-14 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary dark:text-[#7b9bee] flex items-center justify-center mx-auto">
                <UploadCloud className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Chọn hoặc Kéo Thả Tài Liệu Để Dịch
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Hỗ trợ định dạng file <strong>.docx, .pdf, .pptx, .xlsx, .txt</strong> với khả năng giữ nguyên cấu trúc văn bản gốc.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => addToast("Chức năng tải tài liệu đang phát triển", "info")}
                  className="px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Duyệt file từ máy tính
                </button>
              </div>
            </div>
          )}

          {/* IMAGES TRANSLATE TAB */}
          {mode === "images" && (
            <div className="p-8 sm:p-14 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 flex items-center justify-center mx-auto">
                <ImageIcon className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Dịch Văn Bản Từ Hình Ảnh (OCR)
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Tải lên ảnh chụp đề thi, bảng biểu hoặc tài liệu tiếng Anh để trích xuất và dịch tự động.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => addToast("Chức năng dịch hình ảnh đang phát triển", "info")}
                  className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md cursor-pointer"
                >
                  Tải ảnh lên (.png, .jpg, .webp)
                </button>
              </div>
            </div>
          )}

          {/* WEBSITES TRANSLATE TAB */}
          {mode === "websites" && (
            <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-4 max-w-2xl mx-auto text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center mx-auto">
                <Globe2 className="size-8" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Dịch Toàn Bộ Trang Web
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Nhập URL trang tin tức, bài báo khoa học hoặc tài liệu học thuật tiếng Anh.
                </p>
              </div>
              <div className="flex gap-2">
                <input
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleWebsiteTranslate();
                  }}
                  placeholder="https://example.com/article..."
                  className="flex-1 h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleWebsiteTranslate}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Dịch</span>
                  <ArrowUpRight className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM FOOTER BAR */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850 flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold">
            {PROVIDER_LABEL[providerName] || "LingoArena Translate"} · tối đa {MAX_CHARS.toLocaleString("en-US")} ký tự
          </span>
          <span className="hidden sm:inline">Phím tắt: Esc để đóng, F11 để toàn màn hình</span>
        </div>
      </div>

      {/* LANGUAGE PICKER MODAL */}
      <TranslateLanguagePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selectedLang={pickerIsSource ? sourceLang : targetLang}
        onSelectLang={(code) => {
          if (pickerIsSource) setSourceLang(code);
          else setTargetLang(code);
        }}
        isSource={pickerIsSource}
      />

      {/* HISTORY DRAWER */}
      <TranslateHistoryDrawer
        isOpen={showHistoryDrawer}
        onClose={() => setShowHistoryDrawer(false)}
        type="history"
      />

      {/* SAVED PHRASES DRAWER */}
      <TranslateHistoryDrawer
        isOpen={showSavedDrawer}
        onClose={() => setShowSavedDrawer(false)}
        type="saved"
      />
    </div>
  );
}
