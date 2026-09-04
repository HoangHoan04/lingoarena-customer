"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToastStore } from "@/stores/useToastStore";
import {
  Building2,
  Calendar as CalendarIcon,
  CheckCircle2,
  GraduationCap,
  ImagePlus,
  Link as LinkIcon,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UploadCloud,
  User,
} from "lucide-react";
import React, { useRef, useState } from "react";
import { vi } from "react-day-picker/locale";

export interface ProfileInfoTabProps {
  fullName: string;
  setFullName: (v: string) => void;
  displayName: string;
  setDisplayName: (v: string) => void;
  email: string;
  phone: string;
  setPhone: (v: string) => void;
  gender: string;
  setGender: (v: string) => void;
  birthday: string;
  setBirthday: (v: string) => void;
  occupation: string;
  setOccupation: (v: string) => void;
  schoolOrCompany: string;
  setSchoolOrCompany: (v: string) => void;
  avatarUrl: string;
  setAvatarUrl: (v: string) => void;
  bio: string;
  setBio: (v: string) => void;
  loading: boolean;
  fetching: boolean;
  onRefresh: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function ProfileInfoTab({
  fullName,
  setFullName,
  displayName,
  setDisplayName,
  email,
  phone,
  setPhone,
  gender,
  setGender,
  birthday,
  setBirthday,
  occupation,
  setOccupation,
  schoolOrCompany,
  setSchoolOrCompany,
  avatarUrl,
  setAvatarUrl,
  bio,
  setBio,
  loading,
  fetching,
  onRefresh,
  onSubmit,
}: ProfileInfoTabProps) {
  const { addToast } = useToastStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Helper to read and optimize image file to Base64
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      addToast("Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WEBP)", "warning");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast("Dung lượng tệp không được vượt quá 5MB", "warning");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) return;

