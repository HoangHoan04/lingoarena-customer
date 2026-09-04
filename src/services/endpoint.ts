export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/user/auth/login",
    REGISTER: "/user/auth/register",
    FORGOT_PASSWORD_SEND_OTP: "/user/auth/send-otp",
    FORGOT_PASSWORD_VERIFY_OTP: "/user/auth/verify-otp",
    FORGOT_PASSWORD_RESET: "/user/auth/reset-password",
    UPDATE_PASSWORD: "/user/auth/update-password",
    ME: "/user/auth/me",
    PROFILE: "/user/auth/profile",
    REFRESH_TOKEN: "/user/auth/refresh-token",
    LOGOUT: "/user/auth/logout",
    GOOGLE_LOGIN: "/user/auth/google-login",
    FACEBOOK_LOGIN: "/user/auth/facebook-login",
  },
  COURSES: {
    LIST: "/user/course/pagination",
    DETAIL: (id: string) => `/user/course/${id}`,
    BY_SLUG: (slug: string) => `/user/course/by-slug/${slug}`,
    ENROLL: (id: string) => `/user/course/enroll/${id}`,
    ME_ENROLLMENTS: "/user/course/me/enrollments",
    LESSON: (id: string) => `/user/course/lessons/${id}`,
    LESSON_PROGRESS: (id: string) => `/user/course/lessons/${id}/progress`,
    REVIEWS: (id: string) => `/user/course/${id}/reviews`,
  },
  GRAMMAR: {
    TOPICS_PAGINATION: "/user/grammar/topics/pagination",
    TOPIC_BY_SLUG: (slug: string) => `/user/grammar/topics/by-slug/${slug}`,
    STRUCTURES_PAGINATION: "/user/grammar/structures/pagination",
    STRUCTURE_DETAIL: (id: string) => `/user/grammar/structures/${id}`,
    ME_MASTERY: "/user/grammar/me/mastery",
  },
  ASSESSMENT: {
    PAGINATION: "/user/assessment/pagination",
    BY_SLUG: (slug: string) => `/user/assessment/by-slug/${slug}`,
    START: "/user/assessment/start",
    ATTEMPT: (id: string) => `/user/assessment/attempts/${id}`,
    HEARTBEAT: (id: string) => `/user/assessment/attempts/${id}/heartbeat`,
    ANSWERS: (id: string) => `/user/assessment/attempts/${id}/answers`,
    SUBMIT: (id: string) => `/user/assessment/attempts/${id}/submit`,
    RESULT: (id: string) => `/user/assessment/attempts/${id}/result`,
    GRADING_RUN: (id: string) => `/user/assessment/grading-tasks/${id}/run`,
  },
  LEARNING: {
    GOALS: "/user/learning/goals",
    GOALS_CURRENT: "/user/learning/goals/current",
    PATH_GENERATE: "/user/learning/paths/generate",
    PATH_CURRENT: "/user/learning/paths/current",
    ITEM_COMPLETE: (id: string) => `/user/learning/items/${id}/complete`,
    ERRORS: "/user/learning/errors",
    ACTIVITY_TODAY: "/user/learning/activity/today",
  },
  ARENA: {
    ME_RATING: "/user/arena/me/rating",
    ME_MATCHES: "/user/arena/me/matches",
    CHALLENGES: "/user/arena/challenges",
    QUEUE: "/user/arena/queue",
    QUEUE_TICKET: (id: string) => `/user/arena/queue/${id}`,
    PRACTICE_MATCH: "/user/arena/practice-match",
    MATCH: (id: string) => `/user/arena/matches/${id}`,
    MATCH_ANSWERS: (id: string) => `/user/arena/matches/${id}/answers`,
    MATCH_FINISH: (id: string) => `/user/arena/matches/${id}/finish`,
  },
  GAMIFICATION: {
    ME_STATS: "/user/gamification/me/stats",
    CHALLENGES_TODAY: "/user/gamification/challenges/today",
    CHALLENGE_PROGRESS: (code: string) =>
      `/user/gamification/challenges/${code}/progress`,
    PRACTICE_POINTS: "/user/gamification/me/practice-points",
  },
  LEADERBOARD: {
    SNAPSHOTS: "/user/leaderboard/snapshots",
  },

  ORGANIZATION: {
    ME: "/user/organization/me/organizations",
  },
  CLASSROOM: {
    ME_CLASSES: "/user/classroom/me/classes",
    JOIN: "/user/classroom/join",
    DETAIL: (id: string) => `/user/classroom/${id}`,
    SUBMIT_ASSIGNMENT: (id: string) =>
      `/user/classroom/assignments/${id}/submit`,
  },
  SUPPORT: {
    CONTACT: "/user/support/contact",
    TICKETS: "/user/support/tickets",
    TICKET: (id: string) => `/user/support/tickets/${id}`,
    TICKET_MESSAGES: (id: string) => `/user/support/tickets/${id}/messages`,
  },
  NOTIFICATION: {
    ME_PAGINATION: "/user/notification/me/pagination",
    READ: (id: string) => `/user/notification/read/${id}`,
    PREFERENCES: "/user/notification/me/preferences",
  },
  VOCABULARY: {
    DECKS_PAGINATION: "/user/vocabulary/decks/pagination",
    DECK_BY_SLUG: (slug: string) => `/user/vocabulary/decks/by-slug/${slug}`,
    WORDS_PAGINATION: "/user/vocabulary/words/pagination",
    WORD_DETAIL: (id: string) => `/user/vocabulary/words/${id}`,
    ME_STATS: "/user/vocabulary/me/stats",
    ME_NOTEBOOK: "/user/vocabulary/me/notebook",
    SESSIONS: "/user/vocabulary/sessions",
    SESSION_ANSWER: (id: string) => `/user/vocabulary/sessions/${id}/answer`,
    SESSION_COMPLETE: (id: string) =>
      `/user/vocabulary/sessions/${id}/complete`,
  },
  QUESTION: {
    QUESTIONS_PAGINATION: "/user/question/questions/pagination",
    QUESTION_DETAIL: (id: string) => `/user/question/questions/${id}`,
    LOOKUP_EXAM_TYPES: "/user/question/lookups/exam-types",
    LOOKUP_SKILLS: "/user/question/lookups/skills",
    LOOKUP_SECTIONS: "/user/question/lookups/sections",
    LOOKUP_TYPES: "/user/question/lookups/question-types",
    LOOKUP_TOPICS: "/user/question/lookups/topics",
    PRACTICE_START: "/user/question/practice/start",
    PRACTICE_GRADE: "/user/question/practice/grade",
    GROUPS_PAGINATION: "/user/question/groups/pagination",
    GROUP_DETAIL: (id: string) => `/user/question/groups/${id}`,
    GROUP_START_SESSION: (id: string) =>
      `/user/question/groups/${id}/start-session`,
  },
  CONVERSATION: {
    PERSONAS: "/user/conversation/personas",
    SPEAKING_ROOMS_PAGINATION: "/user/conversation/speaking-rooms/pagination",
    SPEAKING_ROOMS_CREATE: "/user/conversation/speaking-rooms",
    SPEAKING_ROOM_JOIN: (id: string) =>
      `/user/conversation/speaking-rooms/${id}/join`,
    AI_SESSIONS: "/user/conversation/ai-sessions",
    AI_SESSIONS_PAGINATION: "/user/conversation/ai-sessions/pagination",
    CONVERSATION: (id: string) => `/user/conversation/conversations/${id}`,
    CONVERSATION_MESSAGES: (id: string) =>
      `/user/conversation/conversations/${id}/messages`,
    CONVERSATION_CLOSE: (id: string) =>
      `/user/conversation/conversations/${id}/close`,
  },

  TRANSLATE: {
    TEXT: "/user/translate",
  },
};
export default API_ENDPOINTS;
