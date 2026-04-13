import { formatCurrency } from "@/common/helpers";
import BreadcrumbCustom from "@/components/ui/Breadcumb";
import { useTheme } from "@/context";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

const MOCK_COURSE_DETAIL = {
  id: "uuid-1",
  code: "IEL-ADV-001",
  title: "IELTS Mastery: Chinh phục 7.5+ toàn diện",
  description:
    "Khóa học được thiết kế dành riêng cho các học viên muốn bứt phá từ mức 6.0 lên 7.5+. Tập trung sâu vào chiến thuật xử lý các dạng bài khó trong Reading và Speaking.",
  thumbnailUrl:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
  price: 3500000,
  level: "Advanced",
  targetScore: "7.5 - 8.0",
  totalLessons: 12,
  totalDurationMins: 720,
  certType: {
    name: "IELTS",
    code: "IELTS",
    description: "Hệ thống kiểm tra tiếng Anh quốc tế",
    scoringSystem: { min: 0, max: 9.0, bands: 0.5 },
  },
  teacher: {
    fullName: "Nguyễn Minh Anh",
    avatarUrl: "https://i.pravatar.cc/150?u=teacher1",
    bio: "Hơn 8 năm kinh nghiệm giảng dạy IELTS tại các trung tâm lớn. Chứng chỉ IELTS 8.5 và CELTA.",
    specialties: ["IELTS", "Academic Writing"],
    certifications: ["IELTS 8.5", "Master in TESOL"],
    yearsExperience: 8,
  },
  lessons: [
    {
      title: "Giới thiệu cấu trúc bài thi IELTS 7.5+",
      durationMins: 45,
      isFreePreview: true,
    },
    {
      title: "Chiến thuật Listening: Xử lý Multiple Choice phức tạp",
      durationMins: 60,
      isFreePreview: false,
    },
    {
      title: "Reading: Kỹ thuật Matching Headings chuyên sâu",
      durationMins: 90,
      isFreePreview: false,
    },
    {
      title: "Writing Task 2: Cách triển khai ý tưởng logic",
      durationMins: 120,
      isFreePreview: false,
    },
  ],
};

