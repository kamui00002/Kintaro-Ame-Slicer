import React from 'react';
import { CANDY_SETS } from '../constants';

interface CandySelectionScreenProps {
  onSelect: (setIndex: number) => void;
  onGoToTitle: () => void;
  currentSetIndex: number;
}

const CandySelectionScreen: React.FC<CandySelectionScreenProps> = ({ onSelect, onGoToTitle, currentSetIndex }) => {
  return (
    <div className="flex flex-col items-center text-center text-amber-900 p-8 rounded-2xl bg-white/60 backdrop-blur-md shadow-2xl border border-white/30">
      <h1 className="text-5xl font-bold drop-shadow-xl mb-8">飴を選ぶ</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {CANDY_SETS.map((set, index) => (
          <div
            key={set.name}
            onClick={() => onSelect(index)}
            className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
              currentSetIndex === index
                ? 'bg-amber-200 ring-4 ring-amber-500 shadow-xl scale-105'
                : 'bg-white/50 hover:bg-amber-100/80 shadow-md'
            }`}
          >
            <h2 className="text-2xl font-bold mb-3">{set.name}</h2>
            <div className="flex justify-center items-center gap-2 h-16">
              {set.patterns.slice(0, 3).map((pattern, pIndex) => (
                <div
                  key={pIndex}
                  className="w-12 h-12 bg-center bg-no-repeat bg-cover rounded-full shadow-inner"
                  style={{ backgroundImage: pattern }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onGoToTitle}
        className="px-10 py-4 bg-gradient-to-b from-blue-500 to-blue-600 text-white text-2xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        決定
      </button>
    </div>
  );
};

export default CandySelectionScreen;
