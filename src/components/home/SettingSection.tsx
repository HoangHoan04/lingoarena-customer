export default function SettingSection() {
  return (
    <section
      aria-labelledby="setting-heading"
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <h2 id="setting-heading" className="sr-only">
        Cài đặt
      </h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Cài đặt tài khoản</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Quản lý thông tin cá nhân, mật khẩu và các tùy chọn bảo mật của bạn.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Cài đặt thông báo</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Tùy chỉnh cách bạn nhận thông báo từ LingoArena, bao gồm email và
          thông báo trong ứng dụng.
        </p>
      </div>
    </section>
  );
}
