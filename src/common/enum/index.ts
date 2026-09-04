export const enumData = {
  RANK_TIER: {
    BRONZE: {
      code: "BRONZE",
      nameVi: "Đồng",
      nameEn: "Bronze",
      color: "#cd7f32",
    },
    SILVER: {
      code: "SILVER",
      nameVi: "Bạc",
      nameEn: "Silver",
      color: "#c0c0c0",
    },
    GOLD: {
      code: "GOLD",
      nameVi: "Vàng",
      nameEn: "Gold",
      color: "#ffd700",
    },
    PLATINUM: {
      code: "PLATINUM",
      nameVi: "Bạch kim",
      nameEn: "Platinum",
      color: "#e5e4e2",
    },
    DIAMOND: {
      code: "DIAMOND",
      nameVi: "Kim cương",
      nameEn: "Diamond",
      color: "#b9f2ff",
    },
    MASTER: {
      code: "MASTER",
      nameVi: "Bậc thầy",
      nameEn: "Master",
      color: "#ff4500",
    },
    GRANDMASTER: {
      code: "GRANDMASTER",
      nameVi: "Đại bậc thầy",
      nameEn: "Grandmaster",
      color: "#ff0000",
    },
  },

  MATCH_RESULT: {
    WIN: {
      code: "WIN",
      nameVi: "Thắng",
      nameEn: "Win",
      color: "#4caf50",
    },
    LOSS: {
      code: "LOSS",
      nameVi: "Thua",
      nameEn: "Loss",
      color: "#f44336",
    },
    DRAW: {
      code: "DRAW",
      nameVi: "Hòa",
      nameEn: "Draw",
      color: "#9e9e9e",
    },
  },

  MATCH_MAKING_STATUS: {
    IDLE: {
      code: "IDLE",
      nameVi: "Đang chờ",
      nameEn: "Idle",
    },
    SEARCHING: {
      code: "SEARCHING",
      nameVi: "Đang tìm trận",
      nameEn: "Searching",
    },
    MATCH_FOUND: {
      code: "MATCH_FOUND",
      nameVi: "Đã tìm thấy trận",
      nameEn: "Match Found",
    },
    CONNECTING: {
      code: "CONNECTING",
      nameVi: "Đang kết nối",
      nameEn: "Connecting",
    },
  },

  MATCH_MODE: {
    RANKED: {
      code: "RANKED",
      nameVi: "Xếp hạng",
      nameEn: "Ranked",
    },
    CASUAL: {
      code: "CASUAL",
      nameVi: "Thường",
      nameEn: "Casual",
    },
    BOT: {
      code: "BOT",
      nameVi: "Chơi với Bot",
      nameEn: "Bot",
    },
    CUSTOM: {
      code: "CUSTOM",
      nameVi: "Tùy chỉnh",
      nameEn: "Custom",
    },
  },
};

const RankTier = Object.fromEntries(
  Object.keys(enumData.RANK_TIER).map((k) => [k, k]),
) as { [K in keyof typeof enumData.RANK_TIER]: K };

const MatchResult = Object.fromEntries(
  Object.keys(enumData.MATCH_RESULT).map((k) => [k, k]),
) as { [K in keyof typeof enumData.MATCH_RESULT]: K };

const MatchMakingStatus = Object.fromEntries(
  Object.keys(enumData.MATCH_MAKING_STATUS).map((k) => [k, k]),
) as { [K in keyof typeof enumData.MATCH_MAKING_STATUS]: K };

const MatchMode = Object.fromEntries(
  Object.keys(enumData.MATCH_MODE).map((k) => [k, k]),
) as { [K in keyof typeof enumData.MATCH_MODE]: K };

export { MatchMakingStatus, MatchMode, MatchResult, RankTier };

export type RankTier = keyof typeof enumData.RANK_TIER;
export type MatchResult = keyof typeof enumData.MATCH_RESULT;
export type MatchMakingStatus = keyof typeof enumData.MATCH_MAKING_STATUS;
export type MatchMode = keyof typeof enumData.MATCH_MODE;
