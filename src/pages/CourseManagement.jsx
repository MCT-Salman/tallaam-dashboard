// src\pages\CourseManagement.jsx
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCourseManagement } from "@/hooks/useCourseManagement";
import ToastNotification from "@/components/course-management/ToastNotification";
import SpecializationManager from "@/components/course-management/SpecializationManager";
import InstructorManager from "@/components/course-management/InstructorManager";
import CourseManager from "@/components/course-management/CourseManager";
import EditDialogs from "@/components/course-management/EditDialogs";

export default function EnhancedCourseManagement() {
    useEffect(() => {
        document.documentElement.dir = 'rtl';
        document.body.style.fontFamily = 'Arial, sans-serif';
    }, []);

    const {
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
        isSubmitting,
        error,
        fetchSpecializations,
        fetchCourses,
        fetchCourseLevels,
        fetchLessons
    } = useCourseManagement();

    return (
        <div className="space-y-6 p-6 max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">إدارة الدورات</h1>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="taxonomy">التصنيف</TabsTrigger>
                    <TabsTrigger value="courses">الدورات والدروس</TabsTrigger>
                </TabsList>

                <TabsContent value="taxonomy" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <SpecializationManager
                            specializations={specializations}
                            form={form}
                            handleFormChange={handleFormChange}
                            handleAdd={handleAdd}
                            handleToggleActive={handleToggleActive}
                            openEditDialog={openEditDialog}
                            handleDelete={handleDelete}
                            dialogs={dialogs}
                            closeDialog={closeDialog}
                            loading={loading}
                            error={error}
                            fetchSpecializations={fetchSpecializations}
                        />

                        <InstructorManager
                            instructors={instructors}
                            specializations={specializations}
                            form={form}
                            handleFormChange={handleFormChange}
                            handleAdd={handleAdd}
                            handleToggleActive={handleToggleActive}
                            openEditDialog={openEditDialog}
                            handleDelete={handleDelete}
                            getSpecializationName={getSpecializationName}
                            dialogs={dialogs}
                            closeDialog={closeDialog}
                        />
                    </div>
                </TabsContent>

                <TabsContent value="courses" className="space-y-4">
                    <CourseManager
                        courses={courses}
                        filters={filters}
                        setFilters={setFilters}
                        specializations={specializations}
                        instructors={instructors}
                        courseLevels={courseLevels}
                        form={form}
                        setForm={setForm}
                        dialogs={dialogs}
                        setDialogs={setDialogs}
                        expandedCourses={expandedCourses}
                        expandedLevels={expandedLevels}
                        handleFormChange={handleFormChange}
                        handleAdd={handleAdd}
                        handleToggleActive={handleToggleActive}
                        handleDelete={handleDelete}
                        getSpecializationName={getSpecializationName}
                        getInstructorName={getInstructorName}
                        getCourseName={getCourseName}
                        getCourseLevels={getCourseLevels}
                        getLessons={getLessons}
                        getFilteredCourses={getFilteredCourses}
                        toggleCourseExpansion={toggleCourseExpansion}
                        toggleLevelExpansion={toggleLevelExpansion}
                        closeDialog={closeDialog}
                        fetchCourseLevels={fetchCourseLevels}
                        fetchLessons={fetchLessons}
                    />
                </TabsContent>
            </Tabs>

            <EditDialogs
                dialogs={dialogs}
                setDialogs={setDialogs}
                form={form}
                handleFormChange={handleFormChange}
                handleUpdate={handleUpdate}
                specializations={specializations}
                instructors={instructors}
                courses={courses}
                courseLevels={courseLevels}
                getCourseName={getCourseName}
                closeDialog={closeDialog}
                isSubmitting={isSubmitting}
            />

            <ToastNotification toast={toast} />
        </div>
    );
}