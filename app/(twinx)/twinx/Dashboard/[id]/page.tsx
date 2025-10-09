"use client"

import { Briefcase, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Timestamp } from "firebase/firestore";
import { DraggingProject, Project } from "@/twinx/types/TwinxTypes";
import ProjectCardCore from "@/twinx/components/ProjectCard";
import { useParams } from "next/navigation";
import NewProjectModal from "@/twinx/components/NewProjectModel";
import { copyToClipboard } from "@/twinx/utils/TwinxUtils";
import { getProjectsByUserId } from "@/twinx/utils/twinxDBUtils.action";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";


export default function dashboard() {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');
  const [sort, setSort] = useState<string>('date_desc');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const params = useParams();
  const id = params?.id as string | null;

  useEffect(() => {
    if (id) {
      setUserId(id);
    }
  }, [id]);

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

  // --- Projects Fetching ---     --DB
  useEffect(() => {
    if (!userId){
      return
    }
  
    const fetchProjects = async () => {

      const result = await getProjectsByUserId(userId);
      
      if (result.data) {
        try {
          setProjects(result.data);
        } catch (error) {
          console.log("Error parsing project data:", error);
        }
        
      } else {
      }
    };
  
    fetchProjects();
  
  }, [userId]);

  return (
    <>
    <SignedIn>
    <div className="p-4 sm:p-6 lg:p-8">

      {/* 🟡 AUTH CHECK */}
      {!userId ? (
          <div className="flex items-center justify-center h-[60vh]">
            <div className="bg-[#262629] text-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border border-[#3A3A3C]">
              <h3 className="text-xl font-semibold mb-2" style={{color:'white'}}>Waiting for Authentication</h3>
              <p className="text-[#A0A0A5]" style={{color:'white'}}>Please sign in to view your dashboard.</p>
            </div>
          </div>
      ) : (
        <>
            {/* 🟣 DASHBOARD HEADER */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0 flex items-center gap-3">
                <Briefcase size={28} /> Twinx Dashboard
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-auto">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0A5]"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-10 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] w-full sm:w-48"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  >
                    <option value="All">All</option>
                    <option value="Favorites">Favorites</option>
                  </select>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="bg-[#262629] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                  >
                    <option value="date_desc">Newest</option>
                    <option value="date_asc">Oldest</option>
                    <option value="name_asc">Name (A-Z)</option>
                    <option value="name_desc">Name (Z-A)</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  <Plus size={20} /> New Digital Twin
                </button>
              </div>
            </header>

            {/* 🟡 EMPTY PROJECTS STATE */}
            {filteredAndSortedProjects.length === 0 ? (
              <div className="flex items-center justify-center h-[50vh]">
                <div className="bg-[#262629] text-white p-6 rounded-xl shadow-lg max-w-md w-full text-center border border-[#3A3A3C]">
                  <h3 className="text-xl font-semibold mb-2">No Digital Twins Found</h3>
                  <p className="text-[#A0A0A5] mb-4">
                    You don’t have any projects yet. Click below to create your first Digital Twin.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
                  >
                    <Plus size={18} className="inline-block mr-1" /> New Digital Twin
                  </button>
                </div>
              </div>
            ) : (
              // 🟣 PROJECT GRID
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAndSortedProjects.map((project) => (
                  <div>
                  <ProjectCardCore
                    key={project.id}
                    project={project}
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    userId={userId}
                  />
                  </div>
                ))}
              </div>
            )}

            {/* 🟣 MODAL */}
            <NewProjectModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              userId={userId}
            />
        </>
      )}

      <div style={{position:'fixed', bottom:'20px', right:'20px', zIndex:'1000'}}>
        <UserButton afterSwitchSessionUrl='/' />
      </div>

    </div>
    </SignedIn>
    <SignedOut>
      <SignInButton />
    </SignedOut>
    </>
  );

};