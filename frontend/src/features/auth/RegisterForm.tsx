import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { getProfile } from '../../api/userApi';
import { useAuthContext } from './AuthProvider';
import { getApiErrorMessage } from '../../api/apiError';
import { migrateAnonymousSessions } from '../../utils/localSessionStorage';
import PageShell from '../../components/ui/PageShell';
import SectionCard from '../../components/ui/SectionCard';

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
    <PageShell variant="auth">
      <main className="mx-auto grid min-h-[calc(100vh-72px)] w-full max-w-5xl items-center gap-8 p-6 md:grid-cols-2 md:p-10">
        <SectionCard variant="glass">
          <p className="text-sm uppercase tracking-[0.2em] text-white/80">Crie sua conta</p>
          <h1 className="mt-2 text-4xl font-bold">Um visual, toda sua jornada</h1>
          <p className="mt-4 text-white/85">
            Comece no mesmo ambiente visual das telas de sessão, dashboard e histórico para
            tornar sua experiência mais fluida.
          </p>
        </SectionCard>

        <SectionCard className="bg-white text-capy-dark shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-center">Criar Conta</h2>
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}
            <input
              type="text"
              placeholder="Nome completo (opcional)"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
            />
            <input
              type="text"
              placeholder="Nome de usuário"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
              required
              autoFocus
            />
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus-visible:ring-2 focus-visible:ring-capy-primary/40"
              required
            />
            <button
              type="submit"
              className="rounded-xl bg-capy-primary py-3 font-bold text-white transition hover:bg-capy-primary/90 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>
        </SectionCard>
      </main>
    </PageShell>
  );
};

export default RegisterForm;
