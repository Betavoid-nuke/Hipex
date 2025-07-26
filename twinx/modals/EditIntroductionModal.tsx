// /twinx/modals/EditIntroductionModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../lib/types';

interface EditIntroductionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: UserProfile) => void;
    currentProfile: UserProfile;
}

const EditIntroductionModal = ({ isOpen, onClose, onSave, currentProfile }: EditIntroductionModalProps) => {
    const [profile, setProfile] = useState(currentProfile);

    useEffect(() => {
        setProfile(currentProfile);
    }, [currentProfile, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-md border border-[#3A3A3C]">
                <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                    <h3 className="text-xl font-bold text-white">Edit Introduction</h3>
                    <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-4">
                    <div><label className="block text-sm font-medium text-white mb-1">Bio</label><textarea value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white h-24"/></div>
                    <div><label className="block text-sm font-medium text-white mb-1">Company</label><input type="text" value={profile.company} onChange={e => setProfile({...profile, company: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white"/></div>
                    <div><label className="block text-sm font-medium text-white mb-1">Location</label><input type="text" value={profile.location} onChange={e => setProfile({...profile, location: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white"/></div>
                    <div><label className="block text-sm font-medium text-white mb-1">Website</label><input type="text" value={profile.website} onChange={e => setProfile({...profile, website: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white"/></div>
                </div>
                <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md">Cancel</button>
                    <button type="button" onClick={() => { onSave(profile); onClose(); }} className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditIntroductionModal;