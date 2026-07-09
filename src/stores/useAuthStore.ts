import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Get initial token from localStorage if in client environment
  const isClient = typeof window !== 'undefined';
  const initialToken = isClient ? localStorage.getItem('token') : null;
  const initialUser = isClient ? (() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })() : null;

  return {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
    setAuth: (user, token) => {
      if (isClient) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
      set({ user, token, isAuthenticated: true });
    },
    clearAuth: () => {
      if (isClient) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      set({ user: null, token: null, isAuthenticated: false });
    },
    setLoading: (isLoading) => set({ isLoading }),
  };
});
