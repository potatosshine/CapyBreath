import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSessions } from '../../api/sessionApi';
import type { SessionListItem } from '../../types/session.types';
import { getApiErrorMessage } from '../../api/apiError';
import PageShell from '../../components/ui/PageShell';
import SectionCard from '../../components/ui/SectionCard';

const SessionHistory = () => {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      setError(null);
      try {
        const data = await getSessions({ page, size: 10 });
        setSessions(data.items);
        setPages(data.pages);
      } catch (error) {
        setSessions([]);
        setError(getApiErrorMessage(error, 'Erro ao carregar histórico de sessões.'));
      } finally {
        setLoading(false);
      }
    }
    void fetchSessions();
  }, [page]);

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-5">
        <SectionCard>
          <h1 className="text-3xl font-bold mb-1">Histórico de Sessões</h1>
          <p className="text-capy-dark/70">Acompanhe suas práticas mais recentes em uma linha do tempo unificada.</p>
        </SectionCard>

        {loading ? (
          <SectionCard>Carregando sessões...</SectionCard>
        ) : error ? (
          <SectionCard className="border-red-200 bg-red-50 text-red-700">{error}</SectionCard>
        ) : sessions.length === 0 ? (
          <SectionCard>Nenhuma sessão encontrada.</SectionCard>
        ) : (
          <SectionCard className="p-0 overflow-hidden">
            <ul className="divide-y divide-capy-secondary/25">
              {sessions.map(s => (
                <li key={s.id}>
                  <Link
                    to={`/session/${s.id}`}
                    className="flex flex-col gap-1 px-4 py-4 transition hover:bg-capy-light/40 md:flex-row md:items-center md:gap-4"
                  >
                    <span className="font-mono text-xs text-gray-500">{new Date(s.session_date).toLocaleString('pt-BR')}</span>
                    <span className="font-medium">Retenção: <b>{s.retention_time}s</b></span>
                    <span className="text-xs text-gray-500">Técnica: {s.technique_variant}</span>
                    {s.is_personal_best && (
                      <span className="w-fit rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">🏆 Personal Best</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-capy-secondary/25 bg-white/80 px-4 py-3">
              <button
                type="button"
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-capy-secondary/40 px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">Página {page} de {pages}</span>
              <button
                type="button"
                onClick={() => setPage(prev => Math.min(pages, prev + 1))}
                disabled={page >= pages}
                className="rounded-lg border border-capy-secondary/40 px-4 py-2 text-sm font-medium disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </SectionCard>
        )}
      </main>
    </PageShell>
  );
};

export default SessionHistory;
