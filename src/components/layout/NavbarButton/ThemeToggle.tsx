import { useTheme } from "@/context/ThemeContext";
import { Button } from "primereact/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      rounded
      text
      size="small"
      tooltip={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
      pt={{
        root: {
          className: `!border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 w-10 h-10 flex items-center justify-center bg-transparent`,
        },
        icon: {
          className: `text-xl ${theme === "dark" ? "text-cyan-400" : "text-black"} opacity-80 group-hover:opacity-100`,
        },
      }}
      tooltipOptions={{
        position: "bottom",
        mouseTrack: true,
        mouseTrackTop: 15,
        mouseTrackLeft: 15,
      }}
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
    </Button>
  );
}
