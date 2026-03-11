import { useCallback, useState } from 'react';
import { getProfile, updateProfile } from '../../api/userApi';
import type { User } from '../../types/user.types';

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
    } catch (err) {
      setError('Erro ao buscar usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (data: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await updateProfile(data);
      setUser(updated);
      return updated;
    } catch (err) {
      setError('Erro ao atualizar usuário');
      throw err;
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
