import type { ReactNode } from "react";

interface FancyDividerProps {
  children?: ReactNode;
  className?: string;
}

export default function FancyDivider({
  children,
  className = "",
}: FancyDividerProps) {
  return (
    <div className={`relative flex items-center w-full py-6 ${className}`}>
      {/* Thanh bên trái - Gradient nhẹ nhàng hơn */}
      <div className="grow h-px bg-linear-to-r from-transparent via-slate-200 dark:via-slate-700 to-slate-200 dark:to-slate-700"></div>

      {/* Nội dung ở giữa */}
      {children && (
        <div className="shrink mx-4 relative">
          <div className="relative z-10 px-4 py-1 rounded-full border border-slate-100 dark:border-white/10 bg-white dark:bg-slate-900 shadow-sm flex items-center gap-2">
            {/* Bỏ font-black và uppercase ép buộc. 
               Dùng font-medium và tracking-wide để chữ "thở" hơn.
            */}
            <div className="text-[13px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap leading-none flex items-center gap-2">
              {children}
            </div>
          </div>
        </div>
      )}

      {/* Thanh bên phải */}
      <div className="grow h-px bg-linear-to-l from-transparent via-slate-200 dark:via-slate-700 to-slate-200 dark:to-slate-700"></div>
    </div>
  );
}
