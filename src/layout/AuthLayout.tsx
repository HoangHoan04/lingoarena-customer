import Logo from "@/components/ui/Logo";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="h-screen w-full flex bg-white dark:bg-slate-950 overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f5573] overflow-hidden items-center justify-center p-16 shrink-0">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-400/30 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-400/20 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M36 34v-4H20v4H16V20h4v4h16v-4h4v14h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 text-white w-full max-w-lg">
          <div className="mb-12 inline-block">
            <Logo size="lg" className="brightness-0 invert scale-110" />
          </div>

          <div className="space-y-4 mb-10">
            <div className="h-1.5 w-24 bg-linear-to-r from-cyan-400 to-transparent rounded-full" />
            <p className="text-xl text-indigo-100/90 leading-relaxed font-medium max-w-md">
              Luyện thi IELTS & TOEIC theo lộ trình AI. Tham gia đấu trường
              <span className="text-white font-bold"> Real-time </span>
              để bứt phá giới hạn bản thân.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="group flex items-center gap-5 bg-white/5 hover:bg-white/10 p-5 rounded-4xl backdrop-blur-md border border-white/10 transition-all duration-500 cursor-default hover:translate-x-2 shadow-lg">
              <div className="w-14 h-14 bg-cyan-400/20 rounded-2xl flex items-center justify-center border border-cyan-300/30 group-hover:scale-110 transition-transform">
                <i className="pi pi-bolt text-cyan-300 text-2xl animate-bounce"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">
                  Luyện thi tốc chiến
                </h4>
                <p className="text-sm text-indigo-200">
                  Tối ưu hóa thời gian với ngân hàng đề sát thực tế.
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-5 bg-white/5 hover:bg-white/10 p-5 rounded-4xl backdrop-blur-md border border-white/10 transition-all duration-500 cursor-default hover:translate-x-2 shadow-lg">
              <div className="w-14 h-14 bg-emerald-400/20 rounded-2xl flex items-center justify-center border border-emerald-300/30 group-hover:scale-110 transition-transform">
                <i className="pi pi-users text-emerald-300 text-2xl"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">
                  Đấu trường 1vs1
                </h4>
                <p className="text-sm text-indigo-200">
                  Thách đấu bạn bè, leo bảng xếp hạng vinh danh.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex items-center gap-8 text-indigo-200/60">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-slate-300"
                />
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                +10k
              </div>
            </div>
            <span className="text-sm font-semibold italic">
              Đã có hơn 10,000 học viên tin tưởng
            </span>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full flex flex-col overflow-y-auto bg-white dark:bg-slate-950">
        <div className="p-6 lg:hidden">
          <Logo size="md" />
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-140 animate-in fade-in slide-in-from-right-4 duration-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
