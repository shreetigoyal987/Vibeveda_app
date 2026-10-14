/**
 * Pure Web Audio API synthesizers for VibeVeda
 * Creates authentic meditative soundscapes (Tanpura drone, Tibetan singing bowl chime, breath bell, temple chimes)
 * Includes mobile haptic vibration feedback integration
 */

export type AmbientPreset = 'tanpura' | 'singing_bowl' | 'temple_chimes' | 'forest_stream';

class SoundService {
  private ctx: AudioContext | null = null;
  private droneOscs: OscillatorNode[] = [];
  private droneGains: GainNode[] = [];
  private masterGain: GainNode | null = null;
  private isDronePlaying = false;
  private currentPreset: AmbientPreset | null = null;
  private ambientInterval: NodeJS.Timeout | null = null;
  private volumeLevel = 0.65; // 0 to 1

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(val: number) {
    this.volumeLevel = Math.max(0, Math.min(1, val));
    if (this.ctx && this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.volumeLevel, this.ctx.currentTime);
    }
  }

  public getVolume() {
    return this.volumeLevel;
  }

  /**
   * Resonant Tibetan singing bowl chime with natural overtones
   */
  public playSingingBowl(freq = 432, duration = 4.5) {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const partials = [
        { mult: 1.0, gain: 0.35, decay: duration },
        { mult: 2.76, gain: 0.18, decay: duration * 0.7 },
        { mult: 5.4, gain: 0.08, decay: duration * 0.5 },
      ];

      partials.forEach(({ mult, gain: peakGain, decay }) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * mult, now);
        osc.frequency.linearRampToValueAtTime(freq * mult + 0.5, now + decay);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(peakGain * this.volumeLevel, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + decay);
      });
    } catch {
      // AudioContext unavailable
    }
  }

  /**
   * High-clarity sacred transition chime for completing a yoga pose
   */
  public playPoseTransitionBell() {
    this.playSingingBowl(528, 4.0);
    // Layer high bell harmonic
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1056, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.12 * this.volumeLevel, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 2.5);
    } catch {}
  }

  /**
   * Gentle breath guidance cue
   */
  public playBreathCue(isInhale: boolean) {
    this.playSingingBowl(isInhale ? 528 : 396, 2.5);
  }

  /**
   * Haptic vibration feedback for device (pose completions, breath intervals)
   */
  public triggerVibration(pattern: number[] = [180, 80, 180]) {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // Vibration not permitted or supported
    }
  }

  /**
   * Continuous multi-preset ambient soundscapes
   */
  public startAmbientTrack(preset: AmbientPreset = 'tanpura') {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return false;

      this.stopAmbientTrack();
      this.currentPreset = preset;

      const now = this.ctx.currentTime;

      if (preset === 'tanpura') {
        const baseFreq = 108; // Sacred Sa tone ~108Hz
        const pitches = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.25];
        this.droneOscs = [];
        this.droneGains = [];

        pitches.forEach((f, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(f, now);

          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime((0.08 / (idx + 1)) * this.volumeLevel, now + 1.5);

          osc.connect(gain);
          gain.connect(this.masterGain);

          osc.start(now);
          this.droneOscs.push(osc);
          this.droneGains.push(gain);
        });
      } else if (preset === 'singing_bowl') {
        // Continuous deep resonant drone at 432Hz with harmonic waves
        const pitches = [216, 432, 648];
        this.droneOscs = [];
        this.droneGains = [];

        pitches.forEach((f, idx) => {
          if (!this.ctx || !this.masterGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime((0.06 / (idx + 1)) * this.volumeLevel, now + 2.0);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(now);
          this.droneOscs.push(osc);
          this.droneGains.push(gain);
        });
      } else if (preset === 'temple_chimes') {
        // Periodic gentle temple chimes every 4-6 seconds
        this.playTempleChime();
        this.ambientInterval = setInterval(() => {
          this.playTempleChime();
        }, 5000);
      } else if (preset === 'forest_stream') {
        // Soft white-pink noise filter simulating flowing water & forest calm
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.035;
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(480, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.09 * this.volumeLevel, now + 1.5);

        whiteNoise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        whiteNoise.start(now);
        this.droneOscs.push(whiteNoise as unknown as OscillatorNode);
        this.droneGains.push(gain);
      }

      this.isDronePlaying = true;
      return true;
    } catch {
      return false;
    }
  }

  private playTempleChime() {
    try {
      this.initCtx();
      if (!this.ctx || !this.masterGain) return;
      const pitches = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6 sacred pentatonic
      const randomPitch = pitches[Math.floor(Math.random() * pitches.length)];
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(randomPitch, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08 * this.volumeLevel, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 3.5);
    } catch {}
  }

  public stopAmbientTrack() {
    try {
      if (this.ambientInterval) {
        clearInterval(this.ambientInterval);
        this.ambientInterval = null;
      }
      if (this.ctx && this.isDronePlaying) {
        const now = this.ctx.currentTime;
        this.droneGains.forEach((g) => {
          g.gain.linearRampToValueAtTime(0.0001, now + 0.8);
        });
        setTimeout(() => {
          this.droneOscs.forEach((o) => {
            try {
              o.stop();
              o.disconnect();
            } catch {}
          });
          this.droneOscs = [];
          this.droneGains = [];
          this.isDronePlaying = false;
          this.currentPreset = null;
        }, 850);
      }
    } catch {}
    this.isDronePlaying = false;
    this.currentPreset = null;
  }

  public startShastraDrone() {
    return this.startAmbientTrack('tanpura');
  }

  public stopShastraDrone() {
    return this.stopAmbientTrack();
  }

  public isPlaying() {
    return this.isDronePlaying;
  }

  public getCurrentPreset() {
    return this.currentPreset;
  }
}

export const soundService = new SoundService();
