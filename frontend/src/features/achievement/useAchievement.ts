import { useCallback, useState } from 'react';
import {
  checkAchievements,
  getAchievements,
  getMyAchievements,
} from '../../api/achievementApi';
import { getApiErrorMessage } from '../../api/apiError';
import type {
  Achievement,
  CheckAchievementsResponse,
  UserAchievementsResponse,
} from '../../types/achievement.types';

export const useAchievement = () => {
  const [catalog, setCatalog] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] =
    useState<UserAchievementsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAchievements();
      setCatalog(data);
      return data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Erro ao buscar catálogo de conquistas'
      );
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyAchievements();
      setUserAchievements(data);
      return data;
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Erro ao buscar suas conquistas'
      );
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAndUnlock =
    useCallback(async (): Promise<CheckAchievementsResponse> => {
      setLoading(true);
      setError(null);
      try {
        const result = await checkAchievements();
        const mine = await getMyAchievements();
        setUserAchievements(mine);
        return result;
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          'Erro ao verificar conquistas'
        );
        setError(message);
        throw new Error(message);
      } finally {
        setLoading(false);
      }
    }, []);

  return {
    catalog,
    userAchievements,
    loading,
    error,
    fetchCatalog,
    fetchMyAchievements,
    checkAndUnlock,
  };
};
