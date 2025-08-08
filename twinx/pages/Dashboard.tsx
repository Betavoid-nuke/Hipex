import { Briefcase, Plus, Search } from "lucide-react";
import ProjectCard from "../components/ProjectCard";


interface props {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    filter: string;
    setFilter: (filter: string) => void;
    sort: string;
    setSort: (sort: string) => void;
    filteredAndSortedProjects: any[];
    setIsModalOpen: (isOpen: boolean) => void;
    draggingProject: any;
    setDraggingProject: (project: any) => void;
    activeDropdown: string | null;
    handleSelectProject: (project: any) => void;
    handleDeleteClick: (project: any) => void;
    toggleFavorite: (id: string, isFavorite: boolean) => void;
    setActiveDropdown: (id: string | null) => void;
    copyToClipboard: (text: string, message: string) => void;
    togglePublish: (id: string, isPublished: boolean) => void;
    dropdownRef?: React.RefObject<HTMLDivElement>;
}
    
export default function DashboardCore({searchTerm, setSearchTerm, filter, setFilter, sort, setSort, filteredAndSortedProjects, setIsModalOpen, draggingProject, setDraggingProject, activeDropdown, handleSelectProject, handleDeleteClick, toggleFavorite, setActiveDropdown, copyToClipboard, togglePublish, dropdownRef  }: props) {

        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center gap-3"><Briefcase size={28}/> Digital Twins</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A5]" size={20} />
                            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                   className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-full sm:w-48" />
                        </div>
                        <div className="flex gap-2">
                            <select value={filter} onChange={e => setFilter(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
                                <option value="All">All</option>
                                <option value="Favorites">Favorites</option>
                            </select>
                            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]">
                                <option value="date_desc">Newest</option>
                                <option value="date_asc">Oldest</option>
                                <option value="name_asc">Name (A-Z)</option>
                                <option value="name_desc">Name (Z-A)</option>
                            </select>
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
                            <Plus size={20} /> New Digital Twin
                        </button>
                    </div>
                </header>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredAndSortedProjects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            setDraggingProject={setDraggingProject}
                            isDragging={draggingProject?.id === project.id}
                            activeDropdown={activeDropdown}
                            handleSelectProject={handleSelectProject}
                            handleDeleteClick={handleDeleteClick}
                            toggleFavorite={toggleFavorite}
                            setActiveDropdown={setActiveDropdown}
                            copyToClipboard={copyToClipboard}
                            togglePublish= {togglePublish}
                            dropdownRef={dropdownRef}
                        />
                    ))}
                </div>
                 {filteredAndSortedProjects.length === 0 && (
                    <div className="text-center py-20 text-[#A0A0A5] col-span-full">
                        <p>No Digital Twins found.</p>
                        <p>Click "New Digital Twin" to get started.</p>
                    </div>
                )}
            </div>
        );
    };