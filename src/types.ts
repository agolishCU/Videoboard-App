export type TabId = 'live-deck' | 'studio' | 'crowd' | 'templates' | 'output';

export interface Franchise {
  id: string;
  name: string;
  shortName: string;
  subName: string;
  rackId: string;
  primaryColor: string; // e.g. '#c3f400' (Volt)
  secondaryColor: string; // e.g. '#ff5708' (Inferno)
  accentColor: string; // e.g. '#00daf3' (Cyan)
  logoUrl: string;
  crestUrl: string;
  stadiumName: string;
  court: string;
}

export interface HotkeyPad {
  id: string;
  padNumber: string;
  badge: string;
  title: string;
  emoji: string;
  subtitle: string;
  duration: string;
  category: 'loop' | 'vu-max' | 'one-shot' | 'override' | 'crowd' | 'bug';
  accent: 'volt' | 'orange' | 'cyan' | 'secondary';
  soundEffect: 'defense' | 'noise' | 'three' | 'goal' | 'tshirt' | 'sponsor';
}

export interface CueItem {
  id: string;
  title: string;
  status: 'READY' | 'ARMED' | 'ON AIR' | 'STANDBY';
  duration: string;
  description: string;
  type: string;
}

export interface StudioLayer {
  id: string;
  name: string;
  tag: string;
  startPct: number;
  widthPct: number;
  visible: boolean;
  colorType: 'volt' | 'orange' | 'cyan' | 'high';
}

export interface StadiumTemplate {
  id: string;
  title: string;
  category: 'hype' | 'crowd' | 'plays' | 'sponsors';
  sport: 'all' | 'bball' | 'football' | 'hockey' | 'baseball' | 'soccer';
  aspectRatio: string;
  duration: string;
  tag: string;
  tagType: 'popular' | 'hot' | 'audio-reactive' | 'kinetic';
  description: string;
  bgImageUrl: string;
  headlineText: string;
  colorHex: string;
}

export interface DisplayZone {
  id: string;
  name: string;
  viewport: string;
  resolution: string;
  framerate: string;
  status: 'ONLINE' | 'STANDBY' | 'OFFLINE';
  active: boolean;
}

export interface AudioStinger {
  id: string;
  name: string;
  keyLabel: string;
  duration: string;
  detail: string;
  soundKey: 'charge' | 'horn' | 'siren';
  color: string;
}
