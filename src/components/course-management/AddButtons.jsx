// src\components\course-management\AddButtons.jsx
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";

const AddButtons = ({
    form,
    handleFormChange,
    handleAdd,
    specializations,
    instructors,
    courses,
    courseLevels,
    getCourseName
}) => {
    // Ensure specializations is always an array
    const specializationsArray = Array.isArray(specializations) ? specializations : [];

    // Ensure instructors is always an array
    const instructorsArray = Array.isArray(instructors) ? instructors : [];

    return (
        <div className="flex gap-2">
            {/* Add Course Button */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 ml-2" /> إضافة دورة</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>إضافة دورة جديدة</DialogTitle>
                        <DialogDescription>أدخل بيانات الدورة الجديدة</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="course-title">عنوان الدورة</Label>
                            <Input
                                id="course-title"
                                placeholder="عنوان الدورة"
                                value={form.course.title || ''}
                                onChange={(e) => handleFormChange('course', 'title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-description">وصف الدورة</Label>
                            <Textarea
                                id="course-description"
                                placeholder="وصف الدورة"
                                value={form.course.description || ''}
                                onChange={(e) => handleFormChange('course', 'description', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="course-specialization">الاختصاص</Label>
                            <Select
                                value={form.course.specializationId || ''}
                                onValueChange={(v) => handleFormChange('course', 'specializationId', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="اختر الاختصاص" /></SelectTrigger>
                                <SelectContent>
                                    {specializationsArray.map(s => {
                                        const id = s.id || s._id;
                                        return id ? (
                                            <SelectItem key={id} value={id.toString()}>{s.name}</SelectItem>
                                        ) : null;
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => handleAdd('course')}>إضافة الدورة</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Level Button */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="w-4 h-4 ml-2" /> إضافة مستوى</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>إضافة مستوى جديد</DialogTitle>
                        <DialogDescription>أضف مستوى جديد إلى دورة موجودة</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="level-name">عنوان المستوى</Label>
                            <Input
                                id="level-name"
                                placeholder="عنوان المستوى"
                                value={form.level.title || ''}
                                onChange={(e) => handleFormChange('level', 'title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level-order">الترتيب</Label>
                            <Input
                                id="level-order"
                                type="number"
                                placeholder="الترتيب"
                                value={form.level.order || ''}
                                onChange={(e) => handleFormChange('level', 'order', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level-course">الدورة</Label>
                            <Select
                                value={form.level.courseId || ''}
                                onValueChange={(v) => handleFormChange('level', 'courseId', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="اختر الدورة" /></SelectTrigger>
                                <SelectContent>
                                    {courses.length > 0 ? (
                                        courses.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.title}</SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            لا توجد دورات متاحة
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="level-instructor">المدرس</Label>
                            <Select
                                value={form.level.instructorId || ''}
                                onValueChange={(v) => handleFormChange('level', 'instructorId', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="اختر المدرس" /></SelectTrigger>
                                <SelectContent>
                                    {instructorsArray.length > 0 ? (
                                        instructorsArray.map(i => (
                                            <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                        ))
                                    ) : (
                                        <div className="p-2 text-sm text-muted-foreground text-center">
                                            لا يوجد مدرسون متاحون
                                        </div>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={() => handleAdd('level')}>إضافة المستوى</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add Lesson Button */}
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline"><Plus className="w-4 h-4 ml-2" /> إضافة درس</Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>إضافة درس جديد</DialogTitle>
                        <DialogDescription>أدخل بيانات الدرس الجديد</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="lesson-title">عنوان الدرس</Label>
                            <Input
                                id="lesson-title"
                                placeholder="عنوان الدرس"
                                value={form.lesson.title || ''}
                                onChange={(e) => handleFormChange('lesson', 'title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lesson-description">وصف الدرس</Label>
                            <Textarea
                                id="lesson-description"
                                placeholder="وصف الدرس"
                                value={form.lesson.description || ''}
                                onChange={(e) => handleFormChange('lesson', 'description', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lesson-youtube-url">رابط يوتيوب</Label>
                            <Input
                                id="lesson-youtube-url"
                                placeholder="رابط يوتيوب"
                                value={form.lesson.youtubeUrl || ''}
                                onChange={(e) => handleFormChange('lesson', 'youtubeUrl', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lesson-order">الترتيب</Label>
                            <Input
                                id="lesson-order"
                                type="number"
                                placeholder="الترتيب"
                                value={form.lesson.orderIndex || ''}
                                onChange={(e) => handleFormChange('lesson', 'orderIndex', e.target.value)}
                            />
                        </div>
                        <Button onClick={() => handleAdd('lesson')}>إضافة الدرس</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AddButtons;