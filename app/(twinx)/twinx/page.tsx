"use client"


import React, { useState, useEffect, useRef, useCallback, useMemo, FC, ReactNode } from 'react';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken, Auth, User as FirebaseUser } from 'firebase/auth';
import { 
    getFirestore, collection, doc, onSnapshot, addDoc, updateDoc, deleteDoc, setDoc, 
    query, where, getDocs, serverTimestamp, getDoc, writeBatch, Firestore, Timestamp, DocumentData, CollectionReference 
} from 'firebase/firestore';
import { 
    Check, Copy, Star, MoreVertical, X, Plus, UploadCloud, Trash2, ChevronLeft, Menu, Search, 
    Briefcase, User, Settings, FileText, Share2, EyeOff, Eye, Download, SlidersHorizontal, 
    Command, Bell, Shield, Globe, Users, CreditCard, Puzzle, Code, LayoutTemplate, Send, UserPlus, 
    Info, Edit, BookOpen, BarChart2, KeyRound, Calendar, ChevronDown, Upload, Store, Sliders, 
    ListFilter, Heart, MessageSquare, DollarSign, Clock, MousePointerClick, TrendingUp, Zap, Server, 
    AlertTriangle, CheckCircle, Linkedin, Instagram, Twitter, Sun, Moon, Laptop, Building, Mail, 
    MapPin, Link as LinkIcon, LucideProps,
    SettingsIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, Bar } from 'recharts';
import DashboardCore from '@/twinx/pages/Dashboard';
import ProjectCardCore from '@/twinx/components/ProjectCard';
import dynamic from 'next/dynamic';
import { getCurrentUser, updateUserOnDB } from '@/lib/actions/user.action';
import { ClerkProvider, useAuth, useUser } from '@clerk/nextjs';
import { ApiKey, AppUser, BaseItem, DraggingProject, Project } from '@/twinx/types/TwinxTypes';
import dataManager from '@/twinx/data/data';
import NavHeader from '@/twinx/components/sidebarNavHead';
import NavItem from '@/twinx/components/SidebarNavIteam';
import NewProjectModal from '@/twinx/components/NewProjectModel';
import DeleteConfirmationModal from '@/twinx/components/DeleteConfirmationModal';
import ProjectViewPage from '@/twinx/pages/ProjectView';
import PlaceholderViewPage from '@/twinx/pages/PlaceholderView';
import PlansPagePage from '@/twinx/pages/PlansPage';
import ApiPagePage from '@/twinx/pages/ApiPage';
import ApiGuidePagePage from '@/twinx/pages/ApiGuidePage';
import MembersPagePage from '@/twinx/pages/MembersPage';


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







// --- Mock Data and Configuration ---
const FAKE_USERS: AppUser[] = dataManager().users;

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








// Dynamically import Clerk components to avoid hydration errors
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
  loading: () => <div className="text-white" style={{color:'white'}}>Loading user...</div>,
});

const SignInButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignInButton), {
  ssr: false,
  loading: () => <div className="text-white" style={{color:'white'}}>Loading sign-in...</div>,
});

const SignedIn = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedIn), {
  ssr: false,
  loading: () => null,
});

const SignedOut = dynamic(() => import('@clerk/nextjs').then(mod => mod.SignedOut), {
  ssr: false,
  loading: () => null,
});






