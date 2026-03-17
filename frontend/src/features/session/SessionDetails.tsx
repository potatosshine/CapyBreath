
import type { SessionDetail } from '../../types/session.types';

interface SessionDetailsProps {
  session?: SessionDetail | null;
}

const SessionDetails = ({ session }: SessionDetailsProps) => {
  if (!session) {
    return (
      <div className="max-w-2xl mx-auto mt-8 rounded-xl border bg-white p-6 text-gray-600">
        Selecione uma sessao para ver os detalhes.
      </div>
    );
  }

  const moodImprovement =
    session.mood_before !== null && session.mood_after !== null
      ? session.mood_after - session.mood_before
      : null;

  return (
    <section className="max-w-2xl mx-auto mt-8 rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Detalhes da Sessao</h2>
          <p className="text-sm text-gray-500">
            {new Date(session.session_date).toLocaleString('pt-BR')}
          </p>
        </div>
        {session.is_personal_best && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
            Personal Best
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Tecnica</p>
          <p className="text-lg font-semibold capitalize">
            {session.technique_variant}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Respiracoes</p>
          <p className="text-lg font-semibold">{session.breaths_count}</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Retencao</p>
          <p className="text-lg font-semibold">{session.retention_time}s</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Recuperacao</p>
          <p className="text-lg font-semibold">{session.recovery_time}s</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Duracao total</p>
          <p className="text-lg font-semibold">{session.duration_seconds}s</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-gray-500">Evolucao do humor</p>
          <p className="text-lg font-semibold">
            {moodImprovement === null
              ? 'Nao informado'
              : `${moodImprovement > 0 ? '+' : ''}${moodImprovement}`}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border p-4">
        <p className="text-sm text-gray-500">Notas</p>
        <p className="mt-1 text-gray-800">
          {session.notes?.trim() || 'Nenhuma anotacao registrada.'}
        </p>
      </div>
    </section>
  );
};

export default SessionDetails;
