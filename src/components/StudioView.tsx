import React, { useState, useEffect } from 'react';
import { Franchise, StudioLayer } from '../types';
import { soundEngine } from '../audio';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Sliders,
  Sparkles,
  Zap,
  Flame,
  Maximize2,
  Save,
  Send,
  Eye,
  EyeOff,
  CheckCircle2,
  RefreshCw,
  Radio,
} from 'lucide-react';

interface StudioViewProps {
  activeFranchise: Franchise;
  onPushToLiveDeck: (animationData: {
    text: string;
    style: string;
    colorHex: string;
    aspect: string;
  }) => void;
  initialPreset?: string | null;
}

export const StudioView: React.FC<StudioViewProps> = ({
  activeFranchise,
  onPushToLiveDeck,
  initialPreset,
}) => {
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '32:9' | '4:1'>('16:9');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLooping, setIsLooping] = useState(true);
  const [playheadPct, setPlayheadPct] = useState(33);
  const [timecodeStr, setTimecodeStr] = useState('01:20 / 04:00');

  // Property Inspector states
  const [displayText, setDisplayText] = useState(initialPreset || 'GET LOUD!');
  const [selectedStyle, setSelectedStyle] = useState<'neon-glitch' | 'earthquake' | 'fire-blast' | 'zoom-pulse'>('neon-glitch');
  const [shakeForce, setShakeForce] = useState(85);
  const [glowIntensity, setGlowIntensity] = useState(100);
  const [bpm, setBpm] = useState(132);
  const [colorScheme, setColorScheme] = useState<'hawks' | 'crimson' | 'cyan'>('hawks');
  const [toastText, setToastText] = useState<string | null>(null);

  // Layers
  const [layers, setLayers] = useState<StudioLayer[]>([
    { id: 'l1', name: 'L1: Kinetic Text', tag: '"GET LOUD!"', startPct: 10, widthPct: 75, visible: true, colorType: 'orange' },
    { id: 'l2', name: 'L2: Sparks Burst', tag: 'BURST_04', startPct: 20, widthPct: 55, visible: true, colorType: 'volt' },
    { id: 'l3', name: 'L3: Mascot Crest', tag: 'STATIC_LOGO', startPct: 0, widthPct: 90, visible: true, colorType: 'high' },
    { id: 'l4', name: 'L4: Audio Glow', tag: 'MIC_GAIN_SYNC', startPct: 30, widthPct: 70, visible: true, colorType: 'cyan' },
  ]);

  useEffect(() => {
    if (initialPreset) {
      setDisplayText(initialPreset);
    }
  }, [initialPreset]);

  // Scrubber animation runner
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      if (isPlaying) {
        setPlayheadPct((prev) => {
          const duration = 4.0;
          const advance = (delta / duration) * 100 * (bpm / 120);
          let next = prev + advance;
          if (next >= 100) {
            next = isLooping ? 0 : 100;
          }
          // Update timecode
          const currentSec = (next / 100) * 4.0;
          const sec = Math.floor(currentSec).toString().padStart(2, '0');
          const sub = Math.floor((currentSec % 1) * 30).toString().padStart(2, '0');
          setTimecodeStr(`${sec}:${sub} / 04:00`);
          return next;
        });
      }
      animFrame = requestAnimationFrame(loop);
    };

    animFrame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, isLooping, bpm]);

  const toggleLayerVisibility = (layerId: string) => {
    soundEngine.playClick();
    setLayers((prev) =>
      prev.map((l) => (l.id === layerId ? { ...l, visible: !l.visible } : l))
    );
  };

  const showNotification = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 2500);
  };

  const handlePushLive = () => {
    soundEngine.playAirHorn();
    const colorHex = colorScheme === 'hawks' ? '#c3f400' : colorScheme === 'crimson' ? '#ff5708' : '#00daf3';
    onPushToLiveDeck({
      text: displayText,
      style: selectedStyle,
      colorHex,
      aspect: aspectRatio,
    });
    showNotification('ANIMATION DISPATCHED: LIVE ON CENTERHUNG BOARD!');
  };

  // Dynamic typography styling based on inspector
  const getKineticTextStyle = () => {
    const isL1Visible = layers.find((l) => l.id === 'l1')?.visible;
    if (!isL1Visible) return 'opacity-0';

    let base = 'transition-all duration-100 font-headline font-black uppercase italic tracking-tighter ';
    if (selectedStyle === 'neon-glitch') {
      base += 'text-transparent bg-clip-text bg-gradient-to-r from-[#ff5708] via-white to-[#c3f400] drop-shadow-[0_0_20px_rgba(195,244,0,0.9)] ';
    } else if (selectedStyle === 'earthquake') {
      base += 'text-white tracking-widest drop-shadow-[0_0_24px_rgba(255,87,8,0.9)] ';
    } else if (selectedStyle === 'fire-blast') {
      base += 'text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-[#ff5708] to-yellow-400 drop-shadow-[0_0_28px_rgba(255,87,8,1)] ';
    } else {
      base += 'text-[#00daf3] drop-shadow-[0_0_20px_rgba(0,218,243,0.9)] ';
    }
    return base;
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto pb-12 animate-fadeIn font-body">
      {/* 1. Sub-Header Status Strip */}
      <div className="flex items-center justify-between bg-[#0b0e15] border border-[#272a32] px-4 py-2 rounded-xl text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
          <span className="text-[#c3f400] font-bold uppercase tracking-widest">
            CANVAS ENGINE v4.2 // GPU ACCELERATED
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 rounded bg-[#191b23] text-[#8e9379] border border-[#272a32]">
            BUFFER: 4K HDR REC.2020
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              showNotification('GRAPHICS BUFFER FLUSHED & RESYNCHRONIZED');
            }}
            className="flex items-center gap-1 text-[#c3f400] hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>RESYNC</span>
          </button>
        </div>
      </div>

      {/* 2. Centerhung Videoboard Canvas Simulator */}
      <div className="relative flex flex-col bg-[#0b0e15] border border-[#1e2535] rounded-xl overflow-hidden shadow-2xl">
        {/* Viewport Header Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#121620] border-b border-[#1e2535] text-white">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-[#ff5708]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wide">
              CENTERHUNG SIMULATOR
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="px-2 py-0.5 rounded bg-[#191b23] text-[#ff5708] font-bold">
              P-BUS: ACTIVE
            </span>
            <span className="px-2 py-0.5 rounded bg-[#191b23] text-[#c3f400]">
              {aspectRatio === '16:9' ? '3840×2160' : aspectRatio === '32:9' ? '7680×120' : '1920×480'}
            </span>
          </div>
        </div>

        {/* Aspect Ratio Mode Chips */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#191b23] border-b border-[#272a32] overflow-x-auto no-scrollbar font-mono text-xs">
          <span className="text-[#8e9379] uppercase shrink-0">RIG RATIO:</span>
          {(['16:9', '32:9', '4:1'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => {
                soundEngine.playClick();
                setAspectRatio(ratio);
              }}
              className={`px-3 py-1 rounded font-bold uppercase transition-all shrink-0 ${
                aspectRatio === ratio
                  ? 'bg-[#c3f400] text-[#10131a] shadow-[0_0_8px_rgba(195,244,0,0.4)]'
                  : 'bg-[#10131a] text-[#8e9379] hover:text-white'
              }`}
            >
              {ratio === '16:9' ? '16:9 MAIN DISPLAY' : ratio === '32:9' ? '32:9 RIBBON BANNER' : '4:1 FASCIA RING'}
            </button>
          ))}
        </div>

        {/* LED Display Screen Mockup */}
        <div
          className={`relative w-full bg-[#0b0e15] overflow-hidden flex items-center justify-center select-none transition-all duration-300 ${
            aspectRatio === '16:9'
              ? 'aspect-video'
              : aspectRatio === '32:9'
              ? 'aspect-[28/9] min-h-[140px]'
              : 'aspect-[21/9] min-h-[160px]'
          }`}
        >
          {/* LED Pixel Matrix Grid Simulation */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25 z-20" width="100%" height="100%">
            <defs>
              <pattern id="studio-grid" width="6" height="6" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#abd600" opacity="0.4" />
                <circle cx="5" cy="5" r="0.8" fill="#ff5708" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#studio-grid)" />
          </svg>

          {/* Atmospheric Stadium Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-screen scale-105 transition-transform duration-700 pointer-events-none"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDcjzpjWlihNGAllLkjHydIUnKW_vLc3ykpKjGVEBHd-q-Q9bq1HcndboG-O0frZe4ROaVRsqOsgRc02zBAkCbb8-O7ua6GfdL1zgomyysh1if-fAZM-8eKrBa16zfnOtaZrM-C0HFxCP6TUwIom7r27q5Up44k6dqudwOlnlb-HZDynH7QeJriw6Ha8yue-ScBesUzDINyQnGxfX53ySzRjU44hlz7DjxMd3ED4dr4aWpeBCgnn9kP')",
            }}
          ></div>

          {/* Kinetic Particle Sparks & Lightning Layer (L2) */}
          {layers.find((l) => l.id === 'l2')?.visible && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-between px-6 z-10">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center opacity-90 drop-shadow-[0_0_12px_rgba(255,87,8,0.8)]">
                <Zap className="w-12 h-12 text-[#ff5708] -rotate-12 animate-pulse" />
                <Sparkles className="w-6 h-6 text-[#c3f400] absolute rotate-45" />
              </div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center opacity-90 drop-shadow-[0_0_12px_rgba(195,244,0,0.8)]">
                <Zap className="w-12 h-12 text-[#c3f400] rotate-12 animate-pulse" />
                <Sparkles className="w-6 h-6 text-[#ff5708] absolute -rotate-45" />
              </div>
            </div>
          )}

          {/* Mascot Crest Layer (L3) */}
          {layers.find((l) => l.id === 'l3')?.visible && (
            <div className="absolute top-3 left-3 z-10 w-10 h-10 rounded-lg overflow-hidden border border-[#c3f400]/40 opacity-70">
              <img src={activeFranchise.crestUrl} alt="Crest" className="w-full h-full object-cover" />
            </div>
          )}

          {/* Central Kinetic Typographic Stage (L1) */}
          <div
            className="relative z-20 flex flex-col items-center justify-center text-center px-4"
            style={{
              transform: `skewX(-${Math.round((shakeForce / 100) * 8)}deg) scale(${1 + (shakeForce / 600)})`,
            }}
          >
            {/* Floating Sub-badge */}
            <div className="flex items-center gap-1 px-2.5 py-0.5 rounded bg-black/80 backdrop-blur-md mb-1.5 shadow-md border border-[#272a32]">
              <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#c3f400] font-bold">
                {activeFranchise.shortName.toUpperCase()} LIVE // 4TH QTR
              </span>
            </div>

            {/* Dynamic Kinetic Typography */}
            <h1
              className={`${getKineticTextStyle()} text-3xl sm:text-5xl md:text-6xl`}
              style={{
                filter: `drop-shadow(0 0 ${Math.round((glowIntensity / 100) * 24)}px ${
                  colorScheme === 'hawks' ? '#c3f400' : colorScheme === 'crimson' ? '#ff5708' : '#00daf3'
                })`,
              }}
            >
              {displayText || 'NOISE!'}
            </h1>

            {/* Audio Bar Visualizer (L4) */}
            {layers.find((l) => l.id === 'l4')?.visible && (
              <div className="flex items-end gap-1 mt-2 h-3.5">
                {[60, 90, 45, 100, 75, 95, 50, 80, 100, 40].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full animate-bounce"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i % 2 === 0 ? '#c3f400' : '#ff5708',
                      animationDelay: `${i * 80}ms`,
                    }}
                  ></span>
                ))}
              </div>
            )}
          </div>

          {/* Watermark Telemetry Overlay */}
          <div className="absolute bottom-2 left-3 z-20 flex items-center gap-2 pointer-events-none font-mono text-[10px] text-[#8e9379]">
            <Radio className="w-3 h-3 text-[#c3f400]" />
            <span>FEED A // LIVE NDI CH-1</span>
          </div>
          <div className="absolute bottom-2 right-3 z-20 pointer-events-none font-mono text-[10px] text-[#c3f400] font-bold">
            FPS 120 // 0 DROP
          </div>
        </div>

        {/* Transport Controls Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#121620] border-t border-[#1e2535]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#c3f400] text-[#10131a] active:scale-95 transition-transform font-bold"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setPlayheadPct(0);
              }}
              title="Reset to 00:00"
              className="flex items-center justify-center w-7 h-7 rounded bg-[#191b23] text-white hover:text-[#c3f400] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsLooping(!isLooping);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors ${
                isLooping ? 'bg-[#191b23] text-[#c3f400]' : 'bg-[#191b23] text-[#8e9379]'
              }`}
            >
              <Repeat className="w-3.5 h-3.5" />
              <span>{isLooping ? 'LOOP ON' : 'LOOP OFF'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-white font-bold bg-[#0b0e15] px-2 py-0.5 rounded border border-[#272a32]">
              {timecodeStr}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Motion Timeline & Multi-Track Scrubber */}
      <div className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-3.5 gap-2 shadow-md">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#c3f400]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wide text-white">
              LAYER TIMELINE
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-[#8e9379]">RANGE:</span>
            <span className="text-white font-bold">00:00 - 04:00s</span>
            <span className="px-1.5 py-0.5 rounded bg-[#191b23] text-[#ff5708] font-bold">4.0s CUE</span>
          </div>
        </div>

        {/* Ruler Bar */}
        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const pct = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
            setPlayheadPct(pct);
            soundEngine.playClick();
          }}
          className="relative w-full bg-[#0b0e15] rounded-lg h-7 flex items-center px-2 cursor-pointer select-none overflow-hidden border border-[#272a32]"
        >
          <div className="absolute inset-0 flex justify-between px-2 items-center text-[#8e9379]/50 font-mono text-[10px] pointer-events-none">
            <span>00:00</span>
            <span>01:00</span>
            <span>02:00</span>
            <span>03:00</span>
            <span>04:00</span>
          </div>
          {/* Playhead Runner */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#c3f400] z-20 flex flex-col items-center pointer-events-none transition-all duration-75"
            style={{ left: `${playheadPct}%` }}
          >
            <div className="w-2.5 h-2 rounded-b bg-[#c3f400] -mt-0.5 shadow-md"></div>
          </div>
        </div>

        {/* Multi-Track Layers */}
        <div className="flex flex-col gap-1.5 mt-1">
          {layers.map((layer) => (
            <div
              key={layer.id}
              className="flex items-center bg-[#191b23] border border-[#272a32] rounded-lg p-1.5 gap-2"
            >
              <div className="flex items-center gap-1.5 w-28 shrink-0 font-mono text-xs text-white">
                <span className="truncate font-semibold">{layer.name}</span>
              </div>
              <div className="relative flex-1 h-5 bg-[#0b0e15] rounded overflow-hidden flex items-center px-1">
                <div
                  className={`h-3.5 rounded flex items-center justify-between px-2 text-[10px] font-mono font-bold shadow-sm ${
                    layer.colorType === 'orange'
                      ? 'bg-gradient-to-r from-[#ff5708] to-[#c3f400] text-[#10131a]'
                      : layer.colorType === 'volt'
                      ? 'bg-[#c3f400] text-[#10131a]'
                      : layer.colorType === 'cyan'
                      ? 'bg-[#00daf3] text-[#10131a]'
                      : 'bg-[#272a32] text-white'
                  }`}
                  style={{
                    marginLeft: `${layer.startPct}%`,
                    width: `${layer.widthPct}%`,
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10131a]"></span>
                  <span className="truncate">{layer.tag}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10131a]"></span>
                </div>
              </div>
              <button
                onClick={() => toggleLayerVisibility(layer.id)}
                className="text-[#8e9379] hover:text-white p-1"
                title="Toggle Visibility"
              >
                {layer.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-red-400" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Editable Property Inspector Panel */}
      <div className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-4 gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#ff5708]" />
            <h2 className="font-headline font-bold text-base uppercase tracking-wide text-white">
              PROPERTY INSPECTOR
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#191b23] text-[#c3f400] font-mono text-xs uppercase font-bold border border-[#272a32]">
            LAYER 1 SELECTED
          </span>
        </div>

        {/* Editable Display Text Field */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between font-mono text-xs text-[#8e9379]">
            <label htmlFor="display-text-input">BROADCAST DISPLAY TEXT</label>
            <span className="text-[#c3f400] font-bold">MAX 24 CHARS</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="display-text-input"
              type="text"
              maxLength={24}
              value={displayText}
              onChange={(e) => setDisplayText(e.target.value.toUpperCase())}
              className="flex-1 bg-[#0b0e15] border border-[#272a32] focus:border-[#c3f400] text-white font-headline text-xl uppercase px-3 py-2 rounded-lg outline-none tracking-wider font-black"
            />
            <button
              onClick={() => {
                soundEngine.playClick();
                setDisplayText('GET LOUD!');
              }}
              className="px-3 py-2 rounded-lg bg-[#191b23] text-white hover:bg-[#272a32] border border-[#272a32] font-mono text-xs uppercase font-bold transition-colors"
            >
              RESET
            </button>
          </div>
        </div>

        {/* Animation Style Presets */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs uppercase text-[#8e9379]">ANIMATION STYLE PRESETS</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {[
              { id: 'neon-glitch', label: 'NEON GLITCH', icon: Zap },
              { id: 'earthquake', label: 'EARTHQUAKE', icon: Flame },
              { id: 'fire-blast', label: 'FIRE BLAST', icon: Flame },
              { id: 'zoom-pulse', label: 'ZOOM PULSE', icon: Sparkles },
            ].map((style) => {
              const Icon = style.icon;
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedStyle(style.id as 'neon-glitch' | 'earthquake' | 'fire-blast' | 'zoom-pulse');
                    showNotification(`Preset Loaded: ${style.label}`);
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg font-bold uppercase transition-all ${
                    isSelected
                      ? 'bg-[#c3f400] text-[#10131a] shadow-[0_0_10px_rgba(195,244,0,0.5)]'
                      : 'bg-[#191b23] text-[#8e9379] hover:text-white border border-[#272a32]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{style.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Sliders */}
        <div className="flex flex-col gap-3 bg-[#191b23] border border-[#272a32] rounded-xl p-3">
          {/* Shake / Kinetic Force Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-white uppercase font-semibold">SHAKE / KINETIC FORCE</span>
              <span className="text-[#c3f400] font-bold">{shakeForce}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={shakeForce}
              onChange={(e) => setShakeForce(Number(e.target.value))}
              className="w-full accent-[#ff5708] cursor-pointer h-2 bg-[#0b0e15] rounded-lg"
            />
          </div>

          {/* Glow Intensity Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-white uppercase font-semibold">GLOW INTENSITY (VOLT NEON)</span>
              <span className="text-[#c3f400] font-bold">{glowIntensity}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(Number(e.target.value))}
              className="w-full accent-[#c3f400] cursor-pointer h-2 bg-[#0b0e15] rounded-lg"
            />
          </div>

          {/* Tempo BPM Sync Slider */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-white uppercase font-semibold">TEMPO / BPM SYNC</span>
              <span className="text-[#00daf3] font-bold">{bpm} BPM ({bpm > 140 ? 'EXTREME' : 'FAST'})</span>
            </div>
            <input
              type="range"
              min="80"
              max="180"
              value={bpm}
              onChange={(e) => setBpm(Number(e.target.value))}
              className="w-full accent-[#00daf3] cursor-pointer h-2 bg-[#0b0e15] rounded-lg"
            />
          </div>
        </div>

        {/* Color Scheme Palette Swatches */}
        <div className="flex flex-col gap-1.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[#8e9379]">
            <span className="uppercase">COLOR SCHEME PALETTE</span>
            <span className="text-white font-bold">
              {colorScheme === 'hawks'
                ? 'HAWKS GOLD & ELECTRIC VOLT'
                : colorScheme === 'crimson'
                ? 'CRIMSON BLAZE'
                : 'CYAN POLAR PULSE'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { id: 'hawks', label: 'Hawks Volt', color: '#c3f400' },
              { id: 'crimson', label: 'Crimson Fire', color: '#ff5708' },
              { id: 'cyan', label: 'Cyan Pulse', color: '#00daf3' },
            ].map((pal) => (
              <button
                key={pal.id}
                onClick={() => {
                  soundEngine.playClick();
                  setColorScheme(pal.id as 'hawks' | 'crimson' | 'cyan');
                }}
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg border transition-all ${
                  colorScheme === pal.id
                    ? 'bg-[#191b23] border-[#c3f400] text-white shadow-[0_0_8px_rgba(195,244,0,0.3)]'
                    : 'bg-[#191b23] border-[#272a32] text-[#8e9379] hover:text-white'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: pal.color }}></span>
                <span className="uppercase font-bold text-xs">{pal.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons: Save & Push to Deck */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => {
              soundEngine.playClick();
              showNotification(`Saved "${displayText}" to Local Preset Cache`);
            }}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#191b23] text-white hover:bg-[#272a32] border border-[#272a32] font-headline text-base uppercase tracking-wider font-bold transition-all active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            <span>SAVE ANIMATION</span>
          </button>

          <button
            onClick={handlePushLive}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-[#ff5708] text-white hover:bg-[#ff5708]/90 font-headline text-base uppercase tracking-wider font-black shadow-xl transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>PUSH TO LIVE DECK QUEUE</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastText && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#c3f400] text-[#10131a] px-5 py-2.5 rounded-full font-mono text-xs uppercase font-black shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastText}</span>
        </div>
      )}
    </div>
  );
};
