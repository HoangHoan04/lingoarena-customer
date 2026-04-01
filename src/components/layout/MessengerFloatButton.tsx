import { MessengerIcon } from "@/assets/icons";
import { useState } from "react";

const MESSENGER_URL = "https://m.me/YOUR_PAGE_ID";

export default function MessengerFloatButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={MESSENGER_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat qua Messenger"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center group"
    >
      {/* Tooltip */}
      <div
        className={`absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-full
          bg-linear-to-br from-[#1877f2] to-[#0d5dbf] text-white text-[12px] font-bold shadow-[0_4px_15px_rgba(24,119,242,0.4)]
          tracking-wide pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1.5"}`}
      >
        Chat Messenger
        {/* Arrow */}
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[#1877f2]" />
      </div>

      {/* Pulse ring */}
      <div className="absolute -inset-1 rounded-full border-2 border-[#1877f2]/50 animate-ping pointer-events-none opacity-75" />

      <img
        src={MessengerIcon}
        alt="Messenger"
        className="w-10 h-10 object-contain transition-transform duration-300 group-hover:rotate-[-10deg]"
      />
    </a>
  );
}
