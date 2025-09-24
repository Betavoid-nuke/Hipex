import { useEffect } from 'react';
import React, { useState, useMemo } from 'react';
import "../../../app/(twinx)/globals.css";
import NewProjectModal from '../../Marketplace/Components/NewProjectModelMarketPlace';
import MarketplaceCard from '../../Marketplace/Components/MarketplaceCard';
import NetworkUserCard from '../../Marketplace/Components/MarketplaceNetworkCard';


// Extend the Window interface to include properties from external scripts
declare global {
    interface Window {
        __firebase_config?: string;
        __app_id?: string;
        __initial_auth_token?: string;
        THREE: any; // Using 'any' for THREE.js as its types can be complex
    }
}


// --- Data Model Interfaces ---
interface BaseItem {
    id: string;
    title: string;
    description: string;
    author: string;
    price: number;
    image: string;
    category: string;
    tags?: string[];
    isAnimated: boolean;
    isDownloadable: boolean;
    date: Date;
    likes: number;
    isFavorite: boolean;
    rating?: number;
    reviews?: number;
    technicalInfo?: { label: string; value: string }[];
    downloadFormats?: { format: string; size: string; downloadUrl: string }[];
    comments?: { user: string; comment: string; date: Date }[];
    photos?: string[];
    
}

interface AppUser {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    id?: string; // id is sometimes used interchangeably with uid
}


