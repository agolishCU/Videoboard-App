import React, { useState } from 'react';
import { Franchise, StadiumTemplate } from '../types';
import { TEMPLATES } from '../data/mockData';
import { soundEngine } from '../audio';
import {
  Search,
  Sliders,
  Palette,
  Zap,
  Volume2,
  Tv,
  Sparkles,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface TemplatesViewProps {
  activeFranchise: Franchise;
  onCustomizeInStudio: (templateTitle: string) => void;
  onArmCue: (template: StadiumTemplate) => void;
}

export const TemplatesView: React.FC<TemplatesViewProps> = ({
  activeFranchise,
  onCustomizeInStudio,
  onArmCue,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const sports = [
    { id: 'all', label: 'All Sports', icon: 'tune' },
    { id: 'bball', label: 'Basketball', icon: 'sports_basketball' },
    { id: 'football', label: 'Football', icon: 'sports_football' },
    { id: 'hockey', label: 'Hockey', icon: 'sports_hockey' },
    { id: 'baseball', label: 'Baseball', icon: 'sports_baseball' },
    { id: 'soccer', label: 'Soccer', icon: 'sports_soccer' },
  ];

  const situations = [
    { id: 'hype', label: 'Hype & Intro Videos', count: '42 OPS', sub: 'Arena blackout stingers', icon: Zap, color: '#c3f400' },
    { id: 'crowd', label: 'Crowd Prompts & dB', count: '38 OPS', sub: 'Noise meter triggers', icon: Volume2, color: '#ff5708' },
    { id: 'plays', label: 'In-Game Plays & Scores', count: '64 OPS', sub: 'Dunk, 3PT & fouls', icon: Tv, color: '#00daf3' },
    { id: 'sponsors', label: 'Sponsor & Games', count: '29 OPS', sub: 'T-shirt toss, trivia', icon: Sparkles, color: '#ffffff' },
  ];

  const filteredTemplates = TEMPLATES.filter((tpl) => {
    const matchesSearch =
      tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.headlineText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = selectedSport === 'all' || tpl.sport === 'all' || tpl.sport === selectedSport;
    const matchesCategory = !selectedCategory || tpl.category === selectedCategory;
    return matchesSearch && matchesSport && matchesCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleApplyReSkin = () => {
    soundEngine.playOrganCharge();
    showToast(`${activeFranchise.name} Vector Pack Applied to 250+ Templates`);
  };

  const handleQuickCue = (tpl: StadiumTemplate) => {
    soundEngine.playAirHorn();
    onArmCue(tpl);
    showToast(`Preset "${tpl.title}" Armed in Live Production Queue`);
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto pb-12 animate-fadeIn font-body">
      {/* 1. Search & Tactical Filters Header */}
      <section className="flex flex-col gap-3 bg-[#121620] border border-[#1e2535] p-4 rounded-xl shadow-lg">
        <div className="relative flex items-center w-full bg-[#191b23] border border-[#272a32] rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-[#c3f400] mr-2 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 250+ arena graphics, stingers, hype clips..."
            className="w-full bg-transparent font-mono text-xs sm:text-sm text-white placeholder-[#8e9379] outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-[#8e9379] hover:text-white px-1"
            >
              CLEAR
            </button>
          )}
        </div>

        {/* Sports Preset Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
          {sports.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedSport(sport.id);
                }}
                className={`shrink-0 px-3 py-1.5 rounded-lg uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all border ${
                  isSelected
                    ? 'bg-[#c3f400] text-[#10131a] border-[#c3f400] shadow-[0_0_8px_rgba(195,244,0,0.4)]'
                    : 'bg-[#191b23] text-[#8e9379] hover:text-white border-[#272a32]'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{sport.icon}</span>
                <span>{sport.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. 1-Tap Team Re-Skin Banner */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#ff5708] via-[#272a32] to-[#121620] p-4 sm:p-5 border border-[#ff5708]/40 shadow-xl">
        <div className="flex flex-col gap-2 z-10 relative">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="px-2 py-0.5 rounded bg-black/80 text-[#ff5708] uppercase font-bold tracking-widest flex items-center gap-1 border border-[#ff5708]/30">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5708] animate-pulse"></span>
              Instant Asset Adaptation
            </span>
            <span className="text-white/80 uppercase">SYNC #{activeFranchise.rackId}</span>
          </div>

          <h3 className="font-headline text-xl sm:text-2xl text-white uppercase tracking-wide font-black">
            1-Tap Team Re-Skin ({activeFranchise.shortName.toUpperCase()})
          </h3>

          <p className="font-body text-xs sm:text-sm text-[#ffdbcf] max-w-2xl">
            Instantly apply {activeFranchise.name} colors, 3D kinetic typography, and vector SVG crests across all 250+ stadium templates.
          </p>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#ff5708] flex items-center justify-center text-xs text-white font-bold border border-white/30">
                A
              </div>
              <div className="w-6 h-6 rounded-full bg-[#c3f400] flex items-center justify-center text-xs text-[#10131a] font-bold border border-white/30">
                V
              </div>
              <span className="font-mono text-xs text-[#c4c9ac] font-medium">Applied: 247 Assets</span>
            </div>

            <button
              onClick={handleApplyReSkin}
              className="px-4 py-2 rounded-lg bg-[#c3f400] text-[#10131a] font-headline text-sm uppercase tracking-wider font-extrabold shadow-lg active:scale-95 transition-transform flex items-center gap-1.5 hover:brightness-110"
            >
              <Palette className="w-4 h-4" />
              <span>Push {activeFranchise.shortName} Skin</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. Situation Presets Horizontal Ribbon */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#c3f400]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wider text-white">
              Game Situations
            </span>
          </div>
          <span className="text-[#8e9379] uppercase">4 ACTIVE CATEGORIES</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {situations.map((sit) => {
            const Icon = sit.icon;
            const isSelected = selectedCategory === sit.id;
            return (
              <button
                key={sit.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCategory(isSelected ? null : sit.id);
                }}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all ${
                  isSelected
                    ? 'bg-[#1d1f27] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                    : 'bg-[#121620] border-[#1e2535] hover:border-[#272a32]'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="w-7 h-7 rounded-lg bg-[#191b23] border border-[#272a32] flex items-center justify-center">
                    <Icon className="w-4 h-4" style={{ color: sit.color }} />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#c3f400] bg-[#0b0e15] px-1.5 py-0.5 rounded border border-[#272a32]">
                    {sit.count}
                  </span>
                </div>
                <span className="font-headline font-bold text-sm text-white uppercase leading-tight">
                  {sit.label}
                </span>
                <span className="font-mono text-[10px] text-[#8e9379] mt-0.5">{sit.sub}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Active Stadium Presets List */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="font-headline font-bold text-sm uppercase tracking-wider text-white">
            Active Stadium Presets
          </span>
          <span className="text-[#8e9379]">SHOWING {filteredTemplates.length} OF 250</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((tpl) => (
            <article
              key={tpl.id}
              className="flex flex-col rounded-xl bg-[#121620] border border-[#1e2535] overflow-hidden shadow-xl hover:border-[#272a32] transition-colors"
            >
              {/* Visual Thumbnail Frame */}
              <div className="relative w-full h-48 bg-[#0b0e15] overflow-hidden flex items-center justify-center select-none">
                <img
                  src={tpl.bgImageUrl}
                  alt={tpl.title}
                  className="w-full h-full object-cover opacity-60 mix-blend-screen"
                />

                {/* Simulated center kinetic title */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-3 pointer-events-none">
                  <span
                    className="font-headline text-3xl sm:text-4xl uppercase font-black tracking-wider text-white drop-shadow-[0_0_16px_rgba(195,244,0,0.9)]"
                    style={{ color: tpl.colorHex }}
                  >
                    {tpl.headlineText}
                  </span>
                </div>

                {/* Top Status Tags */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-[#c3f400] text-[#10131a] uppercase font-bold tracking-wider shadow">
                    {tpl.tag}
                  </span>
                </div>

                {/* Bottom Overlays */}
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#c3f400] font-bold">
                  {tpl.duration}
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-[#e1e2ec]">
                  {tpl.aspectRatio}
                </div>
              </div>

              {/* Card Footer Content & Actions */}
              <div className="p-4 flex flex-col gap-3 bg-[#191b23]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-col min-w-0">
                    <h4 className="font-headline text-lg text-white uppercase font-bold tracking-wide truncate">
                      {tpl.title}
                    </h4>
                    <p className="font-body text-xs text-[#8e9379] line-clamp-1">{tpl.description}</p>
                  </div>

                  <button
                    onClick={() => handleQuickCue(tpl)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#121620] hover:bg-[#c3f400] hover:text-[#10131a] text-[#c3f400] border border-[#272a32] font-headline text-xs uppercase font-extrabold flex items-center gap-1 transition-all active:scale-95"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Cue</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    onCustomizeInStudio(tpl.headlineText);
                  }}
                  className="w-full py-2.5 rounded-lg bg-[#272a32] hover:bg-[#32353d] text-white font-headline text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
                >
                  <Sliders className="w-4 h-4 text-[#c3f400]" />
                  <span>Customize in Studio</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#c3f400] text-[#10131a] px-5 py-2.5 rounded-full font-mono text-xs uppercase font-black shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
