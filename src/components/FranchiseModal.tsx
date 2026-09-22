import React, { useState } from 'react';
import { Franchise } from '../types';
import { FRANCHISES } from '../data/mockData';
import { soundEngine } from '../audio';
import { X, Check, Shield, Plus, Sparkles } from 'lucide-react';

interface FranchiseModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFranchise: Franchise;
  onSelectFranchise: (franchise: Franchise) => void;
}

export const FranchiseModal: React.FC<FranchiseModalProps> = ({
  isOpen,
  onClose,
  activeFranchise,
  onSelectFranchise,
}) => {
  const [customName, setCustomName] = useState('');
  const [customShort, setCustomShort] = useState('');
  const [customPrimary, setCustomPrimary] = useState('#c3f400');
  const [customSecondary, setCustomSecondary] = useState('#ff5708');
  const [showCustomForm, setShowCustomForm] = useState(false);

  if (!isOpen) return null;

  const handleSelect = (fr: Franchise) => {
    soundEngine.playOrganCharge();
    onSelectFranchise(fr);
    onClose();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;
    const newFr: Franchise = {
      id: `custom-${Date.now()}`,
      name: customName,
      shortName: customShort || customName.slice(0, 6),
      subName: 'CUSTOM BROADCAST FRANCHISE',
      rackId: `RACK: CUST-${Math.floor(Math.random() * 90 + 10)}X`,
      primaryColor: customPrimary,
      secondaryColor: customSecondary,
      accentColor: '#00daf3',
      logoUrl: activeFranchise.logoUrl,
      crestUrl: activeFranchise.crestUrl,
      stadiumName: 'METRO ARENA',
      court: 'COURT 1',
    };
    handleSelect(newFr);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#10131a] border border-[#272a32] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2535] bg-[#0b0e15]">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#c3f400]" />
            <h3 className="font-headline text-lg uppercase tracking-wider text-white font-bold">
              Switch Franchise Identity
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

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto no-scrollbar font-body">
          <p className="text-xs text-[#8e9379]">
            Select a team to re-skin all arena displays, LED ribbons, audio stingers, and telemetry racks.
          </p>

          {/* Franchise Grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {FRANCHISES.map((fr) => {
              const isSelected = activeFranchise.id === fr.id;
              return (
                <button
                  key={fr.id}
                  onClick={() => handleSelect(fr)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-[#191b23] border-[#c3f400] shadow-[0_0_12px_rgba(195,244,0,0.3)]'
                      : 'bg-[#121620] border-[#1e2535] hover:border-[#272a32]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0b0e15] border border-[#272a32] flex items-center justify-center p-1 overflow-hidden">
                      <img src={fr.logoUrl} alt={fr.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="font-headline font-bold text-base text-white uppercase leading-tight">
                        {fr.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#8e9379]">{fr.rackId} • {fr.stadiumName}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: fr.primaryColor }}></span>
                      <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: fr.secondaryColor }}></span>
                    </div>
                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-[#c3f400] flex items-center justify-center text-[#10131a]">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Franchise Creation Toggle */}
          {!showCustomForm ? (
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full py-3 rounded-xl border border-dashed border-[#272a32] hover:border-[#c3f400] text-xs font-mono font-bold text-[#8e9379] hover:text-[#c3f400] flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE CUSTOM TEAM FRANCHISE</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCustom} className="p-4 rounded-xl bg-[#191b23] border border-[#272a32] space-y-3 font-mono text-xs">
              <span className="font-bold text-white uppercase block">Custom Team Config</span>
              <div className="space-y-1">
                <label className="text-[#8e9379] text-[10px] block">FRANCHISE FULL NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Seattle Supersonics / Reign"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#0b0e15] border border-[#272a32] px-3 py-2 rounded-lg text-white font-headline text-sm uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#8e9379] text-[10px] block">PRIMARY COLOR</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-white font-mono">{customPrimary}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[#8e9379] text-[10px] block">SECONDARY COLOR</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="color"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                      className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                    />
                    <span className="text-white font-mono">{customSecondary}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-lg bg-[#c3f400] text-[#10131a] font-headline font-bold text-sm uppercase"
                >
                  Save & Apply Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomForm(false)}
                  className="px-3 py-2 rounded-lg bg-[#272a32] text-white font-headline text-sm uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
