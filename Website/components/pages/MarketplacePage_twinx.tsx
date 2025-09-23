import { FC, useEffect, useRef } from 'react';
import React, { useState, useMemo } from 'react';
import { addDoc, collection, deleteDoc, doc, Firestore, getFirestore, Timestamp
} from 'firebase/firestore';
import { 
    UploadCloud, Briefcase, User, Settings, Download, Users, CreditCard, Puzzle, LayoutTemplate, BookOpen, BarChart2, KeyRound, Store, LucideProps, X
} from 'lucide-react';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import "../../../app/(twinx)/globals.css";



// --- Type Declarations for Global Variables & Third-Party Libraries ---

// Extend the Window interface to include properties from external scripts
declare global {
    interface Window {
        __firebase_config?: string;
        __app_id?: string;
        __initial_auth_token?: string;
        THREE: any; // Using 'any' for THREE.js as its types can be complex
    }
}

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
const appId = firebaseConfig.appId || 'default_app_id'; // Fallback to a default app ID if not set

// --- Firebase Initialization ---
const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

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
const FAKE_USERS: AppUser[] = [
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
        title: null,
        items: [
            { view: 'updates', text: 'Pending updates', icon: Download, badgeCount: 2 },
        ]
    },
    {
        title: 'Workspace',
        items: [
            { view: 'dashboard', text: 'Digital Twins', icon: Briefcase },
            { view: 'templates', text: 'Templates', icon: LayoutTemplate },
            { view: 'members', text: 'Members', icon: Users },
            { view: 'integrations', text: 'Integrations', icon: Puzzle },
        ]
    },
    {
        title: 'Marketplace',
        items: [
            { view: 'marketplace', text: 'Marketplace', icon: Store },
            { view: 'yourtwins', text: 'Your Twins', icon: Briefcase },
            { view: 'analytics', text: 'Analytics', icon: BarChart2 },
        ]
    },
    {
        title: 'API',
        items: [
            { view: 'api', text: 'Keys', icon: KeyRound },
            { view: 'apiguide', text: 'Guide', icon: BookOpen },
            { view: 'apiusage', text: 'Usage', icon: BarChart2 },
        ]
    },
    {
        title: 'Account',
        items: [
            { view: 'profile', text: 'Profile', icon: User },
            { view: 'settings', text: 'Settings', icon: Settings },
            { view: 'plans', text: 'Plans', icon: CreditCard },
        ]
    }
];





// --- Helper Functions ---
const generateTwinxId = (): string => {
    const randomPart = [...Array(16)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    return `twinx_${randomPart}`;
};

// --- Component Prop Interfaces ---

interface NavHeaderProps {
    text: string;
    isSidebarExpanded: boolean;
}

interface NavItemProps {
    icon: React.ComponentType<LucideProps>;
    text: string;
    view: string;
    badgeCount?: number;
    isSidebarExpanded: boolean;
    currentView: string;
    handleNavigate: (view: string) => void;
}

interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
    showNotification: (message: string) => void;
}

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    text: string;
}

interface EditKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, name: string) => void;
    apiKey: ApiKey | null;
}


