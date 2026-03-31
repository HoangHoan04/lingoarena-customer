import Carousel from "@/components/ui/carousel/Carousel";
import CarouselItem from "@/components/ui/carousel/CarouselItem";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "@/routes/hooks";
import { useState } from "react";

type Level = "beginner" | "intermediate" | "advanced";

interface Course {
  id: number;
  image: string;
  title: string;
  tag: string;
  level: Level;
  target: string;
  skills: string[];
}

const LEVEL_CONFIG: Record<Level, { label: string; bg: string; text: string }> =
  {
    beginner: {
      label: "Cơ bản",
      bg: "rgba(29,158,117,0.18)",
      text: "#1d9e75",
    },

    intermediate: {
      label: "Trung cấp",
      bg: "rgba(26,111,196,0.18)",
      text: "#378add",
    },

    advanced: {
      label: "Nâng cao",
      bg: "rgba(239,159,39,0.18)",
      text: "#d4860a",
    },
  };

const COURSES: Course[] = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&q=80",
    title: "IELTS Academic",
    tag: "Xét tuyển đại học",
    level: "intermediate",
    target: "Band 6.5 → 8.0",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    title: "IELTS General",
    tag: "Định cư & việc làm",
    level: "beginner",
    target: "Band 5.0 → 7.0",
    skills: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
    title: "TOEIC Listening & Reading",
    tag: "Chứng chỉ công việc",
    level: "beginner",
    target: "500 → 900 điểm",
    skills: ["Listening", "Reading"],
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80",
    title: "TOEIC Speaking & Writing",
    tag: "Kỹ năng giao tiếp",
    level: "intermediate",
    target: "120 → 200 điểm",
    skills: ["Speaking", "Writing"],
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&q=80",
    title: "TOEFL iBT",
    tag: "Du học Mỹ & Canada",
    level: "advanced",
    target: "80 → 110+ điểm",
    skills: ["Reading", "Listening", "Speaking", "Writing"],
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=600&q=80",
    title: "Cambridge B2 First",
    tag: "Chứng chỉ châu Âu",
    level: "intermediate",
    target: "B1 → B2 (CEFR)",
    skills: ["Reading", "Writing", "Listening", "Speaking"],
  },
  {
    id: 7,
    image:
      "https://images.unsplash.com/photo-1549057446-9f5c6ac91a04?w=600&q=80",
    title: "Cambridge C1 Advanced",
    tag: "Trình độ cao cấp",
    level: "advanced",
    target: "B2 → C1 (CEFR)",
    skills: ["Reading", "Writing", "Listening", "Speaking", "Use of English"],
  },
  {
    id: 8,
    image:
      "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600&q=80",
    title: "SAT English",
    tag: "Đại học Mỹ",
    level: "advanced",
    target: "600 → 800 điểm",
    skills: ["Reading", "Writing & Language"],
  },
  {
    id: 9,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
    title: "Tiếng Anh Giao Tiếp",
    tag: "Dành cho người mới",
    level: "beginner",
    target: "A1 → B1 (CEFR)",
    skills: ["Speaking", "Listening", "Vocabulary"],
  },
  {
    id: 10,
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80",
    title: "Business English",
    tag: "Tiếng Anh thương mại",
    level: "intermediate",
    target: "B1 → C1 (CEFR)",
    skills: ["Email", "Presentation", "Negotiation", "Meeting"],
  },
];

function TagBadge({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <span
      className="rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm"
      style={{
        background: isDark ? "rgba(10,22,38,0.78)" : "rgba(255,255,255,0.85)",
        color: isDark ? "#7db8e8" : "#1558a8",
        border: `1px solid ${isDark ? "rgba(26,111,196,0.4)" : "rgba(26,111,196,0.22)"}`,
      }}
    >
      {label}
    </span>
  );
}

