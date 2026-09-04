export function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }

  const watchMatch = cleanUrl.match(
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i,
  );
  if (watchMatch?.[1]) return watchMatch[1];

  const shortsMatch = cleanUrl.match(/youtube\.com\/shorts\/([^"&?/\s]{11})/i);
  if (shortsMatch?.[1]) return shortsMatch[1];

  return null;
}
