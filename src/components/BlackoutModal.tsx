import React from 'react';
import { soundEngine } from '../audio';
import { ShieldAlert, RefreshCcw } from 'lucide-react';

interface BlackoutModalProps {
  isBlackout: boolean;
  onRestore: () => void;
}

export const BlackoutModal: React.FC<BlackoutModalProps> = ({ isBlackout, onRestore }) => {
  if (!isBlackout) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none">
      <div className="flex flex-col items-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-full bg-red-950/80 border-2 border-red-600 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-2">
          <h2 className="font-headline text-3xl sm:text-4xl uppercase font-black tracking-widest text-red-500">
            EMERGENCY BLACKOUT ENGAGED
          </h2>
          <p className="font-mono text-xs text-[#8e9379] tracking-wider uppercase">
            ALL PHYSICAL RIG PROCESSORS & 4K OUTPUTS FORCED TO 0% LUMEN IDLE BLACK
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#121620] border border-red-900/60 font-mono text-xs text-[#ffb4ab] text-left w-full space-y-1">
          <div className="flex justify-between">
            <span>GENLOCK MASTER:</span>
            <span className="text-white font-bold">HALTED</span>
          </div>
          <div className="flex justify-between">
            <span>DANTE AUDIO FEED:</span>
            <span className="text-white font-bold">MUTED (-INF dB)</span>
          </div>
          <div className="flex justify-between">
            <span>FPGA PIPELINE:</span>
            <span className="text-red-400 font-bold">SAFETY INTERRUPT</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundEngine.playClick();
            onRestore();
          }}
          className="w-full py-4 rounded-xl bg-[#c3f400] text-[#10131a] font-headline text-lg uppercase tracking-wider font-black hover:brightness-110 active:scale-95 transition-all shadow-[0_0_24px_rgba(195,244,0,0.5)] flex items-center justify-center gap-2"
        >
          <RefreshCcw className="w-5 h-5" />
          <span>RESTORE NORMAL BROADCAST</span>
        </button>
      </div>
    </div>
  );
};
