import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Edit, Trash2, Play, Pause, Plus } from "lucide-react";
import LessonManager from './LessonManager';

const LevelManager = ({ 
    level, 
    expandedLevels, 
    toggleLevelExpansion, 
    handleToggleActive, 
    openEditDialog, 
    handleDelete,
    getInstructorName,
    getLessons,
    setForm,
    setDialogs,
    fetchLessons
}) => {
    if (!level) {
        return null;
    }
    
    return (
        <div className="p-4 bg-muted/30 rounded-lg border">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleLevelExpansion(level.id)}
                            className="p-1 hover:bg-transparent"
                        >
                            {expandedLevels[level.id] ?
                                <ChevronDown className="w-4 h-4 text-primary" /> :
                                <ChevronRight className="w-4 h-4" />
                            }
                        </Button>
                        <h5 className="font-semibold cursor-pointer" onClick={() => toggleLevelExpansion(level.id)}>
                            {level.name}
                        </h5>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                        <span className="font-medium">المدرس:</span> {getInstructorName(level.instructorId)} |
                        <span className="mx-1 font-medium">الترتيب:</span> {level.order} |
                        <span className="mx-1 font-medium">السعر:</span> ${level.priceUSD || 0} / {level.priceSAR || 0} ر.س
                        {level.isFree && <Badge variant="outline" className="mr-1">مجاني</Badge>}
                    </p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                    <Badge variant={level.isActive ? "default" : "secondary"}>
                        {level.isActive ? "نشط" : "معطل"}
                    </Badge>
                    <Button size="icon" variant="ghost" onClick={() => handleToggleActive('level', level.id)}>
                        {level.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog('level', level)}>
                        <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="destructive" onClick={() => handleDelete('level', level.id)}>
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <Collapsible open={expandedLevels[level.id]} className="mt-2">
                <CollapsibleContent>
                    <LessonManager
                        level={level}
                        getLessons={getLessons}
                        setForm={setForm}
                        setDialogs={setDialogs}
                        handleToggleActive={handleToggleActive}
                        openEditDialog={openEditDialog}
                        handleDelete={handleDelete}
                    />
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default LevelManager;