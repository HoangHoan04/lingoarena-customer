"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  FileEdit,
  Globe2,
  Heart,
  ImageIcon,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

interface HeroSectionProps {
  className?: string;
}

const STATS = [
  {
    label: "Người truy cập",
    value: "1.2M+",
    icon: Users,
    color: "text-blue-500",
  },
  {
    label: "Học viên tin dùng",
    value: "500K+",
    icon: CheckCircle2,
    color: "text-green-500",
  },
  {
    label: "Từ vựng",
    value: "950K+",
    icon: Heart,
    color: "text-red-500",
  },
  {
    label: "Đề thi",
    value: "15+",
    icon: Globe2,
    color: "text-purple-500",
  },
] as const;

export default function HeroSection({ className }: HeroSectionProps) {
  const router = useRouter();

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-10">
          <div className="lg:col-span-5 space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
            <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="size-3.5" />
                Hệ thống luyện thi thông minh
              </span>
            </div>

            <h1 className="text-4xl font-bold">
              Luyện thi Aptis hiệu quả với LingoArena
            </h1>

            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg">
              Chào mừng bạn đến với{" "}
              <span className="font-bold">LingoArena</span>. Hệ thống luyện thi
              thông minh giúp bạn chinh phục IELTS & TOEIC thông qua lộ trình cá
              nhân hóa và đấu trường trực tuyến.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="px-8 py-6 rounded-2xl font-bold shadow-xl shadow-indigo-500/30 hover:scale-105 transition-all"
                onClick={() => router.push("/practice")}
              >
                <Zap className="size-4" />
                Bắt đầu luyện tập
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 rounded-2xl font-bold border-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                onClick={() => router.push("/placement-test")}
              >
                <FileEdit className="size-4" />
                Làm bài Test kiểm tra
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-8 duration-700">
            <div
              className={cn(
                "w-full aspect-16/10 rounded-4xl relative overflow-hidden shadow-2xl",
                "bg-slate-100 dark:bg-slate-800/50 border-2 border-dashed border-slate-300 dark:border-slate-700",
                "flex flex-col items-center justify-center gap-3 text-slate-400 dark:text-slate-500",
                className,
              )}
            >
              <ImageIcon className="size-10" />
              <span className="text-sm font-medium">Banner placeholder</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-18">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="relative bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-2xl border border-slate-100 dark:border-white/5 hover:border-indigo-500/30 transition-all duration-300 group flex items-center gap-4 overflow-hidden"
              >
                <div className="w-14 h-14 shrink-0 rounded-xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center group-hover:bg-indigo-500 transition-all duration-500">
                  <Icon
                    className={cn(
                      "size-5 group-hover:text-white transition-colors",
                      stat.color,
                    )}
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1 truncate">
                    {stat.label}
                  </p>
                </div>

                <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-br from-indigo-500/5 to-transparent rounded-full -mr-8 -mt-8 group-hover:opacity-100 opacity-0 transition-opacity" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
