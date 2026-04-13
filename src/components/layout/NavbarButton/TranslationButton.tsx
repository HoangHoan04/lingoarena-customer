import { useRef, useState, useEffect, useMemo } from "react";
import { GoogleTranslateIcon } from "@/assets/icons";
import { countWords } from "@/common/helpers";
import {
  useDetectLanguage,
  useTranslateText,
  useSupportedLanguages,
} from "@/hooks/translation";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { OverlayPanel } from "primereact/overlaypanel";
import { Tooltip } from "primereact/tooltip";
import { Dropdown } from "primereact/dropdown";
import { useTheme } from "@/context";
import { Link } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/routes";

export default function TranslationButton() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const op = useRef<OverlayPanel>(null);
  const currentYear = new Date().getFullYear();

  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("vi");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const { data: allLanguages } = useSupportedLanguages();
  const { mutate: translate, isPending } = useTranslateText();
  const { data: detectedData } = useDetectLanguage(sourceText);

  const languageOptions = useMemo(() => {
    if (!allLanguages) return [];
    return Object.values(allLanguages)
      .map((lang: any) => ({
        label: lang.displayName,
        name: lang.name,
        code: lang.code,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allLanguages]);

  const currentSourceLabel = useMemo(() => {
    if (sourceLang === "") return "Tự động";
    return (
      languageOptions.find((l) => l.code === sourceLang)?.name || sourceLang
    );
  }, [sourceLang, languageOptions]);

  const currentTargetLabel = useMemo(() => {
    return (
      languageOptions.find((l) => l.code === targetLang)?.name || targetLang
    );
  }, [targetLang, languageOptions]);

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
            from: sourceLang || undefined,
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
    const effectiveSource = sourceLang || detectedData?.language;
    if (!effectiveSource) return;
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

  return (
    <div className="flex items-center w-fit">
      <Tooltip
        target=".translate-btn"
        position="bottom"
        content="Dịch thuật nhanh"
      />
      <button
        className={`translate-btn w-9 h-9 flex items-center justify-center rounded-lg transition-all active:scale-95 ${
          isDark ? "hover:bg-white/10" : "hover:bg-black/5"
        }`}
        onClick={(e) => op.current?.toggle(e)}
      >
        <img src={GoogleTranslateIcon} alt="Translate" className="w-5 h-5" />
      </button>

      <OverlayPanel
        ref={op}
        className={`w-[380px] md:w-[450px] shadow-2xl border-none rounded-2xl overflow-hidden ${
          isDark ? "bg-[#1a1a1a] text-white" : "bg-white text-slate-900"
        }`}
        style={{
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <div className="p-3 space-y-3">
          {/* SOURCE SECTION */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setSourceLang("")}
                  className={`px-2.5 py-1.5 w-full! rounded-md text-xs font-bold transition-all ${
                    sourceLang === ""
                      ? "bg-indigo-600 text-white shadow-md"
                      : isDark
                        ? "bg-white/5 text-slate-400"
                        : "bg-slate-100 text-slate-500"
                  }`}
                >
                  Phát hiện{" "}
                  {detectedData?.language && `(${detectedData.language})`}
                </button>
                <div className={`h-3 w-px bg-gray-300`}></div>
                <Dropdown
                  value={sourceLang}
                  options={languageOptions}
                  onChange={(e) => setSourceLang(e.value)}
                  optionLabel="label"
                  optionValue="code"
                  filter
                  placeholder={currentSourceLabel}
                  className={`h-7 border-none rounded-md w-32 flex items-center ${
                    isDark
                      ? "bg-white/5 text-white"
                      : "bg-slate-50 text-slate-900"
                  }`}
                  panelClassName={`text-xs! ${isDark ? "bg-[#1a1a1a] text-white border-white/10" : "bg-white"}`}
                  pt={{
                    input: {
                      className:
                        "text-xs! p-0 flex items-center font-semibold w-full!",
                    },
                    trigger: { className: "w-6" },
                    item: {
                      className: `text-xs! py-1 px-2 ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`,
                    },
                    filterInput: {
                      className: `text-xs! p-1 ${isDark ? "bg-white/5 text-white" : "bg-slate-50"}`,
                    },
                    root: { className: "w-full!" },
                  }}
                />
              </div>

              <Button
                icon="pi pi-sort-alt"
                onClick={swapLanguages}
                className={`p-0! w-7! h-7! bg-transparent! text-cyan-500! border-none! transition-transform ${
                  isDark ? " hover:bg-white/5" : " hover:bg-slate-100"
                }`}
              />
            </div>

            <div className="relative group">
              <InputTextarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Nhập nội dung..."
                className={`w-full min-h-24! p-3 border-none rounded-xl text-[13px] transition-all resize-none ${
                  isDark
                    ? "bg-black/20 text-white placeholder:text-slate-600"
                    : "bg-slate-50 text-slate-900 placeholder:text-slate-400"
                }`}
                pt={{
                  root: {
                    className: "w-full! min-h-24!",
                  },
                }}
              />
              <div className="absolute bottom-2 right-3 text-[9px] font-bold opacity-20">
                {countWords(sourceText)}
              </div>
            </div>
          </div>

          {/* TARGET SECTION */}
          <div
            className={`space-y-2 border-t pt-3 ${isDark ? "border-white/5" : "border-slate-100"}`}
          >
            <div className="flex items-center">
              <Dropdown
                value={targetLang}
                options={languageOptions}
                onChange={(e) => setTargetLang(e.value)}
                optionLabel="label"
                optionValue="code"
                filter
                placeholder={currentTargetLabel}
                className={`h-7 text-xs border-none rounded-md w-36 flex items-center font-bold ${
                  isDark
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "bg-indigo-50 text-indigo-600"
                }`}
                panelClassName={`text-xs ${isDark ? "bg-[#1a1a1a] text-white border-white/10" : "bg-white"}`}
                pt={{
                  input: {
                    className:
                      "text-xs! p-0 flex items-center font-semibold w-full!",
                  },
                  item: {
                    className: `text-xs! py-1 px-2 ${isDark ? "hover:bg-white/10" : "hover:bg-slate-100"}`,
                  },
                }}
              />
            </div>

            <div
              className={`p-3 rounded-xl min-h-[80px] relative border ${
                isDark
                  ? "bg-indigo-500/5 border-indigo-500/10"
                  : "bg-slate-50/50 border-slate-100"
              }`}
            >
              {isPending && (
                <div
                  className={`absolute inset-0 flex items-center justify-center rounded-xl z-10 ${
                    isDark ? "bg-black/40" : "bg-white/60"
                  }`}
                >
                  <i className="pi pi-spin pi-spinner text-indigo-500 text-sm" />
                </div>
              )}

              <p
                className={`text-[13px] min-h-[90px] font-medium leading-normal ${
                  isDark ? "text-slate-200" : "text-slate-700"
                }`}
              >
                {translatedText || (
                  <span
                    className={`opacity-20 italic font-normal ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Kết quả...
                  </span>
                )}
              </p>

              {translatedText && (
                <div
                  className={`flex gap-1.5 mt-3 pt-2 border-t ${isDark ? "border-white/5" : "border-slate-200/20"}`}
                >
                  <Button
                    icon="pi pi-volume-up"
                    onClick={() => speak(translatedText, targetLang)}
                    className="p-0! w-8! h-8! bg-transparent! border-none! shadow-none active:scale-90"
                    pt={{
                      icon: {
                        className: `text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`,
                      },
                    }}
                  />
                  <Button
                    icon="pi pi-copy"
                    onClick={() =>
                      navigator.clipboard.writeText(translatedText)
                    }
                    className="p-0! w-8! h-8! bg-transparent! border-none! shadow-none active:scale-90"
                    pt={{
                      icon: {
                        className: `text-lg ${isDark ? "text-cyan-400" : "text-cyan-600"}`,
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <Link
          to={PUBLIC_ROUTES.TRANSLATION}
          className={`group p-0! w-full! h-7! bg-transparent! flex justify-end items-end text-cyan-500! border-none! transition-all ${
            isDark ? " hover:bg-white/5" : " hover:bg-slate-100"
          }`}
        >
          <span className="transition-all text-xs font-bold flex justify-end items-end duration-300 group-hover:translate-x-1 hover:underline underline-offset-4 decoration-cyan-500/50">
            © {currentYear} LingoArena Translate
          </span>
        </Link>
      </OverlayPanel>
    </div>
  );
}
