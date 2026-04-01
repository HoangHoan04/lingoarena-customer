import { Divider } from "primereact/divider";
import { Fieldset } from "primereact/fieldset";
import { ScrollTop } from "primereact/scrolltop";

export default function PrivacyPolicyScreen() {
  const lastUpdated = "01/04/2026";

  return (
    <div className=" max-w-7xl mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <i className="pi pi-shield text-5xl text-green-500"></i>
          <h1 className="text-3xl md:text-4xl font-bold">Chính sách Bảo mật</h1>
        </div>
        <p className="opacity-70">
          Tại LingoArena, quyền riêng tư của người dùng là ưu tiên hàng đầu.
          Chúng tôi cam kết bảo vệ dữ liệu cá nhân và quá trình học tập của bạn.
        </p>
        <p className="text-xs mt-2 opacity-50 uppercase tracking-widest">
          Cập nhật lần cuối: {lastUpdated}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-10">
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                1
              </span>
              Thông tin chúng tôi thu thập
            </h2>
            <div className="space-y-4 opacity-85 leading-relaxed">
              <p>
                Chúng tôi thu thập thông tin để cung cấp dịch vụ tốt hơn cho tất
                cả người dùng, bao gồm:
              </p>
              <ul className="list-none space-y-3 ml-2">
                <li className="flex gap-3">
                  <i className="pi pi-check-circle text-green-500 mt-1"></i>
                  <span>
                    <strong>Thông tin cá nhân:</strong> Tên, email, ảnh đại diện
                    khi bạn đăng ký qua Google/Facebook.
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="pi pi-check-circle text-green-500 mt-1"></i>
                  <span>
                    <strong>Dữ liệu học tập:</strong> Lịch sử làm bài, điểm số,
                    các từ vựng bạn đã lưu vào Flashcards.
                  </span>
                </li>
                <li className="flex gap-3">
                  <i className="pi pi-check-circle text-green-500 mt-1"></i>
                  <span>
                    <strong>Dữ liệu âm thanh:</strong> Các bản ghi âm trong phần
                    luyện Speaking (chỉ dùng để chấm điểm và cho phép bạn nghe
                    lại).
                  </span>
                </li>
              </ul>
            </div>
          </section>

          <Divider />

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                2
              </span>
              Cách chúng tôi sử dụng thông tin
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 border border-slate-400/20 rounded-lg">
                <i className="pi pi-chart-line text-blue-500 mb-2"></i>
                <h3 className="font-semibold mb-1">Cá nhân hóa</h3>
                <p className="text-sm opacity-70">
                  Xây dựng lộ trình học (Roadmap) phù hợp với trình độ của bạn.
                </p>
              </div>
              <div className="p-4 border border-slate-400/20 rounded-lg">
                <i className="pi pi-bolt text-yellow-500 mb-2"></i>
                <h3 className="font-semibold mb-1">Cải thiện AI</h3>
                <p className="text-sm opacity-70">
                  Sử dụng dữ liệu ẩn danh để huấn luyện mô hình chấm điểm
                  Writing/Speaking chính xác hơn.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 text-sm">
                3
              </span>
              Bảo mật dữ liệu
            </h2>
            <p className="opacity-85 leading-relaxed">
              Chúng tôi sử dụng các biện pháp bảo mật chuẩn công nghiệp như mã
              hóa SSL, lưu trữ token an toàn và giới hạn quyền truy cập nội bộ
              để bảo vệ thông tin của bạn khỏi sự truy cập trái phép.
            </p>
          </section>
        </div>

        {/* Sidebar / Quick Summary */}
        <div className="space-y-6">
          <Fieldset legend="Tóm tắt nhanh" className="text-sm">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <i className="pi pi-eye-slash text-red-500"></i>
                <p>
                  Chúng tôi <strong>KHÔNG</strong> bán dữ liệu cá nhân của bạn
                  cho bên thứ ba.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <i className="pi pi-lock text-blue-500"></i>
                <p>
                  Bạn có quyền yêu cầu xóa toàn bộ dữ liệu tài khoản bất cứ lúc
                  nào.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <i className="pi pi-bell text-orange-500"></i>
                <p>
                  Chúng tôi sẽ thông báo qua email nếu có thay đổi quan trọng
                  trong chính sách.
                </p>
              </div>
            </div>
          </Fieldset>

          <div className="p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <i className="pi pi-question-circle"></i> Trợ giúp
            </h3>
            <p className="text-sm opacity-80 mb-4">
              Bạn muốn hiểu rõ hơn về cách dữ liệu Speaking của mình được xử lý?
            </p>
            <button className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium">
              Liên hệ bộ phận Data
            </button>
          </div>
        </div>
      </div>

      <ScrollTop />
    </div>
  );
}
