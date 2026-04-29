import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { getProfile } from '../../api/userApi';
import Button from '../../components/ui/Button';
import InputField from '../../components/ui/InputField';
import Alert from '../../components/ui/Alert';
import { useAuthContext } from './AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';
import { migrateAnonymousSessions } from '../../utils/localSessionStorage';
import AuthFormCard from './AuthFormCard';

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
    <AuthFormCard
      title="Criar Conta"
      subtitle="Cadastre-se para salvar seu histórico e acompanhar sua evolução."
      footerText="Já possui conta?"
      footerLinkLabel="Fazer login"
      footerLinkTo="/login"
    >
      {error && <Alert variant="error">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Nome completo (opcional)"
          type="text"
          placeholder="Seu nome completo"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
        />
        <InputField
          label="Nome de usuário"
          type="text"
          placeholder="username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoFocus
        />
        <InputField
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Senha"
          type="password"
          placeholder="Crie uma senha"
          helperText="Use no mínimo 8 caracteres para maior segurança."
          value={password}
          onChange={e => setPassword(e.target.value)}
          minLength={8}
          required
        />

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </form>
    </AuthFormCard>
  );
};

export default RegisterForm;
