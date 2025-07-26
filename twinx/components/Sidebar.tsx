// /twinx/components/Sidebar.tsx
'use client';

import { Star } from 'lucide-react';
import { SIDEBAR_CONFIG } from '../lib/constants';
import { AppView, UserProfile } from '../lib/types';
import NavItem from './NavItem';

interface SidebarProps {
    isExpanded: boolean;
    setIsExpanded: (expanded: boolean) => void;
    currentView: AppView;
    onNavigate: (view: AppView) => void;
    userProfile: UserProfile | null;
}

const NavHeader = ({ text, isSidebarExpanded }: { text: string, isSidebarExpanded: boolean }) => (
    <h3 className={`text-xs uppercase text-text-muted font-semibold tracking-wider px-3 mt-4 mb-2 transition-opacity duration-200 ease-in-out ${!isSidebarExpanded ? 'opacity-0' : 'opacity-100'}`}>
        {text}
    </h3>
);

const Sidebar = ({ isExpanded, setIsExpanded, currentView, onNavigate, userProfile }: SidebarProps) => {
    return (
        <aside
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
            className={`fixed top-0 left-0 h-full bg-component-bg text-text-secondary flex flex-col z-40 transition-all duration-300 ease-in-out ${isExpanded ? 'w-72' : 'w-20'}`}
        >
            {/* User Profile Section */}
            <div className={`flex items-center p-4 shrink-0`}>
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white text-xl font-bold shrink-0">
                    {userProfile?.name.charAt(0) || 'S'}
                </div>
                <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${!isExpanded ? 'w-0 ml-0 opacity-0' : 'w-auto ml-3 opacity-100'}`}>
                    <p className="font-semibold text-text-primary">{userProfile?.name}</p>
                    <p className="text-xs text-text-muted">{userProfile?.email}</p>
                </div>
            </div>

            {/* Navigation Section */}
            <nav className="flex-grow p-2 overflow-y-auto overflow-x-hidden hide-scrollbar">
                {SIDEBAR_CONFIG.map((section, index) => (
                    <div key={index}>
                        {section.title && <NavHeader text={section.title} isSidebarExpanded={isExpanded} />}
                        <ul>
                            {section.items.map(item => (
                                <NavItem
                                    key={item.view}
                                    icon={item.icon}
                                    text={item.text}
                                    view={item.view as AppView}
                                    badgeCount={item.badgeCount || 0}
                                    isSidebarExpanded={isExpanded}
                                    currentView={currentView}
                                    handleNavigate={onNavigate}
                                />
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* Unlock Premium Button */}
            <div className="p-4 mt-auto shrink-0">
                <button className={`w-full bg-accent text-white font-semibold py-2.5 px-4 rounded-md hover:opacity-90 transition-opacity flex items-center ${!isExpanded ? 'justify-center' : 'justify-start'}`}>
                    <Star size={18} className="shrink-0" />
                    <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${!isExpanded ? 'w-0 ml-0 opacity-0' : 'w-auto ml-4 opacity-100'}`}>
                        Unlock Premium
                    </span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;