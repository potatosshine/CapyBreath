import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
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
import PageContainer from '../components/ui/PageContainer';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: string;
};

const MetricCard = ({ label, value, helper }: MetricCardProps) => (
  <Card compact>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold">{value}</p>
    {helper && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
  </Card>
);

type SectionCardProps = {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

const SectionCard = ({ title, actions, children }: SectionCardProps) => (
  <Card compact>
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {actions}
    </div>
    {children}
  </Card>
);

const EmptyState = ({ text }: { text: string }) => (
  <p className="text-gray-600">{text}</p>
);

const DashboardPage = () => {
  const { user } = useAuthContext();
  const [achievements, setAchievements] = useState<UnlockedAchievement[]>([]);
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [summary, setSummary] = useState<SessionsSummary | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [progress, setProgress] = useState<ProgressResponse | null>(null);
  const [mood, setMood] = useState<MoodCorrelationResponse | null>(null);
  const [personalBest, setPersonalBest] = useState<SessionDetail | null>(null);
  const [recentPersonalBests, setRecentPersonalBests] = useState<
    SessionDetail[]
  >([]);
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
    <PageContainer className="max-w-6xl mt-2 space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold">
          Bem-vindo, {user.full_name || user.username}!
        </h1>
        <p className="text-gray-600">
          Acompanhe seu streak, retenção, humor e evolução recente.
        </p>
      </div>

      {loading ? (
        <Card compact>
          <p>Carregando dashboard...</p>
        </Card>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : (
        <>
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Streak atual"
              value={summary?.current_streak ?? 0}
              helper={`Melhor streak: ${summary?.longest_streak ?? 0}`}
            />
            <MetricCard
              label="Melhor retenção"
              value={`${summary?.best_retention_time ?? userStats?.best_retention_time ?? 0}s`}
              helper={`Média: ${Math.round(summary?.average_retention_time ?? 0)}s`}
            />
            <MetricCard
              label="Humor médio"
              value={mood ? mood.average_improvement.toFixed(1) : '—'}
              helper={`Antes ${mood ? mood.average_mood_before.toFixed(1) : '—'} / Depois ${mood ? mood.average_mood_after.toFixed(1) : '—'}`}
            />
            <MetricCard
              label="Tendência (30 dias)"
              value={trendLabel ?? '—'}
              helper={`${progress?.data_points.length ?? 0} ponto(s) observados`}
            />
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <SectionCard
              title="Resumo analítico"
              actions={
                <Link
                  to="/session"
                  className="text-sm text-capy-primary hover:underline"
                >
                  Ver histórico
                </Link>
              }
            >
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded border p-3">
                  <p className="text-gray-500">Sessões totais</p>
                  <p className="text-xl font-bold">
                    {summary?.total_sessions ?? 0}
                  </p>
                </div>
                <div className="rounded border p-3">
                  <p className="text-gray-500">Respirações totais</p>
                  <p className="text-xl font-bold">
                    {summary?.total_breaths ?? 0}
                  </p>
                </div>
                <div className="rounded border p-3">
                  <p className="text-gray-500">Últimos 7 dias</p>
                  <p className="text-xl font-bold">
                    {summary?.last_7_days.sessions_count ?? 0}
                  </p>
                </div>
                <div className="rounded border p-3">
                  <p className="text-gray-500">Últimos 30 dias</p>
                  <p className="text-xl font-bold">
                    {summary?.last_30_days.sessions_count ?? 0}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Personal Best">
              {personalBest ? (
                <div className="space-y-2">
                  <p className="text-3xl font-bold">
                    {personalBest.retention_time}s
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(personalBest.session_date).toLocaleString(
                      'pt-BR'
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    Técnica: {personalBest.technique_variant}
                  </p>
                </div>
              ) : (
                <EmptyState text="Nenhum personal best disponível ainda." />
              )}
            </SectionCard>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <SectionCard title="Conquistas recentes">
              {achievements.length === 0 ? (
                <EmptyState text="Nenhuma conquista encontrada." />
              ) : (
                <ul className="flex flex-wrap gap-2">
                  {achievements.slice(0, 5).map(achievement => (
                    <li
                      key={achievement.id}
                      className="rounded bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                    >
                      {achievement.name}
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>

            <SectionCard title="Sessões recentes">
              {sessions.length === 0 ? (
                <EmptyState text="Nenhuma sessão encontrada." />
              ) : (
                <ul className="divide-y">
                  {sessions.map(session => (
                    <li key={session.id} className="py-2">
                      <span className="font-mono text-xs text-gray-500">
                        {new Date(session.session_date).toLocaleString('pt-BR')}
                      </span>
                      <span className="ml-2">
                        Retenção: <b>{session.retention_time}s</b>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </section>

          <SectionCard title="Progressão recente">
            {progress?.data_points.length ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {progress.data_points.slice(-4).map(point => (
                  <div key={point.date} className="rounded border p-3">
                    <p className="text-sm text-gray-500">{point.date}</p>
                    <p className="text-lg font-bold">
                      {point.best_retention_time}s
                    </p>
                    <p className="text-sm text-gray-600">
                      {point.sessions_count} sessão(ões)
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Sem dados suficientes para progressão." />
            )}
          </SectionCard>

          <SectionCard title="Personals bests recentes">
            {recentPersonalBests.length ? (
              <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {recentPersonalBests.map(item => (
                  <li key={item.id} className="rounded border p-3">
                    <p className="font-semibold">{item.retention_time}s</p>
                    <p className="text-sm text-gray-500">
                      {new Date(item.session_date).toLocaleString('pt-BR')}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState text="Nenhum personal best recente." />
            )}
          </SectionCard>
        </>
      )}
    </PageContainer>
  );
};

export default DashboardPage;