function LevelBadge({ level }: { level: Level }) {
  const { label, bg, text } = LEVEL_CONFIG[level];
  return (
    <span
      className="rounded-full px-3 py-1 text-sm font-semibold"
      style={{ background: bg, color: text }}
    >
      {label}
    </span>
  );
}

function SkillChip({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <span
      className="rounded px-2 py-1 text-sm font-medium"
      style={{
        background: isDark ? "rgba(26,111,196,0.14)" : "rgba(26,111,196,0.07)",
        color: isDark ? "#7db8e8" : "#1558a8",
        border: `1px solid ${isDark ? "rgba(26,111,196,0.28)" : "rgba(26,111,196,0.18)"}`,
      }}
    >
      {label}
    </span>
  );
}

function CourseCard({ course, isDark }: { course: Course; isDark: boolean }) {
  const cardBg = isDark ? "#0e1f33" : "#ffffff";
  const titleColor = isDark ? "#e2f0fb" : "#0c1d33";
  const targetColor = isDark ? "#5a9fd4" : "#1a6fc4";
  const divider = isDark ? "rgba(26,111,196,0.15)" : "rgba(26,111,196,0.1)";
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: cardBg,
        border: `1px solid ${isDark ? "rgba(26,111,196,0.22)" : "rgba(26,111,196,0.14)"}`,
        boxShadow: isDark
          ? "0 4px 24px rgba(0,0,0,0.4)"
          : "0 4px 18px rgba(26,111,196,0.1)",
      }}
    >
      <div
        className="relative shrink-0 overflow-hidden"
        style={{ height: "350px" }}
      >
        <img
          src={course.image}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-500 ease-in-out"
          style={{ transform: isHovered ? "scale(1.08)" : "scale(1)" }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 h-20"
          style={{
            background: `linear-gradient(to bottom, transparent, ${cardBg})`,
          }}
        />

        <div className="absolute right-3 top-3">
          <TagBadge label={course.tag} isDark={isDark} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2.5 px-4 pb-4 pt-1">
        <h3
          className="text-2xl font-bold leading-snug"
          style={{ color: titleColor }}
        >
          {course.title}
        </h3>

        <div className="flex items-center justify-between">
          <span
            className="text-[12px] font-semibold"
            style={{ color: targetColor }}
          >
            <i className="pi pi-bookmark-fill mr-2"> </i>
            {course.target}
          </span>
          <LevelBadge level={course.level} />
        </div>

        <div className="h-px m-2" style={{ background: divider }} />

        <div className="flex flex-wrap gap-[5px]">
          {course.skills.map((skill) => (
            <SkillChip key={skill} label={skill} isDark={isDark} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CarouselSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const goToCourse = (id: number) => router.push(`/courses/${id}`);

  return (
    <>
      <Carousel
        colors={{
          accent: "#1a6fc4",
          buttonBg: isDark ? "rgba(10,22,38,0.9)" : "rgba(255,255,255,0.92)",
          buttonHoverBg: isDark
            ? "rgba(26,111,196,0.25)"
            : "rgba(26,111,196,0.12)",
        }}
        sizes={{ itemWidth: "700px", itemHeight: "500px" }}
      >
        {COURSES.map((course) => (
          <CarouselItem
            key={course.id}
            gradient="transparent"
            hoverEffect={false}
            colors={{
              accent: "#1a6fc4",
              borderInactive: isDark
                ? "rgba(26,111,196,0.2)"
                : "rgba(26,111,196,0.14)",
              shadowActive: isDark
                ? "0 20px 50px rgba(0,0,0,0.5), 0 0 40px rgba(26,111,196,0.2)"
                : "0 20px 40px rgba(26,111,196,0.18), 0 0 20px rgba(26,111,196,0.1)",
            }}
            onItemClick={() => goToCourse(course.id)}
            clickIndicator={
              <span>
                Xem khoá học <span className="text-sm text-white">→</span>
              </span>
            }
          >
            <CourseCard course={course} isDark={isDark} />
          </CarouselItem>
        ))}
      </Carousel>
    </>
  );
}
