// /twinx/data/appData.ts

import { BarChart2, Bell, BookOpen, Briefcase, Building, Check, CheckCircle, Clock, Code, CreditCard, DollarSign, Download, Edit, Eye, EyeOff, FileText, Globe, Heart, Info, Instagram, KeyRound, LayoutTemplate, Linkedin, ListFilter, Mail, MapPin, Menu, MessageSquare, MoreVertical, MousePointerClick, Plus, Puzzle, Search, Server, Settings, Share2, Shield, SlidersHorizontal, Star, Store, Sun, Trash2, TrendingUp, Twitter, Upload, UploadCloud, User, UserPlus, Users, X, Zap } from 'lucide-react';
import { ApiUsageData, AnalyticsData, MarketplaceListing, MyListedTwin, Asset, Notification, Plan, UserProfile, Friend, ApiKey } from '../lib/types';

// ... (fetchNotifications, fetchMarketplaceListings, fetchMyListedTwins, fetchAssets, fetchAnalyticsData functions are unchanged) ...

// mongofunction
export const fetchNotifications = async (): Promise<Notification[]> => {
    console.log("Fetching notifications from database...");
    return new Promise(resolve => setTimeout(() => resolve([
        { id: 1, icon: Settings, title: 'Maintenance request update', message: 'The maintenance request for John Doe in Apartment 301 has been Completed. The issue was a leaking faucet in the kitchen.', timestamp: '5h ago', isRead: false, category: 'Today' },
        { id: 2, icon: DollarSign, title: 'Rent Payment Confirmation', message: 'We have received the rent payment of $1,200 for Jane Smith in Apartment 102. The payment was processed successfully.', timestamp: '7h ago', isRead: false, category: 'Today' },
        { id: 3, icon: Clock, title: 'Lease Renewal Reminder', message: 'The lease for Esther Howard in Apartment 308 is set to expire on October 15, 2023. Please take appropriate action to initiate lease renewal discussions.', timestamp: '7h ago', isRead: true, category: 'Today' },
        { id: 4, icon: UserPlus, title: 'New Follower', message: 'Alex Doe is now following you.', timestamp: 'Yesterday', isRead: true, category: 'Yesterday' }
    ]), 500));
};

