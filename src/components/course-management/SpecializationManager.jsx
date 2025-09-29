import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { createSpecialization } from "@/api/api";

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

    const onImageChange = (e) => {
        const file = e.target.files?.[0];
        setImageFile(file || null);
        setImagePreview(file ? URL.createObjectURL(file) : null);
    };

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
                alert('تم إنشاء التخصص بنجاح');
                // Reset form fields locally
                handleFormChange('specialization', 'name', '');
                setImageFile(null);
                setImagePreview(null);
                // Optionally, you might refresh the list externally
            } else {
                alert(payload?.message || 'فشل إنشاء التخصص');
            }
        } catch (err) {
            alert(err?.response?.data?.message || 'فشل إنشاء التخصص');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>1. الاختصاصات</CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm">إضافة<Plus className="w-4 h-4 ml-1" /> </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader className="items-center">
                            <DialogTitle>إضافة اختصاص جديد</DialogTitle>
                            <DialogDescription>أضف اختصاص جديد</DialogDescription>
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
                                <Label htmlFor="spec-image">الصورة</Label>
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
            <CardContent className="space-y-2">
                {specializations.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                            <span>{item.name}</span>
                            {item.slug && <p className="text-sm text-muted-foreground">{item.slug}</p>}
                        </div>
                        <div className="flex gap-1">
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                                {item.isActive ? "نشط" : "معطل"}
                            </Badge>
                            <Button size="icon" variant="ghost" onClick={() => handleToggleActive('specialization', item.id)}>
                                {item.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openEditDialog('specialization', item)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete('specialization', item.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default SpecializationManager;