// src\components\course-management\InstructorManager.jsx
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Play, Pause } from "lucide-react";
import { getInstructors, createInstructor, updateInstructor, toggleInstructorStatus, deleteInstructor } from "@/api/api";
import { BASE_URL } from "@/api/api";
import { showSuccessToast, showErrorToast } from '@/hooks/useToastMessages';
import { imageConfig } from "@/utils/corsConfig";

const InstructorManager = ({ specializations, getSpecializationName }) => {
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, itemId: null, itemName: '' });
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ instructor: {} });
  const [editMode, setEditMode] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  // جلب المدرسين من الباك
  const fetchInstructors = async () => {
    setLoading(true);
    try {
      const res = await getInstructors();
      console.log('استجابة جلب المدرسين:', res);
      // استخراج البيانات الحقيقية من الكونسل
      let data = [];
      if (res?.data?.data?.data && Array.isArray(res.data.data.data)) {
        data = res.data.data.data;
      } else if (res?.data?.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      } else if (res?.data && Array.isArray(res.data)) {
        data = res.data;
      } else if (Array.isArray(res)) {
        data = res;
      }
      setInstructors(data);
    } catch (err) {
      setInstructors([]); // في حال الخطأ، اجعلها مصفوفة فارغة
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  // إضافة أو تعديل مدرب
  const handleSave = async () => {
    const data = form.instructor;
    try {
      setLoading(true);
      let specId = data.specializationId;
      if (typeof specId === "string") {
        specId = parseInt(specId, 10);
      }
      let res;
      if (imageFile) {
        const formData = new FormData();
        formData.append("name", data.name || "");
        formData.append("bio", data.bio || "");
        formData.append("specializationId", specId || "");
        formData.append("avatar", imageFile);
        if (editMode && data.id) {
          res = await updateInstructor(data.id, formData);
        } else {
          res = await createInstructor(formData);
        }
      } else {
        const payload = {
          name: data.name || "",
          bio: data.bio || "",
          specializationId: specId || "",
          avatarUrl: data.avatarUrl || ""
        };
        if (editMode && data.id) {
          res = await updateInstructor(data.id, payload);
        } else {
          res = await createInstructor(payload);
        }
      }
      if (res?.data?.success) {
        showSuccessToast(editMode ? "تم تحديث بيانات المدرس بنجاح" : "تم إضافة المدرس بنجاح");
      } else {
        showErrorToast(res?.data?.message || "فشل العملية");
      }
      setDialogOpen(false);
      setForm({ instructor: {} });
      setImageFile(null);
      setEditMode(false);
      fetchInstructors();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "فشل العملية");
    } finally {
      setLoading(false);
    }
  };

  // تفعيل / تعطيل مدرب
  const handleToggleActive = async (id) => {
    try {
      setLoading(true);
      const instructor = instructors.find((ins) => ins.id === id);
      if (!instructor) return;
      const res = await toggleInstructorStatus(id, !instructor.isActive);
      if (res?.data?.success) {
        showSuccessToast(!instructor.isActive ? "تم تفعيل المدرس" : "تم تعطيل المدرس");
      } else {
        showErrorToast(res?.data?.message || "فشل العملية");
      }
      fetchInstructors();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "فشل العملية");
    } finally {
      setLoading(false);
    }
  };

  // حذف مدرب
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await deleteInstructor(id);
      if (res?.data?.success) {
        showSuccessToast("تم حذف المدرس بنجاح");
      } else {
        showErrorToast(res?.data?.message || "فشل حذف المدرس");
      }
      fetchInstructors();
    } catch (err) {
      showErrorToast(err?.response?.data?.message || "فشل حذف المدرس");
    } finally {
      setLoading(false);
    }
  };

  // فتح نافذة التعديل
  const openEditDialog = (item) => {
    // تحويل specializationId إلى نص
    const specializationId = item.specializationId ? item.specializationId.toString() : "";
    // معاينة الصورة: إذا كان هناك رابط صورة، استخدم BASE_URL دائماً
    let avatarPreview = "";
    if (item.avatarUrl) {
      avatarPreview = item.avatarUrl.startsWith("http") ? item.avatarUrl : `${BASE_URL}${item.avatarUrl}`;
    }
    setForm({ instructor: { ...item, specializationId, avatarPreview } });
    setImageFile(null);
    setEditMode(true);
    setDialogOpen(true);
  };

  // تغيير قيم الفورم
  const handleFormChange = (section, key, value) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  // تغيير الصورة
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setForm((prev) => ({
        ...prev,
        instructor: {
          ...prev.instructor,
          avatarPreview: URL.createObjectURL(file)
        }
      }));
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>2. المدرسون</CardTitle>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => { setEditMode(false); setForm({ instructor: {} }); }}>
              <Plus className="w-4 h-4 ml-1" /> إضافة
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "تعديل بيانات المدرس" : "إضافة مدرس جديد"}</DialogTitle>
              <DialogDescription>{editMode ? "عدل بيانات المدرس" : "أضف مدرس جديد"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instructor-spec">الاختصاص *</Label>
                <Select
                  value={form.instructor.specializationId || ""}
                  onValueChange={(v) => handleFormChange("instructor", "specializationId", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر اختصاص المدرس" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(specializations) && specializations.map((s) => {
                      const id = s.id || s._id;
                      return id ? (
                        <SelectItem key={id} value={id.toString()}>{s.name}</SelectItem>
                      ) : null;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor-name">اسم المدرس *</Label>
                <Input
                  id="instructor-name"
                  placeholder="مثال: أحمد محمد"
                  value={form.instructor.name || ""}
                  onChange={(e) => handleFormChange("instructor", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor-bio">السيرة الذاتية</Label>
                <Textarea
                  id="instructor-bio"
                  placeholder="مثال: مدرس متخصص في علوم الحاسب مع خبرة 10 سنوات"
                  value={form.instructor.bio || ""}
                  onChange={(e) => handleFormChange("instructor", "bio", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructor-avatar">الصورة الشخصية</Label>
                <Input
                  id="instructor-avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {form.instructor.avatarPreview && (
                  <div className="mt-2">
                    <img
                      src={form.instructor.avatarPreview}
                      alt="معاينة"
                      className="w-16 h-16 rounded-full object-cover border"
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button onClick={handleSave}>{editMode ? "تحديث" : "حفظ"}</Button>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الصورة</TableHead>
              <TableHead>الاسم</TableHead>
              <TableHead>الاختصاص</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <>
                <TableRow>
                  <TableCell colSpan={5} className="text-center">جاري التحميل...</TableCell>
                </TableRow>
              </>
            ) : instructors.length === 0 ? (
              <>
                <TableRow>
                  <TableCell colSpan={5} className="text-center">لا يوجد مدربين</TableCell>
                </TableRow>
              </>
            ) : (
              <>
                {instructors.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="w-12 h-12 flex items-center justify-center">
                        <img
                          src={item.avatarUrl ? `${BASE_URL}${item.avatarUrl}` : "/tallaam_logo2.png"}
                          alt={item.name}
                          className="w-12 h-12 rounded-full border object-cover bg-white"
                          {...imageConfig}
                          onError={e => { e.target.onerror=null; e.target.src='/tallaam_logo2.png'; }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{getSpecializationName(item.specializationId)}</TableCell>
                    <TableCell>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "نشط" : "معطل"}
                  </Badge>
                </TableCell>
                <TableCell className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={() => handleToggleActive(item.id)}>
                    {item.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => openEditDialog(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => setDeleteDialog({ isOpen: true, itemId: item.id, itemName: item.name })}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
              </>
            )}
          </TableBody>
        </Table>
      </CardContent>
    {/* ديالوج تأكيد الحذف بنفس تنسيق الاختصاصات */}
    <AlertDialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => setDeleteDialog(prev => ({ ...prev, isOpen }))}>
      <AlertDialogContent className="text-right" dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right mb-2">هل أنت متأكد من حذف هذا المدرس؟</AlertDialogTitle>
          <AlertDialogDescription className="text-right" dir="rtl">
            سيتم حذف المدرس "{deleteDialog.itemName}" بشكل نهائي. لا يمكن التراجع عن هذا الإجراء.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter dir="rtl" className="flex flex-row-reverse justify-start gap-2">
          <AlertDialogAction 
            className="bg-red-500 hover:bg-red-600"
            onClick={async () => {
              await handleDelete(deleteDialog.itemId);
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

export default InstructorManager;