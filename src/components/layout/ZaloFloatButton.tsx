import { ZaloIcon } from "@/assets/icons";
import { useState } from "react";

const ZALO_URL = "https://zalo.me/0377984957";

export default function ZaloFloatButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={ZALO_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat qua Zalo"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center group"
    >
      <div
        className={`absolute right-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap px-3 py-1.5 rounded-full
          bg-linear-to-br from-[#0068ff] to-[#0052cc] text-white text-[12px] font-bold shadow-[0_4px_15px_rgba(0,104,255,0.4)]
          tracking-wide pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1.5"}`}
      >
        Chat Zalo
        <span className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[6px] border-l-[#0068ff]" />
      </div>

      <div className="absolute -inset-1 rounded-full border-2 border-[#0068ff]/50 animate-ping pointer-events-none opacity-75" />

      <img
        src={ZaloIcon}
        alt="Zalo"
        className="w-10 h-10 object-contain transition-transform duration-300 group-hover:rotate-[-10deg]"
      />
    </a>
  );
}
