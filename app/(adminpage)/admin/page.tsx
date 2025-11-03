"use client";
import { useState } from "react";
import { BookOpen, Users, FolderOpen, Database, PlusCircle, Menu } from "lucide-react";

export default function AdminDashboard() {
    // Sidebar JSON config
    const sidebarItems = [
        { id: "guides", label: "Guides", icon: <BookOpen size={18} />, color: "text-indigo-400" },
        { id: "projects", label: "Projects", icon: <FolderOpen size={18} />, color: "text-blue-400" },
        { id: "users", label: "Users", icon: <Users size={18} />, color: "text-green-400" },
        { id: "assets", label: "Assets", icon: <Database size={18} />, color: "text-amber-400" },
    ];

    // Dummy JSON data for content pages
    const dummyData = {
        guides: [
            {
                id: 1,
                title: "Video to Point Cloud for VFX",
                author: "Jay Soni",
                date: "Oct 24, 2025",
                tags: ["VFX", "TwinX", "Point Cloud"],
            },
            {
                id: 2,
                title: "TwinX Plugin Setup in Unreal Engine",
                author: "Jay Soni",
                date: "July 20, 2025",
                tags: ["Unreal", "TwinX", "Integration"],
            },
        ],
        projects: [
            { id: 1, name: "Architectural Twin", user: "dev@obsidianedge.com", status: "Active" },
            { id: 2, name: "Factory Reconstruction", user: "test@twinx.io", status: "Processing" },
        ],
        users: [
            { id: 1, name: "Jay Soni", email: "jay@obsidianedge.com", role: "Admin" },
            { id: 2, name: "Dev Team", email: "dev@twinx.io", role: "Editor" },
        ],
        assets: [
            { id: 1, name: "Office_Scan.glb", owner: "Jay Soni", size: "58MB" },
            { id: 2, name: "Factory_Splat.exr", owner: "Dev Team", size: "122MB" },
        ],
    };

    const [activePage, setActivePage] = useState("guides");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    // Function to render each page dynamically
    const renderContent = () => {
        switch (activePage) {
            case "guides":
                return (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-semibold">Guides</h2>
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm">
                                <PlusCircle size={16}/> Add New Guide
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dummyData.guides.map((g) => (
                                <div key={g.id} className="bg-[#1E1E20] border border-[#3A3A3C] p-5 rounded-xl hover:border-indigo-500 transition-all">
                                    <h3 className="text-lg font-semibold text-white">{g.title}</h3>
                                    <p className="text-sm text-[#A0A0A5] mt-1">By {g.author} • {g.date}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {g.tags.map((t, idx) => (
                                            <span key={idx} className="bg-[#2A2A2D] text-indigo-300 text-xs px-2 py-1 rounded-full border border-[#3A3A3C]">{t}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "projects":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-3">Projects</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm text-left border border-[#3A3A3C] rounded-xl overflow-hidden">
                                <thead className="bg-[#2A2A2D] text-[#A0A0A5]">
                                    <tr>
                                        <th className="px-4 py-2">Project</th>
                                        <th className="px-4 py-2">User</th>
                                        <th className="px-4 py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyData.projects.map((p) => (
                                        <tr key={p.id} className="border-t border-[#3A3A3C] hover:bg-[#262629]">
                                            <td className="px-4 py-2">{p.name}</td>
                                            <td className="px-4 py-2 text-[#A0A0A5]">{p.user}</td>
                                            <td className="px-4 py-2">
                                                <span className={`px-2 py-1 rounded-full text-xs ${p.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case "users":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-3">Users</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dummyData.users.map((u) => (
                                <div key={u.id} className="bg-[#1E1E20] border border-[#3A3A3C] p-5 rounded-xl">
                                    <h3 className="text-white font-semibold">{u.name}</h3>
                                    <p className="text-[#A0A0A5] text-sm">{u.email}</p>
                                    <span className="mt-2 inline-block bg-[#2A2A2D] border border-[#3A3A3C] rounded-full px-3 py-1 text-xs text-indigo-300">{u.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case "assets":
                return (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold mb-3">Assets</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {dummyData.assets.map((a) => (
                                <div key={a.id} className="bg-[#1E1E20] border border-[#3A3A3C] p-5 rounded-xl">
                                    <h3 className="text-white font-semibold">{a.name}</h3>
                                    <p className="text-[#A0A0A5] text-sm mt-1">Owner: {a.owner}</p>
                                    <p className="text-[#A0A0A5] text-sm">Size: {a.size}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex h-screen bg-[#121214] text-white">
            {/* Sidebar */}
            <aside className={`bg-[#1B1B1E] border-r border-[#2A2A2D] w-64 p-5 flex flex-col transition-all ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}>
                <h1 className="text-xl font-bold mb-8 text-indigo-400">TwinX Admin</h1>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActivePage(item.id)}
                            className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded-lg transition-all 
                                ${activePage === item.id ? "bg-[#262629] border border-indigo-500 text-indigo-400" : "text-[#A0A0A5] hover:bg-[#1E1E20]"}`}
                        >
                            <span className={item.color}>{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar */}
                <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2D] bg-[#1B1B1E]">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
                            <Menu size={22}/>
                        </button>
                        <h2 className="font-semibold text-lg capitalize">{activePage}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <img src="https://placehold.co/32x32/6366F1/FFFFFF?text=J" className="w-8 h-8 rounded-full" alt="Admin"/>
                        <span className="text-sm text-[#A0A0A5]">Jay Soni</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6 bg-[#121214]">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
