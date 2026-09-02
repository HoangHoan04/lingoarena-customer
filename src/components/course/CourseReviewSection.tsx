"use client";

import { type CourseReview } from "@/stores/useCourseStore";
import { Star, ThumbsUp, UserCheck } from "lucide-react";
import React, { useState } from "react";

export default function CourseReviewSection({
  rating,
  reviewCount,
  reviews,
}: {
  rating: number;
  reviewCount: number;
  reviews: CourseReview[];
}) {
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(
    () => {
      const initial: Record<string, number> = {};
      reviews.forEach((r) => {
        initial[r.id] = r.helpfulCount;
      });
      return initial;
    }
  );
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const handleLike = (id: string) => {
    if (likedIds.includes(id)) {
      setLikedIds(likedIds.filter((item) => item !== id));
      setHelpfulCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    } else {
      setLikedIds([...likedIds, id]);
      setHelpfulCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Rating Overview */}
      <div className="p-6 rounded-3xl bg-card border border-border flex flex-col sm:flex-row items-center gap-6 sm:gap-10 shadow-sm">
        {/* Left Big Score */}
        <div className="flex flex-col items-center justify-center text-center sm:border-r sm:border-border sm:pr-10 shrink-0">
          <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            {rating.toFixed(1)}
          </span>
          <div className="flex items-center gap-1 my-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className="size-4.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            Dựa trên {formatNumber(reviewCount)} đánh giá
          </span>
        </div>

        {/* Right Star Distribution Bars */}
        <div className="flex-1 w-full space-y-1.5">
          {[
            { stars: 5, pct: 88 },
            { stars: 4, pct: 9 },
            { stars: 3, pct: 2 },
            { stars: 2, pct: 1 },
            { stars: 1, pct: 0 },
          ].map((bar) => (
            <div key={bar.stars} className="flex items-center gap-3 text-xs">
              <span className="w-12 text-muted-foreground font-semibold shrink-0">
                {bar.stars} sao
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${bar.pct}%` }}
                />
              </div>
              <span className="w-9 text-right font-bold text-foreground shrink-0">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Cards List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center text-muted-foreground text-xs">
            Chưa có đánh giá nào cho khóa học này. Hãy là người đầu tiên trải nghiệm!
          </div>
        ) : (
          reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-3xl bg-card border border-border shadow-xs space-y-3"
            >
              {/* User info & rating */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={rev.userAvatar}
                    alt={rev.userName}
                    className="size-10 rounded-full object-cover border border-border"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">
                        {rev.userName}
                      </h4>
                      <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">
                        <UserCheck className="size-3" />
                        Học viên đã học
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3 ${
                              s <= rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300 dark:text-slate-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span>·</span>
                      <span>{rev.createdAt}</span>
                    </div>
                  </div>
                </div>

                {rev.targetBand && (
                  <span className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary text-xs font-black">
                    {rev.targetBand}
                  </span>
                )}
              </div>

              {/* Comment Content */}
              <p className="text-xs sm:text-[13.5px] text-muted-foreground leading-relaxed font-normal pl-1">
                {rev.comment}
              </p>

              {/* Helpful count button */}
              <div className="flex items-center gap-3 pt-1 text-xs pl-1">
                <button
                  type="button"
                  onClick={() => handleLike(rev.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border border-border transition-colors cursor-pointer text-xs font-semibold ${
                    likedIds.includes(rev.id)
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ThumbsUp className="size-3" />
                  <span>Hữu ích ({helpfulCounts[rev.id] || 0})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
