"use client";

import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/routing";
import {
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Flame,
  Mail,
  Phone,
} from "lucide-react";
import React from "react";
import type { ProfileHeaderData } from "./types";

interface ProfileHeaderProps {
  data: ProfileHeaderData;
  onOpenAvatarModal: () => void;
  onAvatarError: () => void;
}

export default function ProfileHeader({
  data,
  onOpenAvatarModal,
  onAvatarError,
}: ProfileHeaderProps) {
  const {
    fullName,
    customerCode,
    memberRole,
    email,
    phone,
    createdAt,
    avatarUrl,
    emailVerifiedAt,
    vocabStats,
    assessmentTotal,
  } = data;

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand dark:hover:text-[#7b9bee]">
          Trang chủ
        </Link>
        <ChevronRight className="size-3.5" />
        <span className="font-bold text-slate-800 dark:text-white">
          Hồ sơ học viên
        </span>
      </div>

      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-brand via-[#38559d] to-brand p-6 sm:p-8 text-white shadow-xl shadow-brand/20">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Avatar Section */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white/40 shadow-2xl bg-white text-brand flex items-center justify-center text-3xl font-black overflow-hidden select-none">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName || "Avatar"}
                  className="w-full h-full object-cover"
                  onError={onAvatarError}
                />
              ) : (
                (fullName || "HV").substring(0, 2).toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={onOpenAvatarModal}
              className="absolute bottom-0 right-0 p-2.5 rounded-full bg-amber-400 text-slate-900 shadow-lg hover:bg-amber-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="Thay đổi ảnh đại diện"
            >
              <Camera className="size-4" />
            </button>
          </div>

          {/* Profile Summary */}
          <div className="space-y-2 grow">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {fullName || "Học viên LingoArena"}
              </h1>
              {customerCode && (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs py-0.5 px-2.5 font-bold">
                  Mã: {customerCode}
                </Badge>
              )}
              <Badge className="bg-white/20 text-white border-white/30 text-xs py-0.5 px-2.5 font-medium">
                {memberRole}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs sm:text-sm text-slate-200">
              <span className="flex items-center gap-1.5">
                <Mail className="size-3.5 opacity-80" /> {email}
              </span>
              {phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="size-3.5 opacity-80" /> {phone}
                </span>
              )}
              {createdAt && (
                <span className="flex items-center gap-1.5 opacity-80">
                  <Calendar className="size-3.5" /> Tham gia: {createdAt}
                </span>
              )}
            </div>

            {/* Real Stats Quick Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs">
              <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                <Flame className="size-4 text-orange-300" />
                {vocabStats?.streakDays && vocabStats.streakDays > 0
                  ? `Streak ${vocabStats.streakDays} ngày`
                  : "Học viên tích cực"}
              </span>

              <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                <BookOpen className="size-4 text-sky-300" />
                {vocabStats?.totalMasteredWords ||
                  vocabStats?.masteredCount ||
                  0}{" "}
                từ đã thuộc
              </span>

              <span className="flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full backdrop-blur-xs font-semibold">
                <Award className="size-4 text-amber-300" />
                {assessmentTotal > 0
                  ? `${assessmentTotal} đề thi đã luyện`
                  : "Sẵn sàng làm bài thi"}
              </span>

              {emailVerifiedAt ? (
                <span className="flex items-center gap-1.5 bg-emerald-400/20 text-emerald-200 px-3 py-1 rounded-full font-semibold border border-emerald-400/30">
                  <CheckCircle2 className="size-3.5 text-emerald-300" /> Email đã
                  xác thực
                </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-amber-400/20 text-amber-200 px-3 py-1 rounded-full font-semibold border border-amber-400/30">
                  <AlertCircle className="size-3.5 text-amber-300" /> Chưa xác thực
                  email
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
