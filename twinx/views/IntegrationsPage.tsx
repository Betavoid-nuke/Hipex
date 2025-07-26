// /twinx/views/IntegrationsPage.tsx
'use client';

import { Puzzle, Download, BookOpen } from 'lucide-react';
import { AppView } from '../lib/types';

interface IntegrationsPageProps {
    onNavigate: (view: AppView) => void;
}

const IntegrationsPage = ({ onNavigate }: IntegrationsPageProps) => (
    <div className="p-4 sm:p-6 lg:p-8 text-white flex flex-col items-center">
        <header className="w-full max-w-4xl mb-8 text-center">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-3"><Puzzle size={32}/> Integrations</h2>
            <p className="text-[#A0A0A5] mt-2">Connect TwinX with your favorite tools.</p>
        </header>
        <div className="w-full max-w-2xl space-y-6">
            <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-[#3A3A3C] p-4 rounded-lg">
                        <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.01 6.42a.57.57 0 0 0-.57-.57H6.42a.57.57 0 0 0-.57.57v5.02a.57.57 0 0 0 .57.57h5.02a.57.57 0 0 0 .57-.57V6.42zM18.15 4.14l-4.14-4.14a.57.57 0 0 0-.81 0l-4.14 4.14a.57.57 0 0 0 0 .81l4.14 4.14a.57.57 0 0 0 .81 0l4.14-4.14a.57.57 0 0 0 0-.81zM12.01 12.58a.57.57 0 0 0-.57.57v5.02a.57.57 0 0 0 .57.57h5.02a.57.57 0 0 0 .57-.57v-5.02a.57.57 0 0 0-.57-.57h-5.02zM5.85 14.86l-4.14 4.14a.57.57 0 0 0 0 .81l4.14 4.14a.57.57 0 0 0 .81 0l4.14-4.14a.57.57 0 0 0 0-.81l-4.14-4.14a.57.57 0 0 0-.81 0z"/>
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold">Unreal Engine 5 Plugin</h3>
                        <p className="text-[#A0A0A5] mt-2 mb-4">Seamlessly import your digital twins directly into your Unreal Engine projects with our official plugin.</p>
                    </div>
                </div>
                <div className="mt-8">
                    <a href="https://github.com/Betavoid-nuke/TwinX_Unreal5/archive/refs/heads/main.zip" target="_blank" rel="noopener noreferrer" className="w-full bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2">
                        <Download size={20} /> Download Plugin
                    </a>
                </div>
            </div>
            <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="bg-[#3A3A3C] p-4 rounded-lg">
                       <BookOpen size={96} className="text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-2xl font-bold">Integration Guide</h3>
                        <p className="text-[#A0A0A5] mt-2 mb-4">Our detailed guide provides step-by-step instructions for installing the plugin and using it in your projects.</p>
                    </div>
                </div>
                <div className="mt-8">
                    <button onClick={() => onNavigate('apiguide')} className="w-full bg-[#3A3A3C] hover:bg-[#4A4A4C] text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2">
                        <BookOpen size={20} /> View Guide
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default IntegrationsPage;