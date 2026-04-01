import ContactScreen from "@/pages/publics/contact";
import FaqScreen from "@/pages/publics/contact/faq";
import HomeSection from "@/pages/publics/home";
import { PUBLIC_ROUTES } from "./routes";
import BlogScreen from "@/pages/publics/blog";
import BlogDetailScreen from "@/pages/publics/blog/blog-detail";
import CourseScreen from "@/pages/publics/course";
import CourseDetailScreen from "@/pages/publics/course/detail";
import RoadMapScreen from "@/pages/publics/roadmap";
import PracticeScreen from "@/pages/publics/practice";
import PrivacyPolicyScreen from "@/pages/publics/privacy-policy";
import TermsOfServiceScreen from "@/pages/publics/terms -of-service";
import TranslationScreen from "@/pages/publics/translation";

export const PUBLIC_SCREENS = {
  [PUBLIC_ROUTES.HOME]: <HomeSection />,
  [PUBLIC_ROUTES.CONTACT]: <ContactScreen />,
  [PUBLIC_ROUTES.FAQ]: <FaqScreen />,
  [PUBLIC_ROUTES.COURSE]: <CourseScreen />,
  [PUBLIC_ROUTES.COURSE_DETAIL]: <CourseDetailScreen />,
  [PUBLIC_ROUTES.ROAD_MAP]: <RoadMapScreen />,
  [PUBLIC_ROUTES.BLOGS]: <BlogScreen />,
  [PUBLIC_ROUTES.BLOG_DETAIL]: <BlogDetailScreen />,
  [PUBLIC_ROUTES.PRACTICE]: <PracticeScreen />,
  [PUBLIC_ROUTES.PRIVACY_POLICY]: <PrivacyPolicyScreen />,
  [PUBLIC_ROUTES.TERMS_OF_SERVICE]: <TermsOfServiceScreen />,
  [PUBLIC_ROUTES.TRANSLATION]: <TranslationScreen />,
};
