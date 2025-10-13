
import { Timestamp } from "firebase/firestore";
import { LucideProps } from "lucide-react";
import { FC } from "react";


// --- Data Model Interfaces ---
export interface BaseItem {
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

export interface SocialHandle {
  platform: string;
  url: string;
}

export interface AppUser {
  _id: string;
  id: string;
  uid?: string; // optional Clerk or auth provider id
  username: string;
  name: string;
  email: string;
  avatar?: string;
  image?: string;
  bio?: string;
  onboarded: boolean;
  friendsId: string[];
  communities: string[];
  Countdowns: string[];
  twinxprojects: string[];
  twinxfavprojects: string[];
  socialhandles: SocialHandle[];
  tags: string[];
  jobs: Job[];
  country: string;
  oneSentanceIntro: string;
  listedAssets: string[];
  listedTwins: string[];
}

export type Job = {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
};

export interface Project {
    id: string;
    _id?: string;
    title: string;
    twinxid: string;
    thumbnail: string;
    videoUrl: string;
    isFavorite: boolean;
    isPublished: boolean;
    currentStep: number;
    createdAt: Timestamp | Date;
    updatedAt: Timestamp | Date;
    totalSteps?: number;
    pipelineConfig?: PipelineStep[];
}

export interface DraggingProject extends Project {
    offsetX: number;
    offsetY: number;
    width: number;
    height: number;
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



// --- Component Prop Interfaces ---
export interface NavHeaderProps {
    text: string;
    isSidebarExpanded: boolean;
}

export interface NavItemProps {
    icon: React.ComponentType<LucideProps>;
    text: string;
    view: string;
    badgeCount?: number;
    isSidebarExpanded: boolean;
    currentView: string;
    handleNavigate: (view: string) => void;
}

export interface NewProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string | null;
}

export interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    text: string;
}

export interface EditKeyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: number, name: string) => void;
    apiKey: ApiKey | null;
}

export interface PipelineStep {
  id: number;
  name: string;
  description: string;
  icon: FC<{ size?: number }>;
}






