import { courseService } from "@/services/course.service";
import { create } from "zustand";

export interface Instructor {
  id: string;
  name: string;
  avatar: string;
  role: string;
  credentials: string;
  bio: string;
  rating: number;
  totalStudents: number;
  coursesCount: number;
}

export type LessonType = "video" | "reading" | "quiz" | "ai_practice" | "assignment";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  durationMinutes: number;
  videoUrl?: string;
  isPreview?: boolean;
  content?: string;
  resources?: { name: string; size: string; url: string }[];
  quizQuestionsCount?: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description?: string;
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  createdAt: string;
  comment: string;
  targetBand?: string;
  helpfulCount: number;
}

export type CourseExamType = "all" | "ielts" | "toeic" | "vstep" | "communication" | "grammar";
export type CourseCefrLevel = "all" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type CoursePriceType = "all" | "free" | "pro" | "mentor";

export interface Course {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnailUrl: string;
  trailerVideoUrl?: string;
  examType: CourseExamType;
  levelFrom: CourseCefrLevel;
  levelTo: CourseCefrLevel;
  badge?: string;
  isPopular?: boolean;
  isFeatured?: boolean;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  isFree?: boolean;
  hasMentor?: boolean;
  rating: number;
  reviewCount: number;
  studentCount: number;
  totalDurationHours: number;
  totalLessons: number;
  updatedAt: string;
  language: string;
  instructor: Instructor;
  learningOutcomes: string[];
  requirements: string[];
  targetAudience: string[];
  sections: CourseSection[];
  reviews: CourseReview[];
}

export interface LessonNote {
  id: string;
  courseId: string;
  lessonId: string;
  timestamp: number; // Video timestamp in seconds
  content: string;
  createdAt: number;
}

interface CourseState {
  courses: Course[];
  isLoading: boolean;
  error?: string | null;
  searchQuery: string;
  selectedExamType: CourseExamType;
  selectedCefrLevel: CourseCefrLevel;
  selectedPriceType: CoursePriceType;
  sortBy: "popular" | "newest" | "rating" | "price_asc" | "price_desc";

  // Enrolled courses & progress
  enrolledCourseIds: string[];
  completedLessonIds: Record<string, string[]>; // courseId -> lessonId[]
  lessonNotes: LessonNote[];

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedExamType: (type: CourseExamType) => void;
  setSelectedCefrLevel: (level: CourseCefrLevel) => void;
  setSelectedPriceType: (type: CoursePriceType) => void;
  setSortBy: (sort: CourseState["sortBy"]) => void;
  enrollCourse: (courseId: string) => Promise<void>;
  toggleCompleteLesson: (courseId: string, lessonId: string) => void;
  addLessonNote: (note: Omit<LessonNote, "id" | "createdAt">) => void;
  deleteLessonNote: (noteId: string) => void;
  getCourseBySlug: (slug: string) => Course | undefined;
  getCourseProgress: (courseId: string) => number; // 0 - 100%
  loadCourses: () => Promise<void>;
  loadCourseBySlug: (slug: string) => Promise<Course | undefined>;
  loadMyEnrollments: () => Promise<void>;
  loadLesson: (courseSlug: string, lessonId: string) => Promise<Lesson | undefined>;
  markLessonComplete: (courseId: string, lessonId: string, lastBlockId?: string) => Promise<void>;
}

