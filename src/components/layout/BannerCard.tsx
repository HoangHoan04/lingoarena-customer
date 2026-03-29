import type { BannerDto } from "@/dto";
import { useBanners } from "@/hooks/banner";
import { useEffect, useState } from "react";

interface BannerComponentProps {
  type?: string;
  className?: string; // Cho phép truyền className từ ngoài vào
}

const BannerComponent = ({
  type = "HOME",
  className = "",
}: BannerComponentProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data: banners, isLoading, isError } = useBanners(type);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const handleBannerClick = (url?: string) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  // --- TRẠNG THÁI LOADING ---
  if (isLoading) {
    return (
      <section
        className={`w-full rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse flex items-center justify-center ${className}`}
      >
        <div className="flex flex-col items-center gap-3">
          <i className="pi pi-spin pi-spinner text-4xl text-slate-400"></i>
          <span className="text-slate-500 font-medium">
            Đang tải đấu trường...
          </span>
        </div>
      </section>
    );
  }

  // --- TRẠNG THÁI LỖI ---
  if (isError) {
    return (
      <section
        className={`w-full rounded-3xl bg-red-50 dark:bg-red-900/10 flex items-center justify-center border border-red-100 ${className}`}
      >
        <div className="text-center">
          <i className="pi pi-exclamation-circle text-red-500 text-4xl mb-2"></i>
          <p className="text-red-500 font-bold">Không thể tải dữ liệu banner</p>
        </div>
      </section>
    );
  }

  // --- TRẠNG THÁI KHÔNG CÓ DỮ LIỆU ---
  if (!banners || banners.length === 0) {
    return (
      <section
        className={`w-full rounded-4xl bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center relative overflow-hidden ${className}`}
      >
        <div className="text-center z-10">
          <i className="pi pi-images text-6xl text-slate-400 mb-4"></i>
          <p className="text-slate-500 text-xl font-bold">Arena is empty</p>
          <p className="text-slate-400 text-sm mt-1">
            Chưa có banner nào được hiển thị
          </p>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];
  const imageUrl = currentBanner.image?.[0]?.fileUrl || "";

  const thumbnailTemplate = (banner: BannerDto, index: number) => {
    const thumbImageUrl = banner.image?.[0]?.fileUrl || "";

    return (
      <button
        onClick={() => setCurrentIndex(index)}
        className={`relative rounded-2xl transition-all duration-300 overflow-hidden ${
          index === currentIndex
            ? "shadow-xl scale-110 z-10 border-2 border-white ring-4 ring-indigo-500/20"
            : "opacity-40 hover:opacity-100 scale-100"
        }`}
      >
        <div className="relative h-14 w-24">
          <img
            src={thumbImageUrl}
            alt={banner.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </button>
    );
  };

  return (
    <section
      className={`w-full rounded-4xl relative overflow-hidden group shadow-2xl ${className}`}
    >
      {/* ẢNH BANNER CHÍNH */}
      <div
        className="relative w-full h-full cursor-pointer overflow-hidden"
        onClick={() => handleBannerClick(currentBanner.url)}
      >
        <img
          src={imageUrl}
          alt={currentBanner.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* LỚP PHỦ GRADIENT ĐỂ CHỮ RÕ HƠN */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent"></div>

        {/* THUMBNAILS LIST (Bên phải) */}
        <div className="absolute top-6 right-6 z-20">
          <div className="flex flex-col gap-4 max-h-[80%] py-2 overflow-y-auto pr-2 scrollbar-none">
            {banners.map((banner, index) => (
              <div key={banner.id || index}>
                {thumbnailTemplate(banner, index)}
              </div>
            ))}
          </div>
        </div>

        {/* NÚT ĐIỀU HƯỚNG PREV/NEXT */}
        {banners.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(
                  (prev) => (prev - 1 + banners.length) % banners.length,
                );
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-indigo-600 w-12 h-12 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center justify-center border border-white/30"
            >
              <i className="pi pi-chevron-left font-bold"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % banners.length);
              }}
              className="absolute right-36 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-indigo-600 w-12 h-12 rounded-2xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 z-30 flex items-center justify-center border border-white/30"
            >
              <i className="pi pi-chevron-right font-bold"></i>
            </button>
          </>
        )}

        {/* NỘI DUNG CHỮ TRÊN BANNER */}
        <div className="absolute bottom-10 left-10 right-32 z-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white drop-shadow-2xl uppercase italic tracking-tighter leading-tight">
            {currentBanner.title}
          </h2>
          {currentBanner.titleEn && (
            <p className="text-xl md:text-2xl mt-3 text-indigo-200 font-medium drop-shadow-lg italic">
              {currentBanner.titleEn}
            </p>
          )}
        </div>

        {/* PHÂN TRANG (DOTS) */}
        {banners.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`transition-all duration-500 rounded-full ${
                  index === currentIndex
                    ? "w-10 h-2.5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                    : "w-2.5 h-2.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BannerComponent;
