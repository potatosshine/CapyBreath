import { useState } from 'react';
import { updateProfile } from '../../api/userApi';
import { useAuthContext } from '../auth/AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';
import SectionCard from '../../components/ui/SectionCard';

const EditProfileForm = () => {
  const { user, setUser, showToast } = useAuthContext();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <SectionCard>Usuário não autenticado.</SectionCard>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateProfile({
        full_name: fullName.trim() ? fullName.trim() : null,
        avatar_url: avatarUrl.trim() ? avatarUrl.trim() : null,
      });
      setUser(updated);
      setSuccess('Perfil atualizado com sucesso!');
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (error) {
      const message = getApiErrorMessage(error, 'Erro ao atualizar perfil.');
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard className="shadow-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Editar Perfil</h2>
        {success && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{success}</div>}
        {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <input
          type="text"
          placeholder="Nome completo"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
        />
        <input
          type="url"
          placeholder="URL do avatar"
          value={avatarUrl}
          onChange={e => setAvatarUrl(e.target.value)}
          className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
        />
        <button
          type="submit"
          className="rounded-xl bg-capy-primary py-3 font-bold text-white transition hover:bg-capy-primary/90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
    </SectionCard>
  );
};

export default EditProfileForm;
