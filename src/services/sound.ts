class SoundService {
  private ctx: AudioContext | null = null;
  private soundVol = 0.9;
  private musicVol = 0.8;
  private audioEl: HTMLAudioElement | null = null;
  private isMusicPlaying = false;
  private proceduralMusicTimer: NodeJS.Timeout | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setSoundVolume(volPercent: number) {
    this.soundVol = Math.max(0, Math.min(1, volPercent / 100));
  }

  setMusicVolume(volPercent: number) {
    this.musicVol = Math.max(0, Math.min(1, volPercent / 100));
    if (this.audioEl) {
      this.audioEl.volume = this.musicVol;
    }
  }

  getSoundVolume() {
    return Math.round(this.soundVol * 100);
  }

  getMusicVolume() {
    return Math.round(this.musicVol * 100);
  }

  playMusic(customUrl?: string) {
    if (typeof window === 'undefined') return;
    this.isMusicPlaying = true;

    if (customUrl && customUrl.trim()) {
      try {
        if (!this.audioEl) {
          this.audioEl = new Audio();
          this.audioEl.loop = true;
        }
        if (this.audioEl.src !== customUrl) {
          this.audioEl.src = customUrl;
        }
        this.audioEl.volume = this.musicVol;
        this.audioEl.play().catch(() => {});
        return;
      } catch {
        // Fallback to procedural music
      }
    }

    // Procedural ambient casino lounge chords if no custom mp3 provided
    this.startProceduralAmbient();
  }

  stopMusic() {
    this.isMusicPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.proceduralMusicTimer) {
      clearInterval(this.proceduralMusicTimer);
      this.proceduralMusicTimer = null;
    }
  }

  private startProceduralAmbient() {
    if (this.proceduralMusicTimer) return;
    const chords = [
      [261.63, 329.63, 392.00], // C
      [220.00, 261.63, 329.63], // Am
      [174.61, 220.00, 261.63], // F
      [196.00, 246.94, 293.66], // G
    ];
    let chordIdx = 0;

    const playChord = () => {
      if (!this.isMusicPlaying || this.musicVol <= 0) return;
      this.initCtx();
      if (!this.ctx) return;

      const current = chords[chordIdx % chords.length];
      chordIdx++;
      const now = this.ctx.currentTime;

      current.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        const peak = 0.05 * this.musicVol;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(peak, now + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 4);
      });
    };

    playChord();
    this.proceduralMusicTimer = setInterval(playChord, 4000);
  }

  playClick() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.12 * this.soundVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Safe
    }
  }

  playDiceRoll() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          if (!this.ctx || this.soundVol <= 0) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(180 + Math.random() * 450, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.09 * this.soundVol, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + 0.04);
        }, i * 55);
      }
    } catch {
      // Safe
    }
  }

  playCoin() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.2 * this.soundVol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.35);
    } catch {
      // Safe
    }
  }

  playChip() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);
      gain.gain.setValueAtTime(0.18 * this.soundVol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Safe
    }
  }

  playVictory() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        gain.gain.setValueAtTime(0.22 * this.soundVol, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.3);
      });
    } catch {
      // Safe
    }
  }

  playError() {
    if (this.soundVol <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.1);
      gain.gain.setValueAtTime(0.18 * this.soundVol, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Safe
    }
  }
}

export const sound = new SoundService();
