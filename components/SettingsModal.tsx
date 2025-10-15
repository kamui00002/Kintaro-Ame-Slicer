
import React from 'react';
import type { SoundSettings } from '../types';
import { SoundOnIcon } from './icons/SoundOnIcon';
import { SoundOffIcon } from './icons/SoundOffIcon';

interface SettingsModalProps {
  settings: SoundSettings;
  onSettingsChange: (settings: SoundSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onSettingsChange, onClose }) => {
  const handleBGMChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, bgmVolume: parseFloat(e.target.value) });
  };

  const handleSFXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({ ...settings, sfxVolume: parseFloat(e.target.value) });
  };

  const toggleMute = () => {
    onSettingsChange({ ...settings, isMuted: !settings.isMuted });
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" 
      onClick={onClose}
    >
      <div 
        className="bg-amber-50 rounded-lg shadow-2xl p-8 w-11/12 max-w-md text-amber-800"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-3xl font-bold text-center mb-6">設定</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xl">BGM</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.bgmVolume}
              onChange={handleBGMChange}
              disabled={settings.isMuted}
              className="w-1/2"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xl">効果音</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.sfxVolume}
              onChange={handleSFXChange}
              disabled={settings.isMuted}
              className="w-1/2"
            />
          </div>
          <div className="flex items-center justify-center">
            <button onClick={toggleMute} className="p-2 rounded-full bg-amber-200">
              {settings.isMuted ? <SoundOffIcon className="w-8 h-8"/> : <SoundOnIcon className="w-8 h-8"/>}
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-red-500 text-white text-xl font-bold rounded-full shadow-md hover:bg-red-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
