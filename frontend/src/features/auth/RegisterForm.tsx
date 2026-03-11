import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import { useAuthContext } from './AuthProvider';

const RegisterForm = () => {
  const [name, setName] = useState('');
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
      await register({ name, email, password });
      // Buscar perfil do usuário após registro
      const res = await fetch('/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      if (!res.ok) throw new Error('Erro ao buscar usuário');
      const user = await res.json();
      setUser(user);
      showToast('Conta criada com sucesso!', 'success');
      navigate('/');
    } catch (err: any) {
      setError('Erro ao registrar. Tente outro e-mail.');
      showToast('Erro ao registrar. Tente outro e-mail.', 'error');
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
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
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
