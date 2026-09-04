"use client";

import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="logo relative w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center">
        <Image
          src="/images/android-chrome-192x192.png"
          alt="LingoArena Favicon"
          width={44}
          height={44}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      <div className="flex flex-col justify-center h-10 sm:h-11 text-left">
        <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
          Lingo<span className="text-brand dark:text-[#7b9bee]">Arena</span>
        </span>
        <span className="text-[10px] sm:text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand/60 dark:text-[#7b9bee]/70 mt-1 leading-none">
          Exam Prep & AI Learning
        </span>
      </div>
    </div>
  );
}
