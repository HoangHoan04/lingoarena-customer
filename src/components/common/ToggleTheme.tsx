"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/providers/ThemeProvider";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "../ui/button";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 p-0 cursor-pointer"
          >
            <div
              className={`relative flex justify-center items-center transition-transform duration-500 ${theme === "dark" ? "rotate-360" : "rotate-0"}`}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </div>
            {theme === "light" && (
              <span className="absolute inset-0 rounded-xl border border-orange-200 animate-ping opacity-20"></span>
            )}
          </Button>
        }
      />
      <TooltipContent side="bottom" sideOffset={6}>
        {theme === "dark"
          ? "Chuyển sang giao diện sáng"
          : "Chuyển sang giao diện tối"}
      </TooltipContent>
    </Tooltip>
  );
}
