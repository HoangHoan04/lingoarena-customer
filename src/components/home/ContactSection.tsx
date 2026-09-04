"use client";

import { Button } from "@/components/ui/button";
import { supportService } from "@/services/support.service";
import { Mail, MapPin, MessageSquare, PhoneCall, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function ContactSection() {
  const t = useTranslations("home.contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Liên hệ LingoArena");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Vui lòng điền họ tên, email, tiêu đề và nội dung");
      return;
    }
    setIsSubmitting(true);
    try {
      await supportService.contact({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        subject: subject.trim(),
        message: message.trim(),
      });
      toast.success("Đã gửi liên hệ. Chúng tôi sẽ phản hồi sớm.");
      setName("");
      setEmail("");
      setPhone("");
      setSubject("Liên hệ LingoArena");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message || "Không gửi được liên hệ");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-slate-50/60 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 text-brand dark:text-[#7b9bee] text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="size-3.5" />
              {t("badge")}
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t("title")}
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              {t("subtitle")}
            </p>

            <div className="space-y-3.5 pt-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-xl bg-brand/10 text-brand dark:text-[#7b9bee] flex items-center justify-center shrink-0">
                  <Mail className="size-4" />
                </div>
                <span>
                  Email: <strong>support@lingoarena.com</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="size-4" />
                </div>
                <span>
                  {t("hotline")}: <strong>1900 8899 (8:00 - 22:00)</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <MapPin className="size-4" />
                </div>
                <span>Hanoi & Ho Chi Minh City, Vietnam</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-4"
            >
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t("formSubmit")}
              </h3>
              <p className="text-xs text-slate-500">{t("subtitle")}</p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Họ tên *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t("formEmail")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {t("formMessage")} *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="E.g. Target TOEIC 750 in 3 months..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-sm focus:outline-hidden focus:ring-2 focus:ring-brand"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-6 rounded-xl font-bold bg-brand hover:bg-[#1e2f5e] text-white shadow-lg shadow-brand/20 cursor-pointer"
                >
                  <Send className="size-4 mr-1.5" />
                  {isSubmitting ? "..." : t("formSubmit")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
