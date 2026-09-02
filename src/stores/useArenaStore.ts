import { create } from "zustand";

export type RankTier =
  | "BRONZE"
  | "SILVER"
  | "GOLD"
  | "PLATINUM"
  | "DIAMOND"
  | "MASTER"
  | "GRANDMASTER";

export interface RankInfo {
  tier: RankTier;
  tierName: string;
  division: string; // I, II, III
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
  mode: "RANKED" | "CASUAL" | "BOT" | "CUSTOM";
  opponentName: string;
  opponentAvatar: string;
  opponentElo: number;
  myScore: number;
  opponentScore: number;
  result: "VICTORY" | "DEFEAT" | "DRAW";
  eloChange: number;
  xpEarned: number;
  playedAt: string;
}

export interface ArenaQuestion {
  id: string;
  question: string;
  vietnameseMeaning?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  timeLimitSeconds: number;
}

export type MatchmakingStatus = "IDLE" | "SEARCHING" | "MATCH_FOUND" | "CONNECTING";

interface ArenaState {
  userStats: ArenaUserStats;
  leaderboard: LeaderboardPlayer[];
  matchHistory: MatchHistoryItem[];
  currentSeason: {
    number: number;
    title: string;
    endDate: string;
    totalPrizePool: string;
  };

  // Matchmaking State
  matchmakingStatus: MatchmakingStatus;
  searchTimeSeconds: number;
  matchedOpponent: LeaderboardPlayer | null;

  // Active Match State
  activeMatch: {
    matchId: string;
    mode: "RANKED" | "CASUAL" | "BOT" | "CUSTOM";
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
    result: "VICTORY" | "DEFEAT" | "DRAW" | null;
    eloDelta: number;
    xpEarned: number;
  } | null;

  // Actions
  startMatchmaking: (mode: "RANKED" | "CASUAL" | "BOT" | "CUSTOM") => void;
  cancelMatchmaking: () => void;
  initMatch: (mode: "RANKED" | "CASUAL" | "BOT" | "CUSTOM", opponent?: LeaderboardPlayer) => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  finishMatch: () => void;
  resetMatch: () => void;
}

// ----------------------------------------------------
// MOCK DATA: Rank Tiers Config
// ----------------------------------------------------
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

// ----------------------------------------------------
// MOCK DATA: Leaderboard Top Players
// ----------------------------------------------------
const MOCK_LEADERBOARD: LeaderboardPlayer[] = [
  {
    rank: 1,
    userId: "user-top-1",
    name: "Lê Hoàng Long",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    elo: 2840,
    rankTier: "GRANDMASTER",
    winRate: 84.5,
    winCount: 342,
    badge: "Quán Quân Mùa 3",
  },
  {
    rank: 2,
    userId: "user-top-2",
    name: "Trần Minh Châu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    elo: 2795,
    rankTier: "GRANDMASTER",
    winRate: 81.2,
    winCount: 298,
    badge: "Thần Tốc IELTS",
  },
  {
    rank: 3,
    userId: "user-top-3",
    name: "Phạm Quốc Bảo",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    elo: 2720,
    rankTier: "GRANDMASTER",
    winRate: 78.9,
    winCount: 275,
    badge: "Vua Từ Vựng C2",
  },
  {
    rank: 4,
    userId: "user-top-4",
    name: "Đặng Thùy Dương",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    elo: 2560,
    rankTier: "MASTER",
    winRate: 75.0,
    winCount: 210,
  },
  {
    rank: 5,
    userId: "user-top-5",
    name: "Nguyễn Hải Đăng",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    elo: 2480,
    rankTier: "MASTER",
    winRate: 72.4,
    winCount: 195,
  },
];

