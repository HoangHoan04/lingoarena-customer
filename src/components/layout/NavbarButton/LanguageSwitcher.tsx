import { EnFlag, VnFlag } from "@/assets/icons";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", name: t("common.english"), icon: EnFlag },
    { code: "vi", name: t("common.vietnamese"), icon: VnFlag },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-indigo-500/30 bg-white/5 hover:bg-white/10 transition-all duration-300 text-slate-300 hover:text-white"
        style={{
          backdropFilter: "blur(8px)",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <img
          src={currentLanguage.icon}
          alt={currentLanguage.name}
          className="w-5 h-4 object-cover rounded-sm border border-white/10"
        />
        <span className="text-sm font-medium hidden sm:inline">
          {currentLanguage.code.toUpperCase()}
        </span>
        <i
          className={`pi pi-chevron-down text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        ></i>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-40 rounded-xl bg-[#0f172a] border border-indigo-500/20 shadow-2xl overflow-hidden z-100 animate-in fade-in zoom-in duration-200"
          style={{
            backdropFilter: "blur(16px)",
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  i18n.language === lang.code
                    ? "bg-indigo-600/20 text-indigo-400"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <img
                  src={lang.icon}
                  alt={lang.name}
                  className="w-5 h-4 object-cover rounded-sm border border-white/10"
                />
                <span className="font-medium">{lang.name}</span>
                {i18n.language === lang.code && (
                  <i className="pi pi-check ml-auto text-[10px]"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
