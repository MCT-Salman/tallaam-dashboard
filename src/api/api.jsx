// src\api\api.jsxو// src\api\api.jsx
import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.3.11:5000/api';
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://dev.tallaam.com";
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

// تكوين ثوابت لمحاولات إعادة المحاولة والتأخير
const RETRY_CONFIG = {
    MAX_RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // ميلي ثانية
    TOKEN_REFRESH_COOLDOWN: 5000 // 5 ثواني بين محاولات تحديث التوكن
};

let lastTokenRefreshTimestamp = 0;

// Interceptor لمعالجة أخطاء المصادقة وتحديث التوكن
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const currentTime = Date.now();
        
        // التحقق من حالة الخطأ وعدد المحاولات
        if ((error.response?.status === 401 || error.response?.status === 400) && 
            !originalRequest._retry &&
            originalRequest._retryCount < RETRY_CONFIG.MAX_RETRY_ATTEMPTS) {
            
            // التحقق من وقت التبريد بين محاولات تحديث التوكن
            if (currentTime - lastTokenRefreshTimestamp < RETRY_CONFIG.TOKEN_REFRESH_COOLDOWN) {
                console.log('⏳ Waiting for token refresh cooldown...');
                await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.TOKEN_REFRESH_COOLDOWN));
            }
            
            originalRequest._retry = true;
            originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
            
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    console.log(`🔄 Attempting to refresh token (attempt ${originalRequest._retryCount}/${RETRY_CONFIG.MAX_RETRY_ATTEMPTS})...`);
                    
                    lastTokenRefreshTimestamp = currentTime;
                    const response = await api.post('/auth/refresh', { refreshToken });
                    
                    const { data } = response.data;
                    if (!data?.accessToken || !data?.refreshToken) {
                        throw new Error('لم يتم العثور على التوكن الجديد في الاستجابة');
                    }
                    
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    console.log('✅ تم تحديث التوكن بنجاح');
                    
                    originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
                    
                    // إضافة تأخير قبل إعادة المحاولة
                    await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
                    console.log('🔄 إعادة محاولة الطلب الأصلي مع التوكن الجديد...');
                    return api(originalRequest);
                    
                } catch (refreshError) {
                    console.error('❌ فشل تحديث التوكن:', refreshError.response?.data?.message || refreshError.message);
                    
                    if (originalRequest._retryCount >= RETRY_CONFIG.MAX_RETRY_ATTEMPTS) {
                        console.error('❌ تم استنفاد جميع محاولات تحديث التوكن');
                        clearAllAuthData();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                    
                    // إضافة تأخير قبل المحاولة التالية
                    await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY));
                    return api(originalRequest);
                }
            } else {
                console.error('❌ لا يوجد توكن تحديث متاح');
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
    localStorage.removeItem('language');
    
    console.log('🗑️ تم حذف جميع بيانات المصادقة من localStorage');
}

export const login = (identifier, password) => api.post('/admin/login', { identifier, password });

// دالة لتحديث التوكن باستخدام endpoint المحدد
export const refreshToken = (refreshToken) => api.post('/auth/refresh', { refreshToken });

