import { api } from '@/api/api';

/**
 * دالة للتحقق من صلاحية التوكن
 * @param {string} token - التوكن المراد التحقق منه
 * @returns {Object} - { isValid: boolean, timeUntilExpiry: number, isExpiringSoon: boolean }
 */
export const checkTokenValidity = (token) => {
  if (!token) {
    return { isValid: false, timeUntilExpiry: 0, isExpiringSoon: false };
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // تحويل إلى milliseconds
    const now = Date.now();
    const timeUntilExpiry = expiry - now;
    
    // نعتبر التوكن على وشك الانتهاء إذا تبقى أقل من 5 دقائق
    const isExpiringSoon = timeUntilExpiry < 5 * 60 * 1000;
    const isValid = timeUntilExpiry > 0;
    
    return {
      isValid,
      timeUntilExpiry,
      isExpiringSoon,
      expiryTime: new Date(expiry)
    };
  } catch (error) {
    console.error('Error checking token validity:', error);
    return { isValid: false, timeUntilExpiry: 0, isExpiringSoon: false };
  }
};

/**
 * دالة للتحقق من التوكن الحالي وتحديثه إذا كان على وشك الانتهاء
 * @returns {Promise<boolean>} - true إذا كان التوكن صالحاً أو تم تحديثه بنجاح
 */
export const ensureValidToken = async () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  
  if (!accessToken || !refreshToken) {
    console.warn('⚠️ No access token or refresh token available');
    return false;
  }

  const tokenStatus = checkTokenValidity(accessToken);
  
  console.log('🔍 Token status:', {
    isValid: tokenStatus.isValid,
    isExpiringSoon: tokenStatus.isExpiringSoon,
    timeUntilExpiry: Math.round(tokenStatus.timeUntilExpiry / 1000) + 's',
    expiryTime: tokenStatus.expiryTime
  });

  // إذا كان التوكن صالحاً وليس على وشك الانتهاء، لا حاجة للتحديث
  if (tokenStatus.isValid && !tokenStatus.isExpiringSoon) {
    return true;
  }

  // إذا كان التوكن على وشك الانتهاء أو منتهي، قم بتحديثه
  if (tokenStatus.isExpiringSoon || !tokenStatus.isValid) {
    try {
      console.log('🔄 Token is expiring soon or expired, refreshing...');
      
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
      
      // التحقق من صلاحية التوكن الجديد
      const newTokenStatus = checkTokenValidity(newAccessToken);
      console.log('✅ New token status:', {
        isValid: newTokenStatus.isValid,
        timeUntilExpiry: Math.round(newTokenStatus.timeUntilExpiry / 1000) + 's',
        expiryTime: newTokenStatus.expiryTime
      });
      
      return newTokenStatus.isValid;
    } catch (error) {
      console.error('❌ Failed to refresh token:', error.response?.data?.message || error.message);
      return false;
    }
  }
  
  return false;
};

/**
 * دالة لبدء مراقبة التوكن بشكل دوري
 * @param {number} checkInterval - الفترة الزمنية للتحقق بالمللي ثانية (افتراضي: دقيقة واحدة)
 * @returns {Function} - دالة لإيقاف المراقبة
 */
export const startTokenMonitoring = (checkInterval = 60 * 1000) => {
  console.log('🔍 Starting token monitoring with interval:', checkInterval + 'ms');
  
  const intervalId = setInterval(async () => {
    const isValid = await ensureValidToken();
    if (!isValid) {
      console.error('❌ Token validation failed, stopping monitoring');
      clearInterval(intervalId);
    }
  }, checkInterval);
  
  // دالة لإيقاف المراقبة
  const stopMonitoring = () => {
    console.log('⏹️ Stopping token monitoring');
    clearInterval(intervalId);
  };
  
  return stopMonitoring;
};

/**
 * دالة لفك تشفير التوكن والحصول على البيانات
 * @param {string} token - التوكن المراد فك تشفيره
 * @returns {Object|null} - بيانات التوكن أو null إذا فشل الفك
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      ...payload,
      expiryTime: new Date(payload.exp * 1000),
      issuedAt: new Date(payload.iat * 1000)
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
