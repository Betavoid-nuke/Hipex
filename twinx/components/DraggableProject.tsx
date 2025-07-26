
// /twinx/components/DraggableProject.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import { DraggingProject, Project } from '../lib/types';
import ProjectCard from '../views/ProjectCard'; // Assuming ProjectCard is in views

interface DraggableProjectProps {
    draggingProject: DraggingProject | null;
    setDraggingProject: (project: DraggingProject | null) => void;
    onDelete: (project: Project) => void;
}

const DraggableProjectComponent = ({ draggingProject, setDraggingProject, onDelete }: DraggableProjectProps) => {
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [isOverTrash, setIsOverTrash] = useState(false);
    const [isCardOverZone, setIsCardOverZone] = useState(false);
    const trashRef = useRef<HTMLDivElement>(null);
    const draggedCardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingProject) return;

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        setDragPosition({
            x: mouseX - draggingProject.offsetX,
            y: mouseY - draggingProject.offsetY,
        });

        const trashRect = trashRef.current?.getBoundingClientRect();
        const cardRect = draggedCardRef.current?.getBoundingClientRect();

        const isMouseOverTrash = trashRect ? (mouseX >= trashRect.left && mouseX <= trashRect.right && mouseY >= trashRect.top && mouseY <= trashRect.bottom) : false;
        setIsOverTrash(isMouseOverTrash);

        const isCardOverlapping = cardRect && trashRect ? !(cardRect.right < trashRect.left || cardRect.left > trashRect.right || cardRect.bottom < trashRect.top || cardRect.top > trashRect.bottom) : false;
        setIsCardOverZone(isCardOverlapping);

    }, [draggingProject]);

    const handleMouseUp = useCallback(() => {
        if (isOverTrash && draggingProject) {
            onDelete(draggingProject);
        }
        setDraggingProject(null);
        setIsOverTrash(false);
        setIsCardOverZone(false);
    }, [isOverTrash, draggingProject, onDelete, setDraggingProject]);

    useEffect(() => {
        if (draggingProject) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingProject, handleMouseMove, handleMouseUp]);

    if (!draggingProject) return null;

    return (
        <>
            <div
                ref={draggedCardRef}
                className={`fixed z-50 transform-gpu transition-opacity duration-300 ${isCardOverZone ? 'opacity-30' : ''}`}
                style={{
                    left: dragPosition.x,
                    top: dragPosition.y,
                    width: draggingProject.width,
                    height: draggingProject.height,
                }}
            >
                <div className="rotate-3 shadow-2xl">
                    {/* A simplified card view for dragging to avoid circular dependencies */}
                     <div className="bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#4A4A4C] h-full">
                        <img src={draggingProject.thumbnail || 'https://placehold.co/400x225/262629/3A3A3C?text=No+Preview'} alt={draggingProject.title} className="w-full h-40 object-cover" />
                        <div className="p-4">
                             <h3 className="font-bold text-white truncate">{draggingProject.title}</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-4 transition-opacity duration-300 z-50 ${draggingProject ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div
                    ref={trashRef}
                    className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out ${isOverTrash ? 'bg-red-500 scale-125' : 'bg-[#3A3A3C]'}`}
                >
                    <Trash2 size={40} className={`transition-colors duration-300 ${isOverTrash ? 'text-white' : 'text-[#A0A0A5]'}`} />
                </div>
            </div>
        </>
    );
};

export default DraggableProjectComponent;