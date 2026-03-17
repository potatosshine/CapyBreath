import { createContext, useContext, useEffect, useState } from 'react';
import Toast from '../../components/Toast';
import { getProfile } from '../../api/userApi';
import { logout as apiLogout } from '../../api/authApi';
import type { User } from '../../types/user.types';

interface ToastState {
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  showToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(
    () => !!localStorage.getItem('accessToken')
  );
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      setLoading(true);
      getProfile()
        .then(setUser)
        .catch(() => {
          setUser(null);
          void apiLogout();
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
    window.location.href = '/login';
  };

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'info' = 'info'
  ) => {
    setToast({ message, type });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        setUser,
        logout,
        showToast,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
