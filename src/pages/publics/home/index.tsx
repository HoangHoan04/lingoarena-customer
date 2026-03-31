import FancyDivider from "@/components/ui/Divider";
import AboutSection from "./about-section";
import BannerSection from "./banner-section";
import CarouselSection from "./carousel-section";
import ContactSection from "./contact-section";

export default function HomeSection() {
  return (
    <div className="min-h-screen">
      <section className="">
        <BannerSection />
      </section>
      <FancyDivider children={<i className="pi pi-star"></i>} />
      <section className="my-5">
        <CarouselSection />
      </section>
      <FancyDivider children={<i className="pi pi-star"></i>} />
      <section className="my-5">
        <AboutSection />
      </section>
      <FancyDivider children={<i className="pi pi-star"></i>} />
      <section className="my-5">
        <ContactSection />
      </section>
    </div>
  );
}
