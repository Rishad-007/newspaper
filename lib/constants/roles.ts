export const APP_ROLES = ["writer", "editor", "owner"] as const;

export type AppRole = (typeof APP_ROLES)[number];
