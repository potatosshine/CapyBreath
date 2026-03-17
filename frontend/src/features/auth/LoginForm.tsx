import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { getProfile } from '../../api/userApi';
import { useAuthContext } from './AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';

const LoginForm = () => {
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
      await login({ email, password });
      const user = await getProfile();
      setUser(user);
      showToast('Login realizado com sucesso!', 'success');
      navigate('/');
    } catch (error) {
      const message = getApiErrorMessage(error, 'E-mail ou senha inválidos');
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
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      {error && <div className="text-red-600 text-sm text-center">{error}</div>}
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
        required
        autoFocus
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
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
};

export default LoginForm;
