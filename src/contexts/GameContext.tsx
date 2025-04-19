
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAdminPanel } from './AdminPanelContext';

interface GameContextType {
  currentClue: number;
  attempts: number;
  maxAttempts: number;
  isGameOver: boolean;
  isWinner: boolean;
  revealedClues: string[];
  guessValue: string;
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
  
  // Get the latest winner from AdminPanelContext
  const { winners } = useAdminPanel();
  const currentWinner = winners.length > 0 ? winners[winners.length - 1] : null;
  
  // Get currently revealed clues from the current winner
  const revealedClues = currentWinner 
    ? currentWinner.clues.slice(0, currentClue + 1)
    : [];

  const checkGuess = () => {
    if (isGameOver || !currentWinner) {
      toast({
        title: "No Game Available",
        description: "Please add a mystery person in the Admin Panel first.",
        variant: "destructive",
      });
      return;
    }
    
    // Normalize guesses for case-insensitive comparison
    const normalizedGuess = guessValue.trim().toLowerCase();
    const normalizedAnswer = currentWinner.name.toLowerCase();
    
    if (normalizedGuess === normalizedAnswer) {
      // Correct guess!
      setIsWinner(true);
      setIsGameOver(true);
      toast({
        title: "Correct!",
        description: "Congratulations! You've guessed correctly!",
        variant: "default",
      });
    } else {
      // Wrong guess
      if (attempts >= maxAttempts) {
        // Used all attempts for this clue
        if (currentClue >= (currentWinner.clues.length - 1)) {
          // No more clues, game over
          setIsGameOver(true);
          toast({
            title: "Game Over!",
            description: `The correct answer was ${currentWinner.name}.`,
            variant: "destructive",
          });
        } else {
          // Reveal next clue
          setCurrentClue(currentClue + 1);
          setAttempts(1);
          toast({
            title: "New Clue Revealed!",
            description: "You've used all attempts. A new clue has been revealed.",
          });
        }
      } else {
        // Still have attempts left for this clue
        setAttempts(attempts + 1);
        toast({
          title: "Incorrect",
          description: `That's not right. Try again! (${attempts}/${maxAttempts})`,
          variant: "destructive",
        });
      }
    }
    
    // Clear the input field
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
