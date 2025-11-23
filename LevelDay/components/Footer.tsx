import React from 'react';
import { TabType } from '../types';

interface FooterProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const Footer: React.FC<FooterProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { 
      name: 'Perfil' as TabType, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
      )
    },
    { 
      name: 'Agenda' as TabType, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
      )
    },
    { 
      name: 'Loja' as TabType, 
      icon: (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
      )
    }
  ];

  return (
    <footer className="shrink-0 h-[56px]">
      <div className="bg-[#f08436] border-t border-orange-700 grid grid-cols-3 h-full">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            className={`py-4 flex items-center justify-center transition-colors duration-200 ${
              activeTab === tab.name 
                ? 'bg-[#ed6b2d] text-white' 
                : 'text-orange-200 hover:bg-orange-700'
            }`}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    </footer>
  );
};

export default Footer;