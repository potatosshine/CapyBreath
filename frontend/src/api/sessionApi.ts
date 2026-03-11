import httpClient from './httpClient';
import type { Session } from '../types/session.types';

export const getSessions = async (): Promise<Session[]> => {
  const res = await httpClient.get('/api/v1/sessions');
  return res.data;
};

export const createSession = async (
  data: Partial<Session>
): Promise<Session> => {
  const res = await httpClient.post('/api/v1/sessions', data);
  return res.data;
};

export const getSessionById = async (id: string): Promise<Session> => {
  const res = await httpClient.get(`/api/v1/sessions/${id}`);
  return res.data;
};
