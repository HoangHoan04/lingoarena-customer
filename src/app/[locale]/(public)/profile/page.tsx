"use client";

import {
  AvatarModal,
  ProfileHeader,
  ProfileInfoTab,
  ProfileSecurityTab,
  ProfileSkeleton,
  ProfileStatsTab,
  ProfileTabNav,
  type ProfileTab,
} from "@/components/profile";
import { useRouter } from "@/i18n/routing";
import { assessmentService } from "@/services/assessment.service";
import { authService, type UpdateProfileDto } from "@/services/auth.service";
import { organizationService } from "@/services/organization.service";
import { vocabularyService } from "@/services/vocabulary.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { UserVocabStats } from "@/types/vocabulary";
import { RefreshCw } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("info");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Form & User Profile Info
  const [fullName, setFullName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Nam");
  const [birthday, setBirthday] = useState("");
  const [occupation, setOccupation] = useState("");
  const [schoolOrCompany, setSchoolOrCompany] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [customerCode, setCustomerCode] = useState("");
  const [memberRole, setMemberRole] = useState("Học viên");
  const [emailVerifiedAt, setEmailVerifiedAt] = useState<Date | string | null>(
    null,
  );
  const [lastLoginAt, setLastLoginAt] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  // Stats & Referral
  const [vocabStats, setVocabStats] = useState<UserVocabStats | null>(null);
  const [assessmentTotal, setAssessmentTotal] = useState<number>(0);
  const [referralLoading, setReferralLoading] = useState(false);
  const [organizations, setOrganizations] = useState<
    Array<{ id?: string; name?: string; slug?: string }>
  >([]);

  // Modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const loadProfileData = async () => {
    setFetching(true);
    try {
      const [meRes, vocabStatsRes, assessmentRes, orgRes] =
        await Promise.allSettled([
          authService.getMe(),
          vocabularyService.myStats(),
          assessmentService.list({}, 0, 10),
          organizationService.me(),
        ]);

      if (meRes.status === "fulfilled" && meRes.value) {
        const u = meRes.value?.data || meRes.value;
        const p = u?.profile;

        setEmail(u?.email || user?.email || "");
        setFullName(p?.fullName || u?.fullName || u?.name || user?.name || "");
        setDisplayName(p?.displayName || u?.displayName || "");
        setPhone(u?.phone || p?.phone || user?.phone || "");
        setGender(p?.gender || "Nam");
        setBirthday(p?.dateOfBirth ? String(p.dateOfBirth).split("T")[0] : "");
        setOccupation(p?.occupation || "");
        setSchoolOrCompany(p?.schoolOrCompany || "");
        setBio(p?.bio || "");
        setAvatarUrl(p?.avatarUrl || u?.avatarUrl || user?.avatarUrl || "");
        setCustomerCode(
          u?.username ||
            (u?.id ? `HV-${u.id.substring(0, 6).toUpperCase()}` : "HV-2026"),
        );
        setMemberRole(
          u?.roles?.includes("ADMIN") ? "Quản trị viên" : "Học viên",
        );
        setEmailVerifiedAt(u?.emailVerifiedAt || null);
        setLastLoginAt(
          u?.lastLoginAt
            ? new Date(u.lastLoginAt).toLocaleString("vi-VN")
            : null,
        );
        setCreatedAt(
          u?.createdAt
            ? new Date(u.createdAt).toLocaleDateString("vi-VN")
            : null,
        );
      }

      if (vocabStatsRes.status === "fulfilled" && vocabStatsRes.value) {
        setVocabStats(vocabStatsRes.value);
      }

      if (assessmentRes.status === "fulfilled" && assessmentRes.value) {
        setAssessmentTotal(assessmentRes.value.total || 0);
      }

      if (orgRes.status === "fulfilled" && orgRes.value) {
        setOrganizations(orgRes.value);
      }
    } catch (err: any) {
      console.warn("Could not fetch profile from server:", err);
      setFullName(user?.name || "");
      setEmail(user?.email || "");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (!isAuthenticated) {
      router.push("/login?redirect=/profile");
      return;
    }

    loadProfileData();
  }, [mounted, isAuthenticated, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data: UpdateProfileDto = {
        fullName: fullName.trim(),
        displayName: displayName.trim() || fullName.trim(),
        phone: phone.trim(),
        gender,
        dateOfBirth: birthday || undefined,
        occupation: occupation.trim(),
        schoolOrCompany: schoolOrCompany.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
      };

      const res = await authService.updateProfile(data);
      if (user) {
        setAuth(
          {
            ...user,
            name: fullName.trim(),
            displayName: displayName.trim() || fullName.trim(),
            fullName: fullName.trim(),
            avatarUrl: avatarUrl.trim(),
            phone: phone.trim(),
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

  const handleGenerateReferral = async () => {};

  const handleSaveAvatarUrl = (newUrl: string) => {
    if (newUrl.trim()) {
      setAvatarUrl(newUrl.trim());
    }
  };

  if (!mounted) {
    return <ProfileSkeleton />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-slate-500">
          <RefreshCw className="size-8 animate-spin text-brand" />
          <span className="text-sm font-semibold">
            Đang chuyển hướng đến trang đăng nhập...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        {/* Profile Header & Summary */}
        <ProfileHeader
          data={{
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
          }}
          onOpenAvatarModal={() => setShowAvatarModal(true)}
          onAvatarError={() => setAvatarUrl("")}
        />

        {/* Tab Navigation */}
        <ProfileTabNav activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Loading Indicator */}
        {fetching && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-md flex items-center justify-center gap-3 text-slate-500 py-16">
            <RefreshCw className="size-5 animate-spin text-brand" />
            <span className="text-sm font-semibold">
              Đang tải dữ liệu hồ sơ từ hệ thống...
            </span>
          </div>
        )}

        {/* TAB 1: Profile Form */}
        {!fetching && activeTab === "info" && (
          <ProfileInfoTab
            fullName={fullName}
            setFullName={setFullName}
            displayName={displayName}
            setDisplayName={setDisplayName}
            email={email}
            phone={phone}
            setPhone={setPhone}
            gender={gender}
            setGender={setGender}
            birthday={birthday}
            setBirthday={setBirthday}
            occupation={occupation}
            setOccupation={setOccupation}
            schoolOrCompany={schoolOrCompany}
            setSchoolOrCompany={setSchoolOrCompany}
            avatarUrl={avatarUrl}
            setAvatarUrl={setAvatarUrl}
            bio={bio}
            setBio={setBio}
            loading={loading}
            fetching={fetching}
            onRefresh={loadProfileData}
            onSubmit={handleUpdateProfile}
          />
        )}

        {/* TAB 2: Security & Password */}
        {!fetching && activeTab === "security" && (
          <ProfileSecurityTab
            emailVerifiedAt={emailVerifiedAt}
            lastLoginAt={lastLoginAt}
          />
        )}

        {/* TAB 3: Learning Stats */}
        {!fetching && activeTab === "stats" && (
          <ProfileStatsTab
            assessmentTotal={assessmentTotal}
            vocabStats={vocabStats}
            organizations={organizations}
            onGenerateReferral={handleGenerateReferral}
          />
        )}
      </div>

      {/* Avatar Change Modal */}
      <AvatarModal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        currentAvatarUrl={avatarUrl}
        onSave={handleSaveAvatarUrl}
      />
    </div>
  );
}
