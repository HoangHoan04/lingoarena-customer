import Logo from "@/components/layout/Logo";
import SendEmailComponent from "@/components/layout/SendEmailFrom";
import { Link } from "react-router-dom";

const FOOTER_LINKS = {
  EXAMS: [
    { idx: 1, label: "IELTS Mastery", path: "/exams/ielts" },
    { idx: 2, label: "TOEIC Đột phá", path: "/exams/toeic" },
    { idx: 3, label: "Giao tiếp hằng ngày", path: "/courses/communication" },
    { idx: 4, label: "Ngữ pháp cơ bản", path: "/courses/grammar" },
  ],
  FEATURES: [
    { idx: 1, label: "Đấu trường 1vs1", path: "/arena" },
    { idx: 2, label: "Bảng xếp hạng", path: "/leaderboard" },
    { idx: 3, label: "Lộ trình AI", path: "/learning-path" },
    { idx: 4, label: "Thư viện tài liệu", path: "/library" },
  ],
  LEGAL: [
    { idx: 1, label: "Chính sách bảo mật", path: "/privacy-policy" },
    { idx: 2, label: "Điều khoản dịch vụ", path: "/terms" },
    { idx: 3, label: "Sitemap", path: "/sitemap" },
  ],
};

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0f172a] text-white overflow-hidden border-t border-white/5">
      <SendEmailComponent />
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600 blur-[100px]" />
      </div>

      {/* 2. Watermark Icons */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-10 left-10 text-[180px] rotate-12">
          <i className="pi pi-book"></i>
        </div>
        <div className="absolute bottom-10 right-20 text-[150px] -rotate-12">
          <i className="pi pi-bolt"></i>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* CỘT 1: GIỚI THIỆU & SOCIAL */}
          <div className="md:col-span-4 space-y-6">
            <Logo size="md" />
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm font-medium">
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
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400 hover:bg-cyan-400/10 transition-all flex items-center justify-center group"
                >
                  <i
                    className={`pi pi-${social} text-slate-400 group-hover:text-cyan-400 transition-colors`}
                  ></i>
                </a>
              ))}
            </div>
          </div>

          {/* CỘT 2: LUYỆN THI */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-lg">Luyện thi</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.EXAMS.map((item) => (
                <li key={item.idx}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-cyan-400 transition-all text-sm font-bold flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-cyan-400 text-xs">
                      ▶
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 3: TÍNH NĂNG */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold mb-6 text-lg">Hệ thống</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.FEATURES.map((item) => (
                <li key={item.idx}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-cyan-400 transition-all text-sm font-bold flex items-center group"
                  >
                    <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300 text-cyan-400 text-xs">
                      ▶
                    </span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CỘT 4: LIÊN HỆ */}
          <div className="md:col-span-4 space-y-6">
            <h3 className="text-white font-bold mb-6 text-lg">
              Liên hệ trợ giúp
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <i className="pi pi-phone text-sm"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase text-slate-500">
                    Hotline 24/7
                  </span>
                  <span className="text-sm text-white">1900 123 456</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-slate-400 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                  <i className="pi pi-envelope text-sm"></i>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase text-slate-500">
                    Email hỗ trợ
                  </span>
                  <span className="text-sm font-bold text-white">
                    support@lingoarena.com
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        {/* BOTTOM BAR */}
        <div className="pt-8 mt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright & Team Info */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs md:text-sm text-slate-500 font-medium tracking-wide text-center md:text-left">
              © {currentYear}{" "}
              <span className="text-white font-bold">LingoArena</span>. All
              rights reserved.
            </p>
            <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-slate-600 font-bold ">
              <span className="w-8 h-px bg-slate-800"></span>
              Developed by Team Real-time
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex items-center gap-6 md:gap-8">
            {FOOTER_LINKS.LEGAL.map((item) => (
              <Link
                key={item.idx}
                to={item.path}
                className="text-[11px] md:text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors duration-300 relative group"
              >
                {item.label}
                {/* Đường gạch chân trang trí khi hover */}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