// --- الكاتالوج: إنشاء تخصص جديد ---
// يرسل FormData يحتوي على: name, imageUrl
export const createSpecialization = (name, imageUrl) => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('imageUrl', imageUrl);

    return api.post('/catalog/admin/specializations', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// جلب كل الاختصاصات
export const getSpecializations = (params) =>
    api.get('/catalog/admin/specializations', { params });

// تحديث اختصاص
export const updateSpecialization = (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.imageUrl) {
        formData.append('imageUrl', data.imageUrl);
    }
    return api.put(`/catalog/admin/specializations/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// تفعيل/تعطيل اختصاص
export const toggleSpecializationStatus = (id, isActive) =>
    api.put(`/catalog/admin/specializations/${id}/active`, { isActive });

// حذف اختصاص
export const deleteSpecialization = (id) =>
    api.delete(`/catalog/admin/specializations/${id}`);
  
// --- الكاتالوج: إدارة المدرسين ---
// إنشاء مدرب جديد
export const createInstructor = (data) => {
    // إذا كان هناك صورة، استخدم FormData
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio || '');
    formData.append('avatarUrl', data.avatarUrl || '');
    formData.append('specializationId', data.specializationId);
    return api.post('/catalog/admin/instructors', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// جلب جميع المدرسين
export const getInstructors = (params) =>
    api.get('/catalog/admin/instructors', { params });

// تحديث بيانات مدرب
export const updateInstructor = (id, data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio || '');
    formData.append('avatarUrl', data.avatarUrl || '');
    formData.append('specializationId', data.specializationId);
    return api.put(`/catalog/admin/instructors/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};
// تفعيل/تعطيل مدرب
export const toggleInstructorStatus = (id, isActive) =>
    api.put(`/catalog/admin/instructors/${id}/active`, { isActive });

// حذف مدرب
export const deleteInstructor = (id) =>
    api.delete(`/catalog/admin/instructors/${id}`);

// --- إدارة الكورسات ---
// إنشاء دورة جديدة
export const createCourse = (data) =>
    api.post('/catalog/admin/courses', data);

// عرض جميع الدورات
export const getCourses = (params) =>
    api.get('/catalog/admin/courses', { params });

// عرض دورة محددة
export const getCourseById = (id) =>
    api.get(`/catalog/admin/courses/${id}`);

// تحديث دورة
export const updateCourse = (id, data) =>
    api.put(`/catalog/admin/courses/${id}`, data);

// تفعيل/إلغاء تفعيل دورة
export const toggleCourseStatus = (id, isActive) =>
    api.put(`/catalog/admin/courses/${id}/active`, { isActive });

// حذف دورة
export const deleteCourse = (id) =>
    api.delete(`/catalog/admin/courses/${id}`);

// --- إدارة مستويات الدورات ---
// إنشاء مستوى جديد
export const createCourseLevel = (courseId, data) =>
    api.post(`/lessons/admin/courses/${courseId}/levels`, data);

// عرض مستويات دورة
export const getCourseLevels = (courseId) =>
    api.get(`/lessons/admin/courses/${courseId}/levels`);

// تحديث مستوى
export const updateCourseLevel = (id, data) =>
    api.put(`/lessons/admin/levels/${id}`, data);

// تفعيل/إلغاء تفعيل مستوى
export const toggleCourseLevelStatus = (id, isActive) =>
    api.put(`/lessons/admin/levels/${id}/active`, { isActive });

// حذف مستوى
export const deleteCourseLevel = (id) =>
    api.delete(`/lessons/admin/levels/${id}`);

// --- إدارة الدروس ---
// إنشاء درس للدورة مباشرة
export const createLesson = (courseId, data) =>
    api.post(`/lessons/admin/courses/${courseId}/lessons`, data);

// إنشاء درس لمستوى محدد
export const createLessonForLevel = (courseLevelId, data) =>
    api.post(`/lessons/admin/levels/${courseLevelId}/lessons`, data);

// عرض دروس دورة
export const getCourseLessons = (courseId) =>
    api.get(`/lessons/admin/courses/${courseId}/lessons`);

// عرض دروس مستوى
export const getLevelLessons = (courseLevelId) =>
    api.get(`/lessons/admin/levels/${courseLevelId}/lessons`);

// تحديث درس
export const updateLesson = (id, data) =>
    api.put(`/lessons/admin/lessons/${id}`, data);

// تفعيل/إلغاء تفعيل درس
export const toggleLessonStatus = (id, isActive) =>
    api.put(`/lessons/admin/lessons/${id}/active`, { isActive });

// حذف درس
export const deleteLesson = (id) =>
    api.delete(`/lessons/admin/lessons/${id}`);

export { api, BASE_URL };