import SendEmailComponent from "@/components/layout/SendEmailFrom";
import Logo from "@/components/ui/Logo";
import { useTheme } from "@/context";
import { PUBLIC_ROUTES, REQUIRE_AUTH_ROUTES } from "@/routes/routes";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  EXAMS: [
    { idx: 1, label: "IELTS Mastery", path: "/exams/ielts" },
    { idx: 2, label: "TOEIC Đột phá", path: "/exams/toeic" },
    { idx: 3, label: "Giao tiếp hằng ngày", path: "/courses/communication" },
    { idx: 4, label: "Ngữ pháp cơ bản", path: "/courses/grammar" },
  ],
  FEATURES: [
    { idx: 1, label: "Đấu trường 1vs1", path: REQUIRE_AUTH_ROUTES.ARENA },
    { idx: 2, label: "Bảng xếp hạng", path: "/leaderboard" },
    { idx: 3, label: "Lộ trình AI", path: "/road-map" },
    { idx: 4, label: "Thư viện tài liệu", path: "/library" },
  ],
  LEGAL: [
    {
      idx: 1,
      label: "Chính sách bảo mật",
      path: PUBLIC_ROUTES.PRIVACY_POLICY,
    },
    {
      idx: 2,
      label: "Điều khoản dịch vụ",
      path: PUBLIC_ROUTES.TERMS_OF_SERVICE,
    },
    { idx: 3, label: "Sitemap", path: "/sitemap" },
  ],
};

export default function AppFooter() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`relative overflow-hidden border-t transition-colors duration-500 
      ${isDark ? "bg-[#0f172a] text-white border-white/5" : "bg-[#f8fafc] text-slate-800 border-slate-200"}`}
    >
      <SendEmailComponent />
      <div
        className={`absolute inset-0 z-0 pointer-events-none transition-opacity duration-1000 
        ${isDark ? "opacity-20" : "opacity-10"}`}
      >
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500 blur-[100px]" />
      </div>

      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 
        ${isDark ? "opacity-[0.03]" : "opacity-[0.05]"}`}
      >
        <div className="absolute top-10 left-10 text-[180px] rotate-12">
          <i className="pi pi-book"></i>
        </div>
        <div className="absolute bottom-10 right-20 text-[150px] -rotate-12">
          <i className="pi pi-bolt"></i>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          <div className="md:col-span-4 space-y-6">
            <Logo size="md" />
            <p
              className={`leading-relaxed text-sm max-w-sm font-medium transition-colors 
              ${isDark ? "text-slate-400" : "text-slate-600"}`}
            >
              Hệ thống luyện thi thông minh bậc nhất. Chúng tôi cung cấp lộ
              trình cá nhân hóa giúp bạn chinh phục ngoại ngữ và bứt phá giới
              hạn bản thân.
            </p>
            <div className="flex space-x-4">
              {["facebook", "youtube", "linkedin", "twitter"].map((social) => (
                <a
                  key={social}
                  href={`https://${social}.com`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center group border 
                    ${
                      isDark
                        ? "bg-white/5 border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10"
                        : "bg-white border-slate-200 hover:border-blue-500 hover:bg-blue-50"
                    }`}
                >
                  <i
                    className={`pi pi-${social} transition-colors 
                    ${isDark ? "text-slate-400 group-hover:text-cyan-400" : "text-slate-500 group-hover:text-blue-600"}`}
                  ></i>
                </a>
              ))}
            </div>
          </div>

          {/* Cột 2: Luyện thi */}
          <div className="md:col-span-2">
            <h3
              className={`font-bold mb-6 text-lg transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Luyện thi
            </h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.EXAMS.map((item) => (
                <li key={item.idx}>
                  <Link
                    to={item.path}
                    className={`transition-all text-sm font-bold flex items-center group 
                      ${isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-500 hover:text-blue-600"}`}
                  >
                    <span
                      className={`w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-xs 
                      ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                    >
                      <i className="pi pi-arrow-right mr-2"></i>
                    </span>
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Hệ thống */}
          <div className="md:col-span-2">
            <h3
              className={`font-bold mb-6 text-lg transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Hệ thống
            </h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.FEATURES.map((item) => (
                <li key={item.idx}>
                  <Link
                    to={item.path}
                    className={`transition-all text-sm font-bold flex items-center group 
                      ${isDark ? "text-slate-400 hover:text-cyan-400" : "text-slate-500 hover:text-blue-600"}`}
                  >
                    <span
                      className={`w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-xs 
                      ${isDark ? "text-cyan-400" : "text-blue-600"}`}
                    >
                      <i className="pi pi-arrow-right mr-2"></i>
                    </span>
                    <span className="transition-all duration-300 group-hover:translate-x-1">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="md:col-span-4 space-y-6">
            <h3
              className={`font-bold mb-6 text-lg transition-colors ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Liên hệ trợ giúp
            </h3>
            <div className="space-y-4">
              {/* Phone */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border 
                  ${
                    isDark
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white"
                      : "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white"
                  }`}
                >
                  <i className="pi pi-phone text-sm"></i>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs uppercase font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Hotline 24/7
                  </span>
                  <span
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    1900 123 456
                  </span>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 group cursor-pointer">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all border 
                  ${
                    isDark
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white"
                      : "bg-cyan-50 text-cyan-600 border-cyan-100 group-hover:bg-cyan-600 group-hover:text-white"
                  }`}
                >
                  <i className="pi pi-envelope text-sm"></i>
                </div>
                <div className="flex flex-col">
                  <span
                    className={`text-xs uppercase font-bold ${isDark ? "text-slate-500" : "text-slate-400"}`}
                  >
                    Email hỗ trợ
                  </span>
                  <span
                    className={`text-sm font-bold ${isDark ? "text-white" : "text-slate-800"}`}
                  >
                    support@lingoarena.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div
          className={`pt-8 mt-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 
          ${isDark ? "border-white/5" : "border-slate-200"}`}
        >
          <div className="flex flex-col items-center md:items-start gap-1">
            <p
              className={`text-xs md:text-sm font-medium tracking-wide text-center md:text-left transition-colors 
              ${isDark ? "text-slate-500" : "text-slate-400"}`}
            >
              © {currentYear}{" "}
              <span
                className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}
              >
                LingoArena
              </span>
              . All rights reserved.
            </p>
            <div
              className={`flex items-center gap-2 text-[10px] md:text-[11px] font-bold transition-colors 
              ${isDark ? "text-slate-600" : "text-slate-400"}`}
            >
              <span
                className={`w-8 h-px ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
              ></span>
              Developed by Team Real-time
            </div>
          </div>

          <div className="flex items-center gap-6 md:gap-8">
            {FOOTER_LINKS.LEGAL.map((item) => (
              <Link
                key={item.idx}
                to={item.path}
                className={`text-[11px] md:text-xs font-bold uppercase tracking-widest transition-colors relative group 
                  ${isDark ? "text-slate-500 hover:text-cyan-400" : "text-slate-400 hover:text-blue-600"}`}
              >
                {item.label}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-px transition-all duration-300 group-hover:w-full 
                  ${isDark ? "bg-cyan-400" : "bg-blue-600"}`}
                ></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
