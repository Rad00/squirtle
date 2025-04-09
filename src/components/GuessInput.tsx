
import React, { FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Search } from 'lucide-react';

const GuessInput: React.FC = () => {
  const { guessValue, setGuessValue, checkGuess, isGameOver, attempts, maxAttempts } = useGame();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guessValue.trim()) {
      checkGuess();
    }
  };

  return (
    <div className="mt-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Enter your guess..."
            value={guessValue}
            onChange={(e) => setGuessValue(e.target.value)}
            disabled={isGameOver}
            className="flex-1 bg-secondary/50 border-mystery-700 focus:border-mystery-500 text-lg h-12"
          />
          <Button 
            type="submit" 
            disabled={isGameOver || !guessValue.trim()}
            className="bg-accent hover:bg-accent/90 text-accent-foreground h-12 px-6"
          >
            <Search className="mr-2" size={18} />
            Guess
          </Button>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Attempt {attempts} of {maxAttempts}</span>
          <span>Guess the mystery person</span>
        </div>
      </form>
    </div>
  );
};

export default GuessInput;
