import ContactScreen from "@/pages/publics/contact";
import FaqScreen from "@/pages/publics/contact/faq";
import HomeSection from "@/pages/publics/home";
import { PUBLIC_ROUTES } from "./routes";
import BlogScreen from "@/pages/publics/blog";
import BlogDetailScreen from "@/pages/publics/blog/blog-detail";
import CourseScreen from "@/pages/publics/course";
import CourseDetailScreen from "@/pages/publics/course/detail";
import LearningPathScreen from "@/pages/publics/learning-path";

export const PUBLIC_SCREENS = {
  [PUBLIC_ROUTES.HOME]: <HomeSection />,
  [PUBLIC_ROUTES.CONTACT]: <ContactScreen />,
  [PUBLIC_ROUTES.FAQ]: <FaqScreen />,
  [PUBLIC_ROUTES.COURSE]: <CourseScreen />,
  [PUBLIC_ROUTES.COURSE_DETAIL]: <CourseDetailScreen />,
  [PUBLIC_ROUTES.LEARNING_PATH]: <LearningPathScreen />,
  [PUBLIC_ROUTES.BLOGS]: <BlogScreen />,
  [PUBLIC_ROUTES.BLOG_DETAIL]: <BlogDetailScreen />,
};
