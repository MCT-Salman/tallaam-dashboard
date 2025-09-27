import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";

const InstructorManager = ({ 
    instructors, 
    specializations, 
    form, 
    handleFormChange, 
    handleAdd, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete,
    getSpecializationName 
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>2. المدرسون</CardTitle>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm"><Plus className="w-4 h-4 ml-1" /> إضافة</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>إضافة مدرس جديد</DialogTitle>
                            <DialogDescription>أضف مدرس جديد</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="instructor-spec">الاختصاص *</Label>
                                <Select 
                                    value={form.instructor.specializationId || ''} 
                                    onValueChange={(v) => handleFormChange('instructor', 'specializationId', v)}
                                >
                                    <SelectTrigger><SelectValue placeholder="اختر اختصاص المدرس" /></SelectTrigger>
                                    <SelectContent>
                                        {specializations.map(s => (
                                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructor-name">اسم المدرس *</Label>
                                <Input
                                    id="instructor-name"
                                    placeholder="مثال: أحمد محمد"
                                    value={form.instructor.name || ''}
                                    onChange={(e) => handleFormChange('instructor', 'name', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructor-bio">السيرة الذاتية</Label>
                                <Textarea
                                    id="instructor-bio"
                                    placeholder="مثال: مدرس متخصص في علوم الحاسب مع خبرة 10 سنوات"
                                    value={form.instructor.bio || ''}
                                    onChange={(e) => handleFormChange('instructor', 'bio', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="instructor-avatar">الصورة الشخصية</Label>
                                <Input
                                    id="instructor-avatar"
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
                        </div>
                        <Button onClick={() => handleAdd('instructor')}>حفظ</Button>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent className="space-y-2">
                {instructors.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                            <p>{item.name}</p>
                            <p className="text-sm text-muted-foreground">{getSpecializationName(item.specializationId)}</p>
                        </div>
                        <div className="flex gap-1">
                            <Badge variant={item.isActive ? "default" : "secondary"}>
                                {item.isActive ? "نشط" : "معطل"}
                            </Badge>
                            <Button size="icon" variant="ghost" onClick={() => handleToggleActive('instructor', item.id)}>
                                {item.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => openEditDialog('instructor', item)}>
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="destructive" onClick={() => handleDelete('instructor', item.id)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

export default InstructorManager;