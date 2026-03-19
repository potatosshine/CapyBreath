import { createSession } from '../api/sessionApi';
import type { SessionCreateRequest } from '../types/session.types';

const ANONYMOUS_SESSIONS_KEY = 'capybreath.anonymousSessions';

const isBrowser = () => typeof window !== 'undefined';

export const getAnonymousSessions = (): SessionCreateRequest[] => {
  if (!isBrowser()) return [];

  const raw = window.localStorage.getItem(ANONYMOUS_SESSIONS_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveAnonymousSession = (session: SessionCreateRequest) => {
  if (!isBrowser()) return;

  const sessions = getAnonymousSessions();
  sessions.push(session);
  window.localStorage.setItem(ANONYMOUS_SESSIONS_KEY, JSON.stringify(sessions));
};

export const clearAnonymousSessions = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ANONYMOUS_SESSIONS_KEY);
};

export const getAnonymousSessionsCount = () => getAnonymousSessions().length;

export const migrateAnonymousSessions = async () => {
  const sessions = getAnonymousSessions();

  if (!sessions.length) {
    return { migratedCount: 0, failedCount: 0 };
  }

  let migratedCount = 0;
  let failedCount = 0;
  const pendingSessions: SessionCreateRequest[] = [];

  for (const session of sessions) {
    try {
      await createSession(session);
      migratedCount += 1;
    } catch {
      failedCount += 1;
      pendingSessions.push(session);
    }
  }

  if (!failedCount) {
    clearAnonymousSessions();
  } else {
    window.localStorage.setItem(
      ANONYMOUS_SESSIONS_KEY,
      JSON.stringify(pendingSessions)
    );
  }

  return { migratedCount, failedCount };
};