// ----------------------------------------------------
// MOCK DATA: Giảng viên chuẩn quốc tế
// ----------------------------------------------------
const MOCK_INSTRUCTORS: Record<string, Instructor> = {
  alex: {
    id: "inst-1",
    name: "ThS. Alex Nguyễn",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Head of IELTS Training",
    credentials: "IELTS 8.5 (9.0 Reading & Listening) · Cựu du học sinh Anh",
    bio: "Hơn 9 năm kinh nghiệm đào tạo IELTS chuyên sâu, giúp hơn 3.500 học viên đạt mục tiêu 7.0+ và 8.0+.",
    rating: 4.95,
    totalStudents: 14200,
    coursesCount: 4,
  },
  sarah: {
    id: "inst-2",
    name: "Cô Sarah Trần",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    role: "Chuyên gia Luyện Thi TOEIC",
    credentials: "TOEIC 990/990 Tuyệt Đối · Giảng viên ĐH Ngoại Thương",
    bio: "Chuyên gia bóc tách bẫy đề thi ETS TOEIC format mới, tác giả bộ sách 'Bí kíp 850+ TOEIC cấp tốc'.",
    rating: 4.92,
    totalStudents: 18900,
    coursesCount: 5,
  },
  michael: {
    id: "inst-3",
    name: "Thầy Michael Vũ",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Giảng viên VSTEP & Tiếng Anh Học Thuật",
    credentials: "VSTEP C1 · Thạc sĩ TESOL University of Sydney",
    bio: "Chuyên sâu bồi dưỡng VSTEP B1-B2-C1 chuẩn khung Châu Âu, tỷ lệ học viên đỗ ngay lần đầu trên 94%.",
    rating: 4.88,
    totalStudents: 9800,
    coursesCount: 3,
  },
};

