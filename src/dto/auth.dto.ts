import { z } from 'zod';
import { loginSchema, registerSchema } from '@/common/validators/auth.validator';

export type LoginRequestDto = z.infer<typeof loginSchema>;
export type RegisterRequestDto = z.infer<typeof registerSchema>;

export interface AuthResponseDto {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
