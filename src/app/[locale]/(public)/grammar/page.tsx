"use client";

import {
  GrammarCategoryList,
  GrammarCheatSheet,
  GrammarLobbyHeader,
  GrammarQuizArena,
} from "@/components/grammar";
import { groupGrammarTopics, mapStructuresToCheatSheet, mapStructuresToQuiz } from "@/lib/skill-mappers";
import { grammarService } from "@/services/grammar.service";
import type { CheatSheetItem, GrammarCategoryGroup, GrammarQuizQuestion, GrammarTopic } from "@/types/grammar";
import { BookOpen, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function GrammarPage() {
  const [activeMode, setActiveMode] = useState<"topics" | "quiz" | "cheatsheet">("topics");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [keyword, setKeyword] = useState("");
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [cheatItems, setCheatItems] = useState<CheatSheetItem[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<GrammarQuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [topicRes, structureRes] = await Promise.all([
          grammarService.paginationTopics(0, 80, selectedLevel ? { cefrLevel: selectedLevel } : {}),
          grammarService.paginationStructures(0, 80, {}),
        ]);
        if (cancelled) return;
        setTopics(topicRes.data || []);
        setCheatItems(mapStructuresToCheatSheet(structureRes.data || []));
        setQuizQuestions(mapStructuresToQuiz(structureRes.data || []));
      } catch {
        if (!cancelled) {
          setTopics([]);
          setCheatItems([]);
          setQuizQuestions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedLevel]);

  const displayedCategories: GrammarCategoryGroup[] = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const filtered = topics.filter((topic) => {
      if (selectedLevel && topic.cefrLevel && topic.cefrLevel !== selectedLevel) return false;
      if (!q) return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        (topic.description || "").toLowerCase().includes(q) ||
        (topic.structures || []).some(
          (s) =>
            s.formula.toLowerCase().includes(q) ||
            s.title.toLowerCase().includes(q) ||
            (s.usageContent || "").toLowerCase().includes(q),
        )
      );
    });
    return groupGrammarTopics(filtered);
  }, [topics, selectedLevel, keyword]);

  const totalFilteredTopicsCount = displayedCategories.reduce((acc, cat) => acc + cat.topics.length, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-20">
      <GrammarLobbyHeader
        selectedLevel={selectedLevel}
        activeMode={activeMode}
        keyword={keyword}
        onSelectLevel={setSelectedLevel}
        onChangeMode={setActiveMode}
        onKeywordChange={setKeyword}
        topicsCount={totalFilteredTopicsCount}
      />

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {activeMode === "topics" &&
            (totalFilteredTopicsCount === 0 ? (
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-2">
                <BookOpen className="size-10 mx-auto text-slate-400" />
                <h3 className="font-black">Chưa có chủ điểm ngữ pháp</h3>
                <p className="text-sm text-slate-500">Catalog trống cho đến khi quản trị viên xuất bản chủ đề.</p>
              </div>
            ) : (
              <GrammarCategoryList categories={displayedCategories} />
            ))}
          {activeMode === "quiz" && <GrammarQuizArena questions={quizQuestions} />}
          {activeMode === "cheatsheet" && <GrammarCheatSheet keyword={keyword} items={cheatItems} />}
        </>
      )}
    </div>
  );
}
