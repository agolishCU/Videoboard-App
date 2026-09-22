/**
 * ArenaPulse Sound Engine - Web Audio API stadium synthesizer
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play simple UI click chirp
  playClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable or blocked
    }
  }

  // Stadium Air Horn Blast (Classic 128 dB SPL simulation)
  playAirHorn() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc3.type = 'square';

      // Authentic arena horn frequencies (approx ~230Hz and ~288Hz)
      osc1.frequency.setValueAtTime(233, now); // Bb3
      osc2.frequency.setValueAtTime(293.66, now); // D4
      osc3.frequency.setValueAtTime(349.23, now); // F4

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.15, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + 0.9);
      osc2.stop(now + 0.9);
      osc3.stop(now + 0.9);
    } catch {
      // ignore
    }
  }

  // Stadium Organ Charge Fanfare (Da-da-da-da-da... CHARGE!)
  playOrganCharge() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [
        { f: 261.63, t: 0.0, d: 0.14 }, // C4
        { f: 329.63, t: 0.16, d: 0.14 }, // E4
        { f: 392.0, t: 0.32, d: 0.14 },  // G4
        { f: 523.25, t: 0.48, d: 0.3 },  // C5
        { f: 392.0, t: 0.82, d: 0.14 },  // G4
        { f: 523.25, t: 1.0, d: 0.55 },  // C5 (Hold CHARGE!)
      ];

      notes.forEach(({ f, t, d }) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc2.type = 'sine';
        osc.frequency.setValueAtTime(f, now + t);
        osc2.frequency.setValueAtTime(f * 2, now + t);

        gain.gain.setValueAtTime(0.12, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + d);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + t);
        osc2.start(now + t);
        osc.stop(now + t + d);
        osc2.stop(now + t + d);
      });
    } catch {
      // ignore
    }
  }

  // Siren Drop with Sub-Bass sweep
  playSiren() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      sub.type = 'sine';

      // Pitch sweep up and down
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.4);
      osc.frequency.linearRampToValueAtTime(350, now + 0.8);
      osc.frequency.linearRampToValueAtTime(800, now + 1.2);

      sub.frequency.setValueAtTime(70, now);
      sub.frequency.exponentialRampToValueAtTime(35, now + 1.2);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      sub.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      sub.start(now);
      osc.stop(now + 1.5);
      sub.stop(now + 1.5);
    } catch {
      // ignore
    }
  }

  // 808 Kick + Chant Hype (Defense!)
  play808Defense() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // 808 Kick 1
      const kick = this.ctx.createOscillator();
      const kickGain = this.ctx.createGain();
      kick.type = 'sine';
      kick.frequency.setValueAtTime(150, now);
      kick.frequency.exponentialRampToValueAtTime(38, now + 0.35);
      kickGain.gain.setValueAtTime(0.3, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      kick.connect(kickGain);
      kickGain.connect(this.ctx.destination);
      kick.start(now);
      kick.stop(now + 0.45);

      // 808 Kick 2
      const kick2 = this.ctx.createOscillator();
      const kick2Gain = this.ctx.createGain();
      kick2.type = 'sine';
      kick2.frequency.setValueAtTime(150, now + 0.4);
      kick2.frequency.exponentialRampToValueAtTime(42, now + 0.75);
      kick2Gain.gain.setValueAtTime(0.28, now + 0.4);
      kick2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      kick2.connect(kick2Gain);
      kick2Gain.connect(this.ctx.destination);
      kick2.start(now + 0.4);
      kick2.stop(now + 0.85);
    } catch {
      // ignore
    }
  }

  // 3-Pointer Fire whoosh
  playWhoosh() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.5);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.5);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch {
      // ignore
    }
  }

  // Crowd noise roar / Celebration blast
  playCrowdRoar() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Synthesize noise buffer
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.4);
      filter.frequency.linearRampToValueAtTime(400, now + 1.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 1.5);
    } catch {
      // ignore
    }
  }

  // Strobe click
  playStrobeClick() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // ignore
    }
  }
}

export const soundEngine = new SoundEngine();
