"use client";

import { GrammarTopicDetailView } from "@/components/grammar";
import { Link } from "@/i18n/routing";
import { grammarService } from "@/services/grammar.service";
import { useToastStore } from "@/stores/useToastStore";
import type { GrammarTopic } from "@/types/grammar";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function GrammarTopicDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug;
  const { addToast } = useToastStore();
  const [topic, setTopic] = useState<GrammarTopic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await grammarService.getTopicBySlug(String(slug));
        if (!cancelled) setTopic(data);
      } catch {
        if (!cancelled) setTopic(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const handleUpdateMastery = async (structureId: string, isCorrect: boolean) => {
    try {
      const result = await grammarService.updateMastery(structureId, isCorrect);
      addToast(`Đã ghi nhận! Điểm thành thạo: ${Number(result.masteryScore || 0).toFixed(0)}%`, "success");
    } catch (err: any) {
      addToast(err?.message || "Không lưu được tiến độ thành thạo.", "error");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-48 rounded-3xl bg-slate-100 dark:bg-slate-800/60 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center space-y-4">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Không tìm thấy chủ điểm ngữ pháp này</h1>
        <p className="text-sm text-slate-500">Chủ điểm có thể chưa được xuất bản hoặc không tồn tại.</p>
        <Link href="/grammar" className="inline-flex px-6 py-2.5 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md">
          Quay lại danh sách ngữ pháp
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
      <GrammarTopicDetailView topic={topic} onUpdateMastery={handleUpdateMastery} />
    </div>
  );
}
