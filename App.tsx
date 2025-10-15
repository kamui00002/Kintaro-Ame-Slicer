import React, { useState, useCallback } from 'react';
import TitleScreen from './components/TitleScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import SettingsModal from './components/SettingsModal';
import RankingScreen from './components/RankingScreen';
import CandySelectionScreen from './components/CandySelectionScreen';
import MiniGameScreen from './components/MiniGameScreen';
import EnterNameModal from './components/EnterNameModal';
import MiniGameDifficultyModal from './components/MiniGameDifficultyModal';
import { SettingsIcon } from './components/icons/SettingsIcon';
import { HomeIcon } from './components/icons/HomeIcon';
import { Screen, SoundSettings, Difficulty } from './types';
import { INITIAL_SOUND_SETTINGS, CANDY_SETS } from './constants';
import { useRanking } from './hooks/useRanking';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Title);
  const [lastScore, setLastScore] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(INITIAL_SOUND_SETTINGS);
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Beginner);
  const [candySetIndex, setCandySetIndex] = useState(0);

  const { rankings, addRankingEntry, isHighScore } = useRanking();
  const [showEnterNameModal, setShowEnterNameModal] = useState(false);
  const [showMiniGameDifficultyModal, setShowMiniGameDifficultyModal] = useState(false);


  const handleSelectDifficulty = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentScreen(Screen.Game);
  }, []);

  const handleGoToMiniGame = useCallback(() => {
    setShowMiniGameDifficultyModal(true);
  }, []);
  
  const handleStartMiniGame = useCallback((selectedDifficulty: Difficulty) => {
    setDifficulty(selectedDifficulty);
    setShowMiniGameDifficultyModal(false);
    setCurrentScreen(Screen.MiniGame);
  }, []);

  const restartGame = useCallback(() => {
    setCurrentScreen(Screen.Game);
  }, []);

  const goToTitle = useCallback(() => {
    setCurrentScreen(Screen.Title);
  }, []);

  const goToRanking = useCallback(() => {
    setCurrentScreen(Screen.Ranking);
  }, []);

  const goToCandySelection = useCallback(() => {
    setCurrentScreen(Screen.CandySelection);
  }, []);

  const handleGameOver = useCallback((finalScore: number) => {
    setLastScore(finalScore);
    if (currentScreen !== Screen.MiniGame && isHighScore(difficulty, finalScore)) {
        setShowEnterNameModal(true);
    }
    setCurrentScreen(Screen.Result);
  }, [difficulty, isHighScore, currentScreen]);

  const handleSaveScore = (name: string) => {
    addRankingEntry(difficulty, name, lastScore);
    setShowEnterNameModal(false);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Title:
        return <TitleScreen 
                  onSelectDifficulty={handleSelectDifficulty}
                  onGoToRanking={goToRanking}
                  onGoToCandySelection={goToCandySelection}
                  onGoToMiniGame={handleGoToMiniGame}
                />;
      case Screen.Game:
        return <GameScreen 
                  soundSettings={soundSettings} 
                  onGameOver={handleGameOver} 
                  difficulty={difficulty}
                  candyPatterns={CANDY_SETS[candySetIndex].patterns}
                />;
      case Screen.MiniGame:
        return <MiniGameScreen
                  soundSettings={soundSettings}
                  onGameOver={handleGameOver}
                  candyPatterns={CANDY_SETS[candySetIndex].patterns}
                  difficulty={difficulty}
                />;
      case Screen.Result:
        return <ResultScreen 
                  score={lastScore} 
                  onRestart={restartGame} 
                  onGoToTitle={goToTitle}
                  onGoToRanking={goToRanking}
                  showRestart={currentScreen !== Screen.MiniGame}
                />;
      case Screen.Ranking:
        return <RankingScreen rankings={rankings} onGoToTitle={goToTitle} />;
      case Screen.CandySelection:
        return <CandySelectionScreen
                  onSelect={setCandySetIndex}
                  onGoToTitle={goToTitle}
                  currentSetIndex={candySetIndex}
                />;
      default:
        return <TitleScreen onSelectDifficulty={handleSelectDifficulty} onGoToRanking={goToRanking} onGoToCandySelection={goToCandySelection} onGoToMiniGame={handleGoToMiniGame} />;
    }
  };

  return (
    <div className="relative w-screen h-screen bg-gradient-to-br from-orange-200 via-rose-100 to-amber-200 overflow-hidden select-none">
      <div 
        className="absolute inset-0 bg-repeat" 
        style={{ 
          backgroundImage: 'url(https://www.transparenttextures.com/patterns/asanoha-400px.png)',
          opacity: 0.05,
        }}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        {renderScreen()}
      </div>

      {(currentScreen === Screen.Game || currentScreen === Screen.MiniGame) && (
        <button
          onClick={goToTitle}
          className="absolute top-4 left-4 text-amber-700 hover:text-amber-900 transition-colors z-50 p-2 bg-white/50 rounded-full"
          aria-label="タイトルに戻る"
        >
          <HomeIcon className="w-8 h-8" />
        </button>
      )}

      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 text-amber-700 hover:text-amber-900 transition-colors z-50 p-2 bg-white/50 rounded-full"
        aria-label="Settings"
      >
        <SettingsIcon className="w-8 h-8" />
      </button>

      {isSettingsOpen && (
        <SettingsModal
          settings={soundSettings}
          onSettingsChange={setSoundSettings}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {showEnterNameModal && (
        <EnterNameModal
          score={lastScore}
          onClose={() => setShowEnterNameModal(false)}
          onSubmit={handleSaveScore}
        />
      )}

      {showMiniGameDifficultyModal && (
        <MiniGameDifficultyModal
          onSelect={handleStartMiniGame}
          onClose={() => setShowMiniGameDifficultyModal(false)}
        />
      )}
    </div>
  );
};

export default App;
