import React, { useState, useEffect } from 'react';
import { Franchise } from '../types';
import { soundEngine } from '../audio';
import {
  Megaphone,
  Vote,
  Mic,
  Volume2,
  QrCode,
  RefreshCw,
  Clock,
  PartyPopper,
  AlertOctagon,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface CrowdViewProps {
  activeFranchise: Franchise;
  onFireCelebration: () => void;
  onTriggerBlackout: () => void;
}

export const CrowdView: React.FC<CrowdViewProps> = ({
  activeFranchise,
  onFireCelebration,
  onTriggerBlackout,
}) => {
  const [activeMode, setActiveMode] = useState<'db' | 'poll'>('db');
  const [northDb, setNorthDb] = useState(115.0);
  const [southDb, setSouthDb] = useState(112.9);
  const [gainThreshold, setGainThreshold] = useState(65);
  const [damping, setDamping] = useState<'low' | 'med' | 'turbo'>('med');
  const [sirenArmed, setSirenArmed] = useState(true);

  // Poll state
  const [pollA, setPollA] = useState(12525);
  const [pollB, setPollB] = useState(5895);
  const [userVoted, setUserVoted] = useState<'A' | 'B' | null>(null);
  const [qrOnRibbon, setQrOnRibbon] = useState(false);

  // Timeout Countdown
  const [secondsLeft, setSecondsLeft] = useState(34);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Fluctuating real-time crowd dB noise
  useEffect(() => {
    const interval = setInterval(() => {
      const nDelta = (Math.random() * 2.2 - 0.9);
      const sDelta = (Math.random() * 2.4 - 1.1);
      setNorthDb((prev) => Number(Math.max(104, Math.min(122, prev + nDelta * 0.4)).toFixed(1)));
      setSouthDb((prev) => Number(Math.max(104, Math.min(121, prev + sDelta * 0.4)).toFixed(1)));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 45));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalVotes = pollA + pollB;
  const pctA = Math.round((pollA / totalVotes) * 100);
  const pctB = 100 - pctA;

  const totalDb = northDb + southDb;
  const northLead = (northDb - southDb).toFixed(1);
  const northBarPct = Math.round((northDb / totalDb) * 100);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2400);
  };

  const handleVote = (option: 'A' | 'B') => {
    soundEngine.playClick();
    if (option === 'A') {
      setPollA((p) => p + 1);
      setUserVoted('A');
    } else {
      setPollB((p) => p + 1);
      setUserVoted('B');
    }
    showToast(`VOTE RECORDED: ${option === 'A' ? 'TRAE YOUNG #11' : 'DEJOUNTE MURRAY #5'}`);
  };

  const handleCelebration = () => {
    soundEngine.playAirHorn();
    soundEngine.playCrowdRoar();
    onFireCelebration();
    showToast('CELEBRATION FX ENGAGED: NORTH STANDS CONFIRMED!');
  };

  return (
    <div className="flex flex-col w-full space-y-4 max-w-7xl mx-auto pb-12 animate-fadeIn font-body">
      {/* 1. Live Arena Telemetry Sub-bar */}
      <div className="flex flex-col gap-2 bg-[#121620] border border-[#1e2535] p-3 rounded-xl shadow-md">
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar font-mono text-xs">
          <div className="flex items-center gap-1.5 shrink-0 bg-[#191b23] border border-[#272a32] px-2.5 py-1 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
            <span className="text-[#c3f400] uppercase font-bold tracking-wider text-[11px]">
              AUDIO RIG: DANTE CH 01-08
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-[#191b23] border border-[#272a32] px-2.5 py-1 rounded text-[11px]">
            <Volume2 className="w-3.5 h-3.5 text-[#00daf3]" />
            <span className="text-[#8e9379]">CALIB:</span>
            <span className="text-white font-bold">130 dB SPL</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 bg-[#191b23] border border-[#272a32] px-2.5 py-1 rounded text-[11px]">
            <span className="text-[#8e9379]">LIVE QR:</span>
            <span className="text-[#ff5708] font-bold">{totalVotes.toLocaleString()} FANS</span>
          </div>
        </div>

        {/* Mode Selector Tactile Switch */}
        <div className="grid grid-cols-2 gap-2 bg-[#0b0e15] p-1 rounded-lg border border-[#272a32]">
          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveMode('db');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded font-headline text-sm uppercase tracking-wide transition-all ${
              activeMode === 'db'
                ? 'bg-[#1d1f27] text-white font-bold border border-[#c3f400]/40 shadow-sm'
                : 'text-[#8e9379] hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4 text-[#c3f400]" />
            <span>Decibel Battle (SEC vs SEC)</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setActiveMode('poll');
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded font-headline text-sm uppercase tracking-wide transition-all ${
              activeMode === 'poll'
                ? 'bg-[#1d1f27] text-white font-bold border border-[#ff5708]/40 shadow-sm'
                : 'text-[#8e9379] hover:text-white'
            }`}
          >
            <Vote className="w-4 h-4 text-[#ff5708]" />
            <span>Live Fan Poll Takeover</span>
          </button>
        </div>
      </div>

      {/* 2. Jumbotron / Ribbon Live Simulator Section */}
      <div className="relative flex flex-col bg-[#0b0e15] border border-[#1e2535] rounded-xl overflow-hidden shadow-2xl">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#121620] border-b border-[#1e2535] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ff5708] animate-ping"></span>
            <span className="font-bold text-[#ff5708] uppercase tracking-wider">PGM ON AIR</span>
            <span className="text-[#8e9379] hidden sm:inline">|</span>
            <span className="text-[#00daf3] hidden sm:inline">CENTERHUNG 360° RIBBON</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#c3f400]">
            <span>LATENCY: 12ms</span>
          </div>
        </div>

        {/* Dynamic Display Area */}
        <div className="relative p-4 sm:p-6 bg-gradient-to-b from-[#121620] via-[#0b0e15] to-[#121620] overflow-hidden select-none">
          {/* Ambient stadium backdrop */}
          <div
            className="absolute inset-0 opacity-15 mix-blend-screen bg-cover bg-center pointer-events-none"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBqtsbXJTK-ZsqInC859I9_5iEtCM0QK2LsnuZ66ghnGA7VlbS4HsCJbE8f0c56sgD1ndhlHJE-Amg4qMI45qH47FgwBxnlf5D3KV9lJlXkY9O4H5G1X_g279ZgnjXKXogr6Uqsyng0HiCJtNWoFCtV4VTs8Cgr9whZrwZLrBo96EE9zgQvWExjME8Z8QyDfLLqefYIGowzIFZugnlVuJVGwuKuVI5jKk2T8nhiV7YEnUrkxktLjZnj')",
            }}
          ></div>

          {activeMode === 'db' ? (
            /* Mode A: Decibel Battle */
            <div className="relative z-10 flex flex-col space-y-4">
              {/* Marquee Title */}
              <div className="flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#191b23] border border-[#272a32] text-[#ff5708] font-mono text-[11px] font-bold uppercase mb-1">
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>ROUND 3 • TIMEOUT CLASH</span>
                </div>
                <h2 className="font-headline text-2xl sm:text-4xl uppercase tracking-wider text-white font-black leading-tight drop-shadow-md">
                  NORTH STANDS <span className="text-[#00daf3]">VS</span> SOUTH STANDS
                </h2>
                <span className="font-mono text-xs text-[#c3f400] tracking-widest uppercase">
                  Decibel Decimation Showdown
                </span>
              </div>

              {/* Competitors Split Card */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6 items-center">
                {/* Left Competitor: North End */}
                <div className="flex flex-col bg-[#191b23]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#c3f400]/40 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-headline text-lg sm:text-2xl text-white font-black leading-none uppercase">
                      NORTH
                    </span>
                    <span className="font-mono text-[11px] text-[#8e9379]">SEC 100-118</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="font-headline text-3xl sm:text-5xl font-black text-[#c3f400] tracking-tight drop-shadow-[0_0_12px_rgba(195,244,0,0.5)]">
                      {northDb}
                    </span>
                    <span className="font-mono text-xs text-white font-bold">dB SPL</span>
                  </div>
                  {/* Spectrum equalizers */}
                  <div className="flex items-end gap-1 h-8 w-full pt-1">
                    {[100, 85, 100, 70, 100, 75, 90, 80].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#c3f400] rounded-t-sm animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 90}ms` }}
                      ></div>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[#c3f400] uppercase tracking-wider mt-2 text-center font-bold">
                    ZONE PEAK DETECTED
                  </span>
                </div>

                {/* Right Competitor: South End */}
                <div className="flex flex-col bg-[#191b23]/90 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-[#ff5708]/40 shadow-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-headline text-lg sm:text-2xl text-white font-black leading-none uppercase">
                      SOUTH
                    </span>
                    <span className="font-mono text-[11px] text-[#8e9379]">SEC 119-136</span>
                  </div>
                  <div className="flex items-baseline gap-1 my-2">
                    <span className="font-headline text-3xl sm:text-5xl font-black text-[#ff5708] tracking-tight drop-shadow-[0_0_12px_rgba(255,87,8,0.5)]">
                      {southDb}
                    </span>
                    <span className="font-mono text-xs text-white font-bold">dB SPL</span>
                  </div>
                  {/* Equalizers */}
                  <div className="flex items-end gap-1 h-8 w-full pt-1">
                    {[65, 80, 75, 100, 65, 85, 60, 90].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-[#ff5708] rounded-t-sm animate-pulse"
                        style={{ height: `${h}%`, animationDelay: `${i * 110}ms` }}
                      ></div>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] text-[#ff5708] uppercase tracking-wider mt-2 text-center font-bold">
                    INFERNO LEVEL RISING
                  </span>
                </div>
              </div>

              {/* Tug of War Decibel Tension Bar */}
              <div className="flex flex-col gap-1.5 pt-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-[#c3f400] uppercase">
                    ◄ NORTH {Number(northLead) >= 0 ? `+${northLead}` : northLead} dB LEAD
                  </span>
                  <span className="text-[#8e9379] font-mono uppercase text-[11px]">TARGET: 120.0 dB</span>
                  <span className="font-bold text-[#ff5708] uppercase">SOUTH +0.0 ►</span>
                </div>
                <div className="relative w-full h-3.5 bg-[#191b23] rounded-full overflow-hidden flex border border-[#272a32]">
                  <div
                    className="h-full bg-[#c3f400] transition-all duration-300 shadow-[0_0_8px_rgba(195,244,0,0.8)]"
                    style={{ width: `${northBarPct}%` }}
                  ></div>
                  <div
                    className="h-full bg-[#ff5708] transition-all duration-300 shadow-[0_0_8px_rgba(255,87,8,0.8)]"
                    style={{ width: `${100 - northBarPct}%` }}
                  ></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 -ml-0.5 bg-white z-20"></div>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] text-[#8e9379] pt-0.5">
                  <span>100 dB SPL</span>
                  <span className="text-[#00daf3] font-bold bg-[#191b23] px-2 py-0.5 rounded border border-[#272a32]">
                    DYNAMIC MULTI-SPECTRUM LINK
                  </span>
                  <span>125 dB SPL</span>
                </div>
              </div>
            </div>
          ) : (
            /* Mode B: Live Fan Poll */
            <div className="relative z-10 flex flex-col space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#8e9379] uppercase">Q4 CLUTCH VOTING OVERLAY</span>
                <span className="text-[#00daf3] font-bold">{totalVotes.toLocaleString()} RESPONSES</span>
              </div>

              <h2 className="font-headline text-xl sm:text-3xl uppercase tracking-wide text-white text-center font-bold">
                "WHO TAKES THE 4TH QUARTER GAME-WINNING SHOT?"
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* Option A */}
                <button
                  onClick={() => handleVote('A')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    userVoted === 'A'
                      ? 'bg-[#c3f400]/20 border-[#c3f400] shadow-[0_0_16px_rgba(195,244,0,0.4)]'
                      : 'bg-[#191b23] border-[#272a32] hover:border-[#c3f400]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-lg sm:text-xl text-white font-bold uppercase">
                      TRAE YOUNG #11
                    </span>
                    <span className="font-mono text-lg font-bold text-[#c3f400]">{pctA}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0b0e15] rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#c3f400] rounded-full transition-all duration-300" style={{ width: `${pctA}%` }}></div>
                  </div>
                  <span className="font-mono text-[11px] text-[#8e9379] mt-2 block">
                    {pollA.toLocaleString()} votes {userVoted === 'A' && '• (YOUR VOTE)'}
                  </span>
                </button>

                {/* Option B */}
                <button
                  onClick={() => handleVote('B')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    userVoted === 'B'
                      ? 'bg-[#ff5708]/20 border-[#ff5708] shadow-[0_0_16px_rgba(255,87,8,0.4)]'
                      : 'bg-[#191b23] border-[#272a32] hover:border-[#ff5708]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-headline text-lg sm:text-xl text-white font-bold uppercase">
                      DEJOUNTE MURRAY #5
                    </span>
                    <span className="font-mono text-lg font-bold text-[#ff5708]">{pctB}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-[#0b0e15] rounded-full overflow-hidden mt-2">
                    <div className="h-full bg-[#ff5708] rounded-full transition-all duration-300" style={{ width: `${pctB}%` }}></div>
                  </div>
                  <span className="font-mono text-[11px] text-[#8e9379] mt-2 block">
                    {pollB.toLocaleString()} votes {userVoted === 'B' && '• (YOUR VOTE)'}
                  </span>
                </button>
              </div>

              {/* QR and Broadcast Sync buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2 font-headline text-sm uppercase font-bold">
                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setQrOnRibbon(!qrOnRibbon);
                    showToast(qrOnRibbon ? 'QR CODE REMOVED FROM RIBBONS' : 'QR CODE BROADCAST ON 360° RIBBON');
                  }}
                  className={`py-2 px-3 rounded-lg border flex items-center justify-center gap-2 transition-colors ${
                    qrOnRibbon
                      ? 'bg-[#00daf3] text-[#10131a] border-[#00daf3]'
                      : 'bg-[#191b23] text-white border-[#272a32] hover:border-white'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span>{qrOnRibbon ? 'HIDE QR RIBBON' : 'SHOW QR ON RIBBONS'}</span>
                </button>

                <button
                  onClick={() => {
                    soundEngine.playClick();
                    setPollA((p) => p + Math.floor(Math.random() * 80 + 20));
                    setPollB((p) => p + Math.floor(Math.random() * 50 + 10));
                    showToast('DATA REFRESHED FROM RECEPTORS');
                  }}
                  className="py-2 px-3 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-white border border-[#272a32] flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4 text-[#c3f400]" />
                  <span>FORCE REFRESH DATA</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Live Acoustic Sensors & Mic Gain Station */}
      <div className="flex flex-col bg-[#121620] border border-[#1e2535] p-4 rounded-xl shadow-md gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#c3f400]" />
            <h3 className="font-headline font-bold text-sm uppercase tracking-wide text-white">
              Crowd Mic Array Pickup
            </h3>
          </div>
          <span className="font-mono text-xs text-[#c3f400] bg-[#191b23] border border-[#272a32] px-2 py-0.5 rounded">
            DSP AUTO-LIMIT: ENGAGED
          </span>
        </div>

        {/* Acoustic Sensor Mini Cards */}
        <div className="grid grid-cols-3 gap-2 font-mono text-xs">
          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[#8e9379] text-[10px]">MIC 01</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
            </div>
            <span className="font-headline font-bold text-white text-sm uppercase mt-0.5 truncate">
              UPPER BOWL
            </span>
            <span className="text-[#00daf3] font-bold text-sm mt-1">
              108.5 <span className="text-[10px] text-[#8e9379] font-normal">dB</span>
            </span>
          </div>

          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[#8e9379] text-[10px]">MIC 02</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5708] animate-pulse"></span>
            </div>
            <span className="font-headline font-bold text-white text-sm uppercase mt-0.5 truncate">
              LOWER BOWL
            </span>
            <span className="text-[#c3f400] font-bold text-sm mt-1">
              114.2 <span className="text-[10px] text-[#8e9379] font-normal">dB</span>
            </span>
          </div>

          <div className="bg-[#191b23] border border-[#272a32] p-2.5 rounded-lg flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[#8e9379] text-[10px]">MIC 03</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400]"></span>
            </div>
            <span className="font-headline font-bold text-white text-sm uppercase mt-0.5 truncate">
              COURTSIDE
            </span>
            <span className="text-[#00daf3] font-bold text-sm mt-1">
              111.0 <span className="text-[10px] text-[#8e9379] font-normal">dB</span>
            </span>
          </div>
        </div>

        {/* Gain Threshold Slider & Tactile Controls */}
        <div className="flex flex-col gap-2 bg-[#191b23] border border-[#272a32] p-3 rounded-lg">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-white uppercase font-medium">Global Array Gain Threshold</span>
            <span className="text-[#c3f400] font-bold">+{(gainThreshold / 10).toFixed(1)} dB</span>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            value={gainThreshold}
            onChange={(e) => setGainThreshold(Number(e.target.value))}
            className="w-full accent-[#c3f400] cursor-pointer h-2 bg-[#0b0e15] rounded-lg"
          />

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <span className="text-[#8e9379] uppercase text-[10px]">DAMPING:</span>
              <div className="inline-flex bg-[#0b0e15] p-0.5 rounded border border-[#272a32]">
                {(['low', 'med', 'turbo'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      soundEngine.playClick();
                      setDamping(d);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                      damping === d ? 'bg-[#c3f400] text-[#10131a]' : 'text-[#8e9379]'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                setSirenArmed(!sirenArmed);
              }}
              className="flex items-center gap-2 font-mono text-xs cursor-pointer"
            >
              <span className="text-white uppercase font-semibold text-[11px]">115 dB Siren Arm</span>
              <div
                className={`w-8 h-4.5 rounded-full transition-colors p-0.5 flex items-center ${
                  sirenArmed ? 'bg-[#ff5708] justify-end' : 'bg-[#272a32] justify-start'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md"></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Operator Rapid Action Strip */}
      <div className="flex flex-col bg-[#121620] border border-[#1e2535] p-4 rounded-xl shadow-lg gap-3">
        {/* Timeout Clock Bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0b0e15] border border-[#272a32] font-mono text-xs">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ff5708]" />
            <span className="uppercase tracking-wider text-[#8e9379] font-bold">
              TIMEOUT REMAINING
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white bg-[#191b23] px-2 py-0.5 rounded border border-[#272a32]">
              00:{secondsLeft.toString().padStart(2, '0')}
            </span>
            <span className="text-[#c3f400] font-bold animate-pulse text-[11px]">AUTO-ADVANCE</span>
          </div>
        </div>

        {/* Large Vibrant Hotkey: Winner Celebration Strobe */}
        <button
          onClick={handleCelebration}
          className="relative flex items-center justify-center gap-2.5 py-4 px-4 rounded-xl bg-[#c3f400] text-[#161e00] font-headline text-lg sm:text-xl uppercase tracking-wider font-black shadow-[0_0_24px_rgba(195,244,0,0.5)] active:scale-[0.98] transition-transform hover:brightness-110"
        >
          <PartyPopper className="w-6 h-6" />
          <span>FIRE WINNER CELEBRATION FX (STROBE + CONFETTI)</span>
        </button>

        {/* Panic / Emergency Actions */}
        <div className="grid grid-cols-2 gap-2 font-headline text-sm uppercase font-bold">
          <button
            onClick={() => {
              soundEngine.playClick();
              setSecondsLeft(0);
              showToast('CLEARED: OVERLAY SWITCHED TO REGULAR GAME CLOCK');
            }}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#191b23] hover:bg-[#272a32] text-white border border-[#272a32] transition-colors"
          >
            <Clock className="w-4 h-4 text-[#00daf3]" />
            <span>CLEAR TO GAME CLOCK</span>
          </button>

          <button
            onClick={onTriggerBlackout}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-[#93000a] text-red-200 hover:bg-red-700 border border-red-500/40 transition-colors"
          >
            <AlertOctagon className="w-4 h-4" />
            <span>ABORT / BLACKOUT OVERLAY</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#c3f400] text-[#10131a] px-5 py-2.5 rounded-full font-mono text-xs uppercase font-black shadow-2xl z-50 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
