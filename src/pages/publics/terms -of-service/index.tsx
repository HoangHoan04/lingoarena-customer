import { Accordion, AccordionTab } from "primereact/accordion";
import { ScrollTop } from "primereact/scrolltop";

export default function TermsOfServiceScreen() {
  const lastUpdated = "01/04/2026";

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="text-center mb-12">
        <i className="pi pi-file-edit text-4xl mb-4 opacity-80"></i>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Điều khoản Dịch vụ
        </h1>
        <p className="text-sm italic opacity-60">
          Cập nhật lần cuối: {lastUpdated}
        </p>
        <div className="w-24 h-1 mx-auto mt-4 rounded-full bg-blue-500 opacity-50"></div>
      </div>

      <div className="space-y-8">
        {/* Intro */}
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-info-circle text-blue-500"></i> 1. Chấp nhận
            điều khoản
          </h2>
          <p className="leading-relaxed opacity-80">
            Chào mừng bạn đến với <strong>LingoArena</strong>. Bằng việc đăng ký
            tài khoản và sử dụng các dịch vụ luyện thi TOEIC, IELTS, Aptis,
            VSTEP trên nền tảng của chúng tôi, bạn đồng ý tuân thủ các quy định
            dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng
            ngừng sử dụng dịch vụ.
          </p>
        </section>

        {/* Main Content with Accordion */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <i className="pi pi-list text-blue-500"></i> Chi tiết quy định
          </h2>
          <Accordion activeIndex={0}>
            <AccordionTab header="2. Quyền sở hữu trí tuệ">
              <p className="m-0 opacity-80 leading-relaxed">
                Tất cả nội dung bài thi, tài liệu hướng dẫn, giao diện và mã
                nguồn trên LingoArena đều thuộc sở hữu của chúng tôi hoặc các
                đối tác cấp phép. Bạn không được phép sao chép, phân phối hoặc
                sử dụng cho mục đích thương mại mà không có sự đồng ý bằng văn
                bản.
              </p>
            </AccordionTab>
            <AccordionTab header="3. Tài khoản và Bảo mật">
              <ul className="list-disc pl-5 space-y-2 opacity-80">
                <li>
                  Bạn chịu trách nhiệm bảo mật mật khẩu và thông tin đăng nhập.
                </li>
                <li>Mỗi tài khoản chỉ dành cho một người dùng duy nhất.</li>
                <li>
                  Hệ thống có quyền tạm khóa tài khoản nếu phát hiện hành vi
                  gian lận trong lúc thi thử hoặc chia sẻ tài khoản cho nhiều
                  người.
                </li>
              </ul>
            </AccordionTab>
            <AccordionTab header="4. Chính sách thanh toán & Hoàn tiền">
              <p className="m-0 opacity-80">
                Đối với các gói luyện thi cao cấp (Premium), phí sẽ được thanh
                toán trước. Do tính chất sản phẩm kỹ thuật số có thể truy cập
                ngay lập tức, chúng tôi chỉ xem xét hoàn tiền trong vòng 24h nếu
                có lỗi kỹ thuật từ phía hệ thống mà không thể khắc phục.
              </p>
            </AccordionTab>
            <AccordionTab header="5. Giới hạn trách nhiệm">
              <p className="m-0 opacity-80">
                LingoArena cung cấp môi trường luyện tập dựa trên cấu trúc đề
                thi thực tế. Tuy nhiên, kết quả thi thử trên hệ thống không đảm
                bảo 100% kết quả tại các kỳ thi chính thức của IIG, British
                Council hay IDP.
              </p>
            </AccordionTab>
          </Accordion>
        </section>

        {/* Contact/Support Section */}
        <section className="p-6 border border-dashed rounded-xl border-slate-400/30">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <i className="pi pi-envelope text-blue-500"></i> Bạn có thắc mắc?
          </h2>
          <p className="text-sm opacity-80">
            Nếu có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ
            với đội ngũ hỗ trợ của chúng tôi tại:
            <span className="ml-1 text-blue-500 underline cursor-pointer">
              support@lingoarena.com
            </span>
          </p>
        </section>
      </div>

      {/* Helper components */}
      <ScrollTop />
    </div>
  );
}
