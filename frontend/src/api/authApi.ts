import httpClient from './httpClient';

export const login = async (data: { email: string; password: string }) => {
  const response = await httpClient.post('/api/v1/auth/login', data);
  const { access, refresh } = response.data;
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
  return response;
};

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await httpClient.post('/api/v1/auth/register', data);
  // Se o backend já retorna tokens no registro, salve-os
  if (response.data.access && response.data.refresh) {
    localStorage.setItem('accessToken', response.data.access);
    localStorage.setItem('refreshToken', response.data.refresh);
  }
  return response;
};

export const refreshToken = (refresh: string) =>
  httpClient.post('/api/v1/auth/refresh', { refresh });

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};