// --- 3D Viewport Component ---
const ThreeViewport: FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animationFrameId: number;
        const currentMount = mountRef.current;
        let renderer: any, gimbalRenderer: any, controls: any;

        const init = (): (() => void) | void => {
            if (typeof window.THREE === 'undefined' || !currentMount) {
                console.error("THREE.js or mount point not available.");
                return;
            }

            const setupScene = (): (() => void) => {
                if (typeof window.THREE.OrbitControls === 'undefined') {
                    console.error("OrbitControls not loaded correctly.");
                    return () => {};
                }

                const scene = new window.THREE.Scene();
                scene.background = new window.THREE.Color(0x1C1C1E);
                const camera = new window.THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
                renderer = new window.THREE.WebGLRenderer({ antialias: true });
                
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                currentMount.appendChild(renderer.domElement);

                controls = new window.THREE.OrbitControls(camera, renderer.domElement);
                controls.enableDamping = true;
                controls.dampingFactor = 0.05;
                controls.screenSpacePanning = false;
                controls.minDistance = 3;
                controls.maxDistance = 10;

                const geometry = new window.THREE.BoxGeometry(1, 1, 1);
                const material = new window.THREE.MeshStandardMaterial({ color: 0x6366F1 });
                const cube = new window.THREE.Mesh(geometry, material);
                scene.add(cube);
                
                const gridHelper = new window.THREE.GridHelper(10, 10, 0x444444, 0x444444);
                scene.add(gridHelper);

                const ambientLight = new window.THREE.AmbientLight(0xffffff, 0.5);
                scene.add(ambientLight);
                const pointLight = new window.THREE.PointLight(0xffffff, 0.8);
                pointLight.position.set(5, 5, 5);
                scene.add(pointLight);

                camera.position.z = 5;

                const gimbalScene = new window.THREE.Scene();
                const gimbalCamera = new window.THREE.PerspectiveCamera(50, 1, 0.1, 10);
                gimbalRenderer = new window.THREE.WebGLRenderer({ alpha: true, antialias: true });
                gimbalRenderer.setSize(80, 80);
                gimbalRenderer.domElement.style.position = 'absolute';
                gimbalRenderer.domElement.style.top = '10px';
                gimbalRenderer.domElement.style.right = '10px';
                currentMount.appendChild(gimbalRenderer.domElement);

                const axesHelper = new window.THREE.AxesHelper(2);
                gimbalScene.add(axesHelper);

                const animate = () => {
                    animationFrameId = requestAnimationFrame(animate);
                    cube.rotation.x += 0.005;
                    cube.rotation.y += 0.005;
                    if (controls) controls.update();
                    
                    gimbalCamera.position.copy(camera.position);
                    gimbalCamera.position.sub(controls.target);
                    gimbalCamera.position.setLength(3);
                    gimbalCamera.lookAt(gimbalScene.position);

                    if (renderer) renderer.render(scene, camera);
                    if (gimbalRenderer) gimbalRenderer.render(gimbalScene, gimbalCamera);
                };
                animate();

                const handleResize = () => {
                    if (!currentMount || !renderer) return;
                    camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
                };
                window.addEventListener('resize', handleResize);
                
                return () => {
                    window.removeEventListener('resize', handleResize);
                };
            };

            if (window.THREE && window.THREE.OrbitControls) {
                return setupScene();
            } else {
                const script = document.createElement('script');
                script.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
                script.id = 'orbit-controls-script';
                script.onload = setupScene;
                script.onerror = () => console.error("Failed to load OrbitControls script.");

                if (!document.getElementById(script.id)) {
                    document.body.appendChild(script);
                }

                return () => {
                    const existingScript = document.getElementById(script.id);
                    if (existingScript) {
                        document.body.removeChild(existingScript);
                    }
                };
            }
        };

        const cleanupScene = init();

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (controls) controls.dispose();
            if (renderer) renderer.dispose();
            if (gimbalRenderer) gimbalRenderer.dispose();
            if (currentMount) {
                while (currentMount.firstChild) {
                    currentMount.removeChild(currentMount.firstChild);
                }
            }
            if (typeof cleanupScene === 'function') {
                cleanupScene();
            }
        };
    }, []);

    return <div ref={mountRef} className="w-full h-full relative" />;
};





