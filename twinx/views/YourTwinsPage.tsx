
// /twinx/views/YourTwinsPage.tsx
'use client';

import { useState } from 'react';
import { Share2, UploadCloud } from 'lucide-react';
import { MarketplaceListing, MyListedTwin } from '../lib/types';
import ShareProfileModal from '../modals/ShareProfileModal';
// Assuming MarketplaceCard is a shared component, we can import it
// For simplicity, I'll redefine a simplified version here.
// In a real app, you'd import it from a shared components folder.

const TwinCard = ({ item, onSelect }: { item: MyListedTwin, onSelect: (item: MyListedTwin) => void }) => (
    <div className="bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3C] flex flex-col transition-all duration-200 h-full group cursor-pointer" onClick={() => onSelect(item)}>
        <div className="relative">
            <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
        </div>
        <div className="p-4 flex-grow flex flex-col">
            <h3 className="font-bold text-white pr-2 flex-1">{item.title}</h3>
            <div className="flex items-center justify-between text-sm text-[#A0A0A5] mt-2">
                <span>by {item.author}</span>
                <span>{item.price === 0 ? 'Free' : `$${item.price.toFixed(2)}`}</span>
            </div>
        </div>
    </div>
);


interface YourTwinsPageProps {
    listedTwins: MyListedTwin[];
    onSelectTwin: (twin: MyListedTwin) => void;
    showNotification: (message: string) => void;
}

const YourTwinsPage = ({ listedTwins, onSelectTwin, showNotification }: YourTwinsPageProps) => {
    const [activeTab, setActiveTab] = useState('Models');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    return (
        <div className="text-white">
            <div className="h-48 bg-[#262629] relative border-b-2 border-[#3A3A3C]">
               <div
                 className="absolute inset-0 bg-repeat"
                 style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A3A3C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
               ></div>
            </div>
            <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-end -mt-20 relative z-10">
                    <img src="https://placehold.co/128x128/6366F1/FFFFFF?text=S" alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-[#1C1C1E]"/>
                    <div className="ml-6">
                        <h2 className="text-3xl font-bold">Simon Prusin</h2>
                    </div>
                    <button onClick={() => setIsShareModalOpen(true)} className="ml-auto bg-[#3A3A3C] hover:bg-[#4A4A4C] text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                        <Share2 size={16} /> Share Profile
                    </button>
                </div>

                <div className="mt-8 border-b border-[#3A3A3C]">
                     <div className="flex items-center gap-6">
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Models')}} className={`py-3 ${activeTab === 'Models' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>{listedTwins.length} Models</a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Likes')}} className={`py-3 ${activeTab === 'Likes' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>0 Likes</a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Uploads')}} className={`py-3 ${activeTab === 'Uploads' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Uploads</a>
                    </div>
                </div>

                <div className="mt-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-white">
                            Listed Models
                        </h3>
                        <button className="bg-[#6366F1] hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                            <UploadCloud size={18}/> List a New Twin
                        </button>
                    </div>
                    {listedTwins.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listedTwins.map(item => <TwinCard key={item.id} item={item} onSelect={onSelectTwin} />)}
                        </div>
                    ) : (
                         <div className="text-center py-20 text-[#A0A0A5] border-2 border-dashed border-[#3A3A3C] rounded-lg">
                            <p>No models listed yet.</p>
                        </div>
                    )}
                </div>
            </div>
            <ShareProfileModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} showNotification={showNotification} />
        </div>
    );
};

export default YourTwinsPage;