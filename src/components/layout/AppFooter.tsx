"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@/i18n/routing";
import {
  Clock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";
import Logo from "../common/Logo";

function FacebookSvg({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramSvg({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function YoutubeSvg({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function TiktokSvg({ className = "w-4.5 h-4.5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Facebook", icon: <FacebookSvg className="w-4.5 h-4.5" />, href: "https://facebook.com" },
  { label: "Instagram", icon: <InstagramSvg className="w-4.5 h-4.5" />, href: "https://instagram.com" },
  { label: "YouTube", icon: <YoutubeSvg className="w-4.5 h-4.5" />, href: "https://youtube.com" },
  { label: "TikTok", icon: <TiktokSvg className="w-4.5 h-4.5" />, href: "https://tiktok.com" },
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
      className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 no-underline transition-all duration-300 shrink-0 hover:bg-[#2b417e] hover:text-white hover:border-transparent hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#2b417e]/25 bg-white dark:bg-slate-900"
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
          hovered ? "text-[#2b417e] dark:text-[#7b9bee] gap-3 font-medium" : ""
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span
          className={`text-[#2b417e]/50 text-base leading-none transition-transform duration-200 ${
            hovered ? "translate-x-0.5 text-[#2b417e] dark:text-[#7b9bee]" : ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setEmail("");
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
        aria-label={t("newsletterPlaceholder")}
        className={`w-full h-12 sm:h-13 px-4 sm:px-5 text-xs sm:text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl sm:rounded-r-none outline-hidden transition-all sm:border-r-0 ${
          focused ? "border-[#2b417e] ring-2 ring-[#2b417e]/20" : ""
        }`}
      />
      <Button
        type="submit"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`h-12 sm:h-13 px-6 sm:px-8 bg-[#2b417e] hover:bg-[#1e2f5e] border-none rounded-xl sm:rounded-l-none text-white text-xs font-bold tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-md shadow-[#2b417e]/20 ${
          hovered ? "shadow-lg shadow-[#2b417e]/30 scale-[1.02]" : ""
        }`}
      >
        {submitted ? t("newsletterSuccess") : t("newsletterBtn")}
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
          <div className="w-12 h-12 rounded-2xl bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 flex items-center justify-center text-[#2b417e] dark:text-[#7b9bee] shrink-0 shadow-xs">
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
    { label: t("questions"), href: "/questions" },
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
      {/* Subtle Background Glows */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          background: `radial-gradient(ellipse 60% 40% at 15% 20%, rgba(43,65,126,0.08) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 50% at 85% 75%, rgba(43,65,126,0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Top Hairline Gradient Line */}
      <div className="relative z-1 w-full h-0.5 shrink-0 bg-linear-to-r from-transparent via-[#2b417e]/40 to-transparent" />

      {/* Decorative center divider */}
      <div className="relative z-1 flex items-center gap-4 px-6 sm:px-12 pt-7 pb-5">
        <span className="flex-1 h-px bg-linear-to-r from-transparent via-[#2b417e]/20 to-transparent" />
        <span className="text-xs sm:text-sm text-[#2b417e]/60 dark:text-[#7b9bee]/60 tracking-[6px] whitespace-nowrap font-mono flex items-center gap-1.5 font-bold">
          <Sparkles className="size-3.5 text-amber-400" />
          <span>LINGOARENA</span>
          <Sparkles className="size-3.5 text-amber-400" />
        </span>
        <span className="flex-1 h-px bg-linear-to-r from-transparent via-[#2b417e]/20 to-transparent" />
      </div>

      {/* Main 3 Columns Grid */}
      <div className="relative z-1 grid grid-cols-1 lg:grid-cols-[3fr_2fr_2fr] gap-10 lg:gap-12 max-w-7xl mx-auto px-6 sm:px-12 pb-12 w-full box-border">
        {/* Column 1: Brand Info & Socials */}
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

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#2b417e]/10 dark:bg-[#2b417e]/20 border border-[#2b417e]/20 dark:border-[#2b417e]/30 rounded-full max-w-fit shadow-2xs mt-2">
            <span className="text-[11px] text-[#2b417e] dark:text-[#7b9bee] whitespace-nowrap font-bold">
              TOEIC · IELTS · VSTEP · Aptis ESOL
            </span>
          </div>
        </div>

        {/* Column 2: Navigation Links */}
        <div>
          <h3 className="text-xs font-bold tracking-[2.5px] uppercase text-[#2b417e] dark:text-[#7b9bee] m-0 mb-5 flex items-center gap-2">
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

        {/* Column 3: Contact Info */}
        <div>
          <h3 className="text-xs font-bold tracking-[2.5px] uppercase text-[#2b417e] dark:text-[#7b9bee] m-0 mb-5 flex items-center gap-2">
            {t("contactTitle")}
          </h3>
          <div className="flex flex-col gap-3.5">
            {contactInfo.map((c) => (
              <div key={c.label} className="flex items-start gap-3">
                <div className="w-8.5 h-8.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[#2b417e] dark:text-[#7b9bee] shrink-0 mt-0.5">
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

      {/* Newsletter Subscribe Section */}
      <NewsletterSection />

      {/* Bottom Copyright & Legal Links */}
      <div className="relative z-1 max-w-7xl mx-auto w-full box-border px-6 sm:px-12 py-5 flex flex-wrap items-center justify-between gap-3 text-xs max-sm:flex-col max-sm:text-center">
        <p className="text-slate-500 m-0">
          Copyright © {currentYear}{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            LingoArena Platform
          </span>
          . All rights reserved.
        </p>

        <div className="flex flex-wrap gap-6 text-slate-500">
          {[t("terms"), t("privacy"), t("operating"), t("refund")].map(
            (item) => (
              <a
                key={item}
                href="#"
                className="text-slate-600 dark:text-slate-400 no-underline transition-colors hover:text-[#2b417e] dark:hover:text-[#7b9bee] relative"
              >
                {item}
              </a>
            ),
          )}
        </div>
      </div>

      {/* Bottom Edge Hairline Gradient Line */}
      <div className="relative z-1 w-full h-px shrink-0 bg-linear-to-r from-transparent via-[#2b417e]/20 to-transparent" />
    </footer>
  );
}
