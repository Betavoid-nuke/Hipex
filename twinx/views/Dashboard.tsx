// /twinx/views/Dashboard.tsx
'use client';

import { useState } from 'react';
import { Plus, Search, Briefcase } from 'lucide-react';
import { Project, DraggingProject } from '../lib/types';
import ProjectCard from '../components/ProjectCard';

interface DashboardProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNewProject: () => void;
  setDraggingProject: (project: DraggingProject | null) => void;
  onSetProjectToDelete: (project: Project) => void;
  onSetIsDeleteModalOpen: (isOpen: boolean) => void;
  showNotification: (message: string) => void;
}

const Dashboard = ({ projects, onSelectProject, onNewProject, setDraggingProject, onSetProjectToDelete, onSetIsDeleteModalOpen, showNotification }: DashboardProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('All');
    const [sort, setSort] = useState('date_desc');

    const hasProjects = projects.length > 0;

    return (
        <div className="p-8 text-text-primary">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-3">
                    <Briefcase size={28}/> Digital Twins
                </h1>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-48 pl-10 pr-4 py-2"
                        />
                    </div>
                    <select value={filter} onChange={e => setFilter(e.target.value)} className="w-32">
                        <option value="All">All</option>
                        <option value="Favorites">Favorites</option>
                    </select>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="w-32">
                        <option value="date_desc">Newest</option>
                        <option value="date_asc">Oldest</option>
                        <option value="name_asc">Name (A-Z)</option>
                        <option value="name_desc">Name (Z-A)</option>
                    </select>

                    <button onClick={onNewProject} className="bg-accent text-white font-semibold py-2 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2">
                        <Plus size={20} /> New Digital Twin
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="min-h-[70vh] flex items-center justify-center">
                {!hasProjects ? (
                    <div className="text-center text-text-muted">
                        <h2 className="text-lg font-semibold text-text-primary">No Digital Twins found.</h2>
                        <p className="mt-1 text-sm">Click "New Digital Twin" to get started.</p>
                    </div>
                ) : (
                    <div className="w-full h-full p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {projects.map(project => (
                             <ProjectCard
                                key={project.id}
                                project={project}
                                onSelectProject={onSelectProject}
                                setDraggingProject={setDraggingProject}
                                showNotification={showNotification}
                                onDeleteClick={(p) => { onSetProjectToDelete(p); onSetIsDeleteModalOpen(true); }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;