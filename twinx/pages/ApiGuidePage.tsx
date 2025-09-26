import { BookOpen } from "lucide-react";
import { FC, ReactNode } from "react";

interface prop {
    handleNavigateIn: (view: string) => void;
}

export default function ApiGuidePagePage({handleNavigateIn}: prop) {
    const CodeBox: FC<{children: ReactNode}> = ({ children }) => (
        <code className="bg-[#262629] border border-[#3A3A3C] rounded-md px-2 py-1 text-sm font-mono text-indigo-300">
            {children}
        </code>
    );

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white max-w-4xl mx-auto">
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-white flex items-center gap-4"><BookOpen size={40}/> TwinX API Usage in Unreal Engine</h1>
                    <div className="flex items-center gap-4 mt-4 text-sm text-[#A0A0A5]">
                        <div className="flex items-center gap-2">
                            <img src="https://placehold.co/24x24/6366F1/FFFFFF?text=J" alt="Author" className="w-6 h-6 rounded-full" />
                            <span>Owned by Jay Soni</span>
                        </div>
                        <span>•</span>
                        <span>Last updated: July 20, 2025</span>
                    </div>
                </div>

                <hr className="border-t border-[#3A3A3C]" />

                <div className="space-y-6 text-base text-[#A0A0A5] leading-relaxed">
                    <h2 className="text-2xl font-semibold text-white">1. Project Setup & Plugin Installation</h2>
                    <p>To begin, your Unreal Engine project must be a C++ project. If it's not, you can easily convert it by adding a new C++ class via <CodeBox>Tools → New C++ Class...</CodeBox>.</p>
                    <p>Next, create a <CodeBox>Plugins</CodeBox> folder in your project's root directory. Download and unzip the following plugins into this new folder:</p>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                        <li><a href="https://github.com/ue4plugins/glTFRuntime/releases" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">glTFRuntime Plugin</a> (for loading 3D models)</li>
                        <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Twinx Plugin</a> (for API communication)</li>
                    </ul>
                    <p>Finally, right-click your <CodeBox>.uproject</CodeBox> file, generate Visual Studio project files, and build the project from Visual Studio.</p>

                    <h2 className="text-2xl font-semibold text-white">2. Configuration in Unreal Engine</h2>
                    <p>Once your project is compiled and open in the editor, you need to configure your API key.</p>
                    <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>Navigate to Project Settings: <CodeBox>Edit → Project Settings</CodeBox>.</li>
                        <li>Find the <CodeBox>Twinx</CodeBox> section under the Plugins header.</li>
                        <li>Copy your secret key from the <a href="#" onClick={() => handleNavigateIn('api')} className="text-indigo-400 hover:underline">API Keys</a> page and paste it into the <CodeBox>API Key</CodeBox> field.</li>
                    </ol>

                    <h2 className="text-2xl font-semibold text-white">3. Loading Your Digital Twin</h2>
                    <p>You're now ready to load a Digital Twin into any scene.</p>
                     <ol className="list-decimal list-inside space-y-2 pl-4">
                        <li>In the Content Browser, enable <CodeBox>Show Plugin Content</CodeBox> from the Settings menu.</li>
                        <li>Find the <CodeBox>BP_Twinx</CodeBox> actor in the path: <CodeBox>Twinx Content → Blueprints</CodeBox>.</li>
                        <li>Drag the <CodeBox>BP_Twinx</CodeBox> actor into your level.</li>
                        <li>Select the actor in the scene, and in the Details panel, paste your desired <CodeBox>Twinx ID</CodeBox> from your dashboard.</li>
                    </ol>
                    <p>Press Play, and the plugin will handle the rest, fetching and rendering your 3D model in real-time.</p>
                </div>
            </div>
        </div>
    );
};

