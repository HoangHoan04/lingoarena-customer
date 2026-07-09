"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Rocket } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function BackToTop() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setIsVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    // Chạy kiểm tra ngay khi render/chuyển trang
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (scrollProgress / 100) * circumference;

  return (
    <div className="fixed bottom-8 right-8 z-40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              onClick={scrollToTop}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="group relative flex items-center justify-center size-13 rounded-full bg-background hover:bg-muted border border-border shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer no-override"
              aria-label="Back to top"
            >
              <svg className="absolute inset-0 size-full -rotate-90">
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  className="stroke-muted-foreground/15"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="26"
                  cy="26"
                  r={radius}
                  className="stroke-primary transition-all duration-150"
                  strokeWidth="3.5"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>

              <Rocket
                className="size-5 text-primary transition-transform duration-300 ease-out"
                style={{
                  transform: `rotate(-45deg) ${isHovered ? "scale(1.18)" : ""}`,
                  transformOrigin: "center",
                }}
              />
            </button>
          }
        />
        <TooltipContent side="top" sideOffset={8}>
          Cuộn lên đầu trang
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
