import { useEffect, useState } from 'react';
import { useAuthContext } from '../auth/AuthProvider';
import { getMyFullProfile } from '../../api/userApi';
import type { UserProfile as UserProfileData } from '../../types/user.types';
import { getApiErrorMessage } from '../../api/apiError';
import SectionCard from '../../components/ui/SectionCard';

const UserProfile = () => {
  const { user, logout } = useAuthContext();
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        setProfile(await getMyFullProfile());
      } catch (error) {
        setError(getApiErrorMessage(error, 'Erro ao carregar perfil completo.'));
      } finally {
        setLoading(false);
      }
    };

    void fetchProfile();
  }, [user]);

  if (!user) return <SectionCard>Usuário não autenticado.</SectionCard>;

  return (
    <SectionCard className="space-y-6 shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Perfil</h2>
          <div><strong>Nome:</strong> {user.full_name || 'Não informado'}</div>
          <div><strong>Usuário:</strong> @{user.username}</div>
          <div><strong>E-mail:</strong> {user.email}</div>
          <div><strong>ID:</strong> {user.id}</div>
        </div>
        <button
          onClick={() => {
            void logout();
          }}
          className="mt-2 rounded-xl bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
        >
          Sair
        </button>
      </div>

      {loading ? (
        <div>Carregando estatísticas do perfil...</div>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">{error}</div>
      ) : profile ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-capy-secondary/30 p-4">
            <p className="text-sm text-gray-500">Sessões totais</p>
            <p className="text-2xl font-bold">{profile.total_sessions}</p>
          </div>
          <div className="rounded-xl border border-capy-secondary/30 p-4">
            <p className="text-sm text-gray-500">Melhor retenção</p>
            <p className="text-2xl font-bold">{profile.best_retention_time}s</p>
          </div>
          <div className="rounded-xl border border-capy-secondary/30 p-4">
            <p className="text-sm text-gray-500">Streak atual</p>
            <p className="text-2xl font-bold">{profile.current_streak}</p>
          </div>
          <div className="rounded-xl border border-capy-secondary/30 p-4">
            <p className="text-sm text-gray-500">Última sessão</p>
            <p className="text-sm font-semibold">
              {profile.last_session_date ? new Date(profile.last_session_date).toLocaleString('pt-BR') : 'Sem sessões'}
            </p>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
};

export default UserProfile;
