import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAdminPanel } from './AdminPanelContext';

interface GameContextType {
  currentClue: number;
  attempts: number;
  maxAttempts: number;
  isGameOver: boolean;
  isWinner: boolean;
  revealedClues: string[];
  guessValue: string;
  ranking: string;
  checkGuess: () => void;
  setGuessValue: (value: string) => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentClue, setCurrentClue] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [maxAttempts] = useState(2);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [guessValue, setGuessValue] = useState('');
  const [ranking, setRanking] = useState<string>('');

  const { winners } = useAdminPanel();
  const currentWinner = winners.length > 0 ? winners[winners.length - 1] : null;

  const revealedClues = currentWinner 
    ? currentWinner.clues.slice(0, currentClue + 1)
    : [];

  const calculateRanking = (clueIndex: number): string => {
    switch (clueIndex) {
      case 0:
        return 'Top 1%';
      case 1:
        return 'Top 5%';
      case 2:
        return 'Top 25%';
      case 3:
        return 'Top 50%';
      default:
        return 'Top 90%';
    }
  };

  const checkGuess = () => {
    if (isGameOver || !currentWinner) return;
    
    const normalizedGuess = guessValue.trim().toLowerCase();
    const normalizedAnswer = currentWinner.name.toLowerCase();
    
    if (normalizedGuess === normalizedAnswer) {
      setIsWinner(true);
      setIsGameOver(true);
      setRanking(calculateRanking(currentClue));
    } else {
      if (attempts >= maxAttempts) {
        if (currentClue >= (currentWinner.clues.length - 1)) {
          setIsGameOver(true);
        } else {
          setCurrentClue(currentClue + 1);
          setAttempts(1);
        }
      } else {
        setAttempts(attempts + 1);
      }
    }
    
    setGuessValue('');
  };

  const resetGame = () => {
    setCurrentClue(0);
    setAttempts(1);
    setIsGameOver(false);
    setIsWinner(false);
    setGuessValue('');
  };

  return (
    <GameContext.Provider
      value={{
        currentClue,
        attempts,
        maxAttempts,
        isGameOver,
        isWinner,
        revealedClues,
        guessValue,
        ranking,
        checkGuess,
        setGuessValue,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
