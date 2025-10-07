import React, { useState } from "react";
import {
  LayoutGrid,
  Folder,
  Users,
  Calendar,
  Settings,
  LifeBuoy,
  Star,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface SidebarItem {
  icon: LucideIcon;
  text: string;
  view: string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

interface SidebarProps {
  currentView: string;
  handleNavigate: (view: string) => void;
}

// --- SIDEBAR CONFIG ---
const sidebarConfig: SidebarSection[] = [
  {
    title: "Workspace",
    items: [
      { icon: LayoutGrid, text: "Dashboard", view: "dashboard" },
      { icon: Folder, text: "Projects", view: "projects" },
      { icon: Users, text: "Team", view: "team" },
    ],
  },
  {
    title: "Tools",
    items: [
      { icon: Calendar, text: "Schedule", view: "schedule" },
      { icon: Settings, text: "Settings", view: "settings" },
      { icon: LifeBuoy, text: "Support", view: "support" },
    ],
  },
];

// --- COMPONENTS ---
interface NavItemProps {
  icon: LucideIcon;
  text: string;
  view: string;
  isExpanded: boolean;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, text, view, isExpanded, isActive, onClick }) => (
  <li>
    <button
      onClick={onClick}
      className={`
        group relative flex items-center w-full py-2.5 px-3 rounded-lg text-sm font-medium
        transition-all duration-200 ease-in-out
        ${isActive ? "bg-[#6366F1]/20 text-[#6366F1]" : "text-gray-300 hover:bg-[#333336] hover:text-white"}
      `}
    >
      {isActive && (
        <motion.div
          layoutId="active-indicator"
          className="absolute left-0 top-0 bottom-0 w-1 bg-[#6366F1] rounded-r"
        />
      )}
      <Icon size={20} className="shrink-0 z-10" />
      <AnimatePresence>
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="ml-4 whitespace-nowrap z-10"
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip for collapsed state */}
      {!isExpanded && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 opacity-0 pointer-events-none group-hover:opacity-100 transition bg-black/80 text-white text-xs py-1 px-2 rounded">
          {text}
        </div>
      )}
    </button>
  </li>
);

// --- SIDEBAR ---
export default function Sidebar({ currentView, handleNavigate }: SidebarProps){

  const [isExpanded, setIsExpanded] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full bg-[#262629] text-white flex flex-col z-50 shadow-2xl
        transition-all duration-300 ease-in-out
        ${isExpanded ? "w-72" : "w-20"}
      `}
    >
      {/* Header with toggle */}
      <div className="flex items-center justify-between p-4 border-b border-[#333336]">
        <div className="flex items-center space-x-3">
          <img
            src="https://placehold.co/40x40/6366F1/FFFFFF?text=S"
            alt="Avatar"
            className="w-10 h-10 rounded-xl border-2 border-[#6366F1] object-cover"
          />
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <p className="font-bold text-white text-base">Simon Prusin</p>
                <p className="text-xs text-[#A0A0A5]">simonprusin@gmail.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 hover:bg-[#333336] rounded-lg transition"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-3 overflow-y-auto hide-scrollbar">
        {sidebarConfig.map((section, idx) => (
          <div key={idx} className="mt-4">
            <AnimatePresence>
              {isExpanded && (
                <motion.h3
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-xs font-semibold uppercase text-gray-500 mb-2 ml-2"
                >
                  {section.title}
                </motion.h3>
              )}
            </AnimatePresence>

            <ul>
              {section.items.map((item) => (
                <NavItem
                  key={item.view}
                  icon={item.icon}
                  text={item.text}
                  view={item.view}
                  isExpanded={isExpanded}
                  isActive={currentView === item.view}
                  onClick={() => handleNavigate(item.view)}
                />
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Premium Button */}
      <div className="p-4 border-t border-[#333336]">
        <button
          className={`
            w-full bg-[#6366F1] text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-[#6366F1]/30
            hover:bg-indigo-600 transition-all duration-300 ease-in-out flex items-center
            ${!isExpanded ? "justify-center" : "justify-start"}
          `}
        >
          <Star size={18} className="shrink-0 fill-current" />
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-4"
              >
                Unlock Premium
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* User menu dropdown */}
      {showUserMenu && (
        <div className="absolute bottom-20 left-0 w-full bg-[#2e2e30] border-t border-[#333336] p-2">
          <button className="flex items-center w-full p-2 rounded hover:bg-[#333336]">
            <User size={18} className="mr-2" /> Profile
          </button>
          <button className="flex items-center w-full p-2 rounded hover:bg-[#333336]">
            <LogOut size={18} className="mr-2" /> Logout
          </button>
        </div>
      )}
    </aside>
  );
};
