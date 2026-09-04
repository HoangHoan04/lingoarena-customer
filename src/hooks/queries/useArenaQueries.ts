import { arenaService } from "@/services/arena.service";
import { leaderboardService } from "@/services/leaderboard.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const ARENA_QUERY_KEYS = {
  all: ["arena"] as const,
  leaderboard: (boardType = "STUDY_POINTS", period = "ALL_TIME") =>
    ["arena", "leaderboard", boardType, period] as const,
  rating: (examSkillId: string) => ["arena", "rating", examSkillId] as const,
  match: (id: string) => ["arena", "match", id] as const,
  queueTicket: (id: string) => ["arena", "queue", id] as const,
};

export function useArenaLeaderboardQuery(boardType = "STUDY_POINTS", period = "ALL_TIME") {
  return useQuery({
    queryKey: ARENA_QUERY_KEYS.leaderboard(boardType, period),
    queryFn: () => leaderboardService.snapshots(boardType, period),
    staleTime: 60 * 1000,
  });
}

export function useArenaRatingQuery(examSkillId = "default") {
  return useQuery({
    queryKey: ARENA_QUERY_KEYS.rating(examSkillId),
    queryFn: () => arenaService.rating(examSkillId),
    staleTime: 30 * 1000,
  });
}

export function useArenaMatchQuery(matchId: string) {
  return useQuery({
    queryKey: ARENA_QUERY_KEYS.match(matchId),
    queryFn: () => arenaService.match(matchId),
    enabled: Boolean(matchId),
  });
}

export function useArenaQueueMutation() {
  return useMutation({
    mutationFn: ({ examSkillId, matchMode }: { examSkillId: string; matchMode?: string }) =>
      arenaService.queue(examSkillId, matchMode),
  });
}

export function useArenaPracticeMatchMutation() {
  return useMutation({
    mutationFn: ({ examSkillId, questionCount }: { examSkillId: string; questionCount?: number }) =>
      arenaService.practiceMatch(examSkillId, questionCount),
  });
}

export function useArenaAnswerMutation() {
  return useMutation({
    mutationFn: ({
      matchId,
      arenaMatchQuestionId,
      answerJson,
      timeTakenMs,
    }: {
      matchId: string;
      arenaMatchQuestionId: string;
      answerJson: Record<string, unknown>;
      timeTakenMs?: number;
    }) => arenaService.answer(matchId, arenaMatchQuestionId, answerJson, timeTakenMs),
  });
}

export function useArenaFinishMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (matchId: string) => arenaService.finish(matchId),
    onSuccess: (_data, matchId) => {
      queryClient.invalidateQueries({ queryKey: ARENA_QUERY_KEYS.match(matchId) });
      queryClient.invalidateQueries({ queryKey: ["arena", "rating"] });
      queryClient.invalidateQueries({ queryKey: ["arena", "leaderboard"] });
    },
  });
}
