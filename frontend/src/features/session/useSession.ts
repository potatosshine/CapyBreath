import { useCallback, useState } from 'react';
import {
  getSessions,
  createSession,
  getSessionById,
} from '../../api/sessionApi';
import type { Session } from '../../types/session.types';

export const useSession = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions();
      setSessions(data);
    } catch (err) {
      setError('Erro ao buscar sessões');
    } finally {
      setLoading(false);
    }
  }, []);

  const addSession = useCallback(async (sessionData: Partial<Session>) => {
    setLoading(true);
    setError(null);
    try {
      const newSession = await createSession(sessionData);
      setSessions(prev => [newSession, ...prev]);
      return newSession;
    } catch (err) {
      setError('Erro ao criar sessão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSessionById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await getSessionById(id);
    } catch (err) {
      setError('Erro ao buscar sessão');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sessions,
    loading,
    error,
    fetchSessions,
    addSession,
    fetchSessionById,
  };
};