// --- Main App Component ---
function MainPage() {
    // --- State Management ---
    const [userId, setUserId] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [currentView, setCurrentView] = useState<string>('dashboard');
    const [previousView, setPreviousView] = useState<string>('dashboard');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedTwin, setSelectedTwin] = useState<BaseItem | null>(null);
    const [isSidebarExpanded, setIsSidebarExpanded] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filter, setFilter] = useState<string>('All');
    const [sort, setSort] = useState<string>('date_desc');
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [notification, setNotification] = useState<{ show: boolean; message: string }>({ show: false, message: '' });
    const [draggingProject, setDraggingProject] = useState<DraggingProject | null>(null);
    const [dragPosition, setDragPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isOverTrash, setIsOverTrash] = useState<boolean>(false);
    const [isCardOverZone, setIsCardOverZone] = useState<boolean>(false);
    const [friends, setFriends] = useState<AppUser[]>([]);
    const [simulatingProjectId, setSimulatingProjectId] = useState<string | null>(null);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const trashRef = useRef<HTMLDivElement>(null);
    const draggedCardRef = useRef<HTMLDivElement>(null);


    // --- Firebase Auth & Data Seeding ---
    useEffect(() => {
        const seedData = async (currentUserId: string) => {
            const batch = writeBatch(db);
            const usersRef = collection(db, `/artifacts/${appId}/public/data/users`);
            
            FAKE_USERS.forEach(user => {
                const userRef = doc(usersRef, user.uid);
                batch.set(userRef, user);
            });
            await batch.commit();

            const friendsRef = collection(db, `/artifacts/${appId}/users/${currentUserId}/friends`);
            const friendsSnapshot = await getDocs(friendsRef);
            if (friendsSnapshot.empty) {
                const friendsBatch = writeBatch(db);
                FAKE_USERS.forEach(friend => {
                    const friendDocRef = doc(friendsRef, friend.uid);
                    friendsBatch.set(friendDocRef, friend);
                });
                await friendsBatch.commit();
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, async (user: FirebaseUser | null) => {
            if (user) {
                const generatedEmail = user.email || `user_${user.uid.substring(0, 5)}@twinx.app`;
                setUserId(user.uid);
                setUserEmail(generatedEmail);
                
                const userRef = doc(db, `/artifacts/${appId}/public/data/users`, user.uid);
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    await setDoc(userRef, { 
                        uid: user.uid,
                        email: generatedEmail,
                        name: 'Current User',
                        avatar: `https://placehold.co/40x40/6366F1/FFFFFF?text=ME`
                    });
                }
                
                await seedData(user.uid);

            } else {
                try {
                    if (typeof window.__initial_auth_token !== 'undefined' && window.__initial_auth_token) {
                        await signInWithCustomToken(auth, window.__initial_auth_token);
                    } else {
                        await signInAnonymously(auth);
                    }
                } catch (error) { console.error("Firebase Auth Error:", error); }
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // --- Firestore Data Fetching ---
    useEffect(() => {
        if (!userId) return;
        const projectsCollectionPath = `/artifacts/${appId}/users/${userId}/projects`;
        const q = query(collection(db, projectsCollectionPath) as CollectionReference<Project>);
        const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setProjects(projectsData);
        }, (error) => { console.error("Firestore Snapshot Error:", error); });
        
        const friendsRef = collection(db, `/artifacts/${appId}/users/${userId}/friends`);
        const unsubscribeFriends = onSnapshot(friendsRef, (snapshot) => {
            const friendsData = snapshot.docs.map(doc => ({ ...(doc.data() as AppUser), id: doc.id }));
            setFriends(friendsData);
        });

        return () => {
            unsubscribeFirestore();
            unsubscribeFriends();
        };
    }, [userId]);
    
    // --- Manual Pipeline Simulation ---
    useEffect(() => {
        if (!simulatingProjectId || !userId) return;

        const interval = setInterval(async () => {
            const projectRef = doc(db, `/artifacts/${appId}/users/${userId}/projects`, simulatingProjectId);
            const projectDoc = await getDoc(projectRef);

            if (projectDoc.exists()) {
                const currentStep = projectDoc.data().currentStep;
                if (currentStep < TOTAL_STEPS) {
                    await updateDoc(projectRef, { currentStep: currentStep + 1, updatedAt: new Date() });
                } else {
                    setSimulatingProjectId(null); // Stop simulation
                }
            } else {
                setSimulatingProjectId(null); // Stop if doc is gone
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [simulatingProjectId, userId]);



    const showNotification = (message: string) => {
        setNotification({ show: true, message });
        setTimeout(() => setNotification({ show: false, message: '' }), 3000);
    };

    const handleNavigate = (view: string) => {
        setCurrentView(view);
        if (view === 'dashboard') setSelectedProject(null);
        if (view !== 'twinDetail') setSelectedTwin(null);
    };

    const handleDeleteClick = useCallback((project: Project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    }, []);

    // --- Drag and Drop Logic ---
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!draggingProject) return;
        
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        setDragPosition({
            x: mouseX - draggingProject.offsetX,
            y: mouseY - draggingProject.offsetY,
        });

        const trashRect = trashRef.current?.getBoundingClientRect();
        const cardRect = draggedCardRef.current?.getBoundingClientRect();

        const isMouseOverTrash = trashRect ? (mouseX >= trashRect.left && mouseX <= trashRect.right && mouseY >= trashRect.top && mouseY <= trashRect.bottom) : false;
        setIsOverTrash(isMouseOverTrash);
        
        const isCardOverlapping = cardRect && trashRect ? !(cardRect.right < trashRect.left || cardRect.left > trashRect.right || cardRect.bottom < trashRect.top || cardRect.top > trashRect.bottom) : false;
        setIsCardOverZone(isCardOverlapping);

    }, [draggingProject]);

    const handleMouseUp = useCallback(() => {
        if (isOverTrash && draggingProject) {
            // Since handleDeleteClick is stable via useCallback, we can call it directly
            handleDeleteClick(draggingProject);
        }
        setDraggingProject(null);
        setIsOverTrash(false);
        setIsCardOverZone(false);
    }, [isOverTrash, draggingProject, handleDeleteClick]);
    
    useEffect(() => {
        if (draggingProject) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggingProject, handleMouseMove, handleMouseUp]);

    // --- Event Handlers & Logic ---
    const handleOutsideClick = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setActiveDropdown(null);
        }
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [handleOutsideClick]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setCurrentView('project');
    };
    
    const handleSelectTwin = (twin: BaseItem) => {
        setPreviousView(currentView);
        setSelectedTwin(twin);
        setCurrentView('twinDetail');
    };

    const toggleFavorite = async (projectId: string, isFavorite: boolean) => {
        if (!userId) return;
        const projectPath = `/artifacts/${appId}/users/${userId}/projects`;
        await updateDoc(doc(db, projectPath, projectId), { isFavorite: !isFavorite });
        setActiveDropdown(null);
    };

    const togglePublish = async (projectId: string, isPublished: boolean) => {
        if (!userId) return;
        const projectPath = `/artifacts/${appId}/users/${userId}/projects`;
        await updateDoc(doc(db, projectPath, projectId), { isPublished: !isPublished });
        setActiveDropdown(null);
    };

    const confirmDelete = async () => {
        const projectToActOn = projectToDelete || draggingProject;
        if (!userId || !projectToActOn) return;
        const projectPath = `/artifacts/${appId}/users/${userId}/projects`;
        await deleteDoc(doc(db, projectPath, projectToActOn.id));
        setIsDeleteModalOpen(false);
        if (selectedProject && selectedProject.id === projectToActOn.id) handleNavigate('dashboard');
        showNotification("Digital Twin deleted successfully.");
        setProjectToDelete(null);
    };

    const filteredAndSortedProjects = useMemo(() => projects
    .filter(p => p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()) && (filter === 'Favorites' ? p.isFavorite : true))
    .sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate().getTime() : new Date(a.createdAt).getTime();
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate().getTime() : new Date(b.createdAt).getTime();
        switch (sort) {
            case 'name_asc': return a.title.localeCompare(b.title);
            case 'name_desc': return b.title.localeCompare(a.title);
            case 'date_asc': return dateA - dateB;
            default: return dateB - dateA;
        }
    }), [projects, searchTerm, filter, sort]);
    
    const copyToClipboard = (text: string, message: string) => {
        navigator.clipboard.writeText(text).then(() => {
            showNotification(message);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            showNotification('Failed to copy.');
        });
    };

    // --- Render Components ---
    const AppNotification = () => (
        <div className={`fixed bottom-5 right-5 bg-[#6366F1] text-white py-2 px-4 rounded-lg shadow-lg transform transition-transform duration-300 ${notification.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {notification.message}
        </div>
    );






    // PAGES ------------------------------------

    const Dashboard = () => {
        return (
            <DashboardCore
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filter={filter}
              setFilter={setFilter}
              sort={sort}
              setSort={setSort}
              filteredAndSortedProjects={filteredAndSortedProjects}
              setDraggingProject={setDraggingProject}
              draggingProject={draggingProject}
              setIsModalOpen={setIsModalOpen}
              handleSelectProject={handleSelectProject}
              activeDropdown={activeDropdown}
              setActiveDropdown={setActiveDropdown}
              handleDeleteClick={handleDeleteClick}
              toggleFavorite={toggleFavorite}
              togglePublish={togglePublish}
              copyToClipboard={copyToClipboard}
            />
        );
    }

    const ProjectCard = () => {
        return (
            <ProjectCardCore
                handleSelectProject={handleSelectProject}
                setDraggingProject={setDraggingProject}
                activeDropdown={activeDropdown}
                setActiveDropdown={setActiveDropdown}
                handleDeleteClick={handleDeleteClick}
                toggleFavorite={toggleFavorite}
                togglePublish={togglePublish}
                copyToClipboard={copyToClipboard}
                isDragging={draggingProject !== null}
            />
        );
    };

    const ProjectView = () => {

        return (
            <ProjectViewPage
              selectedProject={selectedProject}
              projects={projects}
              TOTAL_STEPS={TOTAL_STEPS}
              PIPELINE_CONFIG={PIPELINE_CONFIG}
              simulatingProjectId={simulatingProjectId}
              setSimulatingProjectId={setSimulatingProjectId}
              handleNavigate={handleNavigate}
              showNotification={showNotification}
              copyToClipboard={copyToClipboard}
            />

        );
    };

    const PlaceholderView = () => {
        return (
            <PlaceholderViewPage title="Settings" icon={SettingsIcon} />
        )
    };

    const PlansPage = () => {
        return (
            <PlansPagePage />
        );
    };

    const ApiPage = () => {
        return (
            <ApiPagePage showNotificationIn={(message) => showNotification(message)} handleNavigateIn={(view) => handleNavigate(view)} />
        );
    };

    const ApiGuidePage = () => {
        return (
            <ApiGuidePagePage handleNavigateIn={(view)=>{handleNavigate(view)}} />
        );
    };

    const MembersPage = () => {
        return (
            <MembersPagePage
              userId={userId}
              userEmail={userEmail}
              appId={appId}
              friends={friends}
              showNotification={(msg) => {showNotification(msg)}}
            />
        );
    };










    
    const ApiUsagePage = () => {
        const { summary, callsPerDayChart } = apiUsageData;

        const StatCard = ({ icon: Icon, title, value, color, trend }: { icon: React.ComponentType<LucideProps>, title: string, value: string, color: string, trend?: string | null}) => (
            <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-full bg-${color}-500/20 text-${color}-400`}>
                        <Icon size={24} />
                    </div>
                     {trend && <span className={`text-sm font-semibold flex items-center ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}><TrendingUp size={16} className="mr-1"/>{trend}</span>}
                </div>
                <div>
                    <p className="text-3xl font-bold text-white mt-4">{value}</p>
                    <p className="text-sm text-[#A0A0A5]">{title}</p>
                </div>
            </div>
        );

        return (
            <div className="p-4 sm:p-6 lg:p-8 text-white">
                 <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3"><BarChart2 size={28}/> API Usage</h2>
                     <div className="flex items-center gap-2 text-sm text-[#A0A0A5]">
                        <Calendar size={16} />
                        <span>Last 30 days</span>
                        <ChevronDown size={16} />
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Zap} title="Total Requests" value={summary.totalRequests.value} color="blue" trend={summary.totalRequests.trend} />
                    <StatCard icon={Server} title="Data Processed" value={summary.dataProcessed.value} color="purple" trend={summary.dataProcessed.trend} />
                    <StatCard icon={CheckCircle} title="Successful Requests" value={summary.successfulRequests.value} color="green" trend={summary.successfulRequests.trend}/>
                    <StatCard icon={AlertTriangle} title="Error Rate" value={summary.errorRate.value} color="red" trend={summary.errorRate.trend}/>
                </div>
                 <div className="mt-8">
                     <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                        <h3 className="text-lg font-semibold mb-4">API Calls per Day</h3>
                        <ResponsiveContainer width="100%" height={400}>
                             <AreaChart data={callsPerDayChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="day" stroke="#8A8A8E" fontSize={12} />
                                <YAxis stroke="#8A8A8E" fontSize={12} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" />
                                <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #3A3A3C' }} />
                                <Area type="monotone" dataKey="requests" stroke="#8884d8" fillOpacity={1} fill="url(#colorApi)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        );
    };

    const MarketplaceCard = ({ item, onFavoriteToggle, onSelect }: {item: BaseItem, onFavoriteToggle: (id: string) => void, onSelect: (item: BaseItem) => void}) => (
        <div className="bg-[#262629] rounded-lg overflow-hidden shadow-lg border border-[#3A3A3C] flex flex-col transition-all duration-200 h-full group cursor-pointer" onClick={() => onSelect(item)}>
            <div className="relative">
                <img src={item.thumbnail} alt={item.title} className="w-full h-48 object-cover" />
                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onFavoriteToggle(item.id);
                        }}
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
                                    <Heart size={48} className="mx-auto" />
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
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('My Listed Twins')}} className={`py-3 ${activeTab === 'My Listed Twins' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>My Listed Twins</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('My Network')}} className={`py-3 ${activeTab === 'My Network' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>My Network</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Store')}} className={`py-3 ${activeTab === 'Store' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Store</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('3D Assets')}} className={`py-3 ${activeTab === '3D Assets' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>3D Assets</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Favorites')}} className={`py-3 ${activeTab === 'Favorites' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Favorites</a>
                        </div>
                        <button className="flex items-center gap-2 text-[#A0A0A5] hover:text-white">
                            <ListFilter size={18} />
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
                                    <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] pointer-events-none" />
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
                                <ChevronDown size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] pointer-events-none" />
                            </div>
                        </div>
                    </div>
                )}
                
                {renderContent()}
            </div>
        );
    };

    const AnalyticsPage = () => {
        const { summary, salesRevenueChart } = analyticsData;

        const StatCard = ({ icon: Icon, title, value, color, trend }: { icon: React.ComponentType<LucideProps>, title: string, value: string, color: string, trend?: string | null}) => (
            <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C] flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-full bg-${color}-500/20 text-${color}-400`}>
                        <Icon size={24} />
                    </div>
                    {trend && <span className={`text-sm font-semibold flex items-center ${trend.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}><TrendingUp size={16} className="mr-1"/>{trend}</span>}
                </div>
                <div>
                    <p className="text-3xl font-bold text-white mt-4">{value}</p>
                    <p className="text-sm text-[#A0A0A5]">{title}</p>
                </div>
            </div>
        );

        return (
            <div className="p-4 sm:p-6 lg:p-8 text-white">
                <header className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center gap-3"><BarChart2 size={28}/> Your Twins Analytics</h2>
                    <div className="flex items-center gap-2 text-sm text-[#A0A0A5]">
                        <Calendar size={16} />
                        <span>Last 30 days</span>
                        <ChevronDown size={16} />
                    </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={DollarSign} title="Total Revenue" value={summary.totalRevenue.value} color="green" trend={summary.totalRevenue.trend} />
                    <StatCard icon={TrendingUp} title="Total Sales" value={summary.totalSales.value} color="blue" trend={summary.totalSales.trend} />
                    <StatCard icon={MousePointerClick} title="Total Clicks" value={summary.totalClicks.value} color="purple" trend={summary.totalClicks.trend} />
                    <StatCard icon={Clock} title="Avg. Time Spent" value={summary.avgTimeSpent.value} color="yellow" trend={summary.avgTimeSpent.trend} />
                </div>

                <div className="mt-8">
                     <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                        <h3 className="text-lg font-semibold mb-4">Sales & Revenue</h3>
                        <ResponsiveContainer width="100%" height={400}>
                             <AreaChart data={salesRevenueChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#8A8A8E" />
                                <YAxis stroke="#8A8A8E" />
                                <CartesianGrid strokeDasharray="3 3" stroke="#3A3A3C" />
                                <Tooltip contentStyle={{ backgroundColor: '#1C1C1E', border: '1px solid #3A3A3C' }} />
                                <Legend />
                                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="sales" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>
        );
    };
    
    const YourTwinsPage = () => {
        const [activeTab, setActiveTab] = useState<string>('Models');
        const userListedTwins = useMemo(() => myListedTwinsJson, []);
        const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

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
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Models')}} className={`py-3 ${activeTab === 'Models' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>{userListedTwins.length} Models</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Likes')}} className={`py-3 ${activeTab === 'Likes' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>0 Likes</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Uploads')}} className={`py-3 ${activeTab === 'Uploads' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Uploads</a>
                        </div>
                    </div>

                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold text-white">
                                {activeTab === 'Models' ? 'Listed Models' : 'Popular Models'}
                            </h3>
                            <button className="bg-[#6366F1] hover:bg-opacity-90 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center gap-2">
                                <UploadCloud size={18}/> List a New Twin
                            </button>
                        </div>
                        {userListedTwins.length > 0 ? (
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {userListedTwins.map(item => <MarketplaceCard key={item.id} item={item} onSelect={handleSelectTwin} onFavoriteToggle={() => {}} />)}
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
    
    const ShareProfileModal = ({ isOpen, onClose, showNotification }: { isOpen: boolean, onClose: () => void, showNotification: (message: string) => void }) => {
        const profileUrl = 'https://twinx.app/u/simonprusin';

        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-md border border-[#3A3A3C] transform transition-all scale-95 animate-scale-in">
                    <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                        <h3 className="text-xl font-bold text-white">Share Profile</h3>
                        <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                    </div>
                    <div className="p-6">
                        <p className="text-[#A0A0A5] mb-4">Share this profile with others via the link below or on social media.</p>
                        <div className="flex items-center bg-[#1C1C1E] border border-[#3A3A3C] rounded-md p-2">
                            <input type="text" readOnly value={profileUrl} className="bg-transparent text-white w-full outline-none font-mono text-sm" />
                            <button onClick={() => copyToClipboard(profileUrl, 'Profile link copied to clipboard!')} className="bg-[#3A3A3C] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#4A4A4C] transition-colors text-sm">Copy</button>
                        </div>
                        <div className="mt-6 flex justify-center gap-4">
                            <a href={`https://twitter.com/intent/tweet?url=${profileUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C] transition-colors"><Twitter size={24} /></a>
                            <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${profileUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C] transition-colors"><Linkedin size={24} /></a>
                            <a href={`https://www.instagram.com`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C] transition-colors"><Instagram size={24} /></a>
                            <a href={`https://wa.me/?text=${profileUrl}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C] transition-colors"><MessageSquare size={24} /></a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const TwinDetailPage = () => {
        if (!selectedTwin) return null;

        return (
            <div className="p-4 sm:p-6 lg:p-8 text-white">
                <button onClick={() => handleNavigate(previousView)} className="flex items-center gap-2 text-[#A0A0A5] hover:text-white mb-6">
                    <ChevronLeft size={20} /> Back
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] aspect-video flex items-center justify-center">
                            <img src={selectedTwin.thumbnail} alt={selectedTwin.title} className="max-h-full max-w-full rounded-lg" />
                        </div>
                    </div>
                    <div>
                         <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                            <h2 className="text-3xl font-bold">{selectedTwin.title}</h2>
                            <div className="flex items-center gap-2 mt-2">
                                <img src={`https://placehold.co/24x24/6366F1/FFFFFF?text=${selectedTwin.author.charAt(0)}`} alt={selectedTwin.author} className="w-6 h-6 rounded-full" />
                                <span className="text-[#A0A0A5]">{selectedTwin.author}</span>
                            </div>
                            <div className="mt-6">
                                {selectedTwin.price === 0 ? (
                                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2">
                                        <Download size={20} /> Download
                                    </button>
                                ) : (
                                    <button className="w-full bg-[#6366F1] hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg text-lg">
                                        ${selectedTwin.price.toFixed(2)} - Purchase
                                    </button>
                                )}
                            </div>
                            <div className="flex justify-around mt-4 text-[#A0A0A5]">
                                <span className="flex items-center gap-2"><Heart size={16}/> {selectedTwin.likes.toLocaleString()}</span>
                                <span className="flex items-center gap-2"><Eye size={16}/> {(selectedTwin.likes * 5).toLocaleString()}</span>
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        )
    }
    
    const SettingsPage = () => {
        const [settings, setSettings] = useState({
            profile: { name: 'Simon Prusin', username: 'simon_prusin', email: 'simonprusin@gmail.com', bio: '3D Artist & Digital Twin Specialist' },
            security: { twoFactorAuth: true, passwordLastUpdated: '2 months ago' },
            notifications: { projectUpdates: true, marketplaceNews: true, weeklySummary: false },
            theme: 'dark',
        });

        const handleSettingChange = (section: keyof typeof settings, key: string, value: any) => {
            setSettings(prev => ({
                ...prev
            }));
        };

        const SettingRow: FC<{ label: string, children: ReactNode }> = ({ label, children }) => (
            <div className="flex items-center justify-between py-4 border-b border-[#3A3A3C] last:border-b-0">
                <p className="text-white">{label}</p>
                <div className="flex items-center gap-4">{children}</div>
            </div>
        );

        const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
            <button onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-500' : 'bg-[#4A4A4C]'}`}>
                <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        );

        return (
            <div className="p-4 sm:p-6 lg:p-8 text-white max-w-4xl mx-auto">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold flex items-center gap-3"><Settings size={32}/> Settings</h2>
                    <p className="text-[#A0A0A5] mt-1">Manage your account and workspace settings.</p>
                </header>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Profile</h3>
                    <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                        <SettingRow label="Full Name">
                            <input type="text" value={settings.profile.name} onChange={e => handleSettingChange('profile', 'name', e.target.value)} className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-1.5 text-right w-64"/>
                        </SettingRow>
                        <SettingRow label="Username">
                             <input type="text" value={settings.profile.username} onChange={e => handleSettingChange('profile', 'username', e.target.value)} className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-1.5 text-right w-64"/>
                        </SettingRow>
                        <SettingRow label="Email">
                             <input type="email" value={settings.profile.email} onChange={e => handleSettingChange('profile', 'email', e.target.value)} className="bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-1.5 text-right w-64"/>
                        </SettingRow>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Appearance</h3>
                    <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                         <SettingRow label="Theme">
                            <div className="flex items-center gap-2 bg-[#1C1C1E] p-1 rounded-lg">
                                <button onClick={() => handleSettingChange('theme', 'theme', 'dark')} className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 ${settings.theme === 'dark' ? 'bg-indigo-500' : ''}`}><Moon size={16}/> Dark</button>
                                <button onClick={() => handleSettingChange('theme', 'theme', 'light')} className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 ${settings.theme === 'light' ? 'bg-indigo-500' : ''}`}><Sun size={16}/> Light</button>
                                <button onClick={() => handleSettingChange('theme', 'theme', 'system')} className={`px-3 py-1 rounded-md text-sm flex items-center gap-2 ${settings.theme === 'system' ? 'bg-indigo-500' : ''}`}><Laptop size={16}/> System</button>
                            </div>
                        </SettingRow>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Security</h3>
                    <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                        <SettingRow label="Two-Factor Authentication">
                            <Toggle enabled={settings.security.twoFactorAuth} onChange={() => handleSettingChange('security', 'twoFactorAuth', !settings.security.twoFactorAuth)} />
                        </SettingRow>
                        <SettingRow label="Password">
                            <span className="text-sm text-[#A0A0A5]">Last updated {settings.security.passwordLastUpdated}</span>
                            <button className="text-indigo-400 hover:underline text-sm font-semibold">Change Password</button>
                        </SettingRow>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                    <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                        <SettingRow label="Project Updates">
                            <Toggle enabled={settings.notifications.projectUpdates} onChange={() => handleSettingChange('notifications', 'projectUpdates', !settings.notifications.projectUpdates)} />
                        </SettingRow>
                        <SettingRow label="Marketplace News">
                            <Toggle enabled={settings.notifications.marketplaceNews} onChange={() => handleSettingChange('notifications', 'marketplaceNews', !settings.notifications.marketplaceNews)} />
                        </SettingRow>
                         <SettingRow label="Weekly Summary">
                            <Toggle enabled={settings.notifications.weeklySummary} onChange={() => handleSettingChange('notifications', 'weeklySummary', !settings.notifications.weeklySummary)} />
                        </SettingRow>
                    </div>
                </div>
            </div>
        );
    };
    
    const IntegrationsPage = ({ handleNavigate }: { handleNavigate: (view: string) => void }) => (
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
                        <button onClick={() => handleNavigate('apiguide')} className="w-full bg-[#3A3A3C] hover:bg-[#4A4A4C] text-white font-bold py-3 px-4 rounded-lg text-lg flex items-center justify-center gap-2">
                            <BookOpen size={20} /> View Guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    const ProfilePage = () => {
        const [activeTab, setActiveTab] = useState<string>('Profile');
        const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
        
        return (
            <div className="text-white">
                <div className="h-48 bg-gradient-to-r from-[#2a2a2e] to-[#3a3a3e] relative">
                     <div 
                     className="absolute inset-0 bg-repeat" 
                     style={{ 
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233A3A3C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                    }}
                   ></div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-24 relative z-10">
                        <img src="https://placehold.co/128x128/6366F1/FFFFFF?text=S" alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-[#1C1C1E]"/>
                        <div className="ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <h2 className="text-3xl font-bold">Simon Prusin</h2>
                            <p className="text-[#A0A0A5]">3D Artist & Digital Twin Specialist</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:ml-auto">
                            <button onClick={() => setIsShareModalOpen(true)} className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Share2 size={20}/></button>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Twitter size={20}/></a>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Linkedin size={20}/></a>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Globe size={20}/></a>
                            <button onClick={() => copyToClipboard('https://twinx.app/u/simonprusin', 'Public profile link copied!')} className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><LinkIcon size={20}/></button>
                            <button onClick={() => handleNavigate('settings')} className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md transition-colors">
                                Edit Profile
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-8 border-b border-[#3A3A3C]">
                         <div className="flex items-center gap-6">
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Profile')}} className={`py-3 ${activeTab === 'Profile' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Profile</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Projects')}} className={`py-3 ${activeTab === 'Projects' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Projects</a>
                             <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('Followers')}} className={`py-3 ${activeTab === 'Followers' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Followers</a>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                                <h3 className="text-xl font-semibold mb-4">Introduction</h3>
                                <p className="text-[#A0A0A5] text-sm mb-6">Hello, I am Simon Prusin. I love making websites and graphics. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                <div className="space-y-4 text-sm">
                                    <div className="flex items-center gap-3"><Building size={16} className="text-[#A0A0A5]"/><span>TwinX</span></div>
                                    <div className="flex items-center gap-3"><Mail size={16} className="text-[#A0A0A5]"/><span>simonprusin@gmail.com</span></div>
                                    <div className="flex items-center gap-3"><MapPin size={16} className="text-[#A0A0A5]"/><span>New York, USA - 10001</span></div>
                                    <div className="flex items-center gap-3"><LinkIcon size={16} className="text-[#A0A0A5]"/><span>www.twinx.app</span></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           </div>
                           {projects.length === 0 && (
                                <div className="text-center py-20 text-[#A0A0A5] bg-[#262629] rounded-lg border-2 border-dashed border-[#3A3A3C]">
                                    <p>No projects to display.</p>
                                </div>
                           )}
                        </div>
                    </div>
                </div>
                <ShareProfileModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} showNotification={showNotification} />
            </div>
        );
    };

    //     prints the pages
    const renderCurrentView = () => {
        const views: {[key: string]: React.ReactNode} = {
            'project': <ProjectView />,
            'dashboard': <Dashboard />,
            'marketplace': <MarketplacePage friends={friends} onSelectTwin={handleSelectTwin} />,
            'yourtwins': <YourTwinsPage />,
            'analytics': <AnalyticsPage />,
            'twinDetail': <TwinDetailPage />,
            'members': <MembersPage />,
            'plans': <PlansPage />,
            'api': <ApiPage />,
            'apiguide': <ApiGuidePage />,
            'apiusage': <ApiUsagePage />,
            'updates': <PlaceholderView title="Pending Updates" icon={Download}/>,
            'profile': <ProfilePage />,
            'settings': <SettingsPage />,
            'integrations': <IntegrationsPage handleNavigate={handleNavigate} />,
            'templates': <PlaceholderView title="Templates" icon={LayoutTemplate}/>,
        };
        return views[currentView] || <Dashboard />;

        //use the marketplace UI and functionalities from here for the marketplace page on the website

    };

    return (
        <>
            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .prose { color: #A0A0A5; }
                .prose h1, .prose h2, .prose h3, .prose h4, .prose strong { color: #FFFFFF; }
                .form-checkbox { -webkit-appearance: none; -moz-appearance: none; appearance: none; padding: 0; -webkit-print-color-adjust: exact; color-adjust: exact; display: inline-block; vertical-align: middle; background-origin: border-box; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; flex-shrink: 0; height: 1rem; width: 1rem; }
                .form-checkbox:checked { background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e"); }
            `}</style>
            <div className="min-h-screen bg-[#1C1C1E]">
                <aside 
                    onMouseEnter={() => setIsSidebarExpanded(true)}
                    onMouseLeave={() => setIsSidebarExpanded(false)}
                    className={`fixed top-0 left-0 h-full bg-[#262629] text-white flex flex-col z-40 transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-72' : 'w-20'}`}>
                    
                    <div className={`flex items-center p-4 shrink-0`}>
                        <img src="https://placehold.co/40x40/6366F1/FFFFFF?text=S" alt="User Avatar" className="w-10 h-10 rounded-lg shrink-0"/>
                        <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${!isSidebarExpanded ? 'w-0 ml-0 opacity-0' : 'w-auto ml-3 opacity-100'}`}>
                            <p className="font-semibold text-white">Simon Prusin</p>
                            <p className="text-xs text-[#A0A0A5]">simonprusin@gmail.com</p>
                        </div>
                    </div>
            
                    <nav className="flex-grow p-2 overflow-y-auto overflow-x-hidden hide-scrollbar">
                        {SIDEBAR_CONFIG.map((section, index) => (
                            <div key={index}>
                                {section.title && <NavHeader text={section.title} isSidebarExpanded={isSidebarExpanded} />}
                                <ul>
                                    {section.items.map(item => (
                                        <NavItem 
                                            key={item.view}
                                            icon={item.icon}
                                            text={item.text}
                                            view={item.view}
                                            isSidebarExpanded={isSidebarExpanded}
                                            currentView={currentView}
                                            handleNavigate={handleNavigate}
                                        />
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </nav>
            
                    <div className="p-4 mt-auto shrink-0">
                        <button className={`w-full bg-[#6366F1] text-white font-semibold py-2.5 px-4 rounded-md hover:bg-opacity-90 transition-colors flex items-center ${!isSidebarExpanded ? 'justify-center' : 'justify-start'}`}>
                            <Star size={18} className="shrink-0" />
                             <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${!isSidebarExpanded ? 'w-0 ml-0 opacity-0' : 'w-auto ml-4 opacity-100'}`}>
                                Unlock Premium
                            </span>
                        </button>
                    </div>
                </aside>

                <main className={`transition-all duration-300 ease-in-out bg-[#1C1C1E] min-h-screen ${isSidebarExpanded ? 'pl-72' : 'pl-20'}`}>
                    {renderCurrentView()}
                </main>

                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 flex items-end gap-4 transition-opacity duration-300 z-50 ${draggingProject ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div 
                        ref={trashRef}
                        className={`flex items-center justify-center w-24 h-24 rounded-full transition-all duration-300 ease-in-out ${isOverTrash ? 'bg-red-500 scale-125' : 'bg-[#3A3A3C]'}`}
                    >
                        <Trash2 size={40} className={`transition-colors duration-300 ${isOverTrash ? 'text-white' : 'text-[#A0A0A5]'}`} />
                    </div>
                </div>

                <NewProjectModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    userId={userId}
                    showNotification={showNotification}
                />

                <DeleteConfirmationModal 
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    title="Delete Digital Twin"
                    text={`Are you sure you want to delete the Digital Twin "${projectToDelete?.title}"? This action cannot be undone.`}
                />

                <AppNotification />
                
            </div>
        </>
    );
}

// The Authentication/ Login/ Logout/ hendeling auth states
function UserSyncAndContent() {

    
    // --- Clerk Authentication stuff
    const { isLoaded, isSignedIn } = useUser();
    const { getToken } = useAuth(); // 1. Get the getToken function from the useAuth hook.
    
    // Use a ref to ensure the sync operation only ever runs once per login.
    const hasSynced = useRef(false);
    
    // This useEffect is our trigger. It runs when Clerk's state changes.
    useEffect(() => {
    // This condition is the gatekeeper. It waits for Clerk to be fully loaded AND for a user to be signed in.
    if (isLoaded && isSignedIn && !hasSynced.current) {
      
      // Set the flag immediately to prevent any possible re-triggering.
      hasSynced.current = true;
      
      console.log("Clerk is ready and user is signed in. Preparing to sync with DB...");

      // Define an async function to handle the token and API call.
      const syncUser = async () => {
        try {
          // 2. Get the session token. This is the crucial step.
          // The getToken() function will not resolve until the session is fully established and valid.
          // This single line is what solves the entire race condition.

          console.log(getCurrentUser());
          
          updateUserOnDB();

          console.log("Database sync successful.");

        } catch (error) {
          console.error("User sync operation failed:", error);
          // If it fails, reset the flag so it can be tried again on a future render/state change.
          hasSynced.current = false;
        }
      };

      // Call the sync function.
      syncUser();
    }
    }, [isLoaded, isSignedIn, getToken]); // Dependency array ensures this logic runs when state is ready.


  
    return (
      <>

        <div style={{position:'fixed', bottom:'20px', right:'20px', zIndex:'1000'}}>
          <SignedIn>
              <UserButton afterSwitchSessionUrl='/' />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>

        <MainPage />

      </>
    );
}

// Your main export now simply wraps the logic component with the provider.
export default function App() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <UserSyncAndContent />
    </ClerkProvider>
  );
}