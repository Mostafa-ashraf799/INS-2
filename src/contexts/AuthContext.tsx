import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { type User, getCurrentUser, loginUser, registerUser, logoutUser, updateUser } from '../store';

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string) => { success: boolean; error?: string };
  register: (username: string, email: string, password: string, fullName: string) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getCurrentUser());

  const login = useCallback((identifier: string, password: string) => {
    const result = loginUser(identifier, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const register = useCallback((username: string, email: string, password: string, fullName: string) => {
    const result = registerUser(username, email, password, fullName);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    if (user) {
      const updated = updateUser(user.id, updates);
      if (updated) setUser(updated);
    }
  }, [user]);

  const refresh = useCallback(() => {
    setUser(getCurrentUser());
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
