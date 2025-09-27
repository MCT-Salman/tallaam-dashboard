import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";

const SpecializationManager = ({ 
    specializations, 
    form, 
    handleFormChange, 
    handleAdd, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete 
}) => {
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
                                    value={form.specialization.name || ''}
                                    onChange={(e) => handleFormChange('specialization', 'name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="spec-slug">الرابط المختصر (Slug)</Label>
                                <Input
                                    id="spec-slug"
                                    placeholder="مثال: computer-science"
                                    value={form.specialization.slug || ''}
                                    onChange={(e) => handleFormChange('specialization', 'slug', e.target.value)}
                                />
                            </div>
                        </div>
                        <Button onClick={() => handleAdd('specialization')}>حفظ</Button>
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