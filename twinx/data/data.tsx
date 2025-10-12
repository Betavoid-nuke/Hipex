import { Timestamp } from "firebase/firestore";
import { BarChart2, BookOpen, Briefcase, Check, CreditCard, Download, Eye, FileText, KeyRound, LayoutTemplate, MoreVertical, Puzzle, Search, Settings, Star, Store, Trash2, UploadCloud, User, Users } from "lucide-react";


// --- Data Model Interfaces ---
interface BaseItem {
    id: string;
    title: string;
    author: string;
    price: number;
    thumbnail: string;
    category: string;
    tags: string[];
    isAnimated: boolean;
    isDownloadable: boolean;
    date: Date;
    likes: number;
    isFavorite: boolean;
}

interface AppUser {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    id?: string; // id is sometimes used interchangeably with uid
}

interface Project {
    id: string;
    title: string;
    twinxid: string;
    thumbnail: string;
    videoUrl: string;
    isFavorite: boolean;
    isPublished: boolean;
    currentStep: number;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
}

interface DraggingProject extends Project {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
}

interface ApiKey {
    id: number;
    name: string;
    secret: string;
    created: string;
    lastUsed: string;
    createdBy: string;
    permissions: string;
}








// --- Mock Data and Configuration ---
const USERS: AppUser[] = [
    { uid: 'friend1_uid', name: 'Alex Doe', email: 'alex@example.com', avatar: 'https://placehold.co/40x40/FFC107/000000?text=A' },
    { uid: 'friend2_uid', name: 'Brenda Smith', email: 'brenda@example.com', avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=B' },
    { uid: 'friend3_uid', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://placehold.co/40x40/F44336/FFFFFF?text=C' },
];

const marketplaceListingsJson: BaseItem[] = [
    { id: 'm1', title: 'Cyberpunk Megatower', author: 'Alex Doe', price: 89.99, thumbnail: 'https://placehold.co/400x225/FF5722/FFFFFF?text=Tower', category: 'Building', tags: ['sci-fi', 'cyberpunk', 'skyscraper'], isAnimated: false, isDownloadable: true, date: new Date('2025-06-15'), likes: 1200, isFavorite: false },
    { id: 'm2', title: 'Medieval Castle', author: 'Brenda Smith', price: 79.99, thumbnail: 'https://placehold.co/400x225/795548/FFFFFF?text=Castle', category: 'Building', tags: ['fantasy', 'building', 'medieval'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-01'), likes: 3400, isFavorite: true },
    { id: 'm3', title: 'Luxury Penthouse', author: 'Charlie Brown', price: 120.00, thumbnail: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Penthouse', category: 'Penthouse', tags: ['modern', 'luxury', 'interior'], isAnimated: false, isDownloadable: true, date: new Date('2025-05-20'), likes: 850, isFavorite: false },
    { id: 'm4', title: 'Modern Office Space', author: 'Alex Doe', price: 99.99, thumbnail: 'https://placehold.co/400x225/607D8B/FFFFFF?text=Office', category: 'Office', tags: ['corporate', 'interior', 'modern'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-10'), likes: 5600, isFavorite: false },
    { id: 'm5', title: 'Grand Hotel Lobby', author: 'Jane Doe', price: 150.00, thumbnail: 'https://placehold.co/400x225/03A9F4/FFFFFF?text=Lobby', category: 'Hotel', tags: ['luxury', 'hotel', 'lobby', 'interior'], isAnimated: false, isDownloadable: true, date: new Date('2024-11-30'), likes: 2100, isFavorite: false },
    { id: 'm6', title: 'Industrial Warehouse', author: 'Brenda Smith', price: 45.99, thumbnail: 'https://placehold.co/400x225/8BC34A/FFFFFF?text=Warehouse', category: 'Warehouse', tags: ['industrial', 'storage', 'factory'], isAnimated: false, isDownloadable: false, date: new Date('2025-03-22'), likes: 950, isFavorite: false },
    { id: 'm7', title: 'Concert Hall Venue', author: 'Charlie Brown', price: 110.00, thumbnail: 'https://placehold.co/400x225/E91E63/FFFFFF?text=Venue', category: 'Venues', tags: ['music', 'concert', 'hall'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-20'), likes: 1800, isFavorite: false },
    { id: 'm8', title: 'Football Stadium', author: 'Alex Doe', price: 250.00, thumbnail: 'https://placehold.co/400x225/FFC107/000000?text=Stadium', category: 'Stadium', tags: ['sports', 'arena', 'football'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-22'), likes: 7200, isFavorite: false },
    { id: 'm9', title: 'Free Voxel Tree Pack', author: 'Community', price: 0, thumbnail: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Free+Trees', category: 'Home', tags: ['free', 'voxel', 'nature'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-15'), likes: 8900, isFavorite: false },
    { id: 'm10', title: 'Animated Fire Particle', author: 'Community', price: 0, thumbnail: 'https://placehold.co/400x225/F44336/FFFFFF?text=Free+Fire', category: 'Venues', tags: ['free', 'vfx', 'animated'], isAnimated: true, isDownloadable: true, date: new Date('2025-07-18'), likes: 12500, isFavorite: false },
];

const myListedTwinsJson: BaseItem[] = [
    { id: 't1', title: 'Modern Mansion Exterior', author: 'Simon Prusin', price: 135.00, thumbnail: 'https://placehold.co/400x225/9C27B0/FFFFFF?text=Mansion', category: 'Mansion', tags: ['modern', 'luxury', 'exterior'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-18'), likes: 980, isFavorite: false },
    { id: 't2', title: 'Ancient Temple Ruins', author: 'Simon Prusin', price: 75.00, thumbnail: 'https://placehold.co/400x225/CDDC39/000000?text=Ruins', category: 'Building', tags: ['ancient', 'ruins', 'jungle'], isAnimated: false, isDownloadable: true, date: new Date('2025-06-30'), likes: 1500, isFavorite: true },
    { id: 't3', title: 'Smart Factory Floor', author: 'Simon Prusin', price: 165.00, thumbnail: 'https://placehold.co/400x225/009688/FFFFFF?text=Factory', category: 'Factory', tags: ['iot', 'industrial', 'automation'], isAnimated: true, isDownloadable: true, date: new Date('2024-11-30'), likes: 2100, isFavorite: false },
];

const assetsJson: BaseItem[] = [
    { id: 'a1', title: 'Sci-Fi Crate Set', author: 'Alex Doe', price: 15.00, thumbnail: 'https://placehold.co/400x225/9E9E9E/FFFFFF?text=Crates', category: 'Props', tags: ['sci-fi', 'props', 'crate'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-02'), likes: 450, isFavorite: false },
    { id: 'a2', title: 'PBR Rock Collection', author: 'Brenda Smith', price: 25.00, thumbnail: 'https://placehold.co/400x225/BDBDBD/000000?text=Rocks', category: 'Nature', tags: ['pbr', 'rock', 'nature'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-05'), likes: 1100, isFavorite: false },
    { id: 'a3', title: 'Free Low-Poly Sword', author: 'Community', price: 0, thumbnail: 'https://placehold.co/400x225/FF9800/FFFFFF?text=Sword', category: 'Weapons', tags: ['free', 'low-poly', 'weapon'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-10'), likes: 5200, isFavorite: false },
];

const analyticsData = {
  summary: {
    totalRevenue: { value: '$4,823', trend: '+12.5%' },
    totalSales: { value: '345', trend: '+8.1%' },
    totalClicks: { value: '1.2M', trend: '+21.2%' },
    avgTimeSpent: { value: '2m 45s', trend: '-2.3%' }
  },
  salesRevenueChart: [
    { name: 'Jan', sales: 4000, revenue: 2400 },
    { name: 'Feb', sales: 3000, revenue: 1398 },
    { name: 'Mar', sales: 2000, revenue: 9800 },
    { name: 'Apr', sales: 2780, revenue: 3908 },
    { name: 'May', sales: 1890, revenue: 4800 },
    { name: 'Jun', sales: 2390, revenue: 3800 },
    { name: 'Jul', sales: 3490, revenue: 4300 },
  ]
};

const apiUsageData = {
    summary: {
        totalRequests: { value: "1.4M", trend: "+5.2%" },
        dataProcessed: { value: "25.6 GB", trend: "+3.8%" },
        successfulRequests: { value: "99.8%", trend: null },
        errorRate: { value: "0.2%", trend: null }
    },
    callsPerDayChart: (() => {
        const data = [];
        for (let i = 29; i >= 0; i--) {
            data.push({
                day: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                requests: Math.floor(Math.random() * 50000) + 10000,
            });
        }
        return data;
    })()
};


const SIDEBAR_CONFIG = [
  {
    title: 'Workspace',
    items: [
      { view: 'dashboard', text: 'Digital Twins', icon: Briefcase, href: '/twinx/Dashboard', idneeded:true },
      { view: 'templates', text: 'Templates', icon: LayoutTemplate, href: '/twinx/templates', idneeded:false },
      { view: 'members', text: 'Members', icon: Users, href: '/twinx/members', idneeded:true },
      { view: 'integrations', text: 'Integrations', icon: Puzzle, href: '/twinx/integrations', idneeded:false },
    ],
  },
  {
    title: 'Marketplace',
    items: [
      { view: 'marketplace', text: 'Marketplace', icon: Store, href: '/twinx/marketplace', idneeded:true },
      { view: 'yourtwins', text: 'Your Twins', icon: Briefcase, href: '/twinx/yourtwins', idneeded:true },
      { view: 'analytics', text: 'Analytics', icon: BarChart2, href: '/twinx/analytics', idneeded:true },
    ],
  },
  {
    title: 'API',
    items: [
      { view: 'api', text: 'Keys', icon: KeyRound, href: '/api', idneeded:true },
      { view: 'apiguide', text: 'Guide', icon: BookOpen, href: '/twinx/apiguide', idneeded:true },
      { view: 'apiusage', text: 'Usage', icon: BarChart2, href: '/twinx/apiusage', idneeded:true },
    ],
  },
  {
    title: 'Account',
    items: [
      { view: 'profile', text: 'Profile', icon: User, href: '/twinx/accountprofile', idneeded:true },
      { view: 'settings', text: 'Settings', icon: Settings, href: '/twinx/accountsettings', idneeded:true },
      { view: 'plans', text: 'Plans', icon: CreditCard, href: '/twinx/accountplans', idneeded:false },
    ],
  },
];



// --- Constants ---
const PIPELINE_CONFIG = [
    { id: 1, name: 'Upload', description: 'Video is being uploaded to secure servers.', icon: UploadCloud },
    { id: 2, name: 'Transcoding', description: 'Adjusting video format for compatibility.', icon: Settings },
    { id: 3, name: 'Quality Analysis', description: 'Assessing video resolution and bitrate.', icon: Check },
    { id: 4, name: 'Scene Detection', description: 'Identifying distinct scenes in the video.', icon: FileText },
    { id: 5, name: 'Object Recognition', description: 'Detecting objects within each frame.', icon: Search },
    { id: 6, name: 'Metadata Extraction', description: 'Gathering technical details from the file.', icon: Briefcase },
    { id: 7, name: 'Audio Transcription', description: 'Converting spoken words to text.', icon: User },
    { id: 8, name: 'Geometry Mapping', description: 'Creating a 3D representation of the scene.', icon: MoreVertical },
    { id: 9, name: 'Texture Baking', description: 'Applying textures to the 3D model.', icon: Star },
    { id: 10, name: 'Lighting Simulation', description: 'Simulating realistic lighting conditions.', icon: Eye },
    { id: 11, name: 'Physics Caching', description: 'Pre-calculating physics interactions.', icon: Trash2 },
    { id: 12, name: 'Final Assembly', description: 'Compiling all data into the final twin.', icon: Check },
];

const TOTAL_STEPS = PIPELINE_CONFIG.length;

export default function dataManager(){
    const DataManager = {marketplaceListing: marketplaceListingsJson, users: USERS, assetListing: assetsJson,
        listingAnalyticData: analyticsData, ApiUsageData: apiUsageData, sidebarConfig: SIDEBAR_CONFIG, PipelineConfig: PIPELINE_CONFIG, TotalPipelineSteps: TOTAL_STEPS, MylistedModels :myListedTwinsJson
    };
    return DataManager;
}