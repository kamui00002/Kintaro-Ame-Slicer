import React, { useState } from 'react';
import { RankingEntry, Difficulty } from '../types';

interface RankingScreenProps {
  rankings: Record<Difficulty, RankingEntry[]>;
  onGoToTitle: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.Beginner]: '初級',
  [Difficulty.Intermediate]: '中級',
  [Difficulty.Advanced]: '上級',
};

const RankingScreen: React.FC<RankingScreenProps> = ({ rankings, onGoToTitle }) => {
  const [activeTab, setActiveTab] = useState<Difficulty>(Difficulty.Beginner);

  const activeRankings = rankings[activeTab] || [];

  return (
    <div className="w-full max-w-2xl flex flex-col items-center text-center text-amber-900 p-6 rounded-2xl bg-white/70 backdrop-blur-md shadow-2xl border border-white/30">
      <h1 className="text-6xl font-bold drop-shadow-xl mb-6">ランキング</h1>
      
      <div className="w-full flex justify-center mb-4 border-b-2 border-amber-300">
        {/* FIX: Correctly iterate over numeric enum values to avoid TypeScript error. */}
        {(Object.values(Difficulty).filter(v => typeof v === 'number') as Difficulty[]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setActiveTab(difficulty)}
              className={`px-6 py-2 text-2xl font-semibold transition-colors duration-200 ${
                activeTab === difficulty
                  ? 'border-b-4 border-amber-600 text-amber-800'
                  : 'text-amber-600 hover:bg-amber-100/50'
              }`}
            >
              {difficultyLabels[difficulty]}
            </button>
          )
        )}
      </div>

      <div className="w-full h-96 overflow-y-auto bg-amber-50/50 rounded-lg p-4 shadow-inner">
        {activeRankings.length > 0 ? (
          <ol className="space-y-2">
            {activeRankings.map((entry, index) => (
              <li key={index} className="flex items-center justify-between p-3 bg-white/80 rounded-lg shadow-sm text-xl">
                <div className="flex items-center">
                  <span className="font-bold w-12 text-2xl text-amber-700">
                    {index + 1}位
                  </span>
                  <span className="font-semibold">{entry.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-red-600">{entry.score}点</span>
                  <span className="text-sm text-gray-500 hidden sm:block">{entry.date}</span>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-2xl text-amber-700">まだ記録がありません。</p>
          </div>
        )}
      </div>

      <button
        onClick={onGoToTitle}
        className="mt-6 px-8 py-3 bg-gradient-to-b from-gray-500 to-gray-600 text-white text-2xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
      >
        タイトルに戻る
      </button>
    </div>
  );
};

export default RankingScreen;
