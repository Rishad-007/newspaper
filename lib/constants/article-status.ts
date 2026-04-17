export const ARTICLE_STATUSES = [
  "draft",
  "submitted",
  "approved",
  "published",
  "rejected",
] as const;

export type ArticleStatus = (typeof ARTICLE_STATUSES)[number];
