import React, { useState, useMemo } from 'react';
import "../../../app/(twinx)/globals.css";
import NewProjectModal from '../../Marketplace/Components/NewProjectModelMarketPlace';
import UploadPage from '@/Website/Marketplace/Pages/UploadPage';
import DetailedView from '@/Website/Marketplace/Pages/DetailedPage';
import MarketplacePage from '@/Website/Marketplace/Pages/ListingPage';
import MarketplaceCart from '@/Website/Marketplace/Components/BuyCart';
import CheckoutModal from '@/Website/Marketplace/Components/CheckoutModal';
import BuyAndCart from '@/Website/Marketplace/Components/buyandcart';
import { AppUser, BaseItem } from '@/Website/Marketplace/types';


// Extend the Window interface to include properties from external scripts
declare global {
    interface Window {
        __firebase_config?: string;
        __app_id?: string;
        __initial_auth_token?: string;
        THREE: any; // Using 'any' for THREE.js as its types can be complex
    }
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

const users: AppUser[] = [
    { uid: 'u1', name: 'Alex', avatar: 'https://placehold.co/100x100/1f2937/d1d5db?text=A', email: '', id: '' },
    { uid: 'u2', name: 'Sarah', avatar: 'https://placehold.co/100x100/1f2937/d1d5db?text=S', email: '', id: ''  },
    { uid: 'u3', name: 'Mike', avatar: 'https://placehold.co/100x100/1f2937/d1d5db?text=M', email: '', id: ''  }
]



const MarketplacePageTwinx = () => {

    // --- State Management ---
    const [userId, setUserId] = useState<string>('');
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
    const [friends, setFriends] = useState<AppUser[]>([]);

    const [selectedTwin, setSelectedTwin] = useState(null as BaseItem | null);
    const [isUploadPage, setIsUploadPage] = useState(false);
    const [myListedTwins, setMyListedTwins] = useState(myListedTwinsJson);
    const [listings, setListings] = useState(marketplaceListingsJson);
    const [assets, setAssets] = useState(assetsJson);


    const showNotification = (message: string) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    const handleSelectTwin = (twin: BaseItem) => {
        setSelectedTwin(twin);
    };

    // --- Render Components ---
    const AppNotification = () => (
        <div className={`fixed bottom-5 right-5 bg-[#6366F1] text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {notification.message}
        </div>
    );

    // --- hendlers ---
    const handleBackToMarketplace = () => {
        setSelectedTwin(null);
        setIsUploadPage(false);
    };
    
    const handleNewAssetUpload = (newAsset:any) => {
      // For now, we'll add the new asset to the myListedTwins list
      setMyListedTwins(prev => [...prev, newAsset]);
    };

    const handleFavoriteToggle = (id: string) => {
      const updateList = (list: BaseItem[]): BaseItem[] => {
        return list.map((item) =>
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        );
      };

      setListings((prevListings: BaseItem[]) => updateList(prevListings));
      setAssets((prevAssets: BaseItem[]) => updateList(prevAssets));
      setMyListedTwins((prevMyListedTwins: BaseItem[]) => updateList(prevMyListedTwins));
    };

    const handleCommentAdded = (twinId: string, newComment: { user: string; comment: string; date: Date }) => {
      const updateData = (dataArray: BaseItem[]): BaseItem[] =>
        dataArray.map(item =>
          item.id === twinId
            ? { ...item, comments: [...(item.comments || []), newComment] }
            : item
        );
    
      setListings(prev => updateData(prev));
      setAssets(prev => updateData(prev));
      setMyListedTwins(prev => updateData(prev));

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

            <div className="min-h-screen" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around'
            }}>
           
                <main className={`transition-all duration-300 ease-in-out min-h-screen ${isSidebarExpanded ? 'pl-72' : 'pl-20'}`} style={{padding:'0px', width:'100%'}}>
                    {isUploadPage ? (
                        <UploadPage onBack={handleBackToMarketplace} onUpload={handleNewAssetUpload} />
                    ) : selectedTwin ? (
                        <DetailedView 
                            twin={selectedTwin} 
                            onBack={handleBackToMarketplace} 
                            onFavoriteToggle={handleFavoriteToggle}
                            onSelectTwin={handleSelectTwin}
                            userId={userId}
                            onCommentAdded={handleCommentAdded}
                            cart={{product: selectedTwin}}
                        />
                    ) : (
                        <MarketplacePage 
                            friends={users} 
                            onSelectTwin={handleSelectTwin}
                            onNavigateToUpload={() => setIsUploadPage(true)}
                        />
                    )}
                </main>
           
                <NewProjectModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    userId={userId}
                    showNotification={showNotification}
                />
           
                <AppNotification />

                <BuyAndCart />

            </div>

        </section>
    );

};
export default MarketplacePageTwinx;