// --- Sample Data ---
const marketplaceListingsJson: BaseItem[] = [
    {
        id: '1',
        title: 'Lakeside Cabin',
        author: 'John Doe',
        category: 'Home',
        rating: 4.8,
        reviews: 583,
        price: 249,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 1200,
        date: new Date('2023-01-15T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Lakeside+Cabin",
        description: "A cozy lakeside cabin perfect for a tranquil metaverse escape.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, OBJ' },
            { label: 'Polygons', value: '50,000' },
            { label: 'Vertices', value: '65,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '125 MB', downloadUrl: '#' },
            { format: 'OBJ', size: '110 MB', downloadUrl: '#' },
            { format: 'GLTF', size: '95 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Lakeside+Cabin+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Lakeside+Cabin+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Lakeside+Cabin+03"
        ]
    },
    {
        id: '2',
        title: 'Cyberpunk Alley',
        author: 'Jane Smith',
        category: 'Sci-Fi',
        rating: 4.9,
        reviews: 875,
        price: 499,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: true,
        likes: 1500,
        date: new Date('2023-02-20T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Cyberpunk+Alley",
        description: "A neon-soaked cyberpunk street scene with dynamic animations.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '150,000' },
            { label: 'Vertices', value: '180,000' },
            { label: 'Textures', value: '8K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '345 MB', downloadUrl: '#' },
            { format: 'GLB', size: '280 MB', downloadUrl: '#' },
            { format: 'UnityPackage', size: '410 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Cyberpunk+Alley+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Cyberpunk+Alley+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Cyberpunk+Alley+03"
        ]
    },
    {
        id: '3',
        title: 'Medieval Castle',
        author: 'Alice Johnson',
        category: 'Fantasy',
        rating: 4.7,
        reviews: 312,
        price: 349,
        isFavorite: false,
        isDownloadable: false,
        isAnimated: false,
        likes: 900,
        date: new Date('2023-03-10T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Medieval+Castle",
        description: "An intricate medieval castle with full interior and exterior details.",
        technicalInfo: [
            { label: 'File Format', value: 'OBJ, DAE' },
            { label: 'Polygons', value: '85,000' },
            { label: 'Vertices', value: '95,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'OBJ', size: '215 MB', downloadUrl: '#' },
            { format: 'DAE', size: '190 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Medieval+Castle+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Medieval+Castle+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Medieval+Castle+03"
        ]
    },
    {
        id: '4',
        title: 'Urban Office',
        author: 'Bob Williams',
        category: 'Office',
        rating: 4.5,
        reviews: 450,
        price: 199,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 750,
        date: new Date('2023-04-05T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Urban+Office",
        description: "A modern, open-plan office space with custom props.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '60,000' },
            { label: 'Vertices', value: '72,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '98 MB', downloadUrl: '#' },
            { format: 'GLB', size: '75 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Urban+Office+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Urban+Office+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Urban+Office+03"
        ]
    },
    {
        id: '5',
        title: 'Industrial Warehouse',
        author: 'Charlie Brown',
        category: 'Warehouse',
        rating: 4.6,
        reviews: 210,
        price: 299,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 600,
        date: new Date('2023-05-12T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Industrial+Warehouse",
        description: "A large, detailed warehouse with industrial machinery and props.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, OBJ' },
            { label: 'Polygons', value: '110,000' },
            { label: 'Vertices', value: '135,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '205 MB', downloadUrl: '#' },
            { format: 'OBJ', size: '188 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Industrial+Warehouse+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Industrial+Warehouse+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Industrial+Warehouse+03"
        ]
    },
    {
        id: '6',
        title: 'Tropical Beach',
        author: 'Diana Prince',
        category: 'Nature',
        rating: 4.9,
        reviews: 1100,
        price: 599,
        isFavorite: true,
        isDownloadable: true,
        isAnimated: true,
        likes: 2100,
        date: new Date('2023-06-30T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Tropical+Beach",
        description: "A stunning tropical beach environment with realistic water and foliage.",
        technicalInfo: [
            { label: 'File Format', value: 'GLB' },
            { label: 'Polygons', value: '175,000' },
            { label: 'Vertices', value: '200,000' },
            { label: 'Textures', value: '8K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'GLB', size: '315 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Tropical+Beach+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Tropical+Beach+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Tropical+Beach+03"
        ]
    },
];

const myListedTwinsJson: BaseItem[] = [
    {
        id: 'ml1',
        title: 'My First Home',
        author: 'You',
        category: 'Home',
        rating: 0,
        reviews: 0,
        price: 0,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 0,
        date: new Date('2023-09-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=My+First+Home",
        description: "A digital twin of my own home, ready for sharing.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '30,000' },
            { label: 'Vertices', value: '35,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Personal Use' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '60 MB', downloadUrl: '#' },
            { format: 'GLB', size: '52 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=My+First+Home+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=My+First+Home+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=My+First+Home+03"
        ]
    }
];

const assetsJson: BaseItem[] = [
    {
        id: 'a1',
        title: 'Vintage Chair',
        author: 'Eve Davis',
        category: 'Props',
        rating: 4.7,
        reviews: 150,
        price: 25,
        isFavorite: false,
        isDownloadable: true,
        isAnimated: false,
        likes: 400,
        date: new Date('2023-07-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Vintage+Chair",
        description: "A detailed 3D model of a vintage wooden chair.",
        technicalInfo: [
            { label: 'File Format', value: 'OBJ, GLB' },
            { label: 'Polygons', value: '2,500' },
            { label: 'Vertices', value: '3,000' },
            { label: 'Textures', value: '2K PBR' },
            { label: 'License', value: 'Standard Royalty-Free' }
        ],
        downloadFormats: [
            { format: 'OBJ', size: '15 MB', downloadUrl: '#' },
            { format: 'GLB', size: '10 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Vintage+Chair+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Vintage+Chair+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Vintage+Chair+03"
        ]
    },
    {
        id: 'a2',
        title: 'Assault Rifle',
        author: 'Frank Miller',
        category: 'Weapons',
        rating: 4.9,
        reviews: 300,
        price: 75,
        isFavorite: true,
        isDownloadable: true,
        isAnimated: true,
        likes: 800,
        date: new Date('2023-08-01T10:00:00Z'),
        image: "https://placehold.co/600x400/1f2937/d1d5db?text=Assault+Rifle",
        description: "A highly detailed and animated 3D model of an assault rifle.",
        technicalInfo: [
            { label: 'File Format', value: 'FBX, GLB' },
            { label: 'Polygons', value: '15,000' },
            { label: 'Vertices', value: '18,000' },
            { label: 'Textures', value: '4K PBR' },
            { label: 'License', value: 'Extended Commercial' }
        ],
        downloadFormats: [
            { format: 'FBX', size: '45 MB', downloadUrl: '#' },
            { format: 'GLB', size: '38 MB', downloadUrl: '#' }
        ],
        comments: [],
        photos: [
            "https://placehold.co/1200x800/1f2937/d1d5db?text=Assault+Rifle+01",
            "https://placehold.co/1200x800/2f3a4b/a1b2c3?text=Assault+Rifle+02",
            "https://placehold.co/1200x800/3f4b5c/b1c3d4?text=Assault+Rifle+03"
        ]
    }
];


const MarketplacePageTwinx = () => {

    // --- State Management ---
    const [userId, setUserId] = useState<string | null>(null);
    const [currentView, setCurrentView] = useState<string>('dashboard');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
    const [friends, setFriends] = useState<AppUser[]>([]);


    const showNotification = (message: string) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    const handleSelectTwin = (twin: BaseItem) => {
        setCurrentView('twinDetail');
    };

    // --- marketplace main page ---
    const MarketplacePage = ({ friends, onSelectTwin }: { friends: AppUser[], onSelectTwin: (twin: BaseItem) => void }) => {
        const [listings, setListings] = useState<BaseItem[]>(marketplaceListingsJson);
        const [assets, setAssets] = useState<BaseItem[]>(assetsJson);
        const [filteredListings, setFilteredListings] = useState<BaseItem[]>(listings);
        const [marketSearchTerm, setMarketSearchTerm] = useState<string>('');
        const [category, setCategory] = useState<string>('All');
        const [date, setDate] = useState<string>('All');
        const [licenses, setLicenses] = useState({ downloadable: false, animated: false, free: false });
        const [sortBy, setSortBy] = useState<string>('relevance');
        const [activeTab, setActiveTab] = useState<string>('Store');
        const [favoriteSubTab, setFavoriteSubTab] = useState<string>('Digital Twins');

        const myListedModels = useMemo(() => myListedTwinsJson, []);

        const handleResetFilters = () => {
            setMarketSearchTerm('');
            setCategory('All');
            setDate('All');
            setLicenses({ downloadable: false, animated: false, free: false });
            setSortBy('relevance');
        };
        
        const toggleListingFavorite = (id: string) => {
            const updateList = (listSetter: React.Dispatch<React.SetStateAction<BaseItem[]>>) => {
                listSetter(prevList => prevList.map(item => item.id === id ? { ...item, isFavorite: !item.isFavorite } : item));
            };
            
            if (listings.some(item => item.id === id)) updateList(setListings);
            if (assets.some(item => item.id === id)) updateList(setAssets);
        };

        useEffect(() => {
            let sourceData: BaseItem[];
            if (activeTab === 'My Listed Twins') sourceData = myListedModels;
            else if (activeTab === '3D Assets') sourceData = assets;
            else if (activeTab === 'Store') sourceData = listings;
            else {
                setFilteredListings([]);
                return;
            }

            let result = sourceData.filter(item => 
                item.title.toLowerCase().includes(marketSearchTerm.toLowerCase()) ||
                item.author.toLowerCase().includes(marketSearchTerm.toLowerCase())
            );

            if (category !== 'All') result = result.filter(item => item.category === category);
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
        }, [marketSearchTerm, category, licenses, sortBy, listings, assets, activeTab, myListedModels]);

        const categories = useMemo(() => [
            'All', 'Home', 'Office', 'Warehouse', 'Factory', 'Hall', 'Hotel', 
            'Lobby', 'Stadium', 'Building', 'Venues', 'Penthouse', 'Mansion',
            'Props', 'Nature', 'Weapons'
        ], []);
        
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
                                    {itemsToShow.map(item => <MarketplaceCard key={item.id} item={item} onFavoriteToggle={toggleListingFavorite} onSelect={onSelectTwin} />)}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-[#A0A0A5] border-2 border-dashed border-[#3A3A3C] rounded-lg">
                                    <h3 className="mt-4 text-xl font-bold text-white">No Favorites Yet</h3>
                                    <p>Click the heart icon on any item to add it to your favorites.</p>
                                </div>
                            )}
                        </div>
                    );
                case 'Store':
                case '3D Assets':
                case 'My Listed Twins':
                default:
                    return (
                        <>
                            {filteredListings.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredListings.map(item => <MarketplaceCard key={item.id} item={item} onFavoriteToggle={toggleListingFavorite} onSelect={onSelectTwin} />)}
                                </div>
                            ) : (
                                <div className="text-center py-20 text-[#A0A0A5] col-span-full">
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
                        <h1 className="text-2xl font-bold">TwinX Store</h1>
                    </div>
                    <form className="flex-grow max-w-2xl flex gap-2" onSubmit={(e) => e.preventDefault()}>
                        <div className="relative flex-grow">
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
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('My Listed Twins')}} className={`py-3 ${activeTab === 'My Listed Twins' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>My Listed Twins</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('My Network')}} className={`py-3 ${activeTab === 'My Network' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>My Network</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Store')}} className={`py-3 ${activeTab === 'Store' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Store</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('3D Assets')}} className={`py-3 ${activeTab === '3D Assets' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>3D Assets</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Favorites')}} className={`py-3 ${activeTab === 'Favorites' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Favorites</a>
                        </div>
                        <button className="flex items-center gap-2 text-[#A0A0A5] hover:text-white">
                            <span>Filters & Sort</span>
                        </button>
                    </div>
                </div>
                 {(activeTab === 'Store' || activeTab === 'My Listed Twins' || activeTab === '3D Assets') && (
                    <div className="flex items-center justify-between gap-4 mb-8 text-sm">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="flex items-center gap-2">
                                 <span className="text-xs uppercase text-[#8A8A8E]">Category</span>
                                 <div className="relative">
                                    <select value={category} onChange={e => setCategory(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-3 pr-8 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] appearance-none">
                                        {categories.map(c => <option key={c} value={c} className="bg-[#262629] text-white">{c}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                 <span className="text-xs uppercase text-[#8A8A8E]">Date</span>
                                 <div className="relative">
                                    <select value={date} onChange={e => setDate(e.target.value)} className="bg-[#262629] border border-[#3A3A3C] rounded-md pl-3 pr-8 py-1 text-white focus:outline-none focus:ring-1 focus:ring-[#6366F1] appearance-none">
                                         <option value="All" className="bg-[#262629] text-white">All time</option>
                                         <option value="week" className="bg-[#262629] text-white">This week</option>
                                         <option value="month" className="bg-[#262629] text-white">This month</option>
                                         <option value="year" className="bg-[#262629] text-white">This year</option>
                                     </select>
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
                            <button onClick={handleResetFilters} className="text-indigo-400 hover:underline">Reset</button>
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
                            </div>
                        </div>
                    </div>
                )}
                
                {renderContent()}
            </div>
        );
    };

    // --- Render Components ---
    const AppNotification = () => (
        <div className={`fixed bottom-5 right-5 bg-[#6366F1] text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {notification.message}
        </div>
    );

    //     prints the pages
    const renderCurrentView = () => {
        const views: {[key: string]: React.ReactNode} = {
            'marketplace': <MarketplacePage friends={friends} onSelectTwin={handleSelectTwin} />,
        };
        return views['marketplace'];
    };

    return (
        <section id="marketplace" className="pt-32 pb-24" style={{display:'block', marginTop:'-180px', background:'rgb(9 10 20)'}}>
           <style>
                {`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .prose { color: #A0A0A5; }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose strong { color: #FFFFFF; }
                .form-checkbox { -webkit-appearance: none; -moz-appearance: none; appearance: none; padding: 0; -webkit-print-color-adjust: exact; color-adjust: exact; display: inline-block; vertical-align: middle; background-origin: border-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; flex-shrink: 0; height: 1rem; width: 1rem; }
                .form-checkbox:checked { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
                `}
            </style>
            <div className="min-h-screen">
           
                <main className={`transition-all duration-300 ease-in-out min-h-screen ${isSidebarExpanded ? 'pl-72' : 'pl-20'}`}>
                    {renderCurrentView()}
                </main>
           
                <NewProjectModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    userId={userId}
                    showNotification={showNotification}
                />
           
                <AppNotification />
                
            </div>
        </section>
    );

};
export default MarketplacePageTwinx;