const NewProjectModal: FC<NewProjectModalProps> = ({ isOpen, onClose, userId, showNotification }) => {
    const [title, setTitle] = useState<string>('');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<string>('');
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [twinxid, setTwinxid] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTwinxid(generateTwinxId());
        } else {
            setTitle(''); setVideoFile(null); setThumbnail(''); setTwinxid(''); setVideoUrl('');
        }
    }, [isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            setVideoFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setVideoUrl(event.target?.result as string);
            };
            reader.readAsDataURL(file);
            generateThumbnail(file);
        } else {
            showNotification("Please select a valid video file.");
        }
    };

    const generateThumbnail = (file: File) => {
        setIsGenerating(true);
        const video = document.createElement('video');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        video.src = URL.createObjectURL(file);
        video.muted = true;
        video.onloadedmetadata = () => { video.currentTime = video.duration / 2; };
        video.onseeked = () => {
            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                setThumbnail(canvas.toDataURL('image/jpeg', 0.8));
            }
            setIsGenerating(false);
            URL.revokeObjectURL(video.src);
        };
        video.onerror = () => {
            setIsGenerating(false); setThumbnail('');
            showNotification("Could not generate thumbnail from this video.");
            URL.revokeObjectURL(video.src);
        };
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title || !videoFile || !userId) {
            showNotification("Please provide a title and a video file."); return;
        }
        
        onClose();

        const newProject = {
            title, twinxid, thumbnail, videoUrl, isFavorite: false, isPublished: false, currentStep: 0,
            createdAt: new Date(), updatedAt: new Date(),
        };
        try {
            const projectsCollectionPath = `/artifacts/${appId}/users/${userId}/projects`;
            await addDoc(collection(db, projectsCollectionPath), newProject);
            showNotification("Digital Twin created successfully!");
        } catch (error) {
            console.error("Error creating Digital Twin:", error);
            showNotification("Failed to create Digital Twin.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-lg border border-[#3A3A3C] transform transition-all scale-95 animate-scale-in">
                <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                    <h3 className="text-xl font-bold text-white">Create New Digital Twin</h3>
                    <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-white mb-1">Digital Twin Title</label>
                            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required
                                   className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-white mb-1">Upload Video</label>
                            <div onClick={() => fileInputRef.current?.click()}
                                 className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#3A3A3C] border-dashed rounded-md cursor-pointer hover:border-[#6366F1]">
                                <div className="space-y-1 text-center">
                                    {thumbnail ? <img src={thumbnail} alt="Video preview" className="mx-auto h-24 rounded-md" /> : isGenerating ? <p className="text-[#A0A0A5]">Generating preview...</p> : <UploadCloud className="mx-auto h-12 w-12 text-[#A0A0A5]" />}
                                    <div className="flex text-sm text-[#A0A0A5]"><p className="pl-1">{videoFile ? videoFile.name : 'Click to upload or drag and drop'}</p></div>
                                    <p className="text-xs text-[#A0A0A5]">MP4, MOV, AVI up to 5GB</p>
                                </div>
                            </div>
                            <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" accept="video/*" className="sr-only" onChange={handleFileChange} />
                        </div>
                        <div>
                            <label htmlFor="twinxid" className="block text-sm font-medium text-white mb-1">Twinx ID</label>
                            <input type="text" id="twinxid" value={twinxid} readOnly className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-[#A0A0A5] font-mono" />
                        </div>
                    </div>
                    <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4A4A4C] transition-colors">Cancel</button>
                        <button type="submit" disabled={isGenerating || !thumbnail} className="bg-[#6366F1] text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors disabled:bg-opacity-50 disabled:cursor-not-allowed">
                            {isGenerating ? 'Processing...' : 'Create Digital Twin'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};



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

    const MarketplaceCard = ({ item, onFavoriteToggle, onSelect }: {item: BaseItem, onFavoriteToggle: (id: string) => void, onSelect: (item: BaseItem) => void}) => (
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

    const NetworkUserCard = ({ user }: { user: AppUser }) => (
            <div className="bg-[#262629] rounded-lg p-4 text-center border border-[#3A3A3C] hover:border-[#4A4A4C] transition-colors">
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mx-auto mb-4" />
                <h3 className="font-bold text-white">{user.name}</h3>
                <p className="text-sm text-[#A0A0A5]">{user.email}</p>
            </div>
    );

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