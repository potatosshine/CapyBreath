import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthProvider';
import { getMyAchievements } from '../api/achievementApi';
import {
  getMoodCorrelation,
  getPersonalBest,
  getRecentPersonalBests,
  getSessionProgress,
  getSessions,
  getSessionsSummary,
} from '../api/sessionApi';
import { getMyStats } from '../api/userApi';
import type { UnlockedAchievement } from '../types/achievement.types';
import type {
  MoodCorrelationResponse,
  ProgressResponse,
  SessionDetail,
  SessionListItem,
  SessionsSummary,
} from '../types/session.types';
import type { UserStats } from '../types/user.types';
import { getApiErrorMessage } from '../api/apiError';
import PageShell from '../components/ui/PageShell';
import SectionCard from '../components/ui/SectionCard';

const DashboardPage = () => {
  const { user } = useAuthContext();
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([]);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [summary, setSummary] = useState<SessionsSummary | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [mood, setMood] = useState<MoodCorrelationResponse | null>(null);
  const [personalBest, setPersonalBest] = useState<SessionDetail | null>(null);
  const [recentPersonalBests, setRecentPersonalBests] = useState<SessionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [ach, sess, summaryData, statsData, progressData, moodData] =
          await Promise.all([
            getMyAchievements(),
            getSessions({ page: 1, size: 5 }),
            getSessionsSummary(),
            getMyStats(),
            getSessionProgress(30),
            getMoodCorrelation().catch(() => null),
          ]);

        setAchievements(ach.unlocked);
        setSessions(sess.items);
        setSummary(summaryData);
        setUserStats(statsData);
        setProgress(progressData);
        setMood(moodData);

        try {
          setPersonalBest(await getPersonalBest());
        } catch {
          setPersonalBest(null);
        }

        try {
          setRecentPersonalBests(await getRecentPersonalBests(30));
        } catch {
          setRecentPersonalBests([]);
        }
      } catch (error) {
        setError(getApiErrorMessage(error, 'Erro ao carregar dashboard.'));
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (!user) return null;

  const trendLabel =
    progress?.trend === 'improving'
      ? 'Em evolução'
      : progress?.trend === 'declining'
        ? 'Em queda'
        : 'Estável';

  return (
    <PageShell>
      <main className="max-w-6xl mx-auto p-6 md:p-10 space-y-6">
        <SectionCard>
          <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.full_name || user.username}!</h1>
          <p className="text-capy-dark/70">
            Acompanhe seu streak, retenção, humor e evolução recente.
          </p>
        </SectionCard>

        {loading ? (
          <SectionCard>Carregando dashboard...</SectionCard>
        ) : error ? (
          <SectionCard className="border-red-200 bg-red-50 text-red-700">{error}</SectionCard>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SectionCard className="p-5">
                <p className="text-sm text-gray-500">Streak atual</p>
                <p className="text-3xl font-bold">{summary?.current_streak ?? 0}</p>
                <p className="text-sm text-gray-500 mt-1">Melhor streak: {summary?.longest_streak ?? 0}</p>
              </SectionCard>
              <SectionCard className="p-5">
                <p className="text-sm text-gray-500">Melhor retenção</p>
                <p className="text-3xl font-bold">
                  {summary?.best_retention_time ?? userStats?.best_retention_time ?? 0}s
                </p>
                <p className="text-sm text-gray-500 mt-1">Média: {Math.round(summary?.average_retention_time ?? 0)}s</p>
              </SectionCard>
              <SectionCard className="p-5">
                <p className="text-sm text-gray-500">Humor médio</p>
                <p className="text-3xl font-bold">{mood ? mood.average_improvement.toFixed(1) : '—'}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Antes {mood ? mood.average_mood_before.toFixed(1) : '—'} / Depois {mood ? mood.average_mood_after.toFixed(1) : '—'}
                </p>
              </SectionCard>
              <SectionCard className="p-5">
                <p className="text-sm text-gray-500">Tendência (30 dias)</p>
                <p className="text-3xl font-bold">{trendLabel ?? '—'}</p>
                <p className="text-sm text-gray-500 mt-1">{progress?.data_points.length ?? 0} ponto(s) observados</p>
              </SectionCard>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <SectionCard className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xl font-semibold">Resumo analítico</h2>
                  <Link to="/session" className="text-sm text-capy-primary hover:underline">Ver histórico</Link>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl border border-capy-secondary/30 p-3">
                    <p className="text-gray-500">Sessões totais</p>
                    <p className="text-xl font-bold">{summary?.total_sessions ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-capy-secondary/30 p-3">
                    <p className="text-gray-500">Respirações totais</p>
                    <p className="text-xl font-bold">{summary?.total_breaths ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-capy-secondary/30 p-3">
                    <p className="text-gray-500">Últimos 7 dias</p>
                    <p className="text-xl font-bold">{summary?.last_7_days.sessions_count ?? 0}</p>
                  </div>
                  <div className="rounded-xl border border-capy-secondary/30 p-3">
                    <p className="text-gray-500">Últimos 30 dias</p>
                    <p className="text-xl font-bold">{summary?.last_30_days.sessions_count ?? 0}</p>
                  </div>
                </div>
              </SectionCard>

              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold mb-3">Personal Best</h2>
                {personalBest ? (
                  <div className="space-y-2">
                    <p className="text-3xl font-bold">{personalBest.retention_time}s</p>
                    <p className="text-sm text-gray-500">{new Date(personalBest.session_date).toLocaleString('pt-BR')}</p>
                    <p className="text-sm text-gray-600">Técnica: {personalBest.technique_variant}</p>
                  </div>
                ) : (
                  <p className="text-gray-600">Nenhum personal best disponível ainda.</p>
                )}
              </SectionCard>
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold mb-3">Conquistas recentes</h2>
                {achievements.length === 0 ? (
                  <div>Nenhuma conquista encontrada.</div>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {achievements.slice(0, 5).map(achievement => (
                      <li key={achievement.id} className="rounded-full bg-capy-light px-3 py-1 text-sm font-medium text-capy-dark">
                        {achievement.name}
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>

              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold mb-3">Sessões recentes</h2>
                {sessions.length === 0 ? (
                  <div>Nenhuma sessão encontrada.</div>
                ) : (
                  <ul className="divide-y divide-capy-secondary/20">
                    {sessions.map(session => (
                      <li key={session.id} className="py-2">
                        <span className="font-mono text-xs text-gray-500">{new Date(session.session_date).toLocaleString('pt-BR')}</span>
                        <span className="ml-2">Retenção: <b>{session.retention_time}s</b></span>
                      </li>
                    ))}
                  </ul>
                )}
              </SectionCard>
            </section>

            {recentPersonalBests.length > 0 && (
              <SectionCard className="p-5">
                <h2 className="text-xl font-semibold mb-3">Novos recordes (30 dias)</h2>
                <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {recentPersonalBests.map(item => (
                    <li key={item.id} className="rounded-xl border border-capy-secondary/30 p-3">
                      <p className="font-bold">{item.retention_time}s</p>
                      <p className="text-sm text-gray-500">{new Date(item.session_date).toLocaleDateString('pt-BR')}</p>
                    </li>
                  ))}
                </ul>
              </SectionCard>
            )}
          </>
        )}
      </main>
    </PageShell>
  );
};

export default DashboardPage;
