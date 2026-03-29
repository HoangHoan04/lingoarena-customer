import BackToTop from "@/components/layout/BackToTop";
import { type ReactNode } from "react";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export default function RequireAuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div>
      <AppHeader />
      <div>
        <div>{children}</div>
      </div>

      <AppFooter />
      <BackToTop />
    </div>
  );
}
