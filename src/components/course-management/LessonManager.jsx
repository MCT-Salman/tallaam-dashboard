import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";

const LessonManager = ({ 
    level, 
    getLessons, 
    // setForm, 
    // setDialogs,
    handleToggleActive,
    openEditDialog,
    handleDelete
}) => {
    const lessons = getLessons(level.id);

    return (
        <>
            <div className="flex justify-between items-center mb-3">
                <h6 className="font-medium">الدروس ({lessons.length})</h6>
                {/* <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        setForm(prev => ({ ...prev, lesson: { ...prev.lesson, courseLevelId: level.id } }));
                        setDialogs(prev => ({ ...prev, addLesson: true }));
                    }}
                >
                    <Plus className="w-4 h-4 ml-1" /> إضافة درس
                </Button> */}
            </div>

            {lessons.length === 0 ? (
                <p className="text-muted-foreground text-center py-4 italic">لا توجد دروس في هذا المستوى بعد.</p>
            ) : (
                <div className="space-y-3">
                    {lessons.map(lesson => (
                        <div key={lesson.id} className="p-3 bg-background border rounded-md hover:bg-accent/50 transition-colors">
                            <div className="flex justify-between items-start">
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h6 className="font-medium">{lesson.title}</h6>
                                        {lesson.isFreePreview && <Badge variant="outline" className="text-xs">معاينة</Badge>}
                                    </div>
                                    {lesson.description && (
                                        <p className="text-sm text-muted-foreground line-clamp-1">{lesson.description}</p>
                                    )}
                                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mt-1">
                                        <span>⏱️ {lesson.durationSec ? `${Math.floor(lesson.durationSec / 60)}m` : '-'}</span>
                                        <span>📌 #{lesson.orderIndex || '-'}</span>
                                        {lesson.youtubeUrl && <Badge variant="destructive" className="text-xs">YT</Badge>}
                                        {lesson.googleDriveUrl && <Badge variant="secondary" className="text-xs">Drive</Badge>}
                                    </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                    <Badge variant={lesson.isActive ? "default" : "secondary"} className="text-xs">
                                        {lesson.isActive ? "نشط" : "معطل"}
                                    </Badge>
                                    <Button size="icon" variant="ghost" onClick={() => handleToggleActive('lesson', lesson.id)}>
                                        {lesson.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => openEditDialog('lesson', lesson)}>
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" onClick={() => handleDelete('lesson', lesson.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default LessonManager;