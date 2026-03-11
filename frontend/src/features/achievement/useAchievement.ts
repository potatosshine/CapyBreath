import { useCallback, useState } from 'react';
import { getAchievements, unlockAchievement } from '../../api/achievementApi';
import type { Achievement } from '../../types/achievement.types';

export const useAchievement = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAchievements();
      setAchievements(data);
    } catch (err) {
      setError('Erro ao buscar conquistas');
    } finally {
      setLoading(false);
    }
  }, []);

  const unlock = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await unlockAchievement(id);
      setAchievements(prev => prev.map(a => (a.id === id ? updated : a)));
      return updated;
    } catch (err) {
      setError('Erro ao desbloquear conquista');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    achievements,
    loading,
    error,
    fetchAchievements,
    unlock,
  };
};
