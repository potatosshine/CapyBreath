import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SessionDetails from '../features/session/SessionDetails';
import { deleteSession, getSessionById, updateSession } from '../api/sessionApi';
import type { SessionDetail, SessionUpdateRequest } from '../types/session.types';
import { getApiErrorMessage } from '../api/apiError';
import { useAuthContext } from '../features/auth/AuthProvider';
import PageShell from '../components/ui/PageShell';
import SectionCard from '../components/ui/SectionCard';

const moodOptions = Array.from({ length: 10 }, (_, index) => index + 1);

const SessionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useAuthContext();
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [notes, setNotes] = useState('');
  const [moodBefore, setMoodBefore] = useState('');
  const [moodAfter, setMoodAfter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Sessão inválida.');
      setLoading(false);
      return;
    }

    const fetchSession = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSessionById(id);
        setSession(data);
        setNotes(data.notes ?? '');
        setMoodBefore(data.mood_before?.toString() ?? '');
        setMoodAfter(data.mood_after?.toString() ?? '');
      } catch (error) {
        setError(getApiErrorMessage(error, 'Erro ao carregar sessão.'));
      } finally {
        setLoading(false);
      }
    };

    void fetchSession();
  }, [id]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!id) return;

    setSaving(true);
    setError(null);

    const payload: SessionUpdateRequest = {
      notes: notes.trim() ? notes.trim() : null,
      mood_before: moodBefore ? Number(moodBefore) : null,
      mood_after: moodAfter ? Number(moodAfter) : null,
    };

    try {
      const updated = await updateSession(id, payload);
      setSession(prev =>
        prev
          ? {
              ...prev,
              ...updated,
              is_personal_best: prev.is_personal_best,
            }
          : null
      );
      showToast('Sessão atualizada com sucesso!', 'success');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao atualizar sessão.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !session) return;

    const confirmed = window.confirm('Tem certeza que deseja excluir esta sessão do seu histórico?');

    if (!confirmed) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteSession(id);
      showToast('Sessão excluída com sucesso.', 'success');
      navigate('/session');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao excluir sessão.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageShell>
      <main className="max-w-4xl mx-auto p-6 md:p-10 space-y-5">
        <SectionCard className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-gray-500">Histórico de Sessões</p>
              <h1 className="text-2xl font-bold">Detalhe da sessão</h1>
            </div>
            <Link to="/session" className="rounded-xl border border-capy-secondary/40 px-4 py-2 text-sm font-medium hover:bg-capy-light/50">
              ← Voltar ao histórico
            </Link>
          </div>
        </SectionCard>

        {loading ? (
          <SectionCard>Carregando sessão...</SectionCard>
        ) : error && !session ? (
          <SectionCard className="border-red-200 bg-red-50 text-red-700">{error}</SectionCard>
        ) : (
          <>
            <SessionDetails session={session} />

            <SectionCard className="max-w-3xl mx-auto shadow-lg">
              <form onSubmit={handleSave}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold">Editar sessão</h2>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? 'Excluindo...' : 'Excluir sessão'}
                  </button>
                </div>

                {error && session && (
                  <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
                )}

                <div className="space-y-4">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-gray-700">Notas</span>
                    <textarea
                      value={notes}
                      onChange={event => setNotes(event.target.value)}
                      rows={4}
                      maxLength={500}
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
                      placeholder="Adicione observações sobre esta prática"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700">Humor antes</span>
                      <select
                        value={moodBefore}
                        onChange={event => setMoodBefore(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
                      >
                        <option value="">Não informado</option>
                        {moodOptions.map(option => (
                          <option key={`before-${option}`} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-sm font-medium text-gray-700">Humor depois</span>
                      <select
                        value={moodAfter}
                        onChange={event => setMoodAfter(event.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
                      >
                        <option value="">Não informado</option>
                        {moodOptions.map(option => (
                          <option key={`after-${option}`} value={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving || deleting}
                    className="rounded-xl bg-capy-primary px-5 py-3 font-semibold text-white hover:bg-capy-primary/90 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </div>
              </form>
            </SectionCard>
          </>
        )}
      </main>
    </PageShell>
  );
};

export default SessionDetailPage;
