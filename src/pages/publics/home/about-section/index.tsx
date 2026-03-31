import { computer, result, teamwork } from "@/assets/animations";
import Lottie from "lottie-react";

export default function AboutSection() {
  const features = [
    {
      title: 'Hệ thống đề thi "Cực phẩm"',
      description:
        "Kho đề đồ sộ được chọn lọc khắt khe từ ETS, YBM, Hackers... Đảm bảo tính cập nhật, độ khó sát 99% so với đề thi thật giúp bạn không bỡ ngỡ khi vào phòng thi.",
      icon: computer,
    },
    {
      title: "Phân tích đáp án chuyên sâu",
      description:
        "Không chỉ đưa ra đáp án Đúng/Sai, đội ngũ chuyên gia tại LingoArena còn cung cấp lời giải chi tiết, mẹo làm bài nhanh và các bẫy từ vựng thường gặp.",
      icon: teamwork,
    },
    {
      title: "Đánh giá năng lực chuẩn AI",
      description:
        "Sử dụng thuật toán Score Conversion độc quyền, LingoArena giúp bạn dự đoán số điểm thực tế và chỉ ra những lỗ hổng kiến thức cần bù đắp ngay lập tức.",
      icon: result,
    },
  ];

  return (
    <section className="p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 px-2">
          <h2 className="text-4xl font-bold text-[#005691] mb-4">
            Nền tảng Test Online của{" "}
            <span className="text-orange-500">LingoArena</span> có gì đặc biệt?
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Trải nghiệm công nghệ luyện thi thông minh, giúp bạn bứt phá band
            điểm trong thời gian ngắn nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group p-6 rounded-2xl hover:shadow-xl transition-all duration-300"
            >
              <div className="mb-6 h-48 w-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Lottie
                  animationData={item.icon}
                  loop={true}
                  className="h-full w-auto"
                />
              </div>

              <h3 className="text-xl font-bold text-[#005691] mb-4 group-hover:text-orange-500 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-[15px] max-w-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
