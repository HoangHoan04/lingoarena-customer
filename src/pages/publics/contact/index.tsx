import ContactForm from "@/components/layout/ContactForm";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";

export default function ContactScreen() {
  return (
    <div className="min-h-screen pb-8 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="shadow-xl mb-8">
            <div className="rounded-2xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6696584619626!2d106.6796833753091!3d10.75992235949736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1b7c3ed289%3A0xa06651894598e488!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTw6BpIEfDsm4!5e0!3m2!1svi!2s!4v1769073394930!5m2!1svi!2s"
                width="100%"
                height="600px"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
              ></iframe>
            </div>
          </div>
          <ContactForm />
        </div>

        <Divider />
        <div className="text-center">
          <h3 className="text-4xl font-bold mb-3">
            Sẵn sàng cho cuộc phiêu lưu tiếp theo của bạn?
          </h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Nhận ưu đãi độc quyền và khuyến mãi đặc biệt khi đặt tour ngay hôm
            nay!
          </p>
          <Button
            label="Khám Phá Tour Ngay"
            icon="pi pi-compass"
            className="px-6 py-3"
            raised
            style={{
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          />
        </div>
      </div>
    </div>
  );
}
