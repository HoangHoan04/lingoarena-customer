"use client";

import { usePathname, useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  BookOpen,
  Bot,
  ChevronDown,
  Headphones,
  Layers,
  Mic,
  PenTool,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type NavSubItem = {
  key: string;
  label: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  gradient: string;
};

export type NavLinkItem = {
  key: string;
  label: string;
  path: string;
  children?: NavSubItem[];
};

export const NAV_LINKS: NavLinkItem[] = [
  {
    key: "practice",
    label: "Luyện thi",
    path: "/practice",
    children: [
      {
        key: "toeic",
        label: "Luyện thi TOEIC",
        description:
          "Luyện thi TOEIC Listening, Reading, Speaking, Writing với các dạng đề thi chuẩn ETS và hệ thống chấm điểm tự động, thời gian thực.",
        path: "/practice/toeic",
        icon: Headphones,
        gradient:
          "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
      },
      {
        key: "ielts",
        label: "Luyện thi IELTS",
        description:
          "Luyện thi IELTS Listening, Reading, Speaking, Writing với các dạng đề thi chuẩn Cambridge và hệ thống chấm điểm tự động, thời gian thực.",
        path: "/practice/ielts",
        icon: Mic,
        gradient:
          "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
      },
      {
        key: "vstep",
        label: "Luyện thi VSTEP",
        description:
          "Luyện thi VSTEP Listening, Reading, Speaking, Writing với các dạng đề thi chuẩn VSTEP và hệ thống chấm điểm tự động, thời gian thực.",
        path: "/practice/vstep",
        icon: PenTool,
        gradient:
          "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
      },
      {
        key: "Aptis",
        label: "Luyện thi Aptis",
        description:
          "Luyện thi Aptis Listening, Reading, Speaking, Writing với các dạng đề thi chuẩn Aptis và hệ thống chấm điểm tự động, thời gian thực.",
        path: "/practice/aptis",
        icon: Sparkles,
        gradient:
          "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
      },
    ],
  },
  {
    key: "learn",
    label: "Luyện tập",
    path: "/learn",
    children: [
      {
        key: "listening",
        label: "Luyện nghe",
        description:
          "Luyện nghe các dạng đề thi & đoạn hội thoại theo chuẩn IELTS, TOEIC, VSTEP với bản dịch song ngữ và tra từ vựng.",
        path: "/listening",
        icon: Headphones,
        badge: "Audio",
        gradient:
          "from-blue-500/20 to-cyan-500/20 text-blue-600 dark:text-blue-400",
      },
      {
        key: "speaking",
        label: "Luyện nói",
        description:
          "Luyện nói theo chuẩn IELTS, TOEIC, VSTEP với phản hồi tự động và chấm điểm thực.",
        path: "/speaking",
        icon: Mic,
        badge: "Audio",
        gradient:
          "from-amber-500/20 to-orange-500/20 text-amber-600 dark:text-amber-400",
      },
      {
        key: "reading",
        label: "Luyện đọc hiểu",
        description:
          "Luyện đọc hiểu theo chuẩn IELTS, TOEIC, VSTEP với bản dịch song ngữ và tra từ vựng.",
        path: "/reading",
        icon: BookOpen,
        badge: "Đọc hiểu",
        gradient:
          "from-cyan-500/20 to-teal-500/20 text-cyan-600 dark:text-cyan-400",
      },
      {
        key: "writing",
        label: "Luyện viết",
        description:
          "Luyện viết theo chuẩn IELTS, TOEIC, VSTEP với phản hồi tự động và chấm điểm thực.",
        path: "/writing",
        icon: PenTool,
        badge: "Viết",
        gradient:
          "from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400",
      },
      {
        key: "vocabulary",
        label: "Từ vựng",
        description: "Luyện từ vựng theo chủ đề và cấp độ.",
        path: "/vocabulary",
        icon: Sparkles,
        badge: "Từ vựng",
        gradient:
          "from-purple-500/20 to-pink-500/20 text-purple-600 dark:text-purple-400",
      },
      {
        key: "grammar",
        label: "Luyện ngữ pháp",
        description:
          "Luyện ngữ pháp theo chuẩn IELTS, TOEIC, VSTEP với ví dụ minh họa và bài tập thực hành.",
        path: "/grammar",
        icon: Layers,
        badge: "Ngữ pháp",
        gradient:
          "from-indigo-500/20 to-sky-500/20 text-indigo-600 dark:text-indigo-400",
      },
      {
        key: "path",
        label: "Lộ trình học",
        description:
          "Lộ trình học cá nhân hóa theo mục tiêu điểm thi — rule engine gom bài học, từ vựng, ngữ pháp và đề thi phù hợp cho bạn.",
        path: "/path",
        icon: Target,
        badge: "AI",
        gradient:
          "from-rose-500/20 to-orange-500/20 text-rose-600 dark:text-rose-400",
      },
    ],
  },
  {
    key: "ai-conversation",
    label: "Giao tiếp AI",
    path: "/ai-conversation",
  },
  {
    key: "courses",
    label: "Khoá học",
    path: "/courses",
  },
  {
    key: "arena",
    label: "Đấu trường 1v1",
    path: "/arena",
  },
];

export default function HeaderDesktopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDropdownKey, setActiveDropdownKey] = useState<string | null>(
    null,
  );
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setActiveDropdownKey(null);
  }, [pathname]);

  const handleMenuMouseEnter = (key: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdownKey(key);
  };

  const handleMenuMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdownKey(null);
    }, 180);
  };

  const isActivePath = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const isItemActive = (item: NavLinkItem) => {
    if (isActivePath(item.path)) return true;
    if (item.children) {
      return item.children.some((child) => {
        const basePath = child.path.split("?")[0];
        return pathname === basePath || pathname.startsWith(`${basePath}/`);
      });
    }
    return false;
  };

  return (
    <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5">
      {NAV_LINKS.map((item) => {
        const isActive = isItemActive(item);
        const hasChildren = Boolean(item.children && item.children.length > 0);

        if (hasChildren) {
          const isDropdownOpen = activeDropdownKey === item.key;

          return (
            <div
              key={item.key}
              className="relative group"
              onMouseEnter={() => handleMenuMouseEnter(item.key)}
              onMouseLeave={handleMenuMouseLeave}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveDropdownKey((prev) =>
                    prev === item.key ? null : item.key,
                  );
                }}
                className={`flex items-center gap-1 relative px-2.5 xl:px-3 py-2 bg-transparent border-none cursor-pointer text-xs xl:text-sm whitespace-nowrap transition-colors duration-200 font-semibold ${
                  isActive
                    ? "text-brand dark:text-[#7b9bee] font-bold"
                    : "text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-[#7b9bee]"
                }`}
                aria-expanded={isDropdownOpen}
              >
                <span>{item.label}</span>
                <ChevronDown
                  className={`size-3.5 transition-transform duration-200 ${
                    isDropdownOpen
                      ? "rotate-180 text-brand dark:text-[#7b9bee]"
                      : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"
                  }`}
                />
                <span
                  className={`absolute bottom-0.5 left-2.5 right-2.5 xl:left-3 xl:right-3 h-0.5 rounded-full bg-brand dark:bg-[#7b9bee] transition-transform duration-300 origin-center ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              <div
                className={`
                  absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 transition-all duration-200 ease-out origin-top
                  ${
                    isDropdownOpen
                      ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                  }
                `}
              >
                <div className="w-130 rounded-3xl p-3 border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                  <div className="grid grid-cols-2 gap-2">
                    {item.children?.map((child) => {
                      const isChildActive = pathname === child.path;
                      const Icon = child.icon;

                      return (
                        <button
                          key={child.key}
                          type="button"
                          onClick={() => {
                            setActiveDropdownKey(null);
                            router.push(child.path as any);
                          }}
                          className={`group/item flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 text-left cursor-pointer ${
                            isChildActive
                              ? "bg-slate-100 dark:bg-slate-800/80"
                              : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                          }`}
                        >
                          <div
                            className={`p-2 rounded-xl bg-linear-to-br ${child.gradient} shrink-0 group-hover/item:scale-110 transition-transform duration-200`}
                          >
                            {Icon && <Icon className="size-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {child.label}
                              </span>
                              {child.badge && (
                                <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-black uppercase tracking-wider">
                                  {child.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                              {child.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between px-2 text-[11px]">
                    <span className="text-slate-500 dark:text-slate-400">
                      {item.key === "practice"
                        ? "Hệ thống thi thử sát đề thật 100%"
                        : "Học thông minh với phương pháp Spaced Repetition"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDropdownKey(null);
                        router.push(item.path as any);
                      }}
                      className="text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Xem tất cả</span>
                      <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        return (
          <button
            key={item.path}
            type="button"
            onClick={() => router.push(item.path as any)}
            className={`relative flex items-center gap-1.5 px-2.5 xl:px-3 py-2 bg-transparent border-none cursor-pointer text-xs xl:text-sm whitespace-nowrap transition-colors duration-200 font-semibold ${
              isActive
                ? "text-brand dark:text-[#7b9bee] font-bold"
                : "text-slate-700 dark:text-slate-300 hover:text-brand dark:hover:text-[#7b9bee]"
            }`}
          >
            {item.key === "ai-conversation" && (
              <Bot className="size-4 text-green-600 dark:text-green-400 shrink-0" />
            )}
            <span>{item.label}</span>
            {item.key === "ai-conversation" && (
              <span className="px-1.5 py-0.2 rounded-md bg-linear-to-r from-green-500/20 to-blue-500/20 text-green-600 dark:text-green-300 border border-green-500/30 text-[9px] font-black uppercase tracking-wider animate-pulse shrink-0">
                Live AI
              </span>
            )}
            <span
              className={`absolute bottom-0.5 left-2.5 right-2.5 xl:left-3 xl:right-3 h-0.5 rounded-full bg-brand dark:bg-[#7b9bee] transition-transform duration-300 origin-center ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
