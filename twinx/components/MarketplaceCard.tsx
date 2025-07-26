// /twinx/components/MarketplaceCard.tsx
'use client';

import { Heart } from 'lucide-react';
import { MarketplaceListing, MyListedTwin } from '../lib/types';

interface MarketplaceCardProps {
    item: MarketplaceListing | MyListedTwin;
    onSelect: (item: MarketplaceListing | MyListedTwin) => void;
    onFavoriteToggle: (id: string) => void;
}

const MarketplaceCard = ({ item, onSelect, onFavoriteToggle }: MarketplaceCardProps) => (
    <div className="bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3C] flex flex-col transition-all duration-200 h-full group cursor-pointer" onClick={() => onSelect(item)}>
        <div className="relative">
            <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
            <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => { e.stopPropagation(); onFavoriteToggle(item.id); }}
                    className={`p-1.5 rounded-full bg-black/50 text-white hover:text-red-500 ${item.isFavorite ? 'text-red-500' : ''}`}
                >
                    <Heart size={18} fill={item.isFavorite ? 'currentColor' : 'none'} />
                </button>
            </div>
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

export default MarketplaceCard;