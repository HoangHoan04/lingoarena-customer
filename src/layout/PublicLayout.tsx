import BackToTop from "@/components/layout/BackToTop";
import SocialFloatButtons from "@/components/layout/SocialButton/SocialFloatButtons";
import ChatBotButton from "@/components/layout/ChatBot/ChatBotButton";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="w-full min-h-screen relative"
      style={{ margin: 0, padding: 0, overflow: "hidden" }}
    >
      <AppHeader />

      <main className="pt-32" style={{ margin: 0, padding: 0 }}>
        <div style={{ paddingTop: "8rem" }}>{children}</div>
      </main>
      <AppFooter />

      {/* ChatBot — góc trái */}
      <div className="fixed left-6 bottom-6 z-50">
        <ChatBotButton />
      </div>

      {/* Social + BackToTop — góc phải */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col-reverse items-center gap-4">
        <BackToTop />
        <SocialFloatButtons />
      </div>
    </div>
  );
}
