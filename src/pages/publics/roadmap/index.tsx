import { useTheme } from "@/context";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRoadmapAI } from "@/hooks/chatbot-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";

export default function RoadMapScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [roadmapText, setRoadmapText] = useState("");

  const [formData, setFormData] = useState({
    cert: "IELTS",
    target: "",
    weakness: [] as string[],
    timeframe: 3,
  });

  const { generateRoadmap } = useRoadmapAI();

  const handleGenerate = async () => {
    setLoading(true);
    setRoadmapText("");
    setActiveStep(1);

    await generateRoadmap(
      formData,
      (chunk) => {
        setLoading(false);
        setRoadmapText((prev) => prev + chunk);
      },
      () => {
        setLoading(false);
      },
      (error) => {
        setLoading(false);
        console.error("Roadmap generation error:", error);
      },
    );
  };

  return (
    <div
      className={`min-h-screen py-12 px-4 transition-colors duration-500 ${isDark ? "bg-[#0f172a] text-slate-100" : "bg-[#f8fafc] text-slate-900"}`}
    >
      <div className="max-w-5xl mx-auto">
        {loading ? (
          <LoadingState isDark={isDark} />
        ) : (
          /* Sử dụng prop value để điều khiển bước của PrimeReact Stepper */
          <Stepper activeStep={activeStep} linear={true}>
            {/* BƯỚC 1: NHẬP LIỆU */}
            <StepperPanel header="Thông tin mục tiêu">
              <div className="flex flex-col pt-10">
                <div
                  className={`p-8 md:p-12 rounded-[3rem] border shadow-xl ${isDark ? "bg-slate-800/40 border-white/5" : "bg-white border-slate-200"}`}
                >
                  <h2 className="text-2xl font-black mb-6 text-center">
                    Thiết kế lộ trình AI
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase opacity-50">
                        Chứng chỉ
                      </label>
                      <Dropdown
                        value={formData.cert}
                        options={["IELTS", "TOEIC", "APTIS", "VSTEP"]}
                        onChange={(e) =>
                          setFormData({ ...formData, cert: e.value })
                        }
                        className="w-full rounded-xl"
                      />

                      <label className="text-xs font-bold uppercase opacity-50 mt-4 block">
                        Điểm mục tiêu
                      </label>
                      <InputText
                        value={formData.target}
                        onChange={(e) =>
                          setFormData({ ...formData, target: e.target.value })
                        }
                        placeholder="7.5"
                        className="w-full p-3 rounded-xl"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-xs font-bold uppercase opacity-50">
                        Kỹ năng yếu
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Listening", "Speaking", "Reading", "Writing"].map(
                          (s) => (
                            <Button
                              key={s}
                              label={s}
                              text={!formData.weakness.includes(s)}
                              onClick={() => {
                                const current = formData.weakness;
                                setFormData({
                                  ...formData,
                                  weakness: current.includes(s)
                                    ? current.filter((i) => i !== s)
                                    : [...current, s],
                                });
                              }}
                              className={`p-button-sm rounded-lg ${formData.weakness.includes(s) ? "p-button-primary" : "p-button-secondary"}`}
                            />
                          ),
                        )}
                      </div>
                      <label className="text-xs font-bold uppercase opacity-50 mt-4 block">
                        Thời gian (tháng)
                      </label>
                      <InputText
                        type="number"
                        value={formData.timeframe.toString()}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeframe: parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="3"
                        className="w-full p-3 rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="mt-10 flex justify-center">
                    <Button
                      label="Khởi tạo lộ trình"
                      icon="pi pi-bolt"
                      className="px-10 py-4 rounded-2xl font-black shadow-lg"
                      onClick={handleGenerate}
                    />
                  </div>
                </div>
              </div>
            </StepperPanel>

            {/* BƯỚC 2: KẾT QUẢ AI */}
            <StepperPanel header="Lộ trình AI">
              <div className="flex flex-col pt-10">
                <div
                  className={`p-8 md:p-12 rounded-[3rem] border shadow-xl ${isDark ? "bg-slate-800/40 border-white/5" : "bg-white border-slate-200"}`}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-bold">Lộ trình 3 giai đoạn</h3>
                    <Badge value={`${formData.cert} Target`} severity="info" />
                  </div>

                  <div
                    className={`prose prose-sm max-w-none ${isDark ? "prose-invert" : ""}`}
                  >
                    {roadmapText ? (
                      <div className="space-y-12">
                        {/* Visual Flow Diagram / Summary */}
                        <div className="bg-blue-500/5 rounded-4xl p-6 mb-12 border border-blue-500/10 shadow-inner">
                          <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0 -translate-y-1/2" />

                            {[1, 2, 3].map((step) => {
                              // Try to find phase name in text
                              const phaseMatch = roadmapText.match(
                                new RegExp(`PHASE ${step}: ([^\\n#]+)`, "i"),
                              );
                              const phaseName = phaseMatch
                                ? phaseMatch[1].trim()
                                : `Giai đoạn ${step}`;

                              return (
                                <div
                                  key={step}
                                  className="relative z-10 flex flex-col items-center group w-full md:w-1/3"
                                >
                                  <div
                                    className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-all duration-500 ${roadmapText.includes(`PHASE ${step}`) ? "bg-blue-500 text-white scale-110" : "bg-slate-200 dark:bg-white/10 text-slate-400 opacity-50"}`}
                                  >
                                    <span className="text-xl font-black">
                                      {step}
                                    </span>
                                    {/* Pulse effect for active phase */}
                                    {roadmapText.includes(`PHASE ${step}`) &&
                                      !roadmapText.includes(
                                        `PHASE ${step + 1}`,
                                      ) && (
                                        <div className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-25" />
                                      )}
                                  </div>
                                  <p
                                    className={`mt-4 text-[13px] font-bold text-center px-4 line-clamp-2 transition-opacity duration-500 ${roadmapText.includes(`PHASE ${step}`) ? "opacity-100" : "opacity-30"}`}
                                  >
                                    {phaseName}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({ children }) => (
                              <div className="text-center mb-16">
                                <h1 className="text-3xl md:text-5xl font-black mb-4 bg-linear-to-r from-blue-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent inline-block tracking-tighter">
                                  {children}
                                </h1>
                                <div className="h-1.5 w-24 bg-linear-to-r from-blue-500 to-indigo-600 mx-auto rounded-full shadow-lg shadow-blue-500/20" />
                              </div>
                            ),
                            h2: ({ children }) => {
                              const titleStr = children?.toString() || "";
                              const phaseNumMatch = titleStr.match(/(\d+)/);
                              const phaseNum = phaseNumMatch
                                ? phaseNumMatch[1]
                                : "✓";

                              return (
                                <div className="mt-20 mb-10 relative">
                                  <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-linear-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 shrink-0 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                      <span className="text-2xl font-black">
                                        {phaseNum}
                                      </span>
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                                        Checkpoint
                                      </span>
                                      <h2 className="text-3xl font-black m-0 tracking-tight leading-none bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text">
                                        {children}
                                      </h2>
                                    </div>
                                  </div>
                                  {/* Milestone Line Connector */}
                                  <div className="absolute left-8 top-16 bottom-[-80px] w-1 bg-linear-to-b from-blue-500/50 via-blue-500/20 to-transparent dashed opacity-30 hidden md:block" />
                                </div>
                              );
                            },
                            h3: ({ children }) => (
                              <h3 className="text-lg font-extrabold mt-10 mb-4 text-blue-400 flex items-center gap-3 pl-24 md:pl-28">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                                {children}
                              </h3>
                            ),
                            p: ({ children }) => (
                              <p className="mb-6 leading-relaxed text-base opacity-70 pl-24 md:pl-28 max-w-3xl">
                                {children}
                              </p>
                            ),
                            ul: ({ children }) => (
                              <ul className="space-y-4 mb-10 ml-[100px] md:ml-[116px] list-none p-0">
                                {children}
                              </ul>
                            ),
                            li: ({ children }) => (
                              <li className="flex gap-4 items-start group">
                                <div className="mt-1 w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-all group-hover:scale-110 shadow-sm">
                                  <i className="pi pi-bolt text-[10px] text-blue-500" />
                                </div>
                                <span className="text-[15px] group-hover:text-blue-500 transition-colors">
                                  {children}
                                </span>
                              </li>
                            ),
                            table: ({ children }) => (
                              <div className="my-10 overflow-hidden rounded-4xl border border-slate-200 dark:border-white/10 shadow-2xl ml-24 md:ml-28">
                                <table className="w-full text-left border-collapse">
                                  {children}
                                </table>
                              </div>
                            ),
                            thead: ({ children }) => (
                              <thead className="bg-slate-100 dark:bg-white/5 font-black text-blue-500">
                                {children}
                              </thead>
                            ),
                            th: ({ children }) => (
                              <th className="px-6 py-4 text-[10px] uppercase tracking-widest">
                                {children}
                              </th>
                            ),
                            td: ({ children }) => (
                              <td className="px-6 py-5 border-t border-slate-100 dark:border-white/5 text-[14px] opacity-80">
                                {children}
                              </td>
                            ),
                            strong: ({ children }) => (
                              <strong className="text-blue-500 font-black">
                                {children}
                              </strong>
                            ),
                          }}
                        >
                          {roadmapText}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-32 space-y-6">
                        <div className="relative w-20 h-20">
                          <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
                          <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <i className="pi pi-bolt text-3xl text-blue-500 animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-black tracking-tight mb-1">
                            LingoArena AI is thinking...
                          </p>
                          <p className="text-sm opacity-50 italic">
                            Building your personalized mastery path
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mt-12">
                    <Button
                      label="Quay lại"
                      icon="pi pi-arrow-left"
                      text
                      onClick={() => setActiveStep(0)}
                    />
                    <Button
                      label="Tiếp theo"
                      icon="pi pi-arrow-right"
                      iconPos="right"
                      onClick={() => setActiveStep(2)}
                    />
                  </div>
                </div>
              </div>
            </StepperPanel>

            {/* BƯỚC 3: KHÓA HỌC */}
            <StepperPanel header="Đề xuất khóa học">
              <div className="flex flex-col pt-10 text-center">
                <h3 className="text-2xl font-black mb-6">
                  Khóa học dành cho bạn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div
                    className={`p-6 rounded-3xl border ${isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-100 shadow-md"}`}
                  >
                    <img
                      src="https://images.unsplash.com/photo-1544650030-3c51ad35a7ee?w=200"
                      className="w-20 h-20 mx-auto rounded-xl mb-4 object-cover"
                    />
                    <p className="font-bold">IELTS Intensive</p>
                    <Button
                      label="Học ngay"
                      className="p-button-sm p-button-text mt-2"
                    />
                  </div>
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    label="Lưu lộ trình"
                    severity="success"
                    className="px-10 py-4 rounded-2xl font-black"
                  />
                </div>
              </div>
            </StepperPanel>
          </Stepper>
        )}
      </div>

      {/* Style để ghi đè màu sắc PrimeReact cho khớp với theme của bạn */}
      <style>{`
        .p-stepper .p-stepper-nav {
            background: transparent;
            padding: 0;
            margin-bottom: 2rem;
        }
        .p-stepper .p-stepper-panels {
            background: transparent;
            padding: 0;
        }
        .p-stepper .p-stepper-header.p-highlight .p-stepper-number {
            background: #3b82f6;
            color: white;
        }
        .p-stepper .p-stepper-header .p-stepper-number {
            width: 3rem;
            height: 3rem;
            font-weight: 800;
        }
      `}</style>
    </div>
  );
}

const LoadingState = ({ isDark }: { isDark: boolean }) => (
  <div className="flex flex-col items-center justify-center py-32 space-y-4">
    <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    <p className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
      AI đang tính toán lộ trình...
    </p>
  </div>
);
