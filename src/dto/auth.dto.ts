export interface UserLoginDto {
  username: string;
  password: string;
}

export interface ZaloLoginDto {
  code: string;
}

export interface GoogleLoginDto {
  idToken: string;
}

export interface FacebookLoginDto {
  accessToken: string;
}

export interface CheckPhoneEmailDto {
  identifier: string; // phone or email
}

export interface SendOtpCustomerDto {
  email?: string;
  phone?: string;
  sendMethod: string;
}

export interface SendOtpVerifyDto {
  identifier: string;
  method: string;
}

export interface RegisterCustomerDto {
  name: string;
  phone: string;
  email: string;
  gender?: string;
  password?: string;
  sendMethod: string;
  otpCode: string;
}

export interface ForgotPasswordCustomerDto {
  identifier: string;
  method: string;
  otpCode: string;
  newPassword: string;
}

export interface VerifyLoginOtpDto {
  identifier: string;
  method: string;
  otpCode: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  newPassword: string;
}

export interface AuthResponse {
  user: any;
  accessToken: string;
  refreshToken: string;
  message?: string;
}
