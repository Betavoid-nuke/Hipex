// /twinx/modals/EditProfileHeaderModal.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { UserProfile } from '../lib/types';

interface EditProfileHeaderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: UserProfile) => void;
    currentProfile: UserProfile;
}

const EditProfileHeaderModal = ({ isOpen, onClose, onSave, currentProfile }: EditProfileHeaderModalProps) => {
    const [profile, setProfile] = useState(currentProfile);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setProfile(currentProfile);
    }, [currentProfile, isOpen]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    setProfile(p => ({ ...p, [field]: event.target!.result as string }));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262629] rounded-lg shadow-xl w-full max-w-2xl border border-[#3A3A3C]">
                <div className="flex justify-between items-center p-4 border-b border-[#3A3A3C]">
                    <h3 className="text-xl font-bold text-white">Edit Profile Header</h3>
                    <button onClick={onClose} className="text-[#A0A0A5] hover:text-white"><X size={24} /></button>
                </div>
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                    <div><label className="block text-sm font-medium text-white mb-1">Name</label><input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white"/></div>
                    <div><label className="block text-sm font-medium text-white mb-1">Title</label><input type="text" value={profile.title} onChange={e => setProfile({...profile, title: e.target.value})} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-2 text-white"/></div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Avatar</label>
                        <div className="flex items-center gap-4">
                            <img src={profile.avatar} alt="Avatar Preview" className="w-20 h-20 rounded-full object-cover"/>
                            <input type="file" accept="image/*" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} className="hidden"/>
                            <button type="button" onClick={() => avatarInputRef.current?.click()} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md">Upload Photo</button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Cover Photo</label>
                        <img src={profile.coverPhoto} alt="Cover Preview" className="w-full h-24 rounded-md object-cover mb-2"/>
                        <input type="file" accept="image/*" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'coverPhoto')} className="hidden"/>
                        <button type="button" onClick={() => coverInputRef.current?.click()} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md">Upload Cover</button>
                    </div>
                </div>
                <div className="p-4 bg-[#1C1C1E] border-t border-[#3A3A3C] flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md">Cancel</button>
                    <button type="button" onClick={() => { onSave(profile); onClose(); }} className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditProfileHeaderModal;