import { useAuthContext } from '../auth/AuthProvider';

const UserProfile = () => {
  const { user, logout } = useAuthContext();

  if (!user) return <div>Usuário não autenticado.</div>;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8 mt-8 flex flex-col gap-4">
      <h2 className="text-2xl font-bold mb-2">Perfil</h2>
      <div>
        <strong>Nome:</strong> {user.full_name || 'Não informado'}
      </div>
      <div>
        <strong>Usuário:</strong> @{user.username}
      </div>
      <div>
        <strong>E-mail:</strong> {user.email}
      </div>
      <div>
        <strong>ID:</strong> {user.id}
      </div>
      <button
        onClick={() => {
          void logout();
        }}
        className="mt-6 bg-red-600 text-white font-bold py-2 rounded hover:bg-red-700 transition"
      >
        Sair
      </button>
    </div>
  );
};

export default UserProfile;
