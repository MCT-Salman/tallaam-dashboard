import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { createSpecialization, BASE_URL } from "@/api/api";

const SpecializationManager = ({ 
    specializations, 
    form, 
    handleFormChange, 
    handleAdd, 
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
            alert('يرجى إدخال اسم الاختصاص');
            return;
        }
        if (!imageFile) {
            alert('يرجى اختيار صورة للاختصاص');
            return;
        }
        try {
            setSubmitting(true);
            const res = await createSpecialization(name, imageFile);
            const payload = res?.data;
            if (payload?.success && payload?.data) {
                alert('✅ تم إنشاء التخصص بنجاح');
                handleFormChange('specialization', 'name', '');
                setImageFile(null);
                setImagePreview(null);
                // يمكنك تحديث القائمة من الـ API هنا لو حبيت
            } else {
                alert(payload?.message || '❌ فشل إنشاء التخصص');
            }
        } catch (err) {
            alert(err?.response?.data?.message || '❌ فشل إنشاء التخصص');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            {/* العنوان + زر إضافة */}
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center space-x-2">
                    <CardTitle>📚 الاختصاصات</CardTitle>
                    <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={fetchSpecializations}
                        disabled={loading}
                    >
                        {loading ? 'جاري التحميل...' : 'تحديث'}
                    </Button>
                </div>
                <Dialog>
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
                                const id = item.id || item._id;
                                return id ? (
                                    <TableRow key={id}>
                                        <TableCell>
                                            <img 
                                                src={`${BASE_URL}${item.imageUrl}`}  
                                                alt={item.name} 
                                                className="w-12 h-12 object-cover rounded-md border" 
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
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
                                                onClick={() => handleDelete('specialization', id)}
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
        </Card>
    );
};

export default SpecializationManager;
