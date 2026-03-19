import httpClient from './httpClient';
import type {
  PaginatedSessionsResponse,
  SessionCreateRequest,
  SessionDetail,
  SessionListItem,
  SessionQueryParams,
  SessionUpdateRequest,
} from '../types/session.types';

export const getSessions = async (
  params: SessionQueryParams = {}
): Promise<PaginatedSessionsResponse> => {
  const res = await httpClient.get<PaginatedSessionsResponse>('/api/v1/sessions', {
    params: {
      page: params.page ?? 1,
      size: params.size ?? 20,
      order_by: params.order_by ?? 'session_date',
      order_dir: params.order_dir ?? 'desc',
    },
  });
  return res.data;
};

export const getSessionItems = async (
  params: SessionQueryParams = {}
): Promise<SessionListItem[]> => {
  const data = await getSessions(params);
  return data.items;
};

export const createSession = async (
  data: SessionCreateRequest
): Promise<SessionDetail> => {
  const res = await httpClient.post<SessionDetail>('/api/v1/sessions', data);
  return res.data;
};

export const getSessionById = async (id: string): Promise<SessionDetail> => {
  const res = await httpClient.get<SessionDetail>(`/api/v1/sessions/${id}`);
  return res.data;
};

export const updateSession = async (
  id: string,
  data: SessionUpdateRequest
): Promise<SessionDetail> => {
  const res = await httpClient.patch<SessionDetail>(`/api/v1/sessions/${id}`, data);
  return res.data;
};

export const deleteSession = async (id: string): Promise<void> => {
  await httpClient.delete(`/api/v1/sessions/${id}`);
};
