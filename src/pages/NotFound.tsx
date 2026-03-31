import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES } from "@/routes/routes";
import { Zap } from "lucide-react";
import { Button } from "primereact/button";
import React from "react";

export default function NotFound(): React.JSX.Element {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 overflow-hidden bg-[#0f172a]">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]"></div>
      <div
        className="
        relative z-10 w-full max-w-2xl text-center mx-auto p-12 lg:p-16
        rounded-3xl border border-white/5 shadow-2xl
        bg-slate-900/60 backdrop-blur-xl
        animate-in fade-in zoom-in-95 duration-500
      "
      >
        <div className="flex justify-center mb-12 relative group">
          <div className="absolute inset-0 bg-cyan-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>

          <div
            className="
            relative rotate-12 flex items-center justify-center rounded-3xl 
            w-32 h-32 lg:w-40 lg:h-40
            bg-linear-to-br from-indigo-600 to-violet-700 
            shadow-2xl border border-white/10
            animate-bounce-slow
          "
          >
            <div className="-rotate-12 flex flex-col items-center gap-1">
              <Zap
                className="text-cyan-300 w-16 h-16 lg:w-20 lg:h-20"
                strokeWidth={1.5}
              />
              <span className="text-4xl lg:text-5xl font-black text-cyan-300">
                404
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col -space-y-1 mb-10">
          <div className="flex items-center justify-center font-black tracking-tight text-5xl lg:text-7xl">
            <span className="text-white mr-2">LINGO</span>
            <span className="bg-clip-text text-transparent bg-linear-to-r from-cyan-400 to-blue-500">
              ARENA
            </span>
          </div>

          <span className="text-slate-500 font-semibold tracking-widest text-[0.25em] pl-1 uppercase mt-1">
            Elite English Training
          </span>
        </div>

        <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
          Bản đồ thi đấu bị lỗi!
        </h2>

        <p className="mb-12 text-base lg:text-lg text-slate-400 leading-relaxed font-medium max-w-xl mx-auto">
          Có vẻ như bạn đã đi lạc khỏi khu vực thi đấu. Đừng lo lắng, hãy quay
          lại trang chủ để tiếp tục chinh phục những đỉnh cao mới!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            label="Trở về trang chủ"
            icon={<i className="pi pi-home w-5 h-5" />}
            className="
              flex items-center justify-center gap-2 
              px-8 py-3 rounded-full text-base font-bold
              bg-indigo-600 text-white shadow-lg shadow-indigo-500/30
              hover:bg-indigo-700 hover:shadow-indigo-500/50
              transition-all duration-300 active:scale-95
              border-none! ring-0! outline-none!
            "
            onClick={() => router.push(PUBLIC_ROUTES.HOME)}
          />
          <Button
            label="Quay lại"
            icon={<i className="pi pi-arrow-left w-5 h-5" />}
            className="
              flex items-center justify-center gap-2 
              px-8 py-3 rounded-full text-base font-bold
              bg-white/5 text-slate-300
              hover:bg-white/10 hover:text-white
              transition-colors duration-300
              border-none! ring-0! outline-none!
            "
            onClick={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
