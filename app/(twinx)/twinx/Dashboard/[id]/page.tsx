import { Briefcase, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { DraggingProject, Project } from "@/twinx/types/TwinxTypes";
import ProjectCardCore from "@/twinx/components/ProjectCard";
import { useParams } from "next/navigation";
import NewProjectModal from "@/twinx/components/NewProjectModel";
import { copyToClipboard } from "@/twinx/utils/TwinxUtils";
import { getProjectsByUserId, updateProjectKeyById } from "@/twinx/utils/twinxDBUtils";


interface props {
    setIsModalOpen: (isOpen: boolean) => void;
    handleSelectProject: (project: any) => void;
    handleDeleteClick: (project: any) => void;
    toggleFavorite: (id: string, isFavorite: boolean) => void;
    copyToClipboard: (text: string, message: string) => void;
    togglePublish: (id: string, isPublished: boolean) => void;
}

export default function DashboardCore() {


    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<string>('All');
    const [sort, setSort] = useState<string>('date_desc');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [draggingProject, setDraggingProject] = useState<DraggingProject | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    const filteredAndSortedProjects = useMemo(() => projects
    .filter(p => p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filter === 'Favorites' ? p.isFavorite : true))
    .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        switch (sort) {
            case 'name_asc': return a.title.localeCompare(b.title);
            case 'name_desc': return b.title.localeCompare(a.title);
            case 'date_asc': return dateA - dateB;
            default: return dateB - dateA;
        }
    }), [projects, searchTerm, filter, sort]);

    function hendleCopyTwinxID(message:string){
      copyToClipboard(message, "Copied to clipboard!")
    }

    //will come from the page [id]
    const params = useParams();
    const id = params?.id as string;
    setUserId(id);


    // --- Projects Fetching ---     --DB
    useEffect(() => {
      if (!userId) return;
    
      const fetchProjects = async () => {
        const result = await getProjectsByUserId(userId);
      
        if (result.success && result.data) {
          setProjects(result.data);
        } else {
          setProjects([]);
        }
      };
    
      fetchProjects();
    }, [userId]);

    //toggle fav on project models     --DB
    const toggleFavorite = async (projectId: string, isFavorite: boolean) => {
    };






    // code the toggle fav for db so the user model gets updated and the new fav project gets added to the user model








    //toggle published on project models     --DB
    const togglePublish = async (projectId: string, isPublished: boolean) => {
      await updateProjectKeyById(projectId, "published", isPublished);
    };

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
                    <ProjectCardCore 
                      key={project.id} 
                      project={project} 
                      setDraggingProject={setDraggingProject}
                      isDragging={draggingProject?.id === project.id}
                      activeDropdown={activeDropdown}
                      toggleFavorite={toggleFavorite}
                      setActiveDropdown={setActiveDropdown}
                      copyToClipboard={(text) => {hendleCopyTwinxID(text)}}
                      togglePublish= {togglePublish}
                    />
                ))}
          </div>
           {filteredAndSortedProjects.length === 0 && (
                <div className="text-center py-20 text-[#A0A0A5] col-span-full">
                    <p>No Digital Twins found.</p>
                    <p>Click "New Digital Twin" to get started.</p>
                </div>
          )}

          <NewProjectModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
              userId={userId}
          />

        </div>
    );
    
};