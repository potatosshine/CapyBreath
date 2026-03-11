import httpClient from './httpClient';
import type { Achievement } from '../types/achievement.types';

export const getAchievements = async (): Promise<Achievement[]> => {
  const res = await httpClient.get('/api/v1/achievements');
  return res.data;
};

export const unlockAchievement = async (id: string): Promise<Achievement> => {
  const res = await httpClient.post(`/api/v1/achievements/${id}/unlock`);
  return res.data;
};
