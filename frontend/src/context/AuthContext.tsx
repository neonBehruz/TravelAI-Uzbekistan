import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('safar_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('safar_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('safar_token', newToken);
    localStorage.setItem('safar_user', JSON.stringify(newUser));
  };

  const logout = () => {
    import('../services/api').then(({ api }) => api.logout());
    setToken(null);
    setUser(null);
    localStorage.removeItem('safar_token');
    localStorage.removeItem('safar_refresh_token');
    localStorage.removeItem('safar_user');
  };

  const updateUser = (updated: User) => {
    setUser(updated);
    localStorage.setItem('safar_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
