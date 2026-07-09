export default function AboutSection() {
  return (
    <section
      aria-labelledby="about-heading"
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <h2 id="about-heading" className="sr-only">
        Giới thiệu về LingoArena
      </h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Về LingoArena</h3>
        <p className="text-slate-600 dark:text-slate-400">
          LingoArena là nền tảng học tiếng Anh trực tuyến, nơi bạn có thể học từ
          vựng thông minh, tham gia đấu trường 1v1 và leo lên bảng xếp hạng toàn
          cầu. Bắt đầu miễn phí ngay hôm nay!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Tính năng nổi bật</h3>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
          <li>Học từ vựng thông minh theo ngữ cảnh và flashcard.</li>
          <li>Tham gia đấu trường 1v1 với người chơi toàn thế giới.</li>
          <li>
            Leo lên bảng xếp hạng toàn cầu và hoàn thành nhiệm vụ hàng ngày.
          </li>
        </ul>
      </div>
    </section>
  );
}
