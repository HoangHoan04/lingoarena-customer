import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        relative w-8 h-8 rounded-full flex items-center justify-center
        transition-all duration-500 overflow-hidden
        ${
          theme === "dark"
            ? "bg-slate-800 text-indigo-400 shadow-[inset_0_0_10px_rgba(129,140,248,0.2)]"
            : "bg-orange-50 text-orange-500 shadow-sm"
        }
        hover:scale-110 active:scale-95 border
        ${theme === "dark" ? "border-slate-700" : "border-orange-100"}
      `}
      title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
    >
      <div
        className={`relative flex justify-center items-center transition-transform duration-500 ${theme === "dark" ? "rotate-360" : "rotate-0"}`}
      >
        {theme === "dark" ? (
          <i className="pi pi-moon text-lg animate-fade-in"></i>
        ) : (
          <i className="pi pi-sun text-lg animate-fade-in"></i>
        )}
      </div>
      {theme === "light" && (
        <span className="absolute inset-0 rounded-xl border border-orange-200 animate-ping opacity-20"></span>
      )}
    </button>
  );
}
