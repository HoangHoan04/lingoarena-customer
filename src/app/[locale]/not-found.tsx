"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useMemo, useState } from "react";

const PLANETS = [
  {
    name: "Mercury",
    size: 8,
    dist: 45,
    speed: "4s",
    shading:
      "radial-gradient(circle at 35% 35%, #cfcfcf 0%, #636363 60%, #1a1a1a 100%)",
    glow: "rgba(184, 184, 184, 0.2)",
  },
  {
    name: "Venus",
    size: 12,
    dist: 65,
    speed: "7s",
    shading:
      "radial-gradient(circle at 35% 35%, #ffe4bd 0%, #ba7e3b 50%, #54330c 100%)",
    glow: "rgba(227, 187, 118, 0.2)",
  },
  {
    name: "Earth",
    size: 14,
    dist: 85,
    speed: "10s",
    shading:
      "radial-gradient(circle at 35% 35%, #7accff 0%, #1d69cc 50%, #051e3e 100%)",
    glow: "rgba(77, 150, 255, 0.3)",
  },
  {
    name: "Mars",
    size: 11,
    dist: 105,
    speed: "14s",
    shading:
      "radial-gradient(circle at 35% 35%, #ff9e9e 0%, #bf3434 55%, #420b0b 100%)",
    glow: "rgba(255, 107, 107, 0.2)",
  },
  {
    name: "Jupiter",
    size: 26,
    dist: 135,
    speed: "18s",
    shading:
      "radial-gradient(circle at 35% 35%, #f5dec6 0%, #a87644 40%, #6e431b 70%, #241202 100%)",
    glow: "rgba(204, 164, 126, 0.2)",
  },
  {
    name: "Saturn",
    size: 20,
    dist: 170,
    speed: "22s",
    shading:
      "radial-gradient(circle at 35% 35%, #fff0c2 0%, #b89142 55%, #3d2c0b 100%)",
    glow: "rgba(237, 209, 157, 0.15)",
    hasRing: true,
  },
  {
    name: "Uranus",
    size: 16,
    dist: 200,
    speed: "26s",
    shading:
      "radial-gradient(circle at 35% 35%, #bbf7ff 0%, #3ca2bd 55%, #0e3b47 100%)",
    glow: "rgba(112, 214, 255, 0.2)",
  },
  {
    name: "Neptune",
    size: 15,
    dist: 225,
    speed: "30s",
    shading:
      "radial-gradient(circle at 35% 35%, #7a9aff 0%, #223fbf 55%, #08113d 100%)",
    glow: "rgba(58, 134, 255, 0.2)",
  },
  {
    name: "Pluto",
    size: 7,
    dist: 245,
    speed: "35s",
    shading:
      "radial-gradient(circle at 35% 35%, #e6e6e6 0%, #808080 60%, #303030 100%)",
    glow: "rgba(166, 166, 166, 0.1)",
  },
];

