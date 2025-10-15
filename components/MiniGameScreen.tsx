import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { SoundSettings, Difficulty } from '../types';

const GAME_DURATION = 60;
const CANDIES_PER_ROW = 8;
const CANDY_SIZE = 80;
const CORRECT_CANDY_SCORE = 100;

interface MiniGameScreenProps {
  soundSettings: SoundSettings;
  onGameOver: (score: number) => void;
  candyPatterns: string[];
  difficulty: Difficulty;
}

const playSound = (url: string, volume: number, isMuted: boolean) => {
    if (isMuted) return;
    try {
        const audio = new Audio(url);
        audio.volume = volume;
        audio.play().catch(e => console.error("Audio play failed:", e));
    } catch (e) {
        console.error("Audio could not be played:", e);
    }
};

const MiniGameScreen: React.FC<MiniGameScreenProps> = ({ soundSettings, onGameOver, candyPatterns, difficulty }) => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [wrongCandy, setWrongCandy] = useState<{ row: number; index: number } | null>(null);
  const [correctPattern, setCorrectPattern] = useState(candyPatterns[0]);
  const [wrongPattern, setWrongPattern] = useState(candyPatterns[1]);
  const [isGameOver, setIsGameOver] = useState(false);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>();
  const timerEndTimeRef = useRef<number | null>(null);
  const timerAnimationRef = useRef<number>();
  const timeLeftRef = useRef(GAME_DURATION);

  const { rows, penalty, speedMultiplier } = useMemo(() => {
    switch (difficulty) {
      case Difficulty.Advanced:
        return { rows: 5, penalty: 7, speedMultiplier: 1.8 };
      case Difficulty.Intermediate:
        return { rows: 4, penalty: 5, speedMultiplier: 1.4 };
      case Difficulty.Beginner:
      default:
        return { rows: 3, penalty: 3, speedMultiplier: 1.0 };
    }
  }, [difficulty]);

  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  const resetWrongCandy = useCallback(() => {
    const newCorrectPattern = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
    let newWrongPattern;
    do {
      newWrongPattern = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
    } while (newWrongPattern === newCorrectPattern);
    
    setCorrectPattern(newCorrectPattern);
    setWrongPattern(newWrongPattern);

    setWrongCandy({
      row: Math.floor(Math.random() * rows),
      index: Math.floor(Math.random() * CANDIES_PER_ROW)
    });
  }, [candyPatterns, rows]);

  useEffect(() => {
    resetWrongCandy();
  }, [resetWrongCandy]);

  useEffect(() => {
    if (isGameOver) {
      if (timerAnimationRef.current) cancelAnimationFrame(timerAnimationRef.current);
      return;
    }

    timerEndTimeRef.current = Date.now() + timeLeft * 1000;

    const timerLoop = () => {
      if (timerEndTimeRef.current) {
        const remainingTime = timerEndTimeRef.current - Date.now();
        const remainingSeconds = Math.max(0, Math.ceil(remainingTime / 1000));
        
        setTimeLeft(currentVal => currentVal !== remainingSeconds ? remainingSeconds : currentVal);
      }
      timerAnimationRef.current = requestAnimationFrame(timerLoop);
    };

    timerAnimationRef.current = requestAnimationFrame(timerLoop);
    return () => { if (timerAnimationRef.current) cancelAnimationFrame(timerAnimationRef.current); };
  }, [isGameOver]);

  useEffect(() => {
    if (timeLeft === 0 && !isGameOver) {
      setIsGameOver(true);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      setTimeout(() => onGameOver(score), 1500);
    }
  }, [timeLeft, isGameOver, onGameOver, score]);

  const handleCandyClick = (isTheTarget: boolean) => {
    if (isGameOver) return;
    if (isTheTarget) {
      playSound('https://assets.mixkit.co/sfx/preview/mixkit-video-game-win-2016.mp3', soundSettings.sfxVolume, soundSettings.isMuted);
      setScore(s => s + CORRECT_CANDY_SCORE);
      resetWrongCandy();
    } else {
      playSound('https://assets.mixkit.co/sfx/preview/mixkit-small-hit-in-a-game-2088.mp3', soundSettings.sfxVolume, soundSettings.isMuted);
      if (timerEndTimeRef.current) {
        timerEndTimeRef.current -= penalty * 1000;
      }
    }
  };

  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = (time - lastTimeRef.current) / 1000;
    
    if (gameAreaRef.current) {
        const speed = (50 + (GAME_DURATION - timeLeftRef.current) * 2) * speedMultiplier;
        const children = gameAreaRef.current.children;
        for (let i = 0; i < children.length; i++) {
            const row = children[i] as HTMLDivElement;
            let currentLeft = parseFloat(row.style.left || '0');
            currentLeft -= speed * deltaTime;
            if (currentLeft < -CANDY_SIZE * 2) {
                currentLeft += CANDY_SIZE * 2;
            }
            row.style.left = `${currentLeft}px`;
        }
    }

    lastTimeRef.current = time;
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [speedMultiplier]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); }
  }, [animate]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl flex justify-between items-center px-4 mb-4">
        <div className="text-4xl text-amber-900 font-bold bg-white/60 px-4 py-2 rounded-lg shadow-md">
          スコア: <span className="text-red-600">{score}</span>
        </div>
        <div className="text-2xl text-amber-900 font-bold">違う柄の飴をタップ！</div>
        <div className="text-4xl text-amber-900 font-bold bg-white/60 px-4 py-2 rounded-lg shadow-md">
          残り時間: <span className="text-red-600">{timeLeft}</span>
        </div>
      </div>
      <div className="relative w-full max-w-4xl h-96 bg-white/40 rounded-lg shadow-xl overflow-hidden cursor-pointer border border-white/50" ref={gameAreaRef}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="absolute flex" style={{ top: `${rowIndex * (CANDY_SIZE + 10) + 10}px`, width: `${CANDY_SIZE * (CANDIES_PER_ROW + 4)}px` }}>
            {Array.from({ length: CANDIES_PER_ROW + 4 }).map((_, candyIndex) => {
              const isTheWrongOne = wrongCandy?.row === rowIndex && wrongCandy?.index === (candyIndex % CANDIES_PER_ROW);
              return (
                <div
                  key={candyIndex}
                  onClick={() => handleCandyClick(isTheWrongOne)}
                  className="bg-center bg-no-repeat bg-cover rounded-full transition-transform duration-100 hover:scale-110"
                  style={{
                    width: `${CANDY_SIZE}px`,
                    height: `${CANDY_SIZE}px`,
                    backgroundImage: isTheWrongOne ? wrongPattern : correctPattern,
                    margin: '5px',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="text-8xl text-white font-bold animate-pulse">終了！</div>
        </div>
      )}
    </div>
  );
};

export default MiniGameScreen;