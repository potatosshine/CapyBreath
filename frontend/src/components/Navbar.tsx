import { Link } from 'react-router-dom';
import { useAuthContext } from '../features/auth/AuthProvider';

const navClass =
  'w-full border-b border-capy-secondary/30 bg-white/80 px-4 py-3 text-capy-dark shadow-sm backdrop-blur md:px-6';
const linkClass = 'font-medium transition hover:text-capy-primary';

const Navbar = () => {
  const { user, logout } = useAuthContext();

  if (!user) {
    return (
      <nav className={navClass}>
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-capy-primary">
              CapyBreath
            </Link>
            <Link to="/community" className={linkClass}>
              Comunidade
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg border border-capy-secondary/40 px-3 py-1.5 font-semibold hover:bg-capy-light/60"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-capy-primary px-3 py-1.5 font-semibold text-white hover:bg-capy-primary/90"
            >
              Registrar
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={navClass}>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <Link to="/" className="text-xl font-bold text-capy-primary">
            CapyBreath
          </Link>
          <Link to="/dashboard" className={linkClass}>
            Dashboard
          </Link>
          <Link to="/session" className={linkClass}>
            Sessões
          </Link>
          <Link to="/achievements" className={linkClass}>
            Conquistas
          </Link>
          <Link to="/profile" className={linkClass}>
            Perfil
          </Link>
          <Link to="/community" className={linkClass}>
            Comunidade
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{user.full_name || user.username}</span>
          <button
            onClick={() => {
              void logout();
            }}
            className="rounded-lg bg-capy-primary px-3 py-1.5 font-semibold text-white hover:bg-capy-primary/90"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
