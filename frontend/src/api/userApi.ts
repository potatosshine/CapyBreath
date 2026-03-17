import httpClient from './httpClient';
import type { User, UserUpdateRequest } from '../types/user.types';

export const getProfile = async (): Promise<User> => {
  const res = await httpClient.get('/api/v1/users/me');
  return res.data;
};

export const updateProfile = async (data: UserUpdateRequest): Promise<User> => {
  const res = await httpClient.patch('/api/v1/users/me', data);
  return res.data;
};
