// Web Audio APIを使用して効果音を生成するユーティリティ

export class SoundGenerator {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  constructor() {
    this.initAudioContext();
  }

  private async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.error('AudioContext initialization failed:', error);
    }
  }

  private async ensureAudioContext() {
    if (!this.audioContext) {
      await this.initAudioContext();
    }
    if (this.audioContext?.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // スライス効果音（高音のピッ）
  async playSliceSound(volume: number = 0.3) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  // コンボ効果音（上昇音）
  async playComboSound(volume: number = 0.4) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  // ミス効果音（低音のブー）
  async playMissSound(volume: number = 0.2) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // ゲームオーバー効果音（下降音）
  async playGameOverSound(volume: number = 0.3) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.5);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.5);
  }

  // ボタンクリック効果音
  async playButtonSound(volume: number = 0.2) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.05);
  }

  // BGM用のシンプルなループ音
  async playBGM(volume: number = 0.1) {
    await this.ensureAudioContext();
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // シンプルなメロディー
    const notes = [440, 523, 659, 523]; // A, C, E, C
    let currentTime = this.audioContext.currentTime;

    notes.forEach((frequency, index) => {
      oscillator.frequency.setValueAtTime(frequency, currentTime + index * 0.5);
    });

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 2);

    // ループ再生
    setTimeout(() => {
      this.playBGM(volume);
    }, 2000);
  }

  stopBGM() {
    // BGM停止の実装（必要に応じて）
  }
}

// シングルトンインスタンス
export const soundGenerator = new SoundGenerator();
