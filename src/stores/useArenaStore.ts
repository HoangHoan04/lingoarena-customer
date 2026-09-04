import { MatchMakingStatus, MatchMode, MatchResult, RankTier } from "@/common";
import { arenaService, type ArenaMatch, type ArenaParticipant } from "@/services/arena.service";
import { gamificationService } from "@/services/gamification.service";
import { leaderboardService } from "@/services/leaderboard.service";
import { questionService } from "@/services/question.service";
import { useAuthStore } from "@/stores/useAuthStore";
import { create } from "zustand";

export interface RankInfo {
  tier: RankTier;
  tierName: string;
  division: string;
  minElo: number;
  maxElo: number;
  badgeColor: string;
  iconBg: string;
}

export interface ArenaUserStats {
  elo: number;
  rankTier: RankTier;
  division: string;
  winCount: number;
  lossCount: number;
  winStreak: number;
  seasonRank: number;
  totalMatches: number;
  bestWinStreak: number;
  averageResponseTimeMs: number;
}

export interface LeaderboardPlayer {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  elo: number;
  rankTier: RankTier;
  winRate: number;
  winCount: number;
  badge?: string;
}

export interface MatchHistoryItem {
  id: string;
  mode: string;
  opponentName: string;
  opponentAvatar: string;
  opponentElo: number;
  myScore: number;
  opponentScore: number;
  result: MatchResult;
  eloChange: number;
  xpEarned: number;
  playedAt: string;
}

export interface ArenaQuestion {
  id: string;
  matchQuestionId?: string;
  question: string;
  vietnameseMeaning?: string;
  options: string[];
  optionKeys?: string[];
  correctIndex: number;
  explanation: string;
  timeLimitSeconds: number;
}

interface ArenaState {
  userStats: ArenaUserStats;
  leaderboard: LeaderboardPlayer[];
  matchHistory: MatchHistoryItem[];
  currentSeason: {
    number: number;
    title: string;
    endDate: string;
    totalPrizePool: string;
  } | null;
  matchmakingStatus: MatchMakingStatus;
  searchTimeSeconds: number;
  matchedOpponent: LeaderboardPlayer | null;
  activeMatch: {
    matchId: string;
    mode: MatchMode;
    currentQuestionIndex: number;
    totalQuestions: number;
    questions: ArenaQuestion[];
    myScore: number;
    myCombo: number;
    mySelectedAnswer: number | null;
    isMyAnswerCorrect: boolean | null;
    opponentScore: number;
    opponentCombo: number;
    opponentAnswered: boolean;
    timeLeft: number;
    isFinished: boolean;
    result: MatchResult | null;
    eloDelta: number;
    xpEarned: number;
  } | null;
  isLoading: boolean;

  fetchLeaderboard: () => Promise<void>;
  fetchUserStats: (examSkillId?: string) => Promise<void>;
  fetchMatchHistory: () => Promise<void>;
  startMatchmaking: (mode: MatchMode, examSkillId?: string) => Promise<void>;
  cancelMatchmaking: () => void;
  initMatch: (mode: MatchMode, questions: ArenaQuestion[], matchId?: string, opponent?: LeaderboardPlayer) => void;
  loadMatch: (matchId: string) => Promise<void>;
  submitAnswer: (answerIndex: number) => Promise<void>;
  nextQuestion: () => void;
  finishMatch: () => Promise<void>;
  resetMatch: () => void;
}

