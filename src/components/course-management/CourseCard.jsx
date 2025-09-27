import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Edit, Trash2, Play, Pause, Plus } from "lucide-react";
import CourseLevelsManager from './CourseLevelsManager';

const CourseCard = ({ 
    course, 
    expandedCourses, 
    toggleCourseExpansion, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete,
    getSpecializationName,
    getCourseLevels,
    setForm,
    setDialogs,
    expandedLevels,
    toggleLevelExpansion,
    getInstructorName,
    getLessons
}) => {
    return (
        <Card key={course.id} className="border-l-4 border-l-primary/50 hover:shadow-md transition-shadow">
            <CardHeader className="p-4">
                <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleCourseExpansion(course.id)}
                                className="p-1 hover:bg-transparent"
                            >
                                {expandedCourses[course.id] ?
                                    <ChevronDown className="w-4 h-4 text-primary" /> :
                                    <ChevronRight className="w-4 h-4" />
                                }
                            </Button>
                            <CardTitle
                                className="cursor-pointer text-lg font-semibold"
                                onClick={() => toggleCourseExpansion(course.id)}
                            >
                                {course.title}
                            </CardTitle>
                        </div>
                        <CardDescription className="text-sm">
                            {getSpecializationName(course.specializationId)}
                            {course.description && ` - ${course.description}`}
                        </CardDescription>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                        <Button size="icon" variant="ghost" onClick={() => handleToggleActive('course', course.id)}>
                            {course.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => openEditDialog('course', course)}>
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="destructive" onClick={() => handleDelete('course', course.id)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <Collapsible open={expandedCourses[course.id]} className="px-4 pb-4">
                <CollapsibleContent>
                    <CourseLevelsManager
                        course={course}
                        expandedLevels={expandedLevels}
                        toggleLevelExpansion={toggleLevelExpansion}
                        handleToggleActive={handleToggleActive}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                        getInstructorName={getInstructorName}
                        getLessons={getLessons}
                        setForm={setForm}
                        setDialogs={setDialogs}
                        getCourseLevels={getCourseLevels}
                    />
                </CollapsibleContent>
            </Collapsible>
        </Card>
    );
};

export default CourseCard;