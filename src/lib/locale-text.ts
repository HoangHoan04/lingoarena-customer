export function pickLocaleText(
  locale: string | undefined,
  vi?: string | null,
  en?: string | null,
): string {
  const fallback = vi || "";
  if ((locale || "").toLowerCase() === "en") return (en || fallback || "").toString();
  return fallback.toString();
}

export function resolveClientLang(): string {
  if (typeof window === "undefined") return "vi";
  const first = window.location.pathname.split("/").filter(Boolean)[0];
  return first === "en" ? "en" : "vi";
}
