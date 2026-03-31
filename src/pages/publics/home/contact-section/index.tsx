import { earth } from "@/assets/animations";
import Title from "@/components/ui/Tilte";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES } from "@/routes/routes";
import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function ContactSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: "pi-volume-up",
      title: "Luyện kỹ năng Listening",
      description:
        "Kho bài nghe đa dạng theo format TOEIC, IELTS... với âm thanh chuẩn studio.",
      color: "#3b82f6",
    },
    {
      icon: "pi-book",
      title: "Cải thiện Reading",
      description:
        "Hệ thống bài đọc tích hợp AI tra từ vựng và phân tích ngữ pháp thời gian thực.",
      color: "#10b981",
    },
    {
      icon: "pi-comments",
      title: "Phản xạ Speaking",
      description:
        "Luyện nói 1:1 với AI, nhận diện giọng nói và sửa lỗi phát âm ngay lập tức.",
      color: "#f59e0b",
    },
    {
      icon: "pi-pencil",
      title: "Kỹ thuật Writing",
      description:
        "Chấm chữa chi tiết bài viết với gợi ý nâng cấp từ vựng học thuật chuẩn band.",
      color: "#ef4444",
    },
  ];

  return (
    <div
      className={`min-h-screen py-20 px-4 transition-colors duration-500 ${isDark ? "bg-[#0f172a] text-white" : "bg-slate-50 text-slate-900"}`}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <Title className={isDark ? "text-white" : "text-[#005691]"}>
            Bắt đầu hành trình tại{" "}
            <span className="text-orange-500">LingoArena</span>
          </Title>
          <p
            className={`text-lg max-w-2xl mx-auto font-light mt-4 ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Lộ trình cá nhân hóa cho{" "}
            <strong>IELTS, TOEIC, APTIS & VSTEP</strong>. Giúp bạn bứt phá 4 kỹ
            năng trong thời gian ngắn nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          <div className="flex justify-center items-center order-2 lg:order-1 relative">
            <div
              className={`absolute w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse ${isDark ? "bg-blue-500" : "bg-blue-300"}`}
            ></div>
            <div className="w-full max-w-md relative z-10">
              <Lottie
                animationData={earth}
                loop={true}
                className="drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 order-1 lg:order-2">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl border transition-all duration-300 cursor-default
                  ${
                    isDark
                      ? "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                      : "bg-white border-slate-100 hover:shadow-2xl hover:border-blue-200"
                  }`}
              >
                <div className="flex flex-col items-start">
                  <div
                    className="flex items-center justify-center mb-4 transition-transform group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      backgroundColor: `${feature.color}${isDark ? "30" : "15"}`,
                      borderRadius: "14px",
                    }}
                  >
                    <i
                      className={`pi ${feature.icon}`}
                      style={{ fontSize: "1.5rem", color: feature.color }}
                    />
                  </div>
                  <h3
                    className={`text-lg font-bold mb-2 group-hover:text-blue-500 transition-colors ${isDark ? "text-slate-100" : "text-slate-800"}`}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed ${isDark ? "text-slate-400" : "text-slate-500"}`}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card
          className="shadow-2xl border-none overflow-hidden relative"
          style={{
            background: isDark
              ? "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)"
              : "linear-gradient(135deg, #005691 0%, #003d66 100%)",
            borderRadius: "2.5rem",
          }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>

          <div className="py-12 px-6 text-center relative z-10">
            <h3 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Sẵn sàng chinh phục{" "}
              <span className="text-orange-400 underline decoration-2 underline-offset-8">
                Target
              </span>{" "}
              của bạn?
            </h3>
            <p className="text-lg mb-10 max-w-2xl mx-auto text-blue-100/80 font-light">
              Đăng ký ngay để nhận bài thi thử miễn phí và tư vấn lộ trình học
              được thiết kế riêng cho mục tiêu của bạn.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <Button
                label="Tư vấn miễn phí ngay"
                icon="pi pi-bolt"
                onClick={() => router.push(PUBLIC_ROUTES.CONTACT)}
                className="p-button-raised hover:scale-105 transition-transform"
                style={{
                  backgroundColor: "#f97316",
                  border: "none",
                  padding: "1.2rem 2.5rem",
                  borderRadius: "16px",
                  fontWeight: "bold",
                }}
              />
              <Button
                label="Xem bảng giá"
                icon="pi pi-tags"
                onClick={() => router.push("/pricing")}
                className="p-button-outlined hover:bg-white/10"
                style={{
                  color: "white",
                  borderColor: "rgba(255,255,255,0.4)",
                  padding: "1.2rem 2.5rem",
                  borderRadius: "16px",
                }}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