// ----------------------------------------------------
// MOCK DATA: Danh sách Khóa Học Cao Cấp
// ----------------------------------------------------
export const MOCK_COURSES: Course[] = [
  {
    id: "course-1",
    slug: "ielts-mastery-7.5",
    title: "IELTS Mastery 7.5+: Bứt Phá 4 Kỹ Năng Toàn Diện",
    shortDescription: "Chiến lược làm bài thực chiến, nâng cấp vốn từ vựng C1/C2 và chấm bài Writing/Speaking trực tiếp cùng AI & Mentor.",
    description: "Khóa học IELTS Mastery 7.5+ được thiết kế bài bản theo chuẩn khảo thí Cambridge & IDP. Học viên sẽ được trang bị hệ thống phương pháp tư duy Linear Thinking cho Reading & Listening, cùng ma trận Rubric 4 tiêu chí cho Writing Task 1-2 và phản xạ Speaking A.R.E.A.",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80",
    trailerVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    examType: "ielts",
    levelFrom: "B1",
    levelTo: "C1",
    badge: "Bestseller",
    isPopular: true,
    isFeatured: true,
    price: 1299000,
    originalPrice: 2499000,
    discountPercent: 48,
    hasMentor: true,
    rating: 4.96,
    reviewCount: 1420,
    studentCount: 8650,
    totalDurationHours: 42,
    totalLessons: 68,
    updatedAt: "08/2026",
    language: "Tiếng Việt & Tiếng Anh",
    instructor: MOCK_INSTRUCTORS.alex,
    learningOutcomes: [
      "Làm chủ 100% dạng bài IELTS Reading & Listening với phương pháp tư duy tuyến tính.",
      "Viết bài Writing Task 1 & Task 2 đạt chuẩn Band 7.5+ với cấu trúc ngữ pháp phức và từ vựng C1/C2.",
      "Tự tin trả lời Speaking Part 1, 2, 3 mượt mà, lưu loát không ngập ngừng.",
      "Được trợ lý AI LingoBot chấm bài và sửa lỗi ngữ pháp chi tiết từng dòng.",
      "Nhận ngân hàng 50+ đề thi dự đoán sát đề thi thật 2026.",
    ],
    requirements: [
      "Trình độ đầu vào tương đương IELTS 5.0 - 5.5 hoặc TOEIC 600+.",
      "Cam kết dành tối thiểu 4 - 6 giờ mỗi tuần để luyện tập thực hành.",
    ],
    targetAudience: [
      "Học viên đang ở mức 5.0 - 5.5 muốn bứt phá lên 7.0 - 8.0.",
      "Người chuẩn bị nộp hồ sơ du học, xét tuyển đại học hoặc định cư quốc tế.",
    ],
    sections: [
      {
        id: "sec-1",
        title: "Chương 1: Tổng Quan & Định Hướng Bứt Phá Band 7.5+",
        description: "Phân tích ma trận đề thi mới nhất và phương pháp học hiệu quả.",
        lessons: [
          {
            id: "les-101",
            title: "1.1 Lộ trình bứt phá IELTS 7.5+ trong 90 ngày",
            type: "video",
            durationMinutes: 18,
            isPreview: true,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
            content: "Chào mừng bạn đến với khóa học IELTS Mastery 7.5+! Trong bài học mở đầu này, thầy Alex Nguyễn sẽ giúp bạn phân tích rõ ràng mục tiêu và cách phân bổ thời gian học tập tối ưu.",
            resources: [{ name: "Study_Plan_90_Days.pdf", size: "1.8 MB", url: "#" }],
          },
          {
            id: "les-102",
            title: "1.2 Ma trận 4 tiêu chí chấm điểm Writing & Speaking 2026",
            type: "reading",
            durationMinutes: 15,
            isPreview: true,
            content: "Tìm hiểu chi tiết các tiêu chí: Task Achievement, Coherence & Cohesion, Lexical Resource, và Grammatical Range & Accuracy.",
          },
          {
            id: "les-103",
            title: "1.3 Bài kiểm tra năng lực đầu vào (Diagnostic Test)",
            type: "quiz",
            durationMinutes: 30,
            quizQuestionsCount: 25,
          },
        ],
      },
      {
        id: "sec-2",
        title: "Chương 2: IELTS Writing Task 2 - Xây Dựng Luận Điểm Band 8.0",
        description: "Phương pháp tư duy lập luận logic và bộ từ vựng học thuật C1/C2.",
        lessons: [
          {
            id: "les-201",
            title: "2.1 Cấu trúc bài luận 4 đoạn hoàn hảo (The 4-Paragraph Essay)",
            type: "video",
            durationMinutes: 24,
            videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            content: "Khám phá cấu trúc chuẩn xác: Introduction (Paraphrase + Thesis statement), 2 Body Paragraphs, và Conclusion.",
          },
          {
            id: "les-202",
            title: "2.2 Kỹ thuật Paraphrasing và Nominalization nâng band",
            type: "video",
            durationMinutes: 22,
          },
          {
            id: "les-203",
            title: "2.3 Thực hành viết luận & Chấm bài cùng LingoAI Grader",
            type: "ai_practice",
            durationMinutes: 45,
          },
        ],
      },
      {
        id: "sec-3",
        title: "Chương 3: IELTS Speaking - Phản Xạ Tự Nhiên & Fluency",
        lessons: [
          {
            id: "les-301",
            title: "3.1 Phương pháp A.R.E.A trả lời Speaking Part 1",
            type: "video",
            durationMinutes: 20,
          },
          {
            id: "les-302",
            title: "3.2 Chinh phục Speaking Part 2 với mindmap 1 phút",
            type: "video",
            durationMinutes: 26,
          },
          {
            id: "les-303",
            title: "3.3 Phỏng vấn 1-1 mô phỏng cùng AI Examiner",
            type: "ai_practice",
            durationMinutes: 35,
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-1",
        userName: "Hoàng Minh Tuấn",
        userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        createdAt: "2 ngày trước",
        comment: "Khóa học cực kỳ chất lượng! Mình vừa thi hôm 15/08 và đạt Overall 7.5 (Writing 7.0, Speaking 7.5). Các mẹo của thầy Alex và phần chấm bài AI của LingoArena sát đề thật 100%.",
        targetBand: "Đạt IELTS 7.5",
        helpfulCount: 48,
      },
      {
        id: "rev-2",
        userName: "Nguyễn Thùy Linh",
        userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        createdAt: "1 tuần trước",
        comment: "Video bài giảng ngắn gọn, súc tích, đi thẳng vào trọng tâm. Rất thích tính năng làm bài tập tương tác ngay dưới video.",
        targetBand: "Đạt IELTS 8.0",
        helpfulCount: 32,
      },
    ],
  },
  {
    id: "course-2",
    slug: "toeic-super-850",
    title: "TOEIC Super 850+: Chinh Phục Nghe - Đọc Cấp Tốc",
    shortDescription: "Bóc tách 100% bẫy đề thi ETS Part 1 - 7, nắm vững 1.200 từ vựng cốt lõi và chiến thuật quản lý thời gian thi.",
    description: "Khóa học TOEIC Super 850+ được biên soạn bởi cô Sarah Trần với hơn 8 năm kinh nghiệm giảng dạy. Khóa học tập trung vào việc giải quyết triệt để các bẫy ngữ pháp Part 5-6 và kỹ năng Scanning/Skimming Part 7 nhanh gấp 2 lần.",
    thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    trailerVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    examType: "toeic",
    levelFrom: "A2",
    levelTo: "B2",
    badge: "Hot Khóa Học",
    isPopular: true,
    isFeatured: true,
    price: 899000,
    originalPrice: 1790000,
    discountPercent: 50,
    hasMentor: false,
    rating: 4.93,
    reviewCount: 2150,
    studentCount: 12400,
    totalDurationHours: 35,
    totalLessons: 54,
    updatedAt: "08/2026",
    language: "Tiếng Việt",
    instructor: MOCK_INSTRUCTORS.sarah,
    learningOutcomes: [
      "Đạt điểm mục tiêu TOEIC 850+ chỉ sau 60 ngày học tập đều đặn.",
      "Nhận diện ngay 15 dạng bẫy phổ biến trong Part 5 & Part 6 trong vòng 15 giây.",
      "Tăng tốc độ đọc hiểu Part 7, hoàn thành bài thi trước thời gian 10 phút.",
      "Thực hành 10 bộ đề thi thử full 200 câu với lời giải chi tiết từng câu.",
    ],
    requirements: [
      "Trình độ đầu vào cơ bản (khoảng 350 - 450 điểm TOEIC).",
      "Có laptop hoặc điện thoại thông minh để làm bài luyện tập.",
    ],
    targetAudience: [
      "Sinh viên cần chuẩn đầu ra tốt nghiệp đại học.",
      "Người đi làm cần chứng chỉ TOEIC để xét tăng lương, thăng tiến công việc.",
    ],
    sections: [
      {
        id: "sec-toeic-1",
        title: "Chương 1: Chiến Thuật Listening Part 1 & Part 2",
        lessons: [
          {
            id: "les-t101",
            title: "1.1 Bẫy âm đồng âm và đa nghĩa trong Part 1",
            type: "video",
            durationMinutes: 20,
            isPreview: true,
          },
          {
            id: "les-t102",
            title: "1.2 Phương pháp loại trừ câu trả lời gián tiếp Part 2",
            type: "video",
            durationMinutes: 22,
          },
        ],
      },
      {
        id: "sec-toeic-2",
        title: "Chương 2: Đột Phá Reading Part 5 - Ngữ Pháp & Từ Loại",
        lessons: [
          {
            id: "les-t201",
            title: "2.1 Bí kíp giải câu từ loại trong 10 giây",
            type: "video",
            durationMinutes: 18,
            isPreview: true,
          },
          {
            id: "les-t202",
            title: "2.2 Luyện 50 câu trắc nghiệm bẫy liên từ & giới từ",
            type: "quiz",
            durationMinutes: 30,
            quizQuestionsCount: 50,
          },
        ],
      },
    ],
    reviews: [
      {
        id: "rev-toeic-1",
        userName: "Trần Đức Nam",
        userAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
        rating: 5,
        createdAt: "3 ngày trước",
        comment: "Khóa học quá đỉnh, cô Sarah dạy rất dễ hiểu. Mình từ 480 thi xong đỗ 890 điểm TOEIC.",
        targetBand: "Đạt TOEIC 890",
        helpfulCount: 65,
      },
    ],
  },
  {
    id: "course-3",
    slug: "vstep-b2-c1-express",
    title: "VSTEP B2 - C1 Express: Chinh Phục Chuẩn Đầu Ra Thạc Sĩ",
    shortDescription: "Hệ thống hóa toàn diện 4 kỹ năng thi VSTEP theo format Bộ GD&ĐT, mẹo giải đề Listening & Reading đạt điểm cao.",
    description: "Khóa học thiết kế tinh gọn cho học viên cần bằng VSTEP B1, B2, C1 cấp tốc phục vụ tốt nghiệp, đầu vào thạc sĩ, tiến sĩ và công chức nhà nước.",
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80",
    examType: "vstep",
    levelFrom: "B1",
    levelTo: "C1",
    badge: "Cấp Tốc",
    price: 990000,
    originalPrice: 1800000,
    discountPercent: 45,
    rating: 4.89,
    reviewCount: 890,
    studentCount: 4300,
    totalDurationHours: 28,
    totalLessons: 42,
    updatedAt: "07/2026",
    language: "Tiếng Việt",
    instructor: MOCK_INSTRUCTORS.michael,
    learningOutcomes: [
      "Nắm trọn vẹn format thi VSTEP 4 kỹ năng chuẩn Bộ GD&ĐT.",
      "Chiến lược xử lý 3 phần thi Speaking VSTEP tự tin ghi điểm B2/C1.",
      "Mẫu bài viết Writing Task 1 (Thư tín) và Task 2 (Bài luận 250 từ) điểm cao.",
    ],
    requirements: ["Trình độ tiếng Anh căn bản A2."],
    targetAudience: ["Học viên cao học, giáo viên, công chức, sinh viên chuẩn bị ra trường."],
    sections: [],
    reviews: [],
  },
  {
    id: "course-4",
    slug: "practical-business-english",
    title: "Tiếng Anh Giao Tiếp & Công Sở Quốc Tế (Business English)",
    shortDescription: "Thuyết trình chuyên nghiệp, đàm phán hợp đồng, viết Email thương mại chuẩn phong cách bản xứ.",
    description: "Khóa học thực chiến giúp bạn xóa bỏ rào cản tự ti khi giao tiếp tiếng Anh với đối tác nước ngoài, đồng nghiệp quốc tế.",
    thumbnailUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80",
    examType: "communication",
    levelFrom: "A2",
    levelTo: "B2",
    badge: "Thực Chiến",
    price: 750000,
    originalPrice: 1500000,
    discountPercent: 50,
    rating: 4.91,
    reviewCount: 760,
    studentCount: 3900,
    totalDurationHours: 22,
    totalLessons: 36,
    updatedAt: "08/2026",
    language: "Song ngữ Anh - Việt",
    instructor: MOCK_INSTRUCTORS.alex,
    learningOutcomes: [
      "Viết email công việc chuẩn mực, súc tích và chuyên nghiệp.",
      "Tự tin thuyết trình và bảo vệ ý kiến trong các cuộc họp quốc tế.",
      "Phản xạ đàm phán và xử lý tình huống phát sinh với đối tác nước ngoài.",
    ],
    requirements: ["Không yêu cầu trình độ cao, phù hợp với người đi làm."],
    targetAudience: ["Nhân viên văn phòng, quản lý, startup muốn mở rộng thị trường."],
    sections: [],
    reviews: [],
  },
  {
    id: "course-5",
    slug: "ielts-starter-free",
    title: "Khởi Động IELTS 0 Đến 5.0 (Foundation Free)",
    shortDescription: "Nền tảng phát âm IPA chuẩn Mỹ, ngữ pháp cốt lõi và 500 từ vựng khởi động hoàn toàn miễn phí.",
    description: "Khóa học miễn phí 100% dành cho người mất gốc hoặc mới bắt đầu tìm hiểu về kỳ thi IELTS.",
    thumbnailUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
    examType: "ielts",
    levelFrom: "A1",
    levelTo: "B1",
    badge: "Miễn Phí 100%",
    isFree: true,
    price: 0,
    rating: 4.94,
    reviewCount: 3400,
    studentCount: 26000,
    totalDurationHours: 16,
    totalLessons: 24,
    updatedAt: "08/2026",
    language: "Tiếng Việt",
    instructor: MOCK_INSTRUCTORS.alex,
    learningOutcomes: [
      "Chuẩn hóa 44 âm trong bảng phiên âm quốc tế IPA.",
      "Làm chủ 12 thì tiếng Anh thông dụng và các cấu trúc câu cơ bản.",
      "Tự tin bước vào giai đoạn luyện thi IELTS chuyên sâu.",
    ],
    requirements: ["Người mới bắt đầu hoặc mất gốc tiếng Anh."],
    targetAudience: ["Học sinh, sinh viên, người mới bắt đầu làm quen với IELTS."],
    sections: [],
    reviews: [],
  },
];

type ApiCourse = Record<string, any>;
type ApiLesson = Record<string, any>;

const DEFAULT_INSTRUCTOR: Instructor = {
  id: "lingoarena-academy",
  name: "LingoArena Academy",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  role: "Ban chuyên môn LingoArena",
  credentials: "Đội ngũ học thuật LingoArena",
  bio: "Khóa học được biên soạn bởi đội ngũ chuyên môn LingoArena.",
  rating: 4.9,
  totalStudents: 0,
  coursesCount: 1,
};

function mapExamType(code?: string): CourseExamType {
  const normalized = (code || "").toLowerCase();
  if (["ielts", "toeic", "vstep", "communication", "grammar"].includes(normalized)) {
    return normalized as CourseExamType;
  }
  return "all";
}

function mapLesson(api: ApiLesson): Lesson {
  const blocks = (api.blocks || []).sort((a: any, b: any) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0));
  const videoBlock = blocks.find((block: any) => block.blockType === "VIDEO" && block.contentJson?.videoUrl);
  const text = blocks
    .map((block: any) => block.contentJson?.html || block.contentJson?.text || "")
    .filter(Boolean)
    .join("\n\n");
  const type: LessonType = videoBlock ? "video" : api.lessonType === "QUIZ" ? "quiz" : "reading";
  return {
    id: api.id,
    title: api.title || "Bài học",
    type,
    durationMinutes: Number(api.estimatedMinutes || 15),
    isPreview: Boolean(api.isPreview),
    videoUrl: videoBlock?.contentJson?.videoUrl,
    content: text,
  };
}

export function mapApiCourse(api: ApiCourse): Course {
  const version = (api.versions || [])[0];
  const sections: CourseSection[] = (version?.sections || []).map((section: any) => ({
    id: section.id,
    title: section.title || "Chương học",
    description: section.description || "",
    lessons: (section.lessons || []).map(mapLesson),
  }));
  const lessons = sections.flatMap((section) => section.lessons);
  const estimatedMinutes =
    Number(api.estimatedMinutes || 0) || lessons.reduce((total, lesson) => total + lesson.durationMinutes, 0);

  return {
    id: api.id,
    slug: api.slug,
    title: api.title || "Khóa học",
    shortDescription: api.shortDescription || "Khóa học LingoArena",
    description: api.description || api.shortDescription || "Nội dung khóa học đang được cập nhật.",
    thumbnailUrl:
      api.thumbnailUrl ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80",
    examType: mapExamType(api.examType?.code),
    levelFrom: (api.levelFrom || "A1") as CourseCefrLevel,
    levelTo: (api.levelTo || "C1") as CourseCefrLevel,
    badge: api.status === "PUBLISHED" ? "Đã xuất bản" : undefined,
    isPopular: false,
    isFeatured: false,
    price: 0,
    isFree: true,
    hasMentor: false,
    rating: 4.9,
    reviewCount: 0,
    studentCount: 0,
    totalDurationHours: Math.max(1, Math.ceil(estimatedMinutes / 60)),
    totalLessons: lessons.length,
    updatedAt: api.updatedAt ? new Date(api.updatedAt).toLocaleDateString("vi-VN", { month: "2-digit", year: "numeric" }) : "",
    language: "Tiếng Việt",
    instructor: DEFAULT_INSTRUCTOR,
    learningOutcomes: ["Nắm được lộ trình học và nội dung trọng tâm của khóa học."],
    requirements: ["Sẵn sàng dành thời gian học đều đặn trên LingoArena."],
    targetAudience: ["Học viên muốn học theo lộ trình có cấu trúc."],
    sections,
    reviews: [],
  };
}

export const useCourseStore = create<CourseState>((set, get) => ({
  courses: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedExamType: "all",
  selectedCefrLevel: "all",
  selectedPriceType: "all",
  sortBy: "popular",

  enrolledCourseIds: [],
  completedLessonIds: {},
  lessonNotes: [],

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedExamType: (selectedExamType) => set({ selectedExamType }),
  setSelectedCefrLevel: (selectedCefrLevel) => set({ selectedCefrLevel }),
  setSelectedPriceType: (selectedPriceType) => set({ selectedPriceType }),
  setSortBy: (sortBy) => set({ sortBy }),

  enrollCourse: async (courseId) => {
    await courseService.enroll(courseId);
    set((state) => {
      if (state.enrolledCourseIds.includes(courseId)) return state;
      return {
        enrolledCourseIds: [...state.enrolledCourseIds, courseId],
        completedLessonIds: {
          ...state.completedLessonIds,
          [courseId]: state.completedLessonIds[courseId] || [],
        },
      };
    });
  },

  toggleCompleteLesson: (courseId, lessonId) => {
    set((state) => {
      const current = state.completedLessonIds[courseId] || [];
      const updated = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];

      return {
        completedLessonIds: {
          ...state.completedLessonIds,
          [courseId]: updated,
        },
      };
    });
  },

  addLessonNote: (noteData) => {
    const newNote: LessonNote = {
      ...noteData,
      id: `note-${Date.now()}`,
      createdAt: Date.now(),
    };
    set((state) => ({
      lessonNotes: [newNote, ...state.lessonNotes],
    }));
  },

  deleteLessonNote: (noteId) => {
    set((state) => ({
      lessonNotes: state.lessonNotes.filter((n) => n.id !== noteId),
    }));
  },

  getCourseBySlug: (slug) => {
    return get().courses.find((c) => c.slug === slug);
  },

  getCourseProgress: (courseId) => {
    const course = get().courses.find((c) => c.id === courseId);
    if (!course) return 0;
    const completed = get().completedLessonIds[courseId] || [];
    const totalLessons = course.totalLessons || 1;
    return Math.min(100, Math.round((completed.length / totalLessons) * 100));
  },

  loadCourses: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await courseService.pagination(0, 100, {});
      set({ courses: res.data.map(mapApiCourse), isLoading: false });
    } catch (error: any) {
      set({ error: error?.message || "Không tải được danh sách khóa học", isLoading: false });
    }
  },

  loadCourseBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const course = mapApiCourse(await courseService.bySlug(slug));
      set((state) => ({
        courses: [course, ...state.courses.filter((item) => item.id !== course.id)],
        isLoading: false,
      }));
      return course;
    } catch (error: any) {
      set({ error: error?.message || "Không tải được khóa học", isLoading: false });
      return undefined;
    }
  },

  loadMyEnrollments: async () => {
    try {
      const res = await courseService.myEnrollments();
      const enrolledIds = res.data.map((item: any) => item.courseId).filter(Boolean);
      const enrolledCourses = res.data.map((item: any) => item.course).filter(Boolean).map(mapApiCourse);
      set((state) => ({
        enrolledCourseIds: enrolledIds,
        courses: [
          ...state.courses,
          ...enrolledCourses.filter((course: Course) => !state.courses.some((item) => item.id === course.id)),
        ],
      }));
    } catch {
      set({ enrolledCourseIds: [] });
    }
  },

  loadLesson: async (courseSlug, lessonId) => {
    const lesson = mapLesson(await courseService.lesson(lessonId));
    set((state) => ({
      courses: state.courses.map((course) =>
        course.slug !== courseSlug
          ? course
          : {
              ...course,
              sections: course.sections.map((section) => ({
                ...section,
                lessons: section.lessons.map((item) => (item.id === lesson.id ? lesson : item)),
              })),
            },
      ),
    }));
    return lesson;
  },

  markLessonComplete: async (courseId, lessonId, lastBlockId) => {
    await courseService.progress(lessonId, {
      status: "COMPLETED",
      progressPercent: 100,
      lastBlockId,
    });
    const completed = get().completedLessonIds[courseId] || [];
    if (!completed.includes(lessonId)) {
      set((state) => ({
        completedLessonIds: {
          ...state.completedLessonIds,
          [courseId]: [...completed, lessonId],
        },
      }));
    }
  },
}));
