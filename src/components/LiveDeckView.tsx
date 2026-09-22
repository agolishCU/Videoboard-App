import React, { useState, useEffect } from 'react';
import { Franchise, CueItem } from '../types';
import { HOTKEYS, INITIAL_CUES } from '../data/mockData';
import { soundEngine } from '../audio';
import { Play, Pause, RotateCcw, Sliders, Radio, Tv, Flame, Volume2, ShieldAlert } from 'lucide-react';

interface LiveDeckViewProps {
  activeFranchise: Franchise;
  onNavigateToStudio: (presetTitle?: string) => void;
  onNavigateToCrowd: () => void;
  onTriggerBlackout: () => void;
  studioAnimation?: {
    text: string;
    style: string;
    colorHex: string;
    aspect: string;
  } | null;
}

export const LiveDeckView: React.FC<LiveDeckViewProps> = ({
  activeFranchise,
  onNavigateToCrowd,
  onTriggerBlackout,
  studioAnimation,
}) => {
  const [selectedZone, setSelectedZone] = useState<'jumbotron' | 'ribbons' | 'table' | 'all'>('jumbotron');
  const [cues, setCues] = useState<CueItem[]>(INITIAL_CUES);
  const [activeOverlayTitle, setActiveOverlayTitle] = useState('SLAM DUNK REPLAY');
  const [activeOverlaySubtitle, setActiveOverlaySubtitle] = useState('LOOP: 00:04.2 / 00:08.0');
  const [activeOverlayTag, setActiveOverlayTag] = useState('ANIMATION: SLAM DUNK REPLAY [VOLT-VFX]');
  const [takeValue, setTakeValue] = useState(25);
  const [vuLevel, setVuLevel] = useState('-2.4');
  const [timecode, setTimecode] = useState('21:44:02:18');
  const [isPlaying, setIsPlaying] = useState(true);
  const [toastMessage, setToastMessage] = useState('All 4 LED processors synchronized to SMPTE timecode at 120Hz.');
  const [activeHotkeyId, setActiveHotkeyId] = useState<string | null>(null);

  // Update monitor if a new studio animation was pushed
  useEffect(() => {
    if (studioAnimation) {
      setActiveOverlayTitle(studioAnimation.text);
      setActiveOverlayTag(`STUDIO DISPATCH: ${studioAnimation.style.toUpperCase()}`);
      setActiveOverlaySubtitle('4K BUFFERED // ACTIVE PGM BUS');
      setToastMessage(`STUDIO ANIMATION LOADED: "${studioAnimation.text}" ON AIR`);
    }
  }, [studioAnimation]);

  // Realistic audio meter and timecode jitter
  useEffect(() => {
    const interval = setInterval(() => {
      // Jitter VU level
      const rnd = (Math.random() * 2.8 - 3.4).toFixed(1);
      setVuLevel(rnd);

      // Advance frames
      const now = new Date();
      const frames = Math.floor((now.getMilliseconds() / 1000) * 60).toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      setTimecode(`${hours}:${minutes}:${seconds}:${frames}`);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  const handleHotkeyClick = (hotkey: typeof HOTKEYS[0]) => {
    setActiveHotkeyId(hotkey.id);
    setActiveOverlayTitle(hotkey.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/g, ''));
    setActiveOverlayTag(`HOTKEY PAD: ${hotkey.padNumber} • ${hotkey.badge}`);
    setActiveOverlaySubtitle(hotkey.subtitle);
    setToastMessage(`HOTKEY TRIGGERED: [${hotkey.title}] routed to ${selectedZone.toUpperCase()}!`);

    // Audio synthesis
    switch (hotkey.soundEffect) {
      case 'defense':
        soundEngine.play808Defense();
        break;
      case 'noise':
        soundEngine.playAirHorn();
        break;
      case 'three':
        soundEngine.playWhoosh();
        break;
      case 'goal':
        soundEngine.playSiren();
        break;
      case 'tshirt':
        soundEngine.playCrowdRoar();
        break;
      case 'sponsor':
        soundEngine.playOrganCharge();
        break;
      default:
        soundEngine.playClick();
    }

    setTimeout(() => {
      setActiveHotkeyId(null);
    }, 600);
  };

  const handleFireNextCue = () => {
    soundEngine.playOrganCharge();
    setTakeValue(100);
    setActiveOverlayTitle('HAWKS VICTORY!');
    setActiveOverlayTag('CUE FIRED: HAWKS VICTORY STINGER');
    setActiveOverlaySubtitle('FULL BOWL CONFETTI & 360° RIBBON SYNC');
    setToastMessage('STINGER FIRED: Hawks Victory Animation took over Centerhung!');
  };

  const handlePromoteNoiseChallenge = () => {
    soundEngine.playClick();
    onNavigateToCrowd();
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto pb-12 animate-fadeIn font-body">
      {/* 1. Top Match Urgency Strip */}
      <div className="bg-[#191b23] border border-[#272a32] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#ff5708] text-white font-mono text-[11px] font-bold uppercase tracking-wider shrink-0 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            LIVE CLUTCH
          </div>
          <div className="flex flex-col truncate">
            <span className="font-headline text-base sm:text-lg uppercase tracking-wide text-white font-bold leading-none truncate">
              Q4 02:45 • {activeFranchise.shortName.toUpperCase()} 104 vs VIPERS 101
            </span>
            <span className="font-mono text-[11px] text-[#8e9379] tracking-normal pt-1">
              {activeFranchise.stadiumName} • TIMEOUT {activeFranchise.shortName.toUpperCase()} (POSSESSION)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onTriggerBlackout}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#93000a] text-red-200 hover:bg-red-700 transition-colors shadow-sm active:scale-95 border border-red-500/40"
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="font-headline font-bold text-sm tracking-wider uppercase leading-none">BLACKOUT</span>
          </button>
        </div>
      </div>

      {/* 2. Videoboard Monitor Screen (16:9 Aspect Ratio) */}
      <div className="bg-[#121620] border border-[#1e2535] rounded-xl p-3 shadow-2xl flex flex-col space-y-2">
        {/* Monitor Header Status */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#ff5708]" />
            <span className="font-mono text-xs uppercase font-bold text-white tracking-wide">
              CENTERHUNG 4K BOARD - ON AIR
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[#ff5708] text-white shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
              PGM LIVE
            </span>
            <span className="font-mono text-xs text-[#00daf3]">REC: 01:42:19</span>
          </div>
        </div>

        {/* Active Broadcast Frame */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black border border-[#272a32] shadow-inner flex flex-col justify-between p-3 select-none">
          {/* Background Video Frame image */}
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0pHzqX67bwJm_uwMBg69hATRIG_zyUUtq2zU7heqcnzch0EslnfTiZyG-vGB50HpW1-iqwYAYyNgRhbL_L17hHrSvX_1wqAw-ErHiE-h-t3LuD26j0OMJX8-K62LzJpJ9S5qg4w-hvVCbhjEWCf8I_7-d1A5VxC--rlrezbdaD6M8YCdqsCash6kdQXOGnXp_kb2MrGOj8Xp6r10_oYQpOJeHJ3rnZZV_msJVtNZZiTDb99CcEaP8"
            alt="Dynamic Arena Replay"
            className="absolute inset-0 w-full h-full object-cover opacity-80 brightness-110 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/60 pointer-events-none"></div>

          {/* LED Dot grid overlay */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-10" width="100%" height="100%">
            <defs>
              <pattern id="jumbo-grid" width="4" height="4" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="0.8" fill="#c3f400" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#jumbo-grid)" />
          </svg>

          {/* Top Overlay Tags */}
          <div className="relative z-20 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-[#0b0e15]/90 px-3 py-1 rounded-full shadow-md backdrop-blur-md border border-[#272a32]">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span className="font-mono text-xs text-white font-bold tracking-wide">
                {activeOverlayTag}
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#0b0e15]/90 px-2 py-1 rounded-md text-[#9cf0ff] font-mono text-xs border border-[#272a32]">
              <Volume2 className="w-3.5 h-3.5 text-[#c3f400]" />
              <span>108.4 dB</span>
            </div>
          </div>

          {/* Center Dynamic Graphic Tag */}
          <div className="relative z-20 self-center flex flex-col items-center pointer-events-none text-center">
            <div className="px-5 py-2 rounded-xl bg-[#ff5708]/95 text-white shadow-2xl border-2 border-white/20 animate-bounce">
              <span className="font-headline text-2xl sm:text-4xl tracking-wider uppercase font-black drop-shadow-md">
                {activeOverlayTitle}
              </span>
            </div>
            <span className="font-mono text-[11px] sm:text-xs text-[#c3f400] tracking-widest uppercase mt-1.5 bg-[#0b0e15]/90 px-2.5 py-0.5 rounded border border-[#272a32]">
              {activeOverlaySubtitle}
            </span>
          </div>

          {/* Bottom Audio VU Meters & Live Telemetry */}
          <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-3 bg-[#0b0e15]/85 backdrop-blur-md p-2.5 rounded-lg border border-[#272a32]">
            <div className="flex-1 flex flex-col space-y-1">
              <div className="flex items-center justify-between text-[#8e9379] font-mono text-[11px]">
                <div className="flex items-center gap-2">
                  <span>MASTER STEREO OUT</span>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1 rounded bg-[#191b23] text-white hover:text-[#c3f400] transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      setActiveOverlaySubtitle('RESET: 00:00.0 / 00:08.0');
                    }}
                    className="p-1 rounded bg-[#191b23] text-white hover:text-[#c3f400] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
                <span className="text-[#c3f400] font-bold">{vuLevel} dBFS</span>
              </div>
              {/* Dual VU Bar Graph */}
              <div className="w-full h-2.5 bg-[#191b23] rounded-full overflow-hidden flex gap-1 p-0.5 border border-[#272a32]">
                <div className="h-full bg-[#c3f400] rounded-sm transition-all duration-75" style={{ width: '76%' }}></div>
                <div className="h-full bg-[#ff5708] rounded-sm transition-all duration-75" style={{ width: '16%' }}></div>
                <div className="h-full bg-red-600 rounded-sm transition-all duration-75" style={{ width: '4%' }}></div>
              </div>
            </div>

            {/* Timecode readout */}
            <div className="flex items-center sm:flex-col sm:items-end justify-between font-mono text-xs">
              <span className="text-[#8e9379] text-[10px]">TC GENLOCK</span>
              <span className="text-[#c3f400] font-bold tracking-wider text-sm">{timecode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Output Zone Destination Routing */}
      <div className="flex flex-col space-y-1.5">
        <span className="font-mono text-xs uppercase tracking-widest text-[#8e9379] px-1 font-semibold">
          Active Destination Routing
        </span>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'jumbotron', label: 'Centerhung 4K' },
            { id: 'ribbons', label: 'Endzone Ribbons 360°' },
            { id: 'table', label: 'Courtside LED Table' },
            { id: 'all', label: 'Sync All (Strobe)' },
          ].map((zone) => {
            const isSelected = selectedZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedZone(zone.id as 'jumbotron' | 'ribbons' | 'table' | 'all');
                  setToastMessage(`TARGET ROUTE SWITCHED: ${zone.label} is now active bus.`);
                }}
                type="button"
                className={`shrink-0 px-4 py-2 rounded-lg font-headline text-sm uppercase tracking-wider transition-all active:scale-95 border ${
                  isSelected
                    ? 'bg-[#c3f400] text-[#161e00] font-black border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.5)]'
                    : 'bg-[#191b23] text-[#8e9379] hover:text-white border-[#272a32]'
                }`}
              >
                {zone.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Instant Hype Hotkeys (2x3 Tactile Trigger Grid) */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8e9379] font-semibold">
            Instant Hype Hotkeys [Tap to Fire]
          </span>
          <span className="font-mono text-xs text-[#c3f400] flex items-center gap-1 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-ping"></span>
            HOT-SWAP BUS READY
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
          {HOTKEYS.map((hotkey) => {
            const isFiring = activeHotkeyId === hotkey.id;
            return (
              <button
                key={hotkey.id}
                onClick={() => handleHotkeyClick(hotkey)}
                type="button"
                className={`relative group h-24 rounded-xl p-3 flex flex-col justify-between text-left shadow-lg overflow-hidden transition-all duration-100 active:scale-95 border ${
                  isFiring
                    ? 'bg-[#c3f400] text-[#10131a] border-[#c3f400] scale-95 shadow-[0_0_24px_rgba(195,244,0,0.8)]'
                    : 'bg-[#191b23] border-[#272a32] hover:border-[#c3f400]/50 hover:bg-[#1d1f27]'
                }`}
              >
                {/* Background glow sheen */}
                <div
                  className={`absolute inset-0 transition-opacity ${
                    hotkey.accent === 'orange'
                      ? 'bg-[#ff5708]/10 group-hover:bg-[#ff5708]/20'
                      : hotkey.accent === 'cyan'
                      ? 'bg-[#00daf3]/10 group-hover:bg-[#00daf3]/20'
                      : 'bg-[#c3f400]/10 group-hover:bg-[#c3f400]/20'
                  }`}
                ></div>

                {/* Top Pad Header */}
                <div className="relative z-10 flex items-center justify-between w-full font-mono text-[11px]">
                  <span
                    className={`font-bold tracking-wider ${
                      isFiring
                        ? 'text-[#10131a]'
                        : hotkey.accent === 'orange'
                        ? 'text-[#ff5708]'
                        : hotkey.accent === 'cyan'
                        ? 'text-[#00daf3]'
                        : 'text-[#c3f400]'
                    }`}
                  >
                    {hotkey.padNumber} • {hotkey.badge}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
                </div>

                {/* Bottom Pad Content */}
                <div className="relative z-10 flex items-end justify-between w-full">
                  <div>
                    <div className="font-headline text-lg sm:text-xl uppercase tracking-wider text-white font-black flex items-center gap-1.5 leading-none">
                      <span>{hotkey.title}</span>
                      <span>{hotkey.emoji}</span>
                    </div>
                    <span className="font-mono text-[10px] text-[#8e9379] block mt-1">
                      {hotkey.subtitle}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold text-[#8e9379]">
                    {hotkey.duration}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Armed Cue Stack */}
      <div className="bg-[#121620] border border-[#1e2535] rounded-xl p-3.5 flex flex-col space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#c3f400]" />
            <span className="font-headline text-base uppercase tracking-wider text-white font-bold">
              Armed Cue Stack
            </span>
          </div>
          <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-[#191b23] text-[#8e9379] border border-[#272a32] font-semibold">
            {cues.length} STAGED
          </span>
        </div>

        {/* Primary NEXT UP Cue */}
        <div className="bg-[#191b23] border border-[#272a32] rounded-xl p-3 flex flex-col space-y-2 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#c3f400] text-[#161e00] font-mono text-[10px] font-black uppercase">
                NEXT UP
              </span>
              <span className="font-headline text-base uppercase tracking-wide text-white font-bold">
                {cues[0]?.title || 'Hawks Victory Stinger'}
              </span>
            </div>
            <span className="font-mono text-xs text-[#c3f400] font-bold">
              {cues[0]?.duration ? `READY (${cues[0].duration})` : 'READY (00:06)'}
            </span>
          </div>

          <p className="font-body text-xs text-[#8e9379] line-clamp-1">
            {cues[0]?.description || 'Full bowl confetti cannons + 360 ribbon synchronized LED pulse sequence.'}
          </p>

          {/* Instant Fire Button + Crossfader Slider */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
            <button
              onClick={handleFireNextCue}
              type="button"
              className="sm:col-span-2 h-11 rounded-lg bg-[#c3f400] text-[#161e00] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform hover:brightness-110 font-headline font-black text-base uppercase tracking-wider"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>FIRE CUE</span>
            </button>

            {/* Live Take-To-Air Interactive Slider */}
            <div className="sm:col-span-3 h-11 bg-[#10131a] rounded-lg px-3 flex items-center justify-between gap-3 relative overflow-hidden border border-[#272a32]">
              <div
                className="absolute left-0 top-0 bottom-0 bg-[#ff5708]/30 transition-all duration-75"
                style={{ width: `${takeValue}%` }}
              ></div>
              <Sliders className="w-4 h-4 text-[#8e9379] relative z-10 shrink-0" />
              <input
                type="range"
                min="0"
                max="100"
                value={takeValue}
                onChange={(e) => setTakeValue(Number(e.target.value))}
                className="relative z-10 w-full accent-[#c3f400] cursor-ew-resize bg-transparent"
              />
              <span className="font-mono text-xs font-bold text-white shrink-0 relative z-10">
                TAKE {takeValue}%
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Cue: Noise Meter Challenge */}
        <div className="bg-[#191b23] border border-[#272a32] rounded-xl p-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            <Flame className="w-5 h-5 text-[#00daf3] shrink-0" />
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-2">
                <span className="font-headline text-sm uppercase tracking-wide text-white truncate font-bold">
                  Noise Meter Challenge (North vs South Stands)
                </span>
                <span className="px-1.5 py-0.2 rounded bg-[#10131a] text-[#00daf3] font-mono text-[10px]">
                  ARMED
                </span>
              </div>
              <span className="font-body text-xs text-[#8e9379] truncate">
                Triggered on referee whistle timeout with live mic decibel meter
              </span>
            </div>
          </div>
          <button
            onClick={handlePromoteNoiseChallenge}
            type="button"
            className="shrink-0 px-3 py-1.5 rounded-lg bg-[#10131a] hover:bg-[#c3f400] hover:text-[#10131a] text-[#c3f400] border border-[#272a32] font-mono text-xs font-bold uppercase transition-colors"
          >
            PROMOTE
          </button>
        </div>
      </div>

      {/* 6. Operational Toast / Booth Feedback Banner */}
      <div className="rounded-xl bg-[#191b23] border border-[#272a32] p-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
          <span className="font-mono text-xs text-[#e1e2ec] font-semibold">{toastMessage}</span>
        </div>
        <span className="font-mono text-xs text-[#c3f400] font-bold uppercase shrink-0">
          HEALTHY
        </span>
      </div>
    </div>
  );
};
