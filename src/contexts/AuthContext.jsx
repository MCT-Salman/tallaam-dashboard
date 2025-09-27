// src\contexts\AuthContext.jsx
import { createContext, useState, useCallback } from 'react';
import * as apiService from '../api/api'; // تأكد من المسار الصحيح

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.log(e)
      localStorage.removeItem('user');
      return null;
    }
  });

  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(false); 



  const login = useCallback(async (phone, password) => {
    setLoading(true);
    try {
      const response = await apiService.login(phone, password);
      const { accessToken, ...userData } = response.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(userData))
      setToken(accessToken);
      setUser(userData); // تخزين بيانات المستخدم الأساسية
      setIsAuthenticated(true);
      setLoading(false);
      return true; // Indicate success
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setLoading(false);
      throw error; // Re-throw error to be caught in the component
    }
  }, []);

  const logout = useCallback(() => {
    setLoading(true);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
  }, []);

  const authContextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};