// mongofunction
export const fetchMarketplaceListings = async (): Promise<MarketplaceListing[]> => {
    console.log("Fetching marketplace listings from database...");
     return new Promise(resolve => setTimeout(() => resolve([
        { id: 'm1', title: 'Cyberpunk Megatower', author: 'Alex Doe', price: 89.99, thumbnail: 'https://placehold.co/400x225/FF5722/FFFFFF?text=Tower', category: 'Building', tags: ['sci-fi', 'cyberpunk', 'skyscraper'], isAnimated: false, isDownloadable: true, date: new Date('2025-06-15'), likes: 1200, isFavorite: false, views: 5000 },
        { id: 'm2', title: 'Medieval Castle', author: 'Brenda Smith', price: 79.99, thumbnail: 'https://placehold.co/400x225/795548/FFFFFF?text=Castle', category: 'Building', tags: ['fantasy', 'building', 'medieval'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-01'), likes: 3400, isFavorite: true, views: 12000 },
        { id: 'm3', title: 'Luxury Penthouse', author: 'Charlie Brown', price: 120.00, thumbnail: 'https://placehold.co/400x225/4CAF50/FFFFFF?text=Penthouse', category: 'Penthouse', tags: ['modern', 'luxury', 'interior'], isAnimated: false, isDownloadable: true, date: new Date('2025-05-20'), likes: 850, isFavorite: false, views: 3000 },
    ]), 500));
};

// mongofunction
export const fetchMyListedTwins = async (): Promise<MyListedTwin[]> => {
    console.log("Fetching user's listed twins from database...");
    return new Promise(resolve => setTimeout(() => resolve([
        { id: 't1', title: 'Modern Mansion Exterior', author: 'Simon Prusin', price: 135.00, thumbnail: 'https://placehold.co/400x225/9C27B0/FFFFFF?text=Mansion', category: 'Mansion', tags: ['modern', 'luxury', 'exterior'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-18'), likes: 980, isFavorite: false, views: 4500 },
        { id: 't2', title: 'Ancient Temple Ruins', author: 'Simon Prusin', price: 75.00, thumbnail: 'https://placehold.co/400x225/CDDC39/000000?text=Ruins', category: 'Building', tags: ['ancient', 'ruins', 'jungle'], isAnimated: false, isDownloadable: true, date: new Date('2025-06-30'), likes: 1500, isFavorite: true, views: 8000 },
    ]), 500));
};

// mongofunction
export const fetchAssets = async (): Promise<Asset[]> => {
    console.log("Fetching assets from database...");
    return new Promise(resolve => setTimeout(() => resolve([
         { id: 'a1', title: 'Sci-Fi Crate Set', author: 'Alex Doe', price: 15.00, thumbnail: 'https://placehold.co/400x225/9E9E9E/FFFFFF?text=Crates', category: 'Props', tags: ['sci-fi', 'props', 'crate'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-02'), likes: 450, isFavorite: false, views: 2000 },
         { id: 'a2', title: 'PBR Rock Collection', author: 'Brenda Smith', price: 25.00, thumbnail: 'https://placehold.co/400x225/BDBDBD/000000?text=Rocks', category: 'Nature', tags: ['pbr', 'rock', 'nature'], isAnimated: false, isDownloadable: true, date: new Date('2025-07-05'), likes: 1100, isFavorite: false, views: 6000 },
    ]), 500));
};


// mongofunction
export const fetchAnalyticsData = async (): Promise<AnalyticsData> => {
    console.log("Fetching analytics data from the database...");
    return new Promise(resolve => setTimeout(() => resolve({
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
    }), 500));
};

// --- FIX IS IN THIS FUNCTION ---
// mongofunction
export const fetchApiUsageData = async (): Promise<ApiUsageData> => {
    console.log("Fetching API usage data from the database...");

    // Define the type for a single data point in the chart
    type ChartDataPoint = {
        day: string;
        requests: number;
    };

    // Apply the type to the 'data' array
    const data: ChartDataPoint[] = [];

    for (let i = 29; i >= 0; i--) {
        data.push({
            day: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            requests: Math.floor(Math.random() * 50000) + 10000,
        });
    }
    return new Promise(resolve => setTimeout(() => resolve({
        summary: {
            totalRequests: { value: "1.4M", trend: "+5.2%" },
            dataProcessed: { value: "25.6 GB", trend: "+3.8%" },
            successfulRequests: { value: "99.8%", trend: null },
            errorRate: { value: "0.2%", trend: null }
        },
        callsPerDayChart: data
    }), 500));
};

// mongofunction
export const fetchUserProfile = async (): Promise<UserProfile> => {
    console.log("Fetching user profile data from the database...");
     return new Promise(resolve => setTimeout(() => resolve({
        name: 'Simon Prusin',
        title: '3D Artist & Digital Twin Specialist',
        avatar: 'https://placehold.co/128x128/6366F1/FFFFFF?text=S',
        coverPhoto: 'https://placehold.co/1000x200/374151/1f2937?text=Abstract+1',
        bio: 'Hello, I am Simon Prusin. I love making websites and graphics. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        company: 'TwinX',
        email: 'simonprusin@gmail.com',
        location: 'New York, USA - 10001',
        website: 'www.twinx.app',
        plan: {
            name: 'Creator Plan',
            renewalDate: 'August 21, 2025',
            cost: 149,
        },
        notifications: { projectUpdates: true, marketplaceNews: true, weeklySummary: false },
        theme: 'dark',
    }), 500));
};


export const FAKE_USERS: Friend[] = [
    { uid: 'friend1_uid', name: 'Alex Doe', email: 'alex@example.com', avatar: 'https://placehold.co/400x40/FFC107/000000?text=A' },
    { uid: 'friend2_uid', name: 'Brenda Smith', email: 'brenda@example.com', avatar: 'https://placehold.co/40x40/4CAF50/FFFFFF?text=B' },
    { uid: 'friend3_uid', name: 'Charlie Brown', email: 'charlie@example.com', avatar: 'https://placehold.co/40x40/F44336/FFFFFF?text=C' },
];