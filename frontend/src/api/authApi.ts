import httpClient from './httpClient';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from '../types/auth.types';

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/api/v1/auth/login', data);
  const { access_token, refresh_token } = response.data.tokens;

  localStorage.setItem('accessToken', access_token);
  localStorage.setItem('refreshToken', refresh_token);

  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await httpClient.post<AuthResponse>('/api/v1/auth/register', data);
  const { access_token, refresh_token } = response.data.tokens;

  localStorage.setItem('accessToken', access_token);
  localStorage.setItem('refreshToken', refresh_token);

  return response.data;
};

export const refreshToken = (refreshTokenValue: string) =>
  httpClient.post('/api/v1/auth/refresh', { refresh_token: refreshTokenValue });

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
