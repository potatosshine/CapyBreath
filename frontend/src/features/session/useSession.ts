import { useCallback, useState } from 'react';
import {
  createSession,
  getSessionById,
  getSessions,
} from '../../api/sessionApi';
import { getApiErrorMessage } from '../../api/apiError';
import type {
  SessionCreateRequest,
  SessionDetail,
  SessionListItem,
  SessionQueryParams,
} from '../../types/session.types';

export const useSession = () => {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    size: 20,
    pages: 0,
  });

  const fetchSessions = useCallback(async (params: SessionQueryParams = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSessions(params);
      setSessions(data.items);
      setPagination({
        total: data.total,
        page: data.page,
        size: data.size,
        pages: data.pages,
      });
      return data;
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao buscar sessões');
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addSession = useCallback(
    async (sessionData: SessionCreateRequest) => {
      setLoading(true);
      setError(null);
      try {
        const newSession = await createSession(sessionData);
        await fetchSessions({ page: pagination.page, size: pagination.size });
        return newSession;
      } catch (error) {
        setError(getApiErrorMessage(error, 'Erro ao criar sessão'));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchSessions, pagination.page, pagination.size]
  );

  const fetchSessionById = useCallback(
    async (id: string): Promise<SessionDetail> => {
      setLoading(true);
      setError(null);
      try {
        return await getSessionById(id);
      } catch (error) {
        setError(getApiErrorMessage(error, 'Erro ao buscar sessão'));
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    sessions,
    loading,
    error,
    pagination,
    fetchSessions,
    addSession,
    fetchSessionById,
  };
};