export const RANK_CONFIGS: Record<RankTier, RankInfo> = {
  BRONZE: {
    tier: "BRONZE",
    tierName: "Đồng",
    division: "I",
    minElo: 0,
    maxElo: 1199,
    badgeColor: "text-amber-700 dark:text-amber-600 bg-amber-700/10 border-amber-700/30",
    iconBg: "from-amber-800 to-amber-600",
  },
  SILVER: {
    tier: "SILVER",
    tierName: "Bạc",
    division: "I",
    minElo: 1200,
    maxElo: 1499,
    badgeColor: "text-slate-400 bg-slate-400/10 border-slate-400/30",
    iconBg: "from-slate-500 to-slate-300",
  },
  GOLD: {
    tier: "GOLD",
    tierName: "Vàng",
    division: "I",
    minElo: 1500,
    maxElo: 1799,
    badgeColor: "text-amber-400 bg-amber-400/10 border-amber-400/30",
    iconBg: "from-amber-500 to-yellow-300",
  },
  PLATINUM: {
    tier: "PLATINUM",
    tierName: "Bạch Kim",
    division: "I",
    minElo: 1800,
    maxElo: 2099,
    badgeColor: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30",
    iconBg: "from-cyan-600 to-teal-300",
  },
  DIAMOND: {
    tier: "DIAMOND",
    tierName: "Kim Cương",
    division: "I",
    minElo: 2100,
    maxElo: 2399,
    badgeColor: "text-blue-400 bg-blue-400/10 border-blue-400/30",
    iconBg: "from-blue-600 to-indigo-400",
  },
  MASTER: {
    tier: "MASTER",
    tierName: "Cao Thủ",
    division: "I",
    minElo: 2400,
    maxElo: 2699,
    badgeColor: "text-purple-400 bg-purple-400/10 border-purple-400/30",
    iconBg: "from-purple-600 to-pink-400",
  },
  GRANDMASTER: {
    tier: "GRANDMASTER",
    tierName: "Đại Cao Thủ",
    division: "TOP 50",
    minElo: 2700,
    maxElo: 4000,
    badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/30",
    iconBg: "from-rose-600 to-amber-500",
  },
};

export function calculateRankTier(elo: number): RankTier {
  if (elo >= 2700) return "GRANDMASTER";
  if (elo >= 2400) return "MASTER";
  if (elo >= 2100) return "DIAMOND";
  if (elo >= 1800) return "PLATINUM";
  if (elo >= 1500) return "GOLD";
  if (elo >= 1200) return "SILVER";
  return "BRONZE";
}

