import type { MetadataRoute } from "next";

const BASE_URL = "https://lingoarena.com";
const locales = ["vi", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const publicPages = [
    { path: "/", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/courses", priority: 0.9, changeFrequency: "daily" as const },
    { path: "/leaderboard", priority: 0.8, changeFrequency: "daily" as const },
    { path: "/login", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/register", priority: 0.6, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  entries.push({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  for (const locale of locales) {
    for (const page of publicPages) {
      const url =
        locale === "vi"
          ? `${BASE_URL}${page.path}`
          : `${BASE_URL}/${locale}${page.path}`;
      entries.push({
        url,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  return entries;
}
