// src\components\course-management\EditDialogs.jsx
import React from 'react';
import { BASE_URL } from '@/api/api';
import { imageConfig } from "@/utils/corsConfig";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EditDialogs = ({
    dialogs,
    setDialogs,
    form,
    handleFormChange,
    handleUpdate,
    specializations,
    instructors,
    courses,
    courseLevels,
    getCourseName,
    isSubmitting
}) => {
    // Ensure specializations is always an array
    const specializationsArray = Array.isArray(specializations) ? specializations : [];
    const closeDialog = (dialogName) => {
        setDialogs(prev => ({ ...prev, [dialogName]: false }));
    };

    return (
        <>
            {/* Edit Specialization Dialog */}
            <Dialog open={dialogs.editSpecialization} onOpenChange={(open) => setDialogs(p => ({ ...p, editSpecialization: open }))}>
                <DialogContent>
                    <DialogHeader className="items-center"><DialogTitle>تعديل الاختصاص</DialogTitle><DialogDescription>تعديل بيانات الاختصاص</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-spec-name">اسم الاختصاص</Label>
                            <Input 
                                id="edit-spec-name"
                                placeholder="اسم الاختصاص" 
                                value={form.specialization.name || ''} 
                                onChange={(e) => handleFormChange('specialization', 'name', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-spec-image">الصورة</Label>
                            <Input 
                                id="edit-spec-image"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFormChange('specialization', 'image', e.target.files[0])} 
                            />
                            {form.specialization.imagePreview ? (
                                <div className="mt-2">
                                    <img 
                                        src={form.specialization.imagePreview} 
                                        alt="معاينة الصورة الجديدة" 
                                        className="max-h-40 rounded-md border object-contain" 
                                    />
                                </div>
                            ) : form.specialization.imageUrl ? (
                                <div className="mt-2">
                                    {console.log('Image URL:', `${BASE_URL}${form.specialization.imageUrl}`)}
                                    <img 
                                        src={`${BASE_URL}${form.specialization.imageUrl}`} 
                                        alt={`صورة ${form.specialization.name || 'الاختصاص'}`}
                                        className="max-h-40 rounded-md border object-contain" 
                                        {...imageConfig}
                                        onError={(e) => {
                                            console.error('Error loading image:', e.target.src);
                                            e.target.onerror = null;
                                            e.target.src = '/tallaam_logo2.png';
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">لا توجد صورة</p>
                                </div>
                            )}
                        </div>
                        <Button 
                            onClick={() => handleUpdate('specialization')} 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Instructor Dialog */}
            <Dialog open={dialogs.editInstructor} onOpenChange={(open) => setDialogs(p => ({ ...p, editInstructor: open }))}>
                <DialogContent>
                    <DialogHeader><DialogTitle>تعديل المدرس</DialogTitle><DialogDescription>تعديل بيانات المدرس</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-instructor-spec">الاختصاص</Label>
                            <Select 
                                value={form.instructor.specializationId?.toString() || ''} 
                                onValueChange={(v) => handleFormChange('instructor', 'specializationId', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="اختر اختصاص المدرس" /></SelectTrigger>
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
                        <div className="space-y-2">
                            <Label htmlFor="edit-instructor-name">اسم المدرس</Label>
                            <Input 
                                id="edit-instructor-name"
                                placeholder="اسم المدرس" 
                                value={form.instructor.name || ''} 
                                onChange={(e) => handleFormChange('instructor', 'name', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-instructor-bio">السيرة الذاتية</Label>
                            <Textarea 
                                id="edit-instructor-bio"
                                placeholder="السيرة الذاتية" 
                                value={form.instructor.bio || ''} 
                                onChange={(e) => handleFormChange('instructor', 'bio', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-instructor-avatar">الصورة الشخصية</Label>
                            <Input
                                id="edit-instructor-avatar"
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        handleFormChange('instructor', 'avatarUrl', file.name);
                                    }
                                }}
                            />
                        </div>
                        <Button onClick={() => handleUpdate('instructor')}>حفظ التعديلات</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog open={dialogs.editCourse} onOpenChange={(open) => setDialogs(p => ({ ...p, editCourse: open }))}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>تعديل الدورة</DialogTitle><DialogDescription>تعديل بيانات الدورة</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-course-title">عنوان الدورة</Label>
                            <Input 
                                id="edit-course-title"
                                placeholder="عنوان الدورة" 
                                value={form.course.title || ''} 
                                onChange={(e) => handleFormChange('course', 'title', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-course-description">وصف الدورة</Label>
                            <Textarea 
                                id="edit-course-description"
                                placeholder="وصف الدورة" 
                                value={form.course.description || ''} 
                                onChange={(e) => handleFormChange('course', 'description', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-course-specialization">الاختصاص</Label>
                            <Select 
                                value={form.course.specializationId?.toString() || ''} 
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
                        <Button onClick={() => handleUpdate('course')}>حفظ التعديلات</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Level Dialog */}
            <Dialog open={dialogs.editLevel} onOpenChange={(open) => setDialogs(p => ({ ...p, editLevel: open }))}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader><DialogTitle>تعديل المستوى</DialogTitle><DialogDescription>تعديل بيانات المستوى</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-level-name">عنوان المستوى</Label>
                            <Input 
                                id="edit-level-name"
                                placeholder="عنوان المستوى" 
                                value={form.level.title || ''} 
                                onChange={(e) => handleFormChange('level', 'title', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-level-order">الترتيب</Label>
                            <Input
                                id="edit-level-order"
                                type="number"
                                placeholder="الترتيب"
                                value={form.level.order || ''}
                                onChange={(e) => handleFormChange('level', 'order', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-level-instructor">المدرس</Label>
                            <Select 
                                value={form.level.instructorId?.toString() || ''} 
                                onValueChange={(v) => handleFormChange('level', 'instructorId', v)}
                            >
                                <SelectTrigger><SelectValue placeholder="اختر المدرس" /></SelectTrigger>
                                <SelectContent>
                                    {Array.isArray(instructors) && instructors.length > 0 ? (
                                        instructors.map(i => (
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
                        <Button onClick={() => handleUpdate('level')}>حفظ التعديلات</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Lesson Dialog */}
            <Dialog open={dialogs.editLesson} onOpenChange={(open) => setDialogs(p => ({ ...p, editLesson: open }))}>
                <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>تعديل الدرس</DialogTitle><DialogDescription>تعديل بيانات الدرس</DialogDescription></DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="edit-lesson-title">عنوان الدرس</Label>
                            <Input 
                                id="edit-lesson-title"
                                placeholder="عنوان الدرس" 
                                value={form.lesson.title || ''} 
                                onChange={(e) => handleFormChange('lesson', 'title', e.target.value)} 
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-lesson-description">وصف الدرس</Label>
                            <Textarea
                                id="edit-lesson-description"
                                placeholder="وصف الدرس"
                                value={form.lesson.description || ''}
                                onChange={(e) => handleFormChange('lesson', 'description', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-lesson-youtube-url">رابط يوتيوب</Label>
                            <Input
                                id="edit-lesson-youtube-url"
                                placeholder="رابط يوتيوب"
                                value={form.lesson.youtubeUrl || ''}
                                onChange={(e) => handleFormChange('lesson', 'youtubeUrl', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="edit-lesson-youtube-id">معرف يوتيوب (YouTube ID)</Label>
                            <Input
                                id="edit-lesson-youtube-id"
                                placeholder="معرف يوتيوب (YouTube ID)"
                                value={form.lesson.youtubeId || ''}
                                onChange={(e) => handleFormChange('lesson', 'youtubeId', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-lesson-duration">المدة بالثواني</Label>
                                <Input
                                    id="edit-lesson-duration"
                                    type="number"
                                    placeholder="المدة بالثواني"
                                    value={form.lesson.durationSec || ''}
                                    onChange={(e) => handleFormChange('lesson', 'durationSec', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-lesson-order">الترتيب</Label>
                                <Input
                                    id="edit-lesson-order"
                                    type="number"
                                    placeholder="الترتيب"
                                    value={form.lesson.orderIndex || ''}
                                    onChange={(e) => handleFormChange('lesson', 'orderIndex', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="edit-lesson-preview"
                                checked={form.lesson.isFreePreview || false}
                                onCheckedChange={(checked) => handleFormChange('lesson', 'isFreePreview', checked)}
                            />
                            <Label htmlFor="edit-lesson-preview">معاينة مجانية</Label>
                        </div>
                        <Button onClick={() => handleUpdate('lesson')}>حفظ التعديلات</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default EditDialogs;