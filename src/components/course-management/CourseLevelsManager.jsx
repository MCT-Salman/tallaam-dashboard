// src\components\course-management\CourseLevelsManager.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Edit, Trash2, Play, Pause, Plus } from "lucide-react";
import LevelManager from './LevelManager';

const CourseLevelsManager = ({ 
    course, 
    expandedLevels, 
    toggleLevelExpansion, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete,
    getInstructorName,
    getLessons,
    setForm,
    setDialogs,
    getCourseLevels,
    fetchLessons
}) => {
    const levels = getCourseLevels(course.id);
    
    if (!levels || levels.length === 0) {
        return (
            <div className="text-center py-4 text-muted-foreground">
                لا توجد مستويات لهذه الدورة.
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                        setForm(prev => ({ ...prev, level: { courseId: course.id } }));
                        setDialogs(prev => ({ ...prev, addLevel: true }));
                    }}
                >
                    <Plus className="w-4 h-4 ml-2" /> إضافة مستوى
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <h4 className="font-medium text-sm text-muted-foreground">المستويات ({levels.length})</h4>
                {/* <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                        setForm(prev => ({ ...prev, level: { courseId: course.id } }));
                        setDialogs(prev => ({ ...prev, addLevel: true }));
                    }}
                >
                    <Plus className="w-4 h-4 ml-2" /> إضافة مستوى
                </Button> */}
            </div>
            
            {levels.map(level => (
                <LevelManager
                    key={level.id}
                    level={level}
                    expandedLevels={expandedLevels}
                    toggleLevelExpansion={toggleLevelExpansion}
                    handleToggleActive={handleToggleActive}
                    openEditDialog={openEditDialog}
                    handleDelete={handleDelete}
                    getInstructorName={getInstructorName}
                    getLessons={getLessons}
                    setForm={setForm}
                    setDialogs={setDialogs}
                />
            ))}
        </div>
    );
};

export default CourseLevelsManager;
