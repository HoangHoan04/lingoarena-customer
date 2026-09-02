import { AuthSessionUser } from "@/lib/auth";
import { create } from "zustand";

interface AuthState {
  user: AuthSessionUser | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: AuthSessionUser, token: string, refreshToken?: string) => void;
  clearAuth: () => void;
  setLoading: (isLoading: boolean) => void;
}

function readStorageUser(): AuthSessionUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as AuthSessionUser) : null;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>((set) => {
  const isClient = typeof window !== "undefined";
  const initialToken = isClient ? localStorage.getItem("token") : null;
  const initialRefreshToken = isClient ? localStorage.getItem("refreshToken") : null;
  const initialUser = readStorageUser();

  return {
    user: initialUser,
    token: initialToken,
    refreshToken: initialRefreshToken,
    isAuthenticated: !!(initialToken && initialUser?.id),
    isLoading: false,
    setAuth: (user, token, refreshToken) => {
      if (isClient) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      }
      set({
        user,
        token,
        refreshToken: refreshToken || null,
        isAuthenticated: true,
        isLoading: false,
      });
    },
    clearAuth: () => {
      if (isClient) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      set({
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    },
    setLoading: (isLoading) => set({ isLoading }),
  };
});
