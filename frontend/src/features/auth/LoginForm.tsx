import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/authApi';
import { getProfile } from '../../api/userApi';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import Alert from '../../components/ui/Alert';
import { useAuthContext } from './AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';
import { migrateAnonymousSessions } from '../../utils/localSessionStorage';
import AuthFormCard from './AuthFormCard';

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

      const { migratedCount, failedCount } = await migrateAnonymousSessions();

      if (migratedCount > 0) {
        showToast(
          `${migratedCount} sessão(ões) anônima(s) migrada(s) com sucesso!`,
          'success'
        );
      } else if (!failedCount) {
        showToast('Login realizado com sucesso!', 'success');
      }

      if (failedCount > 0) {
        showToast(
          `${failedCount} sessão(ões) local(is) não puderam ser migradas agora.`,
          'info'
        );
      }

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
    <AuthFormCard
      title="Entrar"
      subtitle="Acesse sua conta para continuar sua jornada de respiração."
      footerText="Ainda não tem conta?"
      footerLinkLabel="Criar conta"
      footerLinkTo="/register"
    >
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <InputField
          label="Senha"
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </AuthFormCard>
  );
};

export default LoginForm;
