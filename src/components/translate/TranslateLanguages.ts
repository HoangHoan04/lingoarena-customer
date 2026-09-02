export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag?: string;
  popular?: boolean;
}

export const POPULAR_SOURCE_LANGUAGES: LanguageOption[] = [
  { code: "auto", name: "Phát hiện ngôn ngữ", nativeName: "Detect language" },
  { code: "en", name: "Tiếng Anh", nativeName: "English", flag: "🇬🇧", popular: true },
  { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt", flag: "🇻🇳", popular: true },
  { code: "ja", name: "Tiếng Nhật", nativeName: "日本語", flag: "🇯🇵", popular: true },
  { code: "ko", name: "Tiếng Hàn", nativeName: "한국어", flag: "🇰🇷", popular: true },
  { code: "zh", name: "Tiếng Trung (Giản thể)", nativeName: "中文 (简体)", flag: "🇨🇳", popular: true },
];

export const POPULAR_TARGET_LANGUAGES: LanguageOption[] = [
  { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt", flag: "🇻🇳", popular: true },
  { code: "en", name: "Tiếng Anh", nativeName: "English", flag: "🇬🇧", popular: true },
  { code: "ja", name: "Tiếng Nhật", nativeName: "日本語", flag: "🇯🇵", popular: true },
  { code: "ko", name: "Tiếng Hàn", nativeName: "한국어", flag: "🇰🇷", popular: true },
  { code: "fr", name: "Tiếng Pháp", nativeName: "Français", flag: "🇫🇷", popular: true },
  { code: "de", name: "Tiếng Đức", nativeName: "Deutsch", flag: "🇩🇪", popular: true },
];

export const ALL_LANGUAGES: LanguageOption[] = [
  { code: "en", name: "Tiếng Anh", nativeName: "English", flag: "🇬🇧" },
  { code: "vi", name: "Tiếng Việt", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "ja", name: "Tiếng Nhật", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Tiếng Hàn", nativeName: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "Tiếng Trung (Giản thể)", nativeName: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Tiếng Trung (Phồn thể)", nativeName: "中文 (繁體)", flag: "🇹🇼" },
  { code: "fr", name: "Tiếng Pháp", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "Tiếng Đức", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Tiếng Tây Ban Nha", nativeName: "Español", flag: "🇪🇸" },
  { code: "it", name: "Tiếng Ý", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "ru", name: "Tiếng Nga", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Tiếng Bồ Đào Nha", nativeName: "Português", flag: "🇵🇹" },
  { code: "th", name: "Tiếng Thái", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "id", name: "Tiếng Indonesia", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Tiếng Mã Lai", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "ar", name: "Tiếng Ả Rập", nativeName: "العربية", flag: "🇸🇦" },
  { code: "hi", name: "Tiếng Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Tiếng Bengal", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "nl", name: "Tiếng Hà Lan", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Tiếng Ba Lan", nativeName: "Polski", flag: "🇵🇱" },
  { code: "tr", name: "Tiếng Thổ Nhĩ Kỳ", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "sv", name: "Tiếng Thụy Điển", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "no", name: "Tiếng Na Uy", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "da", name: "Tiếng Đan Mạch", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Tiếng Phần Lan", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "el", name: "Tiếng Hy Lạp", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "cs", name: "Tiếng Séc", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "hu", name: "Tiếng Hungary", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "ro", name: "Tiếng Romania", nativeName: "Română", flag: "🇷🇴" },
  { code: "uk", name: "Tiếng Ukraina", nativeName: "Українська", flag: "🇺🇦" },
  { code: "he", name: "Tiếng Do Thái", nativeName: "עברית", flag: "🇮🇱" },
  { code: "fa", name: "Tiếng Ba Tư", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "la", name: "Tiếng Latinh", nativeName: "Latina", flag: "🇻🇦" },
  { code: "my", name: "Tiếng Miến Điện", nativeName: "မြန်မာစာ", flag: "🇲🇲" },
  { code: "km", name: "Tiếng Khmer", nativeName: "ភាសាខ្មែរ", flag: "🇰🇭" },
  { code: "lo", name: "Tiếng Lào", nativeName: "ພາສາລາວ", flag: "🇱🇦" },
  { code: "tl", name: "Tiếng Tagalog (Philippines)", nativeName: "Tagalog", flag: "🇵🇭" },
];
