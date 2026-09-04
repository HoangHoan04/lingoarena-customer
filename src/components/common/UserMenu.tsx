"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { Link, useRouter } from "@/i18n/routing";
import { Bell, GraduationCap, LogOut, User as UserIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = () => {
    if (!mounted || !isAuthenticated || !user) {
      return "US";
    }
    const cleanName = (user.name || user.email || "US").trim();
    if (cleanName.length <= 2) return cleanName.toUpperCase();
    const parts = cleanName.split(" ").filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return cleanName.slice(0, 2).toUpperCase();
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            className="relative size-9 rounded-full p-0 flex items-center justify-center border border-slate-200 dark:border-slate-800 overflow-hidden cursor-pointer shrink-0 hover:border-brand/50 transition-colors"
          >
            <Avatar className="size-8">
              {user?.avatarUrl ? <AvatarImage src={user.avatarUrl} /> : null}
              <AvatarFallback className="bg-brand/10 text-brand dark:text-[#7b9bee] font-bold text-xs flex items-center justify-center size-full">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </Button>
        }
      />

      <PopoverContent
        align="end"
        className="w-56 p-3 flex flex-col gap-2 z-50 border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl text-foreground shadow-2xl rounded-2xl"
      >
        {mounted && isAuthenticated && user ? (
          <>
            <div className="flex flex-col gap-0.5 px-1 py-0.5">
              <span className="text-xs font-bold text-foreground truncate">
                {user.name || user.email || "Người dùng LingoArena"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate">
                {user.email}
              </span>
            </div>

            <Separator />

            <div className="flex flex-col gap-0.5">
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/profile" />}
              >
                <UserIcon className="size-3.5" />
                <span>Hồ sơ cá nhân</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/classes" />}
              >
                <GraduationCap className="size-3.5" />
                <span>Lớp học</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
                nativeButton={false}
                render={<Link href="/notifications" />}
              >
                <Bell className="size-3.5" />
                <span>Thông báo</span>
              </Button>
            </div>

            <Separator />

            <Button
              variant="ghost"
              className="w-full flex items-center justify-start gap-2 px-2 py-1.5 h-8 text-xs font-medium cursor-pointer rounded-lg text-rose-500 hover:bg-rose-500/10 hover:text-rose-600"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              <LogOut className="size-3.5" />
              <span>{loggingOut ? "Đang đăng xuất..." : "Đăng xuất"}</span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-2 p-1">
            <Button
              variant="ghost"
              className="w-full h-9 text-xs font-bold cursor-pointer rounded-xl"
              nativeButton={false}
              render={<Link href="/login" />}
            >
              Đăng nhập
            </Button>
            <Button
              className="w-full h-9 text-xs font-bold cursor-pointer bg-brand hover:bg-[#1e2f5e] text-white rounded-xl shadow-md shadow-brand/20"
              nativeButton={false}
              render={<Link href="/register" />}
            >
              Đăng ký tài khoản
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
