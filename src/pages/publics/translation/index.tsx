import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";
import ISO6391 from "iso-639-1";
import Title from "@/components/ui/Tilte";
import { useTheme } from "@/context";
import {
  useDetectLanguage,
  useSupportedLanguages,
  useTranslateText,
  useDictionaryLookup,
  useHistoryTranslation,
  useSavedTranslationList,
  useToggleSavedTranslation,
} from "@/hooks/translation";
import { useToast } from "@/context/ToastContext";
import { tokenCache } from "@/utils";
import { TextTab } from "./TextTab";
import { ImageTab } from "./ImageTab";
import { DocumentTab } from "./DocumentTab";
import { WebTab } from "./WebTab";

const menuItems = [
  { label: "Văn bản", icon: "pi pi-language" },
  { label: "Hình ảnh", icon: "pi pi-image" },
  { label: "Tài liệu", icon: "pi pi-file" },
  { label: "Trang web", icon: "pi pi-globe" },
];

interface Language {
  code: string;
  name: string;
  displayName: string;
}

const DEFAULT_RECENT_SOURCES = ["vi", "en", "fr"];
const DEFAULT_RECENT_TARGETS = ["en", "vi", "zh"];

export default function TranslationScreen() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceText, setSourceText] = useState<string>("");
  const [translatedText, setTranslatedText] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [volumeBars, setVolumeBars] = useState<number[]>(Array(20).fill(2));
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [showTargetPicker, setShowTargetPicker] = useState(false);
  const [searchLang, setSearchLang] = useState("");

  const [recentSources, setRecentSources] = useState<string[]>(() => {
    const cached = localStorage.getItem("recent_sources");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
    return DEFAULT_RECENT_SOURCES;
  });

  const [recentTargets, setRecentTargets] = useState<string[]>(() => {
    const cached = localStorage.getItem("recent_targets");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    }
    return DEFAULT_RECENT_TARGETS;
  });

  const [selectedSource, setSelectedSource] = useState<string>("auto");
  const [selectedTarget, setSelectedTarget] = useState<string>("en");

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { mutate: translate, isPending: isTranslating } = useTranslateText();
  const { data: detectedData } = useDetectLanguage(sourceText);
  const { data: supportedLangs } = useSupportedLanguages();
  const { showToast } = useToast();

  const [showHistorySidebar, setShowHistorySidebar] = useState(false);
  const [historySearch, setHistorySearch] = useState("");
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  const { mutate: fetchHistory, isPending: isHistoryLoading } =
    useHistoryTranslation();

  useEffect(() => {
    if (showHistorySidebar) {
      if (tokenCache.isAuthenticated()) {
        fetchHistory(
          { skip: 0, take: 100 },
          {
            onSuccess: (data) => {
              if (data?.items) setHistoryItems(data.items);
            },
          },
        );
      }
    }
  }, [showHistorySidebar, fetchHistory]);

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) return historyItems;
    const lower = historySearch.toLowerCase();
    return historyItems.filter(
      (item) =>
        item.originalText?.toLowerCase().includes(lower) ||
        item.translatedText?.toLowerCase().includes(lower),
    );
  }, [historyItems, historySearch]);

  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [savedSearch, setSavedSearch] = useState("");

  const { mutate: fetchSavedItems, isPending: isSavedLoading } =
    useSavedTranslationList();
  const { mutate: toggleSavedTranslationMutation, isPending: isSaving } =
    useToggleSavedTranslation();

  const loadSavedItems = useCallback(() => {
    if (!tokenCache.isAuthenticated()) return;
    fetchSavedItems(
      { skip: 0, take: 100 },
      {
        onSuccess: (data) => {
          if (data?.items) setSavedItems(data.items);
        },
      },
    );
  }, [fetchSavedItems]);

  useEffect(() => {
    if (showSavedModal) {
      if (tokenCache.isAuthenticated()) {
        loadSavedItems();
      }
    }
  }, [showSavedModal, fetchSavedItems, loadSavedItems]);

  const filteredSavedItems = useMemo(() => {
    if (!savedSearch.trim()) return savedItems;
    const lower = savedSearch.toLowerCase();
    return savedItems.filter(
      (item) =>
        item.originalText?.toLowerCase().includes(lower) ||
        item.translatedText?.toLowerCase().includes(lower),
    );
  }, [savedItems, savedSearch]);

  const isCurrentlySaved = useMemo(() => {
    if (!sourceText || !translatedText) return false;
    return savedItems.some(
      (item) =>
        item.originalText === sourceText &&
        item.translatedText === translatedText,
    );
  }, [sourceText, translatedText, savedItems]);

  const toggleSave = () => {
    if (!tokenCache.isAuthenticated()) {
      showToast({
        type: "warn",
        title: "Cảnh báo",
        message: "Vui lòng đăng nhập để lưu từ vựng",
      });
      return;
    }
    if (!sourceText || !translatedText || isSaving || isSavedLoading) return;

    toggleSavedTranslationMutation(
      {
        originalText: sourceText,
        translatedText: translatedText,
        fromLanguage:
          selectedSource === "auto"
            ? detectedData?.language || "auto"
            : selectedSource,
        toLanguage: selectedTarget,
        dictionaryData: dictionaryData || null,
      },
      {
        onSuccess: (res) => {
          if (res.success) {
            showToast({
              type: "success",
              title: "Thành công",
              message: res.isSaved ? "Đã lưu bản dịch" : "Đã bỏ lưu bản dịch",
            });
            if (res.isSaved && res.item) {
              setSavedItems([res.item, ...savedItems]);
            } else {
              setSavedItems(
                savedItems.filter(
                  (i) =>
                    !(
                      i.originalText === sourceText &&
                      i.translatedText === translatedText
                    ),
                ),
              );
            }
          }
        },
        onError: () => {
          showToast({
            type: "error",
            title: "Lỗi",
            message: "Có lỗi xảy ra khi lưu từ vựng",
          });
        },
      },
    );
  };

  useEffect(() => {
    if (
      tokenCache.isAuthenticated() &&
      sourceText &&
      translatedText &&
      savedItems.length === 0
    ) {
      loadSavedItems();
    }
  }, [loadSavedItems, savedItems.length, sourceText, translatedText]);

  const lookupFrom =
    selectedSource === "auto" ? detectedData?.language : selectedSource;
  const isShortText =
    sourceText.trim().length > 0 && sourceText.trim().split(/\s+/).length <= 3;
  const { data: dictionaryData, isFetching: isDictFetching } =
    useDictionaryLookup(sourceText.trim(), lookupFrom || "", selectedTarget, {
      enabled: isShortText && !!lookupFrom,
    });

  const allLanguages = useMemo<Language[]>(() => {
    if (supportedLangs && typeof supportedLangs === "object") {
      const vals = Object.values(supportedLangs) as any[];
      if (vals.length > 0 && vals[0] && typeof vals[0] === "object" && "code" in vals[0]) {
        return vals.map((lang: any) => ({
          code: lang.code,
          name: lang.nativeName || lang.name,
          displayName: lang.displayName || lang.nativeName || lang.name,
        }));
      }
    }
    return ISO6391.getAllCodes().map((code) => ({
      code,
      name: ISO6391.getNativeName(code),
      displayName: ISO6391.getNativeName(code),
    }));
  }, [supportedLangs]);

  const getLangName = (code: string) => {
    if (!code) return "";
    if (code === "auto") return "Phát hiện ngôn ngữ";
    const found =
      allLanguages.find((l) => l.code === code) ||
      allLanguages.find((l) => l?.code?.startsWith(code));
    if (found) return found.name || found.displayName;
    return ISO6391.getNativeName(code) || code;
  };

  const handleSelectSource = (code: string) => {
    setSelectedSource(code);
    setShowSourcePicker(false);
    setSearchLang("");
    if (code !== "auto") {
      const updated = [code, ...recentSources.filter((c) => c !== code)].slice(0, 3);
      setRecentSources(updated);
      localStorage.setItem("recent_sources", JSON.stringify(updated));
    }
  };

  const handleSelectTarget = (code: string) => {
    setSelectedTarget(code);
    setShowTargetPicker(false);
    setSearchLang("");
    const updated = [code, ...recentTargets.filter((c) => c !== code)].slice(0, 3);
    setRecentTargets(updated);
    localStorage.setItem("recent_targets", JSON.stringify(updated));
  };

  const handleSwap = () => {
    let tempSrc = selectedSource;
    if (tempSrc === "auto") {
      tempSrc = detectedData?.language || recentSources[0] || "vi";
    }
    const tempTgt = selectedTarget;
    handleSelectSource(tempTgt);
    handleSelectTarget(tempSrc);
    const newSourceText = translatedText;
    setSourceText(newSourceText);
    if (!newSourceText.trim()) setTranslatedText("");
  };

  useEffect(() => {
    const actualSource =
      selectedSource === "auto" ? detectedData?.language : selectedSource;
    if (actualSource && actualSource === selectedTarget) {
      const newTarget = actualSource === "vi" ? "en" : "vi";
      setTimeout(() => {
        setSelectedTarget(newTarget);
        setRecentTargets((prev) => {
          const updated = [newTarget, ...prev.filter((c) => c !== newTarget)].slice(0, 3);
          localStorage.setItem("recent_targets", JSON.stringify(updated));
          return updated;
        });
      }, 0);
    }
  }, [detectedData?.language, selectedSource, selectedTarget]);

  useEffect(() => {
    if (!sourceText.trim()) return;
    const delayDebounceFn = setTimeout(() => {
      translate(
        {
          text: sourceText,
          from: selectedSource === "auto" ? undefined : selectedSource,
          to: selectedTarget,
        },
        {
          onSuccess: (data) => {
            setTranslatedText(data.translatedText);
          },
          onError: () => {
            setTranslatedText("Có lỗi xảy ra khi dịch.");
          },
        },
      );
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [sourceText, selectedSource, selectedTarget, translate]);

  const playBeep = (freq: number, duration: number) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
      osc.onended = () => ctx.close();
    } catch (error) {
      console.error("Error playing beep:", error);
    }
  };

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyserRef.current = analyser;
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(dataArray);
        const bars = Array.from({ length: 20 }, (_, i) => {
          const idx = Math.floor((i / 20) * dataArray.length);
          return Math.max(4, (dataArray[idx] / 255) * 48);
        });
        setVolumeBars(bars);
        animFrameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (error) {
      console.error("Error starting visualizer:", error);
    }
  };

  const stopVisualizer = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (micStreamRef.current)
      micStreamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    animFrameRef.current = null;
    micStreamRef.current = null;
    audioContextRef.current = null;
    setVolumeBars(Array(20).fill(2));
  };

  const startRecording = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast({
        type: "error",
        title: "Không hỗ trợ",
        message: "Trình duyệt không hỗ trợ nhận giọng nói",
      });
      return;
    }
    playBeep(440, 0.12);
    setTimeout(() => playBeep(660, 0.15), 140);
    const recognition = new SpeechRecognition();
    recognition.lang =
      selectedSource === "auto" ? detectedData?.language || "vi-VN" : selectedSource;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => {
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
      startVisualizer();
    };
    recognition.onend = () => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopVisualizer();
    };
    recognition.onerror = () => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      stopVisualizer();
    };
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++)
        transcript += event.results[i][0].transcript;
      setSourceText(transcript);
    };
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopRecording = () => {
    playBeep(660, 0.12);
    setTimeout(() => playBeep(440, 0.15), 140);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopVisualizer();
    setIsRecording(false);
  };

  const filteredLanguages = useMemo(() => {
    if (!searchLang.trim()) return allLanguages;
    const lowerSearch = searchLang.toLowerCase();
    return allLanguages.filter(
      (l) =>
        (l.displayName || l.name).toLowerCase().includes(lowerSearch) ||
        l.code.toLowerCase().includes(lowerSearch),
    );
  }, [allLanguages, searchLang]);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <Title className={`text-center ${isDark ? "text-white" : "text-[#202124]"}`}>
          Hỗ trợ bạn dịch thuật chuẩn nhất
        </Title>

        <div className="flex flex-wrap items-center gap-2 mb-6 py-4">
          {menuItems.map((item, index) => (
            <Button
              key={item.label}
              label={item.label}
              icon={item.icon}
              onClick={() => {
                setActiveTabIndex(index);
                setUploadedFile(null);
              }}
              text={activeTabIndex !== index}
              outlined={activeTabIndex === index}
              className={`px-4 py-2 text-sm font-medium transition-all shadow-none ${isDark && activeTabIndex !== index ? "text-gray-300" : ""}`}
              rounded
              size="small"
            />
          ))}
        </div>

        <div className="transition-all duration-300">
          {activeTabIndex === 0 && (
            <TextTab
              isDark={isDark}
              sourceText={sourceText}
              setSourceText={setSourceText}
              translatedText={translatedText}
              setTranslatedText={setTranslatedText}
              selectedSource={selectedSource}
              selectedTarget={selectedTarget}
              recentSources={recentSources}
              recentTargets={recentTargets}
              detectedData={detectedData}
              getLangName={getLangName}
              handleSelectSource={handleSelectSource}
              handleSelectTarget={handleSelectTarget}
              handleSwap={handleSwap}
              isTranslating={isTranslating}
              isCurrentlySaved={isCurrentlySaved}
              toggleSave={toggleSave}
              isDictFetching={isDictFetching}
              dictionaryData={dictionaryData}
              showSourcePicker={showSourcePicker}
              setShowSourcePicker={setShowSourcePicker}
              showTargetPicker={showTargetPicker}
              setShowTargetPicker={setShowTargetPicker}
              searchLang={searchLang}
              setSearchLang={setSearchLang}
              filteredLanguages={filteredLanguages}
              isRecording={isRecording}
              recordingSeconds={recordingSeconds}
              volumeBars={volumeBars}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
          )}
          {activeTabIndex === 1 && (
            <ImageTab
              isDark={isDark}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          )}
          {activeTabIndex === 2 && (
            <DocumentTab
              isDark={isDark}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          )}
          {activeTabIndex === 3 && (
            <WebTab isDark={isDark} url={url} setUrl={setUrl} />
          )}
        </div>

        {/* Footer Buttons */}
        <div className="max-w-md mx-auto mt-12 flex justify-around">
          {[
            { label: "Nhật ký", icon: "pi pi-history" },
            { label: "Đã lưu", icon: "pi pi-star" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => {
                if (item.label === "Nhật ký") {
                  if (!tokenCache.isAuthenticated()) {
                    showToast({
                      type: "warn",
                      title: "Cảnh báo",
                      message: "Vui lòng đăng nhập để xem nhật ký",
                    });
                    return;
                  }
                  setShowHistorySidebar(true);
                }
                if (item.label === "Đã lưu") {
                  if (!tokenCache.isAuthenticated()) {
                    showToast({
                      type: "warn",
                      title: "Cảnh báo",
                      message: "Vui lòng đăng nhập để xem từ đã lưu",
                    });
                    return;
                  }
                  setShowSavedModal(true);
                }
              }}
            >
              <Button
                icon={item.icon}
                rounded
                outlined
                severity="secondary"
                className={`mb-2 w-14 h-14 ${isDark ? "text-gray-300 border-gray-600" : ""}`}
              />
              <span className={`text-xs mt-2 font-medium opacity-70 ${isDark ? "text-gray-300" : ""}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* History Sidebar */}
      <Sidebar
        visible={showHistorySidebar}
        position="right"
        onHide={() => setShowHistorySidebar(false)}
        className={`w-full md:w-[400px] ${isDark ? "bg-gray-800 text-white" : ""}`}
        header={
          <h2 className={`text-xl font-semibold ${isDark ? "text-white" : ""}`}>
            Nhật ký dịch thuật
          </h2>
        }
      >
        <div className="flex flex-col h-full">
          <span className="p-input-icon-left w-full mb-4 mt-2">
            <i className="pi pi-search" />
            <InputText
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              placeholder="Tìm kiếm nhật ký"
              className={`w-full ${isDark ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
          </span>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {isHistoryLoading ? (
              <div className="flex justify-center p-4">
                <i className="pi pi-spin pi-spinner text-2xl text-[#1a73e8]" />
              </div>
            ) : filteredHistory.length > 0 ? (
              <div className="flex flex-col gap-3">
                {filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3 border rounded-xl cursor-pointer transition ${
                      isDark
                        ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setSourceText(item.originalText);
                      setTranslatedText(item.translatedText);
                      if (item.fromLanguage && item.fromLanguage !== "auto")
                        handleSelectSource(item.fromLanguage);
                      if (item.toLanguage && item.toLanguage !== "auto")
                        handleSelectTarget(item.toLanguage);
                      setShowHistorySidebar(false);
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2 justify-between text-xs opacity-70">
                      <span>
                        {(item.fromLanguage || "auto").toUpperCase()} &rarr;{" "}
                        {(item.toLanguage || "").toUpperCase()}
                      </span>
                      {item.createdAt && (
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      )}
                    </div>
                    <div className={`font-medium mb-1 line-clamp-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {item.originalText}
                    </div>
                    <div className={`text-sm line-clamp-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {item.translatedText}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center opacity-50 mt-10">
                Không tìm thấy lịch sử nào.
              </div>
            )}
          </div>
        </div>
      </Sidebar>

      {/* Saved Sidebar */}
      <Sidebar
        visible={showSavedModal}
        position="right"
        onHide={() => setShowSavedModal(false)}
        className={`w-full md:w-[450px] ${isDark ? "bg-gray-800 text-white" : ""}`}
        header={
          <h2 className={`text-xl font-semibold flex items-center gap-2 ${isDark ? "text-white" : ""}`}>
            <i className="pi pi-star-fill text-yellow-500" /> Bản dịch đã lưu
          </h2>
        }
      >
        <div className="flex flex-col h-full">
          <span className="p-input-icon-left w-full mb-4 mt-2 relative">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2" />
            <InputText
              value={savedSearch}
              onChange={(e) => setSavedSearch(e.target.value)}
              placeholder="Tìm kiếm mục đã lưu"
              className={`w-full pl-10 ${isDark ? "bg-gray-700 text-white border-gray-600" : ""}`}
            />
          </span>

          <div className="flex-1 overflow-y-auto pr-2 pb-4">
            {filteredSavedItems.length > 0 ? (
              <div className="flex flex-col gap-4">
                {filteredSavedItems.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-xl transition ${
                      isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-3 justify-between text-xs opacity-70">
                      <span>
                        {(item.fromLanguage || "auto").toUpperCase()} &rarr;{" "}
                        {(item.toLanguage || "").toUpperCase()}
                      </span>
                      <div className="flex items-center gap-2">
                        {item.createdAt && (
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        )}
                        <Button
                          icon="pi pi-star-fill"
                          className="p-0 text-yellow-500 w-6 h-6 hover:bg-transparent"
                          text
                          disabled={isSaving}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSavedTranslationMutation(
                              {
                                originalText: item.originalText,
                                translatedText: item.translatedText,
                                toLanguage: item.toLanguage,
                              },
                              {
                                onSuccess: (res) => {
                                  if (res.success && res.isSaved === false) {
                                    setSavedItems(savedItems.filter((s) => s.id !== item.id));
                                  }
                                },
                              },
                            );
                          }}
                          title="Bỏ lưu"
                        />
                      </div>
                    </div>
                    <div className={`font-medium mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
                      {item.originalText}
                    </div>
                    <div className={`text-base mb-3 ${isDark ? "text-[#8ab4f8]" : "text-[#1a73e8]"}`}>
                      {item.translatedText}
                    </div>

                    {item.dictionaryData && item.dictionaryData.length > 0 && (
                      <div
                        className={`mt-3 pt-3 border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-300"}`}
                      >
                        <h4 className={`text-xs font-semibold mb-2 uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          Chuyên sâu
                        </h4>
                        <div className="flex flex-col gap-2">
                          {item.dictionaryData.map((dict: any, idx: number) => (
                            <div key={idx} className="flex flex-col text-sm">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`font-medium ${isDark ? "text-white" : "text-black"}`}>
                                  {dict.displayTarget}
                                </span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                                  {dict.posTag}
                                </span>
                              </div>
                              {dict.backTranslations && dict.backTranslations.length > 0 && (
                                <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                  {dict.backTranslations.map((bt: any) => bt.displayText).join(", ")}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center opacity-50 mt-10">
                Chưa có mục nào được lưu.
              </div>
            )}
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
