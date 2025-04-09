
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

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

// The mystery person to guess - change this for a new winning person
const MYSTERY_PERSON = "Lana Rhoades";

// All clues in order of reveal - change these clues for a new person
const ALL_CLUES = [
  "Gender: Female",
  "Country of birth: Slovenia",
  "Age: 28",
  "PH rank: 4",
  "PH video views: 2.5 Billion"
];

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentClue, setCurrentClue] = useState(0);
  const [attempts, setAttempts] = useState(1);
  const [maxAttempts] = useState(3);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [guessValue, setGuessValue] = useState('');
  
  // Get currently revealed clues
  const revealedClues = ALL_CLUES.slice(0, currentClue + 1);

  const checkGuess = () => {
    if (isGameOver) return;
    
    // Normalize guesses for case-insensitive comparison
    const normalizedGuess = guessValue.trim().toLowerCase();
    const normalizedAnswer = MYSTERY_PERSON.toLowerCase();
    
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
        if (currentClue >= ALL_CLUES.length - 1) {
          // No more clues, game over
          setIsGameOver(true);
          toast({
            title: "Game Over!",
            description: `The correct answer was ${MYSTERY_PERSON}.`,
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
