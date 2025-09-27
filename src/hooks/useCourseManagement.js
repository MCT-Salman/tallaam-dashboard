import { useState } from 'react';

export const useCourseManagement = () => {
    // --- DATA STRUCTURE ---
    const [specializations, setSpecializations] = useState([
        { id: 1, name: "معلوماتية", slug: "informatics", isActive: true },
        { id: 2, name: "هندسة", slug: "engineering", isActive: true },
    ]);

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
    const [filters, setFilters] = useState({
        specialization: "",
        instructor: "",
        course: "",
        activeOnly: false
    });
    const [form, setForm] = useState({
        specialization: { name: "", slug: "", isActive: true },
        instructor: { name: "", bio: "", avatarUrl: "", specializationId: "", isActive: true },
        course: { title: "", slug: "", description: "", specializationId: "", isActive: true },
        level: { name: "", order: 1, priceUSD: "", priceSAR: "", isFree: false, courseId: "", instructorId: "", isActive: true },
        lesson: { title: "", description: "", youtubeUrl: "", youtubeId: "", googleDriveUrl: "", durationSec: "", orderIndex: "", isFreePreview: false, courseLevelId: "", isActive: true },
    });

    // --- Toast Function ---
    const showToast = (title, description, variant = "default") => {
        setToast({ show: true, title, description, variant });
        setTimeout(() => setToast({ show: false, title: "", description: "", variant: "default" }), 3000);
    };

    // --- Helper Functions ---
    const getSpecializationName = (id) => specializations.find(s => s.id === id)?.name || "غير محدد";
    const getInstructorName = (id) => instructors.find(i => i.id === id)?.name || "غير محدد";
    const getCourseName = (id) => courses.find(c => c.id === id)?.title || "غير محدد";
    const getLevelName = (id) => courseLevels.find(l => l.id === id)?.name || "غير محدد";

    const getInstructorsBySpecialization = (specializationId) => 
        instructors.filter(i => i.specializationId === parseInt(specializationId));
    
    const getCourseLevels = (courseId) => 
        courseLevels.filter(l => l.courseId === courseId).sort((a, b) => a.order - b.order);
    
    const getCourseLevelsByInstructor = (instructorId) => 
        courseLevels.filter(l => l.instructorId === instructorId);
    
    const getLessons = (courseLevelId) => 
        lessons.filter(l => l.courseLevelId === courseLevelId).sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));

    // --- Filtered Data ---
    const getFilteredCourses = () => {
        let filtered = courses;

        if (filters.specialization && filters.specialization !== "all") {
            filtered = filtered.filter(c => c.specializationId === parseInt(filters.specialization));
        }

        if (filters.course) {
            filtered = filtered.filter(c => c.title.toLowerCase().includes(filters.course.toLowerCase()));
        }

        if (filters.activeOnly) {
            filtered = filtered.filter(c => c.isActive);
        }

        return filtered;
    };

    // --- Expansion Handlers ---
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

    // --- Form Handlers ---
    const handleFormChange = (type, field, value) => {
        setForm(prev => ({
            ...prev,
            [type]: { ...prev[type], [field]: value }
        }));
    };

    const openEditDialog = (type, item) => {
        setEditingItem(item);
        setForm(prev => ({ ...prev, [type]: item }));
        setDialogs(prev => ({ ...prev, [`edit${type.charAt(0).toUpperCase() + type.slice(1)}`]: true }));
    };

    const closeDialog = (dialogName) => {
        setDialogs(prev => ({ ...prev, [dialogName]: false }));
        if (dialogName.startsWith('add')) {
            const type = dialogName.replace('add', '').toLowerCase();
            const defaultForm = {
                specialization: { name: "", slug: "", isActive: true },
                instructor: { name: "", bio: "", avatarUrl: "", specializationId: "", isActive: true },
                course: { title: "", slug: "", description: "", specializationId: "", isActive: true },
                level: { name: "", order: 1, priceUSD: "", priceSAR: "", isFree: false, courseId: "", instructorId: "", isActive: true },
                lesson: { title: "", description: "", youtubeUrl: "", youtubeId: "", googleDriveUrl: "", durationSec: "", orderIndex: "", isFreePreview: false, courseLevelId: "", isActive: true },
            };
            setForm(prev => ({ ...prev, [type]: defaultForm[type] || {} }));
        }
        setEditingItem(null);
    };

    // --- CRUD Operations ---
    const handleAdd = (type) => {
        const data = form[type];
        
        // Validation
        if ((type === 'specialization' && !data.name) ||
            (type === 'instructor' && (!data.name || !data.specializationId)) ||
            (type === 'course' && (!data.title || !data.specializationId)) ||
            (type === 'level' && (!data.name || !data.courseId || !data.instructorId)) ||
            (type === 'lesson' && (!data.title || !data.courseLevelId))) {
            return showToast("خطأ", "يرجى ملء الحقول المطلوبة", "destructive");
        }

        const newItem = {
            id: Date.now(),
            ...data,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const setters = {
            specialization: setSpecializations,
            instructor: setInstructors,
            course: setCourses,
            level: setCourseLevels,
            lesson: setLessons
        };

        const parsedData = {
            specialization: newItem,
            instructor: { ...newItem, specializationId: parseInt(data.specializationId) },
            course: { ...newItem, specializationId: parseInt(data.specializationId) },
            level: {
                ...newItem,
                courseId: parseInt(data.courseId),
                instructorId: parseInt(data.instructorId),
                priceUSD: parseFloat(data.priceUSD) || 0,
                priceSAR: parseFloat(data.priceSAR) || 0
            },
            lesson: {
                ...newItem,
                courseLevelId: parseInt(data.courseLevelId),
                durationSec: parseInt(data.durationSec) || 0,
                orderIndex: parseInt(data.orderIndex) || 0
            }
        };

        setters[type](prev => [...prev, parsedData[type]]);
        setForm(prev => ({ ...prev, [type]: {} }));
        setDialogs(prev => ({ ...prev, [`add${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
        showToast("تمت الإضافة", `تمت إضافة ${type} بنجاح`);
    };

    const handleUpdate = (type) => {
        const data = form[type];
        if (!editingItem) return;

        const updaters = {
            specialization: setSpecializations,
            instructor: setInstructors,
            course: setCourses,
            level: setCourseLevels,
            lesson: setLessons
        };

        const updater = (items) => items.map(item => {
            if (item.id === editingItem.id) {
                const updated = { ...item, ...data, updatedAt: new Date().toISOString() };
                
                if (type === 'instructor') updated.specializationId = parseInt(data.specializationId);
                if (type === 'course') updated.specializationId = parseInt(data.specializationId);
                if (type === 'level') {
                    updated.courseId = parseInt(data.courseId);
                    updated.instructorId = parseInt(data.instructorId);
                    updated.priceUSD = parseFloat(data.priceUSD) || 0;
                    updated.priceSAR = parseFloat(data.priceSAR) || 0;
                }
                if (type === 'lesson') {
                    updated.courseLevelId = parseInt(data.courseLevelId);
                    updated.durationSec = parseInt(data.durationSec) || 0;
                    updated.orderIndex = parseInt(data.orderIndex) || 0;
                }
                return updated;
            }
            return item;
        });

        updaters[type](updater);
        setEditingItem(null);
        setDialogs(prev => ({ ...prev, [`edit${type.charAt(0).toUpperCase() + type.slice(1)}`]: false }));
        showToast("تم التحديث", `تم تحديث ${type} بنجاح`);
    };

    const handleDelete = (type, id) => {
        if (!window.confirm("هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.")) return;

        // Cascade delete checks
        if (type === 'specialization') {
            if (instructors.some(i => i.specializationId === id)) 
                return showToast("لا يمكن الحذف", "يوجد مدرسون تابعون لهذا الاختصاص", "destructive");
            if (courses.some(c => c.specializationId === id)) 
                return showToast("لا يمكن الحذف", "يوجد دورات تابعة لهذا الاختصاص", "destructive");
        }
        if (type === 'instructor') {
            if (courseLevels.some(l => l.instructorId === id)) 
                return showToast("لا يمكن الحذف", "يوجد مستويات تابعة لهذا المدرس", "destructive");
        }
        if (type === 'course') {
            const levelIds = courseLevels.filter(l => l.courseId === id).map(l => l.id);
            setLessons(prev => prev.filter(l => !levelIds.includes(l.courseLevelId)));
            setCourseLevels(prev => prev.filter(l => l.courseId !== id));
            setCourses(prev => prev.filter(c => c.id !== id));
        }
        if (type === 'level') {
            if (lessons.some(l => l.courseLevelId === id)) 
                return showToast("لا يمكن الحذف", "يوجد دروس تابعة لهذا المستوى", "destructive");
            setCourseLevels(prev => prev.filter(l => l.id !== id));
        }
        if (type === 'lesson') {
            setLessons(prev => prev.filter(l => l.id !== id));
        }
        if (type === 'specialization') {
            setSpecializations(prev => prev.filter(item => item.id !== id));
        }
        if (type === 'instructor') {
            setInstructors(prev => prev.filter(item => item.id !== id));
        }

        showToast("تم الحذف", `تم حذف العنصر بنجاح`);
    };

    const handleToggleActive = (type, id) => {
        const updaters = {
            specialization: setSpecializations,
            instructor: setInstructors,
            course: setCourses,
            level: setCourseLevels,
            lesson: setLessons
        };

        updaters[type](prev => prev.map(item => 
            item.id === id 
                ? { ...item, isActive: !item.isActive, updatedAt: new Date().toISOString() } 
                : item
        ));
    };

    return {
        // States
        toast,
        specializations,
        instructors,
        courses,
        courseLevels,
        lessons,
        activeTab,
        dialogs,
        form,
        expandedCourses,
        expandedLevels,
        filters,
        
        // Setters
        setActiveTab,
        setDialogs,
        setForm,
        setExpandedCourses,
        setExpandedLevels,
        setFilters,
        
        // Functions
        showToast,
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
        getLevelName,
        getInstructorsBySpecialization,
        getCourseLevels,
        getCourseLevelsByInstructor,
        getLessons,
        getFilteredCourses,
        toggleCourseExpansion,
        toggleLevelExpansion
    };
};