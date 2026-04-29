import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSessions } from '../../api/sessionApi';
import type { SessionListItem } from '../../types/session.types';
import { getApiErrorMessage } from '../../api/apiError';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import PageContainer from '../../components/ui/PageContainer';

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
    <PageContainer className="max-w-2xl mt-2">
      <h1 className="text-2xl font-bold mb-4">Histórico de Sessões</h1>
      {loading ? (
        <div>Carregando sessões...</div>
      ) : error ? (
        <Alert variant="error">{error}</Alert>
      ) : sessions.length === 0 ? (
        <div>Nenhuma sessão encontrada.</div>
      ) : (
        <>
          <ul className="divide-y">
            {sessions.map(s => (
              <li key={s.id}>
                <Link
                  to={`/session/${s.id}`}
                  className="flex min-h-[44px] flex-col rounded px-2 py-3 transition hover:bg-gray-50 md:flex-row md:items-center md:gap-4"
                >
                  <span className="font-mono text-xs text-gray-500">
                    {new Date(s.session_date).toLocaleString('pt-BR')}
                  </span>
                  <span className="md:ml-2">
                    Retenção: <b>{s.retention_time}s</b>
                  </span>
                  <span className="md:ml-2 text-xs text-gray-500">
                    Técnica: {s.technique_variant}
                  </span>
                  {s.is_personal_best && (
                    <span className="md:ml-2 text-xs font-semibold text-amber-600">
                      🏆 Personal Best
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
            >
              Anterior
            </Button>
            <span className="text-sm">Página {page} de {pages}</span>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setPage(prev => Math.min(pages, prev + 1))}
              disabled={page >= pages}
            >
              Próxima
            </Button>
          </div>
        </>
      )}
    </PageContainer>
  );
};

export default SessionHistory;
