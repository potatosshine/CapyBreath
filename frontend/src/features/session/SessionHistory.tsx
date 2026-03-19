import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getSessions } from '../../api/sessionApi';
import type { SessionListItem } from '../../types/session.types';
import { getApiErrorMessage } from '../../api/apiError';

const SessionHistory = () => {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const data = await getSessions({ page, size: 10 });
        setSessions(data.items);
        setPages(data.pages);
      } catch (error) {
        console.error(getApiErrorMessage(error, 'Erro ao carregar dados.'));
      } finally {
        setLoading(false);
      }
    }
    void fetchSessions();
  }, [page]);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Histórico de Sessões</h1>
      {loading ? (
        <div>Carregando sessões...</div>
      ) : sessions.length === 0 ? (
        <div>Nenhuma sessão encontrada.</div>
      ) : (
        <>
          <ul className="divide-y">
            {sessions.map(s => (
              <li key={s.id}>
                <Link
                  to={`/session/${s.id}`}
                  className="py-3 flex flex-col md:flex-row md:items-center md:gap-4 hover:bg-gray-50 rounded px-2 transition"
                >
                <span className="font-mono text-xs text-gray-500">
                  {new Date(s.session_date).toLocaleString('pt-BR')}
                </span>
                <span className="ml-2">
                  Retenção: <b>{s.retention_time}s</b>
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  Técnica: {s.technique_variant}
                </span>
                {s.is_personal_best && (
                  <span className="ml-2 text-xs font-semibold text-amber-600">
                    🏆 Personal Best
                  </span>
                )}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page <= 1}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {page} de {pages}
            </span>
            <button
              type="button"
              onClick={() => setPage(prev => Math.min(pages, prev + 1))}
              disabled={page >= pages}
              className="px-3 py-1 rounded border disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SessionHistory;
