import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { formatRecordTime } from "@/common/helpers";

interface Language {
  code: string;
  name: string;
  displayName: string;
}

interface TextTabProps {
  isDark: boolean;
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  setTranslatedText: (text: string) => void;
  selectedSource: string;
  selectedTarget: string;
  recentSources: string[];
  recentTargets: string[];
  detectedData: { language?: string } | undefined;
  getLangName: (code: string) => string;
  handleSelectSource: (code: string) => void;
  handleSelectTarget: (code: string) => void;
  handleSwap: () => void;
  isTranslating: boolean;
  isCurrentlySaved: boolean;
  toggleSave: () => void;
  isDictFetching: boolean;
  dictionaryData: any[] | undefined | null;
  showSourcePicker: boolean;
  setShowSourcePicker: (v: boolean) => void;
  showTargetPicker: boolean;
  setShowTargetPicker: (v: boolean) => void;
  searchLang: string;
  setSearchLang: (v: string) => void;
  filteredLanguages: Language[];
  isRecording: boolean;
  recordingSeconds: number;
  volumeBars: number[];
  startRecording: () => void;
  stopRecording: () => void;
}

export function TextTab({
  isDark,
  sourceText,
  setSourceText,
  translatedText,
  setTranslatedText,
  selectedSource,
  selectedTarget,
  recentSources,
  recentTargets,
  detectedData,
  getLangName,
  handleSelectSource,
  handleSelectTarget,
  handleSwap,
  isTranslating,
  isCurrentlySaved,
  toggleSave,
  isDictFetching,
  dictionaryData,
  showSourcePicker,
  setShowSourcePicker,
  showTargetPicker,
  setShowTargetPicker,
  searchLang,
  setSearchLang,
  filteredLanguages,
  isRecording,
  recordingSeconds,
  volumeBars,
  startRecording,
  stopRecording,
}: TextTabProps) {
  const renderLanguagePickerModal = (
    visible: boolean,
    onHide: () => void,
    onSelect: (code: string) => void,
    isSource: boolean,
  ) => (
    <Dialog
      header={isSource ? "Chọn ngôn ngữ nguồn" : "Chọn ngôn ngữ đích"}
      visible={visible}
      onHide={onHide}
      className="w-full max-w-4xl mx-4"
      contentClassName={isDark ? "bg-gray-800 text-white p-0" : "p-0"}
      headerClassName={
        isDark
          ? "bg-gray-800 text-white border-b border-gray-700 p-4"
          : "p-4 border-b"
      }
    >
      <div className={`p-4 border-b ${isDark ? "border-gray-700" : ""}`}>
        <span className="p-input-icon-left w-full relative">
          <IconField iconPosition="left" className="w-full mr-2">
            <InputIcon className="pi pi-search" />
            <InputText
              placeholder="Tìm kiếm ngôn ngữ"
              value={searchLang}
              onChange={(e) => setSearchLang(e.target.value)}
              className={`w-full pl-10 ${isDark ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
          </IconField>
        </span>
      </div>
      <div className="p-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-2 max-h-[60vh] overflow-y-auto">
        {isSource && !searchLang.trim() && (
          <Button
            label="Phát hiện ngôn ngữ"
            text
            className={`w-full! text-sm! justify-start! text-left! px-3! py-2! font-normal! ${isDark ? "hover:bg-gray-700 text-gray-200" : ""}`}
            onClick={() => onSelect("auto")}
          />
        )}
        {filteredLanguages.map((lang) => (
          <Button
            key={lang.code}
            label={lang.displayName}
            text
            className={`w-full! text-sm! justify-start! text-left! px-3! py-2! font-normal! ${isDark ? "hover:bg-gray-700 text-gray-200" : ""}`}
            onClick={() => onSelect(lang.code)}
          />
        ))}
      </div>
    </Dialog>
  );

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex items-stretch h-12">
        {/* Source Languages */}
        <div className="flex items-center flex-1 px-2 overflow-x-auto no-scrollbar">
          {["auto", ...recentSources].map((code) => (
            <button
              key={`src-${code}`}
              onClick={() => handleSelectSource(code)}
              className={`
              h-full px-3 text-sm whitespace-nowrap transition-colors
              ${
                selectedSource === code
                  ? "text-[#1a73e8] font-medium border-b-4 border-[#1a73e8]"
                  : "text-[#444746] border-b-4 border-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }
            `}
            >
              {getLangName(code)}
              {code === "auto" && detectedData?.language && sourceText && (
                <span className="ml-1 opacity-60 text-xs">
                  ({getLangName(detectedData.language)})
                </span>
              )}
            </button>
          ))}
          <button
            onClick={() => setShowSourcePicker(true)}
            className="flex items-center px-2 h-full text-[#444746] hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <i className="pi pi-chevron-down text-xs" />
          </button>
        </div>

        {/* Swap Button */}
        <div className="flex items-center justify-center w-[52px] shrink-0">
          <button
            onClick={handleSwap}
            className="flex items-center justify-center w-9 h-9 rounded-full transition-colors text-[#1a73e8] hover:bg-[#e8f0fe] cursor-pointer"
          >
            <i className="pi pi-arrow-right-arrow-left text-base" />
          </button>
        </div>

        {/* Target Languages */}
        <div className="flex items-center flex-1 px-2 overflow-x-auto no-scrollbar justify-end sm:justify-start">
          {recentTargets.map((code) => (
            <button
              key={`tgt-${code}`}
              onClick={() => handleSelectTarget(code)}
              className={`
              h-full px-3 text-sm whitespace-nowrap transition-colors
              ${
                selectedTarget === code
                  ? "text-[#1a73e8] font-medium border-b-4 border-[#1a73e8]"
                  : "text-[#444746] border-b-4 border-transparent hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              }
            `}
            >
              {getLangName(code)}
            </button>
          ))}
          <button
            onClick={() => setShowTargetPicker(true)}
            className="flex items-center px-2 h-full text-[#444746] hover:bg-gray-100 transition-colors dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <i className="pi pi-chevron-down text-xs" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 md:rounded-xl md:shadow-sm overflow-hidden gap-5">
        {/* Source Panel */}
        <div
          className={`flex flex-col p-4 min-h-[200px] border border-gray-200 rounded-3xl ${isDark ? "bg-gray-800 border-gray-700" : ""}`}
        >
          <div className="flex-1 relative">
            <InputTextarea
              value={sourceText}
              onChange={(e) => {
                setSourceText(e.target.value);
                if (!e.target.value.trim()) setTranslatedText("");
              }}
              placeholder="Nhập văn bản"
              maxLength={5000}
              className={`w-full border-none! shadow-none! text-xl! resize-none! p-1! focus:ring-0! bg-transparent! leading-relaxed! outline-none!`}
              rows={6}
              autoResize={false}
            />
            {sourceText && (
              <Button
                icon="pi pi-times"
                onClick={() => {
                  setSourceText("");
                  setTranslatedText("");
                }}
                title="Xóa văn bản"
                pt={{
                  root: {
                    className: `
                      absolute! top-1! right-1!
                      !border-none !shadow-none !ring-0 !outline-none!
                      !focus:ring-0 !focus:outline-none !focus:border-none!
                      transition-all! duration-300! active:scale-90!
                      w-6! h-6! flex! items-center! justify-center!
                      bg-transparent!
                    `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-2 border-t border-transparent">
            <div className="flex gap-1 relative">
              <Button
                icon={isRecording ? "pi pi-stop-circle" : "pi pi-microphone"}
                rounded
                text
                severity={isRecording ? "danger" : "secondary"}
                className={`w-10 h-10 transition-all ${
                  isRecording
                    ? "text-red-500 animate-pulse"
                    : isDark
                      ? "text-gray-300"
                      : "text-[#444746]"
                }`}
                title={isRecording ? "Dừng ghi âm" : "Nhập bằng giọng nói"}
                onClick={isRecording ? stopRecording : startRecording}
                pt={{
                  root: {
                    className: `
                      !border-none !shadow-none !ring-0 !outline-none 
                      !focus:ring-0 !focus:outline-none !focus:border-none
                      transition-all duration-300 active:scale-90
                      w-10 h-10 flex items-center justify-center
                      bg-transparent
                    `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              {/* Recording Popup */}
              {isRecording && (
                <div
                  className={`absolute bottom-[52px] left-0 z-50 flex flex-col items-center gap-2 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-sm min-w-[200px] ${
                    isDark
                      ? "bg-gray-900/95 border-gray-700 text-gray-100"
                      : "bg-white/95 border-gray-200 text-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-2 w-full justify-center">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                    <span className="text-base font-bold tabular-nums tracking-widest">
                      {formatRecordTime(recordingSeconds)}
                    </span>
                    <span
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Đang ghi...
                    </span>
                  </div>
                  <div className="flex items-end gap-[2px] h-12 w-full justify-center">
                    {volumeBars.map((h, i) => (
                      <div
                        key={i}
                        className="w-[7px] rounded-full transition-all duration-75 bg-linear-to-t from-red-500 via-orange-400 to-yellow-300"
                        style={{ height: `${h}px` }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={stopRecording}
                    className="text-xs text-red-500 hover:underline font-medium mt-0.5"
                  >
                    Dừng ghi âm
                  </button>
                </div>
              )}
              <Button
                icon="pi pi-pencil"
                rounded
                text
                severity="secondary"
                className={`w-10 h-10 ${isDark ? "text-gray-300" : "text-[#444746]"}`}
                title="Nhập bằng chữ viết tay"
                pt={{
                  root: {
                    className: `
                      !border-none !shadow-none !ring-0 !outline-none 
                      !focus:ring-0 !focus:outline-none !focus:border-none
                      transition-all duration-300 active:scale-90
                      w-10 h-10 flex items-center justify-center
                      bg-transparent
                    `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              <Button
                icon="pi pi-copy"
                rounded
                text
                severity="secondary"
                className={`w-10 h-10 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-[#444746] hover:bg-[#e8eaed]"}`}
                onClick={() => navigator.clipboard.writeText(sourceText)}
                pt={{
                  root: {
                    className: `
                !border-none !shadow-none !ring-0 !outline-none 
                !focus:ring-0 !focus:outline-none !focus:border-none
                transition-all duration-300 active:scale-90
                w-10 h-10 flex items-center justify-center
                bg-transparent
              `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
            </div>
            <span className="text-xs text-[#80868b]">
              {sourceText.length} / 5000
            </span>
          </div>
        </div>

        {/* Target Panel */}
        <div
          className={`flex flex-col p-4 min-h-[200px] border border-gray-200 rounded-3xl ${isDark ? "bg-gray-800 border-gray-700" : "bg-gray-50"}`}
        >
          <div
            className={`flex-1! p-1! ${isDark ? "text-white" : "text-[#202124]"} text-xl! leading-relaxed! wrap-break-word! overflow-y-auto!`}
          >
            {isTranslating ? (
              <span className="text-[#9aa0a6] animate-pulse">Đang dịch...</span>
            ) : translatedText ? (
              <span className={isDark ? "text-white" : "text-[#202124]"}>
                {translatedText}
              </span>
            ) : (
              <span className="text-[#9aa0a6] text-xl!">Bản dịch</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-2">
            <div className="flex gap-1">
              <Button
                icon="pi pi-volume-up"
                rounded
                text
                severity="secondary"
                className={`w-10 h-10 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-[#444746] hover:bg-[#e8eaed]"}`}
                pt={{
                  root: {
                    className: `
                      !border-none !shadow-none !ring-0 !outline-none 
                      !focus:ring-0 !focus:outline-none !focus:border-none
                      transition-all duration-300 active:scale-90
                      w-10 h-10 flex items-center justify-center
                      bg-transparent
                    `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              <Button
                icon="pi pi-copy"
                rounded
                text
                severity="secondary"
                className={`w-10 h-10 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-[#444746] hover:bg-[#e8eaed]"}`}
                onClick={() => navigator.clipboard.writeText(translatedText)}
                pt={{
                  root: {
                    className: `
                      !border-none !shadow-none !ring-0 !outline-none 
                      !focus:ring-0 !focus:outline-none !focus:border-none
                      transition-all duration-300 active:scale-90
                      w-10 h-10 flex items-center justify-center
                      bg-transparent
                    `,
                  },
                  icon: {
                    className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                  },
                }}
              />
              {translatedText && (
                <Button
                  icon={
                    isCurrentlySaved
                      ? "pi pi-star-fill text-yellow-500"
                      : "pi pi-star"
                  }
                  rounded
                  text
                  severity="secondary"
                  className={`w-10 h-10 ${isDark ? "text-gray-300 hover:bg-gray-700" : "text-[#444746] hover:bg-[#e8eaed]"}`}
                  onClick={toggleSave}
                  title="Lưu bản dịch"
                  pt={{
                    root: {
                      className: `
                      !border-none !shadow-none !ring-0 !outline-none 
                      !focus:ring-0 !focus:outline-none !focus:border-none
                      transition-all duration-300 active:scale-90
                      w-10 h-10 flex items-center justify-center
                      bg-transparent
                    `,
                    },
                    icon: {
                      className: `text-xl text-cyan-400 opacity-80 group-hover:opacity-100`,
                    },
                  }}
                />
              )}
            </div>
            <span className="text-[11px] text-[#80868b] italic cursor-pointer hover:underline">
              Gửi ý kiến phản hồi
            </span>
          </div>

          {/* Dictionary Results */}
          {isDictFetching ? (
            <div
              className={`mt-4 pt-4 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <span className="text-xs text-gray-500 animate-pulse">
                Đang tra cứu chuyên sâu...
              </span>
            </div>
          ) : (
            dictionaryData &&
            dictionaryData.length > 0 && (
              <div
                className={`mt-4 pt-4 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <h3
                  className={`text-xs font-semibold mb-2 uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Chuyên sâu
                </h3>
                <div className="flex flex-col gap-3">
                  {dictionaryData.map((item: any, idx: number) => (
                    <div key={idx} className="flex flex-col text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#1a73e8] text-base">
                          {item.displayTarget}
                        </span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}
                        >
                          {item.posTag}
                        </span>
                      </div>
                      {item.backTranslations &&
                        item.backTranslations.length > 0 && (
                          <div
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                          >
                            <span className="font-medium mr-1">
                              Đồng nghĩa:
                            </span>
                            {item.backTranslations
                              .map((bt: any) => bt.displayText)
                              .join(", ")}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {renderLanguagePickerModal(
        showSourcePicker,
        () => {
          setShowSourcePicker(false);
          setSearchLang("");
        },
        handleSelectSource,
        true,
      )}

      {renderLanguagePickerModal(
        showTargetPicker,
        () => {
          setShowTargetPicker(false);
          setSearchLang("");
        },
        handleSelectTarget,
        false,
      )}
    </div>
  );
}
