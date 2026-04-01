import { useTheme } from "@/context";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useState } from "react";

export default function RoadMapScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Quản lý bước hiện tại bằng State (Chuẩn React)
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    cert: "IELTS",
    target: "",
    weakness: [] as string[],
    timeframe: 3,
  });

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveStep(1); // Nhảy sang bước Lộ trình
    }, 2500);
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

                  {/* Giả lập Timeline */}
                  <div className="space-y-6">
                    <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded-r-xl">
                      <p className="font-bold">Giai đoạn 1: Foundation</p>
                      <p className="text-sm opacity-60">
                        Xây dựng gốc rễ ngữ pháp và từ vựng.
                      </p>
                    </div>
                    <div className="p-4 border-l-4 border-indigo-500 bg-indigo-500/5 rounded-r-xl">
                      <p className="font-bold">Giai đoạn 2: Skill-up</p>
                      <p className="text-sm opacity-60">
                        Luyện tập sâu kỹ năng {formData.weakness.join(", ")}.
                      </p>
                    </div>
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

// Sub-component Loading
const LoadingState = ({ isDark }: { isDark: boolean }) => (
  <div className="flex flex-col items-center justify-center py-32 space-y-4">
    <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
    <p className={`font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
      AI đang tính toán lộ trình...
    </p>
  </div>
);
