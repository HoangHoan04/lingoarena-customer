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

export type LessonType =
  | "video"
  | "reading"
  | "quiz"
  | "ai_practice"
  | "assignment";

export interface LessonBlock {
  id: string;
  blockType: string;
  contentJson?: Record<string, any> | null;
  sortOrder?: number;
  items?: Array<{
    id: string;
    questionId?: string;
    points?: number;
    sortOrder?: number;
    question?: {
      prompt?: string;
      options?: Array<{ content?: string; label?: string; optionKey?: string; isCorrect?: boolean }>;
      currentVersion?: {
        prompt?: string;
        content?: string;
        options?: Array<{ content?: string; label?: string; optionKey?: string; isCorrect?: boolean }>;
        explanation?: string;
      };
    };
    questionVersion?: {
      prompt?: string;
      content?: string;
      options?: Array<{ content?: string; label?: string; optionKey?: string; isCorrect?: boolean }>;
      explanation?: string;
    };
  }>;
}

export interface Lesson {
  id: string;
  title: string;
  titleEn?: string;
  type: LessonType;
  durationMinutes: number;
  videoUrl?: string;
  isPreview?: boolean;
  content?: string;
  resources?: { name: string; size: string; url: string }[];
  quizQuestionsCount?: number;
  blocks?: LessonBlock[];
}

export interface CourseSection {
  id: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
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

export type CourseExamType =
  | "all"
  | "ielts"
  | "toeic"
  | "vstep"
  | "communication"
  | "grammar";
export type CourseCefrLevel = "all" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type CoursePriceType = "all" | "free" | "pro" | "mentor";

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  shortDescription: string;
  shortDescriptionEn?: string;
  description: string;
  descriptionEn?: string;
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
  loadLesson: (
    courseSlug: string,
    lessonId: string,
  ) => Promise<Lesson | undefined>;
  markLessonComplete: (
    courseId: string,
    lessonId: string,
    lastBlockId?: string,
  ) => Promise<void>;
}

type ApiCourse = Record<string, any>;
type ApiLesson = Record<string, any>;

function mapExamType(code?: string): CourseExamType {
  const normalized = (code || "").toLowerCase();
  if (
    ["ielts", "toeic", "vstep", "communication", "grammar"].includes(normalized)
  ) {
    return normalized as CourseExamType;
  }
  return "all";
}

function mapLesson(api: ApiLesson): Lesson {
  const blocks = (api.blocks || []).sort(
    (a: any, b: any) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0),
  );
  const videoBlock = blocks.find(
    (block: any) => block.blockType === "VIDEO" && block.contentJson?.videoUrl,
  );
  const text = blocks
    .map(
      (block: any) => block.contentJson?.html || block.contentJson?.text || "",
    )
    .filter(Boolean)
    .join("\n\n");
  const type: LessonType = videoBlock
    ? "video"
    : api.lessonType === "QUIZ"
      ? "quiz"
      : "reading";
  return {
    id: api.id,
    title: api.title || "Bài học",
    titleEn: api.titleEn,
    type,
    durationMinutes: Number(api.estimatedMinutes || 15),
    isPreview: Boolean(api.isPreview),
    videoUrl: videoBlock?.contentJson?.videoUrl,
    content: text,
    blocks,
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
      set({
        error: error?.message || "Không tải được danh sách khóa học",
        isLoading: false,
      });
    }
  },

  loadCourseBySlug: async (slug) => {
    set({ isLoading: true, error: null });
    try {
      const course = mapApiCourse(await courseService.bySlug(slug));
      set((state) => ({
        courses: [
          course,
          ...state.courses.filter((item) => item.id !== course.id),
        ],
        isLoading: false,
      }));
      return course;
    } catch (error: any) {
      set({
        error: error?.message || "Không tải được khóa học",
        isLoading: false,
      });
      return undefined;
    }
  },

  loadMyEnrollments: async () => {
    try {
      const res = await courseService.myEnrollments();
      const enrolledIds = res.data
        .map((item: any) => item.courseId)
        .filter(Boolean);
      const enrolledCourses = res.data
        .map((item: any) => item.course)
        .filter(Boolean)
        .map(mapApiCourse);
      set((state) => ({
        enrolledCourseIds: enrolledIds,
        courses: [
          ...state.courses,
          ...enrolledCourses.filter(
            (course: Course) =>
              !state.courses.some((item) => item.id === course.id),
          ),
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
                lessons: section.lessons.map((item) =>
                  item.id === lesson.id ? lesson : item,
                ),
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

function mapApiCourse(item: any): Course {
  if (!item) return {} as Course;
  return {
    id: item.id || "",
    slug: item.slug || item.id || "",
    title: item.title || item.name || "Khóa học",
    titleEn: item.titleEn || item.nameEn,
    shortDescription: item.shortDescription || item.description || "",
    shortDescriptionEn: item.shortDescriptionEn || item.descriptionEn,
    description: item.description || "",
    descriptionEn: item.descriptionEn,
    thumbnailUrl:
      item.thumbnailUrl ||
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    trailerVideoUrl: item.trailerVideoUrl,
    examType: (item.examType || "all") as CourseExamType,
    levelFrom: (item.levelFrom || "all") as CourseCefrLevel,
    levelTo: (item.levelTo || "all") as CourseCefrLevel,
    badge: item.badge,
    isPopular: Boolean(item.isPopular),
    isFeatured: Boolean(item.isFeatured),
    price: Number(item.price || 0),
    originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
    discountPercent: item.discountPercent
      ? Number(item.discountPercent)
      : undefined,
    isFree: Boolean(item.isFree || item.price === 0),
    hasMentor: Boolean(item.hasMentor),
    rating: Number(item.rating || 5.0),
    reviewCount: Number(item.reviewCount || 0),
    studentCount: Number(item.studentCount || 0),
    totalDurationHours: Number(item.totalDurationHours || 10),
    totalLessons: Number(item.totalLessons || item.lessonsCount || 1),
    updatedAt: item.updatedAt || new Date().toISOString(),
    language: item.language || "vi",
    instructor: item.instructor || {
      id: "inst-1",
      name: "Đội ngũ Giảng viên LingoArena",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      role: "Lead Instructor",
      credentials: "IELTS 8.5 / TESOL Certified",
      bio: "Giảng viên chuyên môn tại LingoArena.",
      rating: 4.9,
      totalStudents: 1200,
      coursesCount: 5,
    },
    learningOutcomes: item.learningOutcomes || [],
    requirements: item.requirements || [],
    targetAudience: item.targetAudience || [],
    sections: item.sections || [],
    reviews: item.reviews || [],
  };
}
