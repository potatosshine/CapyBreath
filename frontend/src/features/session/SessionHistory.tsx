import React, { useEffect, useState } from 'react';
import { getSessions } from '../../api/sessionApi';
import type { Session } from '../../types/session.types';

const SessionHistory = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSessions() {
      setLoading(true);
      try {
        const data = await getSessions();
        setSessions(data);
      } catch (err) {
        // erro silencioso
      } finally {
        setLoading(false);
      }
    }
    fetchSessions();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8">
      <h1 className="text-2xl font-bold mb-4">Histórico de Sessões</h1>
      {loading ? (
        <div>Carregando sessões...</div>
      ) : sessions.length === 0 ? (
        <div>Nenhuma sessão encontrada.</div>
      ) : (
        <ul className="divide-y">
          {sessions.map(s => (
            <li
              key={s.id}
              className="py-3 flex flex-col md:flex-row md:items-center md:gap-4"
            >
              <span className="font-mono text-xs text-gray-500">
                {new Date(s.start_time).toLocaleString('pt-BR')}
              </span>
              <span className="ml-2">
                Retenção: <b>{s.retention_time}s</b>
              </span>
              <span className="ml-2 text-xs text-gray-400">ID: {s.id}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionHistory;
