import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { type User, getCurrentUser, loginUser, registerUser, logoutUser, updateUser } from '../store';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // تحميل المستخدم عند بدء التطبيق
  useEffect(() => {
    getCurrentUser().then((u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const result = await loginUser(identifier, password);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (username: string, email: string, password: string, fullName: string) => {
    const result = await registerUser(username, email, password, fullName);
    if (result.success && result.user) setUser(result.user);
    return result;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (user) {
      const updated = await updateUser(user.id, updates);
      if (updated) setUser(updated);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    const u = await getCurrentUser();
    setUser(u);
  }, []);

  // لا تعرض الأبناء حتى ينتهي تحميل المستخدم
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
