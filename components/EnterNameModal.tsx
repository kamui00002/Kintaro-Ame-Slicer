
import React, { useState } from 'react';

interface EnterNameModalProps {
  score: number;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const EnterNameModal: React.FC<EnterNameModalProps> = ({ score, onClose, onSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'ユーザー';
    onSubmit(finalName);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-amber-50 rounded-lg shadow-2xl p-8 w-11/12 max-w-md text-amber-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-2">ハイスコア！</h2>
        <p className="text-center text-xl mb-4">ランキングに登録しよう</p>
        <p className="text-center text-5xl font-bold text-red-500 mb-6">{score} 点</p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={10}
            placeholder="名前を入力 (空欄の場合は「ユーザー」)"
            className="w-full px-4 py-2 text-xl border-2 border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-3 bg-gradient-to-b from-green-500 to-green-600 text-white text-2xl font-bold rounded-full shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            登録する
          </button>
        </form>
      </div>
    </div>
  );
};

export default EnterNameModal;
