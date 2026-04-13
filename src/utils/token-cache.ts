import Cookies from "js-cookie";

interface TokenData {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const COOKIE_KEYS = {
  ACCESS_TOKEN: "token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user_data",
};

class TokenCache {
  private cache: TokenData = {
    accessToken: null,
    refreshToken: null,
    user: null,
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window === "undefined") return;
    try {
      this.cache.accessToken = Cookies.get(COOKIE_KEYS.ACCESS_TOKEN) || null;
      this.cache.refreshToken = Cookies.get(COOKIE_KEYS.REFRESH_TOKEN) || null;
      const userStr = Cookies.get(COOKIE_KEYS.USER);
      this.cache.user = userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      this.clear();
      console.error("Failed to load tokens from cookies:", error);
    }
  }

  setAuthData(accessToken: string, refreshToken: string, user: any): void {
    try {
      this.cache.accessToken = accessToken;
      this.cache.refreshToken = refreshToken;
      this.cache.user = user;

      Cookies.set(COOKIE_KEYS.ACCESS_TOKEN, accessToken, { expires: 1 });
      Cookies.set(COOKIE_KEYS.REFRESH_TOKEN, refreshToken, { expires: 7 });
      Cookies.set(COOKIE_KEYS.USER, JSON.stringify(user), { expires: 1 });
    } catch (error) {
      console.error("Failed to set auth data in cookies:", error);
    }
  }

  updateUser(user: any): void {
    this.cache.user = user;
    Cookies.set(COOKIE_KEYS.USER, JSON.stringify(user), { expires: 1 });
  }

  clear(): void {
    this.cache.accessToken = null;
    this.cache.refreshToken = null;
    this.cache.user = null;
    Cookies.remove(COOKIE_KEYS.ACCESS_TOKEN);
    Cookies.remove(COOKIE_KEYS.REFRESH_TOKEN);
    Cookies.remove(COOKIE_KEYS.USER);
  }

  getAccessToken() {
    return this.cache.accessToken;
  }
  getRefreshToken() {
    return this.cache.refreshToken;
  }
  getUser() {
    return this.cache.user;
  }
  isAuthenticated() {
    return !!this.cache.accessToken;
  }
}

export const tokenCache = new TokenCache();
export default tokenCache;