export default function LocalNotFound() {
  const router = useRouter();
  const t = useTranslations("NotFound");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stars = useMemo(() => {
    return Array.from({ length: 60 }).map(() => {
      const size = Math.random() * 2 + 0.5;
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        "--d": `${(Math.random() * 3 + 2).toFixed(1)}s`,
        "--delay": `-${(Math.random() * 4).toFixed(1)}s`,
        "--op": `${(Math.random() * 0.5 + 0.3).toFixed(2)}`,
      } as React.CSSProperties;
    });
  }, []);

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center bg-background p-6 text-center overflow-hidden select-none font-sans transition-colors duration-300">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
        
        .font-syne { font-family: 'Syne', sans-serif; }
        
        @keyframes twinkle {
          from { opacity: 0.1; }
          to { opacity: var(--op, 0.7); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: translate(-50%, -50%) rotateZ(0deg) rotateX(-68deg); }
          to { transform: translate(-50%, -50%) rotateZ(-360deg) rotateX(-68deg); }
        }
        @keyframes galaxy-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }

        .animate-twinkle { animation: twinkle var(--d, 3s) ease-in-out infinite alternate; animation-delay: var(--delay, 0s); }
        .animate-spin-linear { animation: spin linear infinite; }
        .animate-counter-spin { animation: counter-spin linear infinite; }
        .animate-galaxy-float { animation: galaxy-float 4s ease-in-out infinite; }
        .animate-pulse-dot { animation: pulse-dot 1.6s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 pointer-events-none z-10">
        {mounted &&
          stars.map((style, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-slate-400 dark:bg-white animate-twinkle"
              style={style}
            />
          ))}
      </div>

      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-30 dark:opacity-50"
        style={{
          backgroundImage: `
            linear-gradient(rgba(99, 102, 241, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute top-[5%] w-100 h-100 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[80px] pointer-events-none z-10" />
      <div className="absolute bottom-[10%] w-87.5 h-87.5 rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[100px] pointer-events-none z-10" />

      <div className="relative z-20 flex flex-col items-center justify-center w-full max-w-150 gap-4">
        <div
          className="relative w-full h-70 flex items-center justify-center"
          style={{ perspective: "800px" }}
        >
          <div
            className="absolute w-0 h-0"
            style={{
              transform: "rotateX(68deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div
              className="absolute w-12.5 h-12.5 rounded-full"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, #ffffff 0%, #ffbb00 25%, #ff4500 65%, #6e0b00 100%)",
                boxShadow:
                  "0 0 30px #ff5100, 0 0 60px rgba(255, 69, 0, 0.6), 0 0 110px rgba(255, 187, 0, 0.4)",
                transform: "translate(-50%, -50%) rotateX(-68deg)",
              }}
            />

            {PLANETS.map((planet) => (
              <div
                key={planet.name}
                className="absolute top-1/2 left-1/2 border border-dashed border-slate-400/30 dark:border-indigo-200/15 rounded-full pointer-events-none"
                style={{
                  width: `${planet.dist * 2}px`,
                  height: `${planet.dist * 2}px`,
                  transform: "translate(-50%, -50%)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute w-full h-full animate-spin-linear"
                  style={{
                    animationDuration: planet.speed,
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 rounded-full animate-counter-spin"
                    style={{
                      width: `${planet.size}px`,
                      height: `${planet.size}px`,
                      background: planet.shading,
                      boxShadow: `0 0 12px ${planet.glow}`,
                      animationDuration: planet.speed,
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {planet.hasRing && (
                      <div
                        className="absolute top-1/2 left-1/2 w-10.5 h-2.5 border-[3px] border-amber-200/50 rounded-full pointer-events-none"
                        style={{
                          transform:
                            "translate(-50%, -50%) rotateX(70deg) rotateY(15deg)",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center text-center w-full">
          <div className="font-syne text-[80px] sm:text-[130px] font-extrabold tracking-tighter leading-none bg-linear-to-br from-foreground via-muted-foreground/80 to-muted-foreground/40 bg-clip-text text-transparent dark:from-white dark:via-zinc-300 dark:to-zinc-500 animate-galaxy-float">
            404
          </div>

          <h1 className="font-syne text-2xl font-bold text-foreground mt-4 mb-2">
            Không tìm thấy trang
          </h1>

          <Label className="text-[15px] text-muted-foreground max-w-85 leading-relaxed mb-7 font-normal">
            Rất tiếc, chúng tôi không thể tìm thấy trang bạn đang tìm kiếm. Hãy
            kiểm tra lại URL hoặc quay lại trang chủ để tiếp tục khám phá.
          </Label>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="cursor-pointer font-bold px-6 py-2.5 rounded-xl border border-border bg-background hover:bg-muted text-foreground transition-all duration-300 h-auto"
            >
              <ArrowLeft className="size-4" />
              Quay lại
            </Button>

            <Button
              onClick={() => router.push("/")}
              className="cursor-pointer font-bold px-6 py-2.5 rounded-xl bg-brand hover:bg-[#1e2f5e] text-white shadow-lg shadow-brand/20 transition-all duration-300 h-auto border-none"
            >
              <Send className="size-4" />
              Về trang chủ
            </Button>
          </div>

          <div className="flex gap-1.5 mt-6">
            <div className="size-1.5 rounded-full bg-orange-500/60 animate-pulse-dot" />
            <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse-dot [animation-delay:0.2s]" />
            <div className="size-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 animate-pulse-dot [animation-delay:0.4s]" />
          </div>
        </div>
      </div>
    </div>
  );
}
