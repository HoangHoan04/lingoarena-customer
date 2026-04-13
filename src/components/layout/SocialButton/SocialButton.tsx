import { useTheme } from "@/context/ThemeContext";
import React from "react";

interface SocialButtonProps {
  icon: string;
  label?: string;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  label,
  onClick,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center rounded-2xl border 
        transition-all duration-500 group relative overflow-hidden
        active:scale-95 active:duration-100
        /* Kích thước cố định để đảm bảo cân đối khi có hoặc không có chữ */
        min-h-15 px-4
        ${
          isDark
            ? "bg-slate-900/40 border-white/5 text-slate-300 hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:border-cyan-400/20"
            : "bg-white border-slate-100 text-slate-600 hover:text-indigo-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-100"
        }
      `}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-linear-to-b from-transparent via-white/5 to-transparent -translate-y-full group-hover:translate-y-full" />
      <div
        className={`flex items-center justify-center ${label ? "gap-3" : "gap-0"}`}
      >
        <div
          className={`
          w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shrink-0
          ${isDark ? "bg-slate-950/80 group-hover:bg-cyan-500/10" : "bg-slate-50 group-hover:bg-indigo-50"}
        `}
        >
          <img
            src={icon}
            alt={label || "social-icon"}
            className="w-5 h-5 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {label && (
          <span className="text-sm font-black tracking-tight uppercase whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

export default SocialButton;
