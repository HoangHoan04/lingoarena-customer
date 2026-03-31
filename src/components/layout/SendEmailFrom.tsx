import { useTheme } from "@/context";
import { validators } from "@/utils/validators";
import { InputText } from "primereact/inputtext";
import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import { useSubscribeNewsletter } from "../../hooks/newsletter";

interface SendEmailComponentProps {
  description?: string;
  placeholder?: string;
  onSuccess?: (email: string) => void;
  onError?: (error: any) => void;
}

export default function SendEmailComponent({
  description = "Đăng ký nhận lộ trình học tập miễn phí và cập nhật những thử thách mới nhất từ Đấu trường LingoArena.",
  placeholder = "Nhập địa chỉ email của bạn...",
  onSuccess,
  onError,
}: SendEmailComponentProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [email, setEmail] = useState("");
  const { showToast } = useToast();
  const { mutate: subscribe, isPending } = useSubscribeNewsletter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validators.isEmpty(email)) {
      showToast({
        type: "warn",
        title: "Cảnh báo",
        message: "Vui lòng nhập địa chỉ email",
      });
      return;
    }
    if (!validators.isValidEmail(email)) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: "Email không đúng định dạng",
      });
      return;
    }

    subscribe(email, {
      onSuccess: (data) => {
        showToast({
          type: "success",
          title: "Thành công",
          message: data.message || "Bạn đã đăng ký nhận tin thành công!",
        });
        setEmail("");
        onSuccess?.(email);
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại!";
        showToast({ type: "error", title: "Lỗi", message: errorMessage });
        onError?.(error);
      },
    });
  };

  return (
    <section
      className={`relative py-8 px-6 transition-colors duration-500 ${isDark ? "bg-[#0f172a]" : "bg-[#f8fafc]"}`}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        <div
          className={`flex flex-col lg:flex-row items-center justify-between gap-8 p-6 md:p-8 rounded-[2.5rem] border shadow-2xl transition-all duration-500
          ${
            isDark
              ? "bg-white/5 backdrop-blur-xl border-white/10 shadow-black/40"
              : "bg-white/80 backdrop-blur-md border-slate-200 shadow-slate-200"
          }`}
        >
          {/* Cột trái: Mô tả */}
          <div className="flex-1 text-center lg:text-left">
            <p
              className={`text-sm md:text-base font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed transition-colors
              ${isDark ? "text-cyan-400 opacity-90" : "text-blue-600 opacity-100"}`}
            >
              {description}
            </p>
          </div>

          {/* Cột phải: Form đăng ký */}
          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative">
                <div
                  className={`flex items-center overflow-hidden rounded-2xl border-2 transition-all duration-300 shadow-inner
                  ${
                    isDark
                      ? "border-white/10 bg-white/5 focus-within:border-cyan-500 focus-within:bg-white/10"
                      : "border-slate-200 bg-slate-50 focus-within:border-blue-600 focus-within:bg-white"
                  }`}
                >
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    disabled={isPending}
                    className={`w-full h-14 pl-6 pr-4 bg-transparent border-none text-sm transition-colors focus:outline-none focus:ring-0
                      ${isDark ? "text-white placeholder:text-slate-500" : "text-slate-800 placeholder:text-slate-400"}`}
                  />

                  <button
                    type="submit"
                    disabled={isPending}
                    className={`h-14 px-8 flex items-center justify-center transition-all duration-300 disabled:opacity-50 shrink-0
                      ${
                        isDark
                          ? "bg-cyan-500 hover:bg-cyan-400 text-slate-900"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                  >
                    {isPending ? (
                      <i className="pi pi-spin pi-spinner font-bold text-lg"></i>
                    ) : (
                      <span className="flex items-center gap-2 font-semibold uppercase text-xs">
                        Gửi ngay <i className="pi pi-send text-xs"></i>
                      </span>
                    )}
                  </button>
                </div>

                {/* Hiệu ứng Glow khi focus */}
                <div
                  className={`absolute -inset-1 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10
                  ${isDark ? "bg-cyan-500/20" : "bg-blue-600/10"}`}
                ></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
