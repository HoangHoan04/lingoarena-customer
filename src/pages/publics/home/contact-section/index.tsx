import { earth } from "@/assets/animations";
import Title from "@/components/ui/Tilte";
import { useRouter } from "@/routes/hooks";
import Lottie from "lottie-react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

export default function ContactSection() {
  const router = useRouter();
  const handleBookingClick = () => {
    router.push("/contact");
  };

  const features = [
    {
      icon: "pi-map-marker",
      title: "Lịch trình phong phú, đa dạng",
      description:
        "Chúng tôi cung cấp các tour du lịch đa dạng, từ khám phá văn hóa đến phiêu lưu mạo hiểm, phù hợp với mọi sở thích",
      color: "#6366f1",
    },
    {
      icon: "pi-dollar",
      title: "Giá cả tốt nhất",
      description:
        "Giá cả cạnh tranh với các ưu đãi độc quyền và giảm giá đặc biệt cho những người đặt sớm",
      color: "#8b5cf6",
    },
    {
      icon: "pi-headphones",
      title: "Hỗ trợ 24/7",
      description:
        "Đội ngũ tận tâm của chúng tôi luôn sẵn sàng giúp đỡ bạn với kế hoạch và thắc mắc du lịch của bạn",
      color: "#ec4899",
    },
    {
      icon: "pi-headphones",
      title: "Đa dạng dịch vụ hỗ trợ",
      description:
        "Chúng tôi cung cấp hỗ trợ toàn diện bao gồm tư vấn du lịch, hỗ trợ visa, bảo hiểm du lịch và dịch vụ chăm sóc khách hàng tận tâm.",
      color: "#f59e0b",
    },
  ];

  return (
    <div className="min-h-screen py-8 px-2">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <Title>Liên hệ với chúng tôi</Title>
          <p className="text-xl text-slate-600  mx-auto font-light leading-relaxed">
            Hãy để chúng tôi giúp bạn biến ước mơ du lịch của bạn thành hiện
            thực.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="flex justify-center items-center p-6">
            <div className="relative w-96 h-96">
              <Lottie
                animationData={earth}
                loop={true}
                autoplay={true}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  height: "auto",
                }}
                rendererSettings={{
                  preserveAspectRatio: "xMidYMid meet",
                }}
              />
            </div>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: `${feature.color}20`,
                      borderRadius: "12px",
                      flexShrink: 0,
                    }}
                  >
                    <i
                      className={`pi ${feature.icon}`}
                      style={{ fontSize: "1.5rem", color: feature.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <Card
          className="text-center shadow-xl"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "1.5rem",
          }}
        >
          <h3 className="text-4xl font-bold mb-3" style={{ color: "white" }}>
            Sẵn sàng cho cuộc phiêu lưu tiếp theo của bạn?
          </h3>
          <p
            className="text-lg mb-6 max-w-2xl mx-auto"
            style={{ color: "#e0e7ff" }}
          >
            Liên hệ với chúng tôi ngay hôm nay để bắt đầu lên kế hoạch cho
            chuyến đi trong mơ của bạn!
          </p>
          <Button
            label="Đặt chuyến đi của bạn ngay bây giờ"
            icon="pi pi-calendar"
            onClick={handleBookingClick}
            className="px-6 py-3"
            raised
            style={{
              backgroundColor: "white",
              color: "#6366f1",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          />
        </Card>
      </div>
    </div>
  );
}
