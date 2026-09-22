import React from 'react';
import { TabId, Franchise } from '../types';
import { soundEngine } from '../audio';
import { Volume2, VolumeX, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  currentTab: TabId;
  onSelectTab: (tab: TabId) => void;
  activeFranchise: Franchise;
  isBlackout: boolean;
  onToggleBlackout: () => void;
  onOpenDirectorModal: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeFranchise,
  isBlackout,
  onToggleBlackout,
  onOpenDirectorModal,
  isMuted,
  onToggleMute,
}) => {
  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'live-deck', label: 'Live Deck', icon: 'sports_score' },
    { id: 'studio', label: 'Studio', icon: 'dashboard_customize' },
    { id: 'crowd', label: 'Crowd', icon: 'campaign' },
    { id: 'templates', label: 'Templates', icon: 'auto_awesome_motion' },
    { id: 'output', label: 'Output / Team', icon: 'hub' },
  ];

  return (
    <header className="fixed top-0 w-full z-40 bg-[#0b0e15]/90 backdrop-blur-xl border-b border-[#272a32] shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
      {/* Top Tier: Identity & Core Controls */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-[#191b23] border border-[#32353d] shadow-inner overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida/AEtjO1WkmoFIREBZhnGrMOLoVTSjOeVBQhhgHhrRKQWkb0VG3L-o6AOyg7DwVbvucyb1ayDhTpv2R14JfLICPrsS5KkuilwE7ifVMmONDTrGsEr3XH2rlbayDOVp5Sb32croeUDuszJd32GRU5KFOlgJ1W_FRmUzXPW9sISyNXnBQfu0uYKho6TA1irDE86Q5kPnl_KdzlXAm0IB2Ple3pTLKb9A5ugJuiU03Y-M40XrsDliJLyYv9NI1cqQDQ"
              alt="ArenaPulse Logo"
              className="w-7 h-7 object-contain drop-shadow-[0_0_8px_rgba(195,244,0,0.5)]"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline font-black text-xl tracking-wider text-white uppercase leading-none">
                ARENAPULSE
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#1d1f27] text-[#c3f400] border border-[#32353d]">
                v4.2 HDR
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-[#c3f400] uppercase font-bold leading-none mt-0.5">
              {activeFranchise.shortName} • {activeFranchise.rackId}
            </span>
          </div>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-[#191b23]/90 p-1 rounded-lg border border-[#272a32]">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundEngine.playClick();
                  onSelectTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-headline text-sm uppercase tracking-wider transition-all duration-150 ${
                  isActive
                    ? 'bg-[#c3f400] text-[#161e00] font-bold shadow-[0_0_12px_rgba(195,244,0,0.4)]'
                    : 'text-[#c4c9ac] hover:text-white hover:bg-[#272a32]'
                }`}
              >
                <span className="material-symbols-outlined text-[17px]">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right: Quick Telemetry & Director Profile */}
        <div className="flex items-center gap-2">
          {/* Audio Synthesizer Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              soundEngine.playClick();
            }}
            title={isMuted ? 'Unmute Arena Sounds' : 'Mute Arena Sounds'}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-all ${
              isMuted
                ? 'bg-[#191b23] border-[#32353d] text-[#8e9379]'
                : 'bg-[#1d1f27] border-[#c3f400]/40 text-[#c3f400] shadow-[0_0_8px_rgba(195,244,0,0.3)]'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Master Blackout Panic Button */}
          <button
            onClick={() => {
              soundEngine.playAirHorn();
              onToggleBlackout();
            }}
            title="Instant Panel Blackout Override"
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-headline font-bold text-xs uppercase tracking-wider transition-all active:scale-95 shadow-sm ${
              isBlackout
                ? 'bg-red-600 text-white animate-pulse shadow-[0_0_16px_rgba(239,68,68,0.8)]'
                : 'bg-[#93000a] text-red-200 hover:bg-red-700 border border-red-500/40'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BLACKOUT</span>
          </button>

          {/* Director Profile Avatar (Sarah Jenkins) */}
          <button
            onClick={() => {
              soundEngine.playClick();
              onOpenDirectorModal();
            }}
            title="Director Sarah Jenkins (Live Booth Comms)"
            className="group relative flex items-center gap-1.5 p-1 rounded-full bg-[#191b23] border border-[#32353d] hover:border-[#c3f400] transition-colors"
          >
            <div className="relative w-7 h-7 rounded-full overflow-hidden bg-cover bg-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                alt="Sarah Jenkins Director"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#c3f400] ring-1 ring-[#10131a]"></span>
            </div>
            <span className="hidden xl:inline text-xs font-mono font-semibold text-[#e1e2ec] pr-2 group-hover:text-[#c3f400]">
              DIR. JENKINS
            </span>
          </button>
        </div>
      </div>

      {/* Bottom Sub-tier: Arena Operational Matrix Bar */}
      <div className="h-8 px-4 sm:px-6 bg-[#121620] border-t border-[#1e2535] flex items-center justify-between text-xs font-mono overflow-x-auto no-scrollbar gap-4">
        {/* Left Link Status */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f400] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c3f400]"></span>
          </span>
          <span className="font-semibold uppercase text-[#c3f400] tracking-wider text-[11px]">
            LIVE ARENA LINK
          </span>
        </div>

        {/* Middle Stats */}
        <div className="flex items-center gap-4 text-[#8e9379] shrink-0 text-[11px]">
          <div className="flex items-center gap-1">
            <span>FPS:</span>
            <span className="text-white font-bold bg-[#1d1f27] px-1 rounded">120</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#c3f400]">stadium</span>
            <span className="text-white font-medium">{activeFranchise.stadiumName} • {activeFranchise.court}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <span className="material-symbols-outlined text-[13px] text-[#00daf3]">splitscreen</span>
            <span className="text-[#00daf3] font-bold">CENTERHUNG 4K + 360° RIBBON</span>
          </div>
        </div>

        {/* Right Sync Tag */}
        <div className="flex items-center gap-2 shrink-0 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
          <span className="text-[#c3f400] font-bold">GENLOCK 59.94p</span>
          <span className="text-[#8e9379] hidden md:inline">| SMPTE 120Hz</span>
        </div>
      </div>
    </header>
  );
};