export default function CourseDetailScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const course = MOCK_COURSE_DETAIL;

  const breadcrumbItems = [
    {
      label: "Khóa học",
      link: "/courses",
      icon: "pi-book",
    },
    {
      label: course.certType.name,
      link: `/courses?cert=${course.certType.code}`,
      icon: "pi-tags",
    },
    {
      label: course.title,
      active: true,
    },
  ];

  return (
    <div
      className={`min-h-screen pb-20 pt-10 transition-colors ${isDark ? "bg-[#0f172a] text-slate-200" : "bg-[#f8fafc] text-slate-800"}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* BREADCRUMB & HEADER */}
        <div className="mb-8">
          <BreadcrumbCustom items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-tight">
            {course.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <Badge
              value={course.level}
              severity="info"
              className="px-3 py-1 font-bold"
            ></Badge>
            <div className="flex items-center gap-1.5 text-sm font-medium opacity-70">
              <i className="pi pi-users text-blue-500"></i>
              <span>1,240 Học viên đã tham gia</span>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium opacity-70">
              <i className="pi pi-calendar-plus text-blue-500"></i>
              <span>Cập nhật gần nhất: 20/05/2026</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* CỘT TRÁI - NỘI DUNG CHÍNH */}
          <div className="lg:col-span-2 space-y-10">
            {/* 1. MÔ TẢ KHÓA HỌC */}
            <section
              className={`p-6 rounded-3xl border ${isDark ? "bg-slate-800/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="pi pi-info-circle text-blue-500"></i> Giới thiệu
                khóa học
              </h2>
              <p className="leading-relaxed opacity-80">{course.description}</p>
            </section>

            {/* 2. GIÁO VIÊN (TeacherEntity) */}
            <section
              className={`p-8 rounded-3xl border ${isDark ? "bg-slate-800/40 border-white/5" : "bg-white border-slate-200 shadow-sm"}`}
            >
              <h2 className="text-xl font-bold mb-6">Giảng viên phụ trách</h2>
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar
                  image={course.teacher.avatarUrl}
                  size="xlarge"
                  shape="circle"
                  className="w-24 h-24 border-4 border-blue-500/20"
                />
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-blue-500">
                    {course.teacher.fullName}
                  </h3>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-50 mb-3">
                    {course.teacher.yearsExperience} năm kinh nghiệm
                  </p>
                  <p className="mb-4 opacity-80 italic">
                    "{course.teacher.bio}"
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {course.teacher.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black"
                      >
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. LỘ TRÌNH BÀI HỌC (LessonEntity) */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Nội dung khóa học</h2>
                <span className="text-sm font-medium opacity-60">
                  {course.totalLessons} bài học •{" "}
                  {Math.round(course.totalDurationMins / 60)} giờ
                </span>
              </div>
              <Accordion multiple activeIndex={[0]}>
                <AccordionTab
                  header={
                    <span className="font-bold">
                      Phần 1: Nền tảng và Chiến thuật
                    </span>
                  }
                >
                  <div className="space-y-2">
                    {course.lessons.map((lesson, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isDark ? "hover:bg-white/5 border-transparent" : "hover:bg-blue-50 border-transparent"}`}
                      >
                        <div className="flex items-center gap-4">
                          <i
                            className={`pi ${lesson.isFreePreview ? "pi-play-circle text-green-500" : "pi-lock text-slate-400"}`}
                          ></i>
                          <span className="text-sm font-medium">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {lesson.isFreePreview && (
                            <Badge
                              value="Học thử"
                              severity="success"
                              className="text-[10px]"
                            ></Badge>
                          )}
                          <span className="text-xs opacity-50">
                            {lesson.durationMins} phút
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionTab>
              </Accordion>
            </section>
          </div>

          {/* CỘT PHẢI - SIDEBAR THANH TOÁN */}
          <div className="lg:col-span-1">
            <div
              className={`sticky top-24 rounded-3xl overflow-hidden border ${isDark ? "bg-slate-800 border-white/5 shadow-2xl" : "bg-white border-slate-200 shadow-xl"}`}
            >
              <div className="aspect-video relative">
                <img
                  src={course.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    {formatCurrency(course.price)}
                  </span>
                </div>

                <div className="space-y-4 mb-8 flex items-center justify-around">
                  <Button
                    label="Đăng ký ngay"
                    size="small"
                    outlined
                    severity="success"
                  />
                  <Button
                    label="Thêm vào giỏ hàng"
                    size="small"
                    outlined
                    severity="warning"
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-semibold uppercase  opacity-40">
                    Thông tin bổ sung
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-50 border-slate-100"}`}
                    >
                      <p className="text-[10px] opacity-60 uppercase font-bold mb-1">
                        Mục tiêu
                      </p>
                      <p className="text-sm font-black text-orange-500">
                        {course.targetScore}
                      </p>
                    </div>
                    <div
                      className={`p-4 rounded-2xl border ${isDark ? "bg-slate-900/50 border-white/5" : "bg-slate-50 border-slate-100"}`}
                    >
                      <p className="text-[10px] opacity-60 uppercase font-bold mb-1">
                        Chứng chỉ
                      </p>
                      <p className="text-sm font-black text-blue-500">
                        {course.certType.code}
                      </p>
                    </div>
                  </div>
                </div>

                <Divider className="my-6" />

                <ul className="space-y-3">
                  {[
                    "Truy cập trọn đời",
                    "Tài liệu bài giảng PDF đính kèm",
                    "Cam kết đầu ra bằng văn bản",
                    "Hỗ trợ giải đáp 24/7",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-xs font-medium"
                    >
                      <i className="pi pi-check-circle text-green-500"></i>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