// ----------------------------------------------------
// MOCK DATA: Match History
// ----------------------------------------------------
const MOCK_MATCH_HISTORY: MatchHistoryItem[] = [
  {
    id: "match-101",
    mode: "RANKED",
    opponentName: "Trần Minh Châu",
    opponentAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    opponentElo: 2795,
    myScore: 480,
    opponentScore: 420,
    result: "VICTORY",
    eloChange: 26,
    xpEarned: 120,
    playedAt: "15 phút trước",
  },
  {
    id: "match-102",
    mode: "RANKED",
    opponentName: "Phạm Quốc Bảo",
    opponentAvatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
    opponentElo: 2720,
    myScore: 350,
    opponentScore: 450,
    result: "DEFEAT",
    eloChange: -18,
    xpEarned: 40,
    playedAt: "1 giờ trước",
  },
  {
    id: "match-103",
    mode: "BOT",
    opponentName: "AI Master Bot",
    opponentAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
    opponentElo: 2200,
    myScore: 500,
    opponentScore: 380,
    result: "VICTORY",
    eloChange: 0,
    xpEarned: 80,
    playedAt: "Hôm qua",
  },
];

// ----------------------------------------------------
// MOCK DATA: Arena Questions Pool
// ----------------------------------------------------
const MOCK_ARENA_QUESTIONS: ArenaQuestion[] = [
  {
    id: "q-1",
    question: "Select the word closest in meaning to 'UBIQUITOUS':",
    vietnameseMeaning: "Phổ biến, xuất hiện ở khắp mọi nơi",
    options: ["Omnipresent", "Ephemeral", "Obscure", "Meticulous"],
    correctIndex: 0,
    explanation: "'Ubiquitous' = 'Omnipresent' mang nghĩa xuất hiện khắp mọi nơi, rất phổ biến.",
    timeLimitSeconds: 10,
  },
  {
    id: "q-2",
    question: "Complete the sentence: 'The CEO's decision will ________ significant implications for the market.'",
    options: ["engender", "abate", "curtail", "relinquish"],
    correctIndex: 0,
    explanation: "'Engender' có nghĩa là đem lại, gây ra, tạo ra (thường dùng trong văn phong học thuật C1/C2).",
    timeLimitSeconds: 10,
  },
  {
    id: "q-3",
    question: "Choose the antonym of 'LACONIC':",
    vietnameseMeaning: "Trái nghĩa với 'ngắn gọn, súc tích'",
    options: ["Verbose", "Taciturn", "Concise", "Succinct"],
    correctIndex: 0,
    explanation: "'Laconic' = kiệm lời, súc tích. Trái nghĩa là 'Verbose' = dài dòng, nhiều lời.",
    timeLimitSeconds: 10,
  },
  {
    id: "q-4",
    question: "Which idiom means 'to face a difficult situation with courage'?",
    options: ["Bite the bullet", "Spill the beans", "Break the ice", "Burn the candle at both ends"],
    correctIndex: 0,
    explanation: "'Bite the bullet' = ngậm đắng nuốt cay, dũng cảm đối mặt với khó khăn thử thách.",
    timeLimitSeconds: 10,
  },
  {
    id: "q-5",
    question: "Identify the grammatically correct sentence:",
    options: [
      "Hardly had she arrived when the lecture began.",
      "Hardly she had arrived than the lecture began.",
      "No sooner she arrived when the lecture began.",
      "Scarcely had she arrived than the lecture began.",
    ],
    correctIndex: 0,
    explanation: "Cấu trúc đảo ngữ chuẩn: 'Hardly + had + S + Vp2 + WHEN + S + Ved'.",
    timeLimitSeconds: 10,
  },
];

