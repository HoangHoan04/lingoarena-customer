import { useState } from "react";
import MessengerFloatButton from "./MessengerFloatButton";
import ZaloFloatButton from "./ZaloFloatButton";

export default function SocialFloatButtons() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 bottom-[88px] z-49 flex flex-col items-center gap-3">
      <div
        className={`flex flex-col items-center gap-3 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <MessengerFloatButton />
        <ZaloFloatButton />
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 ${
          isOpen
            ? "border-2 border-red-500 rotate-45 text-red-500 bg-red-200"
            : "bg-blue-600 rotate-0 text-white"
        }`}
        aria-label="Toggle Social Buttons"
      >
        <i className={`pi ${isOpen ? "pi-plus " : "pi-comments"} text-2xl`}></i>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[-1] bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
