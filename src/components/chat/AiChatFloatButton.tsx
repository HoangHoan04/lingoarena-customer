"use client";

import { useAiChatStore } from "@/stores/useAiChatStore";
import { X } from "lucide-react";
import LottieRobotHello from "./LottieRobotHello";

export default function AiChatFloatButton() {
  const { isOpen, toggleOpen } = useAiChatStore();

  return (
    <div className="fixed bottom-3 left-4 sm:bottom-4 sm:left-4 z-40 flex flex-col items-start select-none">
      <button
        type="button"
        onClick={toggleOpen}
        className="group relative flex items-center justify-center p-0 bg-transparent border-none outline-none shadow-none cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 focus:outline-none"
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI LingoBot"}
      >
        {isOpen ? (
          <div className="size-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl flex items-center justify-center border border-border transition-all">
            <X className="size-6 transition-transform duration-300 hover:rotate-90" />
          </div>
        ) : (
          <div className="relative flex items-center justify-center drop-shadow-2xl">
            <LottieRobotHello size={250} />
          </div>
        )}
      </button>
    </div>
  );
}
