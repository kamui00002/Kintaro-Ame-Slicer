import React from 'react';
import { Difficulty } from '../types';

interface MiniGameDifficultyModalProps {
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
}

const MiniGameDifficultyModal: React.FC<MiniGameDifficultyModalProps> = ({ onSelect, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-amber-50 rounded-lg shadow-2xl p-8 w-11/12 max-w-md text-amber-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-6">ミニゲームの難易度を選択</h2>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => onSelect(Difficulty.Beginner)}
            className="w-full px-12 py-3 bg-gradient-to-b from-green-500 to-green-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            初級
          </button>
          <button
            onClick={() => onSelect(Difficulty.Intermediate)}
            className="w-full px-12 py-3 bg-gradient-to-b from-yellow-500 to-yellow-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            中級
          </button>
          <button
            onClick={() => onSelect(Difficulty.Advanced)}
            className="w-full px-12 py-3 bg-gradient-to-b from-red-500 to-red-600 text-white text-3xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            上級
          </button>
        </div>
      </div>
    </div>
  );
};

export default MiniGameDifficultyModal;
