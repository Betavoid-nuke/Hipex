// /twinx/views/ProjectCard.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Project, DraggingProject } from '../lib/types';
import { TOTAL_STEPS } from '../lib/constants';
import { doc, updateDoc } from 'firebase/firestore';
import { db, appId } from '../lib/firebase';
import { getAuth } from 'firebase/auth';

interface ProjectCardProps {
    project: Project;
    onSelectProject: (project: Project) => void;
    setDraggingProject: (project: DraggingProject | null) => void;
    showNotification: (message: string) => void;
    onDeleteClick: (project: Project) => void;
}

const ProjectCard = ({ project, onSelectProject, setDraggingProject, showNotification, onDeleteClick }: ProjectCardProps) => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    const progress = (project.currentStep / TOTAL_STEPS) * 100;
    const isDropdownOpen = activeDropdown === project.id;

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userId) return;
        const projectPath = `/artifacts/${appId}/users/${userId}/projects`;
        await updateDoc(doc(db, projectPath, project.id), { isFavorite: !project.isFavorite });
    };

    const togglePublish = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!userId) return;
        const projectPath = `/artifacts/${appId}/users/${userId}/projects`;
        await updateDoc(doc(db, projectPath, project.id), { isPublished: !project.isPublished });
        setActiveDropdown(null);
    };

    const handleCopyId = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(project.twinxid);
        showNotification('Twinx ID copied!');
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || dropdownRef.current?.contains(e.target as Node)) return;

        let dragStarted = false;
        const startPos = { x: e.clientX, y: e.clientY };

        const onMove = (moveEvent: MouseEvent) => {
            const dx = Math.abs(moveEvent.clientX - startPos.x);
            const dy = Math.abs(moveEvent.clientY - startPos.y);

            if (!dragStarted && (dx > 5 || dy > 5)) {
                dragStarted = true;
                const rect = cardRef.current!.getBoundingClientRect();
                setDraggingProject({
                    ...project,
                    offsetX: moveEvent.clientX - rect.left,
                    offsetY: moveEvent.clientY - rect.top,
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        const onUp = (upEvent: MouseEvent) => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
            if (!dragStarted && !(upEvent.target as HTMLElement).closest('.more-options-button')) {
                onSelectProject(project);
            }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp, { once: true });
    };
    
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    return (
        <div
            ref={cardRef}
            onMouseDown={handleMouseDown}
            className="bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3C] flex flex-col transition-all duration-200 h-full cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:border-[#4A4A4C]"
        >
            <div className="relative">
                <img src={project.thumbnail || 'https://placehold.co/400x225/262629/3A3A3C?text=No+Preview'} alt={project.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2">
                    <button onClick={toggleFavorite}
                            className={`p-1.5 rounded-full transition-colors ${project.isFavorite ? 'text-yellow-400 bg-black/50' : 'text-[#A0A0A5] bg-black/50 hover:text-yellow-400'}`}>
                        <Star size={18} fill={project.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white pr-2 flex-1">{project.title}</h3>
                    <div className="relative more-options-button" ref={dropdownRef}>
                        <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(isDropdownOpen ? null : project.id)}} className="text-[#A0A0A5] hover:text-white p-1">
                            <MoreVertical size={20} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#3A3A3C] border border-[#4A4A4C] rounded-md shadow-xl z-20">
                                <a href="#" onClick={togglePublish} className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#4A4A4C]">{project.isPublished ? <EyeOff size={16}/> : <Eye size={16}/>} {project.isPublished ? 'Unpublish' : 'Publish'}</a>
                                <a href="#" onClick={(e) => { e.stopPropagation(); onDeleteClick(project); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#4A4A4C]"><Trash2 size={16}/> Delete</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A0A0A5] font-mono mb-3">
                    <span className="truncate">{project.twinxid}</span>
                    <Copy size={14} className="hover:text-white shrink-0 cursor-pointer" onClick={handleCopyId}/>
                </div>
                <div className="mt-auto">
                    <div className="w-full bg-[#3A3A3C] rounded-full h-2 mb-1">
                        <div className="bg-[#6366F1] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-[#A0A0A5] text-right">{project.currentStep}/{TOTAL_STEPS} Steps</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;