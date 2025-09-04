// Simple audio system using Web Audio API
class AudioSystem {
  private context: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private volume: number = 0.3;
  private enabled: boolean = true;

  constructor() {
    this.initializeContext();
  }

  private initializeContext() {
    try {
      this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  public async initialize() {
    if (!this.context || !this.enabled) return;

    // Generate simple sound effects procedurally
    await this.generateSounds();
  }

  private async generateSounds() {
    if (!this.context) return;

    const sampleRate = this.context.sampleRate;
    
    // Jump sound - quick ascending tone
    const jumpBuffer = this.context.createBuffer(1, sampleRate * 0.1, sampleRate);
    const jumpData = jumpBuffer.getChannelData(0);
    for (let i = 0; i < jumpData.length; i++) {
      const t = i / sampleRate;
      const frequency = 440 + t * 200; // 440Hz to 640Hz
      jumpData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 10) * 0.3;
    }
    this.sounds.set('jump', jumpBuffer);

    // Death sound - descending noise
    const deathBuffer = this.context.createBuffer(1, sampleRate * 0.5, sampleRate);
    const deathData = deathBuffer.getChannelData(0);
    for (let i = 0; i < deathData.length; i++) {
      const t = i / sampleRate;
      const frequency = 200 - t * 150; // 200Hz to 50Hz
      const noise = (Math.random() * 2 - 1) * 0.1;
      deathData[i] = (Math.sin(2 * Math.PI * frequency * t) + noise) * Math.exp(-t * 2) * 0.4;
    }
    this.sounds.set('death', deathBuffer);

    // Victory sound - triumphant chord
    const victoryBuffer = this.context.createBuffer(1, sampleRate * 1, sampleRate);
    const victoryData = victoryBuffer.getChannelData(0);
    for (let i = 0; i < victoryData.length; i++) {
      const t = i / sampleRate;
      const fundamental = 440; // A4
      const third = 554.37; // C#5
      const fifth = 659.25; // E5
      const wave = Math.sin(2 * Math.PI * fundamental * t) * 0.3 +
                   Math.sin(2 * Math.PI * third * t) * 0.2 +
                   Math.sin(2 * Math.PI * fifth * t) * 0.2;
      victoryData[i] = wave * Math.exp(-t * 0.8);
    }
    this.sounds.set('victory', victoryBuffer);

    // Checkpoint sound - gentle chime
    const checkpointBuffer = this.context.createBuffer(1, sampleRate * 0.3, sampleRate);
    const checkpointData = checkpointBuffer.getChannelData(0);
    for (let i = 0; i < checkpointData.length; i++) {
      const t = i / sampleRate;
      const frequency = 880; // A5
      checkpointData[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 5) * 0.2;
    }
    this.sounds.set('checkpoint', checkpointBuffer);

    // Land sound - thud
    const landBuffer = this.context.createBuffer(1, sampleRate * 0.1, sampleRate);
    const landData = landBuffer.getChannelData(0);
    for (let i = 0; i < landData.length; i++) {
      const t = i / sampleRate;
      const frequency = 80 + Math.random() * 40; // Low frequency with noise
      const noise = (Math.random() * 2 - 1) * 0.3;
      landData[i] = (Math.sin(2 * Math.PI * frequency * t) + noise) * Math.exp(-t * 20) * 0.2;
    }
    this.sounds.set('land', landBuffer);
  }

  public play(soundName: string, volume?: number) {
    if (!this.context || !this.enabled || !this.sounds.has(soundName)) return;

    const buffer = this.sounds.get(soundName);
    if (!buffer) return;

    const source = this.context.createBufferSource();
    const gainNode = this.context.createGain();

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.context.destination);

    gainNode.gain.value = (volume ?? this.volume) * (this.enabled ? 1 : 0);
    
    // Resume context if suspended (required by some browsers)
    if (this.context.state === 'suspended') {
      this.context.resume();
    }

    source.start();
  }

  public setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public getVolume(): number {
    return this.volume;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }
}

// Create global audio system instance
const audioSystem = new AudioSystem();

// Initialize on first user interaction
let isInitialized = false;
const initializeOnInteraction = () => {
  if (!isInitialized) {
    audioSystem.initialize();
    isInitialized = true;
    // Remove event listeners after initialization
    document.removeEventListener('click', initializeOnInteraction);
    document.removeEventListener('keydown', initializeOnInteraction);
    document.removeEventListener('touchstart', initializeOnInteraction);
  }
};

// Add event listeners for user interaction
document.addEventListener('click', initializeOnInteraction);
document.addEventListener('keydown', initializeOnInteraction);
document.addEventListener('touchstart', initializeOnInteraction);

// Export functions
export function playSound(soundName: string, volume?: number) {
  audioSystem.play(soundName, volume);
}

export function setAudioVolume(volume: number) {
  audioSystem.setVolume(volume);
}

export function setAudioEnabled(enabled: boolean) {
  audioSystem.setEnabled(enabled);
}

export function getAudioVolume(): number {
  return audioSystem.getVolume();
}

export function isAudioEnabled(): boolean {
  return audioSystem.isEnabled();
}