import { FacebookIcon, GoogleIcon, ZaloIcon } from "@/assets/icons";
import SocialButton from "@/components/layout/SocialButton/SocialButton";
import FancyDivider from "@/components/ui/Divider";
import { Field } from "@/components/ui/Field";
import { useToast } from "@/context/ToastContext";
import { useRouter } from "@/routes/hooks";
import { AUTH_ROUTES, PUBLIC_ROUTES } from "@/routes/routes";
import {
  loginNormal,
  registerCustomer,
  sendOtpCustomer,
} from "@/services/auth.service";
import { tokenCache, validators } from "@/utils";
import { Button } from "primereact/button";

import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Steps } from "primereact/steps";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "male",
    password: "",
    confirmPassword: "",
    sendMethod: "EMAIL",
    otpCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  const stepItems = [{ label: "Thông tin" }, { label: "Xác thực" }];

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (validators.isEmpty(registerData.name)) {
      newErrors.name = "Vui lòng nhập họ và tên";
      isValid = false;
    }
    if (!validators.isValidPhone(registerData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }
    if (!validators.isValidEmail(registerData.email)) {
      newErrors.email = "Email không đúng định dạng";
      isValid = false;
    }
    if (!validators.isValidPassword(registerData.password)) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
      isValid = false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const method = registerData.sendMethod === "phone" ? "ZALO" : "EMAIL";
      await sendOtpCustomer({
        phone: registerData.phone,
        email: registerData.email,
        sendMethod: method,
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: `OTP đã gửi qua ${registerData.sendMethod === "phone" ? "Zalo" : "Email"}`,
      });
      setActiveStep(1);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.otpCode || registerData.otpCode.length < 6) return;
    setLoading(true);
    try {
      const method = registerData.sendMethod === "phone" ? "ZALO" : "EMAIL";
      await registerCustomer({ ...registerData, sendMethod: method });

      const loginRes = (await loginNormal({
        username: registerData.phone,
        password: registerData.password,
      })) as any;

      if (loginRes?.accessToken) {
        tokenCache.setAuthData(
          loginRes.accessToken,
          loginRes.refreshToken,
          loginRes.user,
        );
        showToast({
          type: "success",
          title: "Thành công",
          message: "Đăng ký hoàn tất!",
        });
        router.push(PUBLIC_ROUTES.HOME);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message || "Đăng ký thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="mb-6">
        <h3 className="text-4xl font-black text-slate-800 dark:text-white m-0 mb-2  ">
          Đăng ký
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Tham gia cộng đồng học thuật{" "}
          <span className="text-indigo-600 font-bold">LingoArena</span>
        </p>
      </div>

      <div className="mb-8 scale-95 origin-left">
        <Steps
          model={stepItems}
          activeIndex={activeStep}
          readOnly
          className="custom-steps-small"
        />
      </div>

      {activeStep === 0 ? (
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
          <Field label="Họ và tên" error={errors.name} required>
            <div className="relative">
              <InputText
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                placeholder="Nguyễn Văn A"
                className={`w-full pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.name ? "ring-2 ring-red-500" : ""}`}
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Số điện thoại" error={errors.phone} required>
              <div className="relative">
                <InputText
                  value={registerData.phone}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, phone: e.target.value })
                  }
                  placeholder="0912345678"
                  className="w-full pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl"
                />
              </div>
            </Field>
            <Field label="Email" error={errors.email} required>
              <div className="relative">
                <InputText
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  placeholder="name@example.com"
                  className="w-full pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl"
                />
              </div>
            </Field>
          </div>

          <Field label="Giới tính">
            <div className="flex gap-6 p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl">
              {[
                { v: "male", l: "Nam" },
                { v: "female", l: "Nữ" },
                { v: "other", l: "Khác" },
              ].map((g) => (
                <div
                  key={g.v}
                  className="flex items-center gap-2 cursor-pointer grow justify-center"
                >
                  <RadioButton
                    inputId={g.v}
                    value={g.v}
                    checked={registerData.gender === g.v}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, gender: e.value })
                    }
                  />
                  <label
                    htmlFor={g.v}
                    className="text-sm font-bold cursor-pointer text-slate-600 dark:text-slate-300"
                  >
                    {g.l}
                  </label>
                </div>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Mật khẩu" error={errors.password} required>
              <div className="relative">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••"
                  className="w-full pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl"
                />
                <i
                  className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </Field>
            <Field label="Xác nhận" error={errors.confirmPassword} required>
              <div className="relative">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••"
                  className="w-full pl-10 py-3 bg-slate-50 dark:bg-slate-900 border-none rounded-xl"
                />
              </div>
            </Field>
          </div>

          <Field label="Nhận mã OTP qua:">
            <div className="flex gap-3">
              {[
                { m: "EMAIL", i: "pi-envelope", l: "Email" },
                { m: "phone", i: "pi-mobile", l: "Zalo/SMS" },
              ].map((item) => (
                <div
                  key={item.m}
                  onClick={() =>
                    setRegisterData({ ...registerData, sendMethod: item.m })
                  }
                  className={`flex-1 p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2 font-bold text-sm ${registerData.sendMethod === item.m ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600" : "border-slate-100 dark:border-slate-800 text-slate-500"}`}
                >
                  <i className={`pi ${item.i}`}></i> {item.l}
                </div>
              ))}
            </div>
          </Field>

          <Button
            label={loading ? "Đang xử lý..." : "Tiếp tục"}
            className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold shadow-xl shadow-indigo-500/20 mt-2"
            onClick={handleSendOTP}
            loading={loading}
          />

          <FancyDivider className="py-2">Hoặc đăng nhập với</FancyDivider>

          <div className="flex gap-3">
            <SocialButton icon={GoogleIcon} label="Google" />
            <SocialButton icon={FacebookIcon} label="Facebook" />
            <SocialButton icon={ZaloIcon} label="Zalo" />
          </div>

          <p className="text-center mt-4 text-sm text-slate-500 font-medium">
            Đã có tài khoản?{" "}
            <Link
              to={AUTH_ROUTES.LOGIN}
              className="text-indigo-600 font-bold hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300 py-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-900 shadow-lg">
              <i className="pi pi-shield text-4xl text-indigo-600 animate-pulse"></i>
            </div>
            <h4 className="text-2xl font-black mb-2 text-slate-800 dark:text-white uppercase italic">
              Xác thực OTP
            </h4>
            <p className="text-sm text-slate-500">
              Mã 6 số đã được gửi đến: <br />
              <span className="font-bold text-indigo-600">
                {registerData.sendMethod === "phone"
                  ? registerData.phone
                  : registerData.email}
              </span>
            </p>
          </div>

          <InputOtp
            value={registerData.otpCode}
            onChange={(e) =>
              setRegisterData({ ...registerData, otpCode: e.value as string })
            }
            length={6}
            integerOnly
            pt={{
              input: {
                className:
                  "w-12 h-14 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-600 dark:bg-slate-900 dark:border-slate-700",
              },
            }}
          />

          <div className="w-full flex flex-col gap-3">
            <Button
              label={loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold shadow-lg shadow-indigo-500/20"
              onClick={handleRegister}
              disabled={registerData.otpCode.length < 6}
              loading={loading}
            />
            <div className="flex flex-col gap-1">
              <Button
                label="Gửi lại mã"
                icon="pi pi-refresh"
                text
                className="text-indigo-600 font-bold text-sm"
                onClick={handleSendOTP}
              />
              <Button
                label="Quay lại sửa thông tin"
                icon="pi pi-arrow-left"
                outlined
                className="rounded-2xl border-slate-200 text-sm py-2"
                onClick={() => setActiveStep(0)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
