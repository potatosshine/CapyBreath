import httpClient from './httpClient';
import type { User } from '../types/user.types';

export const getProfile = async (): Promise<User> => {
  const res = await httpClient.get('/api/v1/users/me');
  return res.data;
};

export const updateProfile = async (data: Partial<User>): Promise<User> => {
  const res = await httpClient.put('/api/v1/users/me', data);
  return res.data;
};
