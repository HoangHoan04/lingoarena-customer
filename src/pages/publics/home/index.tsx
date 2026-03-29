import BannerSection from "./banner-section";
import ContactSection from "./contact-section";

export default function HomeSection() {
  return (
    <div className="min-h-screen ">
      <section className="">
        <BannerSection />
      </section>
      <section className=" border-t ">
        <ContactSection />
      </section>
    </div>
  );
}
