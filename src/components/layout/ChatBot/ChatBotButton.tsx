import { useState } from "react";
import Lottie from "lottie-react";
import ChatBotCustom from "./ChatBotCustom";
import { chatbot } from "@/assets/animations";

export default function ChatBotButton() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <ChatBotCustom isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <button
        onClick={() => setIsChatOpen((prev) => !prev)}
        title="Trợ lý AI"
        aria-label="Mở trợ lý AI LingoArena"
        className={`rounded-full flex items-center justify-center shadow-lg transition-all duration-300 active:scale-90 relative
          ${isChatOpen ? " scale-105" : "hover:scale-110"}`}
      >
        <Lottie
          animationData={chatbot}
          loop
          style={{ width: 100, height: 100 }}
        />
      </button>
    </>
  );
}
