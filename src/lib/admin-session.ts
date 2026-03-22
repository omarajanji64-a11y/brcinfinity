export const ADMIN_SESSION_COOKIE = 'brc-admin-session';
export const ADMIN_SESSION_VALUE = 'authorized';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export const hasAdminSession = (value?: string | null) => value === ADMIN_SESSION_VALUE;
