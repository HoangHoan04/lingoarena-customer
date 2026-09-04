"use client";

import { TopicFilterBar } from "@/components/common/TopicFilterBar";
import {
  WritingCustomPromptCard,
  WritingFeedbackReport,
  WritingLobbyHeader,
  WritingParaphraseStudio,
  WritingStudio,
  WritingTopicCatalog,
} from "@/components/writing";
import { useTopicsQuery } from "@/hooks/queries/useQuestionQueries";
import { mapQuestionToParaphrase, mapQuestionToWritingTopic } from "@/lib/skill-mappers";
import { questionService } from "@/services/question.service";
import type { ParaphraseExercise, WritingExamType, WritingScoreResult, WritingTopic } from "@/types/writing";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function WritingPage() {
  const { data: topics = [], isLoading: topicsLoading } = useTopicsQuery();
  const [selectedExam, setSelectedExam] = useState<WritingExamType>("ALL");
  const [selectedTopicId, setSelectedTopicId] = useState("ALL");
  const [activeMode, setActiveMode] = useState<"catalog" | "custom" | "paraphrase">("catalog");
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null);
  const [evaluationResult, setEvaluationResult] = useState<WritingScoreResult | null>(null);
  const [prompts, setPrompts] = useState<WritingTopic[]>([]);
  const [paraphrase, setParaphrase] = useState<ParaphraseExercise[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const topicId = selectedTopicId !== "ALL" ? selectedTopicId : undefined;
        const [essayRes, blankRes] = await Promise.all([
          questionService.pagination(0, 50, { questionType: "ESSAY", topicId }),
          questionService.pagination(0, 30, { questionType: "FILL_BLANK", topicId }),
        ]);
        if (!mounted) return;
        setPrompts((essayRes.data || []).map(mapQuestionToWritingTopic));
        setParaphrase((blankRes.data || []).map(mapQuestionToParaphrase));
      } catch {
        if (mounted) {
          setPrompts([]);
          setParaphrase([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedTopicId]);

  const filteredTopics = useMemo(() => {
    if (selectedExam === "ALL") return prompts;
    return prompts.filter((t) => t.examType === selectedExam);
  }, [prompts, selectedExam]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {selectedTopic && evaluationResult ? (
        <WritingFeedbackReport
          topic={selectedTopic}
          result={evaluationResult}
          onRetry={() => setEvaluationResult(null)}
          onBackToCatalog={() => {
            setSelectedTopic(null);
            setEvaluationResult(null);
          }}
        />
      ) : selectedTopic ? (
        <WritingStudio
          topic={selectedTopic}
          onBackToCatalog={() => {
            setSelectedTopic(null);
            setEvaluationResult(null);
          }}
          onSubmitResult={(res) => setEvaluationResult(res)}
        />
      ) : (
        <div className="space-y-8">
          <WritingLobbyHeader
            selectedExam={selectedExam}
            activeMode={activeMode}
            onSelectExam={setSelectedExam}
            onChangeMode={setActiveMode}
            topicsCount={filteredTopics.length}
          />
          {activeMode !== "custom" ? (
            <TopicFilterBar
              topics={topics}
              selectedId={selectedTopicId}
              onSelect={setSelectedTopicId}
              accent="emerald"
              loading={topicsLoading}
              title="Chọn chủ đề viết"
              hint="Đề luận được gắn chủ đề. Chọn chủ đề để luyện đúng ngữ cảnh (du lịch, công việc, môi trường…)."
            />
          ) : null}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <>
              {activeMode === "catalog" && (
                <WritingTopicCatalog topics={filteredTopics} onSelectTopic={setSelectedTopic} />
              )}
              {activeMode === "custom" && <WritingCustomPromptCard onStartCustomTopic={setSelectedTopic} />}
              {activeMode === "paraphrase" && <WritingParaphraseStudio exercises={paraphrase} />}
            </>
          )}
        </div>
      )}
    </div>
  );
}
