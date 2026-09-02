"use client";

import VocabSubnav from "@/components/vocabulary/VocabSubnav";
import { usePathname } from "@/i18n/routing";

export default function VocabularyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "";
  const isStudy = pathname.includes("/study");

  return (
    <div className="min-h-screen pb-20">
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8 ${
          isStudy ? "max-w-7xl" : "max-w-6xl"
        }`}
      >
        {!isStudy && <VocabSubnav />}
        {children}
      </div>
    </div>
  );
}
