
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

export interface AppUser {
    uid: string;
    name: string;
    email: string;
    avatar: string;
    id?: string; // id is sometimes used interchangeably with uid
}

export interface Project {
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
    showNotification: (message: string) => void;
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






