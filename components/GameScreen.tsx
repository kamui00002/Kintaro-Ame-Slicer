
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CANDY_WIDTH, PARTICLE_COLORS, GAME_DURATION_SECONDS, CANDY_SPEED_PIXELS_PER_SECOND } from '../constants';
import { SoundSettings, Slice, ScorePopup, Particle, Difficulty, Obstacle } from '../types';
import { soundGenerator } from '../utils/soundGenerator';

const CANDY_SEGMENT_WIDTH = 800; // px

// FIX: Define the props interface for the GameScreen component.
interface GameScreenProps {
  soundSettings: SoundSettings;
  onGameOver: (score: number) => void;
  difficulty: Difficulty;
  candyPatterns: string[];
}

// 効果音再生関数（新しいWeb Audio APIベース）
const playSound = async (soundType: 'slice' | 'combo' | 'miss' | 'gameOver' | 'button', volume: number, isMuted: boolean) => {
    if (isMuted) return;
    try {
        switch (soundType) {
            case 'slice':
                await soundGenerator.playSliceSound(volume);
                break;
            case 'combo':
                await soundGenerator.playComboSound(volume);
                break;
            case 'miss':
                await soundGenerator.playMissSound(volume);
                break;
            case 'gameOver':
                await soundGenerator.playGameOverSound(volume);
                break;
            case 'button':
                await soundGenerator.playButtonSound(volume);
                break;
        }
    } catch (e) {
        console.error("Sound play failed:", e);
    }
};