const DEFAULT_USER_STATS: ArenaUserStats = {
  elo: 0,
  rankTier: "BRONZE",
  division: "I",
  winCount: 0,
  lossCount: 0,
  winStreak: 0,
  seasonRank: 0,
  totalMatches: 0,
  bestWinStreak: 0,
  averageResponseTimeMs: 0,
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function myUserId() {
  return useAuthStore.getState().user?.id;
}

function mapMatchMode(matchMode?: string): MatchMode {
  if (matchMode === "QUICKPLAY") return "BOT";
  if (matchMode === "FRIENDLY") return "CASUAL";
  if (matchMode === "BOT" || matchMode === "CASUAL" || matchMode === "CUSTOM") return matchMode;
  return "RANKED";
}

function mapQueueMode(mode: MatchMode) {
  if (mode === "CASUAL" || mode === "CUSTOM") return "FRIENDLY";
  return "RANKED";
}

function mapMatchQuestions(match: ArenaMatch): ArenaQuestion[] {
  return (match.matchQuestions || []).map((item) => {
    const options = item.question?.options || [];
    return {
      id: item.question?.id || item.id,
      matchQuestionId: item.id,
      question: item.question?.prompt || "",
      options: options.map((opt) => opt.content),
      optionKeys: options.map((opt) => opt.optionKey),
      correctIndex: options.findIndex((opt) => opt.isCorrect),
      explanation: "",
      timeLimitSeconds: 10,
    };
  });
}

function mapOpponent(match: ArenaMatch, userId?: string): LeaderboardPlayer | null {
  const opponent = (match.participants || []).find((item: ArenaParticipant) => item.userId !== userId);
  if (!opponent) return null;
  const elo = Number(opponent.eloRating || 0);
  return {
    rank: 0,
    userId: opponent.userId,
    name: opponent.user?.fullName || opponent.user?.displayName || "Đối thủ",
    avatar: opponent.user?.avatarUrl || "",
    elo,
    rankTier: calculateRankTier(elo),
    winRate: 0,
    winCount: 0,
  };
}

async function resolveExamSkillId(examSkillId?: string) {
  if (examSkillId && examSkillId !== "default") return examSkillId;
  try {
    const skills = await questionService.lookupSkills();
    return skills[0]?.id || "";
  } catch {
    return "";
  }
}

function historyFromMatch(match: ArenaMatch, userId?: string): MatchHistoryItem {
  const me = (match.participants || []).find((item) => item.userId === userId);
  const opponent = (match.participants || []).find((item) => item.userId !== userId);
  const myScore = Number(me?.score || 0);
  const opponentScore = Number(opponent?.score || 0);
  const apiResult = String(me?.result || "").toUpperCase();
  const result: MatchResult =
    apiResult === "WIN" || apiResult === "LOSS" || apiResult === "DRAW"
      ? (apiResult as MatchResult)
      : myScore > opponentScore
        ? "WIN"
        : myScore < opponentScore
          ? "LOSS"
          : "DRAW";
  return {
    id: match.id,
    mode: mapMatchMode(match.matchMode),
    opponentName: opponent?.user?.fullName || opponent?.user?.displayName || "Đối thủ",
    opponentAvatar: opponent?.user?.avatarUrl || "",
    opponentElo: Number(opponent?.eloRating || 0),
    myScore,
    opponentScore,
    result,
    eloChange: Number(me?.eloChange || 0),
    xpEarned: 0,
    playedAt: match.createdAt ? new Date(match.createdAt).toLocaleString("vi-VN") : "",
  };
}

let matchmakingGen = 0;

export const useArenaStore = create<ArenaState>((set, get) => ({
  userStats: DEFAULT_USER_STATS,
  leaderboard: [],
  matchHistory: [],
  currentSeason: null,

  matchmakingStatus: "IDLE",
  searchTimeSeconds: 0,
  matchedOpponent: null,
  activeMatch: null,
  isLoading: false,

  fetchLeaderboard: async () => {
    try {
      set({ isLoading: true });
      let rows = await leaderboardService.snapshots("ARENA_ELO", "ALL_TIME");
      if (!rows.length) {
        rows = await leaderboardService.snapshots("STUDY_POINTS", "ALL_TIME");
      }
      const mapped: LeaderboardPlayer[] = rows.map((row, idx) => {
        const score = Number(row.score) || 0;
        return {
          rank: row.rank || idx + 1,
          userId: row.userId || row.id,
          name: row.metadataJson?.username || `Đấu thủ #${row.rank || idx + 1}`,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${row.userId || idx}`,
          elo: score,
          rankTier: calculateRankTier(score),
          winRate: Number(row.metadataJson?.currentStreakDays || 0),
          winCount: 0,
        };
      });
      set({ leaderboard: mapped });
    } catch {
      set({ leaderboard: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserStats: async (examSkillId) => {
    try {
      await gamificationService.myStats();
      const skillId = await resolveExamSkillId(examSkillId);
      if (!skillId) {
        set({ userStats: DEFAULT_USER_STATS });
        return;
      }
      const rating = await arenaService.rating(skillId);
      const data = (rating as { data?: Record<string, unknown> } | Record<string, unknown> | null) as any;
      const payload = data?.data || data;
      if (!payload) {
        set({ userStats: DEFAULT_USER_STATS });
        return;
      }
      const elo = Number(payload.eloRating || payload.elo || 0);
      const winCount = Number(payload.wins || payload.winCount || 0);
      const lossCount = Number(payload.losses || payload.lossCount || 0);
      set({
        userStats: {
          elo,
          rankTier: calculateRankTier(elo),
          division: "I",
          winCount,
          lossCount,
          winStreak: Number(payload.winStreak || 0),
          seasonRank: Number(payload.seasonRank || payload.rank || 0),
          totalMatches: Number(payload.matchesPlayed || winCount + lossCount),
          bestWinStreak: Number(payload.bestWinStreak || payload.winStreak || 0),
          averageResponseTimeMs: Number(payload.averageResponseTimeMs || 0),
        },
      });
    } catch {
      set({ userStats: DEFAULT_USER_STATS });
    }
  },

  fetchMatchHistory: async () => {
    try {
      const res = await arenaService.myMatches(0, 20);
      const uid = myUserId();
      set({ matchHistory: (res.data || []).map((match) => historyFromMatch(match, uid)) });
    } catch {
      set({ matchHistory: [] });
    }
  },

  startMatchmaking: async (mode, examSkillId) => {
    const gen = ++matchmakingGen;
    set({ matchmakingStatus: "SEARCHING", searchTimeSeconds: 0, matchedOpponent: null });
    try {
      const skillId = await resolveExamSkillId(examSkillId);
      if (!skillId) {
        set({ matchmakingStatus: "IDLE" });
        return;
      }

      let match: ArenaMatch | null = null;
      if (mode === "BOT" || mode === "CASUAL" || mode === "CUSTOM") {
        match = await arenaService.practiceMatch(skillId);
      } else {
        const ticket = await arenaService.queue(skillId, mapQueueMode(mode));
        for (let i = 0; i < 20; i += 1) {
          if (gen !== matchmakingGen) return;
          const status = await arenaService.queueTicket(ticket.id);
          if (status?.matchedMatchId) {
            match = await arenaService.match(status.matchedMatchId);
            break;
          }
          await sleep(1500);
        }
      }

      if (gen !== matchmakingGen) return;
      if (!match?.id || !mapMatchQuestions(match).length) {
        set({ matchmakingStatus: "IDLE", matchedOpponent: null });
        return;
      }

      const uid = myUserId();
      const opponent = mapOpponent(match, uid);
      set({ matchmakingStatus: "MATCH_FOUND", matchedOpponent: opponent });
      await sleep(1200);
      if (gen !== matchmakingGen) return;
      set({ matchmakingStatus: "CONNECTING" });
      get().initMatch(mode, mapMatchQuestions(match), match.id, opponent || undefined);
    } catch {
      if (gen === matchmakingGen) {
        set({ matchmakingStatus: "IDLE", matchedOpponent: null });
      }
    }
  },

  cancelMatchmaking: () => {
    matchmakingGen += 1;
    set({
      matchmakingStatus: "IDLE",
      searchTimeSeconds: 0,
      matchedOpponent: null,
    });
  },

  initMatch: (mode, questions, matchId, opponent) => {
    set({
      matchedOpponent: opponent || get().matchedOpponent,
      activeMatch: {
        matchId: matchId || "",
        mode,
        currentQuestionIndex: 0,
        totalQuestions: questions.length,
        questions,
        myScore: 0,
        myCombo: 0,
        mySelectedAnswer: null,
        isMyAnswerCorrect: null,
        opponentScore: 0,
        opponentCombo: 0,
        opponentAnswered: false,
        timeLeft: 10,
        isFinished: false,
        result: null,
        eloDelta: 0,
        xpEarned: 0,
      },
    });
  },

  loadMatch: async (matchId) => {
    try {
      const match = await arenaService.match(matchId);
      if (!match?.id) return;
      const uid = myUserId();
      const questions = mapMatchQuestions(match);
      const opponent = mapOpponent(match, uid);
      const me = (match.participants || []).find((item) => item.userId === uid);
      const opp = (match.participants || []).find((item) => item.userId !== uid);
      const finished = match.status === "FINISHED";
      const history = historyFromMatch(match, uid);
      set({
        matchedOpponent: opponent,
        matchmakingStatus: "IDLE",
        activeMatch: {
          matchId: match.id,
          mode: mapMatchMode(match.matchMode),
          currentQuestionIndex: 0,
          totalQuestions: questions.length,
          questions,
          myScore: Number(me?.score || 0),
          myCombo: 0,
          mySelectedAnswer: null,
          isMyAnswerCorrect: null,
          opponentScore: Number(opp?.score || 0),
          opponentCombo: 0,
          opponentAnswered: Number(opp?.totalAnswered || 0) > 0,
          timeLeft: 10,
          isFinished: finished,
          result: finished ? history.result : null,
          eloDelta: Number(me?.eloChange || 0),
          xpEarned: 0,
        },
      });
    } catch {
      // Keep empty active match; page shows not-found state
    }
  },

  submitAnswer: async (answerIndex) => {
    const { activeMatch } = get();
    if (!activeMatch || activeMatch.mySelectedAnswer !== null) return;

    const currentQ = activeMatch.questions[activeMatch.currentQuestionIndex];
    let isCorrect = currentQ?.correctIndex >= 0 ? answerIndex === currentQ.correctIndex : false;
    let myScore = activeMatch.myScore;
    let opponentScore = activeMatch.opponentScore;
    let opponentAnswered = activeMatch.opponentAnswered;

    if (currentQ?.matchQuestionId && activeMatch.matchId) {
      try {
        const optionKey = currentQ.optionKeys?.[answerIndex];
        const result = await arenaService.answer(
          activeMatch.matchId,
          currentQ.matchQuestionId,
          optionKey ? { optionKey } : { selectedIndex: answerIndex },
          Math.max(0, (10 - activeMatch.timeLeft) * 1000),
        );
        const payload = (result as any)?.data || result;
        if (typeof payload?.isCorrect === "boolean") isCorrect = payload.isCorrect;
        else if (typeof payload?.grading?.isCorrect === "boolean") isCorrect = payload.grading.isCorrect;
        const refreshed = await arenaService.match(activeMatch.matchId);
        const uid = myUserId();
        const me = (refreshed.participants || []).find((item) => item.userId === uid);
        const opp = (refreshed.participants || []).find((item) => item.userId !== uid);
        myScore = Number(me?.score || myScore);
        opponentScore = Number(opp?.score || opponentScore);
        opponentAnswered = Number(opp?.totalAnswered || 0) > 0;
      } catch {
        // Keep local correctness if the API call fails
      }
    }

    set((state) => {
      if (!state.activeMatch) return state;
      return {
        activeMatch: {
          ...state.activeMatch,
          mySelectedAnswer: answerIndex,
          isMyAnswerCorrect: isCorrect,
          myScore,
          myCombo: isCorrect ? state.activeMatch.myCombo + 1 : 0,
          opponentScore,
          opponentAnswered,
        },
      };
    });
  },

  nextQuestion: () => {
    const { activeMatch } = get();
    if (!activeMatch) return;

    if (activeMatch.currentQuestionIndex >= activeMatch.totalQuestions - 1) {
      get().finishMatch();
      return;
    }

    set((state) => {
      if (!state.activeMatch) return state;
      return {
        activeMatch: {
          ...state.activeMatch,
          currentQuestionIndex: state.activeMatch.currentQuestionIndex + 1,
          mySelectedAnswer: null,
          isMyAnswerCorrect: null,
          opponentAnswered: false,
          timeLeft: 10,
        },
      };
    });
  },

  finishMatch: async () => {
    const { activeMatch } = get();
    if (!activeMatch) return;

    let result: MatchResult =
      activeMatch.myScore > activeMatch.opponentScore
        ? "WIN"
        : activeMatch.myScore < activeMatch.opponentScore
          ? "LOSS"
          : "DRAW";
    let eloDelta = 0;
    let myScore = activeMatch.myScore;
    let opponentScore = activeMatch.opponentScore;

    try {
      const finished = await arenaService.finish(activeMatch.matchId);
      const uid = myUserId();
      const history = historyFromMatch(finished, uid);
      result = history.result;
      eloDelta = history.eloChange;
      myScore = history.myScore;
      opponentScore = history.opponentScore;
      set((state) => ({
        matchHistory: [history, ...state.matchHistory.filter((item) => item.id !== history.id)],
        matchedOpponent: mapOpponent(finished, uid) || state.matchedOpponent,
      }));
    } catch {
      // Keep locally computed result if finish API is unavailable
    }

    set((state) => ({
      activeMatch: state.activeMatch
        ? {
            ...state.activeMatch,
            myScore,
            opponentScore,
            isFinished: true,
            result,
            eloDelta,
            xpEarned: 0,
          }
        : null,
    }));
    await get().fetchUserStats();
  },

  resetMatch: () => {
    set({
      activeMatch: null,
      matchmakingStatus: "IDLE",
      matchedOpponent: null,
    });
  },
}));
