export enum Screen {
  Title,
  Game,
  Result,
  Ranking,
  CandySelection,
  MiniGame,
}

export enum Difficulty {
    Beginner,
    Intermediate,
    Advanced,
}

export interface SoundSettings {
  bgmVolume: number;
  sfxVolume: number;
  isMuted: boolean;
}

export interface Slice {
    id: number;
    x: number;
    pattern: string;
}

export interface ScorePopup {
    id: number;
    x: number;
    y: number;
    value: string;
}

export interface Particle {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
}

export interface Obstacle {
    id: number;
    left: number; // position relative to the start of its segment
    width: number;
}

export interface RankingEntry {
    name: string;
    score: number;
    date: string;
}
