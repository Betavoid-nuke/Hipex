// components/DetailTabs.tsx

import React from 'react';
import { FileText, Cpu, GitFork, MessageSquare, LucideIcon } from 'lucide-react';

interface DetailTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface Tab {
  key: string;
  name: string;
  icon: LucideIcon;
}

const DetailTabs: React.FC<DetailTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs: Tab[] = [
    { key: 'description', name: 'Description', icon: FileText },
    { key: 'details', name: 'Model Details', icon: Cpu },
    { key: 'settings', name: '3D Settings', icon: GitFork },
    { key: 'comments', name: 'Comments (Mock)', icon: MessageSquare },
  ];

  return (
    <div className="flex border-b border-gray-700/50 mb-6 overflow-x-auto">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors duration-200 
            ${activeTab === tab.key
              ? 'text-white border-b-2 border-indigo-500'
              : 'text-gray-400 hover:text-white hover:border-b-2 hover:border-gray-600'}`
          }
        >
          <tab.icon size={16} />
          {tab.name}
        </button>
      ))}
    </div>
  );
};

export default DetailTabs;