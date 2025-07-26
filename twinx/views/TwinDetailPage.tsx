// /twinx/views/TwinDetailPage.tsx
'use client';

import { ChevronLeft, Download, Heart, Eye } from 'lucide-react';
import { AppView, MarketplaceListing, MyListedTwin } from '../lib/types';

interface TwinDetailPageProps {
    twin: MarketplaceListing | MyListedTwin;
    onNavigate: (view: AppView) => void;
    previousView: AppView;
}

const TwinDetailPage = ({ twin, onNavigate, previousView }: TwinDetailPageProps) => {
    if (!twin) return null;

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white">
            <button onClick={() => onNavigate(previousView)} className="flex items-center gap-2 text-[#A0A0A5] hover:text-white mb-6">
                <ChevronLeft size={20} /> Back
            </button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] aspect-video flex items-center justify-center">
                        {/* A proper 3D model viewer would replace this image */}
                        <img src={twin.thumbnail} alt={twin.title} className="max-h-full max-w-full rounded-lg" />
                    </div>
                </div>
                <div>
                     <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                        <h2 className="text-3xl font-bold">{twin.title}</h2>
                        <div className="flex items-center gap-2 mt-2">
                            <img src={`https://placehold.co/24x24/6366F1/FFFFFF?text=${twin.author.charAt(0)}`} alt={twin.author} className="w-6 h-6 rounded-full" />
                            <span className="text-[#A0A0A5]">{twin.author}</span>
                        </div>
                        <div className="mt-6">
                            {twin.price === 0 ? (
                                <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2">
                                    <Download size={20} /> Download
                                </button>
                            ) : (
                                <button className="w-full bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg text-lg">
                                    ${twin.price.toFixed(2)} - Purchase
                                </button>
                            )}
                        </div>
                        <div className="flex justify-around mt-4 text-[#A0A0A5]">
                            <span className="flex items-center gap-2"><Heart size={16}/> {twin.likes.toLocaleString()}</span>
                            <span className="flex items-center gap-2"><Eye size={16}/> {twin.views.toLocaleString()}</span>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default TwinDetailPage;
