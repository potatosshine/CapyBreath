import type { SessionDetail } from '../../types/session.types';
import SectionCard from '../../components/ui/SectionCard';

interface SessionDetailsProps {
  session?: SessionDetail | null;
}

const SessionDetails = ({ session }: SessionDetailsProps) => {
  if (!session) {
    return (
      <SectionCard className="max-w-3xl mx-auto text-gray-600">
        Selecione uma sessão para ver os detalhes.
      </SectionCard>
    );
  }

  const moodImprovement =
    session.mood_before !== null && session.mood_after !== null
      ? session.mood_after - session.mood_before
      : null;

  return (
    <SectionCard className="max-w-3xl mx-auto shadow-lg">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Detalhes da Sessão</h2>
          <p className="text-sm text-gray-500">{new Date(session.session_date).toLocaleString('pt-BR')}</p>
        </div>
        {session.is_personal_best && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Personal Best</span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Técnica</p>
          <p className="text-lg font-semibold capitalize">{session.technique_variant}</p>
        </div>
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Respirações</p>
          <p className="text-lg font-semibold">{session.breaths_count}</p>
        </div>
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Retenção</p>
          <p className="text-lg font-semibold">{session.retention_time}s</p>
        </div>
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Recuperação</p>
          <p className="text-lg font-semibold">{session.recovery_time}s</p>
        </div>
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Duração total</p>
          <p className="text-lg font-semibold">{session.duration_seconds}s</p>
        </div>
        <div className="rounded-xl border border-capy-secondary/30 p-4">
          <p className="text-sm text-gray-500">Evolução do humor</p>
          <p className="text-lg font-semibold">
            {moodImprovement === null ? 'Não informado' : `${moodImprovement > 0 ? '+' : ''}${moodImprovement}`}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-capy-secondary/30 p-4">
        <p className="text-sm text-gray-500">Notas</p>
        <p className="mt-1 text-gray-800">{session.notes?.trim() || 'Nenhuma anotação registrada.'}</p>
      </div>
    </SectionCard>
  );
};

export default SessionDetails;
