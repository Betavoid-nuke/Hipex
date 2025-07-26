// /twinx/lib/types.ts

import { LucideIcon } from "lucide-react";

export type AppView =
  | 'dashboard' | 'project' | 'marketplace' | 'yourtwins' | 'analytics'
  | 'twinDetail' | 'members' | 'plans' | 'api' | 'apiguide' | 'apiusage'
  | 'notifications' | 'profile' | 'settings' | 'integrations' | 'templates';

export interface Project {
  id: string;
  title: string;
  twinxid: string;
  thumbnail: string;
  isFavorite: boolean;
  isPublished: boolean;
  currentStep: number;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

// ADD THIS INTERFACE for a single navigation link
export interface SidebarItem {
  view: string;
  text: string;
  icon: LucideIcon;
  badgeCount?: number; // The '?' makes this property optional
}

// ADD THIS INTERFACE for a section in the sidebar
export interface SidebarSection {
  title: string | null;
  items: SidebarItem[];
}

export interface DraggingProject extends Project {
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
}

export interface NotificationMessage {
  show: boolean;
  message: string;
}

export interface Plan {
    name: string;
    renewalDate: string;
    cost: number;
}

export interface UserProfile {
    name: string;
    title: string;
    avatar: string;
    coverPhoto: string;
    bio: string;
    company: string;
    email: string;
    location: string;
    website: string;
    plan: Plan;
    notifications: {
        projectUpdates: boolean;
        marketplaceNews: boolean;
        weeklySummary: boolean;
    };
    theme: 'light' | 'dark';
}

export interface MarketplaceListing {
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
    views: number;
    isFavorite: boolean;
}

export interface MyListedTwin extends MarketplaceListing {}

export interface Asset extends MarketplaceListing {}

export interface AnalyticsData {
    summary: {
        totalRevenue: { value: string; trend: string };
        totalSales: { value: string; trend: string };
        totalClicks: { value: string; trend: string };
        avgTimeSpent: { value: string; trend: string };
    };
    salesRevenueChart: { name: string; sales: number; revenue: number }[];
}

export interface ApiUsageData {
    summary: {
        totalRequests: { value: string; trend: string | null };
        dataProcessed: { value: string; trend: string | null };
        successfulRequests: { value: string; trend: string | null };
        errorRate: { value: string; trend: string | null };
    };
    callsPerDayChart: { day: string; requests: number }[];
}

export interface Friend {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    id?: string;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: any; // Firestore Timestamp
}

export interface ApiKey {
    id: number;
    name: string;
    secret: string;
    created: string;
    lastUsed: string;
    createdBy: string;
    permissions: string;
}

export interface Notification {
    id: number;
    icon: LucideIcon;
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category: string;
}