import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { createSpecialization,BASE_URL,getSpecializations  } from "@/api/api";

const SpecializationManager = ({ 
    specializations, 
    form, 
    handleFormChange, 
    handleAdd, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete 
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
                <CardTitle>📚 الاختصاصات</CardTitle>
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
                        {getSpecializations.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <img 
                                        src={`${BASE_URL}${item.imageUrl}`}  
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded-md border" 
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
                                        onClick={() => handleToggleActive('specialization', item.id)}
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
                                        onClick={() => handleDelete('specialization', item.id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default SpecializationManager;
