import React, { useState } from 'react';
import { soundEngine } from '../audio';
import { X, Mic, MicOff, Radio, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DirectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DirectorModal: React.FC<DirectorModalProps> = ({ isOpen, onClose }) => {
  const [talkbackActive, setTalkbackActive] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState('CH 1 - ARENA DIRECTOR');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-[#10131a] border border-[#272a32] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2535] bg-[#0b0e15]">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#c3f400] animate-pulse" />
            <h3 className="font-headline text-lg uppercase tracking-wider text-white font-bold">
              Stadium Production Director Console
            </h3>
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-[#8e9379] hover:text-white hover:bg-[#1d1f27] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar font-body">
          {/* Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-xl bg-[#191b23] border border-[#272a32]">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 border-[#c3f400]/80 shadow-md">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"
                alt="Sarah Jenkins"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1 right-1 px-1 py-0.2 rounded bg-black/80 text-[9px] font-mono text-[#c3f400] font-bold">
                DIR
              </span>
            </div>
            <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-headline text-xl text-white uppercase font-black tracking-wide">
                  Sarah Jenkins
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-[#c3f400] bg-[#1d1f27] px-2 py-0.5 rounded-full border border-[#c3f400]/40">
                  <ShieldCheck className="w-3 h-3" />
                  LEVEL 4 CLEARANCE
                </span>
              </div>
              <span className="text-xs text-[#8e9379] mt-0.5">
                Senior Arena Video Production Director • Atlanta Hawks / Metro Arena
              </span>
              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-[#272a32] text-xs font-mono">
                <div>
                  <span className="text-[#8e9379] block">RUNDOWN SYNC:</span>
                  <span className="text-white font-bold">Q4 CLUTCH - TIMEOUT 2</span>
                </div>
                <div>
                  <span className="text-[#8e9379] block">INTERCOM LATENCY:</span>
                  <span className="text-[#00daf3] font-bold">0.8 ms (DANTE IP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Comms & Talkback Controller */}
          <div className="p-4 rounded-xl bg-[#191b23] border border-[#272a32] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-[#c3f400]" />
                COMMUNICATION MATRIX (INTERCOM)
              </span>
              <span className="text-[10px] font-mono text-[#c3f400] bg-[#10131a] px-2 py-0.5 rounded">
                HEADSET ACTIVE
              </span>
            </div>

            {/* Channel Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'CH 1 - ARENA DIRECTOR',
                'CH 2 - CAMERAS 1-6',
                'CH 3 - DJ & SOUND BOOTH',
                'CH 4 - PYRO & LIGHTING',
                'CH 5 - MASCOT & HYPE SQUAD',
                'CH 6 - ALL STATIONS CALL',
              ].map((ch) => (
                <button
                  key={ch}
                  onClick={() => {
                    soundEngine.playClick();
                    setSelectedChannel(ch);
                  }}
                  className={`p-2 rounded-lg font-mono text-[11px] text-left transition-all ${
                    selectedChannel === ch
                      ? 'bg-[#c3f400] text-[#10131a] font-bold shadow-[0_0_10px_rgba(195,244,0,0.5)]'
                      : 'bg-[#10131a] text-[#8e9379] hover:text-white hover:bg-[#272a32]'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>

            {/* Talkback Push-to-Talk button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setTalkbackActive(!talkbackActive);
                  soundEngine.playClick();
                }}
                className={`w-full py-3 rounded-xl font-headline text-base uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 transition-all ${
                  talkbackActive
                    ? 'bg-red-600 text-white animate-pulse shadow-[0_0_18px_rgba(239,68,68,0.7)]'
                    : 'bg-[#272a32] text-white hover:bg-[#32353d]'
                }`}
              >
                {talkbackActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5 text-gray-400" />}
                <span>
                  {talkbackActive
                    ? `LIVE ON AIR: BROADCASTING TO ${selectedChannel}`
                    : `PRESS FOR PUSH-TO-TALK (${selectedChannel})`}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Production Directives */}
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-[#8e9379] uppercase tracking-wider">
              OPERATIONAL OVERRIDES
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  soundEngine.playAirHorn();
                  onClose();
                }}
                className="p-3 rounded-lg bg-[#191b23] border border-[#272a32] hover:border-[#c3f400] text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#c3f400]" />
                  <span className="font-headline font-bold text-sm text-white uppercase">
                    Armed Cue Check: Hawks Stinger
                  </span>
                </div>
                <span className="text-[11px] text-[#8e9379] block mt-1">
                  Confirms pyro and ribbon synchronization for final seconds
                </span>
              </button>

              <button
                onClick={() => {
                  soundEngine.playOrganCharge();
                  onClose();
                }}
                className="p-3 rounded-lg bg-[#191b23] border border-[#272a32] hover:border-[#ff5708] text-left transition-all"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#ff5708]" />
                  <span className="font-headline font-bold text-sm text-white uppercase">
                    Force 110dB Noise Meter
                  </span>
                </div>
                <span className="text-[11px] text-[#8e9379] block mt-1">
                  Immediately interrupts active loop with crowd noise decibel battle
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1e2535] bg-[#0b0e15] flex items-center justify-between">
          <span className="font-mono text-xs text-[#8e9379]">
            CONSOLE ID: <span className="text-white font-bold">ATL-DIR-CONSOLE-01</span>
          </span>
          <button
            onClick={() => {
              soundEngine.playClick();
              onClose();
            }}
            className="px-4 py-1.5 rounded-lg bg-[#1d1f27] text-white hover:bg-[#272a32] font-headline text-xs uppercase tracking-wider font-bold transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
