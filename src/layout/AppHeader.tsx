import LanguageSwitcher from "@/components/layout/LanguageSwitcher";
import Notification from "@/components/layout/Notification";
import ThemeToggle from "@/components/layout/ThemeToggle";
import UserMenu from "@/components/layout/UserMenu";
import Logo from "@/components/ui/Logo";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES, REQUIRE_AUTH_ROUTES } from "@/routes/routes";
import { useCallback, useMemo, useRef, useState } from "react";

type MenuItemType = {
  label: string;
  path?: string;
  children?: { label: string; path: string }[];
};

export default function AppHeader() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeMenu, setActiveMenu] = useState("/");
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const themeStyles = {
    headerBg: isDark ? "bg-[#0f172a]/90" : "bg-white",
    headerBorder: isDark ? "border-white/10" : "border-blue-50",
    headerShadow: isDark
      ? "shadow-none"
      : "shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)]",
    navText: isDark ? "text-slate-300" : "text-slate-600",
    navHover: isDark ? "hover:text-cyan-400" : "hover:text-indigo-600",
    activeBtn: isDark
      ? "bg-cyan-500/10 text-cyan-400"
      : "bg-indigo-600 text-white",
    dropdownBg: isDark ? "bg-[#1e293b]" : "bg-white",
  };

  const menuItems: MenuItemType[] = useMemo(
    () => [
      {
        label: "Khóa học",
        path: PUBLIC_ROUTES.COURSE,
        children: [
          { label: "IELTS", path: `${PUBLIC_ROUTES.COURSE}?cert=IELTS` },
          { label: "TOEIC", path: `${PUBLIC_ROUTES.COURSE}?cert=TOEIC` },
          { label: "APTIS", path: `${PUBLIC_ROUTES.COURSE}?cert=APTIS` },
          { label: "VSTEP", path: `${PUBLIC_ROUTES.COURSE}?cert=VSTEP` },
        ],
      },
      {
        label: "Bài tập",
        children: [
          { label: "IELTS", path: "/courses/ielts" },
          { label: "TOEIC", path: "/courses/toeic" },
          { label: "APTIS", path: "/courses/aptis" },
          { label: "VSTEP", path: "/courses/vstep" },
        ],
      },
      { label: "Lộ trình", path: PUBLIC_ROUTES.LEARNING_PATH },
      { label: "Đấu trường", path: REQUIRE_AUTH_ROUTES.ARENA },
      { label: "Bài viết", path: PUBLIC_ROUTES.BLOGS },
      {
        label: "Hỗ trợ",
        children: [
          { label: "Liên hệ", path: PUBLIC_ROUTES.CONTACT },
          { label: "FAQ", path: PUBLIC_ROUTES.FAQ },
          { label: "Về chúng tôi", path: PUBLIC_ROUTES.ABOUT },
        ],
      },
    ],
    [],
  );

  const handleMenuClick = useCallback(
    (path: string) => {
      setActiveMenu(path);
      router.push(path);
      setHoveredMenu(null);
    },
    [router],
  );

  return (
    <>
      <header
        className={`fixed z-100 transition-all duration-500 w-full ${themeStyles.headerBg} ${themeStyles.headerBorder} ${themeStyles.headerShadow}`}
      >
        <div
          className={`relative transition-all duration-300 rounded-b-2xl border backdrop-blur-md ${themeStyles.headerBg} ${themeStyles.headerBorder} ${themeStyles.headerShadow}`}
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <div
                className="flex items-center cursor-pointer shrink-0 transition-transform active:scale-95"
                onClick={() => router.push(PUBLIC_ROUTES.HOME)}
              >
                <Logo size="md" />
              </div>

              <nav className="hidden lg:flex items-center gap-1">
                {menuItems.map((item, index) => {
                  const hasChildren = item.children && item.children.length > 0;
                  const isActive =
                    item.path === activeMenu ||
                    item.children?.some((child) => child.path === activeMenu);

                  const isHovered = hoveredMenu === item.label;

                  return (
                    <div
                      key={index}
                      className="relative py-4 px-1"
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current)
                          clearTimeout(hoverTimeoutRef.current);
                        setHoveredMenu(item.label);
                      }}
                      onMouseLeave={() => {
                        hoverTimeoutRef.current = window.setTimeout(
                          () => setHoveredMenu(null),
                          200,
                        );
                      }}
                    >
                      <button
                        onClick={() => {
                          if (item.path) {
                            handleMenuClick(item.path);
                          }
                        }}
                        className={`
                          flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all duration-300
                          text-[14px] font-bold tracking-tight
                          ${hasChildren ? "cursor-default" : "cursor-pointer"}
                          ${
                            isActive
                              ? themeStyles.activeBtn
                              : `${themeStyles.navText} ${themeStyles.navHover} hover:bg-slate-50/50 dark:hover:bg-white/5`
                          }
                        `}
                      >
                        <span>{item.label}</span>
                      </button>

                      {hasChildren && isHovered && (
                        <div className="absolute top-12 left-0 min-w-55 pt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <div
                            className={`rounded-2xl border shadow-2xl overflow-hidden p-1.5 ${themeStyles.dropdownBg} ${themeStyles.headerBorder}`}
                          >
                            {item.children!.map((child, cIdx) => (
                              <button
                                key={cIdx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMenuClick(child.path);
                                }}
                                className={`
                                  w-full text-left px-4 py-3 text-[13px] font-bold rounded-xl transition-colors
                                  ${
                                    isDark
                                      ? "text-slate-400 hover:bg-white/5 hover:text-cyan-400"
                                      : "text-slate-500 hover:bg-indigo-50/50 hover:text-indigo-600"
                                  }
                                `}
                              >
                                {child.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
              <div
                className={`flex items-center gap-3 shrink-0 pl-4 border-l ${isDark ? "dark:border-white/10" : "border-slate-100"}`}
              >
                <Notification />
                <LanguageSwitcher />
                <ThemeToggle />
                <UserMenu
                  onLoginClick={() => router.push("/login")}
                  onRegisterClick={() => router.push("/register")}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
