import React from 'react';
import { Difficulty } from '../types';
import { soundGenerator } from '../utils/soundGenerator';

interface TitleScreenProps {
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onGoToRanking: () => void;
  onGoToCandySelection: () => void;
  onGoToMiniGame: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onSelectDifficulty, onGoToRanking, onGoToCandySelection, onGoToMiniGame }) => {
  const handleButtonClick = async () => {
    await soundGenerator.playButtonSound(0.3);
  };

  return (
    <div className="flex flex-col items-center text-center text-amber-900 p-8 rounded-2xl bg-white/60 backdrop-blur-md shadow-2xl border border-white/30">
      <h1 className="text-6xl md:text-8xl font-bold drop-shadow-xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>金太郎飴</h1>
      <h2 className="text-5xl md:text-7xl font-bold drop-shadow-xl mb-8" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.2)' }}>スライサー</h2>
      
      <p className="text-2xl mb-4 font-semibold">難易度を選択して開始</p>

      <div className="flex flex-col gap-4 mb-8">
        <button
          onClick={async () => {
            await handleButtonClick();
            onSelectDifficulty(Difficulty.Beginner);
          }}
          className="px-12 py-3 bg-gradient-to-b from-green-500 to-green-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          初級
        </button>
        <button
          onClick={async () => {
            await handleButtonClick();
            onSelectDifficulty(Difficulty.Intermediate);
          }}
          className="px-12 py-3 bg-gradient-to-b from-yellow-500 to-yellow-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          中級
        </button>
         <button
          onClick={async () => {
            await handleButtonClick();
            onSelectDifficulty(Difficulty.Advanced);
          }}
          className="px-12 py-3 bg-gradient-to-b from-red-500 to-red-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-110 transition-transform duration-300"
        >
          上級
        </button>
      </div>

      <div className="flex flex-row flex-wrap justify-center gap-4">
          <button onClick={async () => {
            await handleButtonClick();
            onGoToCandySelection();
          }} className="px-6 py-2 bg-gradient-to-b from-purple-500 to-purple-600 text-white text-xl font-bold rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">飴を選ぶ</button>
          <button onClick={async () => {
            await handleButtonClick();
            onGoToRanking();
          }} className="px-6 py-2 bg-gradient-to-b from-blue-500 to-blue-600 text-white text-xl font-bold rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">ランキング</button>
          <button onClick={async () => {
            await handleButtonClick();
            onGoToMiniGame();
          }} className="px-6 py-2 bg-gradient-to-b from-pink-500 to-pink-600 text-white text-xl font-bold rounded-full shadow-md transform hover:scale-105 transition-transform duration-300">ミニゲーム</button>
      </div>
    </div>
  );
};

export default TitleScreen;