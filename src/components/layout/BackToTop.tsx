import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;
      setProgress(scrolled);
      setShow(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryColor = isDark ? "#3b82f6" : "#2563eb";
  const trackColor = isDark ? "#1e293b" : "#e2e8f0";

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-6 bottom-6 z-50 flex items-center justify-center transition-all duration-500
        ${show ? "translate-y-0 opacity-100 scale-100" : "translate-y-20 opacity-0 scale-50 pointer-events-none"}
      `}
    >
      <div className="group relative h-12 w-12 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full transition-transform duration-300 group-hover:scale-110 shadow-2xl"
          style={{
            background: `conic-gradient(${primaryColor} ${progress}%, ${trackColor} ${progress}%)`,
          }}
        >
          <div
            className={`absolute inset-1.5 rounded-full transition-colors duration-300 ${
              isDark ? "bg-slate-900" : "bg-white"
            }`}
          ></div>
        </div>

        <div
          className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shadow-inner transition-all duration-300
          ${
            isDark
              ? "bg-slate-800 text-blue-400 group-hover:bg-blue-600"
              : "bg-blue-50 text-blue-700 group-hover:bg-blue-600"
          }
          group-hover:text-white group-active:scale-90`}
        >
          <i className="pi pi-arrow-up text-base font-bold transition-transform "></i>
        </div>

        <div
          className={`absolute inset-0 rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-20 
          ${isDark ? "bg-blue-400" : "bg-blue-600"}`}
        ></div>
      </div>

      <div
        className={`absolute right-20 px-3 py-1 rounded-full text-[10px] font-black opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 shadow-lg pointer-events-none
        ${isDark ? "bg-blue-600 text-white" : "bg-slate-900 text-white"}`}
      >
        {Math.round(progress)}%
      </div>
    </button>
  );
}
