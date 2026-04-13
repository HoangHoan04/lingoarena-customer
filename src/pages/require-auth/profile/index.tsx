import { useGetMe } from "@/hooks/auth/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "primereact/avatar";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Button } from "primereact/button";
import { formatDate, formatDateTime } from "@/common/helpers";
import GlobalLoading from "@/components/layout/Loading";

const genderMap: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  other: "Khác",
};

type Tab = "infomation" | "course" | "friends" | "arena" | "history";

function AboutInfoRow({ icon, text }: { icon: string; text?: string | null }) {
  if (!text) return null;
  return (
    <div className="flex items-center gap-3 py-2">
      <i
        className={`${icon} text-slate-400 text-base w-5 text-center shrink-0`}
      />
      <span className="text-sm text-slate-200">{text}</span>
    </div>
  );
}

export default function ProfileScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { data: meData, isLoading } = useGetMe();
  const [activeTab, setActiveTab] = useState<Tab>("infomation");

  const user = (meData as any)?.user ?? (meData as any);
  const student = user?.student;

  const displayName = student?.fullName || user?.username || "Người dùng";
  const avatarLabel = (displayName?.[0] || "U").toUpperCase();
  const avatarUrl =
    student?.avatarUrl ||
    (Array.isArray(student?.avatar) && student.avatar.length > 0
      ? student.avatar[0]?.fileUrl
      : null);
  const joinDate = formatDate(student?.createdAt);
  const lastLoginAt = formatDateTime(user?.lastLoginAt);
  const birthday = formatDate(student?.birthday);

  const tabs: { key: Tab; label: string }[] = [
    { key: "infomation", label: "Thông tin" },
    { key: "course", label: "Khóa học" },
    { key: "friends", label: "Bạn bè" },
    { key: "arena", label: "Arena" },
    { key: "history", label: "Lịch sử" },
  ];

  return (
    <div>
      {/* ── Cover Photo ── */}
      <div className="relative w-full h-40 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "linear-gradient(180deg, #2d2f31 0%, #18191a 100%)"
              : "linear-gradient(180deg, #c9ccd1 0%, #8a8d91 100%)",
          }}
        />
      </div>

      {/* ── Profile Header Card ── */}
      <div className={`border-b  border-slate-200 dark:border-slate-800`}>
        <div className="max-w-5xl mx-auto px-4">
          {/* Avatar + Name row */}
          <div className="flex flex-row items-end gap-4 pb-0">
            {/* Avatar - overlaps cover */}
            <div className="relative -mt-20 shrink-0 self-start">
              {isLoading ? (
                <Skeleton shape="circle" size="10.5rem" />
              ) : (
                <div className="relative">
                  <div
                    className="rounded-full ring-4 overflow-hidden"
                    style={{
                      width: "10.5rem",
                      height: "10.5rem",
                      border: `4px solid ${isDark ? "#18191a" : "white"}`,
                    }}
                  >
                    <Avatar
                      image={avatarUrl}
                      label={!avatarUrl ? avatarLabel : undefined}
                      shape="circle"
                      style={{
                        width: "100%",
                        height: "100%",
                        fontSize: "3rem",
                      }}
                      className="font-black bg-linear-to-br from-slate-500 to-slate-600 text-white"
                    />
                  </div>
                  {/* Camera icon overlay */}
                  <Button
                    className={`absolute! bottom-2! right-2! w-9! h-9! rounded-full! flex! items-center! justify-center! cursor-pointer! transition-colors!`}
                    icon="pi pi-camera "
                    rounded
                    size="small"
                    pt={{
                      root: {
                        className: `!bg-linear-to-br !from-slate-500 !to-slate-600 !border-none !shadow-none !ring-0 !outline-none !focus:ring-0 !focus:outline-none !focus:border-none transition-all duration-300 active:scale-90 w-10 h-10 flex items-center justify-center bg-transparent`,
                      },
                      icon: {
                        className: `text-xl ${isDark ? "text-cyan-400" : "text-black"} opacity-80 group-hover:opacity-100`,
                      },
                    }}
                    tooltip="Thay đổi ảnh đại diện"
                    tooltipOptions={{
                      position: "bottom",
                      mouseTrack: true,
                      mouseTrackTop: 15,
                      mouseTrackLeft: 15,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Name + info */}
            <div className="flex-1 py-3 sm:pb-3 sm:pt-2">
              {isLoading ? (
                <GlobalLoading />
              ) : (
                <>
                  <div className="flex flex-col justify-start items-start gap-2 mb-0.5">
                    <h1 className={`text-3xl font-black `}>{displayName}</h1>
                    {user?.isAdmin ? (
                      <Tag
                        severity="danger"
                        value="Admin"
                        rounded
                        className="text-xs"
                      />
                    ) : (
                      <Tag
                        severity="info"
                        value="User"
                        rounded
                        className="text-xs"
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {!isLoading && (
              <div className="flex gap-2 shrink-0 pb-3 pt-2 sm:pt-0">
                {!user?.isActive ? (
                  <Tag
                    severity="warning"
                    value="Bị khoá"
                    rounded
                    className="text-xs"
                  />
                ) : (
                  <Tag
                    severity="success"
                    value="Hoạt động"
                    rounded
                    className="text-xs"
                  />
                )}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className={`border-t my-4`} />

          {/* Tabs + more button */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`px-4 py-3 text-sm font-bold whitespace-nowrap cursor-pointer transition-colors border-b-2 ${
                    activeTab === t.key
                      ? "border-[#1877f2] text-[#1877f2]"
                      : `border-transparent   rounded-md hover:border-transparent`
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        {activeTab === "infomation" && (
          <div className="">
            {/* Left column */}
            <div className="sm:col-span-2 space-y-4">
              {/* Thông tin cá nhân card */}
              <div className={`rounded-xl p-4  border `}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-xl font-black `}>Thông tin cá nhân</h3>
                  <button
                    className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer ${
                      isDark
                        ? "bg-[#3a3b3c] text-slate-300 hover:bg-[#4e4f50]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <i className="pi pi-pencil text-sm" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} height="24px" />
                    ))}
                  </div>
                ) : (
                  <div>
                    {student?.school && (
                      <AboutInfoRow
                        icon="pi pi-building"
                        text={`Học tại ${student.school}`}
                      />
                    )}
                    {student?.occupation && (
                      <AboutInfoRow
                        icon="pi pi-briefcase"
                        text={student.occupation}
                      />
                    )}
                    {birthday && (
                      <AboutInfoRow
                        icon="pi pi-gift"
                        text={`Sinh ngày ${birthday}`}
                      />
                    )}
                    {student?.gender && (
                      <AboutInfoRow
                        icon={
                          student.gender === "male"
                            ? "pi pi-mars"
                            : student.gender === "female"
                              ? "pi pi-venus"
                              : "pi pi-venus-mars"
                        }
                        text={genderMap[student.gender] ?? student.gender}
                      />
                    )}
                    <AboutInfoRow
                      icon="pi pi-phone"
                      text={student?.phone || user?.username}
                    />
                    <AboutInfoRow
                      icon="pi pi-envelope"
                      text={student?.email || user?.email}
                    />
                    {student?.targetCertId && (
                      <AboutInfoRow
                        icon="pi pi-star"
                        text={`Chứng chỉ mục tiêu: ${student.targetCertId}`}
                      />
                    )}
                    {student?.targetScore && (
                      <AboutInfoRow
                        icon="pi pi-chart-bar"
                        text={`Mục tiêu: ${student.targetScore} điểm`}
                      />
                    )}
                    {joinDate && (
                      <AboutInfoRow
                        icon="pi pi-calendar"
                        text={`Tham gia: ${joinDate}`}
                      />
                    )}
                    {lastLoginAt && (
                      <AboutInfoRow
                        icon="pi pi-clock"
                        text={`Đăng nhập gần nhất: ${lastLoginAt}`}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "friends" && (
          <div
            className={`rounded-xl p-8  border  flex flex-col items-center justify-center gap-3 text-center`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? "bg-[#3a3b3c]" : "bg-slate-100"}`}
            >
              <i className={`pi pi-users text-2xl `} />
            </div>
            <p className={`text-sm font-semibold `}>Chưa có bạn bè nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
