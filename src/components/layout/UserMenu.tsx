import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/routes/hooks";
import tokenCache from "@/utils/token-cache";
import { Avatar } from "primereact/avatar";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { useEffect, useMemo, useRef, useState } from "react";

interface UserMenuProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
}

export default function UserMenu({
  onLoginClick,
  onRegisterClick,
}: UserMenuProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = tokenCache.isAuthenticated();
  const currentUser = tokenCache.getUser();

  const userAvatarUrl = currentUser?.customer?.__avatar__?.[0]?.fileUrl;
  const displayName =
    currentUser?.customer?.name || currentUser?.username || "Guest";
  const avatarLabel = !userAvatarUrl
    ? (displayName?.[0] || "U").toUpperCase()
    : undefined;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userMenuItemsLoggedIn: MenuItem[] = useMemo(
    () => [
      {
        label: displayName,
        icon: "pi pi-fw pi-id-card",
        className: "font-bold text-indigo-600 dark:text-cyan-400",
      },
      { separator: true },
      {
        label: "Đơn hàng",
        icon: "pi pi-fw pi-shopping-bag",
        command: () => router.push("/my-orders"),
      },
      {
        label: "Tài khoản",
        icon: "pi pi-fw pi-user-edit",
        command: () => router.push("/profile"),
      },
      {
        label: "Mật khẩu",
        icon: "pi pi-fw pi-key",
        command: () => router.push("/change-password"),
      },
      { separator: true },
      {
        label: "Đăng xuất",
        icon: "pi pi-fw pi-sign-out text-red-500",
        command: () => {
          tokenCache.clear();
          window.location.reload();
        },
      },
    ],
    [displayName, router],
  );

  const userMenuItemsGuest: MenuItem[] = useMemo(
    () => [
      {
        label: "Đăng nhập",
        icon: "pi pi-fw pi-sign-in",
        command: onLoginClick,
      },
      {
        label: "Đăng ký",
        icon: "pi pi-fw pi-user-plus",
        command: onRegisterClick,
      },
    ],
    [onLoginClick, onRegisterClick],
  );

  return (
    <div ref={containerRef} className="flex items-center gap-3">
      <div className="relative">
        <div
          className={`
            p-0.5 rounded-full border-2 transition-all duration-300 cursor-pointer
            ${showUserMenu ? "border-indigo-500 scale-110" : "border-transparent hover:border-slate-200 dark:hover:border-white/10"}
          `}
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <Avatar
            image={userAvatarUrl}
            label={avatarLabel}
            shape="circle"
            className="w-8 h-8 flex shrink-0"
          />
        </div>

        {showUserMenu && (
          <div className="absolute right-0 mt-3 z-110 animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200">
            <Menu
              model={isLoggedIn ? userMenuItemsLoggedIn : userMenuItemsGuest}
              style={{ minWidth: "200px", border: "none" }}
              pt={{
                root: {
                  className: `!border-none !shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl p-1.5 ${isDark ? "bg-slate-900" : "bg-white"}`,
                },
                menuitem: { className: "p-0.5" },
                action: ({ item }: any) => ({
                  className: `    rounded-xl py-3 px-4 flex items-center transition-all${
                    item?.label === "Đăng xuất"
                      ? "hover:bg-red-50 dark:hover:bg-red-500/10"
                      : "hover:bg-indigo-50/50 dark:hover:bg-white/5"
                  }
                  `,
                }),
                label: ({ item }: any) => ({
                  className: `text-[13px] font-bold ${item?.label === "Đăng xuất" ? "text-red-500" : "text-slate-600 dark:text-slate-400"}`,
                }),
                icon: ({ item }: any) => ({
                  className: `mr-3 text-base ${item?.label === "Đăng xuất" ? "text-red-500" : "text-indigo-500 dark:text-cyan-400"}`,
                }),
                separator: {
                  className: `border-t my-1 ${isDark ? "border-white/5" : "border-slate-50"}`,
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
