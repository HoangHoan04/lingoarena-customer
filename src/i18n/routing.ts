import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // Danh sách các ngôn ngữ hỗ trợ
  locales: ['vi', 'en'],

  // Ngôn ngữ mặc định khi không trùng khớp ngôn ngữ nào
  defaultLocale: 'vi',

  // Ẩn tiền tố ở ngôn ngữ mặc định (Tiếng Việt)
  localePrefix: 'as-needed'
});

// Các hàm điều hướng gọn nhẹ của next-intl dựa trên cấu hình routing trên
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
