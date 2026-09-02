export type AuthSessionUser = {
  id: string;
  email: string;
  name: string;
  displayName?: string;
  fullName?: string;
  avatarUrl?: string;
  phone?: string;
  role?: string;
  roles?: string[];
  status?: string;
};

export function resolveApiBaseUrl(raw?: string): string {
  const fallback = "http://localhost:4300/api";
  let url = (raw || fallback).trim().replace(/\/+$/, "");
  if (!url) return fallback;
  if (!url.endsWith("/api")) url += "/api";
  return url;
}

export function extractApiData<T = any>(res: any): T {
  const body = res?.data ?? res;
  if (body?.data?.accessToken || body?.data?.user || body?.data?.id) {
    return body.data as T;
  }
  if (body?.accessToken || body?.user || body?.id) {
    return body as T;
  }
  return (body?.data ?? body) as T;
}

export function resolveDisplayName(user: any): string {
  return (
    user?.displayName ||
    user?.fullName ||
    user?.name ||
    user?.profile?.displayName ||
    user?.profile?.fullName ||
    user?.username ||
    user?.email ||
    ""
  );
}

export function mapSessionUser(user: any): AuthSessionUser {
  const name = resolveDisplayName(user);
  const roles = Array.isArray(user?.roles)
    ? user.roles.filter(Boolean)
    : user?.role
      ? [user.role]
      : [];

  return {
    id: user?.id,
    email: user?.email || "",
    name,
    displayName: user?.displayName || user?.profile?.displayName || name,
    fullName: user?.fullName || user?.profile?.fullName || name,
    avatarUrl: user?.avatarUrl || user?.profile?.avatarUrl || "",
    phone: user?.phone || "",
    role: roles[0] || user?.role || "STUDENT",
    roles,
    status: user?.status,
  };
}

export function getSocialAuthUrl(provider: "google" | "facebook"): string {
  return `${resolveApiBaseUrl(process.env.NEXT_PUBLIC_API_URL)}/user/auth/${provider}`;
}
