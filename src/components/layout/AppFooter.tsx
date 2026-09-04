"use client";

import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  YoutubeIcon,
} from "@/assets/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import { supportService } from "@/services/support.service";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import React, { useState } from "react";
import Logo from "../common/Logo";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    icon: <Image src={FacebookIcon} alt="Facebook" width={30} height={30} />,
    href: "https://facebook.com",
  },
  {
    label: "Instagram",
    icon: <Image src={InstagramIcon} alt="Instagram" width={30} height={30} />,
    href: "https://instagram.com",
  },
  {
    label: "YouTube",
    icon: <Image src={YoutubeIcon} alt="YouTube" width={30} height={30} />,
    href: "https://youtube.com",
  },
  {
    label: "TikTok",
    icon: <Image src={TiktokIcon} alt="TikTok" width={30} height={30} />,
    href: "https://tiktok.com",
  },
];

function SocialBtn({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="w-12 h-12 flex items-center justify-center no-underline bg-transparent border-none shadow-none shrink-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-none"
    >
      {icon}
    </a>
  );
}

function FooterLink({ href, label }: { href: string; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <Link
        href={href as any}
        className={`flex items-center gap-2 text-xs sm:text-[13.5px] text-slate-600 dark:text-slate-400 no-underline transition-all duration-200 ${
          hovered ? "text-brand dark:text-[#7b9bee] gap-3 font-medium" : ""
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`text-brand/50 text-base leading-none transition-transform duration-200 ${
            hovered ? "translate-x-0.5 text-brand dark:text-[#7b9bee]" : ""
          }`}
        >
          ›
        </span>
        {label}
      </Link>
    </li>
  );
}

function NewsletterForm() {
  const t = useTranslations("footer");
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    setSubmitting(true);
    try {
      await supportService.contact({
        name: trimmed.split("@")[0] || "Newsletter",
        email: trimmed,
        subject: "Newsletter",
        message: "Đăng ký nhận bản tin LingoArena",
      });
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setSubmitted(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-stretch w-full max-w-130 gap-3 sm:gap-0"
    >
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={t("newsletterPlaceholder")}
        required
        disabled={submitting}
        aria-label={t("newsletterPlaceholder")}
        className={`w-full h-12 sm:h-13 px-4 sm:px-5 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl sm:rounded-r-none outline-hidden transition-all sm:border-r-0 ${
          focused ? "border-brand ring-2 ring-brand/20" : ""
        }`}
      />
      <Button
        type="submit"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        disabled={submitting}
        className={`h-12 sm:h-13 px-6 sm:px-8 bg-brand hover:bg-[#1e2f5e] border-none rounded-xl sm:rounded-l-none text-white text-xs font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-md shadow-brand/20 ${
          hovered ? "shadow-lg shadow-brand/30 scale-[1.02]" : ""
        }`}
      >
        {submitted
          ? t("newsletterSuccess")
          : submitting
            ? "..."
            : t("newsletterBtn")}
      </Button>
    </form>
  );
}

function NewsletterSection() {
  const t = useTranslations("footer");

  return (
    <div className="border-y border-slate-200 dark:border-slate-800 py-10 px-6 sm:px-12 bg-slate-100/70 dark:bg-slate-900/60">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-4 flex-[1_1_300px]">
          <div className="w-12 h-12 rounded-2xl bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 flex items-center justify-center text-brand dark:text-[#7b9bee] shrink-0 shadow-xs">
            <Mail size={22} strokeWidth={1.75} />
          </div>
          <div>
            <div className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-1">
              {t("newsletterTitle")}
            </div>
            <p className="text-xs sm:text-[13.5px] text-slate-600 dark:text-slate-400 m-0 leading-relaxed">
              {t("newsletterDesc")}
            </p>
          </div>
        </div>
        <NewsletterForm />
      </div>
    </div>
  );
}

export default function AppFooter() {
  const t = useTranslations("footer");
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { label: t("about"), href: "/about" },
    { label: t("practice"), href: "/practice" },
    { label: "Giao tiếp với AI", href: "/ai-conversation" },
    { label: "Luyện đọc hiểu", href: "/reading" },
    { label: t("courses"), href: "/courses" },
    { label: t("vocabulary"), href: "/vocabulary" },
    { label: t("arena"), href: "/arena" },
    { label: t("pricing"), href: "/pricing" },
    { label: t("faq"), href: "/#faq" },
  ];

  const contactInfo = [
    {
      icon: <MapPin className="size-4" />,
      label: t("addressLabel"),
      value: t("addressVal"),
    },
    {
      icon: <Phone className="size-4" />,
      label: t("phoneLabel"),
      value: t("phoneVal"),
    },
    {
      icon: <Mail className="size-4" />,
      label: t("emailLabel"),
      value: "support@lingoarena.com",
    },
    {
      icon: <Clock className="size-4" />,
      label: t("hoursLabel"),
      value: t("hoursVal"),
    },
  ];

  return (
    <footer className="relative overflow-hidden flex flex-col bg-slate-50/50 dark:bg-slate-950/70 font-inherit border-t border-slate-200/80 dark:border-slate-800">
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(43,65,126,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 85% 75%, rgba(43,65,126,0.08) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-1 w-full h-0.5 shrink-0 bg-linear-to-r from-transparent via-brand/40 to-transparent" />
      <div className="relative z-1 flex items-center gap-4 px-6 sm:px-12 pt-7 pb-5"></div>

      <div className="relative z-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr_2fr] gap-10 lg:gap-12 max-w-7xl mx-auto px-6 sm:px-12 pb-12 w-full box-border">
        <div className="space-y-4">
          <div className="mb-2">
            <Logo />
          </div>

          <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed m-0 max-w-md">
            {t("description")}
          </p>

          <div className="flex gap-2.5 pt-1">
            {SOCIAL_LINKS.map((s) => (
              <SocialBtn
                key={s.label}
                href={s.href}
                label={s.label}
                icon={s.icon}
              />
            ))}
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-brand/10 dark:bg-brand/20 border border-brand/20 dark:border-brand/30 rounded-full max-w-fit shadow-2xs mt-2">
            <span className="text-[11px] text-brand dark:text-[#7b9bee] whitespace-nowrap font-bold">
              TOEIC · IELTS · VSTEP · Aptis ESOL
            </span>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-[2.5px] uppercase text-brand dark:text-[#7b9bee] m-0 mb-5 flex items-center gap-2">
            {t("coursesTitle")}
          </h3>
          <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
            {navLinks.map((item) => (
              <FooterLink
                key={item.label}
                href={item.href}
                label={item.label}
              />
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold tracking-[2.5px] uppercase text-brand dark:text-[#7b9bee] m-0 mb-5 flex items-center gap-2">
            {t("contactTitle")}
          </h3>
          <div className="flex flex-col gap-3.5">
            {contactInfo.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-brand dark:text-[#7b9bee] shrink-0 mt-0.5">
                  {c.icon}
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[1.5px] mb-0.5">
                    {c.label}
                  </div>
                  <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line font-medium">
                    {c.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <NewsletterSection />

      <div className="relative z-1 max-w-7xl mx-auto w-full box-border px-6 sm:px-12 py-5 flex flex-wrap items-center justify-between gap-3 text-xs max-sm:flex-col max-sm:text-center">
        <p className="text-slate-500 m-0">
          Copyright © {currentYear}{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            LingoArena Platform
          </span>
          . All rights reserved.
        </p>

        <div className="flex flex-wrap gap-6 text-slate-500">
          {[
            { label: t("terms"), href: "/terms" },
            { label: t("privacy"), href: "/privacy" },
            { label: t("operating"), href: "/operating" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className="text-slate-600 dark:text-slate-400 no-underline transition-colors hover:text-brand dark:hover:text-[#7b9bee] relative"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="relative z-1 w-full h-px shrink-0 bg-linear-to-r from-transparent via-brand/20 to-transparent" />
    </footer>
  );
}
