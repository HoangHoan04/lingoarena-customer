import BackToTop from "@/components/layout/BackToTop";
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

      <BackToTop />
    </div>
  );
}
