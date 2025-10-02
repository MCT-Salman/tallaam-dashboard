import { toast } from "@/components/ui/sonner";

// دالة لعرض رسائل النجاح
export const showSuccessToast = (message) => {
    toast.success(message, {
        duration: 3000,
        className: "rtl"
    });
};

// دالة لعرض رسائل الخطأ
export const showErrorToast = (message) => {
    toast.error(message, {
        duration: 3000,
        className: "rtl"
    });
};

// دالة لعرض رسائل التأكيد
export const showConfirmToast = (message, onConfirm) => {
    toast(message, {
        duration: 5000,
        className: "rtl",
        action: {
            label: "نعم",
            onClick: onConfirm
        },
        cancel: {
            label: "لا"
        }
    });
};

// رسائل نجاح العمليات
export const SUCCESS_MESSAGES = {
    CREATE: (type) => `تم إضافة ${type} بنجاح`,
    UPDATE: (type) => `تم تحديث ${type} بنجاح`,
    DELETE: (type) => `تم حذف ${type} بنجاح`,
    TOGGLE: (type, status) => `تم ${status ? 'تفعيل' : 'تعطيل'} ${type} بنجاح`
};

// رسائل الخطأ
export const ERROR_MESSAGES = {
    CREATE: (type) => `فشل في إضافة ${type}`,
    UPDATE: (type) => `فشل في تحديث ${type}`,
    DELETE: (type) => `فشل في حذف ${type}`,
    TOGGLE: (type) => `فشل في تغيير حالة ${type}`,
    VALIDATION: "يرجى ملء جميع الحقول المطلوبة",
    SERVER: "حدث خطأ في الاتصال بالخادم",
    DEPENDENCIES: {
        INSTRUCTOR: "لا يمكن الحذف - يوجد مواد أو دورات مرتبطة بهذا المدرس",
        SPECIALIZATION: "لا يمكن الحذف - يوجد مدرسون أو مواد مرتبطة بهذا الاختصاص",
        SUBJECT: "لا يمكن الحذف - يوجد دورات أو مستويات مرتبطة بهذه المادة",
        COURSE: "لا يمكن الحذف - يوجد مستويات مرتبطة بهذه الدورة",
        LEVEL: "لا يمكن الحذف - يوجد دروس مرتبطة بهذا المستوى"
    }
};