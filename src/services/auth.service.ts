import type {
  UserLoginDto,
  AuthResponse,
  ZaloLoginDto,
  GoogleLoginDto,
  FacebookLoginDto,
  CheckPhoneEmailDto,
  SendOtpCustomerDto,
  SendOtpVerifyDto,
  RegisterCustomerDto,
  ForgotPasswordCustomerDto,
  VerifyLoginOtpDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  ChangePasswordDto,
} from "@/dto";
import { API_ENDPOINTS } from "./api-route";
import apiService from "./api.service";

/** Đăng nhập thông thường */
export const loginNormal = async (data: UserLoginDto) => {
  return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
};

/** Đăng nhập Zalo */
export const loginWithZalo = async (data: ZaloLoginDto) => {
  return apiService.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN_WITH_ZALO,
    data,
  );
};

/** Đăng nhập Google */
export const loginWithGoogle = async (data: GoogleLoginDto) => {
  return apiService.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN_WITH_GOOGLE,
    data,
  );
};

/** Đăng nhập Facebook */
export const loginWithFacebook = async (data: FacebookLoginDto) => {
  return apiService.post<AuthResponse>(
    API_ENDPOINTS.AUTH.LOGIN_WITH_FACEBOOK,
    data,
  );
};

/** Kiểm tra số điện thoại hoặc email tồn tại */
export const checkPhoneEmail = async (
  data: CheckPhoneEmailDto,
): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.CHECK_PHONE_EMAIL, data);
};

/** Gửi OTP cho khách hàng mới (đăng ký) */
export const sendOtpCustomer = async (
  data: SendOtpCustomerDto,
): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
};

/** Gửi OTP xác thực (quên mật khẩu / verify) */
export const sendOtpVerify = async (data: SendOtpVerifyDto): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.SEND_OTP_VERIFY, data);
};

/** Đăng ký khách hàng mới */
export const registerCustomer = async (
  data: RegisterCustomerDto,
): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.REGISTER, data);
};

/** Quên mật khẩu */
export const forgotPassword = async (
  data: ForgotPasswordCustomerDto,
): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
};

/** Xác thực OTP login */
export const verifyLoginOtp = async (data: VerifyLoginOtpDto) => {
  return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
};

/** Làm mới token */
export const refreshToken = async (data: RefreshTokenDto) => {
  return apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
};

/** Cập nhật mật khẩu (khi đã login - có mật khẩu cũ) */
export const updatePassword = async (data: UpdatePasswordDto): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
};

/** Đổi mật khẩu */
export const changePassword = async (data: ChangePasswordDto): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
};

/** Lấy thông tin cá nhân */
export const getMe = async (): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.ME);
};

/** Đăng xuất */
export const logout = async (): Promise<any> => {
  return apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
};
