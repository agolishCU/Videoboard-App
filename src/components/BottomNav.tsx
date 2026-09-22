import React from 'react';
import { TabId } from '../types';
import { soundEngine } from '../audio';

interface BottomNavProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const navItems: { id: TabId; label: string; icon: string }[] = [
    { id: 'live-deck', label: 'Live Deck', icon: 'sports_score' },
    { id: 'studio', label: 'Studio', icon: 'dashboard_customize' },
    { id: 'crowd', label: 'Crowd', icon: 'campaign' },
    { id: 'templates', label: 'Templates', icon: 'auto_awesome_motion' },
    { id: 'output', label: 'Output', icon: 'hub' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 md:hidden bg-[#0b0e15]/95 backdrop-blur-xl border-t border-[#1e2535] shadow-[0_-2px_12px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundEngine.playClick();
                onSelectTab(item.id);
              }}
              className={`relative flex flex-col items-center justify-center flex-1 h-14 transition-colors ${
                isActive ? 'text-[#c3f400]' : 'text-[#8e9379] hover:text-white'
              }`}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={`material-symbols-outlined text-[22px] ${
                    isActive ? 'drop-shadow-[0_0_8px_rgba(195,244,0,0.8)]' : ''
                  }`}
                >
                  {item.icon}
                </span>
                <span className="font-headline text-xs tracking-wider uppercase leading-none font-bold">
                  {item.label}
                </span>
              </div>

              {/* Glowing active indicator line at top of tab */}
              <span
                className={`absolute top-0 w-8 h-[2px] rounded-full bg-[#c3f400] transition-opacity duration-150 ${
                  isActive ? 'opacity-100 shadow-[0_0_6px_#c3f400]' : 'opacity-0'
                }`}
              ></span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
