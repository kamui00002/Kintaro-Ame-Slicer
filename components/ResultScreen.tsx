import React from 'react';

interface ResultScreenProps {
  score: number;
  onRestart: () => void;
  onGoToTitle: () => void;
  onGoToRanking: () => void;
  showRestart: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, onRestart, onGoToTitle, onGoToRanking, showRestart }) => {
  return (
    <div className="flex flex-col items-center text-center text-amber-900 p-8 rounded-2xl bg-white/60 backdrop-blur-md shadow-2xl border border-white/30 animate-fade-in">
      <h2 className="text-5xl font-bold mb-4 drop-shadow-lg" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.2)' }}>ゲームオーバー</h2>
      
      <div className="flex flex-col items-center mb-8">
        <p className="text-3xl font-bold text-amber-800 drop-shadow">スコア</p>
        <p className="text-8xl font-bold text-red-600 drop-shadow-lg animate-bounce" style={{ textShadow: '3px 3px 5px rgba(0,0,0,0.3)' }}>{score}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {showRestart && (
            <button
                onClick={onRestart}
                className="px-8 py-3 bg-gradient-to-b from-blue-500 to-blue-600 text-white text-2xl font-bold rounded-full shadow-[0_5px_15px_rgba(59,130,246,0.4)] transform hover:scale-110 transition-transform duration-300 ease-in-out border-4 border-white/80"
            >
                もう一度プレイ
            </button>
        )}
        <button
          onClick={onGoToRanking}
          className="px-8 py-3 bg-gradient-to-b from-purple-500 to-purple-600 text-white text-2xl font-bold rounded-full shadow-[0_5px_15px_rgba(168,85,247,0.4)] transform hover:scale-110 transition-transform duration-300 ease-in-out border-4 border-white/80"
        >
          ランキングを見る
        </button>
        <button
          onClick={onGoToTitle}
          className="px-8 py-3 bg-gradient-to-b from-gray-500 to-gray-600 text-white text-2xl font-bold rounded-full shadow-[0_5px_15px_rgba(107,114,128,0.4)] transform hover:scale-110 transition-transform duration-300 ease-in-out border-4 border-white/80"
        >
          タイトルに戻る
        </button>
      </div>
    </div>
  );
};

export default ResultScreen;
