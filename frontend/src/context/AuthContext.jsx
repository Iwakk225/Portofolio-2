import { useState, useEffect, useCallback } from 'react';
import { AuthContext } from './AuthContextProvider';
import api from '../api/axios';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/api/me');
      setUser(res.data);
    } catch (error) {
      // 401 is expected when not logged in - don't log it
      if (error.response?.status !== 401) {
        console.error('Auth check error:', error.message);
      }
      setUser(null);
      // Clear token if unauthorized
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize auth from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      checkAuth();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email, password) => {
    // Step 1: Fetch CSRF cookie from Sanctum before login
    await api.get('/sanctum/csrf-cookie');
    // Step 2: Attempt login
    const res = await api.post('/api/login', { email, password });
    
    // Step 3: Store token and set auth header
    const token = res.data.token;
    localStorage.setItem('auth_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      await api.post('/api/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear auth state
    setUser(null);
    localStorage.removeItem('auth_token');
    delete api.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
