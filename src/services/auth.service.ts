import { extractApiData } from "@/lib/auth";
import apiService from "./api.service";
import API_ENDPOINTS from "./endpoint";

export interface LoginDto {
  email?: string;
  username?: string;
  password: string;
  deviceId?: string;
  deviceType?: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
  displayName?: string;
  phone?: string;
  /** Mã OTP xác thực email */
  otpCode?: string;
  /** Phương thức gửi OTP: EMAIL | SMS */
  sendMethod?: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileDto {
  fullName?: string;
  displayName?: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string | Date;
  /** Alias của dateOfBirth — backward compat với profile page */
  birthday?: string | Date;
  bio?: string;
  avatarUrl?: string;
  occupation?: string;
  schoolOrCompany?: string;
  school?: string;
  company?: string;
  preferredLanguage?: string;
  timezone?: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: string;
    email: string;
    fullName?: string;
    displayName?: string;
    roles?: string[];
    avatarUrl?: string;
    phone?: string;
    status?: string;
    profile?: {
      fullName?: string;
      displayName?: string;
      avatarUrl?: string;
    };
  };
}

function extractData<T>(res: any): T {
  return extractApiData<T>(res);
}

export const authService = {
  login: async (data: LoginDto): Promise<AuthResponseDto> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, data);
    return extractData<AuthResponseDto>(res);
  },

  register: async (data: RegisterDto): Promise<AuthResponseDto> => {
    const payload: Record<string, unknown> = {
      email: data.email.trim().toLowerCase(),
      password: data.password,
      fullName: data.fullName.trim(),
    };
    if (data.displayName) payload.displayName = data.displayName.trim();
    if (data.phone) payload.phone = data.phone.trim();
    if (data.otpCode) payload.otpCode = data.otpCode.trim();
    if (data.sendMethod) payload.sendMethod = data.sendMethod;

    const res = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, payload);
    return extractData<AuthResponseDto>(res);
  },

  /**
   * Gửi OTP đăng ký — purpose: EMAIL_VERIFICATION
   */
  sendOtpRegistration: async (email: string): Promise<{ message: string }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_SEND_OTP, {
      target: email.trim().toLowerCase(),
      purpose: "EMAIL_VERIFICATION",
    });
    return extractData<{ message: string }>(res);
  },

  /**
   * Gửi OTP forgot password — purpose: PASSWORD_RESET
   */
  sendOtp: async (
    target: string,
    purpose: string = "PASSWORD_RESET",
  ): Promise<{ message: string }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_SEND_OTP, {
      target: target.trim().toLowerCase(),
      purpose,
    });
    return extractData<{ message: string }>(res);
  },

  forgotPasswordSendOtp: async (email: string): Promise<{ message: string }> => {
    return authService.sendOtp(email, "PASSWORD_RESET");
  },

  forgotPasswordVerifyOtp: async (
    email: string,
    otp: string,
  ): Promise<{ message: string; verified: boolean }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_VERIFY_OTP, {
      target: email.trim().toLowerCase(),
      code: otp.trim(),
      purpose: "PASSWORD_RESET",
    });
    return extractData<{ message: string; verified: boolean }>(res);
  },

  forgotPasswordReset: async (
    email: string,
    otp: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD_RESET, {
      target: email.trim().toLowerCase(),
      code: otp.trim(),
      newPassword,
    });
    return extractData<{ message: string }>(res);
  },

  /**
   * Wrapper dùng trong useAuth — map từ { identifier, otpCode, newPassword }
   */
  forgotPassword: async (data: {
    identifier: string;
    otpCode: string;
    newPassword: string;
    method?: string;
  }): Promise<{ message: string }> => {
    return authService.forgotPasswordReset(data.identifier, data.otpCode, data.newPassword);
  },

  googleLogin: async (
    data: { idToken: string; deviceId?: string; deviceType?: string } | string,
  ): Promise<AuthResponseDto> => {
    const payload = typeof data === "string" ? { idToken: data } : data;
    const res = await apiService.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, payload);
    return extractData<AuthResponseDto>(res);
  },

  facebookLogin: async (
    data: { accessToken: string; deviceId?: string; deviceType?: string } | string,
  ): Promise<AuthResponseDto> => {
    const payload = typeof data === "string" ? { accessToken: data } : data;
    const res = await apiService.post(API_ENDPOINTS.AUTH.FACEBOOK_LOGIN, payload);
    return extractData<AuthResponseDto>(res);
  },

  updatePassword: async (data: UpdatePasswordDto): Promise<{ message: string }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
    return extractData<{ message: string }>(res);
  },

  getMe: async (): Promise<any> => {
    const res = await apiService.get(API_ENDPOINTS.AUTH.ME);
    return extractData<any>(res);
  },

  updateProfile: async (data: UpdateProfileDto): Promise<any> => {
    const res = await apiService.patch(API_ENDPOINTS.AUTH.PROFILE, data);
    return extractData<any>(res);
  },

  logout: async (refreshToken?: string): Promise<{ message?: string }> => {
    const res = await apiService.post(API_ENDPOINTS.AUTH.LOGOUT, {
      refreshToken,
    });
    return extractData<{ message?: string }>(res);
  },
};

export default authService;
