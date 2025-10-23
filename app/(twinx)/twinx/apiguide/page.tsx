import { BookOpen, Calendar, Tag } from "lucide-react";
import Link from "next/link";

export default function ApiGuide() {
    const guides = [
        {
            title: "Video to Point Cloud for VFX & Gaussian Splatting",
            description:
                "Learn how to convert any video into a detailed 3D point cloud for VFX workflows and Gaussian splatting — from setup to final render.",
            tags: ["VFX", "Point Cloud", "3D Workflow"],
            tool: "Colmap, Gaussian Splatting",
            date: "Oct 20, 2025",
            author: "Jay Soni",
            thumbnail: "https://placehold.co/600x350/1E1E20/FFFFFF?text=Video+to+Point+Cloud",
            path: "/twinx/apiguide/pointClouldGuide"
        },
        {
            title: "Integrating TwinX Plugin in Unreal Engine",
            description:
                "Step-by-step setup guide for integrating the TwinX plugin into your Unreal Engine projects for real-time data streaming and digital twin visualization.",
            tags: ["Unreal Engine", "TwinX", "Plugins"],
            tool: "TwinX Plugin",
            date: "July 20, 2025",
            author: "Jay Soni",
            thumbnail: "https://placehold.co/600x350/1E1E20/FFFFFF?text=TwinX+Plugin+Setup",
            path: "/twinx/apiguide/unnrealPluginGuide"
        },
    ];

    return (
        <div className="p-6 sm:p-8 lg:p-10 text-white max-w-6xl mx-auto">

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold flex items-center gap-3">
                        <BookOpen size={40} className="text-indigo-400" /> Guides & Tutorials
                    </h1>
                    <p className="text-[#A0A0A5] mt-2 text-base">
                        Explore hands-on guides to master the tools on our platform — from video-based 3D workflows to Unreal Engine integrations.
                    </p>
                </div>
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {guides.map((guide, i) => (
                    <Link href={guide.path}>
                    <div
                        key={i}
                        className="bg-[#1E1E20] border border-[#3A3A3C] rounded-2xl overflow-hidden hover:border-indigo-500 transition-all duration-300 cursor-pointer group"
                    >
                        <img
                            src={guide.thumbnail}
                            alt={guide.title}
                            className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity duration-300"
                        />

                        <div className="p-5 space-y-3">
                            <h2 className="text-xl font-semibold group-hover:text-indigo-400 transition-colors">
                                {guide.title}
                            </h2>
                            <p className="text-sm text-[#A0A0A5] leading-relaxed">{guide.description}</p>

                            <div className="flex flex-wrap gap-2 mt-2">
                                {guide.tags.map((tag, idx) => (
                                    <span
                                        key={idx}
                                        className="flex items-center gap-1 bg-[#2A2A2D] border border-[#3A3A3C] rounded-full px-3 py-1 text-xs text-indigo-300"
                                    >
                                        <Tag size={12} /> {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between mt-4 text-xs text-[#8C8C91]">
                                <div className="flex items-center gap-2">
                                    <img
                                        src="https://placehold.co/24x24/6366F1/FFFFFF?text=J"
                                        alt="Author"
                                        className="w-5 h-5 rounded-full"
                                    />
                                    <span>{guide.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    <span>{guide.date}</span>
                                </div>
                            </div>

                            <div className="text-xs text-[#A0A0A5] border-t border-[#2D2D30] pt-3 mt-3">
                                <span className="text-indigo-400 font-medium">Tool:</span> {guide.tool}
                            </div>
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
