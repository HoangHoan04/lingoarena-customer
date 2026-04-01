import { GoogleTranslateIcon } from "@/assets/icons";
import React, { useRef, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES } from "@/routes/routes";

export default function TranslationButton() {
  const router = useRouter();
  const op = useRef<OverlayPanel>(null);
  const [sourceLang, setSourceLang] = useState("Tiếng Việt");
  const [targetLang, setTargetLang] = useState("Tiếng Anh");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const recentLangsSource = ["Tiếng Việt", "Tiếng Anh", "Tiếng Pháp"];
  const recentLangsTarget = ["Tiếng Anh", "Tiếng Nhật", "Tiếng Hàn"];

  // Logic đếm từ (Word Count)
  const getWordCount = (text: string) => {
    const trimmedText = text.trim();
    return trimmedText === "" ? 0 : trimmedText.split(/\s+/).length;
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setSourceText(val);
    setTranslatedText(val ? `[Bản dịch]: ${val}` : "");
  };

  const swapLanguages = () => {
    const tempLang = sourceLang;
    setSourceLang(targetLang);
    setTargetLang(tempLang);

    const tempText = sourceText;
    setSourceText(translatedText);
    setTranslatedText(tempText);
  };

  const speak = (text: string) => {
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex items-center w-fit">
      <Tooltip target=".translate-btn" position="bottom" />
      <button
        className="translate-btn w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-110 active:scale-90 hover:bg-black/5 dark:hover:bg-white/10"
        onClick={(e) => op.current?.toggle(e)}
        data-pr-tooltip="Dịch thuật nhanh"
      >
        <img
          src={GoogleTranslateIcon}
          alt="Translate"
          className="w-7 h-7 object-contain"
        />
      </button>

      <OverlayPanel
        ref={op}
        className="w-[400px] md:w-[500px] shadow-2xl border-none rounded-2xl overflow-hidden"
      >
        <div className="p-3 space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {recentLangsSource.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSourceLang(lang)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      sourceLang === lang
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 dark:bg-white/5 opacity-60"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* NÚT SWAP GIỮA HAI Ô */}
              <div className="flex justify-center -my-2 relative z-10">
                <Button
                  icon="pi pi-sort-alt"
                  onClick={swapLanguages}
                  pt={{
                    root: {
                      className: `
                            !border-none !shadow-none !ring-0 !outline-none 
                            !focus:ring-0 !focus:outline-none !focus:border-none
                            transition-all duration-300 active:scale-90
                            w-10 h-10 flex items-center justify-center !bg-transparent
                        `,
                    },
                    icon: {
                      className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                    },
                  }}
                />
              </div>
            </div>

            <div className="relative group">
              <InputTextarea
                value={sourceText}
                onChange={handleSourceChange}
                placeholder={`Nhập ${sourceLang}...`}
                className="w-full min-h-[110px] p-4 pb-10 border-none shadow-none bg-slate-50 dark:bg-white/5 rounded-2xl resize-none text-sm focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
              {sourceText && (
                <button
                  onClick={() => setSourceText("")}
                  className="absolute top-3 right-3 opacity-30 hover:opacity-100"
                >
                  <i className="pi pi-times-circle text-sm"></i>
                </button>
              )}
              {/* Toolbar cho ô Nguồn */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <div className="flex gap-1 pointer-events-auto">
                  <Button
                    icon="pi pi-volume-up"
                    className="p-button-text p-button-sm p-0 w-7 h-7 opacity-50 hover:opacity-100"
                    onClick={() => speak(sourceText)}
                  />
                  <Button
                    icon="pi pi-copy"
                    className="p-button-text p-button-sm p-0 w-7 h-7 opacity-50 hover:opacity-100"
                    onClick={() => navigator.clipboard.writeText(sourceText)}
                  />
                </div>
                <span className="text-[10px] opacity-30 font-bold uppercase tracking-tighter">
                  {getWordCount(sourceText)} words
                </span>
              </div>
            </div>
          </div>

          {/* --- KHỐI ĐÍCH (TARGET) --- */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {recentLangsTarget.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setTargetLang(lang)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      targetLang === lang
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-white/5 opacity-60"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
              <span className="text-[9px] font-black opacity-30 uppercase tracking-widest">
                Bản dịch
              </span>
            </div>

            <div className="p-4 bg-blue-500/5 dark:bg-blue-400/10 rounded-2xl min-h-[100px] flex flex-col justify-between">
              <p className="text-sm font-medium leading-relaxed">
                {translatedText || (
                  <span className="opacity-20 italic">Chờ nhập văn bản...</span>
                )}
              </p>
              {translatedText && (
                <div className="flex gap-1 mt-3">
                  <Button
                    icon="pi pi-volume-up"
                    className="p-button-text p-button-sm p-0 w-7 h-7 text-blue-500"
                    onClick={() => speak(translatedText)}
                  />
                  <Button
                    icon="pi pi-copy"
                    className="p-button-text p-button-sm p-0 w-7 h-7 text-blue-500"
                    onClick={() =>
                      navigator.clipboard.writeText(translatedText)
                    }
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 flex flex-col gap-2">
            <Button
              onClick={() =>
                router.push(PUBLIC_ROUTES.TRANSLATE || "/translate")
              }
              label="LingoArena Dịch thuật"
              className="w-full p-button-text p-button-sm"
              pt={{
                root: {
                  className: `
                            !shadow-none
                            transition-all duration-300
                            flex items-center justify-center !bg-transparent
                        `,
                },
              }}
              icon="pi pi-external-link"
            />
          </div>
        </div>
      </OverlayPanel>
    </div>
  );
}
