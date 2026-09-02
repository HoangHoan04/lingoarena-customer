"use client";

import { useEffect, useState } from "react";
import { AiChatFloatButton, AiChatWidget } from "../chat";
import BackToTop from "../common/BackToTop";
import FloatSocialMessenger from "../common/FloatSocialMessenger";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full min-h-screen relative flex flex-col bg-background text-foreground transition-colors duration-300"
      style={{ margin: 0, padding: 0, overflowX: "hidden" }}
    >
      <AppHeader isScrolled={isScrolled} />
      <main className="flex-1 w-full pt-24 sm:pt-28" style={{ margin: 0 }}>
        {children}
      </main>
      <AppFooter />
      <FloatSocialMessenger />
      <BackToTop />

      {/* LingoBot AI Chatbot Suite (Float Button + Popup / Fullscreen Workspace) */}
      <AiChatFloatButton />
      <AiChatWidget />
    </div>
  );
}
