import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import FilterSection from './FilterSection';
import AddButtons from './AddButtons';
import CourseCard from './CourseCard';

const CourseManager = ({
    courses,
    filters,
    setFilters,
    specializations,
    form,
    handleFormChange,
    handleAdd,
    instructors,
    courseLevels,
    getCourseName,
    setForm,
    setDialogs,
    expandedCourses,
    toggleCourseExpansion,
    expandedLevels,
    toggleLevelExpansion,
    handleToggleActive,
    openEditDialog,
    handleDelete,
    getSpecializationName,
    getCourseLevels,
    getInstructorName,
    getLessons,
    getFilteredCourses
}) => {
    const filteredCourses = getFilteredCourses();

    return (
        <>
            <FilterSection 
                filters={filters} 
                setFilters={setFilters} 
                specializations={specializations} 
            />

            <AddButtons
                form={form}
                handleFormChange={handleFormChange}
                handleAdd={handleAdd}
                specializations={specializations}
                instructors={instructors}
                courses={courses}
                courseLevels={courseLevels}
                getCourseName={getCourseName}
            />

            <div className="space-y-4">
                {filteredCourses.map(course => (
                    <CourseCard
                        key={course.id}
                        course={course}
                        expandedCourses={expandedCourses}
                        toggleCourseExpansion={toggleCourseExpansion}
                        handleToggleActive={handleToggleActive}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                        getSpecializationName={getSpecializationName}
                        getCourseLevels={getCourseLevels}
                        setForm={setForm}
                        setDialogs={setDialogs}
                        expandedLevels={expandedLevels}
                        toggleLevelExpansion={toggleLevelExpansion}
                        getInstructorName={getInstructorName}
                        getLessons={getLessons}
                    />
                ))}
                
                {filteredCourses.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <AlertTriangle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-lg">لا توجد دورات تطابق معايير البحث.</p>
                            {/* <Button className="mt-4" onClick={() => setDialogs(prev => ({ ...prev, addCourse: true }))}>
                                <Plus className="w-4 h-4 ml-2" /> إضافة دورة جديدة
                            </Button> */}
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
};

export default CourseManager;