"use client";

import {
  ReadingCatalog,
  ReadingLobbyHeader,
  ReadingResultView,
  ReadingSpeedReader,
  ReadingStudio,
} from "@/components/reading";
import { useTopicsQuery } from "@/hooks/queries/useQuestionQueries";
import { mapGroupToReadingPassage } from "@/lib/skill-mappers";
import { questionService } from "@/services/question.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { useToastStore } from "@/stores/useToastStore";
import type { QuestionGroup } from "@/types/question";
import type { ReadingExamType, ReadingPassage, ReadingScoreReport } from "@/types/reading";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function ReadingPage() {
  const { isAuthenticated } = useAuthStore();
  const { addToast } = useToastStore();
  const { data: topics = [], isLoading: topicsLoading } = useTopicsQuery();
  const [selectedExam, setSelectedExam] = useState<ReadingExamType>("ALL");
  const [selectedLevel, setSelectedLevel] = useState("ALL");
  const [selectedTopicId, setSelectedTopicId] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMode, setActiveMode] = useState<"catalog" | "speed">("catalog");
  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPassage, setSelectedPassage] = useState<ReadingPassage | null>(null);
  const [scoreReport, setScoreReport] = useState<ReadingScoreReport | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await questionService.paginationGroups(0, 60, {
          stimulusType: "passage",
          keyword: searchQuery.trim() || undefined,
          cefrLevel: selectedLevel !== "ALL" ? selectedLevel : undefined,
          topicId: selectedTopicId !== "ALL" ? selectedTopicId : undefined,
        });
        if (mounted) setGroups(res.data || []);
      } catch {
        if (mounted) setGroups([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [searchQuery, selectedLevel, selectedTopicId]);

  const passages = useMemo(() => {
    return groups
      .map(mapGroupToReadingPassage)
      .filter((p) => selectedExam === "ALL" || p.examType === selectedExam);
  }, [groups, selectedExam]);

  const handleSelectPassage = async (passage: ReadingPassage) => {
    try {
      const detail = await questionService.getGroup(passage.id);
      const mapped = mapGroupToReadingPassage(detail);
      if (isAuthenticated) {
        await questionService.startGroupSession(passage.id, "READING").catch(() => null);
      }
      setSelectedPassage(mapped);
      setScoreReport(null);
    } catch (err: any) {
      addToast(err?.message || "Không mở được bài đọc", "error");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {selectedPassage && scoreReport ? (
        <ReadingResultView
          passage={selectedPassage}
          report={scoreReport}
          onRetry={() => setScoreReport(null)}
          onBackToCatalog={() => {
            setSelectedPassage(null);
            setScoreReport(null);
          }}
        />
      ) : selectedPassage ? (
        <ReadingStudio
          passage={selectedPassage}
          onBackToCatalog={() => {
            setSelectedPassage(null);
            setScoreReport(null);
          }}
          onSubmitResult={(report) => setScoreReport(report)}
        />
      ) : (
        <div className="space-y-8">
          <ReadingLobbyHeader
            selectedExam={selectedExam}
            selectedLevel={selectedLevel}
            selectedTopicId={selectedTopicId}
            topics={topics}
            topicsLoading={topicsLoading}
            activeMode={activeMode}
            searchQuery={searchQuery}
            onSelectExam={setSelectedExam}
            onSelectLevel={setSelectedLevel}
            onSelectTopic={setSelectedTopicId}
            onChangeMode={setActiveMode}
            onSearchChange={setSearchQuery}
            passagesCount={passages.length}
          />
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-cyan-600" />
            </div>
          ) : activeMode === "catalog" ? (
            <ReadingCatalog passages={passages} onSelectPassage={handleSelectPassage} />
          ) : (
            <ReadingSpeedReader passages={passages} />
          )}
        </div>
      )}
    </div>
  );
}
