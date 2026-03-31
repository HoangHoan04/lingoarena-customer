import { useTheme } from "@/context";
import { useRouter } from "@/routes/hooks";
import { PUBLIC_ROUTES } from "@/routes/routes";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

// Mapping ID chứng chỉ với Style hiển thị
const CERTIFICATES = [
  {
    id: "IELTS",
    icon: "pi-book",
    desc: "Hệ thống kiểm tra quốc tế",
    color: "from-blue-600 to-cyan-500",
  },
  {
    id: "TOEIC",
    icon: "pi-briefcase",
    desc: "Tiếng Anh giao tiếp quốc tế",
    color: "from-purple-600 to-pink-500",
  },
  {
    id: "APTIS",
    icon: "pi-verified",
    desc: "Chứng chỉ từ Hội đồng Anh",
    color: "from-emerald-600 to-teal-500",
  },
  {
    id: "VSTEP",
    icon: "pi-graduation-cap",
    desc: "Khung ngoại ngữ Việt Nam",
    color: "from-orange-600 to-yellow-500",
  },
];

// Dữ liệu Mock chuẩn theo CourseEntity
const COURSES_MOCK = [
  {
    id: "uuid-1",
    code: "IEL-001",
    title: "IELTS Breakthrough Speaking",
    certTypeId: "IELTS",
    level: "Intermediate",
    price: 2500000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1544650030-3c51ad35a7ee?w=400",
    targetScore: "6.5+",
    totalLessons: 24,
    totalDurationMins: 1200,
  },
  {
    id: "uuid-2",
    code: "TOE-002",
    title: "TOEIC 750+ Full Skills",
    certTypeId: "TOEIC",
    level: "Advanced",
    price: 1800000,
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513258496099-48168024adb0?w=400",
    targetScore: "750-800",
    totalLessons: 30,
    totalDurationMins: 1500,
  },
  // Thêm các item khác tương tự...
];

export default function CourseScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const router = useRouter();
  const [searchParams, setSearchParams] = useSearchParams();
  const certQuery = searchParams.get("cert") || "IELTS";

  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState(null);

  const handleCertChange = (id: string) => {
    setSearchParams({ cert: id });
  };

  const filteredCourses = useMemo(() => {
    return COURSES_MOCK.filter(
      (c) =>
        c.certTypeId === certQuery &&
        (search === "" ||
          c.title.toLowerCase().includes(search.toLowerCase())) &&
        (!selectedLevel || c.level === selectedLevel),
    );
  }, [certQuery, search, selectedLevel]);

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div
      className={`min-h-screen pb-20 pt-7 transition-colors duration-500 ${isDark ? "bg-[#0f172a] text-slate-200" : "bg-[#f8fafc] text-slate-800"}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header: Chọn loại chứng chỉ */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
            <h1 className="text-2xl font-semibold tracking-tight uppercase">
              Khám phá khóa học
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CERTIFICATES.map((item) => {
              const active = certQuery === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => handleCertChange(item.id)}
                  className={`relative p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    active
                      ? `shadow-lg shadow-blue-500/20 border-transparent bg-gradient-to-br ${item.color} text-white scale-[1.02]`
                      : `${isDark ? "bg-slate-800/40 border-white/5" : "bg-white border-slate-200"} hover:border-blue-400`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-white/20" : "bg-blue-50 dark:bg-slate-700 text-blue-600"}`}
                    >
                      <i className={`pi ${item.icon} text-lg`}></i>
                    </div>
                    <div>
                      <h3 className="font-bold text-sm uppercase tracking-wider">
                        {item.id}
                      </h3>
                      <p
                        className={`text-[10px] leading-tight opacity-70 line-clamp-1 ${active ? "text-white" : "text-slate-500"}`}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-72 shrink-0">
            <div
              className={`sticky top-24 p-6 rounded-3xl border ${isDark ? "bg-slate-800/50 border-white/5" : "bg-white border-slate-200"}`}
            >
              <div className="flex items-center gap-2 mb-6 text-blue-500">
                <i className="pi pi-filter-fill text-sm"></i>
                <span className="font-bold text-xs uppercase tracking-widest">
                  Bộ lọc khóa học
                </span>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                    Tìm kiếm tên khóa
                  </label>
                  <span className="p-input-icon-left w-full">
                    <i className="pi pi-search px-3" />
                    <InputText
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Nhập tên khóa học..."
                      className="w-full rounded-xl border-slate-200 dark:bg-slate-900/50 text-sm"
                    />
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">
                    Trình độ (Level)
                  </label>
                  <Dropdown
                    value={selectedLevel}
                    options={[
                      { label: "Tất cả trình độ", value: null },
                      { label: "Cơ bản", value: "Beginner" },
                      { label: "Trung cấp", value: "Intermediate" },
                      { label: "Nâng cao", value: "Advanced" },
                    ]}
                    onChange={(e) => setSelectedLevel(e.value)}
                    placeholder="Chọn cấp độ"
                    className="w-full rounded-xl border-slate-200 dark:bg-slate-900/50 text-sm"
                  />
                </div>

                <Button
                  label="Xóa bộ lọc"
                  icon="pi pi-refresh"
                  className="p-button-text p-button-sm w-full text-[11px] font-bold"
                  onClick={() => {
                    setSearch("");
                    setSelectedLevel(null);
                  }}
                />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex items-end justify-between mb-6">
              <div>
                <span className="text-blue-500 font-bold text-xs uppercase tracking-widest">
                  Danh sách
                </span>
                <h2 className="text-xl font-semibold uppercase">
                  Khóa học {certQuery}
                </h2>
              </div>
              <div className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold border border-blue-500/20">
                {filteredCourses.length} khóa học
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(PUBLIC_ROUTES.COURSE_DETAIL)}
                  className={`group rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isDark
                      ? "bg-slate-800/40 border-white/5"
                      : "bg-white border-slate-200/60"
                  }`}
                >
                  {/* Thumbnail & Level Badge */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge
                        value={course.level}
                        severity="info"
                        className="text-[10px] px-2 py-1 font-bold"
                      ></Badge>
                    </div>
                    {course.targetScore && (
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold">
                        Target: {course.targetScore}
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase">
                        {course.code}
                      </span>
                    </div>

                    <h3
                      className={`text-base font-bold mb-3 line-clamp-2 min-h-[3rem] leading-tight transition-colors ${
                        isDark
                          ? "group-hover:text-blue-400"
                          : "group-hover:text-blue-600"
                      }`}
                    >
                      {course.title}
                    </h3>

                    {/* Stats: Lessons & Duration */}
                    <div className="flex items-center gap-4 mb-4 text-slate-400 text-[11px] font-medium">
                      <span className="flex items-center gap-1">
                        <i className="pi pi-play-circle"></i>{" "}
                        {course.totalLessons} bài học
                      </span>
                      <span className="flex items-center gap-1">
                        <i className="pi pi-clock"></i>{" "}
                        {Math.round(course.totalDurationMins / 60)} giờ
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/5">
                      <div className="flex flex-col">
                        <span className="text-xs text-slate-400 font-medium">
                          Học phí
                        </span>
                        <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                          {formatCurrency(course.price)}
                        </span>
                      </div>
                      <Button
                        icon="pi pi-arrow-right"
                        className="p-button-rounded p-button-primary w-10 h-10 shadow-lg shadow-blue-500/30"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(PUBLIC_ROUTES.COURSE_DETAIL);
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCourses.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-3xl opacity-50">
                <i className="pi pi-inbox text-4xl mb-4 text-slate-300"></i>
                <p className="font-bold text-sm uppercase tracking-widest">
                  Không tìm thấy khóa học nào
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
