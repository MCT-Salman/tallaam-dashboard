// src\hooks\useCourseManagement.js
  // src\hooks\useCourseManagement.js
import { useState, useEffect } from 'react';
import { getSpecializations, updateSpecialization, deleteSpecialization, toggleSpecializationStatus, createSpecialization } from '@/api/api';
import { getCourses, createCourse, updateCourse, deleteCourse, toggleCourseStatus } from '@/api/api';
import { getCourseLevels, createCourseLevel, updateCourseLevel, deleteCourseLevel, toggleCourseLevelStatus } from '@/api/api';
import { getCourseLessons, getLevelLessons, createLesson, createLessonForLevel, updateLesson, deleteLesson, toggleLessonStatus } from '@/api/api';
import { showSuccessToast, showErrorToast, SUCCESS_MESSAGES, ERROR_MESSAGES } from './useToastMessages';

export const useCourseManagement = () => {
    // --- DATA STRUCTURE ---
    const [specializations, setSpecializations] = useState([]);
    const [courses, setCourses] = useState([]);
    const [courseLevels, setCourseLevels] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch specializations from API
    const fetchSpecializations = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching specializations from API...');
            const response = await getSpecializations();
            console.log('Full API response:', response.data);

            // الطريقة المباشرة بناءً على هيكل البيانات الذي تراه
            let specializationsData = response.data?.data?.data || [];

            // تأكد أنها مصفوفة
            if (!Array.isArray(specializationsData)) {
                specializationsData = [];
            }

            console.log('Processed specializations:', specializationsData);
            setSpecializations(specializationsData);

        } catch (err) {
            console.error('Error fetching specializations:', err);
            const errorMessage = err.response?.data?.message ||
                'فشل في جلب التخصصات';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    // Fetch courses from API
    const fetchCourses = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching courses from API...');
            const response = await getCourses();
            console.log('Courses API response:', response.data);

            let coursesData = response.data?.data?.courses || [];
            if (!Array.isArray(coursesData)) {
                coursesData = [];
            }

            console.log('Processed courses:', coursesData);
            setCourses(coursesData);

        } catch (err) {
            console.error('Error fetching courses:', err);
            const errorMessage = err.response?.data?.message || 'فشل في جلب الدورات';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Fetch course levels for a specific course
    const fetchCourseLevels = async (courseId) => {
        try {
            console.log('Fetching course levels for course:', courseId);
            const response = await getCourseLevels(courseId);
            console.log('Course levels response:', response.data);

            let levelsData = response.data?.data || [];
            if (!Array.isArray(levelsData)) {
                levelsData = [];
            }

            setCourseLevels(prev => ({
                ...prev,
                [courseId]: levelsData
            }));

        } catch (err) {
            console.error('Error fetching course levels:', err);
        }
    };

    // Fetch lessons for a specific level
    const fetchLessons = async (levelId) => {
        try {
            console.log('Fetching lessons for level:', levelId);
            const response = await getLevelLessons(levelId);
            console.log('Lessons response:', response.data);

            let lessonsData = response.data?.data || [];
            if (!Array.isArray(lessonsData)) {
                lessonsData = [];
            }

            setLessons(prev => ({
                ...prev,
                [levelId]: lessonsData
            }));

        } catch (err) {
            console.error('Error fetching lessons:', err);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchSpecializations();
        fetchCourses();
    }, []);

    const [instructors, setInstructors] = useState([
        { id: 1, name: "محمد أحمد", bio: "خبير برمجيات", avatarUrl: "", specializationId: 1, isActive: true },
        { id: 2, name: "سارة حسن", bio: "مهندسة مدنية", avatarUrl: "", specializationId: 2, isActive: true },
    ]);

    // --- State Management ---
    // تم إزالة حالة التوست القديمة واستبدالها بنظام التوست الجديد
    const [activeTab, setActiveTab] = useState("taxonomy");
    const [dialogs, setDialogs] = useState({
        addCourse: false, editCourse: false,
        addLevel: false, editLevel: false,
        addLesson: false, editLesson: false,
        addInstructor: false, editInstructor: false,
        addSpecialization: false, editSpecialization: false
    });
    const [editingItem, setEditingItem] = useState(null);
    const [expandedCourses, setExpandedCourses] = useState({});
    const [expandedLevels, setExpandedLevels] = useState({});
    const [form, setForm] = useState({
        specialization: { name: '', image: null, imagePreview: null },
        instructor: { name: '', bio: '', avatarUrl: '', specializationId: '' },
        course: { title: '', slug: '', description: '', specializationId: '' },
        level: { name: '', order: 1, priceUSD: 0, priceSAR: 0, isFree: false, courseId: '', instructorId: '' },
        lesson: { title: '', description: '', youtubeUrl: '', googleDriveUrl: '', durationSec: 0, orderIndex: 1, isFreePreview: false, courseLevelId: '' }
    });

    const handleFormChange = (type, field, value) => {
        setForm(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value,
                ...(field === 'image' && {
                    imagePreview: value ? URL.createObjectURL(value) : null
                })
            }
        }));
    };
    const [filters, setFilters] = useState({
        specializationId: '',
        instructorId: '',
        search: ''
    });

    // --- Helper Functions ---
    const getSpecializationName = (id) => {
        const spec = specializations.find(s => s.id === id);
        return spec ? spec.name : 'غير محدد';
    };

    const getInstructorName = (id) => {
        const instructor = instructors.find(i => i.id === id);
        return instructor ? instructor.name : 'غير محدد';
    };

    const getCourseName = (id) => {
        const course = courses.find(c => c.id === id);
        return course ? course.title : 'غير محدد';
    };

    const getCourseLevels = (courseId) => {
        return courseLevels[courseId] || [];
    };

    const getLessons = (levelId) => {
        return lessons[levelId] || [];
    };

    const getFilteredCourses = () => {
        return courses.filter(course => {
            const matchesSpec = !filters.specializationId || course.specializationId == filters.specializationId;
            const matchesSearch = !filters.search ||
                course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                course.description.toLowerCase().includes(filters.search.toLowerCase());
            return matchesSpec && matchesSearch;
        });
    };

    const toggleCourseExpansion = (courseId) => {
        setExpandedCourses(prev => ({
            ...prev,
            [courseId]: !prev[courseId]
        }));
    };

    const toggleLevelExpansion = (levelId) => {
        setExpandedLevels(prev => ({
            ...prev,
            [levelId]: !prev[levelId]
        }));
    };

    // --- CRUD Operations ---
    const handleAdd = async (type) => {
        setIsSubmitting(true);
        try {
            if (type === 'specialization') {
                const response = await createSpecialization(form[type]);
                if (response.data?.success) {
                    await fetchSpecializations();
                    showSuccessToast(SUCCESS_MESSAGES.CREATE('الاختصاص'));
                    closeDialog(type);
                }
            } else if (type === 'course') {
                const response = await createCourse(form[type]);
                if (response.data?.success) {
                    await fetchCourses();
                    showSuccessToast(SUCCESS_MESSAGES.CREATE('الدورة'));
                    closeDialog(type);
                }
            } else if (type === 'level') {
                const response = await createCourseLevel(form[type].courseId, form[type]);
                if (response.data?.success) {
                    await fetchCourseLevels(form[type].courseId);
                    showSuccessToast(SUCCESS_MESSAGES.CREATE('المستوى'));
                    closeDialog(type);
                }
            } else if (type === 'lesson') {
                const targetId = form[type].courseLevelId || form[type].courseId;
                const response = form[type].courseLevelId
                    ? await createLessonForLevel(form[type].courseLevelId, form[type])
                    : await createLesson(form[type].courseId, form[type]);

                if (response.data?.success) {
                    if (form[type].courseLevelId) {
                        await fetchLessons(form[type].courseLevelId);
                    }
                    showSuccessToast(SUCCESS_MESSAGES.CREATE('الدرس'));
                    closeDialog(type);
                }
            } else {
                console.log(`Adding ${type}:`, form[type]);
                showSuccessToast(SUCCESS_MESSAGES.CREATE(type));
                closeDialog(type);
            }
        } catch (error) {
            const errorType = type === 'specialization' ? 'الاختصاص' :
                            type === 'course' ? 'الدورة' :
                            type === 'level' ? 'المستوى' : 'الدرس';
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.CREATE(errorType));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdate = async (type) => {
        setIsSubmitting(true);
        try {
            if (type === 'specialization') {
                const id = form[type].id;
                if (!id) {
                    showErrorToast('معرف الاختصاص غير موجود');
                    return;
                }
                const formData = { ...form[type] };
                if (formData.image) {
                    formData.imageUrl = formData.image;
                    delete formData.image;
                    delete formData.imagePreview;
                }
                const response = await updateSpecialization(id, formData);
                if (response.data?.success) {
                    await fetchSpecializations();
                    showSuccessToast(SUCCESS_MESSAGES.UPDATE('الاختصاص'));
                    closeDialog(type);
                }
            } else if (type === 'course') {
                const id = form[type].id;
                if (!id) {
                    showErrorToast('معرف الدورة غير موجود');
                    return;
                }
                const response = await updateCourse(id, form[type]);
                if (response.data?.success) {
                    await fetchCourses();
                    showSuccessToast(SUCCESS_MESSAGES.UPDATE('الدورة'));
                    closeDialog(type);
                }
            } else if (type === 'level') {
                const id = form[type].id;
                if (!id) {
                    showErrorToast('معرف المستوى غير موجود');
                    return;
                }
                const response = await updateCourseLevel(id, form[type]);
                if (response.data?.success) {
                    const courseId = form[type].courseId;
                    if (courseId) {
                        await fetchCourseLevels(courseId);
                    }
                    showSuccessToast(SUCCESS_MESSAGES.UPDATE('المستوى'));
                    closeDialog(type);
                }
            } else if (type === 'lesson') {
                const id = form[type].id;
                if (!id) {
                    showErrorToast('معرف الدرس غير موجود');
                    return;
                }
                const response = await updateLesson(id, form[type]);
                if (response.data?.success) {
                    const levelId = form[type].courseLevelId;
                    if (levelId) {
                        await fetchLessons(levelId);
                    }
                    showSuccessToast(SUCCESS_MESSAGES.UPDATE('الدرس'));
                    closeDialog(type);
                }
            } else {
                console.log(`Updating ${type}:`, form[type]);
                showSuccessToast(SUCCESS_MESSAGES.UPDATE(type));
                closeDialog(type);
            }
        } catch (error) {
            const errorType = type === 'specialization' ? 'الاختصاص' :
                            type === 'course' ? 'الدورة' :
                            type === 'level' ? 'المستوى' : 'الدرس';
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.UPDATE(errorType));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (type, id) => {
        try {
            if (type === 'specialization') {
                const response = await deleteSpecialization(id);
                if (response.data?.success) {
                    await fetchSpecializations();
                    showSuccessToast(SUCCESS_MESSAGES.DELETE('الاختصاص'));
                }
            } else if (type === 'course') {
                const response = await deleteCourse(id);
                if (response.data?.success) {
                    await fetchCourses();
                    showSuccessToast(SUCCESS_MESSAGES.DELETE('الدورة'));
                }
            } else if (type === 'level') {
                const response = await deleteCourseLevel(id);
                if (response.data?.success) {
                    // إعادة جلب مستويات جميع الدورات أو تحديث الحالة المحلية
                    showSuccessToast(SUCCESS_MESSAGES.DELETE('المستوى'));
                }
            } else if (type === 'lesson') {
                const response = await deleteLesson(id);
                if (response.data?.success) {
                    // إعادة جلب الدروس أو تحديث الحالة المحلية
                    showSuccessToast(SUCCESS_MESSAGES.DELETE('الدرس'));
                }
            } else {
                console.log(`Deleting ${type} ${id}`);
                showSuccessToast(SUCCESS_MESSAGES.DELETE('الاختصاص'));
            }
        } catch (error) {
            const errorType = type === 'specialization' ? 'الاختصاص' :
                            type === 'course' ? 'الدورة' :
                            type === 'level' ? 'المستوى' : 'الدرس';
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.DELETE(errorType));
        }
    };

    const handleToggleActive = async (type, id) => {
        try {
            if (type === 'specialization') {
                const spec = specializations.find(s => s.id === id);
                if (spec) {
                    const response = await toggleSpecializationStatus(id, !spec.isActive);
                    if (response.data?.success) {
                        await fetchSpecializations();
                        showSuccessToast(SUCCESS_MESSAGES.TOGGLE('الاختصاص', !spec.isActive));
                    }
                }
            } else if (type === 'course') {
                const course = courses.find(c => c.id === id);
                if (course) {
                    const response = await toggleCourseStatus(id, !course.isActive);
                    if (response.data?.success) {
                        await fetchCourses();
                        showSuccessToast(SUCCESS_MESSAGES.TOGGLE('الدورة', !course.isActive));
                    }
                }
            } else if (type === 'level') {
                const level = Object.values(courseLevels).flat().find(l => l.id === id);
                if (level) {
                    const response = await toggleCourseLevelStatus(id, !level.isActive);
                    if (response.data?.success) {
                        const courseId = level.courseId;
                        if (courseId) {
                            await fetchCourseLevels(courseId);
                        }
                        showSuccessToast(SUCCESS_MESSAGES.TOGGLE('المستوى', !level.isActive));
                    }
                }
            } else if (type === 'lesson') {
                const lesson = Object.values(lessons).flat().find(l => l.id === id);
                if (lesson) {
                    const response = await toggleLessonStatus(id, !lesson.isActive);
                    if (response.data?.success) {
                        const levelId = lesson.courseLevelId;
                        if (levelId) {
                            await fetchLessons(levelId);
                        }
                        showSuccessToast(SUCCESS_MESSAGES.TOGGLE('الدرس', !lesson.isActive));
                    }
                }
            } else {
                console.log(`Toggling ${type} ${id} active status`);
                showSuccessToast(SUCCESS_MESSAGES.TOGGLE(type, true));
            }
        } catch (error) {
            const errorType = type === 'specialization' ? 'الاختصاص' :
                            type === 'course' ? 'الدورة' :
                            type === 'level' ? 'المستوى' : 'الدرس';
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.TOGGLE(errorType));
        }
    };

    // const handleFormChange = (type, field, value) => {
    //     setForm(prev => ({
    //         ...prev,
    //         [type]: {
    //             ...prev[type],
    //             [field]: value
    //         }
    //     }));
    // };

    const openEditDialog = (type, item) => {
        setEditingItem(item);
        if (type === 'specialization') {
            setForm(prev => ({
                ...prev,
                [type]: { 
                    ...item,
                    image: null,
                    imagePreview: null
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [type]: { ...item }
            }));
        }
        setDialogs(prev => ({
            ...prev,
            [`edit${type.charAt(0).toUpperCase() + type.slice(1)}`]: true
        }));
    };

    const closeDialog = (type) => {
        setDialogs(prev => ({
            ...prev,
            [`add${type.charAt(0).toUpperCase() + type.slice(1)}`]: false,
            [`edit${type.charAt(0).toUpperCase() + type.slice(1)}`]: false
        }));
        setEditingItem(null);
    };

    return {
        specializations,
        instructors,
        courses,
        courseLevels,
        // lessons,
        activeTab,
        setActiveTab,
        dialogs,
        setDialogs,
        form,
        setForm,
        expandedCourses,
        expandedLevels,
        filters,
        setFilters,
        // showToast,
        handleAdd,
        handleUpdate,
        handleDelete,
        handleToggleActive,
        handleFormChange,
        openEditDialog,
        closeDialog,
        getSpecializationName,
        getInstructorName,
        getCourseName,
        // getLevelName,
        getCourseLevels,
        getLessons,
        getFilteredCourses,
        toggleCourseExpansion,
        toggleLevelExpansion,
        loading,
        error,
        isSubmitting,
        fetchSpecializations,
        fetchCourses,
        fetchCourseLevels,
        fetchLessons
    };
};