"use client";

import { Link, useRouter } from "@/i18n/routing";
import { arenaService, type ArenaMatch } from "@/services/arena.service";
import { useToastStore } from "@/stores/useToastStore";
import { CheckCircle2, Home, Loader2, Swords, Trophy, XCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

export default function ArenaLiveMatchRoomPage() {
  const params = useParams<{ matchId: string }>();
  const router = useRouter();
  const { addToast } = useToastStore();
  const matchId = params?.matchId;
  const [match, setMatch] = useState<ArenaMatch | null>(null);
  const [index, setIndex] = useState(0);
  const [answerState, setAnswerState] = useState<Record<number, boolean>>({});
  const [selected, setSelected] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!matchId) return;
    arenaService
      .match(matchId)
      .then(setMatch)
      .catch((err) => addToast(err?.message || "Không thể tải trận đấu", "error"))
      .finally(() => setLoading(false));
  }, [addToast, matchId]);

  const questions = useMemo(() => match?.matchQuestions || [], [match]);
  const current = questions[index];
  const question = current?.question;
  const hasAnswered = answerState[index] !== undefined;

  const submit = async (optionKey: string) => {
    if (!matchId || !current) return;
    setSubmitting(true);
    try {
      const result: any = await arenaService.answer(matchId, current.id, { optionKey }, 0);
      setSelected((prev) => ({ ...prev, [index]: optionKey }));
      setAnswerState((prev) => ({ ...prev, [index]: Boolean(result?.grading?.isCorrect ?? result?.isCorrect) }));
    } catch (err: any) {
      addToast(err?.message || "Không thể gửi câu trả lời", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const next = async () => {
    if (index + 1 < questions.length) {
      setIndex((prev) => prev + 1);
      return;
    }
    if (!matchId) return;
    setSubmitting(true);
    try {
      const finished = await arenaService.finish(matchId);
      setMatch(finished);
      addToast("Trận đấu đã kết thúc", "success");
    } catch (err: any) {
      addToast(err?.message || "Không thể kết thúc trận", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!match || !question) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 text-center">
        <Swords className="size-16 text-muted-foreground" />
        <h1 className="text-xl font-black">Không tìm thấy trận đấu</h1>
        <Link href="/arena" className="rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">
          Quay về Arena
        </Link>
      </div>
    );
  }

  const finished = match.status === "FINISHED";
  const mine = match.participants?.[0];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-primary">{match.matchMode}</p>
            <h1 className="text-2xl font-black">Arena Match</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Câu {index + 1}/{questions.length}</p>
            <p className="text-xl font-black text-primary">{mine?.score || 0} pts</p>
          </div>
        </div>
      </section>

      {finished ? (
        <section className="rounded-3xl border border-border bg-card p-8 text-center space-y-4">
          <Trophy className="mx-auto size-16 text-amber-500" />
          <h2 className="text-3xl font-black">Hoàn thành trận đấu</h2>
          <p className="text-sm text-muted-foreground">Kết quả: {mine?.result || "FINISHED"} · Elo {mine?.eloChange ? `${mine.eloChange > 0 ? "+" : ""}${mine.eloChange}` : "0"}</p>
          <button
            type="button"
            onClick={() => router.push("/arena")}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
          >
            <Home className="size-4" />
            Về sảnh Arena
          </button>
        </section>
      ) : (
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase text-muted-foreground">{question.questionType?.name || "Question"}</p>
            <h2 className="text-xl sm:text-2xl font-black">{question.prompt}</h2>
            {question.instructions && <p className="text-sm text-muted-foreground">{question.instructions}</p>}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(question.options || []).map((option) => {
              const isSelected = selected[index] === option.optionKey;
              return (
                <button
                  key={option.optionKey}
                  type="button"
                  disabled={hasAnswered || submitting}
                  onClick={() => submit(option.optionKey)}
                  className={`rounded-2xl border p-4 text-left text-sm font-bold transition ${
                    isSelected
                      ? answerState[index]
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                        : "border-rose-500 bg-rose-500/10 text-rose-600"
                      : "border-border bg-background hover:border-primary"
                  }`}
                >
                  {option.optionKey}. {option.content}
                </button>
              );
            })}
          </div>

          {hasAnswered && (
            <div className="flex flex-col gap-4 rounded-2xl bg-muted/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-sm font-bold">
                {answerState[index] ? <CheckCircle2 className="size-5 text-emerald-500" /> : <XCircle className="size-5 text-rose-500" />}
                {answerState[index] ? "Chính xác" : "Chưa chính xác"}
              </p>
              <button
                type="button"
                disabled={submitting}
                onClick={next}
                className="rounded-2xl bg-primary px-5 py-3 text-sm font-black text-primary-foreground"
              >
                {index + 1 < questions.length ? "Câu tiếp theo" : "Kết thúc trận"}
              </button>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
