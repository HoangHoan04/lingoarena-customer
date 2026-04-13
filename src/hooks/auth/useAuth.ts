import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as authService from "@/services/auth.service";

import { tokenCache } from "@/utils";
import type {
  UserLoginDto,
  ZaloLoginDto,
  GoogleLoginDto,
  FacebookLoginDto,
  CheckPhoneEmailDto,
  SendOtpCustomerDto,
  SendOtpVerifyDto,
  RegisterCustomerDto,
  ForgotPasswordCustomerDto,
  VerifyLoginOtpDto,
  UpdatePasswordDto,
  ChangePasswordDto,
} from "@/dto";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UserLoginDto) => authService.loginNormal(data),
    onSuccess: (res: any) => {
      if (res.accessToken) {
        tokenCache.setAuthData(res.accessToken, res.refreshToken, res.user);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

export const useLoginWithZalo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ZaloLoginDto) => authService.loginWithZalo(data),
    onSuccess: (res: any) => {
      if (res.accessToken) {
        tokenCache.setAuthData(res.accessToken, res.refreshToken, res.user);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

export const useLoginWithGoogle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: GoogleLoginDto) => authService.loginWithGoogle(data),
    onSuccess: (res: any) => {
      if (res.accessToken) {
        tokenCache.setAuthData(res.accessToken, res.refreshToken, res.user);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

export const useLoginWithFacebook = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: FacebookLoginDto) => authService.loginWithFacebook(data),
    onSuccess: (res: any) => {
      if (res.accessToken) {
        tokenCache.setAuthData(res.accessToken, res.refreshToken, res.user);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

export const useCheckPhoneEmail = () => {
  return useMutation({
    mutationFn: (data: CheckPhoneEmailDto) => authService.checkPhoneEmail(data),
  });
};

export const useSendOtp = () => {
  return useMutation({
    mutationFn: (data: SendOtpCustomerDto) => authService.sendOtpCustomer(data),
  });
};

export const useSendOtpVerify = () => {
  return useMutation({
    mutationFn: (data: SendOtpVerifyDto) => authService.sendOtpVerify(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterCustomerDto) =>
      authService.registerCustomer(data),
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (data: ForgotPasswordCustomerDto) =>
      authService.forgotPassword(data),
  });
};

export const useVerifyLoginOtp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: VerifyLoginOtpDto) => authService.verifyLoginOtp(data),
    onSuccess: (res: any) => {
      if (res.accessToken) {
        tokenCache.setAuthData(res.accessToken, res.refreshToken, res.user);
        queryClient.invalidateQueries({ queryKey: ["me"] });
      }
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: (data: UpdatePasswordDto) => authService.updatePassword(data),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) => authService.changePassword(data),
  });
};

export const useGetMe = (options = {}) => {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authService.getMe(),
    enabled: tokenCache.isAuthenticated(),
    ...options,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      tokenCache.clear();
      queryClient.clear();
      window.location.reload();
    },
  });
};