export const useArenaStore = create<ArenaState>((set, get) => ({
  userStats: {
    elo: 2180,
    rankTier: "DIAMOND",
    division: "I",
    winCount: 148,
    lossCount: 62,
    winStreak: 4,
    seasonRank: 18,
    totalMatches: 210,
    bestWinStreak: 9,
    averageResponseTimeMs: 2450,
  },
  leaderboard: MOCK_LEADERBOARD,
  matchHistory: MOCK_MATCH_HISTORY,
  currentSeason: {
    number: 4,
    title: "Huyền Thoại Từ Vựng & Ngữ Pháp 2026",
    endDate: "30/09/2026",
    totalPrizePool: "50.000.000 VNĐ + Học Bổng VIP",
  },

  matchmakingStatus: "IDLE",
  searchTimeSeconds: 0,
  matchedOpponent: null,
  activeMatch: null,

  startMatchmaking: (mode) => {
    set({ matchmakingStatus: "SEARCHING", searchTimeSeconds: 0 });

    // Simulate matchmaking find within 2.5s
    setTimeout(() => {
      const opponent =
        MOCK_LEADERBOARD[Math.floor(Math.random() * MOCK_LEADERBOARD.length)];
      set({
        matchmakingStatus: "MATCH_FOUND",
        matchedOpponent: opponent,
      });

      // Transition to connecting
      setTimeout(() => {
        set({ matchmakingStatus: "CONNECTING" });
        get().initMatch(mode, opponent);
      }, 1500);
    }, 2500);
  },

  cancelMatchmaking: () => {
    set({
      matchmakingStatus: "IDLE",
      searchTimeSeconds: 0,
      matchedOpponent: null,
    });
  },

  initMatch: (mode, opponent) => {
    const opp = opponent || MOCK_LEADERBOARD[1];
    set({
      matchmakingStatus: "IDLE",
      activeMatch: {
        matchId: `match-${Date.now()}`,
        mode,
        currentQuestionIndex: 0,
        totalQuestions: MOCK_ARENA_QUESTIONS.length,
        questions: MOCK_ARENA_QUESTIONS,
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

  submitAnswer: (answerIndex) => {
    const { activeMatch } = get();
    if (!activeMatch || activeMatch.mySelectedAnswer !== null) return;

    const currentQ = activeMatch.questions[activeMatch.currentQuestionIndex];
    const isCorrect = answerIndex === currentQ.correctIndex;

    const speedBonus = Math.max(10, activeMatch.timeLeft * 8);
    const comboMultiplier = activeMatch.myCombo >= 3 ? 1.5 : activeMatch.myCombo >= 1 ? 1.2 : 1.0;
    const addedScore = isCorrect ? Math.round((100 + speedBonus) * comboMultiplier) : 0;

    // Simulate opponent response
    const oppCorrect = Math.random() > 0.35;
    const oppScoreAdded = oppCorrect ? Math.round(90 + Math.random() * 40) : 0;

    set((state) => {
      if (!state.activeMatch) return state;
      return {
        activeMatch: {
          ...state.activeMatch,
          mySelectedAnswer: answerIndex,
          isMyAnswerCorrect: isCorrect,
          myScore: state.activeMatch.myScore + addedScore,
          myCombo: isCorrect ? state.activeMatch.myCombo + 1 : 0,
          opponentScore: state.activeMatch.opponentScore + oppScoreAdded,
          opponentCombo: oppCorrect ? state.activeMatch.opponentCombo + 1 : 0,
          opponentAnswered: true,
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

  finishMatch: () => {
    const { activeMatch, userStats } = get();
    if (!activeMatch) return;

    const isVictory = activeMatch.myScore >= activeMatch.opponentScore;
    const isDraw = activeMatch.myScore === activeMatch.opponentScore;
    const result = isVictory ? (isDraw ? "DRAW" : "VICTORY") : "DEFEAT";

    const eloDelta = isVictory ? (isDraw ? 0 : 25) : -18;
    const xpEarned = isVictory ? 120 : 40;

    // Update user stats
    const updatedElo = Math.max(0, userStats.elo + eloDelta);

    set((state) => {
      if (!state.activeMatch) return state;
      return {
        userStats: {
          ...state.userStats,
          elo: updatedElo,
          winCount: isVictory && !isDraw ? state.userStats.winCount + 1 : state.userStats.winCount,
          lossCount: !isVictory && !isDraw ? state.userStats.lossCount + 1 : state.userStats.lossCount,
          winStreak: isVictory && !isDraw ? state.userStats.winStreak + 1 : 0,
        },
        activeMatch: {
          ...state.activeMatch,
          isFinished: true,
          result,
          eloDelta,
          xpEarned,
        },
      };
    });
  },

  resetMatch: () => {
    set({
      activeMatch: null,
      matchmakingStatus: "IDLE",
      matchedOpponent: null,
    });
  },
}));
