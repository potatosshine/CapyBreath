import { useCallback, useState } from 'react';
import { getProfile, updateProfile } from '../../api/userApi';
import type { User, UserUpdateRequest } from '../../types/user.types';
import { getApiErrorMessage } from '../../api/apiError';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setUser(data);
    } catch (error) {
      setError(getApiErrorMessage(error, 'Erro ao buscar usuário'));
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: UserUpdateRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setUser(updated);
      return updated;
    } catch (error) {
      setError(getApiErrorMessage(error, 'Erro ao atualizar usuário'));
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchUser,
    update,
  };
};
