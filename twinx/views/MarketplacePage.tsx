// /twinx/views/MarketplacePage.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Store, ListFilter, ChevronDown, Heart } from 'lucide-react';
import { MarketplaceListing, Asset, Friend, MyListedTwin } from '../lib/types';

interface MarketplacePageProps {
    friends: Friend[];
    listings: MarketplaceListing[];
    assets: Asset[];
    onSelectTwin: (twin: MarketplaceListing | MyListedTwin) => void;
    onFavoriteToggle: (id: string) => void; // This would need to be implemented in the main page logic
}

const MarketplaceCard = ({ item, onFavoriteToggle, onSelect }: { item: MarketplaceListing, onFavoriteToggle: (id: string) => void, onSelect: (item: MarketplaceListing) => void }) => (
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

const NetworkUserCard = ({ user }: { user: Friend }) => (
    <div className="bg-[#262629] rounded-lg p-4 text-center border border-[#3A3A3C] hover:border-[#4A4A4C] transition-colors">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
        <h3 className="font-bold text-white">{user.name}</h3>
        <p className="text-sm text-[#A0A0A5]">{user.email}</p>
    </div>
);


const MarketplacePage = ({ friends, listings, assets, onSelectTwin, onFavoriteToggle }: MarketplacePageProps) => {
    const [filteredListings, setFilteredListings] = useState<MarketplaceListing[]>([]);
    const [marketSearchTerm, setMarketSearchTerm] = useState('');
    const [category, setCategory] = useState('All');
    const [licenses, setLicenses] = useState({ downloadable: false, animated: false, free: false });
    const [sortBy, setSortBy] = useState('relevance');
    const [activeTab, setActiveTab] = useState('Store');
    const [favoriteSubTab, setFavoriteSubTab] = useState('Digital Twins');

    const categories = useMemo(() => [
        'All', 'Home', 'Office', 'Warehouse', 'Factory', 'Hall', 'Hotel',
        'Lobby', 'Stadium', 'Building', 'Venues', 'Penthouse', 'Mansion',
        'Props', 'Nature', 'Weapons'
    ], []);

    useEffect(() => {
        let sourceData: (MarketplaceListing | Asset)[] = [];
        if (activeTab === '3D Assets') sourceData = assets;
        else if (activeTab === 'Store') sourceData = listings;
        else {
            setFilteredListings([]);
            return;
        }

        let result = sourceData.filter(item =>
            item.title.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
            item.author.toLowerCase().includes(marketSearchTerm.toLowerCase())
        );

        if (category !== 'All') {
            result = result.filter(item => item.category === category);
        }
        if (licenses.downloadable) result = result.filter(item => item.isDownloadable);
        if (licenses.animated) result = result.filter(item => item.isAnimated);
        if (licenses.free) result = result.filter(item => item.price === 0);

        result.sort((a, b) => {
            switch (sortBy) {
                case 'likes': return b.likes - a.likes;
                case 'date': return b.date.getTime() - a.date.getTime();
                case 'price_asc': return a.price - b.price;
                case 'price_desc': return b.price - a.price;
                default: return b.likes - a.likes;
            }
        });

        setFilteredListings(result);
    }, [marketSearchTerm, category, licenses, sortBy, listings, assets, activeTab]);

    const renderContent = () => {
        switch(activeTab) {
            case 'My Network':
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {friends.map(friend => <NetworkUserCard key={friend.uid} user={friend} />)}
                    </div>
                );
            case 'Favorites':
                const favoriteTwins = listings.filter(item => item.isFavorite);
                const favoriteAssets = assets.filter(item => item.isFavorite);
                const itemsToShow = favoriteSubTab === 'Digital Twins' ? favoriteTwins : favoriteAssets;
                return (
                    <div>
                        <div className="flex items-center gap-4 mb-6 border-b border-[#3A3A3C]">
                            <button onClick={() => setFavoriteSubTab('Digital Twins')} className={`py-2 px-1 ${favoriteSubTab === 'Digital Twins' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Digital Twins</button>
                            <button onClick={() => setFavoriteSubTab('Assets')} className={`py-2 px-1 ${favoriteSubTab === 'Assets' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Assets</button>
                        </div>
                        {itemsToShow.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {itemsToShow.map(item => <MarketplaceCard key={item.id} item={item} onFavoriteToggle={onFavoriteToggle} onSelect={onSelectTwin} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-[#A0A0A5] border-2 border-dashed border-[#3A3A3C] rounded-lg">
                                <Heart size={48} className="mx-auto" />
                                <h3 className="mt-4 text-xl font-bold text-white">No Favorites Yet</h3>
                                <p>Click the heart icon on any item to add it to your favorites.</p>
                            </div>
                        )}
                    </div>
                );
            case 'Store':
            case '3D Assets':
            default:
                return (
                    <>
                        {filteredListings.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredListings.map(item => <MarketplaceCard key={item.id} item={item} onFavoriteToggle={onFavoriteToggle} onSelect={onSelectTwin} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20 text-[#A0A0A5] col-span-full">
                                <Search size={48} className="mx-auto" />
                                <h3 className="mt-4 text-xl font-bold text-white">No results found</h3>
                                <p>Try adjusting your search or filters to find what you're looking for.</p>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-white">
            <div className="flex items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                    <Store size={32} className="text-indigo-400" />
                    <h1 className="text-2xl font-bold">TwinX Store</h1>
                </div>
                <form className="flex-grow max-w-2xl flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <div className="relative flex-grow">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A5]" size={20} />
                        <input
                            type="text"
                            placeholder="Search for digital twins"
                            value={marketSearchTerm}
                            onChange={e => setMarketSearchTerm(e.target.value)}
                            className="w-full bg-[#262629] border border-[#3A3A3C] rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
                        />
                    </div>
                     <button type="submit" className="bg-[#6366F1] hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-full transition-colors">
                        Search
                    </button>
                </form>
            </div>

            <div className="border-b border-[#3A3A3C] mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Store')}} className={`py-3 ${activeTab === 'Store' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Store</a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('3D Assets')}} className={`py-3 ${activeTab === '3D Assets' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>3D Assets</a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('My Network')}} className={`py-3 ${activeTab === 'My Network' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>My Network</a>
                         <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Favorites')}} className={`py-3 ${activeTab === 'Favorites' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Favorites</a>
                    </div>
                    <button className="flex items-center gap-2 text-[#A0A0A5] hover:text-white">
                        <ListFilter size={18} />
                        <span>Filters & Sort</span>
                    </button>
                </div>
            </div>

            {(activeTab === 'Store' || activeTab === '3D Assets') && (
                <div className="flex items-center justify-between gap-4 mb-8 text-sm">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-2">
                            <span className="text-xs uppercase text-[#8A8A8E]">Category</span>
                            <div className="relative">
                                <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-3 pr-8 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] appearance-none">
                                    {categories.map(c => <option key={c} value={c} className="bg-[#262629] text-white">{c}</option>)}
                                </select>
                                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] pointer-events-none" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={licenses.downloadable} onChange={e => setLicenses({...licenses, downloadable: e.target.checked})} className="form-checkbox bg-[#3A3A3C] border-[#8A8A8E] rounded text-indigo-500 focus:ring-indigo-500" />
                                <span>Downloadable</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={licenses.animated} onChange={e => setLicenses({...licenses, animated: e.target.checked})} className="form-checkbox bg-[#3A3A3C] border-[#8A8A8E] rounded text-indigo-500 focus:ring-indigo-500" />
                                <span>Animated</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={licenses.free} onChange={e => setLicenses({...licenses, free: e.target.checked})} className="form-checkbox bg-[#3A3A3C] border-[#8A8A8E] rounded text-indigo-500 focus:ring-indigo-500" />
                                <span>Free</span>
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs uppercase text-[#8A8A8E]">Sort By</span>
                        <div className="relative">
                            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-3 pr-8 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] appearance-none">
                                <option value="relevance" className="bg-[#262629] text-white">Relevance</option>
                                <option value="likes" className="bg-[#262629] text-white">Most Liked</option>
                                <option value="date" className="bg-[#262629] text-white">Newest</option>
                                <option value="price_asc" className="bg-[#262629] text-white">Price: Low to High</option>
                                <option value="price_desc" className="bg-[#262629] text-white">Price: High to Low</option>
                            </select>
                            <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] pointer-events-none" />
                        </div>
                    </div>
                </div>
            )}

            {renderContent()}
        </div>
    );
};

export default MarketplacePage;