const prefix = "/api/user";
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${prefix}/auth/login`,
    LOGIN_WITH_ZALO: `${prefix}/auth/login/zalo`,
    LOGIN_WITH_GOOGLE: `${prefix}/auth/login/google`,
    LOGIN_WITH_FACEBOOK: `${prefix}/auth/login/facebook`,
    CHECK_PHONE_EMAIL: `${prefix}/auth/check-phone-email`,
    SEND_OTP: `${prefix}/auth/send-otp`,
    SEND_OTP_VERIFY: `${prefix}/auth/send-otp-verify`,
    REGISTER: `${prefix}/auth/register`,
    FORGOT_PASSWORD: `${prefix}/auth/forgot-password`,
    VERIFY_OTP: `${prefix}/auth/verify-otp`,
    REFRESH_TOKEN: `${prefix}/auth/refresh-token`,
    UPDATE_PASSWORD: `${prefix}/auth/update-password`,
    CHANGE_PASSWORD: `${prefix}/auth/change-password`,
    ME: `${prefix}/auth/me`,
    LOGOUT: `${prefix}/auth/logout`,
  },

  NOTIFY: {
    SEEN_ALL: `${prefix}/notify/update-seen-all`,
    SEEN_LIST: `${prefix}/notify/update-seen-list`,
    COUNT_NOT_SEEN: `${prefix}/notify/find-count-notify-not-seen`,
    PAGINATION: `${prefix}/notify/pagination`,
  },

  BANNER: {
    GET_BY_TYPE: `${prefix}/banner/get-by-type`,
  },

  NEWSLETTER: {
    SUBSCRIBE: `${prefix}/newsletter/subscribe`,
    UNSUBSCRIBE: `${prefix}/newsletter/unsubscribe`,
  },

  BLOG: {
    PAGINATION: `${prefix}/blog/pagination`,
    FIND_BY_SLUG: `${prefix}/blog/find-by-slug`,
    RELATED: `${prefix}/blog/related`,
    POPULAR: `${prefix}/blog/popular`,
    LATEST: `${prefix}/blog/latest`,
    SEARCH: `${prefix}/blog/search`,
    BY_CATEGORY: `${prefix}/blog/by-category`,
    BY_TAG: `${prefix}/blog/by-tag`,
    CATEGORIES: `${prefix}/blog/categories`,
    TAGS: `${prefix}/blog/tags`,
    LIKE: `${prefix}/blog/like`,
    UNLIKE: `${prefix}/blog/unlike`,

    COMMENTS_BY_POST: `${prefix}/blog/comments/by-post`,
    CREATE_COMMENT: `${prefix}/blog/comments/create`,
    UPDATE_COMMENT: `${prefix}/blog/comments/update`,
    DELETE_COMMENT: `${prefix}/blog/comments/delete`,
    RESTORE_COMMENT: `${prefix}/blog/comments/restore`,
  },

  NEWS: {
    PAGINATION: `${prefix}/news/pagination`,
    DETAIL: `${prefix}/news/detail`,
    FEATURED: `${prefix}/news/featured`,
    RELATED: `${prefix}/news/related`,
    LATEST: `${prefix}/news/latest`,
    FIND_BY_TYPE: `${prefix}/news/find-by-type`,
    SEARCH: `${prefix}/news/search`,
    COUNT_BY_TYPE: `${prefix}/news/count-by-type`,
  },

  UPLOAD_FILE: {
    SINGLE: "/api/upload/uploadFiles/upload-single",
    MULTI: "/api/upload/uploadFiles/upload-multi",
  },

  EMAIL: {
    SEND_CONTACT: "/api/email/send-contact",
  },

  TRANSLATION: {
    TRANSLATE: `${prefix}/translation/translate`,
    TRANSLATE_BATCH: `${prefix}/translation/translate-batch`,
    DETECT: `${prefix}/translation/detect`,
    LANGUAGES: `${prefix}/translation/languages`,
    WEBSITE: `${prefix}/translation/website`,
    IMAGE: `${prefix}/translation/image`,
    DOCUMENT: `${prefix}/translation/document`,
    DICTIONARY_LOOKUP: `${prefix}/translation/dictionary/lookup`,
    TRANSLITERATE: `${prefix}/translation/transliterate`,
    HISTORY: `${prefix}/translation/history`,
    SAVED_LIST: `${prefix}/translation/saved/list`,
    SAVED_TOGGLE: `${prefix}/translation/saved/toggle`,
  },

  CHATBOT: {
    CHAT: `${prefix}/chatbot-ai/chat`,
    GENERATE_ROADMAP: `${prefix}/chatbot-ai/generate-roadmap`,
  },
};
