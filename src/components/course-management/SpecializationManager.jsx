// src\components\course-management\SpecializationManager.jsx
import React, {useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { showSuccessToast, showErrorToast } from '@/hooks/useToastMessages';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { createSpecialization, BASE_URL } from "@/api/api";
import { imageConfig } from "@/utils/corsConfig";

const SpecializationManager = ({ 
    specializations, 
    form, 
    handleFormChange, 
    // handleAdd, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete,
    loading,
    error,
    fetchSpecializations
}) => {
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemId: null, itemName: '' });

    // console.log("specializations form form page: "+ specializations.map(item => {item.name}));

    // تغيير الصورة
    const onImageChange = (e) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

    // حفظ اختصاص جديد
    const handleSave = async () => {
        const name = (form?.specialization?.name || "").trim();
        if (!name) {
            showErrorToast('يرجى إدخال اسم الاختصاص');
            return;
        }
        if (!imageFile) {
            showErrorToast('يرجى اختيار صورة للاختصاص');
            return;
        }
        try {
            setSubmitting(true);
            const res = await createSpecialization(name, imageFile);
            const payload = res?.data;
            if (payload?.success && payload?.data) {
                showSuccessToast('تم إنشاء التخصص بنجاح');
                // إعادة تعيين النموذج
                handleFormChange('specialization', 'name', '');
                setImageFile(null);
                setImagePreview(null);
                // تحديث القائمة
                await fetchSpecializations();
                // إغلاق الديالوج
                setIsDialogOpen(false);
            } else {
                showErrorToast(payload?.message || 'فشل إنشاء التخصص');
            }
        } catch (err) {
            showErrorToast(err?.response?.data?.message || 'فشل إنشاء التخصص');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            {/* العنوان + زر إضافة */}
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CardTitle> الاختصاصات</CardTitle>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={fetchSpecializations}
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : 'تحديث'}
                    </Button>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            إضافة <Plus className="w-4 h-4 ml-1" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="items-center">
                            <DialogTitle>إضافة اختصاص جديد</DialogTitle>
                            <DialogDescription>أدخل بيانات الاختصاص</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="spec-name">اسم الاختصاص *</Label>
                                <Input
                                    id="spec-name"
                                    placeholder="مثال: معلوماتية، هندسة، طب"
                                    value={form?.specialization?.name || ''}
                                    onChange={(e) => handleFormChange('specialization', 'name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="spec-image">الصورة *</Label>
                                <Input id="spec-image" type="file" accept="image/*" onChange={onImageChange} />
                                {imagePreview && (
                                    <div className="mt-2">
                                        <img src={imagePreview} alt="معاينة" className="max-h-40 rounded-md border" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button onClick={handleSave} disabled={submitting} className="cursor-pointer">
                            {submitting ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                    </DialogContent>
                </Dialog>
            </CardHeader>

            {/* الجدول */}
            <CardContent>
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-red-800 font-medium">{error}</p>
                            <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={fetchSpecializations}
                                disabled={loading}
                            >
                                إعادة المحاولة
                            </Button>
                        </div>
                    </div>
                )}
                
                {loading && (
                    <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                )}
                
                {!loading && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>الصورة</TableHead>
                                <TableHead>الاسم</TableHead>
                                <TableHead>الحالة</TableHead>
                                <TableHead className="text-right">الإجراءات</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(specializations) && specializations.length > 0 ? specializations.map(item => {
                                const id = item.id;
                                
                                return id ? (
                                    <TableRow key={id}>
                                        <TableCell>
                                            <img 
                                                src={`${BASE_URL}${item.imageUrl}`}  
                                                alt={item.name} 
                                                className="w-12 h-12 object-contain rounded-md" 
                                                {...imageConfig}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/tallaam_logo2.png';
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{item.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={item.isActive ? "default" : "secondary"}>
                                                {item.isActive ? "نشط" : "معطل"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={() => handleToggleActive('specialization', id)}
                                            >
                                                {item.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="ghost" 
                                                onClick={() => openEditDialog('specialization', item)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                size="icon" 
                                                variant="destructive" 
                                                onClick={() => setDeleteDialog({ 
                                                    isOpen: true, 
                                                    itemId: id,
                                                    itemName: item.name 
                                                })}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ) : null;
                            }) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                                        لا توجد تخصصات متاحة
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>

            {/* ديالوج تأكيد الحذف */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => setDeleteDialog(prev => ({ ...prev, isOpen }))}>
                <AlertDialogContent className="text-right">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-right mb-2">هل أنت متأكد من حذف هذا الاختصاص؟</AlertDialogTitle>
                        <AlertDialogDescription className="text-right" dir="rtl">
                            سيتم حذف الاختصاص "{deleteDialog.itemName}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter dir="rtl" className="flex flex-row-reverse justify-start gap-2">
                        <AlertDialogAction 
                            className="bg-red-500 hover:bg-red-600"
                            onClick={async () => {
                                await handleDelete('specialization', deleteDialog.itemId);
                                setDeleteDialog({ isOpen: false, itemId: null, itemName: '' });
                            }}
                        >
                            حذف
                        </AlertDialogAction>
                        <AlertDialogCancel 
                            onClick={() => setDeleteDialog({ isOpen: false, itemId: null, itemName: '' })}
                        >
                            إلغاء
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
};

export default SpecializationManager;
