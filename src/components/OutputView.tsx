import React, { useState } from 'react';
import { Franchise, DisplayZone } from '../types';
import { DISPLAY_ZONES, AUDIO_STINGERS } from '../data/mockData';
import { soundEngine } from '../audio';
import {
  Palette,
  UploadCloud,
  Volume2,
  Tv,
  Network,
  CheckCircle2,
  Play,
  RotateCw,
  Power,
  ShieldAlert,
} from 'lucide-react';

interface OutputViewProps {
  activeFranchise: Franchise;
  onOpenFranchiseModal: () => void;
  onTriggerBlackout: () => void;
}

export const OutputView: React.FC<OutputViewProps> = ({
  activeFranchise,
  onOpenFranchiseModal,
  onTriggerBlackout,
}) => {
  const [protocol, setProtocol] = useState<'ndi' | 'hdmi' | 'rtmp'>('ndi');
  const [isLowLatency, setIsLowLatency] = useState(true);
  const [zones, setZones] = useState<DisplayZone[]>(DISPLAY_ZONES);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleStingerClick = (stingerKey: 'charge' | 'horn' | 'siren', name: string) => {
    if (stingerKey === 'charge') soundEngine.playOrganCharge();
    else if (stingerKey === 'horn') soundEngine.playAirHorn();
    else soundEngine.playSiren();

    showToast(`CUE FIRED // ${name.toUpperCase()}`);
  };

  const toggleZoneActivation = (zoneId: string) => {
    soundEngine.playClick();
    setZones((prev) =>
      prev.map((z) => {
        if (z.id === zoneId) {
          const nextActive = !z.active;
          showToast(`${z.name} switched to ${nextActive ? 'ONLINE' : 'STANDBY'}`);
          return {
            ...z,
            active: nextActive,
            status: nextActive ? 'ONLINE' : 'STANDBY',
          };
        }
        return z;
      })
    );
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto pb-12 animate-fadeIn font-body">
      {/* 1. Operational Context Card: Active Franchise & Status HUD */}
      <section className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between gap-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-ping"></span>
            <span className="uppercase tracking-widest text-[#c3f400] font-bold">
              ENGINE MATRIX // SYNC CONFIRMED
            </span>
          </div>
          <span className="text-[#8e9379] bg-[#191b23] border border-[#272a32] px-2 py-0.5 rounded font-mono">
            {activeFranchise.rackId}
          </span>
        </div>

        {/* Active Profile Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#191b23] border border-[#272a32] rounded-xl p-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-xl bg-[#0b0e15] border border-[#32353d] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
              <img
                src={activeFranchise.logoUrl}
                alt={activeFranchise.name}
                className="w-full h-full object-cover"
              />
              <span className="material-symbols-outlined text-[#c3f400] absolute bottom-1 right-1 text-[16px] drop-shadow-md">
                verified
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-mono text-[10px] text-[#8e9379] uppercase tracking-wider">
                {activeFranchise.subName}
              </span>
              <span className="font-headline text-lg sm:text-xl text-white uppercase font-black truncate tracking-wide">
                {activeFranchise.name}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center font-headline text-sm uppercase">
            <button
              onClick={() => {
                soundEngine.playClick();
                onOpenFranchiseModal();
              }}
              className="flex items-center gap-1.5 bg-[#272a32] hover:bg-[#32353d] px-3 py-2 rounded-lg text-white font-bold transition-all active:scale-95"
            >
              <RotateCw className="w-4 h-4 text-[#c3f400]" />
              <span>Switch Team</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playOrganCharge();
                showToast(`DEPLOYED: ${activeFranchise.name} active across all video nodes`);
              }}
              className="flex items-center gap-1.5 bg-[#c3f400] text-[#10131a] hover:brightness-110 px-4 py-2 rounded-lg font-black transition-all active:scale-95 shadow-md"
            >
              <Power className="w-4 h-4" />
              <span>Deploy</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Team Brand Assets Section */}
      <section className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#c3f400]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wide text-white">
              Team Brand Assets
            </span>
          </div>
          <span className="text-[#8e9379]">LUMEN CALIBRATED</span>
        </div>

        {/* Color Palette Swatches */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Primary Swatch */}
          <div className="bg-[#191b23] border border-[#272a32] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8e9379] uppercase">
              <span>PRIMARY ACCENT // 84% BOWL FILL</span>
              <span className="text-[#c3f400] font-bold">REC.2020 ACTIVE</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-11 h-11 rounded-lg shadow-lg flex items-center justify-center shrink-0 border border-white/20"
                style={{ backgroundColor: activeFranchise.primaryColor }}
              >
                <span className="material-symbols-outlined text-[#10131a] text-[20px]">bolt</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-lg text-white font-bold leading-none">
                  Volt Glow
                </span>
                <span className="font-mono text-xs text-[#c3f400] font-bold mt-1">
                  {activeFranchise.primaryColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Swatch */}
          <div className="bg-[#191b23] border border-[#272a32] rounded-xl p-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#8e9379] uppercase">
              <span>SECONDARY ACCENT // STINGER BURST</span>
              <span className="text-[#ff5708] font-bold">LED SATURATED</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div
                className="w-11 h-11 rounded-lg shadow-lg flex items-center justify-center shrink-0 border border-white/20"
                style={{ backgroundColor: activeFranchise.secondaryColor }}
              >
                <span className="material-symbols-outlined text-white text-[20px]">local_fire_department</span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-headline text-lg text-white font-bold leading-none">
                  Inferno Orange
                </span>
                <span className="font-mono text-xs text-[#ff5708] font-bold mt-1">
                  {activeFranchise.secondaryColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mascot Vector Slot */}
          <div className="flex flex-col bg-[#191b23] border border-[#272a32] rounded-xl p-3 gap-2">
            <div className="flex items-center justify-between font-mono text-xs text-[#8e9379] uppercase">
              <span>VECTOR LOGO / BADGE</span>
              <span className="text-[#00daf3] font-bold">SVG (SCALABLE)</span>
            </div>
            <div className="flex items-center gap-3 bg-[#10131a] p-2 rounded-lg border border-[#272a32]">
              <div className="w-12 h-12 rounded bg-[#0b0e15] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                <img
                  src={activeFranchise.crestUrl}
                  alt="Badge"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="font-mono text-xs text-white truncate font-bold">
                  {activeFranchise.shortName.toLowerCase()}_primary_2025_hdr.svg
                </span>
                <span className="font-mono text-[10px] text-[#8e9379]">3840x3840 • 4-Ch Alpha</span>
                <div className="flex items-center gap-2 mt-1.5 font-headline text-xs uppercase font-bold">
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      showToast('VECTOR BADGE RE-MAPPED TO ALL RACK DESTINATIONS');
                    }}
                    className="bg-[#272a32] hover:bg-[#32353d] text-white px-2 py-0.5 rounded"
                  >
                    Re-Map
                  </button>
                  <button
                    onClick={() => {
                      soundEngine.playClick();
                      showToast('PREVIEWING VECTOR BADGE ON CENTERHUNG 4K');
                    }}
                    className="bg-[#272a32] hover:bg-[#32353d] text-[#00daf3] px-2 py-0.5 rounded"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Holo Slot */}
          <div className="flex flex-col bg-[#191b23] border border-[#272a32] rounded-xl p-3 gap-2 justify-between">
            <div className="flex items-center justify-between font-mono text-xs text-[#8e9379] uppercase">
              <span>3D HOLO / COURT PROJECTION</span>
              <span className="text-[#c3f400] font-bold">READY</span>
            </div>
            <div
              onClick={() => {
                soundEngine.playClick();
                showToast('SECONDARY GLTF LUT FILE LOADED & TEXTURED');
              }}
              className="flex items-center justify-center flex-col py-4 bg-[#10131a] rounded-lg border border-dashed border-[#272a32] hover:border-[#c3f400] text-center cursor-pointer transition-colors"
            >
              <UploadCloud className="w-6 h-6 text-[#c3f400]" />
              <span className="font-headline text-sm text-white font-bold uppercase mt-1">
                Drop Secondary Asset or LUT
              </span>
              <span className="font-mono text-[10px] text-[#8e9379]">PNG, SVG, GLTF up to 250MB</span>
            </div>
          </div>
        </div>

        {/* Audio Stinger Library & Arena Horn Sync */}
        <div className="flex flex-col bg-[#191b23] border border-[#272a32] rounded-xl p-3.5 gap-2.5">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-[#00daf3]" />
              <span className="font-headline font-bold text-sm uppercase tracking-wider text-white">
                Arena Horn & Stinger Rig Sync
              </span>
            </div>
            <span className="text-[#8e9379]">DANTE AUD-NET: CH 01-08</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {AUDIO_STINGERS.map((stinger) => (
              <button
                key={stinger.id}
                onClick={() => handleStingerClick(stinger.soundKey, stinger.name)}
                className="bg-[#121620] hover:bg-[#1d1f27] border border-[#272a32] hover:border-white/30 p-3 rounded-lg flex flex-col justify-between text-left transition-all active:scale-95 group"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-headline text-base text-white uppercase font-bold leading-tight">
                    {stinger.name}
                  </span>
                  <Play
                    className="w-4 h-4 group-hover:scale-110 transition-transform fill-current"
                    style={{ color: stinger.color }}
                  />
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-[#8e9379] mt-2">
                  <span>{stinger.keyLabel}</span>
                  <span style={{ color: stinger.color }} className="font-bold">
                    {stinger.duration} • {stinger.detail}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Stadium LED Matrix Topology */}
      <section className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-[#c3f400]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wide text-white">
              Stadium LED Matrix Topology
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#8e9379]">CANVAS RESOLUTION:</span>
            <span className="text-[#c3f400] font-bold">11520 x 2160</span>
          </div>
        </div>

        {/* Stadium Visual Diagram */}
        <div className="relative w-full bg-[#0b0e15] border border-[#272a32] rounded-xl p-6 flex flex-col items-center justify-center overflow-hidden min-h-[200px] select-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1f27_1px,transparent_1px),linear-gradient(to_bottom,#1d1f27_1px,transparent_1px)] bg-[size:24px_24px] opacity-35"></div>

          {/* 360 Ribbon Oval Simulation */}
          <div className="relative z-10 w-full max-w-md h-40 rounded-full bg-[#191b23]/70 border-2 border-[#c3f400]/40 p-3 flex items-center justify-center shadow-inner">
            <div className="absolute inset-x-6 top-3 flex justify-between px-2 font-mono text-[10px] text-[#c3f400] font-bold">
              <span>ZONE B: 360° UPPER RIBBON LED</span>
              <span>120 FPS</span>
            </div>

            {/* Centerhung 4K Main Node */}
            <div
              onClick={() => {
                soundEngine.playClick();
                showToast('ZONE A: TEST PATTERN CALIBRATION FIRED');
              }}
              className="z-20 w-40 h-22 rounded-xl bg-[#272a32] border border-[#c3f400] hover:bg-[#32353d] flex flex-col items-center justify-center p-2 cursor-pointer shadow-2xl transition-transform active:scale-95 text-center"
            >
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#c3f400] animate-pulse"></span>
                <span className="font-headline text-sm text-white font-bold uppercase">
                  ZONE A: 4K MAIN
                </span>
              </div>
              <span className="font-mono text-xs text-[#00daf3] mt-0.5">3840 x 2160</span>
              <span className="font-mono text-[9px] text-[#8e9379]">GENLOCK: 59.94p</span>
            </div>

            {/* Courtside Table */}
            <div className="absolute bottom-3 inset-x-12 h-5 rounded bg-[#10131a] border border-[#272a32] flex items-center justify-center gap-1 font-mono text-[9px] text-[#c4c9ac] font-bold uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
              <span>ZONE C: COURTSIDE SCORERS</span>
            </div>
          </div>
        </div>

        {/* LED Zones List */}
        <div className="flex flex-col gap-2">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border gap-2 transition-all ${
                zone.active
                  ? 'bg-[#191b23] border-[#272a32]'
                  : 'bg-[#191b23]/50 border-[#1e2535] opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                    zone.active ? 'bg-[#c3f400] shadow-[0_0_8px_rgba(195,244,0,0.8)]' : 'bg-[#8e9379]'
                  }`}
                ></span>
                <div className="flex flex-col">
                  <span className="font-headline text-base text-white uppercase font-bold leading-tight">
                    {zone.name}
                  </span>
                  <span className="font-mono text-[11px] text-[#8e9379]">
                    {zone.viewport} • {zone.framerate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center font-mono text-xs">
                <span
                  className={`px-2 py-0.5 rounded font-bold ${
                    zone.active ? 'bg-[#0b0e15] text-[#c3f400]' : 'bg-[#0b0e15] text-[#8e9379]'
                  }`}
                >
                  {zone.status}
                </span>
                <button
                  onClick={() => toggleZoneActivation(zone.id)}
                  className="bg-[#272a32] hover:bg-[#32353d] text-white px-3 py-1 rounded font-headline text-xs uppercase font-bold active:scale-95 transition-all"
                >
                  {zone.active ? 'Config' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Hardware Output & Transmission */}
      <section className="flex flex-col bg-[#121620] border border-[#1e2535] rounded-xl p-4 shadow-md space-y-4">
        <div className="flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#00daf3]" />
            <span className="font-headline font-bold text-sm uppercase tracking-wide text-white">
              Hardware Output & Transmission
            </span>
          </div>
          <span className="text-[#c3f400] font-bold">FPGA PIPELINE ARMED</span>
        </div>

        {/* Routing Protocol Segmented Switch */}
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-[#8e9379] uppercase">ROUTING PROTOCOL SELECTOR</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-[#191b23] p-1.5 rounded-xl border border-[#272a32] font-headline text-sm uppercase font-bold">
            {[
              { id: 'ndi', label: 'NDI® 5 DIRECT STREAM', icon: 'sensors' },
              { id: 'hdmi', label: 'HDMI / DISPLAYPORT PRO', icon: 'settings_input_hdmi' },
              { id: 'rtmp', label: 'RTMP / SRT CLOUD', icon: 'cloud_sync' },
            ].map((p) => {
              const isSelected = protocol === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setProtocol(p.id as 'ndi' | 'hdmi' | 'rtmp');
                    showToast(`OUTPUT PROTOCOL COMMITTED: ${p.label}`);
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-[#272a32] text-white shadow-md border border-[#c3f400]/40'
                      : 'text-[#8e9379] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px] text-[#c3f400]">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Diagnostics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <span className="text-[#8e9379] text-[10px]">BITRATE OUT</span>
            <span className="text-white font-bold text-sm mt-0.5">142.8 Mbps</span>
          </div>
          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <span className="text-[#8e9379] text-[10px]">FRAME DROP</span>
            <span className="text-[#c3f400] font-bold text-sm mt-0.5">0.00% (0 pkts)</span>
          </div>
          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <span className="text-[#8e9379] text-[10px]">RENDER JITTER</span>
            <span className="text-white font-bold text-sm mt-0.5">0.34 ms</span>
          </div>
          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <span className="text-[#8e9379] text-[10px]">CLOCK MASTER</span>
            <span className="text-[#00daf3] font-bold text-sm mt-0.5">PTP IEEE 1588</span>
          </div>
        </div>

        {/* Latency & Failsafe Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          {/* Low Latency Arena Sync Toggle */}
          <div className="flex items-center justify-between flex-1 bg-[#191b23] border border-[#272a32] p-3 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#272a32] flex items-center justify-center text-[#c3f400]">
                <span className="material-symbols-outlined text-[20px]">speed</span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline text-base text-white uppercase font-bold leading-tight">
                  Ultra-Low 4ms Arena Sync
                </span>
                <span className="font-mono text-[10px] text-[#8e9379]">
                  Zero frame buffer for rim cameras & shot clock sync
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setIsLowLatency(!isLowLatency);
                showToast(isLowLatency ? 'LATENCY BUFFER EXTENDED (STANDARD 16MS)' : 'ARENA LOW-LATENCY 4MS: ENGAGED');
              }}
              className={`w-12 h-6 rounded-full transition-colors p-0.5 flex items-center cursor-pointer shrink-0 ${
                isLowLatency ? 'bg-[#c3f400] justify-end' : 'bg-[#272a32] justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-[#10131a] shadow-md"></div>
            </button>
          </div>

          {/* Emergency Blackout Button */}
          <button
            onClick={onTriggerBlackout}
            className="bg-[#93000a] text-white hover:bg-red-700 px-5 py-3 rounded-xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shrink-0 border border-red-500/40"
          >
            <ShieldAlert className="w-5 h-5 text-red-200" />
            <div className="flex flex-col text-left leading-none">
              <span className="font-headline text-base uppercase font-black tracking-wider">
                Instant Blackout
              </span>
              <span className="font-mono text-[10px] text-red-200 mt-0.5">PANEL SAFETY OVERRIDE</span>
            </div>
          </button>
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
