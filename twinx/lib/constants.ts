// /twinx/lib/constants.ts

import {
    BarChart2, Bell, BookOpen, Briefcase, Check, Code, CreditCard, FileText,
    KeyRound, LayoutTemplate, Puzzle, Search, Settings, SlidersHorizontal, Star,
    Store, Sun, User, Users, Zap
} from "lucide-react";
// Import the new types we created for type safety
import { SidebarSection } from "./types";

export const PIPELINE_CONFIG = [
    { id: 1, name: 'Frame Extraction', description: 'Extracting individual frames from the video source.', icon: FileText },
    { id: 2, name: 'Camera Pose Estimation', description: 'Calculating camera position for each frame.', icon: SlidersHorizontal },
    { id: 3, name: 'Feature Detection', description: 'Identifying key interest points in each frame.', icon: Search },
    { id: 4, name: 'Stereo Matching', description: 'Matching features between frames to find depth.', icon: Users },
    { id: 5, name: 'Depth Map Generation', description: 'Creating a depth map for each video frame.', icon: LayoutTemplate },
    { id: 6, name: 'Point Cloud Fusion', description: 'Combining depth maps into a unified 3D point cloud.', icon: Puzzle },
    { id: 7, name: 'Noise Removal', description: 'Cleaning up and removing outlier points.', icon: Zap },
    { id: 8, name: 'Surface Reconstruction', description: 'Generating a mesh surface from the point cloud.', icon: Code },
    { id: 9, name: 'Texture Projection', description: 'Projecting video colors onto the 3D mesh.', icon: Star },
    { id: 10, name: 'Lighting Analysis', description: 'Analyzing and baking scene lighting information.', icon: Sun },
    { id: 11, name: 'Optimization', description: 'Optimizing the model for real-time performance.', icon: Zap },
    { id: 12, name: 'Final Assembly', description: 'Compiling all data into the final twin.', icon: Check },
];

export const TOTAL_STEPS = PIPELINE_CONFIG.length;

// Apply the SidebarSection[] type to the constant for strict type-checking
export const SIDEBAR_CONFIG: SidebarSection[] = [
    {
        title: null,
        items: [
            { view: 'notifications', text: 'Notifications', icon: Bell, badgeCount: 2 },
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