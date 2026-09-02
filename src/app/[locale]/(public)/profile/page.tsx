"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useRouter } from "@/i18n/routing";
import { authService, UpdateProfileDto } from "@/services/auth.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import {
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
  GraduationCap,
  KeyRound,
  Lock,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  User,
} from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState<"info" | "security" | "stats">("info");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Nam");
  const [birthday, setBirthday] = useState("");
  const [occupation, setOccupation] = useState("Sinh viên");
  const [school, setSchool] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [customerCode, setCustomerCode] = useState("HV-2026");

  // Password Form States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== "undefined") {
      router.push("/login?redirect=/profile");
      return;
    }

    const fetchUserProfile = async () => {
      setFetching(true);
      try {
        const response = await authService.getMe();
        const customer = response.data?.customer;
        const u = response.data;

        setEmail(u?.username || user?.email || "");
        if (customer) {
          setFullName(customer.fullName || "");
          setDisplayName(customer.displayName || "");
          setPhone(customer.phone || "");
          setGender(customer.gender || "Nam");
          setBirthday(customer.birthday ? customer.birthday.split("T")[0] : "");
          setOccupation(customer.occupation || "Sinh viên");
          setSchool(customer.school || "");
          setCompany(customer.company || "");
          setBio(customer.bio || "");
          setAvatarUrl(customer.avatarUrl || "");
          setCustomerCode(customer.code || "HV-2026");
        } else {
          setFullName(user?.name || "");
        }
      } catch (err: any) {
        console.warn("Could not fetch profile from server:", err);
        setFullName(user?.name || "");
        setEmail(user?.email || "");
      } finally {
        setFetching(false);
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, router, user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: UpdateProfileDto = {
        fullName: fullName.trim(),
        displayName: displayName.trim() || fullName.trim(),
        phone: phone.trim(),
        gender,
        birthday: birthday || undefined,
        occupation,
        school: school.trim(),
        company: company.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      };

      const res = await authService.updateProfile(data);
      if (user) {
        setAuth(
          {
            ...user,
            name: fullName.trim(),
          },
          localStorage.getItem("token") || "",
        );
      }
      addToast(res.message || "Cập nhật hồ sơ học viên thành công!", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể cập nhật hồ sơ.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      addToast("Vui lòng điền đầy đủ các trường mật khẩu", "warning");
      return;
    }
    if (newPassword.length < 6) {
      addToast("Mật khẩu mới phải có ít nhất 6 ký tự", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast("Mật khẩu xác nhận không trùng khớp", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.updatePassword({
        currentPassword,
        newPassword,
      });
      addToast(res.message || "Đổi mật khẩu thành công!", "success");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      addToast(err?.message || "Mật khẩu hiện tại không chính xác.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-[#2b417e] dark:hover:text-[#7b9bee]">
            Trang chủ
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="font-bold text-slate-800 dark:text-white">Hồ sơ học viên</span>
        </div>

        {/* Profile Header Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#2b417e] via-[#38559d] to-[#2b417e] p-6 sm:p-8 text-white shadow-xl shadow-[#2b417e]/20">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Avatar container */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/40 shadow-2xl bg-white text-[#2b417e] flex items-center justify-center text-3xl font-black overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  (fullName || user?.name || "HV").substring(0, 2).toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Nhập URL ảnh đại diện Avatar mới của bạn:", avatarUrl);
                  if (url !== null) setAvatarUrl(url);
                }}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-amber-400 text-slate-900 shadow-md hover:bg-amber-300 transition-all cursor-pointer"
                title="Thay đổi ảnh đại diện"
              >
                <Camera className="size-4" />
              </button>
            </div>

            {/* Profile Summary */}
            <div className="space-y-2 grow">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {fullName || user?.name || "Học viên LingoArena"}
                </h1>
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs py-0.5 px-2.5 font-bold">
                  Mã: {customerCode}
                </Badge>
              </div>

              <p className="text-xs sm:text-sm text-slate-200 flex items-center justify-center sm:justify-start gap-2">
                <Mail className="size-4 opacity-80" /> {email || user?.email}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs">
                <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                  <Flame className="size-4 text-orange-300" /> Streak 7 ngày
                </span>
                <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                  <Trophy className="size-4 text-amber-300" /> Hạng Vàng
                </span>
                <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                  <Target className="size-4 text-sky-300" /> Mục tiêu TOEIC 800+
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "info"
                ? "bg-[#2b417e] text-white shadow-md shadow-[#2b417e]/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <User className="size-4" />
            Thông tin cá nhân
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-[#2b417e] text-white shadow-md shadow-[#2b417e]/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="size-4" />
            Mật khẩu & Bảo mật
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stats")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "stats"
                ? "bg-[#2b417e] text-white shadow-md shadow-[#2b417e]/20"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Award className="size-4" />
            Tiến độ học tập
          </button>
        </div>

        {/* TAB 1: Profile Form */}
        {activeTab === "info" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Chỉnh sửa thông tin hồ sơ
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cập nhật thông tin cá nhân chính xác để nhận các đề xuất lộ trình thi phù hợp.
              </p>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Họ và tên đầy đủ
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
                            ? "bg-[#2b417e] text-white border-[#2b417e]"
                            : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Birthday */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Ngày sinh
                  </label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
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
                      placeholder="Sinh viên / Lập trình viên / Học sinh"
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
                    <BookOpen className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                    <Input
                      type="text"
                      value={school || company}
                      onChange={(e) => {
                        setSchool(e.target.value);
                        setCompany(e.target.value);
                      }}
                      placeholder="Đại học Quốc Gia / FPT Software"
                      className="pl-10 h-11 rounded-xl text-xs sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Giới thiệu bản thân & Mục tiêu
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Mục tiêu thi đạt TOEIC 850+ vào tháng 12 năm 2026..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#2b417e]/20 focus:border-[#2b417e]"
                />
              </div>

              {/* Action Save Button */}
              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-8 h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl cursor-pointer flex items-center gap-2"
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
        )}

        {/* TAB 2: Security & Password */}
        {activeTab === "security" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 max-w-2xl space-y-6">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Đổi mật khẩu tài khoản
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Nên đổi mật khẩu định kỳ để bảo đảm an toàn dữ liệu và kết quả bài thi.
              </p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu hiện tại
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Xác nhận lại mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <KeyRound className="absolute left-3.5 size-4 text-slate-400 pointer-events-none" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10 pr-10 h-11 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl font-bold text-sm bg-[#2b417e] hover:bg-[#1e2f5e] text-white shadow-lg shadow-[#2b417e]/25 hover:shadow-xl cursor-pointer flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Đang cập nhật mật khẩu...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      <span>Lưu mật khẩu mới</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Learning Stats */}
        {activeTab === "stats" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Đề thi đã luyện</span>
              <div className="text-3xl font-black text-slate-900 dark:text-white">12 đề</div>
              <p className="text-xs text-emerald-600 font-semibold">+3 đề so với tuần trước</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Điểm dự đoán hiện tại</span>
              <div className="text-3xl font-black text-[#2b417e] dark:text-[#7b9bee]">780 / 990</div>
              <p className="text-xs text-slate-500">Dựa trên 3 bài test gần nhất</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-2">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Từ vựng đã làm chủ</span>
              <div className="text-3xl font-black text-orange-500">450 từ</div>
              <p className="text-xs text-slate-500">Đã qua hệ thống ôn tập FSRS</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
