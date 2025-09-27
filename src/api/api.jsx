import axios from 'axios';

const API_URL = import.meta.env.REACT_APP_API_URL || 'https://dev.tallaam.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor لإضافة توكن JWT إلى كل طلب مصادق عليه
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            // تأكد من أن هذا الهيدر يتطابق مع ما يتوقعه الـ Backend (authJwt.js)
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor لمعالجة أخطاء المصادقة وتحديث التوكن
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // إذا كان الخطأ 401 أو 400 ولم يتم محاولة تحديث التوكن من قبل
        if ((error.response?.status === 401 || error.response?.status === 400) && !originalRequest._retry) {
            originalRequest._retry = true;
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    console.log('🔄 Attempting to refresh token automatically...');
                    
                    // محاولة تحديث التوكن باستخدام الـ endpoint الصحيح
                    const response = await api.post('/auth/refresh', { refreshToken });
                    console.log('✅ Token refresh response:', response.data);
                    
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
                    
                    // تحديث التوكن الجديد في localStorage
                    localStorage.setItem('accessToken', newAccessToken);
                    console.log('✅ Access token updated in localStorage');
                    
                    // تحديث الهيدر في الطلب الأصلي
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // إعادة المحاولة مع التوكن الجديد
                    console.log('🔄 Retrying original request with new token...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('❌ Automatic token refresh failed:', refreshError.response?.data?.message || refreshError.message);
                    
                    // إذا فشل تحديث التوكن، قم بحذف جميع البيانات وتسجيل الخروج
                    clearAllAuthData();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                console.error('❌ No refresh token available for automatic refresh');
                // لا يوجد refresh token، قم بحذف جميع البيانات وتسجيل الخروج
                clearAllAuthData();
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

// وظيفة لحذف جميع بيانات المصادقة
function clearAllAuthData() {
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
    
    console.log('🗑️ تم حذف جميع بيانات المصادقة من localStorage');
}

// --- وظائف Auth ---
export const login = (phone, password) => api.post('/auth/login', { phone, password });

// دالة لتحديث التوكن باستخدام endpoint المحدد
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken });

// تصدير مثيل api للاستخدام في الملفات الأخرى
export { api };