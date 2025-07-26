// /twinx/views/SettingsPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { UserProfile, AppView } from '../lib/types';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';

interface SettingsPageProps {
    userProfile: UserProfile;
    setUserProfile: (profile: UserProfile) => void;
    showNotification: (message: string) => void;
    onNavigate: (view: AppView) => void;
}

const Toggle = ({ enabled, onChange }: { enabled: boolean, onChange: () => void }) => (
    <button type="button" onClick={onChange} className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${enabled ? 'bg-indigo-500' : 'bg-[#4A4A4C]'}`}>
        <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

const SettingsPage = ({ userProfile, setUserProfile, showNotification, onNavigate }: SettingsPageProps) => {
    const [formData, setFormData] = useState<UserProfile>(userProfile);
    const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

    useEffect(() => {
        setFormData(userProfile);
    }, [userProfile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedInputChange = (section: 'notifications', key: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [key]: value
            }
        }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setUserProfile(formData);
        // Here you would also make an API call to save the data to the database
        showNotification("Settings saved successfully!");
    };

    return (
        <>
            <div className="p-4 sm:p-6 lg:p-8 text-white max-w-4xl mx-auto">
                <form onSubmit={handleSave}>
                    <header className="mb-8 flex justify-between items-center">
                        <div>
                            <h2 className="text-3xl font-bold flex items-center gap-3"><Settings size={32}/> Settings</h2>
                            <p className="text-[#A0A0A5] mt-1">Manage your account and workspace settings.</p>
                        </div>
                        <button type="submit" className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors">Save Changes</button>
                    </header>

                    {/* Profile Settings */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Profile</h3>
                        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-white mb-1">Full Name</label><input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-1.5"/></div>
                                <div><label className="block text-sm font-medium text-white mb-1">Email</label><input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-[#1C1C1E] border border-[#3A3A3C] rounded-md px-3 py-1.5"/></div>
                            </div>
                        </div>
                    </div>

                    {/* Current Plan */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Current Plan</h3>
                        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-white">{userProfile.plan.name}</p>
                                    <p className="text-sm text-[#A0A0A5]">Renews on {userProfile.plan.renewalDate}</p>
                                </div>
                                <div className="flex items-center gap-4 mt-4 md:mt-0">
                                    <p className="text-xl font-bold text-white">${userProfile.plan.cost} <span className="text-sm font-normal text-[#A0A0A5]">/ month</span></p>
                                    <button type="button" onClick={() => onNavigate('plans')} className="bg-[#3A3A3C] text-white font-semibold py-2 px-4 rounded-md hover:bg-[#4A4A4C] transition-colors">Change Plan</button>
                                    <button type="button" className="text-sm text-[#A0A0A5] hover:text-white">Cancel Subscription</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Settings */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
                        <div className="bg-[#262629] rounded-lg border border-[#3A3A3C] p-6">
                            <div className="flex items-center justify-between py-4 border-b border-[#3A3A3C]">
                                <p className="text-white">Project Updates</p>
                                <Toggle enabled={formData.notifications.projectUpdates} onChange={() => handleNestedInputChange('notifications', 'projectUpdates', !formData.notifications.projectUpdates)} />
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-[#3A3A3C]">
                                <p className="text-white">Marketplace News</p>
                                <Toggle enabled={formData.notifications.marketplaceNews} onChange={() => handleNestedInputChange('notifications', 'marketplaceNews', !formData.notifications.marketplaceNews)} />
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <p className="text-white">Weekly Summary</p>
                                <Toggle enabled={formData.notifications.weeklySummary} onChange={() => handleNestedInputChange('notifications', 'weeklySummary', !formData.notifications.weeklySummary)} />
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 text-red-500">Danger Zone</h3>
                        <div className="bg-[#262629] rounded-lg border border-red-500/50 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-semibold">Delete Account</p>
                                    <p className="text-sm text-[#A0A0A5]">Permanently delete your account and all of its contents. This action is not reversible.</p>
                                </div>
                                <button type="button" onClick={() => setIsDeleteAccountModalOpen(true)} className="bg-red-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">Delete Account</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <DeleteConfirmationModal
                isOpen={isDeleteAccountModalOpen}
                onClose={() => setIsDeleteAccountModalOpen(false)}
                onConfirm={() => {
                    showNotification("Account deletion initiated.");
                    setIsDeleteAccountModalOpen(false);
                }}
                title="Delete Account"
                text="Are you sure you want to permanently delete your account? All your data will be lost. This action cannot be undone."
            />
        </>
    );
};

export default SettingsPage;