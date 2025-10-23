import { BookOpen } from "lucide-react";
import { FC, ReactNode } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Link from "next/link";

export default function ApiGuidePagePage() {

    const CodeBox: FC<{children: ReactNode}> = ({ children }) => (
        <code className="bg-[#262629] border border-[#3A3A3C] rounded-md px-2 py-1 text-sm font-mono text-indigo-300">
            {children}
        </code>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white max-w-4xl mx-auto">
            <div className="space-y-8">

                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href="/twinx/apiguide" style={{color:'gray'}}>Home</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink>
                        <BreadcrumbPage>Twinx Point Cloud Guide</BreadcrumbPage>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>

                <div>
                    <h1 className="text-4xl font-bold text-white flex items-center gap-4" style={{fontSize:'26px'}}>
                        <BookOpen size={28}/> Video to Point Cloud using the Point Cloud Tool on TwinX
                    </h1>
                    <div className="flex items-center gap-4 mt-4 text-sm text-[#A0A0A5]">
                        <div className="flex items-center gap-2">
                            <img src="https://placehold.co/24x24/6366F1/FFFFFF?text=J" alt="Author" className="w-6 h-6 rounded-full" />
                            <span>Owned by Jay Soni</span>
                        </div>
                        <span>•</span>
                        <span>Last updated: October 24, 2025</span>
                    </div>
                </div>

                <hr className="border-t border-[#3A3A3C]" />

                <div className="space-y-6 text-base text-[#A0A0A5] leading-relaxed">
                    
                    <h2 className="text-2xl font-semibold text-white">1. Overview</h2>
                    <p>
                        This guide walks you through how to convert any video into a 3D point cloud 
                        using the <CodeBox>Point Cloud Tool</CodeBox> on TwinX. You’ll learn how to upload 
                        your video, generate a reconstruction, download the result, and then import and 
                        explore it in Blender for VFX, visualization, or 3D analysis.
                    </p>

                    <h2 className="text-2xl font-semibold text-white">2. Requirements</h2>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>
                            <a 
                                href="https://www.blender.org/download/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-400 hover:underline"
                            >
                                <CodeBox>Blender (v3.0 or newer)</CodeBox>
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://github.com/SBCV/Blender-Addon-Photogrammetry-Importer" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-400 hover:underline"
                            >
                                <CodeBox>Photogrammetry Importer Add-on</CodeBox>
                            </a>
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white">3. Uploading Your Video to TwinX</h2>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>
                            Go to the 
                            <a href="/" className="text-indigo-400 hover:underline"> Point Cloud Tool </a> 
                            on TwinX.
                        </li>
                        <li>Click on <CodeBox>Upload Video</CodeBox> and select your source footage.</li>
                        <li>Enter all required details such as project name, camera type, and frame rate (if available).</li>
                        <li>Once the upload completes, open the <CodeBox>Project View</CodeBox>.</li>
                        <li>Inside the project view, click on <CodeBox>Generate</CodeBox> to begin point cloud reconstruction.</li>
                        <li>
                            After generation is complete, download your reconstructed 
                            <CodeBox>.exe</CodeBox> or <CodeBox>.zip</CodeBox> file 
                            from either the Project Detail view or directly from the project card on your dashboard.
                        </li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-white">4. Importing the Reconstruction in Blender</h2>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>Install the <CodeBox>Photogrammetry Importer</CodeBox> add-on in Blender via <CodeBox>Edit → Preferences → Add-ons → Install</CodeBox>.</li>
                        <li>Enable it and install any missing dependencies if prompted.</li>
                        <li>Restart Blender, then go to <CodeBox>File → Import → COLMAP Model/Workspace</CodeBox>.</li>
                        <li>
                            Locate your downloaded reconstruction folder (from TwinX) and select it for import. 
                            The importer will automatically detect and load the camera path, sparse model, and image set.
                        </li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-white">5. Fixing Animation Timing</h2>
                    <p>If your imported camera track has spacing between keyframes:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li>Select all keyframes in the timeline and scale them by <CodeBox>33%</CodeBox> (<CodeBox>S → 0.3333</CodeBox>).</li>
                        <li>Alternatively, import from <CodeBox>.../sparse/0</CodeBox> for better sync. 
                            If you do this, set the background image manually from the <CodeBox>images</CodeBox> folder.
                        </li>
                    </ul>

                    <h2 className="text-2xl font-semibold text-white">6. Orienting Your Scene</h2>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>Select the <CodeBox>Point Cloud</CodeBox> object in Blender.</li>
                        <li>Press <CodeBox>A</CodeBox> to select all other objects, then <CodeBox>Ctrl+P → Parent to Object</CodeBox>.</li>
                        <li>Use <CodeBox>R</CodeBox> or <CodeBox>R, R</CodeBox> (trackball mode) to align it properly.</li>
                        <li>Ensure the ground plane and environment look level and natural.</li>
                        <li>Add a test plane (<CodeBox>Shift + A → Mesh → Plane</CodeBox>) to visually confirm alignment.</li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-white">7. Results & Performance</h2>
                    <p>
                        The TwinX Point Cloud Tool automates the entire photogrammetry process — from 
                        frame extraction and feature tracking to camera reconstruction — giving you a 
                        ready-to-use 3D scene in minutes.
                    </p>
                    <p>
                        You can use the generated model for camera tracking, environment reconstruction, 
                        Gaussian Splatting, or to visualize real-world spaces directly inside Blender or Unreal Engine.
                    </p>

                </div>

            </div>
        </div>
    );
};
