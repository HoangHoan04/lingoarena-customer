import { useTheme } from "@/context/ThemeContext";
import { Zap } from "lucide-react";
import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sizeMap = {
    sm: { container: "gap-1.5", icon: 16, text: "text-lg" },
    md: { container: "gap-2", icon: 22, text: "text-2xl" },
    lg: { container: "gap-3", icon: 36, text: "text-5xl" },
    xl: { container: "gap-4", icon: 54, text: "text-7xl" },
  };

  const config = sizeMap[size];
  const styles = {
    lingoText: isDark ? "text-white" : "text-slate-800",
    glowOpacity: isDark ? "opacity-30" : "opacity-20",
    zapColor: isDark ? "text-cyan-300" : "text-cyan-400",
    zapFill: isDark ? "fill-cyan-300/20" : "fill-cyan-400/10",
    subText: isDark ? "text-slate-500" : "text-slate-400",
  };

  return (
    <div
      className={`flex items-center select-none font-sans ${config.container} ${className}`}
    >
      <div className="relative group">
        <div
          className={`absolute inset-0 bg-cyan-400 blur-md ${styles.glowOpacity} group-hover:opacity-50 transition-opacity`}
        ></div>

        <div
          className={`relative rotate-45 flex items-center justify-center rounded-lg shadow-xl border transition-colors duration-300 ${
            isDark
              ? "bg-linear-to-br from-indigo-600 to-violet-800 border-white/10"
              : "bg-linear-to-br from-indigo-500 to-indigo-700 border-indigo-400/20"
          }`}
          style={{ width: config.icon * 1.5, height: config.icon * 1.5 }}
        >
          <div className="-rotate-45">
            <Zap
              size={config.icon}
              className={`${styles.zapColor} ${styles.zapFill} transition-colors duration-300`}
              strokeWidth={2.5}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col -space-y-1">
        <div
          className={`flex items-center font-black tracking-tight ${config.text}`}
        >
          <span
            className={`${styles.lingoText} mr-1 transition-colors duration-300`}
          >
            LINGO
          </span>
          <span
            className={`bg-clip-text text-transparent bg-linear-to-r ${
              isDark ? "from-cyan-400 to-blue-500" : "from-cyan-500 to-blue-600"
            }`}
          >
            ARENA
          </span>
        </div>

        {(size === "lg" || size === "xl") && (
          <span
            className={`${styles.subText} font-semibold tracking-widest text-[0.25em] pl-1 transition-colors duration-300 uppercase`}
          >
            Elite English Training
          </span>
        )}
      </div>
    </div>
  );
};

export default Logo;
