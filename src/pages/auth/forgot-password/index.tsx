import { Field } from "@/components/ui/Field";
import { validators } from "@/utils/validators";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { Steps } from "primereact/steps";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    contact: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const stepItems = [
    { label: "Xác minh" },
    { label: "OTP" },
    { label: "Mật khẩu mới" },
  ];

  const handleSendOTP = () => {
    if (validators.isEmpty(formData.contact)) {
      setErrors({ contact: "Vui lòng nhập Email hoặc Số điện thoại" });
      return;
    }
    setErrors({});
    setLoading(true);
    // Giả lập API
    setTimeout(() => {
      setLoading(false);
      setActiveStep(1);
    }, 1500);
  };

  const handleVerifyOTP = () => {
    if (formData.otpCode.length < 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setActiveStep(2);
    }, 1000);
  };

  const handleResetPassword = () => {
    const newErrors: any = {};
    if (!validators.isValidPassword(formData.newPassword)) {
      newErrors.newPassword = "Mật khẩu tối thiểu 6 ký tự";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    // Logic gọi API đổi mật khẩu ở đây
  };

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-4xl font-black text-slate-800 dark:text-white m-0 mb-2  ">
          Quên mật khẩu
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">
          {activeStep === 0 && "Nhập thông tin để tìm lại tài khoản của bạn"}
          {activeStep === 1 && "Nhập mã xác thực chúng tôi vừa gửi"}
          {activeStep === 2 && "Thiết lập mật khẩu mới an toàn hơn"}
        </p>
      </div>

      {/* Steps */}
      <div className="mb-8 scale-95 origin-left">
        <Steps
          model={stepItems}
          activeIndex={activeStep}
          readOnly
          className="custom-steps-small"
        />
      </div>

      <div className="flex-1 flex flex-col">
        {/* BƯỚC 0: NHẬP THÔNG TIN LIÊN HỆ */}
        {activeStep === 0 && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <Field
              label="Email hoặc Số điện thoại"
              error={errors.contact}
              required
            >
              <IconField iconPosition="left">
                <InputIcon className="pi pi-user" />
                <InputText
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  placeholder="example@gmail.com hoặc 0912..."
                  className={`w-full pl-10 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.contact ? "ring-2 ring-red-500" : ""}`}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                />
              </IconField>
            </Field>

            <Button
              label={loading ? "Đang gửi mã..." : "Tiếp tục xác thực"}
              icon={!loading && "pi pi-send"}
              iconPos="right"
              className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20"
              onClick={handleSendOTP}
              loading={loading}
            />

            <div className="text-center mt-2">
              <Link
                to="/login"
                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <i className="pi pi-arrow-left mr-2 text-xs"></i>
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        )}

        {/* BƯỚC 1: XÁC THỰC OTP */}
        {activeStep === 1 && (
          <div className="flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
            <div className="text-center bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 w-full">
              <p className="text-sm text-slate-600 dark:text-slate-400 m-0">
                Mã OTP đã được gửi tới: <br />
                <b className="text-indigo-600 dark:text-indigo-400">
                  {formData.contact}
                </b>
              </p>
            </div>

            <InputOtp
              value={formData.otpCode}
              onChange={(e) =>
                setFormData({ ...formData, otpCode: e.value as string })
              }
              length={6}
              integerOnly
              pt={{
                input: {
                  className:
                    "w-12 h-14 text-2xl font-bold rounded-xl border-2 border-slate-200 focus:border-indigo-600 dark:bg-slate-900",
                },
              }}
            />

            <div className="flex flex-col gap-3 w-full">
              <Button
                label={loading ? "Đang xác thực..." : "Xác thực mã OTP"}
                className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold shadow-lg"
                onClick={handleVerifyOTP}
                disabled={formData.otpCode.length < 6}
                loading={loading}
              />
              <Button
                label="Gửi lại mã"
                icon="pi pi-refresh"
                text
                className="text-indigo-600 font-bold"
                onClick={handleSendOTP}
              />
              <Button
                label="Thay đổi thông tin liên hệ"
                icon="pi pi-arrow-left"
                outlined
                className="rounded-2xl border-slate-200"
                onClick={() => setActiveStep(0)}
              />
            </div>
          </div>
        )}

        {/* BƯỚC 2: THIẾT LẬP MẬT KHẨU MỚI */}
        {activeStep === 2 && (
          <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <Field label="Mật khẩu mới" error={errors.newPassword} required>
              <IconField iconPosition="left">
                <InputIcon className="pi pi-lock" />
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full pl-10 pr-10 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.newPassword ? "ring-2 ring-red-500" : ""}`}
                />
                <i
                  className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </IconField>
            </Field>

            <Field
              label="Xác nhận mật khẩu"
              error={errors.confirmPassword}
              required
            >
              <IconField iconPosition="left">
                <InputIcon className="pi pi-lock" />
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full pl-10 py-3.5 bg-slate-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}`}
                />
              </IconField>
            </Field>

            <Button
              label={loading ? "Đang cập nhật..." : "Đổi mật khẩu ngay"}
              icon="pi pi-check-circle"
              className="w-full py-4 bg-indigo-600 border-none rounded-2xl font-bold text-lg shadow-xl shadow-indigo-500/20"
              onClick={handleResetPassword}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
