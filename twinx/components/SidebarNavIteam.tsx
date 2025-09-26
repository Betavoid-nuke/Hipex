import { FC } from "react";
import { NavItemProps } from "../types/TwinxTypes";



const NavItem: FC<NavItemProps> = ({ icon: Icon, text, view, badgeCount = 0, isSidebarExpanded, currentView, handleNavigate }) => (
    <li>
        <a href="#" onClick={(e) => { e.preventDefault(); handleNavigate(view); }}
           className={`flex items-center p-2.5 my-1 rounded-md transition-colors duration-200 ${currentView === view ? 'bg-[#3A3A3C] text-white' : 'hover:bg-[#3A3A3C] text-[#A0A0A5] hover:text-white'} ${!isSidebarExpanded ? 'justify-center' : ''}`}>
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

export default NavItem;