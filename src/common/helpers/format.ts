import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

/** DATE & TIME */

//Format thời lượng từ phút sang định dạng "1h 30p" hoặc "90 phút"
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} phút`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}p` : `${h} giờ`;
};

//Format ngày thân thiện (Hôm nay, Hôm qua, hoặc DD/MM)
export const formatRelativeDate = (dateInput: string | Date): string => {
  const date = dayjs(dateInput);
  if (date.isSame(dayjs(), "day")) return "Hôm nay";
  if (date.isSame(dayjs().subtract(1, "day"), "day")) return "Hôm qua";
  return date.format("DD/MM/YYYY");
};

export const formatDateTime = (
  dateInput: string | Date,
  format: string = "HH:mm DD/MM/YYYY",
): string => {
  let dateObj: dayjs.Dayjs;
  if (typeof dateInput === "string") {
    dateObj = dayjs(dateInput);
  } else {
    dateObj = dayjs(dateInput);
  }
  return dateObj.format(format);
};

export const formatDate = (
  dateInput: string | Date | null | undefined,
  format: string = "DD/MM/YYYY",
): string => {
  if (!dateInput) return "---";

  const dateObj = dayjs(dateInput);
  if (!dateObj.isValid()) return "Ngày không hợp lệ";

  return dateObj.format(format);
};

export const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Vừa xong";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
};

/** NUMBERS & CURRENCY  */

//Rút gọn số lớn (VD: 1.500 -> 1.5K, 1.200.000 -> 1.2M)
export const formatCompactNumber = (number: number): string => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};

//Format số có dấu phân cách hàng nghìn (VD: 1000000 -> 1.000.000)
export const formatNumber = (num: number): string => {
  return num.toLocaleString("vi-VN");
};

//Tính phần trăm (VD: 0.85 -> 85%)
export const formatPercent = (value: number, total: number): string => {
  if (total === 0) return "0%";
  const percent = Math.round((value / total) * 100);
  return `${percent}%`;
};

/** STRING & TEXT */

//Cắt ngắn văn bản (VD: "Khóa học IELTS..." -> "Khóa học...")
export const truncateText = (text: string, maxLength: number): string => {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

//Lấy chữ cái đầu của tên (Dùng cho Avatar nếu không có ảnh)
export const getInitials = (name: string): string => {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name[0].toUpperCase();
};

//Chuyển đổi Tiếng Việt có dấu thành không dấu (Dùng để search thủ công)
export const removeVietnameseTones = (str: string): string => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

/** BUSINESS LOGIC (LingoArena) */

//Format Target Score dựa trên loại chứng chỉ
export const formatTargetScore = (score: string, certCode: string): string => {
  if (!score) return "N/A";
  if (certCode.toUpperCase() === "IELTS") return `Band ${score}`;
  if (certCode.toUpperCase() === "TOEIC") return `${score} PTS`;
  return score;
};

//Chuyển đổi giây sang định dạng video (VD: 125 -> "02:05")
export const formatVideoTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const mDisplay = m < 10 ? `0${m}` : m;
  const sDisplay = s < 10 ? `0${s}` : s;

  if (h > 0) {
    const hDisplay = h < 10 ? `0${h}` : h;
    return `${hDisplay}:${mDisplay}:${sDisplay}`;
  }
  return `${mDisplay}:${sDisplay}`;
};
