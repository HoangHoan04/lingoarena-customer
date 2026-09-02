"use client";

import { Link, usePathname } from "@/i18n/routing";
import { VOCAB_RESERVED_SLUGS } from "@/lib/vocab";
import { cn } from "@/lib/utils";
import { BookMarked, Flame, Gamepad2, Layers3, Repeat, Search } from "lucide-react";

const TABS = [
  { href: "/vocabulary", label: "Bộ thẻ từ vựng", icon: Layers3, key: "decks" },
  { href: "/vocabulary/notebook", label: "Sổ tay SRS", icon: BookMarked, key: "notebook" },
  { href: "/vocabulary/dictionary", label: "Tra từ điển", icon: Search, key: "dictionary" },
  { href: "/vocabulary/games", label: "Trò chơi", icon: Gamepad2, key: "games" },
  { href: "/vocabulary/srs", label: "Phương pháp SRS", icon: Repeat, key: "srs" },
] as const;

function activeKey(pathname: string) {
  if (pathname.startsWith("/vocabulary/notebook")) return "notebook";
  if (pathname.startsWith("/vocabulary/dictionary")) return "dictionary";
  if (pathname.startsWith("/vocabulary/games")) return "games";
  if (pathname.startsWith("/vocabulary/srs")) return "srs";
  if (pathname.startsWith("/vocabulary/review")) return "review";
  if (pathname === "/vocabulary" || pathname === "/vocabulary/") return "decks";
  const parts = pathname.split("/").filter(Boolean);
  const slug = parts[1];
  if (slug && !VOCAB_RESERVED_SLUGS.includes(slug)) return "decks";
  return "decks";
}

export default function VocabSubnav() {
  const pathname = usePathname() || "/vocabulary";
  const current = activeKey(pathname);

  return (
    <nav className="sticky top-16 sm:top-20 z-20 py-2 -mx-4 sm:mx-0 px-4 sm:px-0">
      <div className="flex items-center justify-between gap-2 p-1.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = current === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={cn(
                  "inline-flex items-center gap-2 shrink-0 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 select-none",
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800",
                )}
              >
                <Icon className={cn("size-4", active ? "text-white" : "text-slate-400 dark:text-slate-500")} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Quick Review Action */}
        <div className="hidden lg:flex items-center shrink-0 pr-1">
          <Link
            href="/vocabulary/review"
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all",
              current === "review"
                ? "bg-amber-500 text-white shadow-sm"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border border-amber-500/20",
            )}
          >
            <Flame className="size-3.5 fill-current" />
            <span>Ôn thẻ đến hạn</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