const GameScreen: React.FC<GameScreenProps> = ({ soundSettings, onGameOver, difficulty, candyPatterns }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [slices, setSlices] = useState<Slice[]>([]);
  const [scorePopups, setScorePopups] = useState<ScorePopup[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showCombo, setShowCombo] = useState(false);
  const [slashEffect, setSlashEffect] = useState<{x: number, y: number, key: number} | null>(null);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [isGameOver, setIsGameOver] = useState(false);
  const [obstaclesA, setObstaclesA] = useState<Obstacle[]>([]);
  const [obstaclesB, setObstaclesB] = useState<Obstacle[]>([]);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const candySegmentARef = useRef<HTMLDivElement>(null);
  const candySegmentBRef = useRef<HTMLDivElement>(null);
  const candyPatternsRef = useRef({ a: candyPatterns[0], b: candyPatterns[1] });
  const lastTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const speedRef = useRef({
    current: CANDY_SPEED_PIXELS_PER_SECOND,
  });
  const timerEndTimeRef = useRef<number | null>(null);
  const timerAnimationRef = useRef<number>();
  const bgmIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // BGM管理（新しいWeb Audio APIベース）
  useEffect(() => {
    if (isGameOver) {
      if (bgmIntervalRef.current) {
        clearInterval(bgmIntervalRef.current);
        bgmIntervalRef.current = null;
      }
    } else if (!soundSettings.isMuted) {
      // BGMを開始
      const startBGM = () => {
        soundGenerator.playBGM(soundSettings.bgmVolume);
      };
      startBGM();
      bgmIntervalRef.current = setInterval(startBGM, 2000);
    }

    return () => {
      if (bgmIntervalRef.current) {
        clearInterval(bgmIntervalRef.current);
        bgmIntervalRef.current = null;
      }
    };
  }, [isGameOver, soundSettings.isMuted, soundSettings.bgmVolume]);
  
  // Game reset and timer setup
  useEffect(() => {
    // Reset state on new game
    setScore(0);
    setCombo(0);
    setSlices([]);
    setScorePopups([]);
    setParticles([]);
    setTimeLeft(GAME_DURATION_SECONDS);
    setIsGameOver(false);
    setObstaclesA([]);
    setObstaclesB([]);
    lastTimeRef.current = null;
    speedRef.current.current = CANDY_SPEED_PIXELS_PER_SECOND;

    timerEndTimeRef.current = Date.now() + GAME_DURATION_SECONDS * 1000;

    const timerLoop = () => {
      if (timerEndTimeRef.current) {
        const remainingTime = timerEndTimeRef.current - Date.now();
        const remainingSeconds = Math.max(0, Math.ceil(remainingTime / 1000));
        
        setTimeLeft(currentVal => currentVal !== remainingSeconds ? remainingSeconds : currentVal);
      }
      timerAnimationRef.current = requestAnimationFrame(timerLoop);
    };

    timerAnimationRef.current = requestAnimationFrame(timerLoop);
    
    return () => { 
      if (timerAnimationRef.current) cancelAnimationFrame(timerAnimationRef.current); 
    };
  }, [difficulty, candyPatterns]);

  // Game over on time out
  useEffect(() => {
    if (timeLeft <= 0 && !isGameOver) {
      setIsGameOver(true);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timerAnimationRef.current) {
        cancelAnimationFrame(timerAnimationRef.current);
      }
      setTimeout(() => onGameOver(score), 1500);
    }
  }, [timeLeft, onGameOver, score, isGameOver]);


  useEffect(() => {
    if (difficulty === Difficulty.Beginner || isGameOver) return;

    const generateObstacle = (segment: 'A' | 'B') => {
        const newObstacle: Obstacle = {
            id: Date.now() + Math.random(),
            left: Math.random() * (CANDY_SEGMENT_WIDTH - 150),
            width: 80 + Math.random() * 50,
        };
        if (segment === 'A') {
            setObstaclesA(prev => [...prev, newObstacle]);
        } else {
            setObstaclesB(prev => [...prev, newObstacle]);
        }
    };
    
    const scheduleNextObstacle = () => {
        const nextTime = 2000 + Math.random() * 2000;
        return setTimeout(() => {
            if(isGameOver) return;
            const segment = Math.random() > 0.5 ? 'A' : 'B';
            generateObstacle(segment);
            timeoutId = scheduleNextObstacle();
        }, nextTime);
    };

    let timeoutId = scheduleNextObstacle();
    return () => clearTimeout(timeoutId);
  }, [difficulty, isGameOver]);

  const animateCandy = useCallback((timestamp: number) => {
      if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp;
      }
      const deltaTime = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (difficulty === Difficulty.Advanced) {
          const acceleration = 15; // pixels per second squared
          speedRef.current.current += acceleration * deltaTime;
      }

      const segA = candySegmentARef.current;
      const segB = candySegmentBRef.current;

      if (segA && segB) {
          let leftA = parseFloat(segA.style.left || '0');
          let leftB = parseFloat(segB.style.left || '0');
          
          const speed = speedRef.current.current;
          leftA -= speed * deltaTime;
          leftB -= speed * deltaTime;

          if (leftA <= -CANDY_SEGMENT_WIDTH) {
              leftA = leftB + CANDY_SEGMENT_WIDTH;
              const newPattern = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
              segA.style.backgroundImage = newPattern;
              candyPatternsRef.current.a = newPattern;
              setObstaclesA([]);
          }
          if (leftB <= -CANDY_SEGMENT_WIDTH) {
              leftB = leftA + CANDY_SEGMENT_WIDTH;
              const newPattern = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
              segB.style.backgroundImage = newPattern;
              candyPatternsRef.current.b = newPattern;
              setObstaclesB([]);
          }
          
          segA.style.left = `${leftA}px`;
          segB.style.left = `${leftB}px`;
      }
      animationFrameRef.current = requestAnimationFrame(animateCandy);
  }, [difficulty, candyPatterns]);

  useEffect(() => {
    const segA = candySegmentARef.current;
    const segB = candySegmentBRef.current;
    if(segA && segB){
        segA.style.left = `0px`;
        segB.style.left = `${CANDY_SEGMENT_WIDTH}px`;
        candyPatternsRef.current.a = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
        candyPatternsRef.current.b = candyPatterns[Math.floor(Math.random() * candyPatterns.length)];
        segA.style.backgroundImage = candyPatternsRef.current.a;
        segB.style.backgroundImage = candyPatternsRef.current.b;
    }
    animationFrameRef.current = requestAnimationFrame(animateCandy);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateCandy, candyPatterns]);

  const createParticles = (x: number, y: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 20; i++) {
        newParticles.push({
            id: Math.random(),
            x, y,
            vx: (Math.random() - 0.5) * 12,
            vy: (Math.random() - 0.5) * 12 - 4,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        });
    }
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => setParticles([]), 800);
  };
  
  const handleSlice = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isGameOver || !gameAreaRef.current) return;

    const targetElement = e.target as HTMLElement;
    if (targetElement.closest('[data-obstacle="true"]')) {
        playSound('gameOver', soundSettings.sfxVolume, soundSettings.isMuted);
        setIsGameOver(true);
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (timerAnimationRef.current) {
            cancelAnimationFrame(timerAnimationRef.current);
        }
        setTimeout(() => onGameOver(score), 500);
        return;
    }
    
    if (!candySegmentARef.current || !candySegmentBRef.current) return;
    
    const gameAreaRect = gameAreaRef.current.getBoundingClientRect();
    const candyARect = candySegmentARef.current.getBoundingClientRect();
    const candyBRect = candySegmentBRef.current.getBoundingClientRect();
    const clickX = e.clientX;
    const clickY = e.clientY;

    const isHitA = clickX >= candyARect.left && clickX <= candyARect.right && clickY >= candyARect.top && clickY <= candyARect.bottom;
    const isHitB = clickX >= candyBRect.left && clickX <= candyBRect.right && clickY >= candyBRect.top && clickY <= candyBRect.bottom;
    
    if (isHitA || isHitB) {
      const newCombo = combo + 1;
      const bonus = Math.max(0, newCombo - 1);
      const points = 1 + bonus;
      
      setScore(s => s + points);
      setCombo(newCombo);
      
      const relativeX = clickX - gameAreaRect.left;
      const relativeY = clickY - gameAreaRect.top;

      setSlashEffect({ x: relativeX, y: relativeY, key: Date.now() });

      const pattern = isHitA ? candyPatternsRef.current.a : candyPatternsRef.current.b;
      const newSlice: Slice = { id: Date.now(), x: relativeX, pattern };
      setSlices(prev => [...prev, newSlice]);
      setTimeout(() => setSlices(prev => prev.filter(s => s.id !== newSlice.id)), 2000);

      const newPopup: ScorePopup = { id: Date.now(), x: relativeX, y: relativeY, value: `+${points}` };
      setScorePopups(prev => [...prev, newPopup]);
      setTimeout(() => setScorePopups(prev => prev.filter(p => p.id !== newPopup.id)), 1000);
      
      createParticles(relativeX, relativeY);

      if (newCombo > 2) {
        setShowCombo(true);
        setTimeout(() => setShowCombo(false), 800);
        playSound('combo', soundSettings.sfxVolume, soundSettings.isMuted);
      } else {
        playSound('slice', soundSettings.sfxVolume, soundSettings.isMuted);
      }
    } else {
      setCombo(0);
      playSound('miss', soundSettings.sfxVolume * 0.5, soundSettings.isMuted);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl flex justify-between items-center px-4 mb-4">
        <div className="text-4xl text-amber-900 font-bold bg-white/60 px-4 py-2 rounded-lg shadow-md border border-white/50">
          スコア: <span className="text-red-600">{score}</span>
        </div>
        <div className="text-4xl text-amber-900 font-bold bg-white/60 px-4 py-2 rounded-lg shadow-md border border-white/50">
          残り時間: <span className="text-red-600">{timeLeft}</span>
        </div>
      </div>

      <div
        ref={gameAreaRef}
        className="relative w-full max-w-4xl h-48 bg-white/40 rounded-lg shadow-xl overflow-hidden cursor-pointer border border-white/50"
        onClick={handleSlice}
      >
        <div
            ref={candySegmentARef}
            className="absolute top-1/2 -translate-y-1/2 h-32 bg-center bg-no-repeat bg-cover rounded-full"
            style={{ 
                width: `${CANDY_SEGMENT_WIDTH}px`,
                boxShadow: 'inset 0 0 15px rgba(255,255,255,0.6), 0 5px 20px rgba(0,0,0,0.3)',
            }}
        >
            {difficulty !== Difficulty.Beginner && obstaclesA.map(obs => (
                <div
                    key={obs.id}
                    data-obstacle="true"
                    className="obstacle-zone"
                    style={{ left: `${obs.left}px`, width: `${obs.width}px` }}
                />
            ))}
        </div>
        <div
            ref={candySegmentBRef}
            className="absolute top-1/2 -translate-y-1/2 h-32 bg-center bg-no-repeat bg-cover rounded-full"
            style={{ 
                width: `${CANDY_SEGMENT_WIDTH}px`,
                boxShadow: 'inset 0 0 15px rgba(255,255,255,0.6), 0 5px 20px rgba(0,0,0,0.3)',
            }}
        >
            {difficulty !== Difficulty.Beginner && obstaclesB.map(obs => (
                <div
                    key={obs.id}
                    data-obstacle="true"
                    className="obstacle-zone"
                    style={{ left: `${obs.left}px`, width: `${obs.width}px` }}
                />
            ))}
        </div>
        {slices.map(slice => (
          <div
            key={slice.id}
            className="absolute top-1/2 -translate-y-1/2 h-32 w-32 bg-center bg-no-repeat bg-cover rounded-full animate-slice-fall pointer-events-none"
            style={{ 
                left: slice.x - CANDY_WIDTH / 2, 
                backgroundImage: slice.pattern,
                boxShadow: 'inset 0 0 10px rgba(255,255,255,0.6), 0 3px 10px rgba(0,0,0,0.2)',
            }}
          />
        ))}
        {scorePopups.map(popup => (
            <div key={popup.id} className="absolute text-3xl font-bold text-yellow-300 drop-shadow-lg animate-score-popup pointer-events-none" style={{left: popup.x, top: popup.y, textShadow: '2px 2px 2px #c05621'}}>{popup.value}</div>
        ))}
        {particles.map(p => {
          const style = { left: p.x, top: p.y, width: '8px', height: '8px', backgroundColor: p.color, '--vx': `${p.vx * 5}px`, '--vy': `${p.vy * 5}px` } as React.CSSProperties;
          return <div key={p.id} className="absolute rounded-full animate-particle pointer-events-none" style={style}></div>
        })}
        {slashEffect && (
            <div
                key={slashEffect.key}
                className="absolute animate-slash pointer-events-none"
                style={{
                    left: slashEffect.x - 100,
                    top: slashEffect.y - 2,
                    transform: `rotate(${(Math.random() - 0.5) * 20}deg)`
                }}
            />
        )}
      </div>
      
      {showCombo && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 combo-container pointer-events-none">
          <div className="text-7xl font-bold text-white text-stroke-orange animate-combo">
            {combo} COMBO!
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-40">
            <div className="text-8xl text-white font-bold animate-pulse" style={{textShadow: '0 0 20px #ff0000'}}>
                終了！
            </div>
        </div>
      )}

      <style>{`
        .text-stroke-orange { -webkit-text-stroke: 4px #f97316; }
        .obstacle-zone {
            position: absolute;
            top: 0;
            height: 100%;
            background-color: #581c87; /* dark purple */
            /* Eyes with pupils */
            background-image: 
                radial-gradient(circle at 28% 45%, #1e293b 5%, transparent 6%), /* left pupil */
                radial-gradient(circle at 28% 45%, #fecaca 15%, transparent 16%), /* left eye */
                radial-gradient(circle at 72% 45%, #1e293b 5%, transparent 6%), /* right pupil */
                radial-gradient(circle at 72% 45%, #fecaca 15%, transparent 16%); /* right eye */
            border: 3px solid #3b0764; /* darker purple */
            border-radius: 50%;
            box-shadow: 
              inset 0 3px 8px rgba(0,0,0,0.6),
              0 0 15px rgba(217, 70, 239, 0.6);
            animation: obstacle-menace 3s ease-in-out infinite;
        }

        /* Eyebrows for the obstacle */
        .obstacle-zone::before,
        .obstacle-zone::after {
            content: '';
            position: absolute;
            top: 28%;
            width: 35%;
            height: 10%;
            background: #1e293b; /* slate-800 */
            border-radius: 4px;
        }

        .obstacle-zone::before {
            left: 15%;
            transform: rotate(-20deg);
        }
        .obstacle-zone::after {
            right: 15%;
            transform: rotate(20deg);
        }

        @keyframes obstacle-menace {
            0%, 100% {
                transform: translateY(0) scale(1) rotate(0);
                box-shadow: 
                  inset 0 3px 8px rgba(0,0,0,0.6),
                  0 0 15px rgba(217, 70, 239, 0.6);
            }
            50% {
                transform: translateY(-8px) scale(1.08) rotate(3deg);
                box-shadow: 
                  inset 0 3px 8px rgba(0,0,0,0.6),
                  0 0 25px rgba(217, 70, 239, 0.9);
            }
        }
        
        @keyframes slice-fall {
            0% { transform: translateY(-50%) rotate(0deg) scale(1); opacity: 1; }
            100% { transform: translateY(200px) rotate(720deg) scale(0.5); opacity: 0; }
        }
        .animate-slice-fall { animation: slice-fall 2s forwards; }
        
        @keyframes score-popup {
            0% { transform: translateY(0) scale(1); opacity: 1; }
            100% { transform: translateY(-100px) scale(1.8); opacity: 0; }
        }
        .animate-score-popup { animation: score-popup 1s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        
        @keyframes combo-text {
            0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
            50% { transform: scale(1.2) rotate(5deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 0; }
        }
        .animate-combo { animation: combo-text 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards; }
        
        @keyframes combo-bg-zoom {
            0% { transform: scale(0); opacity: 0.5; }
            70% { transform: scale(2.5); opacity: 0; }
            100% { transform: scale(2.5); opacity: 0; }
        }
        .combo-container::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 200%;
            height: 200%;
            transform-origin: center;
            background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            animation: combo-bg-zoom 0.8s ease-out forwards;
            transform: translate(-50%, -50%);
            z-index: -1;
        }

        @keyframes particle-fade {
            to { opacity: 0; transform: translate(var(--vx), calc(var(--vy) + 50px)) scale(0); }
        }
        .animate-particle {
            animation: particle-fade 0.8s ease-out forwards;
        }

        @keyframes slash-effect {
            0% { transform: scaleX(0); opacity: 0.8; }
            50% { transform: scaleX(1); opacity: 1; }
            100% { transform: scaleX(0); transform-origin: right; opacity: 0; }
        }
        .animate-slash {
            width: 200px;
            height: 4px;
            background: white;
            border-radius: 2px;
            box-shadow: 0 0 10px white, 0 0 20px white;
            transform-origin: left;
            animation: slash-effect 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default GameScreen;