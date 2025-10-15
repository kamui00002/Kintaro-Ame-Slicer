import { useState, useEffect, useCallback } from 'react';
import { Difficulty, RankingEntry } from '../types';
import { RANKING_STORAGE_KEY_PREFIX, MAX_RANKING_ENTRIES } from '../constants';

export const useRanking = () => {
  const [rankings, setRankings] = useState<Record<Difficulty, RankingEntry[]>>({
    [Difficulty.Beginner]: [],
    [Difficulty.Intermediate]: [],
    [Difficulty.Advanced]: [],
  });

  useEffect(() => {
    const loadedRankings: Record<Difficulty, RankingEntry[]> = {
      [Difficulty.Beginner]: [],
      [Difficulty.Intermediate]: [],
      [Difficulty.Advanced]: [],
    };
    for (const key in Difficulty) {
        if (isNaN(Number(key))) continue;
        const difficulty = Number(key) as Difficulty;
        try {
            const storedData = localStorage.getItem(`${RANKING_STORAGE_KEY_PREFIX}${difficulty}`);
            if (storedData) {
                loadedRankings[difficulty] = JSON.parse(storedData);
            }
        } catch (error) {
            console.error('Failed to load ranking data:', error);
        }
    }
    setRankings(loadedRankings);
  }, []);

  const addRankingEntry = useCallback((difficulty: Difficulty, name: string, score: number) => {
    const newEntry: RankingEntry = { name, score, date: new Date().toLocaleDateString() };
    const updatedRankings = [...(rankings[difficulty] || []), newEntry];
    
    updatedRankings.sort((a, b) => b.score - a.score);
    
    const finalRankings = updatedRankings.slice(0, MAX_RANKING_ENTRIES);

    try {
        localStorage.setItem(`${RANKING_STORAGE_KEY_PREFIX}${difficulty}`, JSON.stringify(finalRankings));
        setRankings(prev => ({ ...prev, [difficulty]: finalRankings }));
    } catch (error) {
        console.error('Failed to save ranking data:', error);
    }
  }, [rankings]);

  const isHighScore = useCallback((difficulty: Difficulty, score: number) => {
    if (score <= 0) return false;
    const currentRankings = rankings[difficulty] || [];
    if (currentRankings.length < MAX_RANKING_ENTRIES) {
        return true;
    }
    return score > currentRankings[currentRankings.length - 1].score;
  }, [rankings]);

  return { rankings, addRankingEntry, isHighScore };
};
