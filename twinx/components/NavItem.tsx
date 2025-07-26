// /twinx/components/NavItem.tsx
'use client';

import { LucideIcon } from "lucide-react";
import { AppView } from "../lib/types";

interface NavItemProps {
    icon: LucideIcon;
    text: string;
    view: AppView;
    badgeCount?: number;
    isSidebarExpanded: boolean;
    currentView: AppView;
    handleNavigate: (view: AppView) => void;
}

const NavItem = ({ icon: Icon, text, view, badgeCount = 0, isSidebarExpanded, currentView, handleNavigate }: NavItemProps) => {
    const isActive = currentView === view;

    return (
        <li>
            <a
                href="#"
                onClick={(e) => { e.preventDefault(); handleNavigate(view); }}
                className={`flex items-center p-2.5 my-1 rounded-md transition-colors duration-200 ${
                    isActive
                        ? 'bg-hover-bg text-text-primary'
                        : 'text-text-secondary hover:bg-hover-bg hover:text-text-primary'
                } ${!isSidebarExpanded ? 'justify-center' : ''}`}
            >
                <Icon size={20} className="shrink-0" />
                <div className={`flex items-center justify-between w-full overflow-hidden transition-all duration-200 ease-in-out ${!isSidebarExpanded ? 'max-w-0 ml-0 opacity-0' : 'max-w-full ml-4 opacity-100'}`}>
                    <span className="whitespace-nowrap">{text}</span>
                    {badgeCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {badgeCount}
                        </span>
                    )}
                </div>
            </a>
        </li>
    );
};

export default NavItem;