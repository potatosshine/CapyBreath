import { useState } from 'react';
import { updateProfile } from '../../api/userApi';
import { useAuthContext } from '../auth/AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';

const EditProfileForm = () => {
  const { user, setUser, showToast } = useAuthContext();
  const [fullName, setFullName] = useState(user?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) return <div>Usuário não autenticado.</div>;

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
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-8 bg-white rounded-xl shadow-md flex flex-col gap-4 mt-8"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Perfil</h2>
      {success && (
        <div className="text-green-600 text-sm text-center">{success}</div>
      )}
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <input
        type="text"
        placeholder="Nome completo"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="url"
        placeholder="URL do avatar"
        value={avatarUrl}
        onChange={e => setAvatarUrl(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button
        type="submit"
        className="bg-capy-primary text-white font-bold py-2 rounded hover:bg-capy-primary/90 transition"
        disabled={loading}
      >
        {loading ? 'Salvando...' : 'Salvar Alterações'}
      </button>
    </form>
  );
};

export default EditProfileForm;
