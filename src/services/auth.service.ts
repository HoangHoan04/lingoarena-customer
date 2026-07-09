import apiService from './api.service';
import API_ENDPOINTS from './endpoint';
import { LoginRequestDto, RegisterRequestDto, AuthResponseDto } from '@/dto';

export const authService = {
  login: async (data: LoginRequestDto): Promise<AuthResponseDto> => {
    const res = await apiService.post<AuthResponseDto>(API_ENDPOINTS.AUTH.LOGIN, data);
    return res.data;
  },

  register: async (data: RegisterRequestDto): Promise<AuthResponseDto> => {
    const res = await apiService.post<AuthResponseDto>(API_ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await apiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
  },
};

export default authService;
