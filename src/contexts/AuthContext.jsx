// src\contexts\AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { login as apiLogin, refreshToken as apiRefreshToken } from '@/api/api';
import { startTokenMonitoring as startTokenMonitoringUtil, ensureValidToken } from '@/utils/tokenManager';

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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    // تحقق أساسي من صحة التوكن
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000; // تحويل إلى milliseconds
      return Date.now() < expiry;
    } catch (e) {
      console.error('Invalid token format:', e);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      return false;
    }
  });
  const [loading, setLoading] = useState(true); 
  const tokenMonitoringRef = useRef(null); 



  const login = useCallback(async (phone, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(phone, password);
      console.log('🔍 API Response:', response.data);
      console.log('🔍 Full Response:', response);
      
      // Check different possible response structures
      let accessToken, refreshToken, userData;
      
      if (response.data.data) {
        // If response is wrapped in a data object
        accessToken = response.data.data.accessToken;
        refreshToken = response.data.data.refreshToken;
        userData = response.data.data;
      } else {
        // If response is direct
        accessToken = response.data.accessToken;
        refreshToken = response.data.refreshToken;
        userData = response.data;
      }
      
      console.log('🔍 Extracted accessToken:', accessToken);
      console.log('🔍 Extracted refreshToken:', refreshToken);
      console.log('🔍 Extracted userData:', userData);
      
      if (!accessToken) {
        throw new Error('Access token not found in response');
      }
      
      // تشفير البيانات الحساسة قبل تخزينها
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      console.error('Full error:', error);
      // تنظيف جميع البيانات عند فشل تسجيل الدخول
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setLoading(false);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    setLoading(true);
    
    // حذف جميع البيانات من localStorage بشكل كامل
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // حذف جميع المفاتيح المتعلقة بالتطبيق
      if (key && (
        key.includes('accessToken') || 
        key.includes('refreshToken') || 
        key.includes('user') ||
        key.includes('auth') ||
        key.includes('token') ||
        key.startsWith('tallaam_') ||
        key.startsWith('app_')
      )) {
        keysToRemove.push(key);
      }
    }
    
    // حذف جميع المفاتيح المحددة
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // حذف البيانات الأساسية بشكل صريح للتأكد
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('app_settings');
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    
    // إعادة تعيين حالة المصادقة
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false);
    
    console.log('✅ جميع بيانات المستخدم تم حذفها من localStorage');
  }, []);

  // التحقق من صحة التوكن بشكل دوري
  const validateToken = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsAuthenticated(false);
      return false;
    }
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      const isValid = Date.now() < expiry;
      
      if (!isValid) {
        logout();
      }
      
      return isValid;
    } catch (e) {
      console.error('Invalid token format:', e);
      logout();
      return false;
    }
  }, [logout]);

  // دالة لتحديث التوكن
  const refreshAuthToken = useCallback(async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      setLoading(true);
      const response = await apiRefreshToken(refreshToken);
      console.log('🔄 Refresh Token Response:', response.data);
      
      // استخراج التوكن الجديد من الاستجابة
      let newAccessToken;
      if (response.data.data) {
        newAccessToken = response.data.data.accessToken;
      } else {
        newAccessToken = response.data.accessToken;
      }
      
      if (!newAccessToken) {
        throw new Error('New access token not found in response');
      }
      
      // تحديث التوكن في localStorage والحالة
      localStorage.setItem('accessToken', newAccessToken);
      setToken(newAccessToken);
      setLoading(false);
      
      console.log('✅ Token refreshed successfully');
      return newAccessToken;
    } catch (error) {
      console.error('Token refresh failed:', error.response?.data?.message || error.message);
      setLoading(false);
      // إذا فشل تحديث التوكن، قم بتسجيل الخروج
      logout();
      throw error;
    }
  }, [logout]);

  // دالة لبدء مراقبة التوكن
  const startTokenMonitoring = useCallback(() => {
    if (tokenMonitoringRef.current) {
      // إيقاف المراقبة الحالية إذا كانت موجودة
      tokenMonitoringRef.current();
    }
    
    console.log('🔍 Starting automatic token monitoring...');
    const stopMonitoring = startTokenMonitoringUtil(30 * 1000); // التحقق كل 30 ثانية
    tokenMonitoringRef.current = stopMonitoring;
  }, []);

  // دالة لإيقاف مراقبة التوكن
  const stopTokenMonitoring = useCallback(() => {
    if (tokenMonitoringRef.current) {
      console.log('⏹️ Stopping token monitoring...');
      tokenMonitoringRef.current();
      tokenMonitoringRef.current = null;
    }
  }, []);

  // بدء مراقبة التوكن عند تسجيل الدخول
  useEffect(() => {
    if (isAuthenticated && token) {
      startTokenMonitoring();
    } else {
      stopTokenMonitoring();
    }
    
    return () => {
      stopTokenMonitoring();
    };
  }, [isAuthenticated, token]);

  // التحقق من صلاحية التوكن عند تحميل التطبيق
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        try {
          // التحقق من صلاحية التوكن وتحديثه إذا لزم الأمر
          const isValid = await ensureValidToken();
          
          if (isValid) {
            const user = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(user);
            setIsAuthenticated(true);
            console.log('✅ User authenticated and token validated');
          } else {
            // إذا فشل التحقق، قم بتسجيل الخروج
            logout();
          }
        } catch (error) {
          console.error('Error during authentication initialization:', error);
          logout();
        }
      }
      
      setLoading(false);
    };
    
    initializeAuth();
  }, [logout]);

  const authContextValue = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    validateToken,
    refreshAuthToken, // إضافة دالة تحديث التوكن
    startTokenMonitoring, // إضافة دالة بدء المراقبة
    stopTokenMonitoring, // إضافة دالة إيقاف المراقبة
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};