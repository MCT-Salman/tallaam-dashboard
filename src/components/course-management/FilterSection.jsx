import React from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const FilterSection = ({ 
    filters, 
    setFilters, 
    specializations 
}) => {
    return (
        <Card className="p-4">
            <h3 className="text-lg font-semibold mb-3">الفلاتر</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select 
                    value={filters.specialization} 
                    onValueChange={(v) => setFilters(prev => ({ ...prev, specialization: v }))}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="فلترة حسب الاختصاص" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">جميع الاختصاصات</SelectItem>
                        {specializations.map(s => (
                            <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                
                <Input
                    placeholder="البحث في الدورات..."
                    value={filters.course}
                    onChange={(e) => setFilters(prev => ({ ...prev, course: e.target.value }))}
                />
                
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="activeOnly"
                        checked={filters.activeOnly}
                        onCheckedChange={(checked) => setFilters(prev => ({ ...prev, activeOnly: checked }))}
                    />
                    <label htmlFor="activeOnly">النشطة فقط</label>
                </div>
                
                <Button variant="outline" onClick={() => setFilters({ specialization: "", instructor: "", course: "", activeOnly: false })}>
                    إعادة تعيين
                </Button>
            </div>
        </Card>
    );
};

export default FilterSection;