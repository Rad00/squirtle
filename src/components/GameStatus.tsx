
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { useAdminPanel } from '@/contexts/AdminPanelContext';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw, Trophy } from 'lucide-react';

const GameStatus: React.FC = () => {
  const { isGameOver, isWinner, resetGame, ranking } = useGame();
  const { winners } = useAdminPanel();
  const currentWinner = winners.length > 0 ? winners[winners.length - 1] : null;

  if (!isGameOver || !currentWinner) return null;

  return (
    <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-lg animate-fade-in">
      <div className="flex flex-col items-center">
        {isWinner ? (
          <>
            <div className="text-clue-500 text-5xl mb-2">
              <Trophy className="w-12 h-12 animate-pulse-soft" />
            </div>
            <h2 className="text-2xl font-bold text-clue-500 mb-2">Congratulations!</h2>
            <p className="text-center mb-2">
              You successfully guessed the mystery person!
            </p>
            <p className="text-lg font-semibold text-mystery-500 mb-6">
              You're in the {ranking}!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-destructive mb-2">Game Over</h2>
            <p className="text-center mb-6">
              The mystery person was <span className="font-bold text-clue-400">{currentWinner.name}</span>.
            </p>
          </>
        )}
        <Button 
          onClick={resetGame} 
          className="bg-mystery-600 hover:bg-mystery-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Play Again
        </Button>
      </div>
    </div>
  );
};

export default GameStatus;
