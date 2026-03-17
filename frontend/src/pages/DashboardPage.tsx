import { useEffect, useState } from 'react';
import { useAuthContext } from '../features/auth/AuthProvider';
import { getMyAchievements } from '../api/achievementApi';
import { getSessions } from '../api/sessionApi';
import type { UnlockedAchievement } from '../types/achievement.types';
import type { SessionListItem } from '../types/session.types';
import { getApiErrorMessage } from '../api/apiError';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([]);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [ach, sess] = await Promise.all([
          getMyAchievements(),
          getSessions({ page: 1, size: 3 }),
        ]);
        setAchievements(ach.unlocked);
        setSessions(sess.items);
      } catch (error) {
        console.error(getApiErrorMessage(error, 'Erro ao carregar dados.'));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <h1 className="text-3xl font-bold mb-4">
        Bem-vindo, {user.full_name || user.username}!
      </h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Conquistas Recentes</h2>
        {loading ? (
          <div>Carregando conquistas...</div>
        ) : achievements.length === 0 ? (
          <div>Nenhuma conquista encontrada.</div>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {achievements.slice(0, 3).map(a => (
              <li
                key={a.id}
                className="bg-green-100 px-3 py-1 rounded text-green-800 text-sm font-medium"
              >
                {a.name}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Sessões Recentes</h2>
        {loading ? (
          <div>Carregando sessões...</div>
        ) : sessions.length === 0 ? (
          <div>Nenhuma sessão encontrada.</div>
        ) : (
          <ul className="divide-y">
            {sessions.map(s => (
              <li key={s.id} className="py-2">
                <span className="font-mono text-xs text-gray-500">
                  {new Date(s.session_date).toLocaleString('pt-BR')}
                </span>
                <span className="ml-2">
                  Retenção: <b>{s.retention_time}s</b>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default DashboardPage;
