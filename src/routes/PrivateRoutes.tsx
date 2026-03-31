import { Navigate, Outlet } from "react-router-dom";
import tokenCache from "@/utils/token-cache";
import { AUTH_ROUTES } from "./routes";
import { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useToast } from "@/context";

function UnauthorizedScreen() {
  const [countdown, setCountdown] = useState(10);
  const [leaving, setLeaving] = useState(false);
  const { showToast } = useToast();
  const toastShown = useRef(false);
  useEffect(() => {
    if (!toastShown.current) {
      toastShown.current = true;
      showToast({
        type: "warn",
        title: "Chưa đăng nhập",
        message:
          "Bạn cần đăng nhập để truy cập trang này. Đang chuyển hướng...",
        timeout: 10000,
      });
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLeaving(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (leaving) {
    return <Navigate to={AUTH_ROUTES.LOGIN} replace />;
  }

  const progress = (countdown / 10) * 100;
  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-dvh flex items-center justify-center p-6 relative overflow-hidden">
      <div
        className="absolute top-[15%] left-[10%] w-96 h-96 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[15%] right-[10%] w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-md text-center rounded-[28px] px-12 py-14"
        style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
          animation: "fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(32px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes pulse-ring {
            0%   { transform: scale(1);   opacity: 0.4; }
            50%  { transform: scale(1.1); opacity: 0.15; }
            100% { transform: scale(1);   opacity: 0.4; }
          }
        `}</style>

        {/* Lock icon */}
        <div
          className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.05))",
            border: "1px solid rgba(239,68,68,0.3)",
            animation: "pulse-ring 2s ease-in-out infinite",
          }}
        >
          <i className="pi pi-lock text-red-400 text-3xl" />
        </div>

        {/* Title */}
        <h1 className="text-[26px] font-bold text-slate-100 mb-3 tracking-tight">
          Bạn chưa đăng nhập
        </h1>

        {/* Description */}
        <p className="text-[15px] text-slate-400 mb-10 leading-relaxed">
          Trang <strong className="text-indigo-300">Đấu trường</strong> yêu cầu
          đăng nhập.
          <br />
          Bạn sẽ được chuyển đến trang đăng nhập sau:
        </p>

        {/* Countdown ring */}
        <div className="relative w-[100px] h-[100px] mx-auto mb-9">
          <svg width="100" height="100" style={{ transform: "rotate(-90deg)" }}>
            <defs>
              <linearGradient
                id="countdownGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
              >
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="url(#countdownGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-[30px] font-extrabold leading-none"
              style={{
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {countdown}
            </span>
            <span className="text-[11px] text-slate-500 mt-0.5">giây</span>
          </div>
        </div>

        {/* Login button — PrimeReact */}
        <Button
          label="Đăng nhập ngay"
          icon="pi pi-sign-in"
          onClick={() => setLeaving(true)}
          className="w-full font-semibold text-[15px] rounded-[14px] border-none"
          style={{
            padding: "14px 28px",
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            boxShadow: "0 8px 24px rgba(99,102,241,0.4)",
            letterSpacing: "0.3px",
          }}
        />

        {/* Back link */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 mt-4 text-[13px] text-slate-500 no-underline transition-colors hover:text-slate-400"
        >
          <i className="pi pi-arrow-left text-xs" />
          Quay về trang chủ
        </a>
      </div>
    </div>
  );
}

export default function PrivateRoute() {
  const isAuthenticated = tokenCache.isAuthenticated();

  if (!isAuthenticated) {
    return <UnauthorizedScreen />;
  }

  return <Outlet />;
}