      const img = new Image();
      img.onload = () => {
        const maxDim = 512;
        let width = img.width;
        let height = img.height;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.85);
          setAvatarUrl(compressed);
          addToast("Đã tải ảnh lên thành công!", "success");
        } else {
          setAvatarUrl(result);
          addToast("Đã tải ảnh lên thành công!", "success");
        }
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const selectedDate = birthday
    ? new Date(birthday.includes("T") ? birthday : birthday + "T00:00:00")
    : undefined;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900 dark:text-white">
            Chỉnh sửa thông tin hồ sơ
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cập nhật thông tin cá nhân chính xác để nhận các đề xuất lộ trình
            học và bài thi phù hợp.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={fetching}
          className="gap-1.5 text-xs font-semibold rounded-xl cursor-pointer"
        >
          <RefreshCw
            className={`size-3.5 ${fetching ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Họ và tên đầy đủ <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Tên hiển thị / Nickname
            </label>
            <div className="relative flex items-center">
              <Sparkles className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Alex Nguyen"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Địa chỉ Email (Tên đăng nhập)
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="email"
                disabled
                value={email}
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Số điện thoại liên hệ
            </label>
            <div className="relative flex items-center">
              <Phone className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0987654321"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Giới tính
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Nam", "Nữ", "Khác"].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    gender === g
                      ? "bg-brand text-white border-brand shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Birthday with Calendar component */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Ngày sinh
            </label>
            <Popover
              open={isDatePickerOpen}
              onOpenChange={setIsDatePickerOpen}
            >
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-3.5 h-11 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <span className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                      <CalendarIcon className="size-4 text-slate-400 shrink-0" />
                      <span
                        className={
                          birthday ? "font-semibold" : "text-slate-400"
                        }
                      >
                        {selectedDate
                          ? selectedDate.toLocaleDateString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                          : "Chọn ngày sinh"}
                      </span>
                    </span>
                    {birthday && (
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          setBirthday("");
                        }}
                        className="text-slate-400 hover:text-rose-500 text-xs px-1"
                        title="Xóa ngày sinh"
                      >
                        ✕
                      </span>
                    )}
                  </button>
                }
              />
              <PopoverContent
                className="w-auto p-2 z-50 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
                align="start"
                sideOffset={6}
              >
                <CalendarPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0",
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      setBirthday(`${year}-${month}-${day}`);
                    } else {
                      setBirthday("");
                    }
                    setIsDatePickerOpen(false);
                  }}
                  captionLayout="dropdown"
                  startMonth={new Date(1940, 0)}
                  endMonth={new Date()}
                  defaultMonth={selectedDate || new Date(2000, 0)}
                  locale={vi}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Occupation */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Nghề nghiệp
            </label>
            <div className="relative flex items-center">
              <GraduationCap className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                placeholder="Sinh viên / Lập trình viên / Kỹ sư"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* School or Company */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Trường học / Nơi làm việc
            </label>
            <div className="relative flex items-center">
              <Building2 className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="text"
                value={schoolOrCompany}
                onChange={(e) => setSchoolOrCompany(e.target.value)}
                placeholder="Đại học Bách Khoa / FPT Software"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Avatar Upload Card Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
              Ảnh đại diện học viên
            </label>
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs font-semibold text-brand dark:text-[#7b9bee] hover:underline cursor-pointer flex items-center gap-1"
            >
              {showUrlInput ? (
                <>
                  <UploadCloud className="size-3" /> Tải ảnh từ máy
                </>
              ) : (
                <>
                  <LinkIcon className="size-3" /> Nhập URL trực tiếp
                </>
              )}
            </button>
          </div>

          {showUrlInput ? (
            <div className="relative flex items-center">
              <LinkIcon className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
              <Input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                className="pl-10 h-11 rounded-xl text-xs sm:text-sm font-mono"
              />
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                if (e.dataTransfer.files?.[0]) {
                  processImageFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col sm:flex-row items-center gap-5 p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer group ${
                isDragging
                  ? "border-brand bg-brand/5 scale-[1.01]"
                  : "border-slate-200 dark:border-slate-800 hover:border-brand/40 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    processImageFile(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {avatarUrl ? (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                  <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden border-2 border-brand/20 shadow-md shrink-0 bg-white dark:bg-slate-900">
                    <img
                      src={avatarUrl}
                      alt="Avatar preview"
                      className="size-full object-cover"
                      onError={() => setAvatarUrl("")}
                    />
                  </div>
                  <div className="grow space-y-1 text-center sm:text-left">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white flex items-center justify-center sm:justify-start gap-1.5">
                      <CheckCircle2 className="size-4 text-emerald-500" /> Ảnh
                      đại diện đã chọn
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Nhấp vào đây hoặc kéo thả ảnh mới để thay thế
                    </p>
                    <div
                      className="flex items-center justify-center sm:justify-start gap-2 pt-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-7 text-[11px] font-semibold rounded-lg px-2.5 cursor-pointer gap-1"
                      >
                        <UploadCloud className="size-3" /> Chọn ảnh khác
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAvatarUrl("")}
                        className="h-7 text-[11px] font-semibold rounded-lg px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer gap-1"
                      >
                        <Trash2 className="size-3" /> Gỡ ảnh
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">
                  <div className="size-14 rounded-2xl bg-brand/10 dark:bg-brand/20 text-brand dark:text-[#7b9bee] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ImagePlus className="size-7" />
                  </div>
                  <div className="space-y-0.5 grow">
                    <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
                      Tải ảnh đại diện lên
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Kéo thả hình ảnh vào đây hoặc nhấp để chọn tệp từ máy
                      tính (PNG, JPG, WEBP tối đa 5MB)
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold shrink-0 pointer-events-none group-hover:bg-brand group-hover:text-white transition-colors"
                  >
                    Chọn tệp ảnh
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Giới thiệu bản thân & Mục tiêu ôn luyện
          </label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Mục tiêu thi đạt chứng chỉ TOEIC 850+ hoặc IELTS 7.5 trong năm nay..."
            className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-brand/20 focus:border-brand"
          />
        </div>

        {/* Action Save Button */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={loading}
            className="px-8 h-12 rounded-xl font-bold text-sm bg-brand hover:bg-[#1e2f5e] text-white shadow-lg shadow-brand/25 hover:shadow-xl cursor-pointer flex items-center gap-2"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Đang lưu thay đổi...</span>
              </>
            ) : (
              <>
                <Save className="size-4" />
                <span>Lưu thông tin hồ sơ</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
