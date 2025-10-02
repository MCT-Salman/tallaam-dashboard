import { useState, useEffect } from 'react';
import { getSpecializations, updateSpecialization, deleteSpecialization, toggleSpecializationStatus, createSpecialization } from '@/api/api';
import { showSuccessToast, showErrorToast, SUCCESS_MESSAGES, ERROR_MESSAGES } from './useToastMessages';

export const useCourseManagement = () => {
    // --- DATA STRUCTURE ---
    const [specializations, setSpecializations] = useState([]);
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
    // Load specializations on component mount
    useEffect(() => {
        fetchSpecializations();
    }, []);

    const [instructors, setInstructors] = useState([
        { id: 1, name: "محمد أحمد", bio: "خبير برمجيات", avatarUrl: "", specializationId: 1, isActive: true },
        { id: 2, name: "سارة حسن", bio: "مهندسة مدنية", avatarUrl: "", specializationId: 2, isActive: true },
    ]);

    const [courses, setCourses] = useState([
        { id: 1, title: "C# للمبتدئين", slug: "csharp-beginners", description: "دورة شاملة في البرمجة", specializationId: 1, isActive: true }
    ]);

    const [courseLevels, setCourseLevels] = useState([
        { id: 1, name: "مستوى أول", order: 1, priceUSD: 50, priceSAR: 200, isFree: false, isActive: true, courseId: 1, instructorId: 1 },
    ]);

    const [lessons, setLessons] = useState([
        {
            id: 1,
            title: "مقدمة في C#",
            description: "درس تمهيدي",
            youtubeUrl: "https://youtube.com/watch?v=example1",
            youtubeId: "example1",
            googleDriveUrl: "https://drive.google.com/file/d/example1",
            durationSec: 3600,
            orderIndex: 1,
            isFreePreview: true,
            isActive: true,
            courseLevelId: 1
        },
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
        return courseLevels.filter(level => level.courseId === courseId);
    };

    const getLessons = (levelId) => {
        return lessons.filter(lesson => lesson.courseLevelId === levelId);
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
            } else {
                console.log(`Adding ${type}:`, form[type]);
                // Mock implementation for other types
                showSuccessToast(SUCCESS_MESSAGES.CREATE(type));
                closeDialog(type);
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.CREATE('الاختصاص'));
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
            } else {
                console.log(`Updating ${type}:`, form[type]);
                // Mock implementation for other types
                showSuccessToast(SUCCESS_MESSAGES.UPDATE(type));
                closeDialog(type);
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.UPDATE('الاختصاص'));
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
            } else {
                console.log(`Deleting ${type} ${id}`);
                showSuccessToast(SUCCESS_MESSAGES.DELETE('الاختصاص'));
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.DELETE('الاختصاص'));
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
            } else {
                console.log(`Toggling ${type} ${id} active status`);
                // Mock implementation for other types
                showSuccessToast(SUCCESS_MESSAGES.TOGGLE(type, true));
            }
        } catch (error) {
            showErrorToast(error.response?.data?.message || ERROR_MESSAGES.TOGGLE('الاختصاص'));
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
        fetchSpecializations
    };
};