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
        showToast({
          type: "error",
          title: "Lỗi",
          message: errorMessage,
        });
        onError?.(error);
      },
    });
  };

  return (
    <section className="relative py-6 px-6 overflow-hidden bg-[#0f172a]">
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-[2.5rem] shadow-2xl">
          {/* TEXT CONTENT */}
          <div className="flex-1 text-center lg:text-left">
            <p className=" text-cyan-500 hover:text-cyan-400 text-md font-medium max-w-xl mx-auto lg:mx-0">
              {description}
            </p>
          </div>

          {/* INPUT FORM */}
          <div className="w-full lg:max-w-md">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="relative">
                <div className="flex items-center overflow-hidden rounded-2xl border-2 border-white/10 bg-white/10 focus-within:border-cyan-500 focus-within:bg-white/20 transition-all duration-300 shadow-inner group">
                  <InputText
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={placeholder}
                    disabled={isPending}
                    className="w-full h-14 pl-6 pr-4 bg-transparent border-none! text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
                  />

                  <button
                    type="submit"
                    disabled={isPending}
                    className="h-14 px-6 bg-cyan-500 hover:bg-cyan-400 text-slate-900 flex items-center justify-center transition-all duration-300 disabled:opacity-50 shrink-0"
                  >
                    {isPending ? (
                      <i className="pi pi-spin pi-spinner font-bold text-lg"></i>
                    ) : (
                      <span className="flex items-center gap-2 font-bold uppercase tracking-wider text-xs">
                        Gửi <i className="pi pi-arrow-right"></i>
                      </span>
                    )}
                  </button>
                </div>

                <div className="absolute -inset-1 bg-cyan-500/20 blur-xl rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10"></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
