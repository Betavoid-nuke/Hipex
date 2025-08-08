"use client";
import { Timestamp } from "firebase/firestore";
import dataManager from "../data/data";
import { useRef } from "react";
import { Copy, Eye, EyeOff, MoreVertical, Star, Trash2 } from "lucide-react";


interface Project {
    id: string;
    title: string;
    twinxid: string;
    thumbnail: string;
    videoUrl: string;
    isFavorite: boolean;
    isPublished: boolean;
    currentStep: number;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

interface DraggingProject extends Project {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}

interface props {
    project?: Project;
    setDraggingProject: (project: DraggingProject | null) => void;
    isDragging: boolean;
    activeDropdown: string | null;
    setActiveDropdown: (id: string | null) => void;
    handleSelectProject: (project: Project) => void;
    handleDeleteClick: (project: Project) => void;
    toggleFavorite: (id: string, isFavorite: boolean) => void;
    copyToClipboard: (text: string, message: string) => void;
    togglePublish: (id: string, isPublished: boolean) => void;
    dropdownRef?: React.RefObject<HTMLDivElement>;
}


export default function ProjectCardCore({ project, setDraggingProject, isDragging, activeDropdown, handleSelectProject, handleDeleteClick, toggleFavorite, setActiveDropdown, copyToClipboard, togglePublish, dropdownRef }: props) {
    
    if(!project){return null;} // Ensure project is defined before proceeding

    const Data = dataManager();
    const progress = (project.currentStep / Data.TotalPipelineSteps) * 100;
    const isDropdownOpen = activeDropdown === project.id;   
    const cardRef = useRef<HTMLDivElement>(null);
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || activeDropdown) return;
        let startPos = { x: e.clientX, y: e.clientY };
        let dragStarted = false;
        
        const onMove = (moveEvent: MouseEvent) => {
            const dx = Math.abs(moveEvent.clientX - startPos.x);
            const dy = Math.abs(moveEvent.clientY - startPos.y);
            if (!dragStarted && (dx > 5 || dy > 5) && cardRef.current) {
                dragStarted = true;
                const rect = cardRef.current.getBoundingClientRect();
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
            if (!dragStarted) {
                 if (!(upEvent.target as Element).closest('.more-options-button')) {
                    handleSelectProject(project);
                }
            }
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp, { once: true });
    };
    
    return (
         <div 
            ref={cardRef}
            onMouseDown={handleMouseDown}
            className={`bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3C] flex flex-col transition-all duration-200 h-full cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:border-[#4A4A4C] ${isDragging ? 'opacity-0' : 'opacity-100'}`}
         >
            <div className="relative">
                <img src={project.thumbnail || 'https://placehold.co/400x225/262629/3A3A3C?text=No+Preview'} alt={project.title} className="w-full h-40 object-cover" />
                <div className="absolute top-2 right-2">
                    <button onClick={(e) => { e.stopPropagation(); toggleFavorite(project.id, project.isFavorite); }}
                            className={`p-1.5 rounded-full transition-colors ${project.isFavorite ? 'text-yellow-400 bg-black/50' : 'text-[#A0A0A5] bg-black/50 hover:text-yellow-400'}`}>
                        <Star size={18} fill={project.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-white pr-2 flex-1">{project.title}</h3>
                    <div className="relative more-options-button" ref={isDropdownOpen ? dropdownRef : null}>
                        <button onClick={(e) => { e.stopPropagation(); setActiveDropdown(isDropdownOpen ? null : project.id)}} className="text-[#A0A0A5] hover:text-white p-1">
                            <MoreVertical size={20} />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#3A3A3C] border border-[#4A4A4C] rounded-md shadow-xl z-20">
                                <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); togglePublish(project.id, project.isPublished); }} className="flex items-center gap-3 px-4 py-2 text-sm text-white hover:bg-[#4A4A4C]">{project.isPublished ? <EyeOff size={16}/> : <Eye size={16}/>} {project.isPublished ? 'Unpublish' : 'Publish'}</a>
                                <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDeleteClick(project); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-[#4A4A4C]"><Trash2 size={16}/> Delete</a>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#A0A0A5] font-mono mb-3">
                    <span className="truncate">{project.twinxid}</span>
                    <Copy size={14} className="hover:text-white shrink-0 cursor-pointer" onClick={(e) => { e.stopPropagation(); copyToClipboard(project.twinxid, 'Twinx ID copied!'); }}/>
                </div>
                <div className="mt-auto">
                    <div className="w-full bg-[#3A3A3C] rounded-full h-2 mb-1">
                        <div className="bg-[#6366F1] h-2 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs text-[#A0A0A5] text-right">{project.currentStep}/{Data.TotalPipelineSteps} Steps</p>
                </div>
            </div>
        </div>
    );

};