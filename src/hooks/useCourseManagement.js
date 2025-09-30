import { useState, useEffect } from 'react';
import { getSpecializations } from '@/api/api';

export const useCourseManagement = () => {
    // --- DATA STRUCTURE ---
    const [specializations, setSpecializations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch specializations from API
    const fetchSpecializations = async () => {
        setLoading(true);
        setError('');
        try {
            console.log('Fetching specializations from API...');
            const response = await getSpecializations();
            console.log('Specializations response:', response.data.data);
            
            // Handle different response structures
            let specializationsData = [];
            if (response.data.success && response.data.data) {
                specializationsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            } else if (Array.isArray(response.data)) {
                specializationsData = response.data;
            } else if (response.data.specializations) {
                specializationsData = Array.isArray(response.data.specializations) ? response.data.specializations : [response.data.specializations];
            } else if (response.data.data) {
                specializationsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
            } else {
                // Try to find any array in the response
                const values = Object.values(response.data);
                const arrayValue = values.find(v => Array.isArray(v));
                if (arrayValue) {
                    specializationsData = arrayValue;
                }
            }
            
            setSpecializations(specializationsData);
            console.log('Processed specializations:', specializationsData);
        } catch (err) {
            console.error('Error fetching specializations:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               'فشل في جلب التخصصات';
            setError(errorMessage);
            // Fallback to mock data if API fails
            setSpecializations([
                { id: 1, name: "معلوماتية", slug: "informatics", isActive: true },
                { id: 2, name: "هندسة", slug: "engineering", isActive: true },
            ]);
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
    const [toast, setToast] = useState({ show: false, title: "", description: "", variant: "default" });
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
        specialization: { name: '' },
        instructor: { name: '', bio: '', avatarUrl: '', specializationId: '' },
        course: { title: '', slug: '', description: '', specializationId: '' },
        level: { name: '', order: 1, priceUSD: 0, priceSAR: 0, isFree: false, courseId: '', instructorId: '' },
        lesson: { title: '', description: '', youtubeUrl: '', googleDriveUrl: '', durationSec: 0, orderIndex: 1, isFreePreview: false, courseLevelId: '' }
    });
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
        console.log(`Adding ${type}:`, form[type]);
        // Mock implementation
        setToast({
            show: true,
            title: "نجاح",
            description: `تمت إضافة ${type} بنجاح`,
            variant: "default"
        });
    };

    const handleUpdate = async (type, id) => {
        console.log(`Updating ${type} ${id}:`, form[type]);
        // Mock implementation
        setToast({
            show: true,
            title: "نجاح",
            description: `تم تحديث ${type} بنجاح`,
            variant: "default"
        });
    };

    const handleDelete = async (type, id) => {
        if (confirm(`هل أنت متأكد من حذف ${type}؟`)) {
            console.log(`Deleting ${type} ${id}`);
            // Mock implementation
            setToast({
                show: true,
                title: "نجاح",
                description: `تم حذف ${type} بنجاح`,
                variant: "default"
            });
        }
    };

    const handleToggleActive = async (type, id) => {
        console.log(`Toggling ${type} ${id} active status`);
        // Mock implementation
        setToast({
            show: true,
            title: "نجاح",
            description: `تم تحديث حالة ${type} بنجاح`,
            variant: "default"
        });
    };

    const handleFormChange = (type, field, value) => {
        setForm(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const openEditDialog = (type, item) => {
        setEditingItem(item);
        setForm(prev => ({
            ...prev,
            [type]: { ...item }
        }));
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
        toast,
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
        fetchSpecializations
    };
};