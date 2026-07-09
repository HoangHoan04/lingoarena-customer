export default function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="grid grid-cols-1 md:grid-cols-2 gap-8"
    >
      <h2 id="contact-heading" className="sr-only">
        Liên hệ với chúng tôi
      </h2>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Liên hệ với chúng tôi</h3>
        <p className="text-slate-600 dark:text-slate-400">
          Nếu bạn có bất kỳ câu hỏi hoặc phản hồi nào, vui lòng liên hệ với
          chúng tôi qua email hoặc mạng xã hội. Chúng tôi luôn sẵn sàng hỗ trợ
          bạn!
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="text-2xl font-bold">Thông tin liên hệ</h3>
        <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
          <li>
            Email:{" "}
            <a
              href="mailto:info@lingoarena.com"
              className="text-blue-500 hover:underline"
            >
              info@lingoarena.com
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
