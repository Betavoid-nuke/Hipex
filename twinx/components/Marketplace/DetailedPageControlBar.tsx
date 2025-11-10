import React, { useState } from 'react';
import { Power, Download, Globe, Eye } from 'lucide-react'; 

/**
 * Interface for the AdminToolbar component props,
 * defining the required boolean states and setter functions.
 */
interface AdminToolbarProps {
    isPublished: boolean;
    setIsPublished: React.Dispatch<React.SetStateAction<boolean>>;
    isDownloadEnabled: boolean;
    setIsDownloadEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    isListed: boolean;
    setIsListed: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Helper function to generate dynamic Tailwind classes based on state.
 * @param isActive Current status of the toggle.
 * @param type 'publish' for critical state (Draft/Red), 'general' for standard states.
 * @returns A string of Tailwind class names.
 */
const getStatusClass = (isActive: boolean, type: 'publish' | 'general'): string => {
    if (isActive) {
        // Active status uses indigo border/text
        return 'bg-gray-700/50 text-indigo-400 border-indigo-500/50';
    } else if (type === 'publish') {
        // Critical inactive status (Unpublished/Draft) uses red
        return 'bg-gray-700/50 text-red-400 border-red-500/50';
    } else {
        // General inactive status uses subtle gray
        return 'bg-gray-700/50 text-gray-400 border-gray-600';
    }
};


/**
 * AdminToolbar Component
 * Renders the product status controls (Publish, Download, Listed)
 * and the 'View Live Page' button.
 */
const AdminToolbar: React.FC<AdminToolbarProps> = ({ 
    isPublished, 
    setIsPublished,
    isDownloadEnabled,
    setIsDownloadEnabled,
    isListed,
    setIsListed
}) => {

    return (
        <div className="p-3 shadow-xl flex flex-wrap gap-3 items-center justify-between border"
             style={{background:'#262629', borderColor:'#4b4b52ff', marginBottom:'30px', borderRadius:'30px'}}
        >
            <div className="flex flex-wrap gap-2 items-center">
                
                {/* 1. Publish Toggle (Critical Status) */}
                <button
                    onClick={() => setIsPublished(!isPublished)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-xs border ${getStatusClass(isPublished, 'publish')}`}
                    style={{borderWidth:'1px', borderColor:'#5c5c63ff', backgroundColor:'rgba(92, 92, 99, 0.31)'}}
                >
                    <Power size={14} className={isPublished ? 'text-indigo-500' : 'text-red-500'} />
                    {isPublished ? 'Published' : 'Draft'}
                </button>

                {/* 2. Download Toggle (Setting Toggle) */}
                <button
                    onClick={() => setIsDownloadEnabled(!isDownloadEnabled)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-xs border ${getStatusClass(isDownloadEnabled, 'general')}`}
                    style={{borderWidth:'1px', borderColor:'#5c5c63ff', backgroundColor:'rgba(92, 92, 99, 0.31)'}}
                >
                    <Download size={14} />
                    {isDownloadEnabled ? 'Download Enabled' : 'Download Disabled'}
                </button>

                {/* 3. Listed Toggle (Visibility Toggle) */}
                <button
                    onClick={() => setIsListed(!isListed)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-xs border ${getStatusClass(isListed, 'general')}`}
                    style={{borderWidth:'1px', borderColor:'#5c5c63ff', backgroundColor:'rgba(92, 92, 99, 0.31)'}}
                >
                    <Globe size={14} />
                    {isListed ? 'Listed' : 'Unlisted'}
                </button>
            </div>

            {/* View Page Icon Button (Primary Action) */}
            <button
                onClick={() => console.log('Viewing Live Page...')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium transition-all text-xs bg-indigo-600 hover:bg-indigo-500 text-white"
            >
                <Eye size={18} /> View Live Page
            </button>
        </div>
    );
};

export default AdminToolbar;