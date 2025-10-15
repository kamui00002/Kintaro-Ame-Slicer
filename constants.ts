import type { SoundSettings } from './types';

export const GAME_DURATION_SECONDS = 30;
export const CANDY_WIDTH = 128; // height-128px in tailwind
export const CANDY_SPEED_PIXELS_PER_SECOND = 200;

export const INITIAL_SOUND_SETTINGS: SoundSettings = {
  bgmVolume: 0.2,
  sfxVolume: 0.8,
  isMuted: false,
};

export const RANKING_STORAGE_KEY_PREFIX = 'kintaro-slicer-ranking_';
export const MAX_RANKING_ENTRIES = 10;


// SVG patterns for the candy. Using data URIs for direct use in background-image.
const createSvgDataUri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;

const CLASSIC_PATTERNS: string[] = [
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#FFC0CB" stroke="#B38890" stroke-width="4"/><circle cx="35" cy="40" r="5" fill="#333"/><circle cx="65" cy="40" r="5" fill="#333"/><path d="M35 65 Q 50 75 65 65" stroke="#333" stroke-width="4" fill="none"/></svg>`),
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#90EE90" stroke="#559E55" stroke-width="4"/><path d="M50 20 L60 45 L85 45 L65 60 L75 85 L50 70 L25 85 L35 60 L15 45 L40 45 Z" fill="#FFDF00" stroke="#B3A100" stroke-width="2"/></svg>`),
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#ADD8E6" stroke="#7998A1" stroke-width="4"/><path d="M50,25 C75,25 75,75 50,75 C25,75 25,25 50,25 M50,25 C50,0 100,50 50,75 C0,50 50,0 50,25" fill="white" /></svg>`),
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#FFD700" stroke="#B39700" stroke-width="4"/><circle cx="50" cy="50" r="20" fill="white"/><circle cx="50" cy="50" r="10" fill="#FFD700"/></svg>`),
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#F4C2C2" stroke="#AA8888" stroke-width="4"/><path d="M50 15 C 20 40, 80 40, 50 85 C 80 40, 20 40, 50 15" fill="#E32636"/></svg>`),
];

const FRUIT_PATTERNS: string[] = [
    // Strawberry
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#FF6B6B" stroke="#C44D58" stroke-width="4"/><circle cx="35" cy="45" r="3" fill="yellow"/><circle cx="50" cy="35" r="3" fill="yellow"/><circle cx="65" cy="45" r="3" fill="yellow"/><circle cx="40" cy="65" r="3" fill="yellow"/><circle cx="60" cy="65" r="3" fill="yellow"/><path d="M40 20 L50 10 L60 20 Z" fill="#4CAF50"/><path d="M45 25 L50 18 L55 25 Z" fill="#4CAF50"/></svg>`),
    // Orange
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#FFA500" stroke="#B37400" stroke-width="4"/><path d="M50 2 L50 50 L98 50 A 48 48 0 0 1 50 98 Z" fill="none" stroke="white" stroke-width="3"/><path d="M50 2 L50 50 L2 50 A 48 48 0 0 1 50 2 Z" fill="none" stroke="white" stroke-width="3"/></svg>`),
    // Kiwi
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#8BA752" stroke="#5E7239" stroke-width="4"/><circle cx="50" cy="50" r="30" fill="#B3D080"/><circle cx="50" cy="45" r="2" fill="black"/><circle cx="50" cy="55" r="2" fill="black"/><circle cx="45" cy="50" r="2" fill="black"/><circle cx="55" cy="50" r="2" fill="black"/><circle cx="42" cy="42" r="2" fill="black"/><circle cx="58" cy="58" r="2" fill="black"/><circle cx="42" cy="58" r="2" fill="black"/><circle cx="58" cy="42" r="2" fill="black"/></svg>`),
];

const ANIMAL_PATTERNS: string[] = [
    // Panda
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="white" stroke="#333" stroke-width="4"/><circle cx="30" cy="30" r="15" fill="black"/><circle cx="70" cy="30" r="15" fill="black"/><circle cx="35" cy="45" r="8" fill="black"/><circle cx="65" cy="45" r="8" fill="black"/><circle cx="36" cy="44" r="3" fill="white"/><circle cx="66" cy="44" r="3" fill="white"/><path d="M45 65 Q 50 70 55 65" stroke="black" stroke-width="3" fill="none"/></svg>`),
    // Cat
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#F0E68C" stroke="#B8860B" stroke-width="4"/><path d="M20 50 L10 20 L30 30 Z" fill="#CD853F"/><path d="M80 50 L90 20 L70 30 Z" fill="#CD853F"/><circle cx="38" cy="50" r="5" fill="black"/><circle cx="62" cy="50" r="5" fill="black"/><path d="M45 65 L55 65" stroke="black" stroke-width="2"/><path d="M30 60 L10 55" stroke="black" stroke-width="2"/><path d="M30 65 L10 65" stroke="black" stroke-width="2"/><path d="M70 60 L90 55" stroke="black" stroke-width="2"/><path d="M70 65 L90 65" stroke="black" stroke-width="2"/></svg>`),
    // Dog
    createSvgDataUri(`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="48" fill="#D2B48C" stroke="#8B4513" stroke-width="4"/><path d="M20 70 C 10 90, 40 90, 30 70 Z" fill="#A0522D"/><circle cx="38" cy="45" r="6" fill="black"/><circle cx="62" cy="45" r="6" fill="black"/><path d="M50 55 C 45 65, 55 65, 50 55 Z" fill="#333"/><path d="M50 70 C 40 80, 60 80, 50 70" stroke="black" stroke-width="3" fill="none"/></svg>`),
];

export const CANDY_SETS = [
    { name: 'クラシック', patterns: CLASSIC_PATTERNS },
    { name: 'フルーツ', patterns: FRUIT_PATTERNS },
    { name: '動物', patterns: ANIMAL_PATTERNS },
];


export const PARTICLE_COLORS = ['#ff6b6b', '#f9d423', '#48dbfb', '#1dd1a1'];
