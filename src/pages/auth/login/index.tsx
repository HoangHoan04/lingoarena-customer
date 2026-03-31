import { FacebookIcon, GoogleIcon, ZaloIcon } from "@/assets/icons";
import SocialButton from "@/components/layout/SocialButton";
import FancyDivider from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { AUTH_ROUTES } from "@/routes/routes";
import {
  getMe,
  loginNormal,
  loginWithGoogle,
  loginWithZalo,
} from "@/services/auth.service";
import tokenCache from "@/utils/token-cache";
import { validators } from "@/utils/validators";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";

import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginScreen() {
  const { showToast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleLoginSuccess = async (data: any) => {
    if (data?.accessToken) {
      tokenCache.setAuthData(data.accessToken, data.refreshToken, data.user);
      try {
        const userInfoRes = await getMe();
        if (userInfoRes && userInfoRes.user) {
          tokenCache.updateUser(userInfoRes.user);
        }
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }

      showToast({
        type: "success",
        title: "Thành công",
        message: "Đăng nhập thành công",
      });

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (validators.isEmpty(username)) {
      newErrors.username = "Vui lòng nhập tài khoản";
      valid = false;
    }
    if (validators.isEmpty(password)) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }
    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    try {
      const res = await loginNormal({ username, password });
      if (res && res.accessToken) {
        handleLoginSuccess(res);
      } else {
        showToast({
          type: "error",
          title: "Lỗi",
          message: res?.message || "Đăng nhập thất bại",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await loginWithGoogle(tokenResponse.access_token);
        if (res && res.accessToken) handleLoginSuccess(res);
      } catch (error: any) {
        showToast({
          type: "error",
          title: "Lỗi Google",
          message: `Đăng nhập Google thất bại ${error?.response?.data?.message || ""}`,
        });
      }
    },
  });

  const handleZaloLogin = () => {
    const ZALO_APP_ID = import.meta.env.VITE_ZALO_APP_ID;
    const REDIRECT_URI = window.location.origin + "/zalo-callback";
    const zaloAuthUrl = `https://oauth.zaloapp.com/v4/permission?app_id=${ZALO_APP_ID}&redirect_uri=${REDIRECT_URI}&state=${Date.now()}`;
    const width = 600;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      zaloAuthUrl,
      "Zalo Login",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    const messageListener = async (event: MessageEvent) => {
      if (event.data?.type === "ZALO_AUTH_CODE") {
        const code = event.data.code;
        window.removeEventListener("message", messageListener);
        try {
          const res = await loginWithZalo(code);
          if (res && res.accessToken) handleLoginSuccess(res);
        } catch (error: any) {
          showToast({
            type: "error",
            title: "Lỗi Zalo",
            message: `Lỗi đăng nhập Zalo ${error?.response?.data?.message || ""}`,
          });
        }
      }
    };
    window.addEventListener("message", messageListener);
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-8">
        <h3 className="text-4xl font-black text-slate-800 dark:text-white m-0 mb-2   text-left">
          Đăng nhập
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Chào mừng bạn quay trở lại với{" "}
          <span className="text-indigo-600 font-bold">LINGOARENA</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500"
      >
        <Field label="Tên đăng nhập" error={errors.username} required>
          <div className="relative">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email hoặc số điện thoại"
              className={`w-full pl-10 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.username ? "ring-2 ring-red-500" : ""}`}
            />
          </div>
        </Field>

        <Field label="Mật khẩu" error={errors.password} required>
          <div className="relative">
            <InputText
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className={`w-full pl-10 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.password ? "ring-2 ring-red-500" : ""}`}
            />
            <i
              className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 hover:text-indigo-600 transition-colors`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </Field>

        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked || false)}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-bold text-slate-600 dark:text-slate-400 cursor-pointer select-none"
            >
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link
            to={AUTH_ROUTES.FORGOT_PASSWORD}
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          label={loading ? "Đang xử lý..." : "Đăng nhập ngay"}
          icon={!loading && "pi pi-arrow-right"}
          iconPos="right"
          disabled={loading}
          className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20 mt-2 hover:bg-indigo-700 transition-all"
        />

        <FancyDivider className="py-2">Hoặc đăng nhập với</FancyDivider>

        <div className="flex gap-3">
          <SocialButton icon={GoogleIcon} onClick={() => handleGoogleLogin()} />

          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID}
            scope="public_profile,email"
            onSuccess={handleLoginSuccess}
            render={({ onClick }) => (
              <SocialButton icon={FacebookIcon} onClick={onClick} />
            )}
          />

          <SocialButton icon={ZaloIcon} onClick={handleZaloLogin} />
        </div>

        <p className="text-center mt-6 text-sm text-slate-500 font-medium">
          Chưa có tài khoản?{" "}
          <Link
            to={AUTH_ROUTES.REGISTER}
            className="text-indigo-600 font-bold hover:underline ml-1"
          >
            Đăng ký thành viên
          </Link>
        </p>
      </form>
    </div>
  );
}
