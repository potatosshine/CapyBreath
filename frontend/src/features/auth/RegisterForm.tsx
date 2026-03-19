import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { getProfile } from '../../api/userApi';
import { useAuthContext } from './AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';
import { migrateAnonymousSessions } from '../../utils/localSessionStorage';

const RegisterForm = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, showToast } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({
        username,
        email,
        password,
        full_name: fullName || undefined,
      });

      const user = await getProfile();
      setUser(user);

      const { migratedCount, failedCount } = await migrateAnonymousSessions();

      if (migratedCount > 0) {
        showToast(
          `Conta criada e ${migratedCount} sessão(ões) local(is) migrada(s)!`,
          'success'
        );
      } else if (!failedCount) {
        showToast('Conta criada com sucesso!', 'success');
      }

      if (failedCount > 0) {
        showToast(
          `${failedCount} sessão(ões) local(is) não puderam ser migradas agora.`,
          'info'
        );
      }

      navigate('/');
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Erro ao registrar. Verifique os dados e tente novamente.'
      );
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-8 bg-white rounded-xl shadow-md flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <input
        type="text"
        placeholder="Nome completo (opcional)"
        value={fullName}
        onChange={e => setFullName(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="Nome de usuário"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="border rounded px-3 py-2"
        required
        autoFocus
      />
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
        required
      />
      <button
        type="submit"
        className="bg-capy-primary text-white font-bold py-2 rounded hover:bg-capy-primary/90 transition"
        disabled={loading}
      >
        {loading ? 'Criando conta...' : 'Criar Conta'}
      </button>
    </form>
  );
};

export default RegisterForm;
