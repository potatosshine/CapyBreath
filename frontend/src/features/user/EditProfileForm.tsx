import React, { useState } from 'react';
import { updateProfile } from '../../api/userApi';
import { useAuthContext } from '../auth/AuthProvider';

const EditProfileForm = () => {
  const { user, setUser, showToast } = useAuthContext();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
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
      const updated = await updateProfile({ name, email });
      setUser(updated);
      setSuccess('Perfil atualizado com sucesso!');
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch (err) {
      setError('Erro ao atualizar perfil.');
      showToast('Erro ao atualizar perfil.', 'error');
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
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
        required
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
