// /twinx/views/ProfilePage.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit, Share2, Twitter, Linkedin, Globe, Users, X, Building, Mail, MapPin, Link as LinkIcon } from 'lucide-react';
import { Project, UserProfile } from '../lib/types';
import ProjectCard from './ProjectCard'; // Assuming ProjectCard is in the same folder
import ShareProfileModal from '../modals/ShareProfileModal';

interface ProfilePageProps {
    projects: Project[];
    userProfile: UserProfile;
    setUserProfile: (profile: UserProfile) => void;
    showNotification: (message: string) => void;
}

// Sub-component for the Edit Header Modal
const EditProfileHeaderModal = ({ isOpen, onClose, onSave, currentProfile }: { isOpen: boolean, onClose: () => void, onSave: (p: UserProfile) => void, currentProfile: UserProfile }) => {
    const [profile, setProfile] = useState(currentProfile);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'coverPhoto') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setProfile({ ...profile, [field]: event.target!.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    useEffect(() => { setProfile(currentProfile) }, [currentProfile]);
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

// Sub-component for the Edit Intro Modal
const EditIntroductionModal = ({ isOpen, onClose, onSave, currentProfile }: { isOpen: boolean, onClose: () => void, onSave: (p: UserProfile) => void, currentProfile: UserProfile }) => {
    const [profile, setProfile] = useState(currentProfile);
    useEffect(() => { setProfile(currentProfile) }, [currentProfile]);
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


const ProfilePage = ({ projects, userProfile, setUserProfile, showNotification }: ProfilePageProps) => {
    const [activeTab, setActiveTab] = useState('Profile');
    const [isEditHeaderModalOpen, setIsEditHeaderModalOpen] = useState(false);
    const [isEditIntroModalOpen, setIsEditIntroModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Profile':
                return (
                     <div className="lg:col-span-1">
                        <div className="bg-[#262629] p-6 rounded-lg border border-[#3A3A3C]">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold">Introduction</h3>
                                <button onClick={() => setIsEditIntroModalOpen(true)} className="text-[#A0A0A5] hover:text-white"><Edit size={16}/></button>
                            </div>
                            <p className="text-[#A0A0A5] text-sm mb-6">{userProfile.bio}</p>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center gap-3"><Building size={16} className="text-[#A0A0A5]"/><span>{userProfile.company}</span></div>
                                <div className="flex items-center gap-3"><Mail size={16} className="text-[#A0A0A5]"/><span>{userProfile.email}</span></div>
                                <div className="flex items-center gap-3"><MapPin size={16} className="text-[#A0A0A5]"/><span>{userProfile.location}</span></div>
                                <div className="flex items-center gap-3"><LinkIcon size={16} className="text-[#A0A0A5]"/><span>{userProfile.website}</span></div>
                            </div>
                        </div>
                    </div>
                );
            case 'Projects':
                return (
                    <div className="lg:col-span-3">
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onSelectProject={() => {}} // Not needed here, or pass a handler
                                    setDraggingProject={() => {}}
                                    showNotification={showNotification}
                                    onDeleteClick={() => {}}
                                />
                            ))}
                       </div>
                       {projects.length === 0 && (
                            <div className="text-center py-20 text-[#A0A0A5] bg-[#262629] rounded-lg border-2 border-dashed border-[#3A3A3C]">
                                <p>No projects to display.</p>
                            </div>
                       )}
                    </div>
                );
            case 'Followers':
                 return (
                    <div className="lg:col-span-3 text-center py-20 text-[#A0A0A5] bg-[#262629] rounded-lg border-2 border-dashed border-[#3A3A3C]">
                        <Users size={48} className="mx-auto" />
                        <h3 className="mt-4 text-xl font-bold text-white">No Followers Yet</h3>
                        <p>Share your profile to get followers.</p>
                    </div>
                );
            default:
                return <div className="lg:col-span-3"></div>;
        }
    };

    return (
        <>
            <div className="text-white">
                <div className="h-48 bg-cover bg-center relative" style={{backgroundImage: `url(${userProfile.coverPhoto})`}}>
                    <div className="absolute inset-0 bg-black/50"></div>
                </div>
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-center sm:items-end -mt-24 relative z-10">
                        <img src={userProfile.avatar} alt="User Avatar" className="w-32 h-32 rounded-full border-4 border-[#1C1C1E] object-cover"/>
                        <div className="ml-6 mt-4 sm:mt-0 text-center sm:text-left">
                            <div className="flex items-center gap-4">
                                <h2 className="text-3xl font-bold">{userProfile.name}</h2>
                                <button onClick={() => setIsEditHeaderModalOpen(true)} className="text-[#A0A0A5] hover:text-white"><Edit size={18}/></button>
                            </div>
                            <p className="text-[#A0A0A5]">{userProfile.title}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-4 sm:ml-auto">
                            <button onClick={() => setIsShareModalOpen(true)} className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Share2 size={20}/></button>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Twitter size={20}/></a>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Linkedin size={20}/></a>
                            <a href="#" className="p-2 bg-[#3A3A3C] rounded-full hover:bg-[#4A4A4C]"><Globe size={20}/></a>
                        </div>
                    </div>

                    <div className="mt-8 border-b border-[#3A3A3C]">
                         <div className="flex items-center gap-6">
                             <button onClick={() => setActiveTab('Profile')} className={`py-3 ${activeTab === 'Profile' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Profile</button>
                             <button onClick={() => setActiveTab('Projects')} className={`py-3 ${activeTab === 'Projects' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Projects</button>
                             <button onClick={() => setActiveTab('Followers')} className={`py-3 ${activeTab === 'Followers' ? 'text-white font-semibold border-b-2 border-white' : 'text-[#A0A0A5] hover:text-white'}`}>Followers</button>
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
            <EditProfileHeaderModal isOpen={isEditHeaderModalOpen} onClose={() => setIsEditHeaderModalOpen(false)} onSave={setUserProfile} currentProfile={userProfile} />
            <EditIntroductionModal isOpen={isEditIntroModalOpen} onClose={() => setIsEditIntroModalOpen(false)} onSave={setUserProfile} currentProfile={userProfile} />
            <ShareProfileModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} showNotification={showNotification} />
        </>
    );
};

export default ProfilePage;