"use client";

import { MessengerIcon, WhatsappIcon, ZaloIcon } from "@/assets/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Maximize2, MessageCircle, Minimize2, X } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface SocialChannel {
  id: string;
  name: string;
  subtext: string;
  icon: any;
  color: string;
  bgGradient: string;
  link: string;
}

const CHANNELS: SocialChannel[] = [
  {
    id: "messenger",
    name: "Facebook Messenger",
    subtext: "Chat tư vấn trực tiếp 24/7",
    icon: MessengerIcon,
    color: "#0084FF",
    bgGradient: "from-[#00B2FE] to-[#006AFF]",
    link: "https://m.me/lingoarena",
  },
  {
    id: "zalo",
    name: "Zalo Official Account",
    subtext: "Hỗ trợ kỹ thuật & khóa học",
    icon: ZaloIcon,
    color: "#0068FF",
    bgGradient: "from-[#0068FF] to-[#0047BA]",
    link: "https://zalo.me/0987654321",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Support",
    subtext: "Tư vấn viên quốc tế",
    icon: WhatsappIcon,
    color: "#25D366",
    bgGradient: "from-[#25D366] to-[#128C7E]",
    link: "https://wa.me/84987654321",
  },
];

export default function FloatSocialMessenger() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const toggleSize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCompact(!isCompact);
  };

  return (
    <div
      className={`fixed bottom-24 right-6 z-40 flex flex-col items-end gap-3 transition-all duration-300 select-none ${
        isCompact ? "scale-90" : "scale-100"
      }`}
    >
      {/* Expanded Channels List */}
      {isOpen && (
        <div className="flex flex-col items-end gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Quick Header Widget with Scale Toggle */}
          <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-xl rounded-2xl py-1.5 px-3 backdrop-blur-xl flex items-center justify-between gap-3 text-xs mb-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[11px]">Hỗ trợ trực tuyến 24/7</span>
            </div>

            {/* Toggle Zoom In / Zoom Out */}
            <Tooltip>
              <TooltipTrigger
                render={
                  <button
                    type="button"
                    onClick={toggleSize}
                    className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                    aria-label={
                      isCompact ? "Phóng to kích thước" : "Thu nhỏ kích thước"
                    }
                  >
                    {isCompact ? (
                      <Maximize2 className="size-3.5" />
                    ) : (
                      <Minimize2 className="size-3.5" />
                    )}
                  </button>
                }
              />
              <TooltipContent side="left">
                {isCompact ? "Phóng to nút bấm" : "Thu nhỏ nút bấm"}
              </TooltipContent>
            </Tooltip>
          </div>

          {/* 3 Channels (Messenger, Zalo, WhatsApp) */}
          {CHANNELS.map((channel) => (
            <a
              key={channel.id}
              href={channel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center cursor-pointer transition-all duration-300 hover:scale-105"
            >
              {/* Floating Hover Label Box (Appears smoothly only on hover) */}
              <div className="absolute right-full mr-3 hidden group-hover:flex flex-col items-end py-1.5 px-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-2 duration-200 whitespace-nowrap pointer-events-none">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {channel.name}
                </span>
                <span className="text-[10px] text-slate-400">
                  {channel.subtext}
                </span>
              </div>

              {/* Pure Circle Icon Button */}
              <div
                className={`size-12 sm:size-13 rounded-full flex items-center justify-center shadow-xl p-2.5 bg-linear-to-tr ${channel.bgGradient} transition-transform duration-300 group-hover:scale-110 border border-white/25`}
              >
                <Image
                  src={channel.icon}
                  alt={channel.name}
                  width={26}
                  height={26}
                  className="object-contain drop-shadow-xs"
                />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Main Trigger Toggle Button */}
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={toggleOpen}
              className={`relative size-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 border border-white/20 ${
                isOpen
                  ? "bg-slate-800 hover:bg-slate-900 text-white"
                  : "bg-brand hover:bg-[#1e2f5e] text-white shadow-brand/35 ring-4 ring-brand/20"
              }`}
              aria-label={
                isOpen ? "Đóng danh sách hỗ trợ" : "Mở danh sách hỗ trợ"
              }
            >
              {/* Static notification red dot */}
              {!isOpen && hasNewMessage && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 z-10">
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-black text-white items-center justify-center">
                    1
                  </span>
                </span>
              )}

              {isOpen ? (
                <X className="size-6 transition-transform duration-300 rotate-0 hover:rotate-90" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <MessageCircle className="size-7 fill-white/20 text-white" />
                </div>
              )}
            </button>
          }
        />
        <TooltipContent side="left" sideOffset={12}>
          {isOpen ? "Thu gọn thanh hỗ trợ" : "Chat tư vấn & Hỗ trợ LingoArena"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
