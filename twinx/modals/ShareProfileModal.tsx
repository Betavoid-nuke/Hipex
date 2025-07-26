// /twinx/modals/ShareProfileModal.tsx
'use client';

import { X, Twitter, Linkedin, Instagram, MessageSquare } from 'lucide-react';

interface ShareProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    showNotification: (message: string) => void;
}

const ShareProfileModal = ({ isOpen, onClose, showNotification }: ShareProfileModalProps) => {
    const profileUrl = 'https://twinx.app/u/simonprusin'; // This could be a prop

    const copyLink = () => {
        navigator.clipboard.writeText(profileUrl);
        showNotification('Profile link copied to clipboard!');
    };

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
                        <button onClick={copyLink} className="bg-[#3A3A3C] text-white font-semibold py-1 px-3 rounded-md hover:bg-[#4A4A4C] transition-colors text-sm">Copy</button>
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
    );
};

export default ShareProfileModal;