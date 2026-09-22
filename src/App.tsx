import React, { useState, useEffect, useCallback } from 'react';
import { TabId, Franchise, StadiumTemplate } from './types';
import { FRANCHISES, HOTKEYS } from './data/mockData';
import { soundEngine } from './audio';

// Components
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { LiveDeckView } from './components/LiveDeckView';
import { StudioView } from './components/StudioView';
import { CrowdView } from './components/CrowdView';
import { TemplatesView } from './components/TemplatesView';
import { OutputView } from './components/OutputView';
import { DirectorModal } from './components/DirectorModal';
import { FranchiseModal } from './components/FranchiseModal';
import { BlackoutModal } from './components/BlackoutModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabId>('live-deck');
  const [activeFranchise, setActiveFranchise] = useState<Franchise>(FRANCHISES[0]);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isDirectorModalOpen, setIsDirectorModalOpen] = useState(false);
  const [isFranchiseModalOpen, setIsFranchiseModalOpen] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Cross-view data sharing
  const [studioInitialPreset, setStudioInitialPreset] = useState<string | null>(null);
  const [studioAnimation, setStudioAnimation] = useState<{
    text: string;
    style: string;
    colorHex: string;
    aspect: string;
  } | null>(null);

  // Global Keyboard shortcuts listener (tactile broadcast switcher experience)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't trigger hotkeys if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'F1') {
        e.preventDefault();
        soundEngine.playOrganCharge();
      } else if (e.key === 'F2') {
        e.preventDefault();
        soundEngine.playAirHorn();
      } else if (e.key === 'F3') {
        e.preventDefault();
        soundEngine.playSiren();
      } else if (e.key === 'b' || e.key === 'B') {
        setIsBlackout((prev) => !prev);
      } else if (['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        const padIndex = parseInt(e.key, 10) - 1;
        const pad = HOTKEYS[padIndex];
        if (pad) {
          switch (pad.soundEffect) {
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
          }
        }
      }
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.isMuted = nextMuted;
  };

  const handleCustomizeInStudio = (presetTitle?: string) => {
    setStudioInitialPreset(presetTitle || null);
    setCurrentTab('studio');
  };

  const handlePushToLiveDeck = (data: {
    text: string;
    style: string;
    colorHex: string;
    aspect: string;
  }) => {
    setStudioAnimation(data);
    setCurrentTab('live-deck');
  };

  const handleArmCueFromTemplate = (template: StadiumTemplate) => {
    setStudioAnimation({
      text: template.headlineText,
      style: template.tagType,
      colorHex: template.colorHex,
      aspect: template.aspectRatio,
    });
  };

  return (
    <div className="min-h-screen bg-[#10131a] text-[#e1e2ec] flex flex-col font-body selection:bg-[#c3f400] selection:text-[#10131a]">
      {/* Universal Fixed Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activeFranchise={activeFranchise}
        isBlackout={isBlackout}
        onToggleBlackout={() => setIsBlackout(!isBlackout)}
        onOpenDirectorModal={() => setIsDirectorModalOpen(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main View Area with Top Spacing for Fixed Header */}
      <main className="flex-1 w-full pt-26 pb-20 md:pb-10 px-3 sm:px-6">
        {currentTab === 'live-deck' && (
          <LiveDeckView
            activeFranchise={activeFranchise}
            onNavigateToStudio={handleCustomizeInStudio}
            onNavigateToCrowd={() => setCurrentTab('crowd')}
            onTriggerBlackout={() => setIsBlackout(true)}
            studioAnimation={studioAnimation}
          />
        )}

        {currentTab === 'studio' && (
          <StudioView
            activeFranchise={activeFranchise}
            onPushToLiveDeck={handlePushToLiveDeck}
            initialPreset={studioInitialPreset}
          />
        )}

        {currentTab === 'crowd' && (
          <CrowdView
            activeFranchise={activeFranchise}
            onFireCelebration={() => setIsCelebrationActive(true)}
            onTriggerBlackout={() => setIsBlackout(true)}
          />
        )}

        {currentTab === 'templates' && (
          <TemplatesView
            activeFranchise={activeFranchise}
            onCustomizeInStudio={handleCustomizeInStudio}
            onArmCue={handleArmCueFromTemplate}
          />
        )}

        {currentTab === 'output' && (
          <OutputView
            activeFranchise={activeFranchise}
            onOpenFranchiseModal={() => setIsFranchiseModalOpen(true)}
            onTriggerBlackout={() => setIsBlackout(true)}
          />
        )}
      </main>

      {/* Bottom Navigation for Mobile / Tablet */}
      <BottomNav currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Director Console Modal (Sarah Jenkins) */}
      <DirectorModal
        isOpen={isDirectorModalOpen}
        onClose={() => setIsDirectorModalOpen(false)}
      />

      {/* Franchise Switcher Modal */}
      <FranchiseModal
        isOpen={isFranchiseModalOpen}
        onClose={() => setIsFranchiseModalOpen(false)}
        activeFranchise={activeFranchise}
        onSelectFranchise={setActiveFranchise}
      />

      {/* Emergency Blackout Full Screen Modal */}
      <BlackoutModal
        isBlackout={isBlackout}
        onRestore={() => setIsBlackout(false)}
      />

      {/* Strobe & Confetti Canvas Celebration */}
      <ConfettiCanvas
        isActive={isCelebrationActive}
        onComplete={() => setIsCelebrationActive(false)}
      />
    </div>
  );
}
